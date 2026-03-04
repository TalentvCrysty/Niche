"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

const BACKEND_URL = "http://localhost:3005";

export interface PortfolioProject {
    id?: number;
    slug: string;
    title: string;
    short_description: string;
    full_description: string;
    thumbnail_image: string;
    gallery_images: string[];
    technologies: string[];
    live_url: string;
    github_url: string;
    completion_date: string;
    status: "published" | "draft";
    category?: string;
    before_image?: string;
    after_image?: string;
    created_at?: string;
}

export async function getProjects() {
    try {
        const response = await fetch(`${BACKEND_URL}/api/portfolio`, {
            cache: "no-store",
        });

        if (!response.ok) {
            throw new Error("Failed to fetch portfolio projects");
        }

        const projects = await response.json();

        // Parse JSON fields
        return projects.map((p: any) => ({
            ...p,
            gallery_images: JSON.parse(p.gallery_images || "[]"),
            technologies: JSON.parse(p.technologies || "[]")
        }));
    } catch (error) {
        console.error("Error fetching portfolio projects:", error);
        return [];
    }
}

export async function getProjectBySlug(slug: string) {
    try {
        const response = await fetch(`${BACKEND_URL}/api/portfolio/${slug}`, {
            cache: "no-store",
        });

        if (!response.ok) {
            if (response.status === 404) return null;
            throw new Error("Failed to fetch project");
        }

        const p = await response.json();
        return {
            ...p,
            gallery_images: JSON.parse(p.gallery_images || "[]"),
            technologies: JSON.parse(p.technologies || "[]")
        };
    } catch (error) {
        console.error(`Error fetching project ${slug}:`, error);
        return null;
    }
}

export async function getProjectById(id: number) {
    try {
        const response = await fetch(`${BACKEND_URL}/api/portfolio/id/${id}`, {
            cache: "no-store",
        });

        if (!response.ok) {
            if (response.status === 404) return null;
            throw new Error("Failed to fetch project");
        }

        const p = await response.json();
        return {
            ...p,
            gallery_images: JSON.parse(p.gallery_images || "[]"),
            technologies: JSON.parse(p.technologies || "[]")
        };
    } catch (error) {
        console.error(`Error fetching project ${id}:`, error);
        return null;
    }
}

export async function createProject(data: PortfolioProject) {
    try {
        const token = (await cookies()).get("admin_token")?.value;

        if (!token) {
            return { success: false, error: "Unauthorized" };
        }

        const response = await fetch(`${BACKEND_URL}/api/portfolio`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            const errorData = await response.json();
            return { success: false, error: errorData.error || "Failed to create project" };
        }

        revalidatePath("/portfolio");
        revalidatePath("/admin/portfolio");

        return { success: true, id: (await response.json()).id };
    } catch (error) {
        console.error("Error creating project:", error);
        return { success: false, error: "Failed to connect to server" };
    }
}

export async function updateProject(id: number, data: PortfolioProject) {
    try {
        const token = (await cookies()).get("admin_token")?.value;

        if (!token) {
            return { success: false, error: "Unauthorized" };
        }

        const response = await fetch(`${BACKEND_URL}/api/portfolio/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            const errorData = await response.json();
            return { success: false, error: errorData.error || "Failed to update project" };
        }

        revalidatePath("/portfolio");
        revalidatePath(`/portfolio/${data.slug}`);
        revalidatePath("/admin/portfolio");

        return { success: true };
    } catch (error) {
        console.error(`Error updating project ${id}:`, error);
        return { success: false, error: "Failed to connect to server" };
    }
}

export async function deleteProject(id: number) {
    try {
        const token = (await cookies()).get("admin_token")?.value;

        if (!token) {
            return { success: false, error: "Unauthorized" };
        }

        const response = await fetch(`${BACKEND_URL}/api/portfolio/${id}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${token}`
            },
        });

        if (!response.ok) {
            const errorData = await response.json();
            return { success: false, error: errorData.error || "Failed to delete project" };
        }

        revalidatePath("/portfolio");
        revalidatePath("/admin/portfolio");

        return { success: true };
    } catch (error) {
        console.error(`Error deleting project ${id}:`, error);
        return { success: false, error: "Failed to connect to server" };
    }
}
