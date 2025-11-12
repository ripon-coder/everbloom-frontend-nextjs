"use client";

import { useState } from "react";
import { Heart } from "lucide-react";
import toast from "react-hot-toast";

interface WishlistButtonProps {
  productId: number;
  isInitiallyWishlisted?: boolean;
  className?: string;
}

export default function WishlistButton({
  productId,
  isInitiallyWishlisted = false,
  className = "",
}: WishlistButtonProps) {
  const [isWishlisted, setIsWishlisted] = useState(isInitiallyWishlisted);
  const [loading, setLoading] = useState(false);

  const handleWishlist = async () => {
    if (loading) return;
    setLoading(true);

    const newState = !isWishlisted;
    setIsWishlisted(newState); // Optimistic UI update

    await toast.promise(
      (async () => {
        const res = await fetch("/api/wishlist/add", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ product_id: productId }),
        });

        const data = await res.json();

        if (!res.ok) {
          setIsWishlisted(!newState); // rollback
          throw new Error(data.message || "Something went wrong");
        }

        return data.message || (newState ? "Added to wishlist!" : "Removed from wishlist!");
      })(),
      {
        loading: newState ? "Adding to wishlist..." : "Removing from wishlist...",
        success: (msg) => msg,
        error: (err) => err?.toString() || "Failed to update wishlist",
      }
    ).finally(() => setLoading(false));
  };

  return (
    <button
      onClick={handleWishlist}
      disabled={loading}
      title={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
      className={`flex items-center justify-center rounded-full transition-all cursor-pointer ${
        isWishlisted ? "text-red-500" : "text-gray-400 hover:text-red-500"
      } ${loading ? "opacity-50 pointer-events-none" : ""} ${className}`}
    >
      <Heart
        className={`w-full h-full ${
          isWishlisted ? "fill-red-500" : "fill-transparent"
        }`}
      />
    </button>
  );
}
