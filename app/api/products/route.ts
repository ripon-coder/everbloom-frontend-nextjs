import { NextResponse } from "next/server";
import { API_BASE_URL } from "@/lib/config"; // Assuming you have this config file

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  
  // Extract pagination parameters from the request
  const currentPage = searchParams.get("current_page") || "1";
  const perPage = searchParams.get("per_page"); 

  // Extract filter parameters from the request
  const brandId = searchParams.get("brand_id");
  const categoryId = searchParams.get("category_id");
  const color = searchParams.get("color");
  const type = searchParams.get("type");
  const maxPrice = searchParams.get("max_price");

  try {
    const apiUrl = new URL(`${API_BASE_URL}/shop-products`);
    
    // Forward pagination parameters to the external API
    apiUrl.searchParams.append("current_page", currentPage);
    if (perPage) {
      apiUrl.searchParams.append("per_page", perPage);
    }

    // Forward filter parameters to the external API if they exist
    if (brandId) {
      apiUrl.searchParams.append("brand_id", brandId);
    }
    if (categoryId) {
      apiUrl.searchParams.append("category_id", categoryId);
    }
    if (color) {
      apiUrl.searchParams.append("color", color);
    }
    if (type) {
      apiUrl.searchParams.append("type", type);
    }
    if (maxPrice) {
      apiUrl.searchParams.append("max_price", maxPrice);
    }

    const response = await fetch(apiUrl.toString());

    if (!response.ok) {
      throw new Error(`Failed to fetch products: ${response.statusText}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error in /api/products route:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
