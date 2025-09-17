"use client";

import Image,{StaticImageData} from "next/image";
import { FiDownload } from "react-icons/fi";
import productImg from "@/public/headphone.jpeg"; // placeholder

interface Product {
  id: number;
  name: string;
  img: string;
  quantity: number;
  price: number;
  attributes: string;
}

interface Order {
  id: string;
  date: string;
  status: "Pending" | "Shipped" | "Delivered" | "Cancelled";
  totalAmount: number;
  products: Product[];
  tracking: { step: string; completed: boolean }[];
}

export default function OrderDetailsPage() {
  const order: Order = {
    id: "ORD001",
    date: "2025-09-15",
    status: "Shipped",
    totalAmount: 2450,
    products: [
      { id: 1, name: "Wireless Headphone", img: productImg, quantity: 2, price: 1200, attributes: "Black, Wireless" },
      { id: 2, name: "Bottle", img: productImg, quantity: 1, price: 50, attributes: "Red, 500ml" },
    ],
    tracking: [
      { step: "Order Placed", completed: true },
      { step: "Processed", completed: true },
      { step: "Shipped", completed: true },
      { step: "Out for Delivery", completed: false },
      { step: "Delivered", completed: false },
    ],
  };

  const downloadInvoice = () => {
    alert("Invoice Downloaded! (Implement actual download logic)");
  };

  return (
    <div className="bg-gray-50 min-h-screen p-4">
      <div className="max-w-5xl mx-auto bg-white p-6 ">
        {/* Tracking Section (Top) */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Tracking Status</h2>
          <div className="flex items-center justify-between relative">
            {order.tracking.map((step, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-semibold z-10 ${
                    step.completed ? "bg-amber-500" : "bg-gray-300"
                  }`}
                >
                  {step.completed ? "✓" : idx + 1}
                </div>
                <p className="text-xs text-gray-700 mt-2 text-center">{step.step}</p>
                {idx !== order.tracking.length - 1 && (
                  <div
                    className={`absolute top-3.5 left-1/2 w-full h-1 -translate-x-1/2 ${
                      order.tracking[idx + 1].completed ? "bg-amber-500" : "bg-gray-300"
                    }`}
                  ></div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Order Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <p className="text-gray-500 text-sm">Order ID: {order.id}</p>
            <p className="text-gray-500 text-sm">Order Date: {order.date}</p>
            <p className="font-medium mt-1">Total Amount: ৳{order.totalAmount}</p>
          </div>
          <button
            onClick={downloadInvoice}
            className="flex items-center gap-2 bg-amber-500 text-white px-4 py-2 rounded-md hover:bg-amber-600 transition"
          >
            <FiDownload /> Download Invoice
          </button>
        </div>

        {/* Products */}
        <div className="space-y-4">
          {order.products.map((p) => (
            <div key={p.id} className="flex items-center gap-4 border-b pb-4">
              <div className="w-24 h-24 relative">
                <Image src={p.img} alt={p.name} fill className="object-cover rounded" />
              </div>
              <div className="flex-1">
                <h2 className="font-medium text-gray-800">{p.name}</h2>
                <p className="text-gray-500 text-sm">{p.attributes}</p>
                <p className="text-gray-800 mt-1">Quantity: {p.quantity}</p>
                <p className="text-amber-500 font-semibold">৳{p.price}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
