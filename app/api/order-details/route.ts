// /app/api/get-address/route.ts
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export async function POST(request: Request) {
  try {
    // Get token from HTTP-only cookie
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    if (!token) {
      return NextResponse.json(
        { status: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    // Prepare API URL
    const { order_id } = await request.json();
    const apiUrl = new URL(`${API_BASE_URL}/get-order-details`);

    // Call external API with Bearer token
    const response = await fetch(apiUrl.toString(), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // pass token
      },
      body: JSON.stringify({ order_id }),
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Failed to fetch order details: ${response.status} ${text}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("GET /get-order-details error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
