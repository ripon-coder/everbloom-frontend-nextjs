import { NextResponse } from "next/server";
import { API_BASE_URL } from "@/lib/config";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const apiUrl = new URL(`${API_BASE_URL}/shop-products`);

    // Forward all query parameters dynamically
    searchParams.forEach((value, key) => {
      if (!value) return;

      // Pass brand and category as-is
      apiUrl.searchParams.append(key, value);
    });

    const response = await fetch(apiUrl.toString());

    if (!response.ok) {
      throw new Error(`Failed to fetch products: ${response.statusText}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error in /api/products route:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
