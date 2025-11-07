import { cookies } from "next/headers";

const ADMIN_KEY = "admin_session";

// ✅ Create session cookie
export async function setAdminSession() {
  const cookieStore = await cookies();
  cookieStore.set({
    name: ADMIN_KEY,
    value: "true",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 8, // 8 hours
  });
}

// ✅ Remove session cookie
export async function removeAdminSession() {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_KEY);
}

// ✅ Verify if admin session exists
export async function verifyAdminSession() {
  const cookieStore = await cookies();
  const cookie = cookieStore.get(ADMIN_KEY);
  return cookie?.value === "true";
}
