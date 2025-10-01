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

// Recursive CategoryItem component
function CategoryItem({
  category,
  level,
  expandedIds,
  onCategorySelect,
  onToggleExpand,
}: {
  category: Category;
  level: number;
  expandedIds: number[];
  onCategorySelect: (categoryId: number) => void;
  onToggleExpand: (categoryId: number) => void;
}) {
  const isExpanded = expandedIds.includes(category.id);
  const hasChildren = category.children && category.children.length > 0;
  const paddingLeft = `pl-${2 + level * 4}`; // Dynamic padding for nested levels

  const handleNameClick = () => {
    onCategorySelect(category.id);
    if (hasChildren && !isExpanded) {
      onToggleExpand(category.id);
    }
  };

  return (
    <div>
      <div
        className={`flex justify-between items-center py-2 px-0 transition-colors duration-200 text-sm text-gray-700 cursor-pointer hover:text-orange-600 ${isExpanded ? 'font-semibold' : ''}`}
      >
        <span onClick={handleNameClick} className="flex-grow">
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
            onClick={() => onToggleExpand(category.id)}
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
        <div className={`mt-1 space-y-1 ${paddingLeft}`}>
          {category.children.map((child) => (
            <CategoryItem
              key={child.id}
              category={child}
              level={level + 1}
              expandedIds={expandedIds}
              onCategorySelect={onCategorySelect}
              onToggleExpand={onToggleExpand}
            />
          ))}
        </div>
      )}
    </div>
  );
}


export default function CategoryShop({ categories, onCategorySelect }: CategoryShopProps) {
  // State now holds an array of expanded IDs to support multiple independent expansions.
  const [expandedIds, setExpandedIds] = useState<number[]>([]);

  const handleToggleExpand = (categoryId: number) => {
    setExpandedIds(prevIds =>
      prevIds.includes(categoryId)
        ? prevIds.filter((id) => id !== categoryId)
        : [...prevIds, categoryId]
    );
  };

  // Effect to ensure the single parent is always expanded if it's the only one.
  const topLevelParentsWithChildren = categories.filter(cat => cat.parent_id === null && cat.children && cat.children.length > 0);
  if (topLevelParentsWithChildren.length === 1) {
    const singleParentId = topLevelParentsWithChildren[0].id;
    if (!expandedIds.includes(singleParentId)) {
      setExpandedIds(prevIds => [...prevIds, singleParentId]);
    }
  }

  if (categories.length === 0) {
    return <p className="text-sm text-gray-500">No categories available.</p>;
  }

  return (
    <div className="space-y-1 p-2 bg-white">
      {categories.map((category) => (
        <CategoryItem
          key={category.id}
          category={category}
          level={0}
          expandedIds={expandedIds}
          onCategorySelect={onCategorySelect}
          onToggleExpand={handleToggleExpand}
        />
      ))}
    </div>
  );
}
