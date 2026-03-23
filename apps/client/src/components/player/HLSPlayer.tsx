'use client';

import Hls from 'hls.js';
import { useEffect, useRef } from 'react';

interface HLSPlayerProps {
  src: string;
  poster?: string;
  className?: string;
}

export function HLSPlayer({ src, poster, className = "" }: HLSPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (Hls.isSupported()) {
      const hls = new Hls({
        lowLatencyMode: true,
        backBufferLength: 90,
      });

      hls.loadSource(src);
      hls.attachMedia(video);

      return () => {
        hls.destroy();
      };
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      // Native HLS support for Safari
      video.src = src;
    }
  }, [src]);

  return (
    <div className={`relative w-full aspect-video bg-black rounded-xl overflow-hidden shadow-2xl group ${className}`}>
      <video
        ref={videoRef}
        poster={poster}
        controls
        autoPlay
        playsInline
        className="w-full h-full object-cover"
      />
      
      {/* Premium Overlay (subtle) */}
      <div className="absolute inset-0 pointer-events-none border border-white/10 rounded-xl" />
    </div>
  );
}
