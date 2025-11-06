"use client";

import Image from "next/image";
import Link from "next/link";
import { FiTrash2 } from "react-icons/fi";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import customImageLoader from "@/lib/image-loader";

interface WishlistItem {
  id: number;
  product_id: number;
  product_name: string;
  product_price: string;
  product_image: string;
  product_slug: string;
  created_at?: string;
}

export default function WishlistPage() {
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage] = useState(10);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  // ✅ Fetch wishlist from API
  const fetchWishlist = async (page: number) => {
    setLoading(true);
    try {
      const res = await fetch("/api/wishlist/get-wishlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          current_page: page.toString(),
          per_page: perPage.toString(),
        }),
      });

      const data = await res.json();

      if (data.status) {
        setWishlist((prev) => {
          const existingIds = new Set(prev.map((i) => i.id));
          const newItems = data.data.wishlist.filter(
            (i: WishlistItem) => !existingIds.has(i.id)
          );
          return [...prev, ...newItems];
        });
        setTotal(data.data.total);
      } else {
        toast.error(data.message || "Failed to load wishlist");
      }
    } catch (err) {
      console.error("Failed to fetch wishlist:", err);
      toast.error("Something went wrong while loading wishlist");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlist(currentPage);
  }, [currentPage]);

  // ✅ Delete wishlist item with toast.promise
  const removeItem = async (id: number) => {
    const deletePromise = fetch("/api/wishlist/delete", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ wishlist_id: id.toString() }),
    }).then(async (res) => {
      const data = await res.json();
      if (!data.status) throw new Error(data.message || "Delete failed");

      // ✅ Remove locally and update total
      setWishlist((prev) => prev.filter((item) => item.id !== id));
      setTotal((prevTotal) => prevTotal - 1);

      return data.message || "Item removed successfully";
    });

    toast.promise(deletePromise, {
      loading: "Removing from wishlist...",
      success: (msg) => msg,
      error: (err) => err.message || "Failed to remove item",
    });
  };

  const loadMore = () => setCurrentPage((prev) => prev + 1);

  const skeletonArray = Array.from({ length: 3 });

  // ✅ Date formatting helper
  const formatDate = (dateString?: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="bg-gray-50 min-h-screen p-4">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-xl font-semibold text-gray-800 mb-4">
          My Wishlist
        </h1>

        {/* Empty State */}
        {wishlist.length === 0 && !loading && (
          <p className="text-gray-500 text-center py-10">
            Your wishlist is empty.
          </p>
        )}

        {/* Skeleton Loader */}
        {loading && wishlist.length === 0 && (
          <div className="space-y-3">
            {skeletonArray.map((_, idx) => (
              <div
                key={`skeleton-${idx}`}
                className="bg-white border border-amber-500 p-3 flex gap-3 items-center rounded-md animate-pulse"
              >
                <div className="w-20 h-20 bg-gray-200 rounded" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                  <div className="h-4 bg-gray-200 rounded w-1/2" />
                  <div className="h-4 bg-gray-200 rounded w-1/4" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Wishlist Items */}
        <div className="space-y-3">
          {wishlist.map((item, index) => (
            <div
              key={`${item.id}-${index}`}
              className="bg-white border border-amber-500 p-3 flex items-center justify-between rounded-md"
            >
              {/* Left side: image + info */}
              <div className="flex gap-3 items-center">
                <div className="w-20 h-20 relative flex-shrink-0">
                  <Image
                    loader={customImageLoader}
                    src={item.product_image}
                    alt={item.product_name}
                    fill
                    className="object-cover rounded"
                  />
                </div>
                <div className="text-sm">
                  <Link
                    href={`/product/${item.product_slug}`}
                    className="font-medium text-gray-800 hover:text-amber-600 transition"
                  >
                    {item.product_name}
                  </Link>
                  <p className="text-amber-500 font-semibold mt-1">
                    ৳{item.product_price}
                  </p>
                  {item.created_at && (
                    <p className="text-xs text-gray-500 mt-1">
                      Added on {formatDate(item.created_at)}
                    </p>
                  )}
                </div>
              </div>

              {/* Right side: delete button */}
              <button
                onClick={() => removeItem(item.id)}
                className="flex items-center gap-1 text-red-500 border border-red-500 px-3 py-1 rounded-md text-sm hover:bg-red-50 transition"
              >
                <FiTrash2 /> Delete
              </button>
            </div>
          ))}
        </div>

        {/* Load More */}
        {wishlist.length > 0 && wishlist.length < total && (
          <div className="flex justify-center mt-4">
            <button
              onClick={loadMore}
              disabled={loading}
              className="bg-amber-500 text-white px-5 py-2 rounded-md text-md hover:bg-amber-600 transition disabled:opacity-50"
            >
              {loading ? "Loading..." : "Load More"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
