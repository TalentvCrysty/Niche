/**
 * Media Cache Utility
 * 
 * Provides optimized caching for media URLs (images, videos, GIFs)
 * to improve load times and reduce memory usage across the application.
 */

// Global blob URL cache
const blobUrlCache = new Map<string, string>();
const cacheMetadata = new Map<string, { 
  createdAt: number; 
  accessedAt: number;
  size: number;
  type: 'image' | 'video' | 'gif';
}>();

// Maximum cache size (in number of entries)
const MAX_CACHE_SIZE = 50;
// Maximum age for cache entries (30 minutes)
const MAX_CACHE_AGE = 30 * 60 * 1000;

/**
 * Generate a cache key from a data URL
 * Uses first 100 chars + length for uniqueness without storing full data
 */
export const getCacheKey = (dataUrl: string): string => {
  if (!dataUrl) return '';
  return `${dataUrl.substring(0, 100)}_${dataUrl.length}`;
};

/**
 * Detect media type from data URL or file extension
 */
export const getMediaType = (src: string): 'image' | 'video' | 'gif' => {
  if (!src) return 'image';
  
  const lowercaseSrc = src.toLowerCase();
  
  // Check for GIF
  if (lowercaseSrc.includes('.gif') || lowercaseSrc.includes('image/gif')) {
    return 'gif';
  }
  
  // Check for video
  const videoExtensions = ['.mp4', '.webm', '.ogg', '.mov'];
  const videoMimeTypes = ['video/mp4', 'video/webm', 'video/ogg', 'video/quicktime'];
  
  if (videoExtensions.some(ext => lowercaseSrc.includes(ext)) ||
      videoMimeTypes.some(type => lowercaseSrc.includes(type))) {
    return 'video';
  }
  
  return 'image';
};

/**
 * Convert a data URL to a blob URL for better performance
 * Caches the result to avoid repeated conversions
 */
export const dataUrlToBlobUrl = (dataUrl: string): string => {
  if (!dataUrl) return '';
  
  // If it's already a regular URL (not data:), return as-is
  if (!dataUrl.startsWith('data:')) {
    return dataUrl;
  }
  
  const cacheKey = getCacheKey(dataUrl);
  
  // Check cache first
  if (blobUrlCache.has(cacheKey)) {
    // Update access time
    const metadata = cacheMetadata.get(cacheKey);
    if (metadata) {
      metadata.accessedAt = Date.now();
    }
    return blobUrlCache.get(cacheKey)!;
  }
  
  try {
    // Parse data URL
    const [header, base64Data] = dataUrl.split(',');
    const mimeMatch = header.match(/data:([^;]+)/);
    const mimeType = mimeMatch ? mimeMatch[1] : 'application/octet-stream';
    
    // Decode base64
    const byteCharacters = atob(base64Data);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    
    // Create blob and URL
    const blob = new Blob([byteArray], { type: mimeType });
    const blobUrl = URL.createObjectURL(blob);
    
    // Clean up old entries if cache is full
    cleanupCache();
    
    // Store in cache
    blobUrlCache.set(cacheKey, blobUrl);
    cacheMetadata.set(cacheKey, {
      createdAt: Date.now(),
      accessedAt: Date.now(),
      size: byteArray.length,
      type: getMediaType(dataUrl)
    });
    
    return blobUrl;
  } catch (error) {
    console.error('Error converting data URL to blob URL:', error);
    return dataUrl;
  }
};

/**
 * Clean up old or excess cache entries
 */
export const cleanupCache = (): void => {
  const now = Date.now();
  
  // Remove expired entries
  for (const [key, metadata] of cacheMetadata.entries()) {
    if (now - metadata.accessedAt > MAX_CACHE_AGE) {
      const blobUrl = blobUrlCache.get(key);
      if (blobUrl) {
        URL.revokeObjectURL(blobUrl);
      }
      blobUrlCache.delete(key);
      cacheMetadata.delete(key);
    }
  }
  
  // If still over limit, remove least recently accessed
  if (blobUrlCache.size > MAX_CACHE_SIZE) {
    const entries = Array.from(cacheMetadata.entries())
      .sort((a, b) => a[1].accessedAt - b[1].accessedAt);
    
    const toRemove = entries.slice(0, blobUrlCache.size - MAX_CACHE_SIZE);
    for (const [key] of toRemove) {
      const blobUrl = blobUrlCache.get(key);
      if (blobUrl) {
        URL.revokeObjectURL(blobUrl);
      }
      blobUrlCache.delete(key);
      cacheMetadata.delete(key);
    }
  }
};

/**
 * Preload media into cache without rendering
 * Useful for preloading hero backgrounds or critical media
 */
export const preloadMedia = (src: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    if (!src) {
      reject(new Error('No source provided'));
      return;
    }
    
    const optimizedUrl = dataUrlToBlobUrl(src);
    const mediaType = getMediaType(src);
    
    if (mediaType === 'video') {
      const video = document.createElement('video');
      video.preload = 'metadata';
      video.onloadedmetadata = () => resolve(optimizedUrl);
      video.onerror = () => reject(new Error('Failed to preload video'));
      video.src = optimizedUrl;
    } else {
      const img = new window.Image();
      img.onload = () => resolve(optimizedUrl);
      img.onerror = () => reject(new Error('Failed to preload image'));
      img.src = optimizedUrl;
    }
  });
};

/**
 * Get cache statistics for debugging
 */
export const getCacheStats = () => {
  let totalSize = 0;
  const typeCounts = { image: 0, video: 0, gif: 0 };
  
  for (const metadata of cacheMetadata.values()) {
    totalSize += metadata.size;
    typeCounts[metadata.type]++;
  }
  
  return {
    entries: blobUrlCache.size,
    totalSizeBytes: totalSize,
    totalSizeMB: (totalSize / (1024 * 1024)).toFixed(2),
    byType: typeCounts
  };
};

/**
 * Clear all cached media
 * Call this on page navigation or when memory needs to be freed
 */
export const clearCache = (): void => {
  for (const blobUrl of blobUrlCache.values()) {
    URL.revokeObjectURL(blobUrl);
  }
  blobUrlCache.clear();
  cacheMetadata.clear();
};

/**
 * Check if a URL is cached
 */
export const isCached = (dataUrl: string): boolean => {
  const cacheKey = getCacheKey(dataUrl);
  return blobUrlCache.has(cacheKey);
};

// Helper type exports
export type MediaType = 'image' | 'video' | 'gif';
