import { NextResponse } from "next/server";
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export async function GET(request: Request) {
  try {
    const apiUrl = new URL(`${API_BASE_URL}/district-list`);
    const response = await fetch(apiUrl.toString());

    if (!response.ok) {
      throw new Error(`Failed to fetch variant: ${response.statusText}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
