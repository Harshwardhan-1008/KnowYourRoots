// app/api/auth/route.ts
import { NextResponse } from "next/server";
import { setAdminSession, removeAdminSession } from "@/lib/session";


const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@knowyourroots.com";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "harsh123";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      setAdminSession();
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ success: false, message: "Invalid credentials" });
    }
  } catch (err) {
    console.error("Login error:", err);
    return NextResponse.json({ success: false, message: "Server error" });
  }
}

export async function DELETE() {
  removeAdminSession();
  return NextResponse.json({ success: true });
}
