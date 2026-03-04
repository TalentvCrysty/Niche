"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

// Simple in-memory cache for large config payloads
// Note: This works per-instance. In production with multiple instances, 
// consider Redis or let fetch caching handle it.
const configCache = new Map<string, { data: any; timestamp: number }>();
const CACHE_TTL = 60 * 1000; // 60 seconds

export async function getConfig(key: string) {
  // Check in-memory cache first
  const cached = configCache.get(key);
  const now = Date.now();

  if (cached && (now - cached.timestamp) < CACHE_TTL) {
    return cached.data;
  }

  try {
    const response = await fetch(`${BACKEND_URL}/api/config/${key}`, {
      // Disable Next.js Data Cache to avoid 2MB limit errors with base64 images
      // We rely on the in-memory cache implemented above
      cache: "no-store",
    });

    if (!response.ok) {
      if (response.status === 404) return null;
      throw new Error("Failed to fetch config");
    }

    const data = await response.json();

    // Store in memory cache
    configCache.set(key, { data, timestamp: now });

    return data;
  } catch (error) {
    console.error(`Error fetching ${key} config:`, error);
    // Return stale cache if available on error
    if (cached) return cached.data;
    return null;
  }
}

// Clear cache for a specific key or all keys
export async function clearConfigCache(key?: string) {
  if (key) {
    configCache.delete(key);
  } else {
    configCache.clear();
  }
}

export async function updateConfig(key: string, data: any) {
  try {
    const token = (await cookies()).get("admin_token")?.value;

    if (!token) {
      return { success: false, error: "Unauthorized" };
    }

    const response = await fetch(`${BACKEND_URL}/api/config/${key}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return { success: false, error: errorData.error || "Failed to update config" };
    }

    // Clear in-memory cache for updated config
    configCache.delete(key);

    // Revalidate pages to show changes
    revalidatePath("/");
    revalidatePath("/admin/dashboard");
    revalidatePath("/works");

    return { success: true };
  } catch (error) {
    console.error(`Error updating ${key} config:`, error);
    return { success: false, error: "Failed to connect to server" };
  }
}
