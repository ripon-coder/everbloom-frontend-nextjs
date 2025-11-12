"use client";

import Cookies from "js-cookie";

/**
 * Save category ID to "viewed_categories" cookie.
 * Keeps last 10 unique IDs.
 */
export function trackCategoryView(categoryId: number) {
  try {
    const cookieName = "viewed_categories";
    let categories = Cookies.get(cookieName);
    let ids: number[] = categories ? JSON.parse(categories) : [];

    if (!ids.includes(categoryId)) {
      ids.push(categoryId);
      if (ids.length > 10) ids = ids.slice(-10); // Keep last 10
      Cookies.set(cookieName, JSON.stringify(ids), { expires: 7 });
    }
  } catch (error) {
    console.error("Error saving category ID:", error);
  }
}

/**
 * Read all viewed category IDs from cookie.
 */
export function getTrackedCategories(): number[] {
  try {
    const cookie = Cookies.get("viewed_categories");
    return cookie ? JSON.parse(cookie) : [];
  } catch {
    return [];
  }
}

/**
 * Clear viewed category tracking.
 */
export function clearTrackedCategories() {
  Cookies.remove("viewed_categories");
}
