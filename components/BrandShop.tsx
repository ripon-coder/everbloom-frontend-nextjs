"use client";

// Define the type for a Brand object
interface Brand {
  id: number;
  name: string;
}

interface BrandShopProps {
  brands: Brand[];
  selectedBrand: string | null; // ID of the selected brand
  onBrandSelect: (brandId: string) => void; // Function to call when a brand is selected
}

export default function BrandShop({ brands, selectedBrand, onBrandSelect }: BrandShopProps) {
  // Loading state is now handled by the parent component (ShopPage)
  // No internal data fetching needed

  return (
    <div className="flex gap-2 flex-wrap">
      {brands.map((brand) => (
        <button
          key={brand.id}
          onClick={() => onBrandSelect(brand.id.toString())}
          className={`px-3 py-1 border rounded-md text-sm ${
            selectedBrand === brand.id.toString()
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
