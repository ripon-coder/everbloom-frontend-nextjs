"use client";

import { useState } from "react";

// Define the type for a Category object (must match the one in app/shop/page.tsx)
interface Category {
  id: number;
  parent_id: number | null;
  name: string;
  slug: string;
  parent?: Category; // Optional parent object
  children: Category[];
}

interface CategoryShopProps {
  categories: Category[];
  onCategorySelect: (categoryId: number) => void;
}

export default function CategoryShop({ categories, onCategorySelect }: CategoryShopProps) {
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const handleCategoryNameClick = (categoryId: number, hasChildren: boolean) => {
    onCategorySelect(categoryId);
    // When a category name is clicked, it should also expand if it has children and is not already expanded.
    if (hasChildren && expandedId !== categoryId) {
      setExpandedId(categoryId);
    }
  };

  const handleToggleExpand = (categoryId: number, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent the click from bubbling to the parent div
    setExpandedId(prevId => prevId === categoryId ? null : categoryId);
  };

  if (categories.length === 0) {
    return <p className="text-sm text-gray-500">No categories available.</p>;
  }

  return (
    <div className="space-y-1 p-2 bg-white">
      {categories.map((category) => {
        const isExpanded = expandedId === category.id;
        const hasChildren = category.children && category.children.length > 0;

        return (
          <div key={category.id}>
            <div
              className={`flex justify-between items-center py-2 px-0 transition-colors duration-200 text-sm text-gray-700 cursor-pointer hover:text-orange-600 ${isExpanded ? 'font-semibold' : ''}`}
            >
              <span onClick={() => handleCategoryNameClick(category.id, hasChildren)} className="flex-grow">
                {category.name}
              </span>
              {hasChildren && (
                <svg
                  className={`w-4 h-4 text-gray-500 flex-shrink-0 transform transition-transform duration-200 cursor-pointer ${
                    isExpanded ? "rotate-90" : "rotate-0"
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  onClick={(e) => handleToggleExpand(category.id, e)}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              )}
            </div>
            {isExpanded && hasChildren && (
              <div className="mt-1 space-y-1 ml-4">
                {category.children.map((child) => (
                  <div
                    key={child.id}
                    className={`flex justify-between items-center py-2 px-0 transition-colors duration-200 text-sm text-gray-600 cursor-pointer hover:text-orange-600`}
                    onClick={() => onCategorySelect(child.id)}
                  >
                    <span>{child.name}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
