"use client";

import Image from "next/image";
import { FiTrash2, FiShoppingCart } from "react-icons/fi";
import productImg from "@/public/headphone.jpeg";
import { useState } from "react";

interface WishlistItem {
  id: number;
  name: string;
  img: string;
  price: number;
  attributes: string;
}

export default function WishlistPage() {
  const allItems: WishlistItem[] = [
    { id: 1, name: "Wireless Headphone", img: productImg, price: 1200, attributes: "Black, Wireless" },
    { id: 2, name: "Bottle", img: productImg, price: 50, attributes: "Red, 500ml" },
    { id: 3, name: "Smart Watch", img: productImg, price: 2500, attributes: "Black, Waterproof" },
    { id: 4, name: "Gaming Mouse", img: productImg, price: 1800, attributes: "RGB, Wired" },
    { id: 5, name: "Backpack", img: productImg, price: 1500, attributes: "Black, 20L" },
    { id: 6, name: "Sunglasses", img: productImg, price: 800, attributes: "Brown, UV Protection" },
  ];

  const [wishlist, setWishlist] = useState(allItems.slice(0, 3));

  const removeItem = (id: number) => setWishlist(prev => prev.filter(item => item.id !== id));
  const addToCart = (item: WishlistItem) => alert(`${item.name} added to cart!`);
  const loadMore = () => {
    const currentLength = wishlist.length;
    setWishlist([...wishlist, ...allItems.slice(currentLength, currentLength + 3)]);
  };

  return (
    <div className="bg-gray-50 min-h-screen p-3">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-xl font-semibold text-gray-800 mb-4">My Wishlist</h1>

        {wishlist.length === 0 && <p className="text-gray-500">Your wishlist is empty.</p>}

        <div className="space-y-3">
          {wishlist.map(item => (
            <div key={item.id} className="bg-white border border-amber-500 p-3 flex gap-3 items-center rounded-md">
              <div className="w-20 h-20 relative flex-shrink-0">
                <Image src={item.img} alt={item.name} fill className="object-cover rounded" />
              </div>
              <div className="flex-1 text-sm">
                <h2 className="font-medium text-gray-800">{item.name}</h2>
                <p className="text-gray-500">{item.attributes}</p>
                <p className="text-amber-500 font-semibold mt-1">৳{item.price}</p>
                <div className="flex gap-2 mt-1">
                  <button
                    onClick={() => addToCart(item)}
                    className="flex items-center gap-1 bg-amber-500 text-white px-2 py-1 rounded-md text-xs hover:bg-amber-600 transition"
                  >
                    <FiShoppingCart /> Add
                  </button>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="flex items-center gap-1 text-red-500 border border-red-500 px-2 py-1 rounded-md text-xs hover:bg-red-50 transition"
                  >
                    <FiTrash2 /> Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {wishlist.length < allItems.length && (
          <div className="flex justify-center mt-4">
            <button
              onClick={loadMore}
              className="bg-amber-500 text-white px-5 py-2 rounded-md text-md hover:bg-amber-600 transition"
            >
              Load More
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
