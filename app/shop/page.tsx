"use client";

import { useState, useEffect } from "react";
import ProductGrid from "@/components/ProductGrid"; // Your product component
import CategoryShop from "@/components/CategoryShop"; // New CategoryShop component
import BrandShop from "@/components/BrandShop"; // New BrandShop component
import { Product } from "@/components/ProductGrid"; // Import Product interface

// Define types for filter data based on API response
interface Brand {
  id: number;
  slug: string;
  name: string;
}

interface Category {
  id: number;
  parent_id: number | null; // Can be null for top-level categories
  name: string;
  slug: string;
  parent?: Category; // Optional parent object
  children: Category[]; // Assuming API can provide children for hierarchical structure
}

interface AttributeValue {
  id: number;
  attribute_id: number;
  value: string;
}

interface Attribute {
  id: number;
  name: string;
  attribute_values: AttributeValue[];
}

export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>([]); // Stores all fetched products
  const [isLoadingProducts, setIsLoadingProducts] = useState(true); // For initial load
  const [isFetchingNextPage, setIsFetchingNextPage] = useState(false); // For load more action
  const [currentPage, setCurrentPage] = useState(1); // API page
  const [totalPages, setTotalPages] = useState(0);

  // Filter states
  const [brands, setBrands] = useState<Brand[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [attributes, setAttributes] = useState<Attribute[]>([]); // For future use
  const [isLoadingFilters, setIsLoadingFilters] = useState(true);

  // Filter states
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null); // Will store brand.id as string
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [maxPrice, setMaxPrice] = useState<number>(2000);
  const [selectedAttributes, setSelectedAttributes] = useState<Record<string, string | null>>({}); // e.g., { color: 'Red', size: 'L' }
  const [expandedCategories, setExpandedCategories] = useState<number[]>([]); // This seems to be for CategoryShop's internal UI, can be removed from here if CategoryShop manages it fully.

  // Fetch products
  const fetchProducts = async (page = 1, append = false) => {
    // For initial load, setIsLoadingProducts is true.
    // For load-more, setIsFetchingNextPage is true.
    if (page === 1) {
      setIsLoadingProducts(true);
    } else {
      setIsFetchingNextPage(true);
    }
    
    try {
      // Call the local API route.
      const params = new URLSearchParams({
        current_page: page.toString(),
        per_page: "8", // Fetch 8 products per page from the API
      });

      // Append filter parameters if they are set
      if (selectedBrand) {
        params.append('brand_id', selectedBrand); // Assuming API expects brand_id
      }
      if (selectedCategoryId) {
        params.append('category_id', selectedCategoryId.toString());
      }
      
      // Append selected attributes
      Object.entries(selectedAttributes).forEach(([key, value]) => {
        if (value) {
          // Use the attribute name (key) as the parameter name
          params.append(key.toLowerCase(), value);
        }
      });

      // Ensure maxPrice is a number before appending
      if (typeof maxPrice === 'number' && maxPrice < 2000) { // Only send if not default
         params.append('max_price', maxPrice.toString());
      }

      const response = await fetch(`/api/products?${params.toString()}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const responseData = await response.json();
      const newProducts: Product[] = responseData.data.products;
      const pagination = responseData.data.pagination;

      if (append) {
        const existingIds = new Set(products.map(p => p.id));
        const uniqueNewProducts = newProducts.filter(p => !existingIds.has(p.id));
        setProducts((prevProducts) => [...prevProducts, ...uniqueNewProducts]);
      } else {
        setProducts(newProducts);
      }
      
      setCurrentPage(Number(pagination.current_page));
      setTotalPages(Number(pagination.last_page));

    } catch (error) {
      console.error("Failed to fetch products:", error);
      setProducts([]);
    } finally {
      setIsLoadingProducts(false);
      setIsFetchingNextPage(false);
    }
  };

  // Fetch products on initial load and when filters change
  useEffect(() => {
    fetchProducts(1, false); // Always fetch from page 1 when filters change
  }, [selectedBrand, selectedCategoryId, selectedAttributes, maxPrice, JSON.stringify(selectedAttributes)]);

  // Helper function to build a category hierarchy from a flat list
  const buildCategoryHierarchy = (flatCategories: Category[]): Category[] => {
    const map = new Map<number, Category>();
    const hierarchy: Category[] = [];

    // First, create a map of all categories by their ID, ensuring children array is initialized
    flatCategories.forEach(category => {
      // Ensure we are working with a copy and children is an empty array
      const categoryCopy = { ...category, children: [] };
      map.set(category.id, categoryCopy);
    });

    // Then, build the hierarchy
    map.forEach(category => {
      if (category.parent_id !== null && map.has(category.parent_id)) {
        // If the category has a parent_id and the parent exists in the map, add it to the parent's children
        const parent = map.get(category.parent_id)!;
        parent.children.push(category);
      } else {
        // Otherwise, it's a top-level category (parent_id is null or parent not found)
        hierarchy.push(category);
      }
    });
    
    return hierarchy;
  };

  // Fetch filters (brands, categories, attributes)
  useEffect(() => {
    const fetchFilters = async () => {
      setIsLoadingFilters(true);
      try {
        const params = new URLSearchParams();
        // Note: category_id is no longer sent to the shop-filter API
        const response = await fetch(`/api/shop-filter?${params.toString()}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setBrands(data.brands || []);
        // Transform the flat categories list into a hierarchy
        const flatCategories = data.categories || [];
        
        // Check if the API response is already hierarchical (all items have parent_id: null)
        const isAlreadyHierarchical = flatCategories.length > 0 && flatCategories.every((cat: Category) => cat.parent_id === null);
        
        let hierarchicalCategories;
        if (isAlreadyHierarchical) {
          // If it's already hierarchical, use it directly.
          hierarchicalCategories = flatCategories;
        } else {
          // Otherwise, build the hierarchy.
          hierarchicalCategories = buildCategoryHierarchy(flatCategories);
        }
        
        setCategories(hierarchicalCategories);
        setAttributes(data.attributes || []); // Store attributes if needed later
      } catch (error) {
        console.error("Failed to fetch filters:", error);
      } finally {
        setIsLoadingFilters(false);
      }
    };

    fetchFilters();
  }, []); // Fetch filters only once on initial load

  const handleLoadMore = () => {
    // If there is a next page on the API, fetch more.
    if (currentPage < totalPages) {
      fetchProducts(currentPage + 1, true);
    }
  };

  // Handle category selection from CategoryShop component
  const handleCategorySelect = (categoryId: number) => {
    setSelectedCategoryId(categoryId);
    // Here you would typically trigger a product refetch or filter update
    console.log("Selected Category ID:", categoryId);
    // For example, you might want to reset the page and refetch products:
    // fetchProducts(1, false, { categoryId });
  };

  // Handle brand selection from BrandShop component
  const handleBrandSelect = (brandId: string) => {
    setSelectedBrand(prevBrandId => prevBrandId === brandId ? null : brandId); // Toggle selection
    console.log("Selected Brand ID:", brandId);
  };

  // Reset filters for UI
  const resetFilters = () => {
    setSelectedAttributes({});
    setSelectedBrand(null);
    setSelectedCategoryId(null);
    setMaxPrice(2000);
    // setExpandedCategories([]); // This was for CategoryShop's internal UI, which it now manages itself.
    // Refetch products from page 1 when filters are reset
    fetchProducts(1, false);
  };

  return (
    <div className="p-4 bg-gray-50 min-h-screen">
      <div className="w-full mx-auto grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Filters */}
        <div className="bg-white rounded-xl shadow-md p-4 space-y-6">
          <h2 className="text-lg font-semibold">Filter Products</h2>

          {/* Dynamic Attribute Filters */}
          {!isLoadingFilters && attributes.map((attribute: Attribute) => (
            <div key={attribute.id}>
              <h3 className="font-medium mb-2">{attribute.name}</h3>
              <div className="flex gap-2 flex-wrap">
                {attribute.attribute_values.map((value) => (
                  <button
                    key={value.id}
                    onClick={() => {
                      const attributeName = attribute.name.toLowerCase();
                      setSelectedAttributes(prev => ({
                        ...prev,
                        [attributeName]: prev[attributeName] === value.value ? null : value.value,
                      }));
                    }}
                    className={`px-3 py-1 border rounded-md text-sm ${
                      selectedAttributes[attribute.name.toLowerCase()] === value.value
                        ? "bg-orange-50 border-orange-500 text-orange-600"
                        : "hover:bg-gray-100"
                    }`}
                  >
                    {value.value}
                  </button>
                ))}
              </div>
            </div>
          ))}

          {/* Categories Filter */}
          <div>
            <h3 className="font-medium mb-2">Categories</h3>
            {isLoadingFilters ? (
              <p>Loading categories...</p> // Or use a skeleton component
            ) : (
              <CategoryShop categories={categories} onCategorySelect={handleCategorySelect} selectedCategoryId={selectedCategoryId} />
            )}
          </div>

          {/* Brands Filter */}
          <div>
            <h3 className="font-medium mb-2">Brands</h3>
            {isLoadingFilters ? (
              <p>Loading brands...</p> // Or use a skeleton component
            ) : (
              <BrandShop brands={brands} selectedBrand={selectedBrand} onBrandSelect={handleBrandSelect} />
            )}
          </div>

          {/* Price Filter */}
          <div>
            <h3 className="font-medium mb-2">Max Price: ৳{maxPrice}</h3>
            <input
              type="range"
              min={500}
              max={2000}
              step={50}
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full"
            />
          </div>

          {/* Reset Filters */}
          <button
            onClick={resetFilters}
            className="w-full bg-orange-500 text-white py-2 rounded-md hover:bg-orange-600 transition"
          >
            Reset Filters
          </button>
        </div>

        {/* Products */}
        <div className="md:col-span-3">
          <>
            <ProductGrid products={products} isLoading={isLoadingProducts && products.length === 0} />
            {/* Show Load More if there are more pages to fetch from the API */}
            {currentPage < totalPages && (
              <div className="flex justify-center mt-6 ">
                <button
                  onClick={handleLoadMore}
                  disabled={isFetchingNextPage}
                  className="px-6 py-2 bg-orange-500 text-white font-medium rounded-md hover:bg-orange-600 disabled:bg-orange-300 transition flex items-center justify-center"
                >
                  {isFetchingNextPage && (
                    <svg className="animate-spin mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  )}
                  {isFetchingNextPage ? "Loading..." : "Load More"}
                </button>
              </div>
            )}
          </>
        </div>
      </div>
    </div>
  );
}
