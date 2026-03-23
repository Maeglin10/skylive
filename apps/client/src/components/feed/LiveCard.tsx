import { Users, Eye } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface LiveCardProps {
  id: string;
  creatorName: string;
  creatorAvatar?: string;
  title: string;
  viewerCount: number;
  thumbnailUrl?: string;
  status: 'LIVE' | 'ENDED' | 'OFFLINE';
}

export function LiveCard({
  id,
  creatorName,
  creatorAvatar,
  title,
  viewerCount,
  thumbnailUrl,
  status,
}: LiveCardProps) {
  const isLive = status === 'LIVE';

  return (
    <Link 
      href={`/live/${id}`}
      className="group block relative bg-[#0a0a0a] rounded-2xl overflow-hidden border border-white/5 transition-all hover:border-[#9E398D]/50 hover:-translate-y-1 hover:shadow-[0_20px_50px_-20px_rgba(158,57,141,0.3)]"
    >
      <div className="relative aspect-video bg-neutral-900 overflow-hidden">
        {thumbnailUrl && (
          <Image 
            src={thumbnailUrl} 
            alt={title} 
            fill 
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
        )}
        
        {/* Overlays */}
        <div className="absolute inset-x-4 top-4 flex justify-between items-start z-10">
          <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full font-black text-[10px] tracking-widest uppercase ${
            isLive ? 'bg-red-500 text-white animate-pulse shadow-[0_0_15px_rgba(239,68,68,0.5)]' : 'bg-neutral-800 text-neutral-400'
          }`}>
            {isLive ? (
              <>
                <span className="w-1.5 h-1.5 rounded-full bg-white" />
                LIVE
              </>
            ) : (
              'OFFLINE'
            )}
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/40 backdrop-blur-md backdrop-saturate-150 border border-white/10 font-bold text-[10px] tracking-tight">
            <Users className="w-3 h-3 text-[#9E398D]" />
            {viewerCount}
          </div>
        </div>

        {/* Gradient Overlay at Bottom */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80 group-hover:opacity-100 transition-opacity" />
        
        {/* Play Button Icon on Hover */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all transform scale-90 group-hover:scale-100 duration-300">
           <div className="w-12 h-12 rounded-full gradient-primary flex items-center justify-center shadow-[0_0_30px_rgba(158,57,141,0.5)]">
             <Eye className="w-6 h-6 text-white" />
           </div>
        </div>
      </div>

      <div className="p-4 space-y-3">
        <h3 className="font-bold text-base leading-tight group-hover:text-[#9E398D] transition-colors line-clamp-2">
          {title}
        </h3>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-neutral-800 border border-white/5 overflow-hidden flex items-center justify-center">
            {creatorAvatar ? (
               <Image src={creatorAvatar} alt={creatorName} width={24} height={24} />
            ) : (
               <span className="text-[10px] font-bold text-neutral-500">{creatorName[0]}</span>
            )}
          </div>
          <span className="text-sm font-medium text-neutral-400 group-hover:text-neutral-300 transition-colors">
            {creatorName}
          </span>
        </div>
      </div>
    </Link>
  );
}
