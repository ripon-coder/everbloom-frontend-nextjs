"use client";

import { useState, useEffect, useCallback } from "react";
import Head from "next/head";
import { useRouter, useSearchParams, useParams } from "next/navigation";
import ProductGrid, { Product } from "@/components/ProductGrid";
import CategoryShop from "@/components/CategoryShop";
import BrandShop from "@/components/BrandShop";
import FlashSaleComponent from "@/components/FlashSaleComponent";

export default function ShopPage() {
  const params = useParams();
  const slug = Array.isArray(params.slug) ? params.slug[0] : params.slug || "";
  const router = useRouter();
  const searchParams = useSearchParams();

  const [products, setProducts] = useState<Product[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const [isFetchingNextPage, setIsFetchingNextPage] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const [flashSale, setFlashSale] = useState<any[]>([]);

  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoadingFilters, setIsLoadingFilters] = useState(true);

  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
  const [categorySlug, setCategorySlug] = useState<string | null>(null);
  const [minPrice, setMinPrice] = useState<number | "">("");
  const [maxPrice, setMaxPrice] = useState<number | "">("");
  const [stockIn, setStockIn] = useState<boolean>(false);
  const [priceSort, setPriceSort] = useState<
    "low_to_high" | "high_to_low" | ""
  >("");
  const [freeDelivery, setFreeDelivery] = useState<boolean>(false);

  const [tempBrand, setTempBrand] = useState<string | null>(null);
  const [tempCategory, setTempCategory] = useState<string | null>(null);
  const [tempMinPrice, setTempMinPrice] = useState<number | "">("");
  const [tempMaxPrice, setTempMaxPrice] = useState<number | "">("");
  const [tempStockIn, setTempStockIn] = useState<boolean>(false);
  const [tempPriceSort, setTempPriceSort] = useState<
    "low_to_high" | "high_to_low" | ""
  >("");
  const [tempFreeDelivery, setTempFreeDelivery] = useState<boolean>(false);

  // --- Fetch Products ---
  const fetchProductsWithParams = useCallback(
    async ({
      selectedBrand,
      categorySlug,
      minPrice,
      maxPrice,
      stockIn,
      priceSort,
      freeDelivery,
      page = 1,
      append = false,
      updateUrl = true,
    }: {
      selectedBrand: string | null;
      categorySlug: string | null;
      minPrice: number | "";
      maxPrice: number | "";
      stockIn?: boolean;
      priceSort?: "low_to_high" | "high_to_low" | "";
      freeDelivery?: boolean;
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
        if (minPrice !== "") params.set("min_price", minPrice.toString());
        if (maxPrice !== "") params.set("max_price", maxPrice.toString());
        if (stockIn) params.set("stock_in", "1");
        if (freeDelivery) params.set("free_delivery", "1");
        if (priceSort) params.set("price_sort", priceSort);
        params.set("flash_sale_slug", slug);
        params.set("current_page", page.toString());
        params.set("per_page", "8");

        if (updateUrl) {
          const urlParams = new URLSearchParams(params);
          urlParams.delete("current_page");
          urlParams.delete("per_page");
          urlParams.delete("flash_sale_slug");
          router.push(`?${urlParams.toString()}`, { scroll: false });
        }

        const response = await fetch(`/api/flash-sale?${params.toString()}`);
        if (!response.ok)
          throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        const newProducts: Product[] = data.data.products;
        const pagination = data.data.pagination;
        setFlashSale(data.data.flash_sale);

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
      selectedBrand,
      categorySlug,
      minPrice,
      maxPrice,
      stockIn,
      priceSort,
      freeDelivery,
      page,
      append,
      updateUrl,
    });
  };

  // --- Fetch Categories & Brands ---
  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const response = await fetch(
          `/api/shop-category-brand?category=${categorySlug || ""}`
        );
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

  // --- Read filters from URL ---
  useEffect(() => {
    const categoryFromUrl = searchParams.get("category");
    const brandFromUrl = searchParams.get("brand");
    const minP = searchParams.get("min_price");
    const maxP = searchParams.get("max_price");
    const stock = searchParams.get("stock_in");
    const delivery = searchParams.get("free_delivery");
    const sort = searchParams.get("price_sort") as
      | "low_to_high"
      | "high_to_low"
      | null;

    setCategorySlug(categoryFromUrl);
    setSelectedBrand(brandFromUrl);
    setMinPrice(minP ? Number(minP) : "");
    setMaxPrice(maxP ? Number(maxP) : "");
    setStockIn(stock === "1");
    setFreeDelivery(delivery === "1");
    setPriceSort(sort || "");

    setTempCategory(categoryFromUrl);
    setTempBrand(brandFromUrl);
    setTempMinPrice(minP ? Number(minP) : "");
    setTempMaxPrice(maxP ? Number(maxP) : "");
    setTempStockIn(stock === "1");
    setTempFreeDelivery(delivery === "1");
    setTempPriceSort(sort || "");

    fetchProductsWithParams({
      selectedBrand: brandFromUrl,
      categorySlug: categoryFromUrl,
      minPrice: minP ? Number(minP) : "",
      maxPrice: maxP ? Number(maxP) : "",
      stockIn: stock === "1",
      freeDelivery: delivery === "1",
      priceSort: sort || "",
      page: 1,
      append: false,
      updateUrl: false,
    });
  }, [searchParams, fetchProductsWithParams]);

  const handleFilterApply = () => {
    setSelectedBrand(tempBrand);
    setCategorySlug(tempCategory);
    setMinPrice(tempMinPrice);
    setMaxPrice(tempMaxPrice);
    setStockIn(tempStockIn);
    setPriceSort(tempPriceSort);
    setFreeDelivery(tempFreeDelivery);

    fetchProductsWithParams({
      selectedBrand: tempBrand,
      categorySlug: tempCategory,
      minPrice: tempMinPrice,
      maxPrice: tempMaxPrice,
      stockIn: tempStockIn,
      priceSort: tempPriceSort,
      freeDelivery: tempFreeDelivery,
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
    setTempMinPrice("");
    setTempMaxPrice("");
    setTempStockIn(false);
    setTempPriceSort("");
    setTempFreeDelivery(false);

    setSelectedBrand(null);
    setCategorySlug(null);
    setMinPrice("");
    setMaxPrice("");
    setStockIn(false);
    setPriceSort("");
    setFreeDelivery(false);

    fetchProductsWithParams({
      selectedBrand: null,
      categorySlug: null,
      minPrice: "",
      maxPrice: "",
      stockIn: false,
      priceSort: "",
      freeDelivery: false,
      page: 1,
      append: false,
      updateUrl: true,
    });
    setMobileFilterOpen(false);
  };

  // --- Dynamic meta title & description ---
  const metaTitle = categorySlug
    ? `${categorySlug} Products - Your Store`
    : "Shop Products - Your Store";

  const metaDescription =
    categorySlug || selectedBrand
      ? `Browse ${categorySlug || ""} ${
          selectedBrand || ""
        } products. Filter by price, category, brand, stock, or delivery.`
      : "Browse all products in our store. Filter by category, brand, stock, delivery, or price range to find your perfect product.";

  return (
    <>
      <Head>
        <title>{metaTitle}</title>
        <meta name="description" content={metaDescription} />
      </Head>
          {/* fLASH SALE */}
          <div className="md:col-span-1">
            <FlashSaleComponent slug={slug} flashSale={flashSale} />
          </div>
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

            <div>
              <h3 className="font-medium mb-2 text-gray-700">Categories</h3>
              <CategoryShop
                categories={categories}
                setCategorySlug={setTempCategory}
                selectedCategorySlug={tempCategory}
                isLoading={isLoadingFilters}
              />
            </div>

            <div>
              <h3 className="font-medium mb-2 text-gray-700">Brands</h3>
              <BrandShop
                brands={brands}
                selectedBrand={tempBrand}
                onBrandSelect={(brandSlug) =>
                  setTempBrand((prev) =>
                    prev === brandSlug ? null : brandSlug
                  )
                }
                isLoading={isLoadingFilters}
              />
            </div>

            <div className="pt-1">
              <h3 className="font-medium mb-2">Price Range (৳)</h3>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  min={0}
                  value={tempMinPrice}
                  onChange={(e) =>
                    setTempMinPrice(
                      e.target.value === "" ? "" : Number(e.target.value)
                    )
                  }
                  className="w-full border rounded-md px-2 py-1"
                  placeholder="Min"
                />
                <span>-</span>
                <input
                  type="number"
                  min={0}
                  value={tempMaxPrice}
                  onChange={(e) =>
                    setTempMaxPrice(
                      e.target.value === "" ? "" : Number(e.target.value)
                    )
                  }
                  className="w-full border rounded-md px-2 py-1"
                  placeholder="Max"
                />
              </div>
            </div>

            <div className="pt-1">
              <h3 className="font-medium mb-2">Stock</h3>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={tempStockIn}
                  onChange={(e) => setTempStockIn(e.target.checked)}
                  className="form-checkbox"
                />
                In Stock
              </label>
            </div>

            <div className="pt-1">
              <h3 className="font-medium mb-2">Sort by Price</h3>
              <select
                value={tempPriceSort}
                onChange={(e) =>
                  setTempPriceSort(
                    e.target.value as "low_to_high" | "high_to_low" | ""
                  )
                }
                className="w-full border rounded-md px-2 py-1"
              >
                <option value="">Select</option>
                <option value="low_to_high">Low to High</option>
                <option value="high_to_low">High to Low</option>
              </select>
            </div>

            <div className="pt-1">
              <h3 className="font-medium mb-2">Delivery</h3>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={tempFreeDelivery}
                  onChange={(e) => setTempFreeDelivery(e.target.checked)}
                  className="form-checkbox"
                />
                Free Delivery
              </label>
            </div>

            <div className="flex gap-2 mt-4">
              <button
                onClick={handleFilterApply}
                className="w-full bg-amber-500 text-white text-sm py-1.5 rounded-md hover:bg-amber-600 transition cursor-pointer"
              >
                Apply Filters
              </button>
              <button
                onClick={resetFilters}
                className="w-full bg-red-500 text-white text-sm py-1.5 rounded-md hover:bg-red-600 transition cursor-pointer"
              >
                Reset
              </button>
            </div>
          </div>



          {/* Products */}
          <div className="md:col-span-3">
            {products.length === 0 && !isLoadingProducts ? (
              <div className="text-center py-12">
                <p className="text-xl text-gray-500">No products found</p>
                <p className="text-gray-400 mt-2">
                  Try adjusting your filters or check back later.
                </p>
              </div>
            ) : (
              <ProductGrid products={products} isLoading={isLoadingProducts} />
            )}
            {currentPage < totalPages && !isLoadingProducts && (
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
                <button
                  onClick={() => setMobileFilterOpen(false)}
                  className="text-gray-600 font-bold"
                >
                  X
                </button>
              </div>

              <div className="mt-4">
                <h3 className="font-medium mb-2 text-gray-700">Categories</h3>
                <CategoryShop
                  categories={categories}
                  setCategorySlug={setTempCategory}
                  selectedCategorySlug={tempCategory}
                  isLoading={isLoadingFilters}
                />
              </div>

              <div className="mt-4">
                <h3 className="font-medium mb-2 text-gray-700">Brands</h3>
                <BrandShop
                  brands={brands}
                  selectedBrand={tempBrand}
                  onBrandSelect={(brandSlug) =>
                    setTempBrand((prev) =>
                      prev === brandSlug ? null : brandSlug
                    )
                  }
                  isLoading={isLoadingFilters}
                />
              </div>

              <div className="pt-4">
                <h3 className="font-medium mb-2">Price Range (৳)</h3>
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    min={0}
                    value={tempMinPrice}
                    onChange={(e) =>
                      setTempMinPrice(
                        e.target.value === "" ? "" : Number(e.target.value)
                      )
                    }
                    className="w-full border rounded-md px-2 py-1"
                    placeholder="Min"
                  />
                  <span>-</span>
                  <input
                    type="number"
                    min={0}
                    value={tempMaxPrice}
                    onChange={(e) =>
                      setTempMaxPrice(
                        e.target.value === "" ? "" : Number(e.target.value)
                      )
                    }
                    className="w-full border rounded-md px-2 py-1"
                    placeholder="Max"
                  />
                </div>
              </div>

              <div className="pt-4">
                <h3 className="font-medium mb-2">Stock</h3>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={tempStockIn}
                    onChange={(e) => setTempStockIn(e.target.checked)}
                    className="form-checkbox"
                  />
                  In Stock
                </label>
              </div>

              <div className="pt-4">
                <h3 className="font-medium mb-2">Sort by Price</h3>
                <select
                  value={tempPriceSort}
                  onChange={(e) =>
                    setTempPriceSort(
                      e.target.value as "low_to_high" | "high_to_low" | ""
                    )
                  }
                  className="w-full border rounded-md px-2 py-1"
                >
                  <option value="">Select</option>
                  <option value="low_to_high">Low to High</option>
                  <option value="high_to_low">High to Low</option>
                </select>
              </div>

              <div className="pt-4">
                <h3 className="font-medium mb-2">Delivery</h3>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={tempFreeDelivery}
                    onChange={(e) => setTempFreeDelivery(e.target.checked)}
                    className="form-checkbox"
                  />
                  Free Delivery
                </label>
              </div>

              <div className="flex gap-2 mt-4">
                <button
                  onClick={handleFilterApply}
                  className="w-full bg-amber-500 text-white text-sm py-1.5 rounded-md hover:bg-amber-600 transition cursor-pointer"
                >
                  Apply Filters
                </button>
                <button
                  onClick={resetFilters}
                  className="w-full bg-red-500 text-white text-sm py-1.5 rounded-md hover:bg-red-600 transition cursor-pointer"
                >
                  Reset
                </button>
              </div>
            </div>

            <div
              className="flex-1"
              onClick={() => setMobileFilterOpen(false)}
            ></div>
          </div>
        )}
      </div>
    </>
  );
}
