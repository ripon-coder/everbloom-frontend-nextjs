// /app/api/profile/save-profile/route.ts
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    if (!token) return NextResponse.json({ status: false, message: "Unauthorized" }, { status: 401 });

    // Read raw body
    const body = await req.arrayBuffer();

    // Forward to Laravel
    const res = await fetch(`${API_BASE_URL}/update-user`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": req.headers.get("Content-Type") || "",
      },
      body,
    });

    // Safely parse JSON if possible
    const resText = await res.text();
    let data;
    try {
      data = JSON.parse(resText);
    } catch {
      console.error("Backend returned non-JSON:", resText);
      return NextResponse.json({ status: false, message: "Backend returned invalid JSON" }, { status: 500 });
    }

    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    console.error("Save profile error:", err);
    return NextResponse.json({ status: false, message: "Internal Server Error" }, { status: 500 });
  }
}
