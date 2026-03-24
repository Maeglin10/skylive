'use client';

import * as React from 'react';
import { Bell, X, Sparkles, Video, Heart, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx } from 'clsx';

interface Notification {
  id: string;
  type: 'LIVE' | 'LIKE' | 'SUB' | 'TIP';
  user: string;
  content: string;
  time: string;
  isRead: boolean;
}

const mockNotifications: Notification[] = [
  { id: '1', type: 'LIVE', user: 'Elena Creative', content: 'is now LIVE: Painting the Future', time: '2m ago', isRead: false },
  { id: '2', type: 'TIP', user: 'CyberNinja', content: 'sent you a $50 tip!', time: '15m ago', isRead: false },
  { id: '3', type: 'SUB', user: 'Alex Art', content: 'just subscribed to your premium feed', time: '1h ago', isRead: true },
  { id: '4', type: 'LIKE', user: 'Sarah Smith', content: 'liked your latest post', time: '3h ago', isRead: true },
];

export function NotificationsDrawer({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[150]"
          />
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 w-full max-w-md h-screen bg-[#0a0a0a] border-l border-white/5 z-[151] shadow-2xl flex flex-col"
          >
            <header className="p-8 border-b border-white/5 flex items-center justify-between">
               <div className="space-y-1">
                  <h2 className="text-xl font-black text-white tracking-tight flex items-center gap-3">
                    Notifications <Sparkles className="w-4 h-4 text-[#9E398D]" />
                  </h2>
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-500">Activity & Updates</p>
               </div>
               <button onClick={onClose} className="p-2 rounded-xl bg-white/5 text-neutral-400 hover:text-white transition-all">
                  <X className="w-5 h-5" />
               </button>
            </header>

            <div className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-hide">
               {mockNotifications.map((notif) => (
                  <div 
                    key={notif.id}
                    className={clsx(
                      "group p-4 rounded-2xl border transition-all cursor-pointer relative overflow-hidden",
                      notif.isRead ? "bg-transparent border-white/5 grayscale" : "bg-white/5 border-[#9E398D]/20 shadow-lg"
                    )}
                  >
                     <div className="flex gap-4 relative z-10">
                        <div className={clsx(
                           "w-10 h-10 rounded-full flex items-center justify-center shrink-0 border border-white/10",
                           notif.type === 'LIVE' ? "bg-red-500/20 text-red-500" :
                           notif.type === 'TIP' ? "bg-yellow-500/20 text-yellow-500" :
                           notif.type === 'SUB' ? "bg-[#9E398D]/20 text-[#9E398D]" : "bg-blue-500/20 text-blue-500"
                        )}>
                           {notif.type === 'LIVE' && <Video className="w-5 h-5" />}
                           {notif.type === 'TIP' && <Zap className="w-5 h-5" />}
                           {notif.type === 'SUB' && <Heart className="w-5 h-5" />}
                           {notif.type === 'LIKE' && <Heart className="w-5 h-5" />}
                        </div>
                        <div className="space-y-1">
                           <p className="text-sm font-medium text-white">
                              <span className="font-black">@{notif.user}</span> {notif.content}
                           </p>
                           <p className="text-[10px] font-black uppercase text-neutral-600 tracking-widest">{notif.time}</p>
                        </div>
                     </div>
                     {!notif.isRead && (
                        <div className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-[#9E398D]" />
                     )}
                  </div>
               ))}
            </div>

            <footer className="p-8 border-t border-white/5 bg-white/[0.02]">
               <button className="w-full py-4 rounded-xl border border-white/5 text-xs font-black uppercase tracking-[0.2em] text-neutral-500 hover:text-white hover:bg-white/5 transition-all">
                 Mark All as Read
               </button>
            </footer>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
