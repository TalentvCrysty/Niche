"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

const BACKEND_URL = "http://localhost:3005";

export interface Product {
  id?: number;
  slug: string;
  name: string;
  type: string;
  short_description: string;
  long_description: string;
  price_amount: number | null;
  price_currency: string;
  price_period: string;
  badge?: string;
  is_featured: boolean;
  tags: string[];
  includes: string[];
  best_for?: string;
  image?: string | null;
  purchase_url?: string | null;
  status: string;
  sort_order: number;
}

export async function getProducts(status?: string) {
  try {
    const params = status ? `?status=${encodeURIComponent(status)}` : "";
    const res = await fetch(`${BACKEND_URL}/api/products${params}`, {
      cache: "no-store",
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.map((p: any) => ({
      ...p,
      tags: p.tags ? JSON.parse(p.tags) : [],
      includes: p.includes ? JSON.parse(p.includes) : [],
    }));
  } catch {
    return [];
  }
}

export async function getProductBySlug(slug: string) {
  try {
    const res = await fetch(`${BACKEND_URL}/api/products/${slug}`, {
      cache: "no-store",
    });
    if (!res.ok) return null;
    const p = await res.json();
    return {
      ...p,
      tags: p.tags ? JSON.parse(p.tags) : [],
      includes: p.includes ? JSON.parse(p.includes) : [],
    } as Product;
  } catch {
    return null;
  }
}

export async function getProductById(id: number) {
  try {
    const res = await fetch(`${BACKEND_URL}/api/products/id/${id}`, {
      cache: "no-store",
    });
    if (!res.ok) return null;
    const p = await res.json();
    return {
      ...p,
      tags: p.tags ? JSON.parse(p.tags) : [],
      includes: p.includes ? JSON.parse(p.includes) : [],
    } as Product;
  } catch {
    return null;
  }
}

export async function createProduct(data: Product) {
  try {
    const token = (await cookies()).get("admin_token")?.value;
    if (!token) return { success: false, error: "Unauthorized" };
    const res = await fetch(`${BACKEND_URL}/api/products`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    const body = await res.json();
    if (!res.ok) {
      return { success: false, error: body.error || "Failed to create product" };
    }
    revalidatePath("/store");
    revalidatePath("/admin/products");
    return { success: true, id: body.id };
  } catch {
    return { success: false, error: "Failed to connect to server" };
  }
}

export async function updateProduct(id: number, data: Product) {
  try {
    const token = (await cookies()).get("admin_token")?.value;
    if (!token) return { success: false, error: "Unauthorized" };
    const res = await fetch(`${BACKEND_URL}/api/products/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    const body = await res.json();
    if (!res.ok) {
      return { success: false, error: body.error || "Failed to update product" };
    }
    revalidatePath("/store");
    revalidatePath("/admin/products");
    revalidatePath(`/store/${data.slug}`);
    return { success: true };
  } catch {
    return { success: false, error: "Failed to connect to server" };
  }
}

export async function deleteProduct(id: number) {
  try {
    const token = (await cookies()).get("admin_token")?.value;
    if (!token) return { success: false, error: "Unauthorized" };
    const res = await fetch(`${BACKEND_URL}/api/products/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const body = await res.json();
    if (!res.ok) {
      return { success: false, error: body.error || "Failed to delete product" };
    }
    revalidatePath("/store");
    revalidatePath("/admin/products");
    return { success: true };
  } catch {
    return { success: false, error: "Failed to connect to server" };
  }
}

