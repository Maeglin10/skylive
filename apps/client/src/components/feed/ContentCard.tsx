import { ImageIcon, VideoIcon, FileTextIcon, LockIcon } from "lucide-react";
import Image from "next/image";

interface ContentCardProps {
  id: string;
  creatorName: string;
  creatorAvatar?: string;
  type: 'IMAGE' | 'VIDEO' | 'POST';
  accessRule: 'FREE' | 'SUBSCRIPTION' | 'PPV';
  price?: number;
  thumbnailUrl?: string;
  title?: string;
  createdAt: string;
  isLocked?: boolean;
}

export function ContentCard({
  creatorName,
  creatorAvatar,
  type,
  accessRule,
  price,
  thumbnailUrl,
  title,
  createdAt,
  isLocked = true,
}: ContentCardProps) {
  const Icon = type === 'IMAGE' ? ImageIcon : type === 'VIDEO' ? VideoIcon : FileTextIcon;
  
  return (
    <div className="group relative bg-[#0a0a0a] rounded-2xl overflow-hidden border border-white/5 transition-all hover:border-[#9E398D]/30 hover:shadow-[0_10px_40px_-15px_rgba(158,57,141,0.2)]">
      {/* Header */}
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-neutral-800 border border-white/5 overflow-hidden ring-2 ring-transparent group-hover:ring-[#9E398D]/20 transition-all">
            {creatorAvatar ? (
              <Image src={creatorAvatar} alt={creatorName} width={40} height={40} />
            ) : (
              <div className="w-full h-full gradient-primary flex items-center justify-center font-bold text-sm">
                {creatorName[0].toUpperCase()}
              </div>
            )}
          </div>
          <div>
            <h3 className="font-bold text-sm tracking-tight">{creatorName}</h3>
            <span className="text-[10px] text-neutral-500 font-medium uppercase tracking-wider">{createdAt}</span>
          </div>
        </div>
        <div className="p-2 rounded-lg bg-white/5 group-hover:bg-[#9E398D]/10 transition-colors">
          <Icon className="w-4 h-4 text-neutral-400 group-hover:text-[#9E398D]" />
        </div>
      </div>

      {/* Media or Lock Overlay */}
      <div className="relative aspect-[4/5] bg-neutral-900 overflow-hidden">
        {thumbnailUrl && !isLocked ? (
          <Image 
            src={thumbnailUrl} 
            alt={title || "Content"} 
            fill 
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center border border-white/10 ring-4 ring-[#9E398D]/0 group-hover:ring-[#9E398D]/10 transition-all">
              <LockIcon className="w-6 h-6 text-[#9E398D]" />
            </div>
            <div>
              <p className="font-bold text-sm mb-1 uppercase tracking-widest text-[#9E398D]">
                {accessRule === 'FREE' ? 'Free Content' : accessRule === 'SUBSCRIPTION' ? 'Subscribers Only' : `Unlock for $${price}`}
              </p>
              <p className="text-xs text-neutral-400 max-w-[200px]">
                {accessRule === 'SUBSCRIPTION' ? `Subscribe to ${creatorName} to access this content.` : 'This content requires a one-time purchase.'}
              </p>
            </div>
            <button className="px-6 py-2 rounded-full border border-[#9E398D] text-[#9E398D] text-xs font-bold uppercase tracking-widest hover:bg-[#9E398D] hover:text-white transition-all transform group-hover:scale-105">
              Unlock Now
            </button>
          </div>
        )}
        
        {/* Subtle gradient overlay at bottom */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
      </div>

      {/* Footer / Description Preview */}
      {title && (
        <div className="p-4 border-t border-white/5">
          <p className="text-sm font-medium text-neutral-200 line-clamp-2 leading-relaxed">
            {title}
          </p>
        </div>
      )}
    </div>
  );
}
