import { NextResponse } from "next/server";
import { API_BASE_URL } from "@/lib/config";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const categorySlug = searchParams.get('category');

  try {
    // Construct the URL for the external API, including category slug if it exists
    const externalApiUrl = new URL(`${API_BASE_URL}/shop-filter`);
    if (categorySlug) {
      externalApiUrl.searchParams.append('category', categorySlug);
    }

    // Fetch all filter data from the external API
    const response = await fetch(externalApiUrl.toString());
    if (!response.ok) {
      throw new Error(`Failed to fetch shop filters: ${response.status}`);
    }
    const data = await response.json();

    // Pass through the external API response directly without manipulation
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error in /api/shop-filter:", error);
    return NextResponse.json(
      { error: "Failed to fetch filter data" },
      { status: 500 }
    );
  }
}
