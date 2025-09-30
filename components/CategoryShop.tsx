"use client";

import { useState, useEffect } from "react";
import { API_BASE_URL } from "@/lib/config";

// Skeleton component for a single category item
const CategoryItemSkeleton = ({ level = 0 }: { level?: number }) => {
  const paddingClass = level === 0 ? "pl-3" : `pl-${3 + level * 4}`;
  return (
    <div className={`${paddingClass} py-2 animate-pulse`}>
      <div className="flex justify-between items-center">
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        <div className="h-4 w-4 bg-gray-200 rounded"></div>
      </div>
    </div>
  );
};

// Skeleton for the "Show More/Less" buttons
const ShowMoreSkeleton = () => (
  <div className="flex gap-2 mt-3 pl-3">
    <div className="h-6 bg-gray-200 rounded w-20"></div>
    <div className="h-6 bg-gray-200 rounded w-20"></div>
  </div>
);

export default function CategoryShop() {
  const [categories, setCategories] = useState<any[]>([]);
  const [expandedCategories, setExpandedCategories] = useState<number[]>([]);
  const [visibleCategoryCount, setVisibleCategoryCount] = useState(5);
  const [isLoading, setIsLoading] = useState(true);
  const CATEGORY_INCREMENT = 5;

  useEffect(() => {
    const fetchCategories = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`${API_BASE_URL}/all-category`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const toggleCategory = (id: number) => {
    setExpandedCategories((prev) =>
      prev.includes(id) ? prev.filter((cid) => cid !== id) : [...prev, id]
    );
  };

  const displayedCategories = categories.slice(0, visibleCategoryCount);

  const handleShowMore = () => {
    setVisibleCategoryCount((prevCount) => prevCount + CATEGORY_INCREMENT);
  };

  const handleShowLess = () => {
    setVisibleCategoryCount((prevCount) => Math.max(5, prevCount - CATEGORY_INCREMENT));
  };

  if (isLoading) {
    return (
      <div className="space-y-1">
        {/* Render 5 skeletons initially */}
        {Array.from({ length: visibleCategoryCount }).map((_, index) => (
          <CategoryItemSkeleton key={index} level={0} />
        ))}
        <ShowMoreSkeleton />
      </div>
    );
  }

  return (
    <div className="space-y-1 p-2 bg-white">
      {displayedCategories.map((cat) => (
        <CategoryItem
          key={cat.id}
          category={cat}
          expandedCategories={expandedCategories}
          toggleCategory={toggleCategory}
          level={0}
        />
      ))}
      <div className="flex gap-2 mt-3 pt-2">
        {visibleCategoryCount < categories.length && (
          <button
            onClick={handleShowMore}
            className="text-sm font-semibold text-orange-600 bg-orange-50 hover:bg-orange-100 py-1 px-3 rounded-md transition-colors duration-200"
          >
            Show More
          </button>
        )}
        {visibleCategoryCount > 5 && (
          <button
            onClick={handleShowLess}
            className="text-sm font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 py-1 px-3 rounded-md transition-colors duration-200"
          >
            Show Less
          </button>
        )}
      </div>
    </div>
  );
}

// Recursive CategoryItem
function CategoryItem({
  category,
  expandedCategories,
  toggleCategory,
  level,
}: any) {
  const hasChildren = category.children && category.children.length > 0;
  const isExpanded = expandedCategories.includes(category.id);

  // Dynamic padding for nested levels
  const paddingLeft = `pl-${1 + level * 4}`;

  return (
    <div className={paddingLeft}>
      <div
        className={`flex justify-between items-center py-2 px-0 transition-colors duration-200 text-sm text-gray-700`}
      >
        <span>{category.name}</span>
        {hasChildren && (
          <svg
            className={`w-4 h-4 text-gray-500 flex-shrink-0 transform transition-transform duration-200 cursor-pointer ${
              isExpanded ? "rotate-90" : "rotate-0"
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            onClick={() => toggleCategory(category.id)}
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
        <div className="mt-1 space-y-1 ml-2">
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
