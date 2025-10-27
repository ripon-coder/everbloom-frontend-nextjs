// /app/api/get-address/delete/route.ts
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export async function DELETE(request: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    console.log("token:" +token);
    if (!token) {
      return NextResponse.json(
        { status: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    // Parse request body to get address ID
    const body = await request.json();
    const addressId = body.address_id; // <--- use address_id
    if (!addressId) {
      return NextResponse.json(
        { status: false, message: "address_id is required" },
        { status: 400 }
      );
    }

    // Prepare API URL
    const apiUrl = new URL(`${API_BASE_URL}/delete-address?address_id=${addressId}`);

    // Call external API with DELETE method
    const response = await fetch(apiUrl.toString(), {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Failed to delete address: ${response.status} ${text}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("DELETE /get-address/delete error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
