"use client";

import { useState, useEffect } from "react";
import ProductGrid from "@/components/ProductGrid"; // Your product component
import CategoryShop from "@/components/CategoryShop"; // New CategoryShop component
import BrandShop from "@/components/BrandShop"; // New BrandShop component
import { Product } from "@/components/ProductGrid"; // Import Product interface

export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>([]); // Stores all fetched products
  const [isLoadingProducts, setIsLoadingProducts] = useState(true); // For initial load
  const [isFetchingNextPage, setIsFetchingNextPage] = useState(false); // For load more action
  const [currentPage, setCurrentPage] = useState(1); // API page
  const [totalPages, setTotalPages] = useState(0);

  // Filter states for UI only (not used for filtering products)
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
  const [maxPrice, setMaxPrice] = useState<number>(2000);
  const [expandedCategories, setExpandedCategories] = useState<number[]>([]);

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
      // We specify per_page as 8 to control how many products are fetched per API call.
      const params = new URLSearchParams({
        current_page: page.toString(),
        per_page: "8", // Fetch 8 products per page from the API
      });
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

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleLoadMore = () => {
    // If there is a next page on the API, fetch more.
    if (currentPage < totalPages) {
      fetchProducts(currentPage + 1, true);
    }
  };

  // Toggle expand/collapse categories for UI
  const toggleCategory = (id: number) => {
    setExpandedCategories((prev) =>
      prev.includes(id) ? prev.filter((cid) => cid !== id) : [...prev, id]
    );
  };

  // Reset filters for UI
  const resetFilters = () => {
    setSelectedColor(null);
    setSelectedType(null);
    setSelectedBrand(null);
    setMaxPrice(2000);
    setExpandedCategories([]);
    // Refetch products from page 1 when filters are reset
    fetchProducts(1, false);
  };

  return (
    <div className="p-4 bg-gray-50 min-h-screen">
      <div className="w-full mx-auto grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Filters */}
        <div className="bg-white rounded-xl shadow-md p-4 space-y-6">
          <h2 className="text-lg font-semibold">Filter Products</h2>

          {/* Color Filter */}
          <div>
            <h3 className="font-medium mb-2">Color</h3>
            <div className="flex gap-2 flex-wrap">
              {["Black", "White", "Red"].map((color) => (
                <button
                  key={color}
                  onClick={() =>
                    setSelectedColor(selectedColor === color ? null : color)
                  }
                  className={`px-3 py-1 border rounded-md text-sm ${
                    selectedColor === color
                      ? "bg-orange-50 border-orange-500 text-orange-600"
                      : "hover:bg-gray-100"
                  }`}
                >
                  {color}
                </button>
              ))}
            </div>
          </div>

          {/* Type Filter */}
          <div>
            <h3 className="font-medium mb-2">Type</h3>
            <div className="flex gap-2 flex-wrap">
              {["Wireless", "Wired"].map((type) => (
                <button
                  key={type}
                  onClick={() =>
                    setSelectedType(selectedType === type ? null : type)
                  }
                  className={`px-3 py-1 border rounded-md text-sm ${
                    selectedType === type
                      ? "bg-orange-50 border-orange-500 text-orange-600"
                      : "hover:bg-gray-100"
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Categories Filter */}
          <div>
            <h3 className="font-medium mb-2">Categories</h3>
            <CategoryShop />
          </div>

          {/* Brands Filter */}
          <div>
            <h3 className="font-medium mb-2">Brands</h3>
            <BrandShop />
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
