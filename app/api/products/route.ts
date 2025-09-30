import { NextResponse } from "next/server";
import { API_BASE_URL } from "@/lib/config"; // Assuming you have this config file

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  
  // Extract pagination parameters from the request
  const currentPage = searchParams.get("current_page") || "1";
  // Note: The client-side logic shows 5 at a time, but fetches in larger batches.
  // The per_page here is what the external API expects per request.
  // We will let the client decide how many to fetch per API call.
  // For now, we just forward it.
  const perPage = searchParams.get("per_page"); 

  try {
    const apiUrl = new URL(`${API_BASE_URL}/shop-products`);
    
    // Forward pagination parameters to the external API
    apiUrl.searchParams.append("current_page", currentPage);
    if (perPage) {
      apiUrl.searchParams.append("per_page", perPage);
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
