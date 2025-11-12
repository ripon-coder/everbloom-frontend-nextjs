"use client";

import Image from "next/image";
import customImageLoader from "@/lib/image-loader";
import ProductSkeleton from "./ProductSkeleton";
import Link from "next/link";

export interface Product {
  id: number;
  name: string;
  price: string;
  slug: string;
  image: string;
}

interface ProductGridProps {
  products: Product[];
  isLoading?: boolean;
  flashSaleSlug?: string;
}

export default function ProductGrid({
  products,
  isLoading = false,
  flashSaleSlug,
}: ProductGridProps) {
  if (!Array.isArray(products)) {
    console.error("ProductGrid received a non-array products prop:", products);
    return (
      <div className="p-4 bg-gray-100">
        <p className="text-red-500">Error: Product data is not available.</p>
      </div>
    );
  }

  // ✅ generate link
  const getProductLink = (productSlug: string) =>
    flashSaleSlug
      ? `/product/${productSlug}?flashsale=${flashSaleSlug}`
      : `/product/${productSlug}`;

  return (
    <div className="p-2 sm:p-4 bg-gray-50">
      <h2 className="text-lg font-semibold text-gray-800 mb-3">Products</h2>

      {/* ✅ Compact grid layout */}
      <div className="grid gap-3 grid-cols-3 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {isLoading ? (
          Array.from({ length: 12 }).map((_, index) => (
            <ProductSkeleton key={index} />
          ))
        ) : (
          products.map((p) => (
            <a key={p.id} href={getProductLink(p.slug)}>
              <div className="bg-white border rounded-md overflow-hidden hover:shadow-md transition-transform hover:-translate-y-1 cursor-pointer">
                <div className="relative w-full aspect-[1/1]">
                  <Image
                    loader={customImageLoader}
                    src={p.image}
                    alt={p.name}
                    fill
                    className="object-cover"
                  />
                </div>

                <div className="px-2 py-1">
                  <h1 className="text-[12px] sm:text-sm font-medium text-gray-700 line-clamp-2 leading-tight h-[32px]">
                    {p.name}
                  </h1>
                  <h2 className="text-amber-500 text-[13px] sm:text-[15px] font-semibold mt-1">
                    ৳{p.price}
                  </h2>
                </div>
              </div>
            </a>
          ))
        )}
      </div>
    </div>
  );
}
