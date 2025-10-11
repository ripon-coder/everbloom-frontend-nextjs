"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import ProductGrid from "@/components/ProductGrid";
import CategoryShop from "@/components/CategoryShop";
import BrandShop from "@/components/BrandShop";
import AttributeShop from "@/components/AttributeShop";
import { Product } from "@/components/ProductGrid";

interface Brand {
  id: number;
  slug: string;
  name: string;
}

interface Category {
  id: number;
  parent_id: number | null;
  name: string;
  slug: string;
  parent?: Category;
  children: Category[];
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
  const router = useRouter();
  const searchParams = useSearchParams();
  // Products
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const [isFetchingNextPage, setIsFetchingNextPage] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  // Filters
  const [brands, setBrands] = useState<Brand[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [attributes, setAttributes] = useState<Attribute[]>([]);
  const [isLoadingFilters, setIsLoadingFilters] = useState(true);

  // Selected filters
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
  const [CategorySlug, setCategorySlug] = useState<string | null>(null);
  const [maxPrice, setMaxPrice] = useState<number>(2000);
  const [selectedAttributes, setSelectedAttributes] = useState<
    Record<string, string | null>
  >({});

  // Set category slug from URL on mount
  useEffect(() => {
    const categoryFromUrl = searchParams.get("category");
    if (categoryFromUrl) {
      setCategorySlug(categoryFromUrl);
    }
  }, [searchParams]);

  const fetchProducts = useCallback(
    async (page = 1, append = false) => {
      if (page === 1) setIsLoadingProducts(true);
      else setIsFetchingNextPage(true);

      try {
        const params = new URLSearchParams({
          current_page: page.toString(),
          per_page: "8",
        });

        if (selectedBrand) params.append("brand_id", selectedBrand);
        if (CategorySlug) params.append("category", CategorySlug);

        Object.entries(selectedAttributes).forEach(([key, value]) => {
          if (value) params.append(key.toLowerCase(), value);
        });

        if (maxPrice < 2000) params.append("max_price", maxPrice.toString());

        router.push(`?${params.toString()}`, { scroll: false });

        const response = await fetch(`/api/products?${params.toString()}`);
        if (!response.ok)
          throw new Error(`HTTP error! status: ${response.status}`);

        const responseData = await response.json();
        const newProducts: Product[] = responseData.data.products;
        const pagination = responseData.data.pagination;

        setProducts((prev) =>
          append
            ? [
                ...prev,
                ...newProducts.filter(
                  (p) => !prev.some((ep) => ep.id === p.id)
                ),
              ]
            : newProducts
        );
        setCurrentPage(Number(pagination.current_page));
        setTotalPages(Number(pagination.last_page));
      } catch (error) {
        console.error("Failed to fetch products:", error);
        if (!append) setProducts([]);
      } finally {
        setIsLoadingProducts(false);
        setIsFetchingNextPage(false);
      }
    },
    [selectedBrand, CategorySlug, maxPrice, selectedAttributes, router]
  );

  // Fetch filters on mount
  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const response = await fetch(
          `/api/shop-filter?category=${CategorySlug || ""}`
        );
        if (!response.ok)
          throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        const apiData = data.data || data;

        setCategories(apiData.categories || []);
        setBrands(apiData.brands || []);
      } catch (error) {
        console.error("Failed to fetch filters:", error);
      } finally {
        setIsLoadingFilters(false);
      }
    };

    fetchFilters();
  }, []);

  // Attributes fetching is commented out for now
  useEffect(() => {
    const fetchAttribute = async () => {
      try {
        const params = new URLSearchParams({
          category: CategorySlug || "",
        });
        const response = await fetch(
          "/api/shop-attribute" + "?" + params.toString()
        );
        if (!response.ok)
          throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        const apiData = data.data || data;
        setAttributes(apiData.attributes || []);
      } catch (error) {
        console.error("Failed to fetch filters:", error);
      } finally {
        setIsLoadingFilters(false);
      }
    };
    fetchAttribute();
  }, [CategorySlug]);

  // Fetch products on filter change
  useEffect(() => {
    fetchProducts(1, false);
  }, [fetchProducts]);

  const handleLoadMore = () => {
    if (currentPage < totalPages && !isFetchingNextPage) {
      fetchProducts(currentPage + 1, true);
    }
  };

  const resetFilters = () => {
    setSelectedAttributes({});
    setSelectedBrand(null);
    setCategorySlug(null);
    setMaxPrice(2000);
    fetchProducts(1, false);
  };

  return (
    <div className="p-4 bg-gray-50 min-h-screen">
      <div className="w-full mx-auto grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Filters */}
        <div className="bg-white rounded-xl shadow-md p-4 space-y-6">
          <h2 className="text-lg font-semibold">Filter Products</h2>

          <AttributeShop
            attributes={attributes}
            selectedAttributes={selectedAttributes}
            onAttributeSelect={(attr, val) =>
              setSelectedAttributes((prev) => ({
                ...prev,
                [attr]: prev[attr] === val ? null : val,
              }))
            }
            isLoading={isLoadingFilters}
          />

          <div>
            <h3 className="font-medium mb-2">Categories</h3>
            {isLoadingFilters ? (
              <p>Loading categories...</p>
            ) : (
              <CategoryShop
                categories={isLoadingFilters ? [] : categories}
                setCategorySlug={setCategorySlug}
                selectedCategorySlug={CategorySlug}
              />
            )}
          </div>

          <div>
            <h3 className="font-medium mb-2">Brands</h3>
            {isLoadingFilters ? (
              <p>Loading brands...</p>
            ) : (
              <BrandShop
                brands={isLoadingFilters ? [] : brands}
                selectedBrand={selectedBrand}
                onBrandSelect={(brandId) =>
                  setSelectedBrand((prev) =>
                    prev === brandId ? null : brandId
                  )
                }
              />
            )}
          </div>

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

          <button
            onClick={resetFilters}
            className="w-full bg-orange-500 text-white py-2 rounded-md hover:bg-orange-600 transition"
          >
            Reset Filters
          </button>
        </div>

        {/* Products */}
        <div className="md:col-span-3">
          <ProductGrid
            products={products}
            isLoading={isLoadingProducts && products.length === 0}
          />
          {currentPage < totalPages && (
            <div className="flex justify-center mt-6">
              <button
                onClick={handleLoadMore}
                disabled={isFetchingNextPage}
                className="px-6 py-2 bg-orange-500 text-white font-medium rounded-md hover:bg-orange-600 disabled:bg-orange-300 transition flex items-center justify-center"
              >
                {isFetchingNextPage && (
                  <svg
                    className="animate-spin mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      className="opacity-25"
                    ></circle>
                    <path
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      className="opacity-75"
                    ></path>
                  </svg>
                )}
                {isFetchingNextPage ? "Loading..." : "Load More"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
