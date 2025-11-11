"use client";

import Image from "next/image";
import { FiDownload } from "react-icons/fi";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import customImageLoader from "@/lib/image-loader";

interface Attribute {
  attribute_name: string;
  attribute_value: string;
}

interface ProductVariant {
  sku?: string;
  images?: string[];
  attributes?: Attribute[];
  stock?: number;
}

interface Product {
  id: number;
  product_name: string;
  quantity: number;
  unit_price: string;
  total_price: string;
  productVariant?: ProductVariant;
  image: string;
}

interface Address {
  name: string;
  address: string;
  zone: string;
  phone_number: string;
  district_name?: string;
}

interface Order {
  id: number;
  order_number: string;
  status: string;
  subtotal: string;
  shipping_amount: string;
  coupon_discount_amount: string;
  flash_discount_amount: string;
  total_amount: string;
  created_at: string;
  orderAddress?: Address;
  orderProducts?: Product[];
}

export default function OrderDetailsPage() {
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id || "";

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadedImages, setLoadedImages] = useState<{ [key: number]: boolean }>({});

  const fetchOrder = async (orderId: string) => {
    setLoading(true);
    try {
      const res = await fetch("/api/order-details", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ order_id: orderId }),
      });
      const data = await res.json();
      if (data.status && data.data) setOrder(data.data);
      else setOrder(null);
    } catch (err) {
      console.error(err);
      setOrder(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchOrder(id);
  }, [id]);

  const downloadInvoice = () => {
    alert("🧾 Invoice downloaded successfully! (Attach real logic here)");
  };

  const Skeleton = ({ className }: { className?: string }) => (
    <div className={`bg-gray-300 rounded animate-pulse ${className}`} />
  );

  if (loading) {
    return (
      <div className="bg-gray-50 min-h-screen p-6">
        <div className="max-w-5xl mx-auto bg-white p-6 rounded-xl shadow-lg space-y-6">
          <Skeleton className="h-5 w-64" />
          <Skeleton className="h-40 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
      </div>
    );
  }

  if (!order)
    return <p className="text-center mt-10 text-red-500">Order not found</p>;

  return (
    <div className="bg-gray-50 min-h-screen p-4 md:p-8">
      <div className="max-w-5xl mx-auto bg-white p-6 md:p-8 rounded-2xl shadow-md border border-gray-100">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-3 border-b pb-4 mb-6">
          <div>
            <p className="text-gray-500 text-sm">
              <span className="font-semibold text-gray-700">Order ID:</span>{" "}
              {order.order_number}
            </p>
            <p className="text-gray-500 text-sm">
              <span className="font-semibold text-gray-700">Order Date:</span>{" "}
              {new Date(order.created_at).toLocaleDateString()}
            </p>
            <p className="text-sm mt-1">
              Status:{" "}
              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  order.status === "pending"
                    ? "bg-yellow-100 text-yellow-800"
                    : order.status === "delivered"
                    ? "bg-green-100 text-green-800"
                    : order.status === "cancelled"
                    ? "bg-red-100 text-red-800"
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                {order.status?.charAt(0).toUpperCase() + order.status?.slice(1)}
              </span>
            </p>
          </div>

          <button
            onClick={downloadInvoice}
            className="flex items-center justify-center gap-2 bg-amber-500 text-white px-5 py-2.5 rounded-lg hover:bg-amber-600 transition-all duration-200 shadow-sm hover:shadow-md"
          >
            <FiDownload className="text-lg" /> Download Invoice
          </button>
        </div>

        {/* Products */}
        <div className="mb-6 space-y-5">
          {order.orderProducts?.length ? (
            order.orderProducts.map((p) => (
              <div
                key={p.id}
                className="flex flex-col sm:flex-row items-start sm:items-center gap-4 border border-gray-100 rounded-lg p-4 shadow-sm hover:shadow-md transition-all duration-200"
              >
                <div className="relative w-full sm:w-28 h-28 overflow-hidden rounded-md bg-gray-100">
                  <Image
                    loader={customImageLoader}
                    src={p.image || "/placeholder.png"}
                    alt={p.product_name}
                    fill
                    className={`object-cover transition-all duration-500 ${
                      loadedImages[p.id] ? "blur-0" : "blur-sm"
                    }`}
                    onLoadingComplete={() =>
                      setLoadedImages((prev) => ({ ...prev, [p.id]: true }))
                    }
                  />
                </div>

                <div className="flex-1 w-full">
                  <h2 className="font-semibold text-gray-800">
                    {p.product_name}
                  </h2>
                  <p className="text-gray-500 text-sm mt-1">
                    SKU: {p.productVariant?.sku || "N/A"}
                  </p>

                  {/* Attributes */}
                  <div className="flex flex-wrap gap-2 mt-1">
                    {p.productVariant?.attributes?.map((attr, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs"
                      >
                        {attr.attribute_name}: {attr.attribute_value}
                      </span>
                    ))}
                  </div>

                  <div className="flex justify-between items-center mt-2">
                    <p className="text-gray-600 text-sm">
                      Qty: <span className="font-semibold">{p.quantity}</span>
                    </p>
                    <p className="text-amber-600 font-semibold text-lg">
                      ৳{p.total_price}
                    </p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center py-6">
              No products in this order.
            </p>
          )}
        </div>

        {/* Order Summary */}
        <div className="p-5 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 shadow-sm mb-6">
          <h3 className="font-semibold text-gray-800 mb-3 text-lg border-b pb-2">
            Order Summary
          </h3>

          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Subtotal</span>
              <span className="font-medium text-gray-800">
                ৳{order.subtotal}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-600">Shipping Fee</span>
              <span className="font-medium text-gray-800">
                ৳{order.shipping_amount}
              </span>
            </div>

            {Number(order.coupon_discount_amount) > 0 && (
              <div className="flex justify-between text-red-600">
                <span>Coupon Discount</span>
                <span>-৳{order.coupon_discount_amount}</span>
              </div>
            )}

            {Number(order.flash_discount_amount) > 0 && (
              <div className="flex justify-between text-red-600">
                <span>Flash Sale Discount</span>
                <span>-৳{order.flash_discount_amount}</span>
              </div>
            )}

            <div className="border-t pt-2 mt-2 flex justify-between text-lg font-semibold text-gray-800">
              <span>Total</span>
              <span className="text-amber-600 font-bold">
                ৳{order.total_amount}
              </span>
            </div>
          </div>
        </div>

        {/* Shipping Address */}
        {order.orderAddress && (
          <div className="p-5 rounded-xl bg-gradient-to-br from-white to-gray-50 border border-gray-200 shadow-sm">
            <h3 className="font-semibold text-gray-800 mb-3 text-lg border-b pb-2">
              Shipping Information
            </h3>
            <div className="text-gray-700 space-y-1 text-sm">
              <p>
                <span className="font-medium text-gray-800">Name:</span>{" "}
                {order.orderAddress.name}
              </p>
              <p>
                <span className="font-medium text-gray-800">Phone:</span>{" "}
                {order.orderAddress.phone_number}
              </p>
              <p>
                <span className="font-medium text-gray-800">Address:</span>{" "}
                {order.orderAddress.address}
              </p>
              <p>
                <span className="font-medium text-gray-800">Zone:</span>{" "}
                {order.orderAddress.zone}
              </p>
              {order.orderAddress.district_name && (
                <p>
                  <span className="font-medium text-gray-800">District:</span>{" "}
                  {order.orderAddress.district_name}
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
