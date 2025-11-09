// /app/api/login/route.ts
export const runtime = "nodejs"; // Ensure cookies API works

import { NextResponse } from "next/server";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { login, password, remember } = body;

    if (!login || !password) {
      return NextResponse.json(
        { status: false, message: "Login and password are required" },
        { status: 400 }
      );
    }

    // Call backend API
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ login, password, remember }),
    });

    const data = await response.json();

    // Backend returned error
    if (!response.ok || !data.status) {
      return NextResponse.json(
        { status: false, message: data.message || "Invalid Credential" },
        { status: response.status || 400 }
      );
    }

    // Extract token and user
    const token = data.data?.access_token;
    const user = data.data?.user;

    if (!token || !user) {
      console.error("Unexpected API response:", data);
      return NextResponse.json(
        { status: false, message: "Invalid API response" },
        { status: 500 }
      );
    }

    // Set HTTP-only cookie
    const res = NextResponse.json({
      status: true,
      message: "Login Successful",
      data: user,
    });

    res.cookies.set("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
      path: "/",
      maxAge: remember ? 60 * 60 * 24 * 30 : 60 * 60 * 24, // 30 days if remember, else 1 day
    });

    return res;
  } catch (err) {
    console.error("Login error:", err);
    return NextResponse.json(
      { status: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
