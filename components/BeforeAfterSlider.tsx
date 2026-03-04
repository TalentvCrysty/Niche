"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";

interface BeforeAfterSliderProps {
    beforeImage: string;
    afterImage: string;
    alt: string;
    className?: string;
}

// Helper to get media URL
const BACKEND_URL = "http://localhost:3005";
const getMediaUrl = (url: string): string => {
    if (!url) return '';
    if (url.startsWith('http') || url.startsWith('data:') || url.startsWith('blob:')) {
        return url;
    }
    if (url.startsWith('/uploads')) {
        return `${BACKEND_URL}${url}`;
    }
    return url;
};

export function BeforeAfterSlider({ beforeImage, afterImage, alt, className = "" }: BeforeAfterSliderProps) {
    const [sliderPosition, setSliderPosition] = useState(50);
    const [isDragging, setIsDragging] = useState(false);
    const [width, setWidth] = useState(0);
    const containerRef = useRef<HTMLDivElement>(null);

    const handleMove = (event: MouseEvent | TouchEvent) => {
        if (!containerRef.current) return;

        const containerRect = containerRef.current.getBoundingClientRect();
        let clientX;

        if ('touches' in event) {
            clientX = event.touches[0].clientX;
        } else {
            clientX = (event as MouseEvent).clientX;
        }

        const position = ((clientX - containerRect.left) / containerRect.width) * 100;
        setSliderPosition(Math.min(100, Math.max(0, position)));
    };

    const handleMouseDown = () => setIsDragging(true);
    const handleMouseUp = () => setIsDragging(false);

    useEffect(() => {
        if (isDragging) {
            window.addEventListener('mousemove', handleMove);
            window.addEventListener('mouseup', handleMouseUp);
            window.addEventListener('touchmove', handleMove);
            window.addEventListener('touchend', handleMouseUp);
        } else {
            window.removeEventListener('mousemove', handleMove);
            window.removeEventListener('mouseup', handleMouseUp);
            window.removeEventListener('touchmove', handleMove);
            window.removeEventListener('touchend', handleMouseUp);
        }
        return () => {
            window.removeEventListener('mousemove', handleMove);
            window.removeEventListener('mouseup', handleMouseUp);
            window.removeEventListener('touchmove', handleMove);
            window.removeEventListener('touchend', handleMouseUp);
        };
    }, [isDragging]);

    useEffect(() => {
        if (!containerRef.current) return;
        const resizeObserver = new ResizeObserver((entries) => {
            for (const entry of entries) {
                setWidth(entry.contentRect.width);
            }
        });
        resizeObserver.observe(containerRef.current);
        return () => resizeObserver.disconnect();
    }, []);

    const resolvedBefore = getMediaUrl(beforeImage);
    const resolvedAfter = getMediaUrl(afterImage);

    return (
        <div
            ref={containerRef}
            className={`relative w-full h-full overflow-hidden select-none group cursor-ew-resize ${className}`}
            onMouseDown={handleMouseDown}
            onTouchStart={handleMouseDown}
        >
            {/* After Image (Background) */}
            <div className="absolute inset-0 w-full h-full">
                <Image
                    src={resolvedAfter}
                    alt={`After ${alt}`}
                    fill
                    className="object-cover"
                />
                <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm px-2 py-1 rounded text-white text-xs font-bold uppercase tracking-wider z-10 pointer-events-none">
                    After
                </div>
            </div>

            {/* Before Image (Clipped) */}
            <div
                className="absolute inset-0 h-full overflow-hidden bg-black/20"
                style={{ width: `${sliderPosition}%` }}
            >
                {/* Inner container forced to match root width */}
                <div className="relative h-full" style={{ width: width ? `${width}px` : '100%' }}>
                    <Image
                        src={resolvedBefore}
                        alt={`Before ${alt}`}
                        fill
                        className="object-cover"
                    />
                </div>
                <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-sm px-2 py-1 rounded text-white text-xs font-bold uppercase tracking-wider z-10 pointer-events-none">
                    Before
                </div>
            </div>

            {/* Slider Handle */}
            <div
                className="absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize z-20"
                style={{ left: `${sliderPosition}%` }}
            >
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center transform transition-transform hover:scale-110 active:scale-95">
                    <div className="w-0.5 h-4 bg-black/20" />
                    <div className="w-0.5 h-4 bg-black/20 ml-0.5" />
                </div>
            </div>
        </div>
    );
}
