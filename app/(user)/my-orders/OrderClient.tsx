"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FiChevronRight, FiPackage } from "react-icons/fi";

interface Order {
  id: number;
  order_number: string;
  total_amount: string;
  status: string;
  created_at: string;
  order_products_count: number;
}

export default function MyOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage] = useState(5);
  const [total, setTotal] = useState(0);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "delivered":
        return "bg-green-100 text-green-700";
      case "shipped":
        return "bg-blue-100 text-blue-700";
      case "pending":
        return "bg-yellow-100 text-yellow-700";
      case "cancelled":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-GB", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const fetchOrders = async (page: number) => {
    try {
      if (page === 1) setLoading(true);
      else setLoadingMore(true);

      const res = await fetch("/api/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          current_page: page,
          per_page: perPage,
        }),
      });

      const data = await res.json();

      if (data.status && data.data?.orders) {
        if (page === 1) setOrders(data.data.orders);
        else setOrders((prev) => [...prev, ...data.data.orders]);

        setTotal(data.data.total || 0);
      } else {
        setError("Failed to load orders");
      }
    } catch (err) {
      console.error(err);
      setError("Something went wrong while fetching orders.");
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchOrders(1);
  }, []);

  const loadMore = () => {
    const nextPage = currentPage + 1;
    setCurrentPage(nextPage);
    fetchOrders(nextPage);
  };

  return (
    <div className="bg-gray-50 min-h-screen py-8 px-4">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl font-semibold text-gray-800 mb-8">
          My Orders
        </h1>

        {/* Error */}
        {error && (
          <p className="text-red-600 bg-red-50 p-3 rounded mb-4">{error}</p>
        )}

        {/* Loading Skeletons */}
        {loading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="bg-white p-4 border rounded-lg shadow-sm animate-pulse"
              >
                <div className="h-5 bg-gray-200 rounded w-1/3 mb-3" />
                <div className="h-4 bg-gray-200 rounded w-1/4 mb-2" />
                <div className="h-4 bg-gray-200 rounded w-1/6" />
              </div>
            ))}
          </div>
        ) : orders.length === 0 ? (
          <p className="text-gray-500 mt-6 text-center">
            You have no orders yet.
          </p>
        ) : (
          <>
            {/* Orders List */}
            <div className="space-y-4">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="bg-white border rounded-lg shadow-sm hover:shadow-md transition-all p-5 flex flex-col sm:flex-row sm:items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-amber-50 rounded-full">
                      <FiPackage className="text-amber-500 text-xl" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">
                        {order.order_number}
                      </p>
                      <p className="text-sm text-gray-500">
                        {formatDate(order.created_at)} •{" "}
                        {order.order_products_count} item
                        {order.order_products_count > 1 ? "s" : ""}
                      </p>
                      <span
                        className={`mt-2 inline-block px-2 py-1 text-sm rounded-full font-medium ${getStatusColor(
                          order.status
                        )}`}
                      >
                        {order.status.charAt(0).toUpperCase() +
                          order.status.slice(1)}
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 sm:mt-0 flex items-center justify-between sm:justify-end w-full sm:w-auto gap-4">
                    <p className="text-lg font-semibold text-gray-800">
                      ৳{order.total_amount}
                    </p>
                    <Link
                      href={`/order-details/${order.id}`}
                      className="flex items-center gap-1 text-amber-500 hover:text-amber-600 font-medium"
                    >
                      View <FiChevronRight />
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            {/* Load More */}
            {orders.length < total && (
              <div className="text-center mt-8">
                <button
                  onClick={loadMore}
                  disabled={loadingMore}
                  className="bg-amber-500 text-white px-8 py-2.5 rounded-md font-medium hover:bg-amber-600 transition disabled:opacity-60"
                >
                  {loadingMore ? "Loading..." : "Load More"}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
