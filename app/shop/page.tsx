"use client";

import { useState } from "react";
import ProductGrid from "@/components/ProductGrid"; // Your product component

export default function ShopPage() {
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [maxPrice, setMaxPrice] = useState<number>(2000);

  const filters = {
    color: selectedColor,
    type: selectedType,
    maxPrice,
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
                  onClick={() => setSelectedColor(selectedColor === color ? null : color)}
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
                  onClick={() => setSelectedType(selectedType === type ? null : type)}
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
            onClick={() => {
              setSelectedColor(null);
              setSelectedType(null);
              setMaxPrice(2000);
            }}
            className="w-full bg-orange-500 text-white py-2 rounded-md hover:bg-orange-600 transition"
          >
            Reset Filters
          </button>
        </div>

        {/* Products */}
        <div className="md:col-span-3">
          <ProductGrid filters={filters} />
        </div>
      </div>
    </div>
  );
}
