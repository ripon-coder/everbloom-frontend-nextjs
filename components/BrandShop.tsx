"use client";

// Define the type for a Brand object
interface Brand {
  id: number;
  name: string;
  slug: string; // Add slug
}

interface BrandShopProps {
  brands: Brand[];
  selectedBrand: string | null; // slug of the selected brand
  onBrandSelect: (brandSlug: string) => void; // Function to call when a brand is selected
}

export default function BrandShop({ brands, selectedBrand, onBrandSelect }: BrandShopProps) {
  return (
    <div className="flex gap-2 flex-wrap">
      {brands.map((brand) => (
        <button
          key={brand.id}
          onClick={() => onBrandSelect(brand.slug)} // send slug instead of ID
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
