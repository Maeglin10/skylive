'use client';

import Hls from 'hls.js';
import { useEffect, useRef, useState } from 'react';

interface HLSPlayerProps {
  src: string;
  poster?: string;
  className?: string;
  autoPlay?: boolean;
}

export function HLSPlayer({ src, poster, className = "", autoPlay = false }: HLSPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<Hls | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !src) return;

    setIsLoading(true);
    setError(false);

    // Destroy any previous HLS instance
    if (hlsRef.current) {
      hlsRef.current.destroy();
      hlsRef.current = null;
    }

    // Native HLS (Safari)
    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = src;
      const onMeta = () => setIsLoading(false);
      video.addEventListener('loadedmetadata', onMeta);
      if (autoPlay) video.play().catch(() => {});
      return () => video.removeEventListener('loadedmetadata', onMeta);
    }

    // HLS.js for all other browsers
    if (!Hls.isSupported()) {
      setError(true);
      return;
    }

    const hls = new Hls({
      enableWorker: true,
      lowLatencyMode: true,
      backBufferLength: 90,
    });
    hlsRef.current = hls;

    hls.loadSource(src);
    hls.attachMedia(video);

    hls.on(Hls.Events.MANIFEST_PARSED, () => {
      setIsLoading(false);
      if (autoPlay) video.play().catch(() => {});
    });

    hls.on(Hls.Events.ERROR, (_, data) => {
      if (data.fatal) {
        setError(true);
        setIsLoading(false);
      }
    });

    return () => {
      hls.destroy();
      hlsRef.current = null;
    };
  }, [src, autoPlay]);

  if (error) {
    return (
      <div className={`${className} relative w-full aspect-video bg-zinc-950 rounded-xl overflow-hidden border border-white/5 flex items-center justify-center`}>
        <div className="text-center text-zinc-400 space-y-2">
          <div className="text-5xl">📡</div>
          <p className="text-sm font-medium">Stream offline or unavailable</p>
          <p className="text-xs text-zinc-600">Check back when the creator is live</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative w-full aspect-video bg-black rounded-xl overflow-hidden shadow-2xl group ${className}`}>
      {isLoading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-zinc-950 z-10">
          <div className="w-10 h-10 border-2 border-[#9E398D] border-t-transparent rounded-full animate-spin mb-3" />
          <p className="text-xs text-zinc-500 font-medium tracking-widest uppercase">Connecting to stream…</p>
        </div>
      )}
      <video
        ref={videoRef}
        poster={poster}
        controls
        playsInline
        className="w-full h-full object-contain"
      />
      {/* Subtle border overlay */}
      <div className="absolute inset-0 pointer-events-none border border-white/10 rounded-xl" />
    </div>
  );
}
