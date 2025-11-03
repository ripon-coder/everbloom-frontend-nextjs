// app/checkout/error.tsx
"use client";

import { useEffect } from "react";
import Link from "next/link";

interface ErrorProps {
  error: Error;
  reset: () => void;
}

export default function CheckoutError({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error("Checkout page error:", error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6">
      <div className="max-w-md text-center bg-white p-8 rounded-lg shadow">
        <h1 className="text-3xl font-bold text-red-500 mb-4">Oops! Something went wrong</h1>
        <p className="text-gray-700 mb-6">
          {error.message || "Unable to load checkout page. Please try again."}
        </p>
        
        <div className="flex justify-center gap-3">
          <button
            onClick={() => reset()}
            className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 transition"
          >
            Try Again
          </button>
          <Link
            href="/cart"
            className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300 transition"
          >
            Go to Cart
          </Link>
        </div>
      </div>
    </div>
  );
}
