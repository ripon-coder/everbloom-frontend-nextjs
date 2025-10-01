import { NextResponse } from "next/server";
import { API_BASE_URL } from "@/lib/config";

export async function GET(request: Request) {
  try {
    console.log("API route /api/shop-attribute called");
    
    const { searchParams } = new URL(request.url);
    const categorySlug = searchParams.get('category');
    const categoryId = searchParams.get('category_id');
    
    // Construct the URL for the external API for shop attributes
    const externalApiUrl = new URL(`${API_BASE_URL}/shop-attribute`);
    
    // Pass category slug to external API if present
    if (categorySlug) {
      externalApiUrl.searchParams.append('category', categorySlug);
    }
    
    // Pass category ID to external API if present
    if (categoryId) {
      externalApiUrl.searchParams.append('category_id', categoryId);
    }
    
    console.log("Calling external API:", externalApiUrl.toString());

    // Fetch shop attributes from the external API
    const response = await fetch(externalApiUrl.toString());
    console.log("External API response status:", response.status);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch shop attributes: ${response.status}`);
    }
    const data = await response.json();
    console.log("External API response data:", data);

    // Pass through the external API response directly without manipulation
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error in /api/shop-attribute:", error);
    return NextResponse.json(
      { error: "Failed to fetch shop attribute data" },
      { status: 500 }
    );
  }
}
