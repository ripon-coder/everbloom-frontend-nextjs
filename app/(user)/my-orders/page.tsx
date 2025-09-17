"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { FiChevronRight } from "react-icons/fi";
import productImg from "@/public/headphone.jpeg"; // placeholder

interface Order {
  id: string;
  date: string;
  status: "Pending" | "Shipped" | "Delivered" | "Cancelled";
  totalAmount: number;
}

export default function MyOrdersPage() {
  const allOrders: Order[] = [
    { id: "ORD001", date: "2025-09-15", status: "Delivered", totalAmount: 2450 },
    { id: "ORD002", date: "2025-09-12", status: "Shipped", totalAmount: 950 },
    { id: "ORD003", date: "2025-09-10", status: "Pending", totalAmount: 1800 },
    { id: "ORD004", date: "2025-09-08", status: "Delivered", totalAmount: 1500 },
    { id: "ORD005", date: "2025-09-05", status: "Cancelled", totalAmount: 2000 },
    { id: "ORD006", date: "2025-09-03", status: "Shipped", totalAmount: 1250 },
  ];

  const [visibleOrders, setVisibleOrders] = useState(3);

  const loadMore = () => {
    setVisibleOrders((prev) => Math.min(prev + 3, allOrders.length));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Delivered":
        return "bg-green-100 text-green-800";
      case "Shipped":
        return "bg-blue-100 text-blue-800";
      case "Pending":
        return "bg-yellow-100 text-yellow-800";
      case "Cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen p-4">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl font-semibold text-gray-800 mb-6">My Orders</h1>

        <div className="space-y-4">
          {allOrders.slice(0, visibleOrders).map((order) => (
            <div
              key={order.id}
              className="bg-white border border-amber-600 p-4 flex justify-between items-center"
            >
              <div>
                <p className="font-medium text-gray-700">Order ID: {order.id}</p>
                <p className="text-gray-500 text-sm">Date: {order.date}</p>
                <span
                  className={`px-2 py-1 mt-1 inline-block rounded-full text-sm font-medium ${getStatusColor(
                    order.status
                  )}`}
                >
                  {order.status}
                </span>
              </div>

              <div className="flex items-center gap-4">
                <p className="font-semibold text-gray-800">৳{order.totalAmount}</p>
                <Link
                  href={`/order-details`}
                  className="flex items-center gap-1 text-amber-500 hover:text-amber-600 font-medium"
                >
                  View Details <FiChevronRight />
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Load More Button */}
        {visibleOrders < allOrders.length && (
          <div className="text-center mt-6">
            <button
              onClick={loadMore}
              className="bg-amber-500 text-white px-6 py-2  hover:bg-amber-600 transition"
            >
              Load More
            </button>
          </div>
        )}

        {allOrders.length === 0 && <p className="text-gray-500 mt-6">You have no orders yet.</p>}
      </div>
    </div>
  );
}
