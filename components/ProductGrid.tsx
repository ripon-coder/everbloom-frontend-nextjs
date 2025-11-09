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
      <div className="p-4 bg-gray-100 min-h-screen">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Products</h2>
        <p className="text-red-500">Error: Product data is not available.</p>
      </div>
    );
  }

  // Function to generate product link with optional flash sale parameter
  const getProductLink = (productSlug: string) => {
    if (flashSaleSlug) {
      return `/product/${productSlug}?flashsale=${flashSaleSlug}`;
    }
    return `/product/${productSlug}`;
  };

  return (
    <div className="p-4 bg-gray-100 min-h-screen">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Products</h2>
      <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4">
        {isLoading ? (
          Array.from({ length: 8 }).map((_, index) => (
            <ProductSkeleton key={index} />
          ))
        ) : (
          products.map((p) => (
            <Link key={p.id} href={getProductLink(p.slug)}>
              <div
                key={p.id}
                className="bg-white border overflow-hidden shadow-sm hover:shadow-md hover:-translate-y-1 transition duration-300 cursor-pointer"
              >
                <div className="relative w-full h-32 sm:h-40 md:h-48 lg:h-56">
                  <Image
                    loader={customImageLoader}
                    src={p.image}
                    alt={p.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-2">
                  <h1 className="text-xs sm:text-sm font-medium text-gray-700 truncate">
                    {p.name}
                  </h1>
                  <h2 className="text-amber-500 text-[18px]">
                    <span className="text-2xl">৳</span>
                    {p.price}
                  </h2>
                </div>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}