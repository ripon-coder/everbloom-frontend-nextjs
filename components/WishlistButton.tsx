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

  const handleWishlist = async () => {
    const newState = !isWishlisted;

    // Optimistically update state
    setIsWishlisted(newState);

    if (newState) {
      // Only show toast.promise when adding
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
            throw new Error(data.message || "Failed to add to wishlist");
          }
          return data.message || "Added to wishlist!";
        })(),
        {
          loading: "Adding to wishlist...",
          success: (msg) => msg,
          error: (err) => err?.toString() || "Failed to add to wishlist",
        }
      );
    } else {
      // When removing, just update state without toast
      try {
        await fetch("/api/wishlist/add", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ product_id: productId }),
        });
      } catch {
        setIsWishlisted(!newState); // rollback on error
      }
    }
  };

  return (
    <button
      onClick={handleWishlist}
      title={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
      className={`flex items-center justify-center rounded-full transition-all cursor-pointer ${
        isWishlisted ? "text-red-500" : "text-gray-400 hover:text-red-500"
      } ${className}`}
    >
      <Heart
        className={`w-full h-full ${
          isWishlisted ? "fill-red-500" : "fill-transparent"
        }`}
      />
    </button>
  );
}
