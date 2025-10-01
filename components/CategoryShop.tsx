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

  const handleRowClick = () => {
    onCategorySelect(category.id);
  };

  return (
    <div className="select-none">
      {/* Category Row */}
      <div
        className={`flex items-center py-1.5 px-2 rounded-md cursor-pointer group hover:bg-gray-100 transition-colors duration-150 ${
          isExpanded ? 'bg-blue-50' : ''
        }`}
        onClick={handleRowClick}
        style={{ paddingLeft: `${level * 20 + 8}px` }} // Indentation based on level
      >
        {/* Expand/Collapse Icon */}
        {hasChildren && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleExpand(category.id);
            }}
            className="mr-1 flex-shrink-0 p-1 rounded hover:bg-gray-200 transition-colors"
          >
            <svg
              className={`w-4 h-4 text-gray-600 transform transition-transform duration-200 ${
                isExpanded ? "rotate-90" : "rotate-0"
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        )}

        {/* Category Icon */}
        <div className="mr-2 flex-shrink-0">
          {hasChildren ? (
            <svg
              className={`w-4 h-4 text-amber-500 ${isExpanded ? '' : 'text-amber-500'}`}
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
            </svg>
          ) : (
            <svg
              className="w-4 h-4 text-amber-500"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V8a2 2 0 00-2-2h-5L9 4H4zm7 5a1 1 0 10-2 0 1 1 0 002 0zm-3-1a1 1 0 11-2 0 1 1 0 012 0z" clipRule="evenodd" />
            </svg>
          )}
        </div>

        {/* Category Name */}
        <span className={`text-sm font-medium truncate ${isExpanded ? 'text-blue-700' : 'text-gray-700'}`}>
          {category.name}
        </span>
      </div>

      {/* Children Container */}
      {isExpanded && hasChildren && (
        <div>
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
    <div className="bg-white rounded-lg p-3 space-y-1">
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
