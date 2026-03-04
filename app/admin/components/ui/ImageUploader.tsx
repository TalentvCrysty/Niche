"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { Upload, X, Image as ImageIcon, Loader2 } from "lucide-react";
import Cookies from "js-cookie";

interface ImageUploaderProps {
  value?: string | null;
  onChange: (value: string) => void;
  className?: string;
  label?: string;
  accept?: string;
}

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3005";

// Get full URL for media - handles both relative and absolute URLs
const getPreviewUrl = (url: string): string => {
  if (!url) return '';
  // If it's already an absolute URL or data URL, return as-is
  if (url.startsWith('http') || url.startsWith('data:') || url.startsWith('blob:')) {
    return url;
  }
  // If it's a relative URL from our backend (starts with /uploads), prepend backend URL
  if (url.startsWith('/uploads')) {
    return `${BACKEND_URL}${url}`;
  }
  return url;
};

export function ImageUploader({ value, onChange, className = "", label = "Image", accept = "image/*" }: ImageUploaderProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isPreviewLoaded, setIsPreviewLoaded] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const previousValueRef = useRef<string | null>(null);

  // Memoize preview URL to avoid recalculating
  const previewUrl = value ? getPreviewUrl(value) : '';

  // Reset preview loaded state when value changes
  useEffect(() => {
    if (value !== previousValueRef.current) {
      setIsPreviewLoaded(false);
      previousValueRef.current = value || null;
    }
  }, [value]);

  // Upload file to server via Server Action
  const handleImageUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Client-side validation for 50MB limit
    if (file.size > 50 * 1024 * 1024) {
      alert("File size exceeds 50MB limit");
      return;
    }

    setIsLoading(true);
    setIsPreviewLoaded(false);
    setUploadProgress(0); // Progress is not supported with simple server actions nicely, but we reset it.

    try {
      const formData = new FormData();
      formData.append('file', file);

      // Dynamically import to avoid server-on-client issues if any, though standard import works for server actions
      const { uploadMedia } = await import("@/app/actions/upload");

      const result = await uploadMedia(formData);

      if (result.success && result.url) {
        onChange(result.url);
      } else {
        console.error('Upload failed:', result.error);
        alert("Upload failed: " + (result.error || "Unknown error"));
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      alert("Error uploading file");
    } finally {
      setIsLoading(false);
    }
  }, [onChange]);

  const handlePreviewLoad = useCallback(() => {
    setIsPreviewLoaded(true);
  }, []);

  const handleClear = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    onChange("");
    setIsPreviewLoaded(false);
  }, [onChange]);

  return (
    <div className={className}>
      <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 mb-2 flex items-center gap-1.5">
        <ImageIcon className="w-3.5 h-3.5" />
        {label}
      </label>
      <div className="mt-2 relative group overflow-hidden rounded-xl border border-dashed border-zinc-300 bg-zinc-50 hover:bg-zinc-100 transition-colors min-h-[200px] flex flex-col items-center justify-center text-center cursor-pointer">
        {isLoading ? (
          <div className="p-6 flex flex-col items-center gap-3">
            <Loader2 className="w-8 h-8 text-zinc-400 animate-spin" />
            <p className="text-sm text-zinc-500">Uploading... {uploadProgress}%</p>
            <div className="w-full max-w-[200px] h-2 bg-zinc-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-black transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          </div>
        ) : value ? (
          <>
            <img
              src={previewUrl}
              alt="Preview"
              loading="lazy"
              decoding="async"
              onLoad={handlePreviewLoad}
              className={`w-full h-full absolute inset-0 object-contain p-2 transition-opacity duration-300 ${isPreviewLoaded ? 'opacity-100' : 'opacity-0'}`}
            />
            {!isPreviewLoaded && (
              <div className="absolute inset-0 flex items-center justify-center bg-zinc-100">
                <Loader2 className="w-6 h-6 text-zinc-400 animate-spin" />
              </div>
            )}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
              <span className="bg-white text-black px-4 py-2 rounded-lg text-xs font-semibold shadow-lg transform scale-95 group-hover:scale-100 transition-all">Change Image</span>
            </div>
            <button
              onClick={handleClear}
              className="absolute top-2 right-2 p-1 bg-white text-red-500 rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50"
            >
              <X size={14} />
            </button>
          </>
        ) : (
          <div className="p-6">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm mx-auto mb-3 text-zinc-400 border border-zinc-100 group-hover:scale-110 transition-transform">
              <Upload className="w-6 h-6" />
            </div>
            <p className="text-sm font-medium text-zinc-600">Click to upload image</p>
            <p className="text-[10px] text-zinc-400 mt-1">PNG, JPG, WEBP (Max 50MB)</p>
          </div>
        )}
        <input type="file" accept={accept} className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleImageUpload} />
      </div>
    </div>
  );
}
