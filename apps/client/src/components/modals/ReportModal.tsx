'use client';

import * as React from 'react';
import { 
  AlertTriangle, 
  X, 
  ShieldAlert, 
  MessageSquare, 
  Flag,
  ChevronRight,
  Send,
  Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx } from 'clsx';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetName: string;
  targetType: 'USER' | 'CONTENT' | 'CHAT';
}

const reasons = [
  { id: '1', label: 'Harassment or Bullying', desc: 'Targeted attacks or hateful speech.' },
  { id: '2', label: 'Spam or Scam', desc: 'Suspicious links or malicious behavior.' },
  { id: '3', label: 'Sensitive Content', desc: 'Inappropriate or explicit visuals.' },
  { id: '4', label: 'Copyright Infringement', desc: 'Content used without permission.' },
];

export function ReportModal({ isOpen, onClose, targetName, targetType }: ReportModalProps) {
  const [step, setStep] = React.useState<1 | 2>(1);
  const [selectedReason, setSelectedReason] = React.useState<string | null>(null);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-md z-[300]"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-[#0a0a0a] border border-white/10 rounded-[2.5rem] p-10 z-[301] shadow-2xl space-y-8"
          >
             <header className="flex items-center justify-between">
                <div className="space-y-1">
                   <h2 className="text-xl font-black text-white tracking-tight flex items-center gap-3">
                      Report {targetName} <ShieldAlert className="w-5 h-5 text-red-500" />
                   </h2>
                   <p className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-500">Trust & Safety Center</p>
                </div>
                <button onClick={onClose} className="p-2 rounded-xl bg-white/5 text-neutral-400 hover:text-white transition-all">
                   <X className="w-5 h-5" />
                </button>
             </header>

             {step === 1 ? (
                <div className="space-y-4 animate-fade-in">
                   <p className="text-sm text-neutral-400 font-medium tracking-tight">Select the reason for reporting this {targetType.toLowerCase()}.</p>
                   <div className="space-y-3">
                      {reasons.map((r) => (
                         <div 
                           key={r.id}
                           onClick={() => { setSelectedReason(r.id); setStep(2); }}
                           className="group flex items-center justify-between p-6 rounded-2xl bg-white/5 border border-white/5 hover:border-red-500/20 hover:bg-red-500/5 transition-all cursor-pointer"
                         >
                            <div className="space-y-1">
                               <p className="text-sm font-black text-white uppercase tracking-tight group-hover:text-red-500 transition-all">{r.label}</p>
                               <p className="text-[10px] text-neutral-600 font-medium">{r.desc}</p>
                            </div>
                            <ChevronRight className="w-4 h-4 text-neutral-700" />
                         </div>
                      ))}
                   </div>
                </div>
             ) : (
                <div className="space-y-6 animate-fade-in">
                   <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-neutral-500 px-4">Additional Context (Optional)</label>
                      <textarea 
                        placeholder="Can you provide more details about the situation?" 
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:border-red-500/50 transition-all h-32 resize-none"
                      />
                   </div>
                   <div className="flex gap-4">
                      <button 
                        onClick={() => setStep(1)}
                        className="flex-1 py-4 rounded-xl border border-white/10 text-xs font-black uppercase tracking-widest text-neutral-500 hover:text-white transition-all"
                      >
                         Back
                      </button>
                      <button 
                        onClick={onClose}
                        className="flex-[2] py-4 rounded-xl bg-red-600 text-white text-xs font-black uppercase tracking-widest shadow-xl flex items-center justify-center gap-2 hover:bg-red-500 transition-all hover:scale-105 active:scale-95"
                      >
                         Submit Report <Send className="w-4 h-4" />
                      </button>
                   </div>
                   <p className="text-center text-[8px] font-black uppercase text-neutral-700 tracking-[0.2em] px-8">
                      Our moderation team will review this report within 24 hours. Abuse of the reporting system may lead to account restrictions.
                   </p>
                </div>
             )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
