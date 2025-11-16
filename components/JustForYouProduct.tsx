"use client";

import { useEffect, useState } from "react";
import { getTrackedCategories } from "@/lib/JustForYouTracker";
import ProductGrid, { Product } from "@/components/ProductGridHome";
import ProductSkeleton from "@/components/ProductSkeleton";
import { Button } from "@/components/ui/button";

export default function JustForYouProduct() {
  const [products, setProducts] = useState<Product[]>([]);
  const [page, setPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [initialLoading, setInitialLoading] = useState<boolean>(true);

  const fetchProducts = async (pageNumber: number = 1) => {
    const categoryIds = getTrackedCategories();
    if (categoryIds.length === 0) {
      setInitialLoading(false);
    }

    if (pageNumber === 1) setInitialLoading(true);
    else setLoading(true);

    try {
      const res = await fetch("/api/just-for-you-products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          category_ids: categoryIds,
          current_page: pageNumber.toString(),
          per_page: "12",
        }),
      });

      if (!res.ok) throw new Error("Failed to fetch products");

      const result = await res.json();
      const productList = result?.data?.products || [];
      const pagination = result?.data?.pagination || {};

      if (pageNumber === 1) {
        setProducts(productList);
      } else {
        setProducts((prev) => [...prev, ...productList]);
      }

      setHasMore(
        pagination?.current_page < pagination?.last_page ||
          productList.length >= Number(pagination?.per_page)
      );
    } catch (error) {
      console.error("Error fetching Just For You products:", error);
    } finally {
      setInitialLoading(false);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts(1);
  }, []);

  if (initialLoading) {
    return (
      <section className="px-6 py-6">
        <h2 className="text-xl font-semibold mb-3">Just For You</h2>
        <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7">
          {Array.from({ length: 7 }).map((_, i) => (
            <ProductSkeleton key={i} />
          ))}
        </div>
      </section>
    );
  }

  if (products.length === 0 && !loading) return null;

  return (
    <section className="px-5 py-6">
      <h2 className="text-xl sm:text-xl font-semibold mb-3">Just For You</h2>

      <ProductGrid products={products} />

      {loading && (
        <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 mt-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <ProductSkeleton key={i} />
          ))}
        </div>
      )}

      {hasMore && !loading && (
        <div className="text-center mt-4">
          <Button
            size="sm"
            onClick={() => {
              const nextPage = page + 1;
              setPage(nextPage);
              fetchProducts(nextPage);
            }}
          >
            Load More
          </Button>
        </div>
      )}
    </section>
  );
}
