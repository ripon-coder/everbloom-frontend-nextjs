import { NextResponse } from "next/server";
import { API_BASE_URL } from "@/lib/config";

export async function POST(request: Request) {
  try {
    // Parse JSON body
    const body = await request.json(); // { ids: [1, 2, 3] }
    const ids = body.ids || [];

    if (!Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json(
        { status: false, message: "No IDs provided", data: [] },
        { status: 400 }
      );
    }

    // Call external API with POST body
    const response = await fetch(`${API_BASE_URL}/variants`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids }), // Send ids in body
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch variants: ${response.statusText}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
