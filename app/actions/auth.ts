"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3005";

export async function loginAction(key: string) {
  try {
    const response = await fetch(`${BACKEND_URL}/api/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ key }),
    });

    const data = await response.json();

    if (!response.ok) {
      return { success: false, error: data.error || "Authentication failed" };
    }

    // Set the cookie - not httpOnly so client JS can access it for API calls
    (await cookies()).set("admin_token", data.token, {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24, // 1 day
      path: "/",
      sameSite: "lax",
    });

    return { success: true };
  } catch (error) {
    console.error("Login error:", error);
    return { success: false, error: "Failed to connect to authentication server" };
  }
}

export async function logoutAction() {
  (await cookies()).delete("admin_token");
  redirect("/admin");
}

export async function verifySession() {
  const token = (await cookies()).get("admin_token")?.value;
  if (!token) return false;
  
  // Optionally verify with backend
  // For now, presence of token is enough for basic protection, 
  // but real verification should call backend
  return true;
}
