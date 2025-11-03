import React from "react";

const ProductSkeleton = () => {
  return (
    <div className="bg-white border overflow-hidden shadow-sm rounded-md animate-pulse">
      {/* Skeleton for Image */}
      <div className="relative w-full h-32 sm:h-40 md:h-48 lg:h-56 bg-gray-200"></div>
      <div className="p-2 space-y-3">
        {/* Skeleton for Product Name */}
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        {/* Skeleton for Product Price */}
        <div className="h-6 bg-gray-200 rounded w-1/2"></div>
      </div>
    </div>
  );
};

export default ProductSkeleton;
