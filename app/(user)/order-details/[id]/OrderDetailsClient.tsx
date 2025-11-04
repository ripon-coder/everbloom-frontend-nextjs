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

  // Track which images have finished loading
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
      if (data.status && data.data) {
        setOrder(data.data);
      } else {
        setOrder(null);
      }
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
    alert("Invoice Downloaded! (Implement actual download logic)");
  };

  // Skeleton loader component
  const Skeleton = ({ className }: { className?: string }) => (
    <div className={`bg-gray-300 rounded animate-pulse ${className}`} />
  );

  if (loading) {
    return (
      <div className="bg-gray-50 min-h-screen p-4">
        <div className="max-w-5xl mx-auto bg-white p-6 rounded-xl shadow space-y-6">
          {/* Header skeleton */}
          <div className="flex justify-between items-center">
            <div className="space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-4 w-24" />
            </div>
            <Skeleton className="h-10 w-40" />
          </div>

          {/* Products skeleton */}
          <div className="space-y-4">
            {[1, 2].map((i) => (
              <div key={i} className="flex items-center gap-4 border-b pb-4">
                <Skeleton className="w-24 h-24" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-48" />
                  <Skeleton className="h-3 w-32" />
                  <Skeleton className="h-3 w-40" />
                  <Skeleton className="h-4 w-20" />
                </div>
              </div>
            ))}
          </div>

          {/* Order summary skeleton */}
          <div className="p-4 border rounded-md bg-gray-50 space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-4 w-20" />
          </div>

          {/* Address skeleton */}
          <div className="p-4 border rounded-md bg-gray-50 space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-48" />
            <Skeleton className="h-4 w-36" />
          </div>
        </div>
      </div>
    );
  }

  if (!order)
    return <p className="text-center mt-10 text-red-500">Order not found</p>;

  return (
    <div className="bg-gray-50 min-h-screen p-4">
      <div className="max-w-5xl mx-auto bg-white p-6 rounded-xl shadow">
        {/* Order Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <p className="text-gray-500 text-sm">
              Order ID: {order.order_number}
            </p>
            <p className="text-gray-500 text-sm">
              Order Date: {new Date(order.created_at).toLocaleDateString()}
            </p>
            <p className="text-sm mt-1">
              Status:{" "}
              <span
                className={`px-2 py-1 rounded-full text-xs font-semibold ${
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
            className="flex items-center gap-2 bg-amber-500 text-white px-4 py-2 rounded-md hover:bg-amber-600 transition"
          >
            <FiDownload /> Download Invoice
          </button>
        </div>

        {/* Products */}
        {order.orderProducts?.length ? (
          <div className="space-y-4 mb-6">
            {order.orderProducts.map((p) => (
              <div key={p.id} className="flex items-center gap-4 border-b pb-4">
                <div className="w-24 h-24 relative overflow-hidden rounded">
                  <Image
                    loader={customImageLoader}
                    src={p.image || "/placeholder.png"}
                    alt={p.product_name}
                    fill
                    className={`object-cover rounded transition-all duration-500 ease-in-out ${
                      loadedImages[p.id] ? "blur-0" : "blur-sm"
                    }`}
                    onLoadingComplete={() =>
                      setLoadedImages((prev) => ({ ...prev, [p.id]: true }))
                    }
                  />
                </div>
                <div className="flex-1">
                  <h2 className="font-medium text-gray-800">{p.product_name}</h2>
                  <p className="text-gray-500 text-sm mt-1">
                    SKU: {p.productVariant?.sku || "N/A"}
                  </p>
                  <div className="text-gray-500 text-sm flex flex-wrap gap-2 mt-1">
                    {p.productVariant?.attributes?.map((attr, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-1 bg-gray-100 rounded text-xs"
                      >
                        {attr.attribute_name}: {attr.attribute_value}
                      </span>
                    )) || null}
                  </div>
                  <p className="text-gray-500 text-sm mt-1">Quantity: {p.quantity}</p>
                  <p className="text-amber-500 font-semibold">৳{p.total_price}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-6">
            No products in this order.
          </p>
        )}

        {/* Order Summary */}
        <div className="mb-6 p-4 border rounded-md bg-gray-50">
          <h3 className="font-semibold text-gray-800 mb-2">Order Summary</h3>
          <div className="flex justify-between py-1">
            <span className="text-gray-600">Subtotal:</span>
            <span>৳{order.subtotal}</span>
          </div>
          <div className="flex justify-between py-1">
            <span className="text-gray-600">Shipping Fee:</span>
            <span>৳{order.shipping_amount}</span>
          </div>
          {Number(order.coupon_discount_amount) > 0 && (
            <div className="flex justify-between py-1">
              <span className="text-gray-600">Coupon Discount:</span>
              <span className="text-red-500">
                -৳{order.coupon_discount_amount}
              </span>
            </div>
          )}
          {Number(order.flash_discount_amount) > 0 && (
            <div className="flex justify-between py-1">
              <span className="text-gray-600">Flash Sale Discount:</span>
              <span className="text-red-500">
                -৳{order.flash_discount_amount}
              </span>
            </div>
          )}
          <div className="flex justify-between py-2 border-t font-semibold text-gray-800">
            <span>Total:</span>
            <span>৳{order.total_amount}</span>
          </div>
        </div>

        {/* Address */}
        {order.orderAddress && (
          <div className="mt-6 p-4 border rounded-md bg-gray-50">
            <h3 className="font-semibold text-gray-800 mb-2">
              Shipping Address
            </h3>
            <div className="text-gray-700 space-y-1">
              <p>
                <span className="font-medium">Name:</span>{" "}
                {order.orderAddress.name}
              </p>
              <p>
                <span className="font-medium">Phone:</span>{" "}
                {order.orderAddress.phone_number}
              </p>
              <p>
                <span className="font-medium">Address:</span>{" "}
                {order.orderAddress.address}
              </p>
              <p>
                <span className="font-medium">Zone:</span>{" "}
                {order.orderAddress.zone}
              </p>
              {order.orderAddress.district_name && (
                <p>
                  <span className="font-medium">District:</span>{" "}
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
