// /app/api/address-book/save/route.ts
export const runtime = "nodejs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export async function DELETE(request: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    if (!token) {
      return NextResponse.json(
        { status: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { wishlist_id } = body;

    // Call backend API
    const response = await fetch(`${API_BASE_URL}/delete-wishlist`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        wishlist_id,
      }),
    });

    const data = await response.json();

    // Forward backend status code and full response
    return NextResponse.json(data, { status: response.status });
  } catch (err) {
    console.error("add wishlist error:", err);
    return NextResponse.json(
      { status: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
