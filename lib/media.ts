// Backend URL for media files
export const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3005";

/**
 * Get full URL for media files
 * Handles relative URLs from backend, data URLs, and absolute URLs
 */
export function getMediaUrl(url: string | undefined | null): string {
  if (!url) return '';
  
  // If it's already an absolute URL, data URL, or blob URL, return as-is
  if (url.startsWith('http') || url.startsWith('data:') || url.startsWith('blob:')) {
    return url;
  }
  
  // If it's a relative URL from our backend (starts with /uploads), prepend backend URL
  if (url.startsWith('/uploads')) {
    return `${BACKEND_URL}${url}`;
  }
  
  return url;
}
