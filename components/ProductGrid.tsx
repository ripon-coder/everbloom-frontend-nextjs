"use client";

import Image from "next/image";
import customImageLoader from "@/lib/image-loader"; // Import the custom loader
import ProductSkeleton from "./ProductSkeleton"; // Import the ProductSkeleton component

// Product interface, can be moved to a separate types file if needed
export interface Product {
  id: number;
  name: string;
  price: string; // API returns price as a string
  slug: string;
  image: string; // API uses 'image' instead of 'img'
}

interface ProductGridProps {
  products: Product[];
  isLoading?: boolean; // Add isLoading prop
}

export default function ProductGrid({ products, isLoading = false }: ProductGridProps) {
  // Guard clause to ensure products is an array before attempting to map
  if (!Array.isArray(products)) {
    console.error("ProductGrid received a non-array products prop:", products);
    return (
      <div className="p-4 bg-gray-100 min-h-screen">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Products</h2>
        <p className="text-red-500">Error: Product data is not available.</p>
      </div>
    );
  }

  return (
    <div className="p-4 bg-gray-100 min-h-screen">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Products</h2>
      <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4">
        {isLoading ? (
          // Render 8 skeleton components while loading
          Array.from({ length: 8 }).map((_, index) => (
            <ProductSkeleton key={index} />
          ))
        ) : products.length === 0 ? (
          <p className="text-gray-500 col-span-full">No products found.</p>
        ) : (
          products.map((p) => (
            <div
              key={p.id}
              className="bg-white border overflow-hidden shadow-sm hover:shadow-md hover:-translate-y-1 transition duration-300 cursor-pointer"
            >
              <div className="relative w-full h-32 sm:h-40 md:h-48 lg:h-56">
                <Image
                  loader={customImageLoader}
                  src={p.image} // Use 'image' from API directly
                  alt={p.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-2">
                <h1 className="text-xs sm:text-sm font-medium text-gray-700 truncate">{p.name}</h1>
                <h2 className="text-amber-500 text-[18px]">
                  <span className="text-2xl">৳</span>{p.price}
                </h2>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
