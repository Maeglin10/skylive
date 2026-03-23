'use client';

import { CreditCard, History, Zap, ShieldCheck, Settings } from "lucide-react";
import { useState } from "react";
import { clsx } from "clsx";

export default function BillingPage() {
  const [activeTab, setActiveTab] = useState<'SUBS' | 'PAYMENTS'>('SUBS');

  return (
    <div className="container max-w-7xl mx-auto p-8 space-y-12 pb-24 animate-fade-in">
      <header className="space-y-1">
        <h1 className="text-3xl font-black tracking-tight text-white flex items-center gap-3">
          Billing & Subscriptions
        </h1>
        <p className="text-sm text-neutral-400 font-medium tracking-tight">Manage your payment methods and active memberships.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
           <div className="flex gap-4 p-1 bg-white/5 border border-white/10 rounded-xl w-fit">
              <button 
                onClick={() => setActiveTab('SUBS')}
                className={clsx(
                  "px-6 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all",
                  activeTab === 'SUBS' ? "bg-[#9E398D] text-white" : "text-neutral-500 hover:text-white"
                )}
              >
                Subscriptions
              </button>
              <button 
                onClick={() => setActiveTab('PAYMENTS')}
                className={clsx(
                  "px-6 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all",
                  activeTab === 'PAYMENTS' ? "bg-[#9E398D] text-white" : "text-neutral-500 hover:text-white"
                )}
              >
                Payment Methods
              </button>
           </div>

           {activeTab === 'SUBS' ? (
             <div className="space-y-6 animate-fade-in">
                {[
                  { name: "Elena Creative", type: "CREATOR", price: "$10.00/mo", status: "Active", next: "April 23, 2026" },
                  { name: "Tech Guru", type: "CREATOR", price: "$5.00/mo", status: "Active", next: "April 15, 2026" }
                ].map((sub, i) => (
                  <div key={i} className="p-6 bg-[#0a0a0a] border border-white/5 rounded-2xl flex items-center justify-between group hover:border-white/10 transition-all">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full gradient-primary flex items-center justify-center font-bold text-white shadow-xl">
                        {sub.name[0]}
                      </div>
                      <div>
                        <h3 className="font-bold text-base">{sub.name}</h3>
                        <p className="text-[10px] uppercase font-black tracking-widest text-neutral-500">Nex billing: {sub.next}</p>
                      </div>
                    </div>
                    <div className="text-right">
                       <p className="text-sm font-bold text-[#9E398D]">{sub.price}</p>
                       <button className="text-[10px] font-black uppercase tracking-widest text-neutral-400 hover:text-red-500 transition-colors">Cancel</button>
                    </div>
                  </div>
                ))}
             </div>
           ) : (
             <div className="space-y-6 animate-fade-in">
                <div className="p-8 bg-[#0a0a0a] border border-white/5 rounded-2xl flex items-center justify-between group hover:border-[#9E398D]/20 transition-all cursor-pointer">
                  <div className="flex items-center gap-6">
                    <div className="w-14 h-10 rounded-lg bg-neutral-900 border border-white/10 flex items-center justify-center">
                      <CreditCard className="w-6 h-6 text-neutral-500 group-hover:text-white transition-colors" />
                    </div>
                    <div>
                      <h3 className="font-bold text-base flex items-center gap-2">
                        •••• •••• •••• 4242
                        <span className="px-1.5 py-0.5 rounded-full bg-green-500/10 text-green-500 text-[8px] font-black tracking-widest uppercase">Default</span>
                      </h3>
                      <p className="text-[10px] uppercase font-black tracking-widest text-neutral-500">Visa — Expires 12/28</p>
                    </div>
                  </div>
                  <button className="text-neutral-500 hover:text-white transition-colors">
                    <Settings className="w-5 h-5" />
                  </button>
                </div>
                <button className="w-full py-4 rounded-xl border border-dashed border-white/10 text-neutral-500 hover:border-[#9E398D]/50 hover:text-[#9E398D] hover:bg-[#9E398D]/5 transition-all font-bold text-sm">
                  + Add New Payment Method
                </button>
             </div>
           )}
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
           <div className="p-8 bg-gradient-to-br from-[#1a0a1a] to-[#0a0a0a] border border-[#9E398D]/20 rounded-2xl space-y-6 shadow-[0_20px_40px_-15px_rgba(158,57,141,0.2)]">
              <div className="w-12 h-12 rounded-full bg-[#9E398D] flex items-center justify-center shadow-[0_0_20px_rgba(158,57,141,0.5)]">
                 <Zap className="w-6 h-6 text-white fill-white" />
              </div>
              <div>
                <h3 className="text-lg font-black tracking-tight mb-2">Support Your Hub</h3>
                <p className="text-xs text-neutral-400 leading-relaxed font-medium">Your subscriptions go directly to creators minus a small 5% platform fee to keep Skylive running.</p>
              </div>
              <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-[#9E398D]">
                <ShieldCheck className="w-4 h-4" /> Secure via Stripe
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
