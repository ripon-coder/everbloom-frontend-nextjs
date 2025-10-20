"use client";

import { useState, useEffect, useCallback } from "react";
import Head from "next/head";
import { useRouter, useSearchParams } from "next/navigation";
import ProductGrid, { Product } from "@/components/ProductGrid";
import CategoryShop from "@/components/CategoryShop";
import BrandShop from "@/components/BrandShop";
import AttributeShop from "@/components/AttributeShop";

export default function ShopPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [products, setProducts] = useState<Product[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const [isFetchingNextPage, setIsFetchingNextPage] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [attributes, setAttributes] = useState([]);
  const [isLoadingFilters, setIsLoadingFilters] = useState(true);

  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
  const [categorySlug, setCategorySlug] = useState<string | null>(null);
  const [minPrice, setMinPrice] = useState<number | "">("");
  const [maxPrice, setMaxPrice] = useState<number | "">("");
  const [selectedAttributes, setSelectedAttributes] = useState<Record<string, string | null>>({});

  const [tempBrand, setTempBrand] = useState<string | null>(null);
  const [tempCategory, setTempCategory] = useState<string | null>(null);
  const [tempAttributes, setTempAttributes] = useState<Record<string, string | null>>({});
  const [tempMinPrice, setTempMinPrice] = useState<number | "">("");
  const [tempMaxPrice, setTempMaxPrice] = useState<number | "">("");

  // --- Fetch Products ---
  const fetchProductsWithParams = useCallback(
    async ({
      selectedAttributes,
      selectedBrand,
      categorySlug,
      minPrice,
      maxPrice,
      page = 1,
      append = false,
      updateUrl = true,
    }: {
      selectedAttributes: Record<string, string | null>;
      selectedBrand: string | null;
      categorySlug: string | null;
      minPrice: number | "";
      maxPrice: number | "";
      page?: number;
      append?: boolean;
      updateUrl?: boolean;
    }) => {
      setIsLoadingProducts(page === 1);
      setIsFetchingNextPage(page > 1);

      if (!append && page === 1) setProducts([]);

      try {
        const params = new URLSearchParams();
        if (selectedBrand) params.set("brand", selectedBrand);
        if (categorySlug) params.set("category", categorySlug);
        Object.entries(selectedAttributes).forEach(([key, value]) => {
          if (value) params.set(key.toLowerCase(), value);
        });
        if (minPrice !== "") params.set("min_price", minPrice.toString());
        if (maxPrice !== "") params.set("max_price", maxPrice.toString());
        params.set("current_page", page.toString());
        params.set("per_page", "8");

        if (updateUrl) {
          const urlParams = new URLSearchParams(params);
          urlParams.delete("current_page");
          urlParams.delete("per_page");
          router.push(`?${urlParams.toString()}`, { scroll: false });
        }

        const response = await fetch(`/api/products?${params.toString()}`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        const newProducts: Product[] = data.data.products;
        const pagination = data.data.pagination;

        setProducts((prev) =>
          append
            ? [...prev, ...newProducts.filter((p) => !prev.some((ep) => ep.id === p.id))]
            : newProducts
        );
        setCurrentPage(Number(pagination.current_page));
        setTotalPages(Number(pagination.last_page));
      } catch (err) {
        console.error("Failed to fetch products:", err);
        if (!append) setProducts([]);
      } finally {
        setIsLoadingProducts(false);
        setIsFetchingNextPage(false);
      }
    },
    [router]
  );

  const fetchProducts = (page = 1, append = false, updateUrl = true) => {
    fetchProductsWithParams({
      selectedAttributes,
      selectedBrand,
      categorySlug,
      minPrice,
      maxPrice,
      page,
      append,
      updateUrl,
    });
  };

  // --- Fetch Categories & Brands ---
  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const response = await fetch(`/api/shop-category-brand?category=${categorySlug || ""}`);
        const data = await response.json();
        const apiData = data.data || data;
        setCategories(apiData.categories || []);
        setBrands(apiData.brands || []);
      } catch (err) {
        console.error("Failed to fetch filters:", err);
      } finally {
        setIsLoadingFilters(false);
      }
    };
    fetchFilters();
  }, [categorySlug]);

  // --- Fetch Attributes ---
  useEffect(() => {
    const fetchAttribute = async () => {
      try {
        const params = new URLSearchParams({ category: categorySlug || "" });
        const response = await fetch("/api/shop-attribute?" + params.toString());
        const data = await response.json();
        const apiData = data.data || data;
        setAttributes(apiData.attributes || []);
      } catch (err) {
        console.error("Failed to fetch attributes:", err);
      } finally {
        setIsLoadingFilters(false);
      }
    };
    fetchAttribute();
  }, [categorySlug]);

  // --- Read filters from URL ---
  useEffect(() => {
    const categoryFromUrl = searchParams.get("category");
    const brandFromUrl = searchParams.get("brand");
    const minP = searchParams.get("min_price");
    const maxP = searchParams.get("max_price");

    const newAttrs: Record<string, string> = {};
    searchParams.forEach((value, key) => {
      if (!["category","brand","min_price","max_price","current_page","per_page"].includes(key))
        newAttrs[key] = value;
    });

    setCategorySlug(categoryFromUrl);
    setSelectedBrand(brandFromUrl);
    setMinPrice(minP ? Number(minP) : "");
    setMaxPrice(maxP ? Number(maxP) : "");
    setSelectedAttributes(newAttrs);

    setTempCategory(categoryFromUrl);
    setTempBrand(brandFromUrl);
    setTempMinPrice(minP ? Number(minP) : "");
    setTempMaxPrice(maxP ? Number(maxP) : "");
    setTempAttributes(newAttrs);

    fetchProductsWithParams({
      selectedAttributes: newAttrs,
      selectedBrand: brandFromUrl,
      categorySlug: categoryFromUrl,
      minPrice: minP ? Number(minP) : "",
      maxPrice: maxP ? Number(maxP) : "",
      page: 1,
      append: false,
      updateUrl: false,
    });
  }, [searchParams, fetchProductsWithParams]);

  const handleFilterApply = () => {
    setSelectedBrand(tempBrand);
    setCategorySlug(tempCategory);
    setSelectedAttributes(tempAttributes);
    setMinPrice(tempMinPrice);
    setMaxPrice(tempMaxPrice);

    fetchProductsWithParams({
      selectedAttributes: tempAttributes,
      selectedBrand: tempBrand,
      categorySlug: tempCategory,
      minPrice: tempMinPrice,
      maxPrice: tempMaxPrice,
      page: 1,
      append: false,
      updateUrl: true,
    });
    setMobileFilterOpen(false);
  };

  const handleLoadMore = () => {
    if (currentPage < totalPages && !isFetchingNextPage) {
      fetchProducts(currentPage + 1, true, false);
    }
  };

  const resetFilters = () => {
    setTempBrand(null);
    setTempCategory(null);
    setTempAttributes({});
    setTempMinPrice("");
    setTempMaxPrice("");

    setSelectedBrand(null);
    setCategorySlug(null);
    setSelectedAttributes({});
    setMinPrice("");
    setMaxPrice("");

    fetchProductsWithParams({
      selectedAttributes: {},
      selectedBrand: null,
      categorySlug: null,
      minPrice: "",
      maxPrice: "",
      page: 1,
      append: false,
      updateUrl: true,
    });
    setMobileFilterOpen(false);
  };

  // --- Dynamic meta title & description based on filters ---
  const metaTitle = categorySlug
    ? `${categorySlug} Products - Your Store`
    : "Shop Products - Your Store";

  const metaDescription = categorySlug || selectedBrand
    ? `Browse ${categorySlug || ""} ${selectedBrand || ""} products. Filter by attributes, price, and more to find your perfect product.`
    : "Browse all products in our store. Filter by category, brand, attributes, or price range to find the perfect product.";

  return (
    <>
      <Head>
        <title>{metaTitle}</title>
        <meta name="description" content={metaDescription} />
      </Head>

      <div className="p-4 bg-gray-50 min-h-screen">
        {/* Mobile Filter Button */}
        <div className="md:hidden flex justify-end mb-4">
          <button
            onClick={() => setMobileFilterOpen(true)}
            className="px-4 py-2 bg-green-600 text-white rounded-md"
          >
            Filter
          </button>
        </div>

        <div className="w-full mx-auto grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Desktop Filters */}
          <div className="hidden md:block bg-white rounded-xl shadow-md p-4 space-y-6">
            <h2 className="text-lg font-semibold">Filter Products</h2>

            <AttributeShop
              attributes={attributes}
              selectedAttributes={tempAttributes}
              onAttributeSelect={(attr, val) =>
                setTempAttributes((prev) => ({ ...prev, [attr]: prev[attr] === val ? null : val }))
              }
              isLoading={isLoadingFilters}
            />

            <div>
              <h3 className="font-medium mb-2 text-gray-700">Categories</h3>
              <CategoryShop categories={categories} setCategorySlug={setTempCategory} selectedCategorySlug={tempCategory} />
            </div>

            <div>
              <h3 className="font-medium mb-2 text-gray-700">Brands</h3>
              <BrandShop brands={brands} selectedBrand={tempBrand} onBrandSelect={(brandSlug) => setTempBrand(prev => prev === brandSlug ? null : brandSlug)} />
            </div>

            <div className="pt-4">
              <h3 className="font-medium mb-2">Price Range (৳)</h3>
              <div className="flex items-center gap-3">
                <input type="number" min={0} value={tempMinPrice} onChange={(e) => setTempMinPrice(e.target.value === "" ? "" : Number(e.target.value))} className="w-full border rounded-md px-2 py-1" placeholder="Min"/>
                <span>-</span>
                <input type="number" min={0} value={tempMaxPrice} onChange={(e) => setTempMaxPrice(e.target.value === "" ? "" : Number(e.target.value))} className="w-full border rounded-md px-2 py-1" placeholder="Max"/>
              </div>
            </div>

            <div className="flex gap-2 mt-4">
              <button onClick={handleFilterApply} className="w-full bg-green-600 text-white text-sm py-1.5 rounded-md hover:bg-green-700 transition cursor-pointer">Apply Filters</button>
              <button onClick={resetFilters} className="w-full bg-orange-500 text-white text-sm py-1.5 rounded-md hover:bg-orange-600 transition cursor-pointer">Reset</button>
            </div>
          </div>

          {/* Products */}
          <div className="md:col-span-3">
            <ProductGrid products={products} isLoading={isLoadingProducts} />
            {currentPage < totalPages && (
              <div className="flex justify-center mt-6">
                <button
                  onClick={handleLoadMore}
                  disabled={isFetchingNextPage}
                  className="px-6 py-2 bg-orange-500 text-white font-medium rounded-md hover:bg-orange-600 disabled:bg-orange-300 transition flex items-center justify-center"
                >
                  {isFetchingNextPage ? "Loading..." : "Load More"}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Filter Drawer */}
        {mobileFilterOpen && (
          <div className="fixed inset-0 z-50 flex">
            <div className="bg-white w-2/3 sm:w-1/2 p-4 overflow-y-auto shadow-lg z-50">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Filter Products</h2>
                <button onClick={() => setMobileFilterOpen(false)} className="text-gray-600 font-bold">X</button>
              </div>

              <AttributeShop
                attributes={attributes}
                selectedAttributes={tempAttributes}
                onAttributeSelect={(attr, val) =>
                  setTempAttributes((prev) => ({ ...prev, [attr]: prev[attr] === val ? null : val }))
                }
                isLoading={isLoadingFilters}
              />

              <div className="mt-4">
                <h3 className="font-medium mb-2 text-gray-700">Categories</h3>
                <CategoryShop categories={categories} setCategorySlug={setTempCategory} selectedCategorySlug={tempCategory} />
              </div>

              <div className="mt-4">
                <h3 className="font-medium mb-2 text-gray-700">Brands</h3>
                <BrandShop brands={brands} selectedBrand={tempBrand} onBrandSelect={(brandSlug) => setTempBrand(prev => prev === brandSlug ? null : brandSlug)} />
              </div>

              <div className="pt-4">
                <h3 className="font-medium mb-2">Price Range (৳)</h3>
                <div className="flex items-center gap-3">
                  <input type="number" min={0} value={tempMinPrice} onChange={(e) => setTempMinPrice(e.target.value === "" ? "" : Number(e.target.value))} className="w-full border rounded-md px-2 py-1" placeholder="Min"/>
                  <span>-</span>
                  <input type="number" min={0} value={tempMaxPrice} onChange={(e) => setTempMaxPrice(e.target.value === "" ? "" : Number(e.target.value))} className="w-full border rounded-md px-2 py-1" placeholder="Max"/>
                </div>
              </div>

              <div className="flex gap-2 mt-4">
                <button onClick={handleFilterApply} className="w-full bg-green-600 text-white text-sm py-1.5 rounded-md hover:bg-green-700 transition cursor-pointer">Apply Filters</button>
                <button onClick={resetFilters} className="w-full bg-orange-500 text-white text-sm py-1.5 rounded-md hover:bg-orange-600 transition cursor-pointer">Reset</button>
              </div>
            </div>

            <div className="flex-1" onClick={() => setMobileFilterOpen(false)}></div>
          </div>
        )}
      </div>
    </>
  );
}
