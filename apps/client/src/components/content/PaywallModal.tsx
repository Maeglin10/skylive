'use client';

import { Modal } from "@/components/ui/Modal";
import { Lock, Sparkles, Zap, ShieldCheck, ArrowRight } from "lucide-react";

interface PaywallModalProps {
  isOpen: boolean;
  onClose: () => void;
  creatorName: string;
  type: 'SUBSCRIPTION' | 'PPV';
  price?: number;
  onUnlock?: () => void;
}

export function PaywallModal({ isOpen, onClose, creatorName, type, price, onUnlock }: PaywallModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-md">
      <div className="flex flex-col items-center text-center space-y-6">
        <div className="w-20 h-20 rounded-full bg-[#9E398D]/10 flex items-center justify-center border border-[#9E398D]/20 animate-pulse ring-4 ring-transparent hover:ring-[#9E398D]/10 transition-all">
          <Lock className="w-8 h-8 text-[#9E398D]" />
        </div>
        
        <div className="space-y-2">
          <h2 className="text-2xl font-black text-white tracking-tight">Premium Content</h2>
          <p className="text-sm text-neutral-400 font-medium px-4">
            {type === 'SUBSCRIPTION' 
              ? `Subscribe to ${creatorName} to unlock all their exclusive content and live streams.` 
              : `Purchase this content to unlock it forever and support ${creatorName}.`}
          </p>
        </div>

        <div className="w-full space-y-4 pt-4">
          <button 
            onClick={onUnlock}
            className="w-full py-4 rounded-xl gradient-primary text-white font-black tracking-widest uppercase text-sm shadow-[0_10px_30px_-5px_rgba(158,57,141,0.4)] hover:scale-[1.02] transition-all flex items-center justify-center gap-3 group"
          >
            {type === 'SUBSCRIPTION' ? 'Subscribe Now' : `Unlock for $${price?.toFixed(2)}`}
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
          
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-600 flex items-center justify-center gap-2">
            <ShieldCheck className="w-4 h-4" /> Secure via Stripe
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 w-full pt-4 border-t border-white/5">
           <div className="flex flex-col items-center gap-1">
              <Sparkles className="w-4 h-4 text-[#9E398D]" />
              <p className="text-[10px] font-black uppercase text-neutral-400">High Quality</p>
           </div>
           <div className="flex flex-col items-center gap-1">
              <Zap className="w-4 h-4 text-yellow-500" />
              <p className="text-[10px] font-black uppercase text-neutral-400">Instant Access</p>
           </div>
        </div>
      </div>
    </Modal>
  );
}
