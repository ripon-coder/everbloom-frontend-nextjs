import { NextResponse } from "next/server";
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export async function GET(request: Request) {
  try {

    // Fetch data from external API
    const response = await fetch(`${API_BASE_URL}/shop-category-brand`);
    if (!response.ok) {
      throw new Error(`Failed to fetch shop filters: ${response.status}`);
    }

    const data = await response.json();

    // Return data to client
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error in /api/shop-filter:", error);
    return NextResponse.json(
      { error: "Failed to fetch filter data" },
      { status: 500 }
    );
  }
}
