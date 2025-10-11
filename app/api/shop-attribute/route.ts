import { NextResponse } from "next/server";
import { API_BASE_URL } from "@/lib/config";

export async function GET(request: Request) {
  try {
    // Get query parameters from request
    const { searchParams } = new URL(request.url);
    const categorySlug = searchParams.get("category");
    const categoryId = searchParams.get("category_id");
    console.log("any", { categorySlug, categoryId });
    // Build external API URL
    const externalApiUrl = new URL(`${API_BASE_URL}/shop-attribute`);

    if (categorySlug) {
      externalApiUrl.searchParams.append("category", categorySlug);
    }

    if (categoryId) {
      externalApiUrl.searchParams.append("category_id", categoryId);
    }

    // Fetch data from external API
    const response = await fetch(externalApiUrl.toString());

    if (!response.ok) {
      throw new Error(`Failed to fetch shop attributes: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error in /api/shop-attribute:", error);
    return NextResponse.json(
      { error: "Failed to fetch shop attribute data" },
      { status: 500 }
    );
  }
}
