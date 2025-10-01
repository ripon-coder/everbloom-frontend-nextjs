"use client";

// Define the type for a Brand object
interface Brand {
  id: number;
  name: string;
}

interface BrandShopProps {
  brands: Brand[];
}

export default function BrandShop({ brands }: BrandShopProps) {
  // Loading state is now handled by the parent component (ShopPage)
  // No internal data fetching needed

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
