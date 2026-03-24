'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart3, X, Check, Vote, Sparkles } from 'lucide-react';
import { clsx } from 'clsx';

interface Poll {
  question: string;
  options: { id: string; text: string; votes: number }[];
  totalVotes: number;
}

export function PollsOverlay({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [poll, setPoll] = React.useState<Poll>({
    question: "What should I paint next?",
    options: [
      { id: '1', text: "Cyberpunk Cityscape", votes: 142 },
      { id: '2', text: "Ghibli-style Forest", votes: 89 },
      { id: '3', text: "Abstract Void", votes: 201 },
    ],
    totalVotes: 432
  });

  const [voted, setVoted] = React.useState<string | null>(null);

  const handleVote = (id: string) => {
    if (voted) return;
    setVoted(id);
    setPoll(p => ({
      ...p,
      options: p.options.map(o => o.id === id ? { ...o, votes: o.votes + 1 } : o),
      totalVotes: p.totalVotes + 1
    }));
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9, x: 20 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          exit={{ opacity: 0, scale: 0.9, x: 20 }}
          className="absolute top-8 right-8 w-80 bg-black/60 backdrop-blur-md border border-white/10 rounded-3xl p-6 shadow-2xl z-50 space-y-6 overflow-hidden"
        >
           <div className="absolute top-0 right-0 p-4 opacity-10 blur-sm pointer-events-none">
              <BarChart3 className="w-24 h-24 text-[#9E398D]" />
           </div>

           <header className="flex items-center justify-between relative z-10">
              <div className="flex items-center gap-2">
                 <div className="w-8 h-8 rounded-xl bg-[#9E398D]/20 flex items-center justify-center text-[#9E398D]">
                    <Vote className="w-4 h-4" />
                 </div>
                 <h4 className="text-[10px] font-black uppercase text-[#9E398D] tracking-widest">Active Poll</h4>
              </div>
              <button onClick={onClose} className="p-1 rounded-lg hover:bg-white/5 text-neutral-600 hover:text-white transition-all">
                <X className="w-4 h-4" />
              </button>
           </header>

           <div className="space-y-4 relative z-10">
              <h3 className="text-sm font-black text-white uppercase tracking-tight leading-snug">{poll.question}</h3>
              
              <div className="space-y-3">
                 {poll.options.map((opt) => {
                    const percentage = Math.round((opt.votes / poll.totalVotes) * 100);
                    return (
                       <button 
                         key={opt.id}
                         onClick={() => handleVote(opt.id)}
                         disabled={!!voted}
                         className={clsx(
                            "w-full p-4 rounded-2xl border transition-all relative overflow-hidden group text-left",
                            voted === opt.id ? "border-[#9E398D] bg-[#9E398D]/10 shadow-[0_0_20px_-5px_rgba(158,57,141,0.3)]" : "border-white/5 bg-white/[0.02] hover:border-white/20 active:scale-95"
                         )}
                       >
                          <div className="flex justify-between items-center relative z-10 mb-1">
                             <span className="text-xs font-black uppercase tracking-tight text-white">{opt.text}</span>
                             {voted && <span className="text-[10px] font-bold text-neutral-500">{percentage}%</span>}
                          </div>
                          
                          {voted && (
                             <div className="relative h-1.5 w-full bg-white/5 rounded-full overflow-hidden z-10">
                                <motion.div 
                                  initial={{ width: 0 }}
                                  animate={{ width: `${percentage}%` }}
                                  className="h-full gradient-primary"
                                />
                             </div>
                          )}
                          
                          {voted === opt.id && <Check className="absolute top-2 right-2 w-3 h-3 text-[#9E398D]" />}
                       </button>
                    );
                 })}
              </div>
           </div>

           <footer className="pt-2 border-t border-white/5 relative z-10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                 <Sparkles className="w-3 h-3 text-neutral-600" />
                 <span className="text-[8px] font-black uppercase tracking-widest text-neutral-700">{poll.totalVotes} Total Votes</span>
              </div>
              <p className="text-[8px] font-black uppercase text-neutral-800 tracking-widest">Ending in 4m</p>
           </footer>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
