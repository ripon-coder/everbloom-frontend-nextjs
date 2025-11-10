import { NextResponse } from "next/server";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export async function POST(request: Request) {
  try {
    // Parse JSON array from body
    const body = await request.json();

    // Must be an array of objects like:
    // [ { product_id, variants_id, flash_sale }, ... ]
    if (!Array.isArray(body) || body.length === 0) {
      return NextResponse.json(
        {
          status: false,
          message: "Request body must be a non-empty array.",
          data: [],
        },
        { status: 400 }
      );
    }

    // ✅ Validate each object structure properly
    const isValid = body.every(
      (item) =>
        typeof item === "object" &&
        item.hasOwnProperty("product_id") &&
        item.hasOwnProperty("variants_id")
    );

    if (!isValid) {
      return NextResponse.json(
        {
          status: false,
          message:
            "Each item must contain at least 'product_id' and 'variants_id'.",
          data: [],
        },
        { status: 400 }
      );
    }

    // ✅ Prepare formatted data before sending to external API
    const formattedData = body.map((item) => ({
      product_id: Number(item.product_id),
      variants_id: Number(item.variants_id),
      flash_sale: item.flash_sale || null,
    }));

    // ✅ Forward data to Laravel backend
    const response = await fetch(`${API_BASE_URL}/variants`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formattedData),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch variants: ${response.statusText}`);
    }

    const data = await response.json();

    // ✅ Return Laravel’s response to frontend
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("Error fetching variants:", error);
    return NextResponse.json(
      { status: false, message: "Internal Server Error", data: [] },
      { status: 500 }
    );
  }
}
