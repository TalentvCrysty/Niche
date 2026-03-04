"use server";

import { cookies } from "next/headers";

const BACKEND_URL = "http://localhost:3005";

export async function uploadMedia(formData: FormData) {
    try {
        const token = (await cookies()).get("admin_token")?.value;

        if (!token) {
            return { success: false, error: "Unauthorized" };
        }

        const response = await fetch(`${BACKEND_URL}/api/upload`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`
                // Note: fetch automatically sets Content-Type to multipart/form-data with boundary when body is FormData
            },
            body: formData,
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error("Upload failed", errorText);
            return { success: false, error: "Upload failed" };
        }

        const data = await response.json();
        return { success: true, url: data.url }; // data.url is the Base64 Data URL returned by backend

    } catch (error) {
        console.error("Upload error:", error);
        return { success: false, error: "Internal server error during upload" };
    }
}
