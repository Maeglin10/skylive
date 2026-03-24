'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { Video } from 'lucide-react';
import { clsx } from 'clsx';
import Link from 'next/link';

const mockStories = [
  { id: '1', user: 'Elena', isLive: true, avatar: 'E' },
  { id: '2', user: 'Tech', isLive: true, avatar: 'T' },
  { id: '3', user: 'Chef', isLive: false, avatar: 'C' },
  { id: '4', user: 'Art', isLive: true, avatar: 'A' },
  { id: '5', user: 'Gaming', isLive: false, avatar: 'G' },
  { id: '6', user: 'Nomad', isLive: true, avatar: 'N' },
  { id: '7', user: 'Fitness', isLive: false, avatar: 'F' },
];

export function LiveStories() {
  return (
    <div className="flex items-center gap-6 overflow-x-auto pb-4 scrollbar-hide -mx-2 px-2">
      {mockStories.map((story) => (
        <Link 
          key={story.id} 
          href={story.isLive ? `/live/${story.id}` : `/creators/${story.user.toLowerCase()}`}
          className="flex flex-col items-center gap-2 group shrink-0"
        >
          <div className={clsx(
            "p-1 rounded-full transition-all duration-500 relative",
            story.isLive ? "gradient-primary shadow-[0_0_15px_-3px_rgba(158,57,141,0.6)] animate-pulse shadow-lg" : "bg-neutral-800"
          )}>
            <div className="w-16 h-16 rounded-full bg-black border-2 border-black flex items-center justify-center text-xl font-black text-white group-hover:scale-105 transition-transform overflow-hidden">
               {story.avatar}
            </div>
            {story.isLive && (
               <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-red-600 text-white text-[8px] font-black uppercase px-2 py-0.5 rounded-full border-2 border-black tracking-widest leading-none">
                  Live
               </div>
            )}
          </div>
          <span className="text-[10px] font-black uppercase tracking-widest text-neutral-500 group-hover:text-white transition-all">
            {story.user}
          </span>
        </Link>
      ))}
    </div>
  );
}
