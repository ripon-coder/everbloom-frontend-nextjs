// /app/api/profile/save-profile/route.ts
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    // Get token from HTTP-only cookies
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { status: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    // Extract multipart form data from the client request
    const formData = await req.formData();

    // Prepare new FormData for backend request
    const backendFormData = new FormData();

    // Append text fields
    ["name", "email", "phone"].forEach((field) => {
      const value = formData.get(field);
      if (value) backendFormData.append(field, value.toString());
    });

    // Append file if provided
    const file = formData.get("profile_thumbnail");
    if (file instanceof File) {
      backendFormData.append("profile_thumbnail", file);
    }

    // Forward the request to Laravel backend
    const response = await fetch(`${API_BASE_URL}/update-user`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: backendFormData,
    });

    // Parse backend response
    const text = await response.text();
    let data;

    try {
      data = JSON.parse(text);
    } catch {
      console.error("Laravel returned non-JSON:", text);
      return NextResponse.json(
        { status: false, message: "Invalid backend response", raw: text },
        { status: 500 }
      );
    }

    return NextResponse.json(data, { status: response.status });
  } catch (err) {
    console.error("Save profile error:", err);
    return NextResponse.json(
      { status: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
