"use client";

import { useState } from "react";
import ProductGrid from "@/components/ProductGrid"; // Your product component

export default function ShopPage() {
  // Categories with nested children
  const categories = [
    {
      id: 1,
      name: "Electronics",
      children: [
        {
          id: 11,
          name: "Mobile Phones",
          children: [
            { id: 111, name: "Android" },
            { id: 112, name: "iOS" },
          ],
        },
        {
          id: 12,
          name: "Laptops",
          children: [
            { id: 121, name: "Gaming Laptops" },
            { id: 122, name: "Ultrabooks" },
          ],
        },
        { id: 13, name: "Tablets" },
      ],
    },
    {
      id: 2,
      name: "Home Appliances",
      children: [
        {
          id: 21,
          name: "Refrigerators",
          children: [
            { id: 211, name: "Single Door" },
            { id: 212, name: "Double Door" },
          ],
        },
        {
          id: 22,
          name: "Washing Machines",
          children: [
            { id: 221, name: "Front Load" },
            { id: 222, name: "Top Load" },
          ],
        },
      ],
    },
    {
      id: 3,
      name: "Fashion",
      children: [
        {
          id: 31,
          name: "Men's Clothing",
          children: [
            { id: 311, name: "T-Shirts" },
            { id: 312, name: "Jeans" },
          ],
        },
        {
          id: 32,
          name: "Women's Clothing",
          children: [
            { id: 321, name: "Dresses" },
            { id: 322, name: "Tops" },
          ],
        },
      ],
    },
  ];

  // Brands
  const brands = [
    { id: 1, name: "Apple" },
    { id: 2, name: "Samsung" },
    { id: 3, name: "Sony" },
    { id: 4, name: "LG" },
    { id: 5, name: "Nike" },
    { id: 6, name: "Adidas" },
  ];

  // Filter states
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
  const [maxPrice, setMaxPrice] = useState<number>(2000);
  const [expandedCategories, setExpandedCategories] = useState<number[]>([]);

  // Toggle expand/collapse categories
  const toggleCategory = (id: number) => {
    setExpandedCategories((prev) =>
      prev.includes(id) ? prev.filter((cid) => cid !== id) : [...prev, id]
    );
  };

  // Reset filters
  const resetFilters = () => {
    setSelectedColor(null);
    setSelectedType(null);
    setSelectedBrand(null);
    setMaxPrice(2000);
    setExpandedCategories([]);
  };

  // Filters object to pass to product grid
  const filters = {
    color: selectedColor,
    type: selectedType,
    brand: selectedBrand,
    maxPrice,
  };

  return (
    <div className="p-4 bg-gray-50 min-h-screen">
      <div className="w-full mx-auto grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Filters */}
        <div className="bg-white rounded-xl shadow-md p-4 space-y-6">
          <h2 className="text-lg font-semibold">Filter Products</h2>

          {/* Color Filter */}
          <div>
            <h3 className="font-medium mb-2">Color</h3>
            <div className="flex gap-2 flex-wrap">
              {["Black", "White", "Red"].map((color) => (
                <button
                  key={color}
                  onClick={() =>
                    setSelectedColor(selectedColor === color ? null : color)
                  }
                  className={`px-3 py-1 border rounded-md text-sm ${
                    selectedColor === color
                      ? "bg-orange-50 border-orange-500 text-orange-600"
                      : "hover:bg-gray-100"
                  }`}
                >
                  {color}
                </button>
              ))}
            </div>
          </div>

          {/* Type Filter */}
          <div>
            <h3 className="font-medium mb-2">Type</h3>
            <div className="flex gap-2 flex-wrap">
              {["Wireless", "Wired"].map((type) => (
                <button
                  key={type}
                  onClick={() =>
                    setSelectedType(selectedType === type ? null : type)
                  }
                  className={`px-3 py-1 border rounded-md text-sm ${
                    selectedType === type
                      ? "bg-orange-50 border-orange-500 text-orange-600"
                      : "hover:bg-gray-100"
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

{/* Categories Filter */}
<div>
  <h3 className="font-medium mb-2">Categories</h3>
  <div className="space-y-1 text-sm text-gray-700">
    {categories.map((cat) => (
      <CategoryItem
        key={cat.id}
        category={cat}
        expandedCategories={expandedCategories}
        toggleCategory={toggleCategory}
        level={0} // top level
      />
    ))}
  </div>
</div>

          {/* Brands Filter */}
          <div>
            <h3 className="font-medium mb-2">Brands</h3>
            <div className="flex gap-2 flex-wrap">
              {brands.map((brand) => (
                <button
                  key={brand.id}
                  onClick={() =>
                    setSelectedBrand(selectedBrand === brand.name ? null : brand.name)
                  }
                  className={`px-3 py-1 border rounded-md text-sm ${
                    selectedBrand === brand.name
                      ? "bg-orange-50 border-orange-500 text-orange-600"
                      : "hover:bg-gray-100"
                  }`}
                >
                  {brand.name}
                </button>
              ))}
            </div>
          </div>

          {/* Price Filter */}
          <div>
            <h3 className="font-medium mb-2">Max Price: ৳{maxPrice}</h3>
            <input
              type="range"
              min={500}
              max={2000}
              step={50}
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full"
            />
          </div>

          {/* Reset Filters */}
          <button
            onClick={resetFilters}
            className="w-full bg-orange-500 text-white py-2 rounded-md hover:bg-orange-600 transition"
          >
            Reset Filters
          </button>
        </div>

        {/* Products */}
        <div className="md:col-span-3">
          <ProductGrid filters={filters} />
        </div>
      </div>
    </div>
  );
}

{/* Recursive CategoryItem */}
function CategoryItem({ category, expandedCategories, toggleCategory, level }: any) {
  const hasChildren = category.children && category.children.length > 0;
  const isExpanded = expandedCategories.includes(category.id);

  return (
    <div className={`ml-${level * 4}`}>
      <div
        className="flex justify-between items-center cursor-pointer hover:text-orange-500 transition-colors py-1"
        onClick={() => hasChildren && toggleCategory(category.id)}
      >
        <span>{category.name}</span>
        {hasChildren && (
          <svg
            className={`w-4 h-4 transform transition-transform ${
              isExpanded ? "rotate-90" : "rotate-0"
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        )}
      </div>

      {isExpanded && hasChildren && (
        <div className="mt-1 space-y-1">
          {category.children.map((child: any) => (
            <CategoryItem
              key={child.id}
              category={child}
              expandedCategories={expandedCategories}
              toggleCategory={toggleCategory}
              level={level + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}