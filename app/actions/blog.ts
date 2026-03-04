"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

const BACKEND_URL = "http://localhost:3005";

export interface BlogPost {
  id?: number;
  slug: string;
  title: string;
  description: string;
  content: string;
  cover_image: string | null;
  category: string;
  read_time: string;
  published_date: string;
  redirect_url?: string;
  seo_title?: string;
  seo_description?: string;
  is_featured: boolean;
}

export async function getBlogs() {
  try {
    const response = await fetch(`${BACKEND_URL}/api/blogs`, {
      cache: "no-store",
    });
    
    if (!response.ok) {
      throw new Error("Failed to fetch blogs");
    }
    
    return await response.json();
  } catch (error) {
    console.error("Error fetching blogs:", error);
    return [];
  }
}

export async function getBlogBySlug(slug: string) {
  try {
    const response = await fetch(`${BACKEND_URL}/api/blogs/${slug}`, {
      cache: "no-store",
    });
    
    if (!response.ok) {
      if (response.status === 404) return null;
      throw new Error("Failed to fetch blog");
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Error fetching blog ${slug}:`, error);
    return null;
  }
}

export async function getBlogById(id: number) {
  try {
    const response = await fetch(`${BACKEND_URL}/api/blogs/id/${id}`, {
      cache: "no-store",
    });
    
    if (!response.ok) {
      if (response.status === 404) return null;
      throw new Error("Failed to fetch blog");
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Error fetching blog ${id}:`, error);
    return null;
  }
}

export async function createBlog(data: BlogPost) {
  try {
    const token = (await cookies()).get("admin_token")?.value;
    
    if (!token) {
      return { success: false, error: "Unauthorized" };
    }

    const response = await fetch(`${BACKEND_URL}/api/blogs`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return { success: false, error: errorData.error || "Failed to create blog" };
    }

    revalidatePath("/blog");
    revalidatePath("/admin/blogs");
    
    return { success: true, id: (await response.json()).id };
  } catch (error) {
    console.error("Error creating blog:", error);
    return { success: false, error: "Failed to connect to server" };
  }
}

export async function updateBlog(id: number, data: BlogPost) {
  try {
    const token = (await cookies()).get("admin_token")?.value;
    
    if (!token) {
      return { success: false, error: "Unauthorized" };
    }

    const response = await fetch(`${BACKEND_URL}/api/blogs/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return { success: false, error: errorData.error || "Failed to update blog" };
    }

    revalidatePath("/blog");
    revalidatePath(`/blog/${data.slug}`);
    revalidatePath("/admin/blogs");
    
    return { success: true };
  } catch (error) {
    console.error(`Error updating blog ${id}:`, error);
    return { success: false, error: "Failed to connect to server" };
  }
}

export async function deleteBlog(id: number) {
  try {
    const token = (await cookies()).get("admin_token")?.value;
    
    if (!token) {
      return { success: false, error: "Unauthorized" };
    }

    const response = await fetch(`${BACKEND_URL}/api/blogs/${id}`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${token}`
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      return { success: false, error: errorData.error || "Failed to delete blog" };
    }

    revalidatePath("/blog");
    revalidatePath("/admin/blogs");
    
    return { success: true };
  } catch (error) {
    console.error(`Error deleting blog ${id}:`, error);
    return { success: false, error: "Failed to connect to server" };
  }
}
