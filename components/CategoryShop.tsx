"use client";

import { useEffect, useState, useMemo } from "react";

interface Category {
  id: number;
  parent_id: number | null;
  name: string;
  slug: string;
  parent?: Category;
  children?: Category[];
}

interface CategoryShopProps {
  categories: Category[];
  selectedCategorySlug: string | null;
  setCategorySlug: (slug: string) => void;
  isLoading?: boolean;
}

function CategoryItem({
  category,
  level,
  expandedSlug,
  setCategorySlug,
  onToggleExpand,
  selectedCategorySlug,
}: {
  category: Category;
  level: number;
  expandedSlug: string[];
  setCategorySlug: (slug: string) => void;
  onToggleExpand: (slug: string) => void;
  selectedCategorySlug: string | null;
}) {
  const isExpanded = expandedSlug.includes(category.slug);
  const hasChildren = category.children && category.children.length > 0;
  const isSelected = selectedCategorySlug === category.slug;

  const handleRowClick = () => {
    setCategorySlug(category.slug);
    8;
  };

  return (
    <div className="select-none">
      <div
        className={`flex items-center justify-between py-1.5 px-2 rounded-md cursor-pointer hover:bg-amber-50 transition ${
          isSelected ? "bg-amber-200" : ""
        }`}
        onClick={handleRowClick}
      >
        {/* Left section (folder + name) */}
        <div
          className="flex items-center gap-2 min-w-0 flex-1"
          style={{ paddingLeft: `${level * 20 + 8}px` }}
        >
          {/* Folder icon */}
          <div className="flex-shrink-0">
            <svg
              className="w-4 h-4 text-amber-500"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
            </svg>
          </div>

          {/* Category name */}
          <span
            className={`text-sm font-medium truncate ${
              isSelected ? "text-gray-900 font-semibold" : "text-gray-700"
            }`}
          >
            {category.name}
          </span>
        </div>

        {/* Right side expand arrow */}
        {hasChildren && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleExpand(category.slug);
            }}
            className="ml-2 flex-shrink-0 p-1 rounded hover:bg-gray-200"
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
      </div>

      {isExpanded && hasChildren && (
        <div>
          {category
            .children!.sort((a, b) => a.name.localeCompare(b.name))
            .map((child) => (
              <CategoryItem
                key={child.id}
                category={child}
                level={level + 1}
                expandedSlug={expandedSlug}
                setCategorySlug={setCategorySlug}
                onToggleExpand={onToggleExpand}
                selectedCategorySlug={selectedCategorySlug}
              />
            ))}
        </div>
      )}
    </div>
  );
}

export default function CategoryShop({
  categories,
  selectedCategorySlug,
  setCategorySlug,
  isLoading = false,
}: CategoryShopProps) {
  const [expandedSlug, setExpandedSlug] = useState<string[]>([]);

  // Convert flat list → nested tree + sort alphabetically
  const organizedCategories = useMemo(() => {
    if (!categories) return [];

    const categoryMap = new Map<number, Category>();
    const roots: Category[] = [];

    categories.forEach((cat) => {
      categoryMap.set(cat.id, { ...cat, children: [] });
    });

    categoryMap.forEach((cat) => {
      if (cat.parent_id && categoryMap.has(cat.parent_id)) {
        categoryMap.get(cat.parent_id)!.children!.push(cat);
      } else {
        roots.push(cat);
      }
    });

    const sortRecursive = (list: Category[]) => {
      list.sort((a, b) => a.name.localeCompare(b.name));
      list.forEach((cat) => {
        if (cat.children?.length) sortRecursive(cat.children);
      });
    };

    sortRecursive(roots);
    return roots;
  }, [categories]);

  const handleToggleExpand = (slug: string) => {
    setExpandedSlug((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]
    );
  };

  // Auto-expand parents when a child is selected
  function getParentSlugs(
    slug: string,
    list: Category[],
    parents: string[] = []
  ): string[] {
    for (const cat of list) {
      if (cat.slug === slug) return parents;
      if (cat.children?.length) {
        const found = getParentSlugs(slug, cat.children, [
          ...parents,
          cat.slug,
        ]);
        if (found.length) return found;
      }
    }
    return [];
  }

  useEffect(() => {
    if (selectedCategorySlug) {
      const parentSlugs = getParentSlugs(
        selectedCategorySlug,
        organizedCategories
      );
      setExpandedSlug(parentSlugs);
    }
  }, [selectedCategorySlug, organizedCategories]);

  if (isLoading) {
    // Skeleton loader
    return (
      <div className="space-y-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="h-6 bg-gray-200 rounded-md animate-pulse w-3/4"
          ></div>
        ))}
      </div>
    );
  }

  if (!organizedCategories.length)
    return <p className="text-sm text-gray-500">No categories available.</p>;

  return (
    <div className="bg-white rounded-lg p-3 space-y-1">
      {organizedCategories.map((category) => (
        <CategoryItem
          key={category.id}
          category={category}
          level={0}
          expandedSlug={expandedSlug}
          setCategorySlug={setCategorySlug}
          onToggleExpand={handleToggleExpand}
          selectedCategorySlug={selectedCategorySlug}
        />
      ))}
    </div>
  );
}
