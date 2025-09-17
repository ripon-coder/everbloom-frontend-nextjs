"use client";

import Image from "next/image";
import { useState } from "react";
import { FaHeart, FaRegHeart } from "react-icons/fa"; // ❤️ icons
import productImg from "@/public/headphone.jpeg";

export default function ProductPage() {
  const [selectedColor, setSelectedColor] = useState("Black");
  const [selectedType, setSelectedType] = useState("Wireless");
  const [isFavorite, setIsFavorite] = useState(false);

  // ✅ Mock product data
  const stock = 12;
  const deliveryDays = [2, 4];

  return (
    <div className="p-2 bg-white">
      <div className="w-full mx-auto p-3 grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* === Left Side: Product Images === */}
        <div>
          {/* Main Image with Favorite Button */}
          <div className="relative w-full h-80 sm:h-96 border rounded-lg overflow-hidden">
            <Image
              src={productImg}
              alt="Headphone"
              fill
              className="object-cover"
            />
            {/* Favorite Button */}
            <button
              onClick={() => setIsFavorite(!isFavorite)}
              className="absolute top-3 right-3 bg-white rounded-full p-2 shadow-md hover:scale-110 transition"
            >
              {isFavorite ? (
                <FaHeart className="text-red-500 text-xl" />
              ) : (
                <FaRegHeart className="text-gray-600 text-xl" />
              )}
            </button>
          </div>

          {/* Thumbnails */}
          <div className="flex gap-3 mt-4">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="relative w-20 h-20 border rounded-md overflow-hidden cursor-pointer hover:ring-2 hover:ring-orange-500"
              >
                <Image
                  src={productImg}
                  alt={`thumb-${i}`}
                  fill
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        </div>

        {/* === Right Side: Product Details === */}
        <div className="flex flex-col gap-4">
          {/* Title */}
          <h1 className="text-2xl font-semibold text-gray-800">
            Wireless Bluetooth Headphone
          </h1>

          {/* Rating & Sold Info */}
          <div className="flex items-center gap-3 text-sm text-gray-600">
            <span className="text-yellow-500">★★★★☆</span>
            <span>4.2 Ratings</span>
            <span>|</span>
            <span>1.2k Sold</span>
          </div>

          {/* Price */}
          <div className="text-3xl font-bold text-orange-600">৳ 1,250</div>

          {/* Attributes */}
          <div className="mt-2 space-y-3">
            {/* Color */}
            <div>
              <span className="font-medium text-sm">Color:</span>
              <div className="flex gap-3 mt-2">
                {["Black", "White", "Red"].map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`px-4 py-2 border rounded-md text-sm ${
                      selectedColor === color
                        ? "border-orange-500 bg-orange-50 text-orange-600"
                        : "hover:bg-gray-100"
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>

            {/* Type */}
            <div>
              <span className="font-medium text-sm">Type:</span>
              <div className="flex gap-3 mt-2">
                {["Wireless", "Wired"].map((type) => (
                  <button
                    key={type}
                    onClick={() => setSelectedType(type)}
                    className={`px-4 py-2 border rounded-md text-sm ${
                      selectedType === type
                        ? "border-orange-500 bg-orange-50 text-orange-600"
                        : "hover:bg-gray-100"
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Stock & Delivery Info */}
          <div className="text-sm text-gray-700 space-y-1">
            <p>
              <span className="font-medium">Stock:</span>{" "}
              {stock > 0 ? (
                <span className="text-green-600">{stock} available</span>
              ) : (
                <span className="text-red-500">Out of stock</span>
              )}
            </p>
            <p>
              <span className="font-medium">Delivery:</span>{" "}
              {`Within ${deliveryDays[0]}-${deliveryDays[1]} days`}
            </p>
          </div>

          {/* Quantity Selector */}
          <div className="flex items-center gap-3 mt-2">
            <span className="text-sm font-medium">Quantity:</span>
            <div className="flex items-center border rounded-md">
              <button className="px-3 py-1 hover:bg-gray-200">-</button>
              <span className="px-4">1</span>
              <button className="px-3 py-1 hover:bg-gray-200">+</button>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-4 mt-4">
            <button className="flex-1 bg-orange-500 text-white py-3 rounded-lg font-medium hover:bg-orange-600 transition">
              Add to Cart
            </button>
            <button className="flex-1 border border-orange-500 text-orange-500 py-3 rounded-lg font-medium hover:bg-orange-50 transition">
              Buy Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
