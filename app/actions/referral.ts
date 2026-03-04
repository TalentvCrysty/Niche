"use server";

import { cookies } from "next/headers";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3005";

export async function registerReferral(name: string, email: string, password: string, role: string) {
  try {
    const res = await fetch(`${BACKEND_URL}/api/referrals/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password, role }),
    });
    const data = await res.json();
    if (!res.ok) {
      return { success: false, error: data.error || "Registration failed" };
    }
    if (data.token) {
      (await cookies()).set("referral_token", data.token, {
        httpOnly: false,
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24 * 7,
        path: "/",
        sameSite: "lax",
      });
    }
    return { success: true, referral_code: data.referral_code };
  } catch {
    return { success: false, error: "Failed to connect to server" };
  }
}

export async function loginReferral(email: string, password: string) {
  try {
    const res = await fetch(`${BACKEND_URL}/api/referrals/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) {
      return { success: false, error: data.error || "Login failed" };
    }
    if (data.token) {
      (await cookies()).set("referral_token", data.token, {
        httpOnly: false,
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24 * 7,
        path: "/",
        sameSite: "lax",
      });
    }
    return { success: true, referral_code: data.referral_code };
  } catch {
    return { success: false, error: "Failed to connect to server" };
  }
}

export async function logoutReferral() {
  (await cookies()).delete("referral_token");
}

export async function getReferralMe() {
  try {
    const token = (await cookies()).get("referral_token")?.value;
    if (!token) return null;
    const res = await fetch(`${BACKEND_URL}/api/referrals/me`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

export async function getReferralStats() {
  try {
    const token = (await cookies()).get("referral_token")?.value;
    if (!token) return null;
    const res = await fetch(`${BACKEND_URL}/api/referrals/stats`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

