"use client";

import { useState, useEffect } from "react";
import { API_BASE_URL } from "@/lib/config";

export default function BrandShop() {
  const [brands, setBrands] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch brands from API
  useEffect(() => {
    const fetchBrands = async () => {
      setIsLoading(true); // Start loading
      try {
        const response = await fetch(`${API_BASE_URL}/all-brands`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setBrands(data);
      } catch (error) {
        console.error("Failed to fetch brands:", error);
        // Optionally, set an error state or show a message to the user
      } finally {
        setIsLoading(false); // Stop loading, regardless of success or error
      }
    };

    fetchBrands();
  }, []); // Empty dependency array means this effect runs once on mount

  if (isLoading) {
    return (
      <div className="flex gap-2 flex-wrap">
        <p>Loading brands...</p>
        {/* You can replace this with a spinner component if you have one */}
      </div>
    );
  }

  return (
    <div className="flex gap-2 flex-wrap">
      {brands.map((brand) => (
        <button
          key={brand.id}
          // onClick logic for brand selection will be handled by the parent component
          className="px-3 py-1 border rounded-md text-sm hover:bg-gray-100"
        >
          {brand.name}
        </button>
      ))}
    </div>
  );
}
