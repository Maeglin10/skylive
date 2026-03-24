'use client';

import { useEffect } from 'react';
import { AlertCircle, RefreshCcw, Home, Sparkles } from 'lucide-react';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error to Sentry/Console
    console.error('Frontend Application Error:', error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-6 text-center space-y-8 animate-fade-in font-sans">
      <div className="relative group">
         <div className="absolute inset-0 bg-[#9E398D]/20 blur-3xl animate-pulse rounded-full" />
         <div className="relative w-24 h-24 rounded-[2rem] bg-white/5 border border-white/10 flex items-center justify-center text-red-500 shadow-2xl">
            <AlertCircle className="w-12 h-12" />
         </div>
      </div>

      <div className="space-y-4 max-w-lg">
         <div className="space-y-2">
            <h1 className="text-3xl font-black text-white tracking-tight uppercase flex items-center justify-center gap-3">
               Something Went Wrong <Sparkles className="w-5 h-5 text-[#9E398D]" />
            </h1>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-600">Recovery Terminal v0.1.0</p>
         </div>
         <p className="text-sm text-neutral-500 font-medium leading-relaxed">
            We encountered a critical runtime error. Our engineering team has been notified.
            Try refreshing the interface or returning to safety.
         </p>
      </div>

      <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
         <button 
           onClick={() => reset()}
           className="px-12 py-5 rounded-2xl gradient-primary text-white text-[10px] font-black uppercase tracking-[0.3em] shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center gap-3"
         >
            <RefreshCcw className="w-4 h-4" /> Try Again
         </button>
         <Link 
           href="/feed"
           className="px-12 py-5 rounded-2xl border border-white/10 bg-white/5 text-neutral-400 hover:text-white transition-all text-[10px] font-black uppercase tracking-[0.3em] flex items-center gap-3 shadow-xl"
         >
            <Home className="w-4 h-4" /> Go Home
         </Link>
      </div>
      
      <p className="text-[8px] font-black uppercase text-neutral-800 tracking-widest bg-white/[0.02] px-4 py-1 rounded-full border border-white/5">
        ERROR_DIGEST: {error.digest || 'UNSAFE_RUNTIME_ERROR'}
      </p>
    </div>
  );
}
