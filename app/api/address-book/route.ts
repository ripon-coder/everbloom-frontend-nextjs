// /app/api/get-address/route.ts
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export async function GET(request: Request) {
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
    const { searchParams } = new URL(request.url);
    const apiUrl = new URL(`${API_BASE_URL}/get-address`);

    // Call external API with Bearer token
    const response = await fetch(apiUrl.toString(), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // pass token
      },
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Failed to fetch address: ${response.status} ${text}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("GET /get-address error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
