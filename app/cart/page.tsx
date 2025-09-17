"use client";

import Image from "next/image";
import { useState } from "react";
import { FaTrash } from "react-icons/fa";
import productImg from "@/public/headphone.jpeg";
import Link from "next/link";

export default function Cart() {
  // 🛒 Example cart state
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: "Wireless Bluetooth Headphone",
      price: 1250,
      qty: 1,
      img: productImg,
    },
    {
      id: 2,
      name: "Smart Watch Pro Series",
      price: 1850,
      qty: 2,
      img: productImg,
    },
  ]);

  // Update quantity
  const updateQty = (id: number, action: "inc" | "dec") => {
    setCartItems((items) =>
      items.map((item) =>
        item.id === id
          ? {
              ...item,
              qty: action === "inc" ? item.qty + 1 : Math.max(1, item.qty - 1),
            }
          : item
      )
    );
  };

  // Remove product
  const removeItem = (id: number) => {
    setCartItems((items) => items.filter((item) => item.id !== id));
  };

  // Calculate total
  const total = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);

  return (
    <div className="p-4 bg-gray-50">
      <div className="w-full mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Cart Items */}
        <div className="md:col-span-2 bg-white p-4">
          <h2 className="text-xl font-semibold mb-4">Shopping Cart</h2>

          {cartItems.length > 0 ? (
            <div className="space-y-4">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between border-b pb-3"
                >
                  {/* Product Info */}
                  <div className="flex items-center gap-4">
                    <div className="relative w-20 h-20 rounded-md overflow-hidden border">
                      <Image
                        src={item.img}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="font-medium">{item.name}</h3>
                      <p className="text-orange-600 font-semibold">
                        ৳ {item.price}
                      </p>
                    </div>
                  </div>

                  {/* Quantity + Remove */}
                  <div className="flex items-center gap-3">
                    <div className="flex items-center border rounded-md">
                      <button
                        onClick={() => updateQty(item.id, "dec")}
                        className="px-3 py-1 hover:bg-gray-100"
                      >
                        -
                      </button>
                      <span className="px-4">{item.qty}</span>
                      <button
                        onClick={() => updateQty(item.id, "inc")}
                        className="px-3 py-1 hover:bg-gray-100"
                      >
                        +
                      </button>
                    </div>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-red-500 hover:text-red-700 cursor-pointer"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-10">
              Your cart is empty 🛒
            </p>
          )}
        </div>

        {/* Cart Summary */}
        <div className="bg-white p-4 h-fit">
          <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
          <div className="flex justify-between text-sm mb-2">
            <span>Subtotal</span>
            <span>৳ {total}</span>
          </div>
          <div className="flex justify-between text-sm mb-2">
            <span>Shipping</span>
            <span>৳ {total > 0 ? 100 : 0}</span>
          </div>
          <div className="flex justify-between font-semibold text-lg border-t pt-2">
            <span>Total</span>
            <span>৳ {total > 0 ? total + 100 : 0}</span>
          </div>
          <Link href="/checkout">
            <button
              disabled={cartItems.length === 0}
              className="w-full mt-4 bg-orange-500 text-white py-3 rounded-lg font-medium hover:bg-orange-600 transition disabled:bg-gray-300 cursor-pointer"
            >
              Proceed to Checkout
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
