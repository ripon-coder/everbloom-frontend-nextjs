import { NextResponse } from "next/server";
import { API_BASE_URL } from "@/lib/config";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const categoryId = searchParams.get('category_id');

  try {
    // Construct the URL for the external API, including category_id if it exists
    const externalApiUrl = new URL(`${API_BASE_URL}/shop-filter`);
    if (categoryId) {
      externalApiUrl.searchParams.append('category_id', categoryId);
    }

    // Fetch all filter data (categories, brands, attributes) from a single API endpoint
    const response = await fetch(externalApiUrl.toString());
    if (!response.ok) {
      throw new Error(`Failed to fetch shop filters: ${response.status}`);
    }
    const data = await response.json();

    // The API response structure is { status: true, message: "...", data: { brands: [...], categories: [...], attributes: [...] } }
    // We need to extract data from the nested 'data' object.
    const { data: filterData } = data; // Renaming the inner 'data' object to 'filterData'
    const { brands, categories, attributes } = filterData;

    // The external API already provides a hierarchical structure for categories.
    // We will pass it through directly without transformation.
    console.log("API Route - Passing through categories from external API:", categories);

    return NextResponse.json({
      brands,
      categories,
      attributes, // Include attributes in the response
    });
  } catch (error) {
    console.error("Error in /api/shop-filter:", error);
    return NextResponse.json(
      { error: "Failed to fetch filter data" },
      { status: 500 }
    );
  }
}
