'use client';

import { useState } from "react";
import { 
  User, 
  ShieldCheck, 
  Bell, 
  Video, 
  Globe, 
  Lock, 
  Sparkles,
  Zap,
  Save,
  ChevronRight,
  Eye,
  EyeOff,
  UserCircle
} from "lucide-react";
import { clsx } from "clsx";

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState<'ACCOUNT' | 'PRIVACY' | 'NOTIFICATIONS' | 'CREATOR'>('ACCOUNT');
  const [showPass, setShowPass] = useState(false);

  return (
    <div className="container max-w-7xl mx-auto p-8 space-y-12 pb-24 animate-fade-in font-sans">
      {/* Settings Header */}
      <header className="space-y-1">
        <h1 className="text-4xl font-black tracking-tight text-white flex items-center gap-3">
           System Settings <Sparkles className="w-6 h-6 text-[#9E398D]" />
        </h1>
        <p className="text-sm text-neutral-400 font-medium tracking-tight">Personalize your experience and manage your security.</p>
      </header>

      <section className="grid grid-cols-1 lg:grid-cols-4 gap-12">
        {/* Navigation Sidebar */}
        <aside className="space-y-4">
           {[
              { id: 'ACCOUNT', icon: User, label: 'Profile & Account' },
              { id: 'PRIVACY', icon: Lock, label: 'Privacy & Security' },
              { id: 'NOTIFICATIONS', icon: Bell, label: 'Notifications' },
              { id: 'CREATOR', icon: Video, label: 'Creator Preferences' },
           ].map((item) => (
              <button 
                key={item.id}
                onClick={() => setActiveSection(item.id as any)}
                className={clsx(
                   "w-full flex items-center justify-between px-6 py-4 rounded-2xl transition-all group",
                   activeSection === item.id ? "bg-[#9E398D]/10 text-[#9E398D] border border-[#9E398D]/20 shadow-xl" : "text-neutral-500 hover:text-white hover:bg-white/5 border border-transparent"
                )}
              >
                 <div className="flex items-center gap-4">
                    <item.icon className="w-5 h-5" />
                    <span className="text-sm font-black uppercase tracking-widest leading-none">{item.label}</span>
                 </div>
                 <ChevronRight className={clsx("w-4 h-4 transition-transform", activeSection === item.id ? "translate-x-1" : "opacity-0")} />
              </button>
           ))}
        </aside>

        {/* Content Area */}
        <main className="lg:col-span-3 space-y-12 bg-[#0a0a0a] border border-white/5 rounded-[2.5rem] p-12">
            
            {activeSection === 'ACCOUNT' && (
               <div className="space-y-12 animate-fade-in">
                  <div className="flex flex-col md:flex-row items-center gap-12 pb-8 border-b border-white/5">
                     <div className="w-32 h-32 rounded-full gradient-primary p-1 shadow-2xl relative group">
                        <div className="w-full h-full rounded-full bg-black flex items-center justify-center text-4xl font-extrabold text-white">E</div>
                        <button className="absolute inset-0 bg-black/60 rounded-full opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center gap-2 text-[8px] font-black uppercase tracking-widest">
                           Change Photo
                        </button>
                     </div>
                     <div className="flex-1 text-center md:text-left space-y-4">
                        <h3 className="text-2xl font-black text-white tracking-tight">Elena Creative</h3>
                        <p className="text-neutral-500 text-sm font-medium tracking-tight">Your display name will be visible to all users and in your channel URL.</p>
                     </div>
                  </div>

                  <form className="space-y-8">
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-2">
                           <label className="text-[10px] font-black uppercase tracking-widest text-neutral-500 px-4">Display Name</label>
                           <input type="text" placeholder="Elena Creative" className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:border-[#9E398D]/50 transition-all" />
                        </div>
                        <div className="space-y-2">
                           <label className="text-[10px] font-black uppercase tracking-widest text-neutral-500 px-4">Email Address</label>
                           <input type="email" placeholder="elena@skylive.io" className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:border-[#9E398D]/50 transition-all font-medium" />
                        </div>
                     </div>
                     
                     <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-neutral-500 px-4">Bio / Description</label>
                        <textarea placeholder="Digital Artist & Creative Coder..." className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:border-[#9E398D]/50 transition-all h-32 resize-none" />
                     </div>

                     <div className="pt-8 border-t border-white/5 flex items-center justify-between gap-6">
                        <button className="px-12 py-5 rounded-2xl gradient-primary text-white font-black uppercase text-[10px] tracking-[0.2em] shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3">
                           Save Changes <Save className="w-4 h-4" />
                        </button>
                        <p className="text-[10px] text-neutral-600 font-black uppercase tracking-widest">Last changed: Today, 14:20</p>
                     </div>
                  </form>
               </div>
            )}

            {activeSection === 'NOTIFICATIONS' && (
               <div className="space-y-12 animate-fade-in">
                  <div className="space-y-2">
                     <h3 className="text-2xl font-black text-white tracking-tight">Alert Preferences</h3>
                     <p className="text-neutral-500 text-sm font-medium tracking-tight">Control how and when you want to be notified by Skylive.</p>
                  </div>

                  <div className="space-y-6">
                     {[
                        { id: 'n_1', title: 'Live Stream Alerts', desc: 'Notify me when creators I follow go live.', default: true },
                        { id: 'n_2', title: 'New Premium Content', desc: 'Alert me for new uploads from my subscriptions.', default: true },
                        { id: 'n_3', title: 'Gift & Tip Notifications', desc: 'Immediate notification when someone supports me.', default: true },
                        { id: 'n_4', title: 'Email Marketing', desc: 'Receive new features and platform updates.', default: false },
                     ].map((item) => (
                        <div key={item.id} className="flex items-center justify-between p-8 rounded-3xl border border-white/5 bg-white/[0.02] group hover:border-[#9E398D]/20 transition-all">
                           <div className="space-y-1">
                              <p className="text-sm font-black text-white uppercase tracking-tight">{item.title}</p>
                              <p className="text-xs text-neutral-500 font-medium tracking-tight">{item.desc}</p>
                           </div>
                           <button className={clsx(
                              "w-12 h-6 rounded-full relative transition-all duration-300",
                              item.default ? "bg-[#9E398D] shadow-[0_0_15px_-3px_rgba(158,57,141,0.6)]" : "bg-neutral-800"
                           )}>
                              <div className={clsx(
                                 "absolute top-1 w-4 h-4 rounded-full bg-white transition-all duration-300 shadow-lg",
                                 item.default ? "left-7" : "left-1"
                              )} />
                           </button>
                        </div>
                     ))}
                  </div>
               </div>
            )}

            {activeSection === 'CREATOR' && (
               <div className="space-y-12 animate-fade-in">
                  <div className="space-y-2">
                     <h3 className="text-2xl font-black text-white tracking-tight">Creator Mode</h3>
                     <p className="text-neutral-500 text-sm font-medium tracking-tight">Configure your monetization rules and broadcasting settings.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                     <div className="p-8 rounded-3xl border border-[#9E398D]/20 bg-[#9E398D]/5 space-y-6">
                        <div className="flex items-center gap-3">
                           <Zap className="w-5 h-5 text-[#9E398D]" />
                           <p className="text-[10px] font-black uppercase text-[#9E398D] tracking-[0.2em]">Monetization</p>
                        </div>
                        <div className="space-y-4">
                           <div className="space-y-2">
                              <label className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Monthly Sub Price</label>
                              <div className="relative">
                                 <span className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 font-bold">$</span>
                                 <input type="number" placeholder="9.99" className="w-full bg-black/40 border border-white/10 rounded-2xl pl-8 pr-4 py-4 text-sm focus:outline-none focus:border-[#9E398D] font-black" />
                              </div>
                           </div>
                        </div>
                     </div>
                     
                     <div className="p-8 rounded-3xl border border-white/10 bg-white/5 space-y-6">
                        <div className="flex items-center gap-3">
                           <Globe className="w-5 h-5 text-neutral-500" />
                           <p className="text-[10px] font-black uppercase text-neutral-500 tracking-[0.2em]">Regional Settings</p>
                        </div>
                        <p className="text-xs text-neutral-500 font-medium leading-relaxed">Streaming server: <span className="text-white font-black">EU-PARIS-01</span></p>
                        <button className="w-full py-4 rounded-xl border border-white/10 text-[10px] font-black uppercase tracking-widest text-neutral-400 hover:text-white transition-all">
                           Run Speed Test
                        </button>
                     </div>
                  </div>
               </div>
            )}
        </main>
      </section>
    </div>
  );
}
