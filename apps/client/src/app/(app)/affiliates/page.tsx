'use client';

import { useState } from "react";
import { 
  Users, 
  TrendingUp, 
  Rocket, 
  ArrowRight, 
  Copy, 
  Check, 
  Sparkles,
  Zap,
  Globe,
  Star,
  ShieldCheck
} from "lucide-react";
import { clsx } from "clsx";

const referrals = [
  { id: '1', user: '@CyberPunk', date: 'Oct 14, 2026', type: 'CREATOR', status: 'ACTIVE', earnings: 45.00 },
  { id: '2', user: '@ElenaFans', date: 'Oct 12, 2026', type: 'FAN', status: 'ACTIVE', earnings: 12.50 },
  { id: '3', user: '@WebDev99', date: 'Oct 10, 2026', type: 'CREATOR', status: 'PENDING', earnings: 0.00 },
];

export default function AffiliatesPage() {
  const [copied, setCopied] = useState(false);
  const referralCode = "SKYLIVE-ELENA-2026";

  const handleCopy = () => {
    navigator.clipboard.writeText(`https://skylive.io/join?ref=${referralCode}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="container max-w-7xl mx-auto p-8 space-y-12 pb-24 animate-fade-in font-sans">
      {/* Affiliates Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="space-y-1">
          <h1 className="text-4xl font-black tracking-tight text-white flex items-center gap-3">
             Referral Program <Sparkles className="w-6 h-6 text-[#9E398D]" />
          </h1>
          <p className="text-sm text-neutral-400 font-medium tracking-tight">Earn 5% from every creator you bring to the platform.</p>
        </div>
      </header>

      {/* Hero Link Section */}
      <section className="relative group">
         <div className="absolute inset-0 bg-gradient-to-r from-[#9E398D] to-[#521E49] rounded-[2.5rem] blur-2xl opacity-10 transition-all duration-500 group-hover:opacity-20" />
         <div className="relative bg-[#0a0a0a] border border-white/5 rounded-[2.5rem] p-12 flex flex-col md:flex-row items-center justify-between gap-12 overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 w-1/2 h-full bg-white/[0.01] -skew-x-12 translate-x-1/2" />
            
            <div className="space-y-8 relative z-10 text-center md:text-left">
               <div className="space-y-2">
                  <h2 className="text-3xl font-black text-white tracking-widest uppercase">Your Link</h2>
                  <p className="text-sm text-neutral-500 font-medium tracking-tight max-w-xs">Share this link with other creators to start earning commissions.</p>
               </div>
               
               <div className="flex items-center gap-2 p-2 rounded-2xl bg-black/60 border border-white/10 w-full md:w-fit group/input">
                  <input 
                    readOnly 
                    value={`skylive.io/join?ref=${referralCode}`} 
                    className="bg-transparent border-none text-neutral-400 text-sm pl-4 pr-12 w-full md:w-64 focus:outline-none font-mono"
                  />
                  <button 
                    onClick={handleCopy}
                    className={clsx(
                       "px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-3 transition-all",
                       copied ? "bg-green-500/20 text-green-500" : "gradient-primary text-white hover:scale-105 active:scale-95"
                    )}
                  >
                     {copied ? <><Check className="w-4 h-4" /> Copied!</> : <><Copy className="w-4 h-4" /> Copy Link</>}
                  </button>
               </div>
            </div>

            <div className="grid grid-cols-2 gap-8 relative z-10 w-full md:w-auto">
               <div className="p-8 rounded-3xl bg-white/5 border border-white/5 space-y-2 text-center">
                  <p className="text-[10px] font-black uppercase text-neutral-500 tracking-widest">Total Earned</p>
                  <p className="text-4xl font-black text-white tracking-tighter">$57.50</p>
               </div>
               <div className="p-8 rounded-3xl bg-white/5 border border-white/5 space-y-2 text-center">
                  <p className="text-[10px] font-black uppercase text-neutral-500 tracking-widest">Referrals</p>
                  <p className="text-4xl font-black text-white tracking-tighter">142</p>
               </div>
            </div>
         </div>
      </section>

      {/* Program Details */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-12">
         {[
            { icon: Users, title: "Invite Creators", desc: "Share your unique link with fellow artists and streamers." },
            { icon: Zap, title: "They Grow", desc: "When they earn from subs or tips, you get a 5% commission." },
            { icon: ShieldCheck, title: "Auto Payouts", desc: "Commissions are instantly credited to your wallet balance." }
         ].map((item, i) => (
            <div key={i} className="p-10 rounded-[2.5rem] bg-white/[0.02] border border-white/5 hover:border-[#9E398D]/20 transition-all group">
               <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-[#9E398D] mb-8 group-hover:scale-110 transition-all">
                  <item.icon className="w-6 h-6" />
               </div>
               <h3 className="text-xl font-black text-white uppercase tracking-tight mb-4">{item.title}</h3>
               <p className="text-sm text-neutral-500 font-medium leading-relaxed">{item.desc}</p>
            </div>
         ))}
      </section>

      {/* Detailed Referrals Table */}
      <section className="space-y-6">
         <div className="flex items-center justify-between px-2">
            <h3 className="text-sm font-black uppercase tracking-widest text-neutral-500 flex items-center gap-2">
               <Star className="w-4 h-4" /> Active Referrals
            </h3>
            <button className="text-[10px] font-black uppercase tracking-widest text-[#9E398D] hover:underline decoration-2 underline-offset-4 transition-all">Export CSV</button>
         </div>

         <div className="space-y-3">
            {referrals.map((ref) => (
               <div key={ref.id} className="p-6 rounded-2xl bg-[#0a0a0a] border border-white/5 hover:border-white/10 transition-all grid grid-cols-2 md:grid-cols-4 gap-4 items-center group">
                  <div className="flex items-center gap-4 col-span-1">
                     <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-xs font-black text-neutral-400 italic">
                        {ref.user[1]}
                     </div>
                     <span className="text-sm font-black text-white uppercase tracking-tight group-hover:text-[#9E398D] transition-all">{ref.user}</span>
                  </div>
                  <div className="hidden md:flex flex-col">
                     <p className="text-[10px] font-black uppercase text-neutral-600 tracking-widest">Date Joined</p>
                     <p className="text-xs font-medium text-neutral-400">{ref.date}</p>
                  </div>
                  <div className="hidden md:flex flex-col items-center">
                     <span className={clsx(
                        "px-3 py-1 rounded-full text-[8px] font-black tracking-widest uppercase",
                        ref.status === 'ACTIVE' ? "bg-green-500/10 text-green-500" : "bg-yellow-500/10 text-yellow-500"
                     )}>
                        {ref.status}
                     </span>
                  </div>
                  <div className="text-right">
                     <p className="text-lg font-black tracking-tighter text-white">+${ref.earnings.toFixed(2)}</p>
                     <p className="text-[8px] font-black uppercase text-neutral-700 tracking-[0.2em] px-1">Total Earned</p>
                  </div>
               </div>
            ))}
         </div>
      </section>
    </div>
  );
}
