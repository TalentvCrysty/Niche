'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface PreloaderProps {
  children: React.ReactNode;
  heroConfig?: any;
  navbarConfig?: any;
  partnersConfig?: any;
  caseStudiesConfig?: any;
}

// Extract all media URLs from config objects
const extractMediaUrls = (configs: any[]): string[] => {
  const urls: string[] = [];
  
  const extract = (obj: any) => {
    if (!obj) return;
    
    if (typeof obj === 'string') {
      if (obj.startsWith('data:image') || 
          obj.startsWith('data:video') ||
          obj.match(/\.(jpg|jpeg|png|gif|webp|avif|mp4|webm|svg)$/i) ||
          obj.startsWith('/')) {
        urls.push(obj);
      }
    } else if (Array.isArray(obj)) {
      obj.forEach(extract);
    } else if (typeof obj === 'object') {
      Object.values(obj).forEach(extract);
    }
  };
  
  configs.forEach(extract);
  return [...new Set(urls)];
};

const isVideoUrl = (url: string): boolean => {
  const videoExtensions = ['.mp4', '.webm', '.ogg', '.mov'];
  const videoMimeTypes = ['video/mp4', 'video/webm', 'video/ogg'];
  const lowercaseUrl = url.toLowerCase();
  
  return videoExtensions.some(ext => lowercaseUrl.includes(ext)) ||
         videoMimeTypes.some(type => url.includes(type));
};

const preloadImage = (src: string): Promise<void> => {
  return new Promise((resolve) => {
    const img = new window.Image();
    img.onload = () => resolve();
    img.onerror = () => resolve();
    img.src = src;
  });
};

const preloadVideo = (src: string): Promise<void> => {
  return new Promise((resolve) => {
    const video = document.createElement('video');
    video.preload = 'metadata';
    video.onloadedmetadata = () => resolve();
    video.onerror = () => resolve();
    video.src = src;
  });
};

export function Preloader({ 
  children, 
  heroConfig,
  navbarConfig,
  partnersConfig,
  caseStudiesConfig
}: PreloaderProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const hasStartedRef = useRef(false);
  
  const preloadAssets = useCallback(async () => {
    if (hasStartedRef.current) return;
    hasStartedRef.current = true;
    
    const mediaUrls = extractMediaUrls([
      heroConfig,
      navbarConfig,
      partnersConfig,
      caseStudiesConfig
    ]);
    
    const criticalAssets = [
      '/hero-bg.png',
      '/logo.png',
      '/favicon.png',
    ];
    
    const allAssets = [...new Set([...criticalAssets, ...mediaUrls])].filter(Boolean);
    
    if (allAssets.length === 0) {
      setProgress(50);
      await new Promise(r => setTimeout(r, 500));
      setProgress(100);
      await new Promise(r => setTimeout(r, 300));
      setIsLoading(false);
      return;
    }
    
    let loaded = 0;
    const total = allAssets.length;
    
    const batchSize = 3;
    for (let i = 0; i < allAssets.length; i += batchSize) {
      const batch = allAssets.slice(i, i + batchSize);
      
      await Promise.all(
        batch.map(async (url) => {
          try {
            if (isVideoUrl(url)) {
              await preloadVideo(url);
            } else {
              await preloadImage(url);
            }
          } catch {
            // Continue even if an asset fails
          }
          loaded++;
          setProgress(Math.round((loaded / total) * 100));
        })
      );
    }
    
    await new Promise(r => setTimeout(r, 400));
    setIsLoading(false);
  }, [heroConfig, navbarConfig, partnersConfig, caseStudiesConfig]);
  
  useEffect(() => {
    preloadAssets();
    
    const timeout = setTimeout(() => {
      setIsLoading(false);
    }, 8000);
    
    return () => clearTimeout(timeout);
  }, [preloadAssets]);
  
  return (
    <>
      <AnimatePresence mode="wait">
        {isLoading && (
          <motion.div
            key="preloader"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: 'easeInOut' }}
            className="fixed inset-0 z-[9999] bg-black flex flex-col items-center justify-center gap-6"
          >
            {/* iOS-style spinner */}
            <div className="relative w-10 h-10">
              {[...Array(12)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute left-1/2 top-0 w-[3px] h-[10px] -ml-[1.5px] bg-white rounded-full origin-[center_20px]"
                  style={{
                    transform: `rotate(${i * 30}deg)`,
                  }}
                  animate={{
                    opacity: [0.2, 1, 0.2],
                  }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    delay: i * (1 / 12),
                    ease: 'linear',
                  }}
                />
              ))}
            </div>
            
            {/* Percentage */}
            <motion.span
              className="text-white/60 text-sm font-medium tabular-nums"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              {progress}%
            </motion.span>
          </motion.div>
        )}
      </AnimatePresence>
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isLoading ? 0 : 1 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        style={{ visibility: isLoading ? 'hidden' : 'visible' }}
      >
        {children}
      </motion.div>
    </>
  );
}
