'use client';

import * as React from 'react';
import { Command } from 'cmdk';
import { 
  Search, 
  Home, 
  Video, 
  Settings, 
  PlusSquare, 
  Heart, 
  UserCircle,
  Sparkles,
  Zap,
  History,
  Star,
  ExternalLink
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

export function CommandMenu() {
  const [open, setOpen] = React.useState(false);
  const router = useRouter();

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  const runCommand = (command: () => void) => {
    setOpen(false);
    command();
  };

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[200]">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
          />
          
          <div className="flex items-start justify-center pt-[15vh] p-4 h-full pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="w-full max-w-2xl bg-[#0a0a0a] border border-white/10 rounded-3xl shadow-2xl overflow-hidden pointer-events-auto"
            >
              <Command className="flex flex-col h-full bg-transparent">
                <div className="flex items-center gap-3 px-6 py-5 border-b border-white/5">
                   <Search className="w-5 h-5 text-neutral-500" />
                   <Command.Input 
                     autoFocus 
                     placeholder="Type a command or search creators..." 
                     className="flex-1 bg-transparent border-none text-white focus:outline-none placeholder:text-neutral-600 font-medium"
                   />
                   <div className="px-2 py-1 rounded-md bg-white/5 border border-white/5 text-[10px] font-black uppercase text-neutral-600">⌘K</div>
                </div>

                <Command.List className="max-h-[500px] overflow-y-auto p-4 scrollbar-hide space-y-4">
                  <Command.Empty className="py-12 text-center text-sm text-neutral-500 font-medium">No results found.</Command.Empty>

                  <Command.Group heading={<span className="px-4 text-[10px] font-black uppercase tracking-widest text-[#9E398D]">Jump To</span>}>
                    <CommandItem onSelect={() => runCommand(() => router.push('/feed'))}>
                      <Home className="w-4 h-4 mr-3" />
                      <span>Go to Feed</span>
                    </CommandItem>
                    <CommandItem onSelect={() => runCommand(() => router.push('/search'))}>
                      <Search className="w-4 h-4 mr-3" />
                      <span>Discover Creators</span>
                    </CommandItem>
                    <CommandItem onSelect={() => runCommand(() => router.push('/creator/studio'))}>
                      <Video className="w-4 h-4 mr-3" />
                      <span>Creator Studio</span>
                      <span className="ml-auto text-[10px] font-black uppercase tracking-widest text-[#9E398D]">LIVE</span>
                    </CommandItem>
                    <CommandItem onSelect={() => runCommand(() => router.push('/help'))}>
                      <Sparkles className="w-4 h-4 mr-3" />
                      <span>Help & Support</span>
                    </CommandItem>
                  </Command.Group>

                  <Command.Group heading={<span className="px-4 text-[10px] font-black uppercase tracking-widest text-neutral-600">Top Creators</span>}>
                    <CommandItem onSelect={() => runCommand(() => router.push('/creators/elena'))}>
                      <div className="w-6 h-6 rounded-full gradient-primary flex items-center justify-center text-[8px] font-black text-white italic mr-3">E</div>
                      <span>Elena Creative</span>
                      <div className="ml-auto flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[#9E398D]/10 text-[#9E398D] text-[8px] font-black tracking-widest uppercase">Live Now</div>
                    </CommandItem>
                    <CommandItem onSelect={() => runCommand(() => router.push('/creators/techguru'))}>
                      <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-[8px] font-black text-white italic mr-3">T</div>
                      <span>Tech Guru Pro</span>
                    </CommandItem>
                  </Command.Group>

                  <Command.Group heading={<span className="px-4 text-[10px] font-black uppercase tracking-widest text-neutral-600">Quick Actions</span>}>
                    <CommandItem onSelect={() => runCommand(() => router.push('/creator/upload'))}>
                      <PlusSquare className="w-4 h-4 mr-3" />
                      <span>Upload New Post</span>
                    </CommandItem>
                    <CommandItem onSelect={() => runCommand(() => router.push('/billing'))}>
                      <Zap className="w-4 h-4 mr-3" />
                      <span>My Wallet</span>
                    </CommandItem>
                    <CommandItem onSelect={() => runCommand(() => router.push('/settings'))}>
                      <Settings className="w-4 h-4 mr-3" />
                      <span>Account Settings</span>
                    </CommandItem>
                  </Command.Group>

                  <Command.Group heading={<span className="px-4 text-[10px] font-black uppercase tracking-widest text-neutral-600">Recent Search</span>}>
                    <CommandItem onSelect={() => runCommand(() => router.push('/search?q=nextjs'))}>
                      <History className="w-4 h-4 mr-3 text-neutral-700" />
                      <span className="text-neutral-500 italic">nextjs 15 streaming...</span>
                    </CommandItem>
                  </Command.Group>
                </Command.List>

                <div className="p-4 border-t border-white/5 bg-white/[0.02] flex items-center justify-between">
                   <div className="flex items-center gap-6">
                      <div className="flex items-center gap-2">
                         <kbd className="px-1.5 py-0.5 rounded border border-white/10 bg-white/5 text-[10px] font-bold text-neutral-500">↵</kbd>
                         <span className="text-[10px] font-black uppercase text-neutral-600">Select</span>
                      </div>
                      <div className="flex items-center gap-2">
                         <kbd className="px-1.5 py-0.5 rounded border border-white/10 bg-white/5 text-[10px] font-bold text-neutral-500">↑↓</kbd>
                         <span className="text-[10px] font-black uppercase text-neutral-600">Navigate</span>
                      </div>
                   </div>
                   <div className="flex items-center gap-2">
                      <Sparkles className="w-3 h-3 text-[#9E398D]" />
                      <span className="text-[10px] font-black uppercase tracking-widest text-neutral-700">AeviaLive OS v0.2.0</span>
                   </div>
                </div>
              </Command>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}

function CommandItem({ children, onSelect }: { children: React.ReactNode; onSelect: () => void }) {
  return (
    <Command.Item
      onSelect={onSelect}
      className="flex items-center px-4 py-3 rounded-2xl text-sm font-medium text-neutral-400 cursor-pointer transition-all hover:bg-white/5 hover:text-white aria-selected:bg-white/5 aria-selected:text-white group"
    >
      {children}
    </Command.Item>
  );
}
