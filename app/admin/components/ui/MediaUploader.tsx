"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { Upload, X, Image as ImageIcon, Video, Film, Loader2 } from "lucide-react";
import Cookies from "js-cookie";

interface MediaUploaderProps {
  value?: string | null;
  onChange: (value: string) => void;
  className?: string;
  label?: string;
  accept?: string;
  mediaType?: "image" | "video" | "all";
}

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3005";

// Get full URL for media - handles both relative and absolute URLs
const getMediaUrl = (url: string): string => {
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

export function MediaUploader({
  value,
  onChange,
  className = "",
  label = "Media",
  accept,
  mediaType = "all"
}: MediaUploaderProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isPreviewLoaded, setIsPreviewLoaded] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const previousValueRef = useRef<string | null>(null);

  // Preview URL
  const previewUrl = value ? getMediaUrl(value) : '';

  // Reset preview loaded state when value changes
  useEffect(() => {
    if (value !== previousValueRef.current) {
      setIsPreviewLoaded(false);
      previousValueRef.current = value || null;
    }
  }, [value]);

  const getAcceptTypes = useCallback(() => {
    if (accept) return accept;
    switch (mediaType) {
      case "image": return "image/*";
      case "video": return "video/*,.gif";
      case "all": return "image/*,video/*";
      default: return "image/*,video/*";
    }
  }, [accept, mediaType]);

  const isVideo = useCallback((src: string) => {
    if (!src) return false;
    const videoExtensions = ['.mp4', '.webm', '.ogg', '.mov'];
    const videoMimeTypes = ['video/mp4', 'video/webm', 'video/ogg', 'video/quicktime'];

    const lowercaseSrc = src.toLowerCase();
    return videoExtensions.some(ext => lowercaseSrc.includes(ext)) ||
           videoMimeTypes.some(type => src.includes(type));
  }, []);

  const isGif = useCallback((src: string) => {
    if (!src) return false;
    return src.toLowerCase().includes('.gif') || src.includes('image/gif');
  }, []);

  // Upload file to server
  const handleMediaUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    setIsPreviewLoaded(false);
    setUploadProgress(0);

    try {
      const token = Cookies.get("admin_token");
      if (!token) {
        console.error('No auth token found');
        setIsLoading(false);
        return;
      }

      const formData = new FormData();
      formData.append('file', file);

      // Use XMLHttpRequest for upload progress
      const xhr = new XMLHttpRequest();

      xhr.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable) {
          const progress = Math.round((event.loaded / event.total) * 100);
          setUploadProgress(progress);
        }
      });

      xhr.addEventListener('load', () => {
        if (xhr.status === 200) {
          const response = JSON.parse(xhr.responseText);
          if (response.success && response.url) {
            // Store the base64 data URL directly
            onChange(response.url);
            console.log('File uploaded and converted to base64 successfully');
          }
        } else {
          console.error('Upload failed:', xhr.statusText);
        }
        setIsLoading(false);
        setUploadProgress(0);
      });

      xhr.addEventListener('error', () => {
        console.error('Upload error');
        setIsLoading(false);
        setUploadProgress(0);
      });

      xhr.open('POST', `${BACKEND_URL}/api/upload`);
      xhr.setRequestHeader('Authorization', `Bearer ${token}`);
      xhr.send(formData);

    } catch (error) {
      setIsLoading(false);
      setUploadProgress(0);
      console.error('Error uploading file:', error);
    }
  }, [onChange]);

  const getIcon = useCallback(() => {
    switch (mediaType) {
      case "video": return Film;
      case "image": return ImageIcon;
      default: return Upload;
    }
  }, [mediaType]);

  const getLabel = useCallback(() => {
    switch (mediaType) {
      case "video": return "Video / GIF";
      case "image": return "Image";
      default: return "Media";
    }
  }, [mediaType]);

  const Icon = getIcon();
  const displayLabel = label || getLabel();

  const handlePreviewLoad = useCallback(() => {
    setIsPreviewLoaded(true);
  }, []);

  const handleClear = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    onChange("");
    setIsPreviewLoaded(false);
  }, [onChange]);

  const renderPreview = useCallback(() => {
    if (!value || !previewUrl) return null;

    if (isVideo(value)) {
      // Show static thumbnail for video instead of playing it
      return (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-zinc-100 to-zinc-200 p-4">
          <div className="w-16 h-16 bg-black/10 rounded-full flex items-center justify-center mb-3">
            <Video className="w-8 h-8 text-zinc-500" />
          </div>
          <p className="text-sm font-medium text-zinc-600">Video uploaded as base64</p>
          <p className="text-xs text-zinc-400 mt-1 text-center">Saved in database - preview disabled for performance</p>
        </div>
      );
    }

    // For images and GIFs
    return (
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
      </>
    );
  }, [value, previewUrl, isVideo, isPreviewLoaded, handlePreviewLoad]);

  const getFileTypes = useCallback(() => {
    switch (mediaType) {
      case "video": return "MP4, WEBM, GIF (Max 50MB)";
      case "image": return "PNG, JPG, WEBP (Max 50MB)";
      default: return "PNG, JPG, WEBP, MP4, WEBM, GIF (Max 50MB)";
    }
  }, [mediaType]);

  return (
    <div className={className}>
      <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 mb-2 flex items-center gap-1.5">
        <Icon className="w-3.5 h-3.5" />
        {displayLabel}
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
            {renderPreview()}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
              <span className="bg-white text-black px-4 py-2 rounded-lg text-xs font-semibold shadow-lg transform scale-95 group-hover:scale-100 transition-all">
                Change {isVideo(value) ? "Video" : isGif(value) ? "GIF" : "Image"}
              </span>
            </div>
            <button
              onClick={handleClear}
              className="absolute top-2 right-2 p-1 bg-white text-red-500 rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50 z-10"
            >
              <X size={14} />
            </button>
            {(isVideo(value) || isGif(value)) && (
              <div className="absolute bottom-2 left-2 px-2 py-1 bg-black/70 text-white text-[10px] font-medium rounded-md flex items-center gap-1">
                <Film className="w-3 h-3" />
                {isGif(value) ? "GIF" : "Video"} • Looping
              </div>
            )}
          </>
        ) : (
          <div className="p-6">
             <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm mx-auto mb-3 text-zinc-400 border border-zinc-100 group-hover:scale-110 transition-transform">
               <Icon className="w-6 h-6" />
             </div>
             <p className="text-sm font-medium text-zinc-600">Click to upload {displayLabel.toLowerCase()}</p>
             <p className="text-[10px] text-zinc-400 mt-1">{getFileTypes()}</p>
          </div>
        )}
        <input
          type="file"
          accept={getAcceptTypes()}
          className="absolute inset-0 opacity-0 cursor-pointer"
          onChange={handleMediaUpload}
        />
      </div>
    </div>
  );
}
