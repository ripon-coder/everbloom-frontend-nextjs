"use client";

import Image, { StaticImageData } from "next/image";
import bottle from "@/public/bottle.webp";
import productImg from "@/public/headphone.jpeg";

interface Product {
  id: number;
  img: StaticImageData;
  name: string;
  color: string;
  type: string;
  price: number;
}

interface ProductGridProps {
  filters?: {
    color: string | null;
    type: string | null;
    maxPrice: number;
  };
}

export default function ProductGrid({ filters }: ProductGridProps) {
  const products: Product[] = [
    { id: 1, img: bottle, name: "Bottle Black Wireless", color: "Black", type: "Wireless", price: 1200 },
    { id: 2, img: productImg, name: "Headphone White Wired", color: "White", type: "Wired", price: 1500 },
    { id: 3, img: bottle, name: "Bottle Red Wireless", color: "Red", type: "Wireless", price: 900 },
    { id: 4, img: productImg, name: "Headphone Black Wired", color: "Black", type: "Wired", price: 1300 },
    // Add more products as needed
  ];

  // Apply filters
  const filteredProducts = products.filter((p) => {
    const matchColor = filters?.color ? p.color === filters.color : true;
    const matchType = filters?.type ? p.type === filters.type : true;
    const matchPrice = p.price <= (filters?.maxPrice || Infinity);
    return matchColor && matchType && matchPrice;
  });

  return (
    <div className="p-4 bg-gray-100 min-h-screen">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Products</h2>
      <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4">
        {filteredProducts.length === 0 ? (
          <p className="text-gray-500 col-span-full">No products found.</p>
        ) : (
          filteredProducts.map((p) => (
            <div
              key={p.id}
              className="bg-white border overflow-hidden shadow-sm hover:shadow-md hover:-translate-y-1 transition duration-300 cursor-pointer"
            >
              <div className="relative w-full h-32 sm:h-40 md:h-48 lg:h-56">
                <Image src={p.img} alt={p.name} fill className="object-cover" />
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
