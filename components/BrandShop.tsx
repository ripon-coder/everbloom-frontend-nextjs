"use client";

// Define the type for a Brand object
interface Brand {
  id: number;
  name: string;
  slug: string;
}

interface BrandShopProps {
  brands: Brand[];
  selectedBrand: string | null;
  onBrandSelect: (brandSlug: string) => void;
  isLoading?: boolean;
}

export default function BrandShop({
  brands,
  selectedBrand,
  onBrandSelect,
  isLoading = false,
}: BrandShopProps) {
  if (isLoading) {
    // Skeleton loader
    return (
      <div className="flex gap-2 flex-wrap">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="h-6 w-20 bg-gray-200 rounded-md animate-pulse"
          ></div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex gap-2 flex-wrap">
      {brands.map((brand) => (
        <button
          key={brand.id}
          onClick={() => onBrandSelect(brand.slug)}
          className={`px-3 py-1 border rounded-md text-sm ${
            selectedBrand === brand.slug
              ? "bg-orange-50 border-orange-500 text-orange-600"
              : "hover:bg-gray-100"
          }`}
        >
          {brand.name}
        </button>
      ))}
    </div>
  );
}
