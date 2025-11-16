import { NextResponse } from "next/server";
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export async function GET(request: Request) {
  try {
    const apiUrl = `${API_BASE_URL}/parent-category`;

    const response = await fetch(apiUrl, {
      cache: "no-store", // 👈 FIX
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch parent category: ${response.statusText}`);
    }

    const data = await response.json();
    return NextResponse.json(data, {
      headers: {
        "Cache-Control": "no-store", // 👈 Double protection
      },
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
