"use client";

import React from "react";

export default function FlashSaleComponent({
  slug,
  flashSale,
}: {
  slug: string;
  flashSale: any[];
}) {
  if (!slug) {
    return null;
  }

  if (!flashSale || flashSale.length === 0) {
    return (
      <div className="bg-white p-4 rounded-xl shadow-md">
        <h2 className="text-lg font-semibold text-gray-700 mb-3">
          Flash Sale
        </h2>
        <p className="text-sm text-gray-400">No flash sale available.</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-4 rounded-xl shadow-md">
      <h2 className="text-lg font-semibold text-gray-700 mb-3">
        Flash Sale ({slug})
      </h2>
    </div>
  );
}
