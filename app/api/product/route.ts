import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export async function GET(request: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    const { searchParams } = new URL(request.url);
    const apiUrl = new URL(`${API_BASE_URL}/product`);


    searchParams.forEach((value, key) => {
      if (value) apiUrl.searchParams.append(key, value);
    });

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    const fallbackCookie = request.headers.get("cookie");
    if (!token && fallbackCookie) {
      const match = fallbackCookie.match(/token=([^;]+)/);
      if (match) {
        headers.Authorization = `Bearer ${match[1]}`;
      }
    } else if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(apiUrl.toString(), {
      method: "GET",
      headers,
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch products: ${response.statusText}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error in /api/product route:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
