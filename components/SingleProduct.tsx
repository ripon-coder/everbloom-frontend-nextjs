import Image from "next/image";
import productImg from "@/public/headphone.jpeg";

export default function ProductPage() {
  return (
    <div className="bg-gray-100 p-2 bg-white">
      <div className="w-full mx-auto  p-3 grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* === Left Side: Product Images === */}
        <div>
          {/* Main Image */}
          <div className="relative w-full h-80 sm:h-96 border rounded-lg overflow-hidden">
            <Image
              src={productImg}
              alt="Headphone"
              fill
              className="object-cover"
            />
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

          {/* Stock & Delivery Info */}
          <div className="text-sm text-gray-700">
            <p>
              <span className="font-medium">Stock:</span> In Stock
            </p>
            <p>
              <span className="font-medium">Delivery:</span> Within 2-4 days
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

          {/* Product Description */}
          <div className="mt-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-2">
              Product Details
            </h2>
            <p className="text-sm text-gray-600 leading-relaxed">
              This wireless Bluetooth headphone delivers crystal clear sound with
              deep bass, up to 20 hours battery backup, and comfortable ear cups.
              Perfect for gaming, music, and calls.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
