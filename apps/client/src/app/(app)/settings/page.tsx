'use client';

import { useAuth } from "@/hooks/useAuth";
import { useState } from "react";
import { User, Bell, Shield, Palette, LayoutDashboard, Camera, Mail, UserCircle } from "lucide-react";
import { clsx } from "clsx";

export default function SettingsPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'PROFILE' | 'NOTIFS' | 'SECURITY' | 'APPEARANCE'>('PROFILE');

  const SettingSection = ({ href, icon: Icon, label }: any) => {
    const isActive = activeTab === href;
    return (
      <button 
        onClick={() => setActiveTab(href)}
        className={clsx(
          "flex items-center gap-4 px-5 py-4 rounded-xl transition-all font-bold uppercase tracking-widest text-[10px] w-80 text-left group",
          isActive ? "bg-[#9E398D]/10 text-[#9E398D] border border-[#9E398D]/20 shadow-lg shadow-[#9E398D]/5" : "text-neutral-500 hover:text-white hover:bg-white/5 border border-transparent"
        )}
      >
        <Icon className={clsx("w-5 h-5 transition-transform group-hover:scale-105", isActive && "text-[#9E398D]")} />
        {label}
      </button>
    );
  };

  return (
    <div className="container max-w-7xl mx-auto p-12 space-y-12 pb-24 animate-fade-in flex gap-12">
      {/* Sidebar Settings Navigation */}
      <aside className="space-y-2 sticky top-12 h-fit">
        <header className="px-5 mb-8">
          <h1 className="text-3xl font-black tracking-tighter text-white">Settings</h1>
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#9E398D] mt-2 group cursor-pointer hover:tracking-[0.3em] transition-all">Control Tower</p>
        </header>
        
        <SettingSection href="PROFILE" icon={User} label="My Profile" />
        <SettingSection href="NOTIFS" icon={Bell} label="Notifications" />
        <SettingSection href="SECURITY" icon={Shield} label="Security & Logins" />
        <SettingSection href="APPEARANCE" icon={Palette} label="Platform View" />
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 bg-[#0a0a0a] border border-white/5 rounded-3xl p-12 space-y-12 shadow-2xl animate-fade-in delay-200 min-h-[70vh]">
        {activeTab === 'PROFILE' && (
          <div className="space-y-12 group">
            <header className="flex items-center justify-between group-hover:translate-x-1 transition-transform">
               <div>
                  <h2 className="text-2xl font-black tracking-tight text-white">Public Identity</h2>
                  <p className="text-sm text-neutral-400 font-medium">How the community sees you on the network.</p>
               </div>
               <button className="px-8 py-3 rounded-xl gradient-primary text-white font-black tracking-widest uppercase text-[10px] shadow-[0_10px_30px_-5px_rgba(158,57,141,0.3)] hover:scale-105 active:scale-95 transition-all">
                  Sync Profile
               </button>
            </header>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-12">
               <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-500">Avatar</label>
                  <div className="aspect-square w-full max-w-[200px] rounded-3xl gradient-primary flex items-center justify-center border-4 border-[#1a1a1a] shadow-2xl relative group/avatar cursor-pointer">
                     <span className="text-6xl font-black">{user?.displayName?.[0] || 'U'}</span>
                     <div className="absolute inset-0 bg-black/60 opacity-0 group-hover/avatar:opacity-100 transition-opacity flex items-center justify-center rounded-[2.8rem]">
                        <Camera className="w-8 h-8 text-white scale-75 group-hover/avatar:scale-100 transition-transform" />
                     </div>
                  </div>
                  <p className="text-[10px] text-neutral-600 font-medium">Recommended: 800x800px</p>
               </div>

               <div className="xl:col-span-2 space-y-8">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-500">Display Name</label>
                    <div className="relative">
                      <UserCircle className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                      <input 
                        defaultValue={user?.displayName || "Elena Zenova"}
                        className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-sm font-bold text-white focus:outline-none focus:border-[#9E398D]/50 transition-all font-sans"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-500">Public Email</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                      <input 
                        defaultValue={user?.email || "elena@example.com"}
                        className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-sm font-bold text-white focus:outline-none focus:border-[#9E398D]/50 transition-all font-sans"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-500">About (Bio)</label>
                    <textarea 
                      rows={4}
                      placeholder="Tell the world what you do..."
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-4 text-sm font-medium text-white focus:outline-none focus:border-[#9E398D]/50 transition-all"
                    />
                  </div>
               </div>
            </div>
          </div>
        )}

        {/* Other tabs can be empty placeholders or with basic text for now */}
        {activeTab !== 'PROFILE' && (
          <div className="flex flex-col items-center justify-center h-full space-y-4">
             <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center">
                <LayoutDashboard className="w-8 h-8 text-neutral-500" />
             </div>
             <p className="text-sm font-black uppercase tracking-widest text-neutral-500 italic">Advanced {activeTab.toLowerCase()} settings coming soon.</p>
          </div>
        )}
      </main>
    </div>
  );
}
