'use client';

import { useState } from "react";
import { 
  CreditCard, 
  History, 
  Plus, 
  Trash2, 
  Zap, 
  Heart,
  ArrowUpRight, 
  ArrowDownLeft, 
  Sparkles,
  ShieldCheck,
  TrendingUp,
  ExternalLink
} from "lucide-react";
import { clsx } from "clsx";

export default function BillingPage() {
  const [activeTab, setActiveTab] = useState<'WALLET' | 'SUBS'>('WALLET');

  const transactions = [
    { id: '1', type: 'TIP_SENT', target: 'Elena Creative', amount: -25.00, date: 'Oct 14, 2026', status: 'COMPLETED' },
    { id: '2', type: 'SUB_RENEW', target: 'Tech Guru Monthly', amount: -9.99, date: 'Oct 12, 2026', status: 'COMPLETED' },
    { id: '3', type: 'WALLET_ADD', target: 'Stripe Topup', amount: 100.00, date: 'Oct 10, 2026', status: 'COMPLETED' },
    { id: '4', type: 'TIP_SENT', target: 'Chef Master', amount: -15.00, date: 'Oct 05, 2026', status: 'COMPLETED' },
  ];

  return (
    <div className="container max-w-7xl mx-auto p-8 space-y-12 pb-24 animate-fade-in font-sans">
      {/* Billing Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="space-y-1">
          <h1 className="text-4xl font-black tracking-tight text-white flex items-center gap-3">
             Balance & Billing <Sparkles className="w-6 h-6 text-[#9E398D]" />
          </h1>
          <p className="text-sm text-neutral-400 font-medium tracking-tight">Manage your credits, subscriptions, and payment history.</p>
        </div>
        <div className="flex gap-2 p-1 bg-white/5 border border-white/10 rounded-2xl w-full md:w-auto">
           <button 
             onClick={() => setActiveTab('WALLET')}
             className={clsx(
                "flex-1 md:flex-none flex items-center justify-center gap-3 px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                activeTab === 'WALLET' ? "bg-[#9E398D] text-white shadow-xl scale-105" : "text-neutral-500 hover:text-white"
             )}
           >
             <Zap className="w-4 h-4" />
             Wallet
           </button>
           <button 
             onClick={() => setActiveTab('SUBS')}
             className={clsx(
                "flex-1 md:flex-none flex items-center justify-center gap-3 px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                activeTab === 'SUBS' ? "bg-[#9E398D] text-white shadow-xl scale-105" : "text-neutral-500 hover:text-white"
             )}
           >
             <Heart className="w-4 h-4" />
             Subscriptions
           </button>
        </div>
      </header>

      {/* Wallet Stats */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Main Card */}
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-[#9E398D] to-[#521E49] rounded-[2.5rem] blur-2xl opacity-20 transition-all duration-500 group-hover:opacity-40" />
            <div className="relative bg-black border border-white/10 rounded-[2.5rem] p-12 flex flex-col md:flex-row items-center justify-between gap-12 overflow-hidden">
               <div className="absolute top-0 right-0 w-1/2 h-full bg-white/[0.02] -skew-x-12 translate-x-1/2" />
               <div className="space-y-6 relative z-10 w-full md:w-auto text-center md:text-left">
                  <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-[#9E398D]/10 text-[#9E398D] text-[10px] font-black uppercase tracking-widest">
                     Available Balance
                  </div>
                  <div className="text-7xl font-black text-white tracking-tighter">$42.01</div>
                  <p className="text-neutral-500 text-sm font-medium tracking-tight">Last top-up: Oct 10, 2026 ($100.00)</p>
               </div>
               <div className="flex flex-col gap-4 w-full md:w-auto relative z-10">
                  <button className="px-12 py-5 rounded-2xl gradient-primary text-white font-black uppercase text-[10px] tracking-[0.2em] shadow-2xl hover:scale-105 transition-all active:scale-95 flex items-center justify-center gap-3">
                     Add Funds <Plus className="w-4 h-4" />
                  </button>
                  <button className="px-12 py-5 rounded-2xl border border-white/10 bg-white/5 text-neutral-400 font-black uppercase text-[10px] tracking-[0.2em] hover:bg-white/10 hover:text-white transition-all">
                     Withdraw
                  </button>
               </div>
            </div>
          </div>

          {/* Transaction History */}
          <div className="space-y-6">
             <div className="flex items-center justify-between px-2">
                <h3 className="text-sm font-black uppercase tracking-widest text-neutral-500 flex items-center gap-2">
                   <History className="w-4 h-4" /> Recent Transactions
                </h3>
                <button className="text-[10px] font-black uppercase tracking-widest text-[#9E398D] hover:underline">View All</button>
             </div>
             
             <div className="space-y-3">
                {transactions.map((tx) => (
                   <div key={tx.id} className="flex items-center justify-between p-6 rounded-2xl bg-white/5 border border-white/5 hover:border-white/10 transition-all group">
                      <div className="flex items-center gap-6">
                         <div className={clsx(
                            "w-12 h-12 rounded-xl flex items-center justify-center transition-all",
                            tx.amount > 0 ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"
                         )}>
                            {tx.amount > 0 ? <ArrowDownLeft className="w-5 h-5" /> : <ArrowUpRight className="w-5 h-5" />}
                         </div>
                         <div>
                            <p className="text-sm font-black text-white uppercase tracking-tight">{tx.target}</p>
                            <p className="text-[10px] font-black uppercase text-neutral-600 tracking-widest">{tx.date}</p>
                         </div>
                      </div>
                      <div className="text-right">
                         <p className={clsx("text-lg font-black tracking-tighter", tx.amount > 0 ? "text-green-500" : "text-white")}>
                            {tx.amount > 0 ? '+' : ''}{tx.amount.toFixed(2)}
                         </p>
                         <div className="flex items-center gap-1 justify-end">
                            <ShieldCheck className="w-3 h-3 text-neutral-700" />
                            <span className="text-[8px] font-black uppercase text-neutral-700 tracking-[0.2em]">Verified</span>
                         </div>
                      </div>
                   </div>
                ))}
             </div>
          </div>
        </div>

        {/* Sidebar: Payment Methods & Auto-renew */}
        <div className="space-y-8">
           <div className="p-8 rounded-[2.5rem] bg-[#0a0a0a] border border-white/5 space-y-8">
              <div className="space-y-1">
                 <h3 className="text-sm font-black uppercase tracking-widest text-white">Payment Methods</h3>
                 <p className="text-[10px] text-neutral-600 font-bold uppercase tracking-widest">Secured by Stripe</p>
              </div>

              <div className="space-y-4">
                 {[
                    { id: 'p_1', brand: 'Visa', last4: '4242', exp: '12/28', isDefault: true },
                    { id: 'p_2', brand: 'Mastercard', last4: '8812', exp: '05/27', isDefault: false }
                 ].map((method) => (
                    <div key={method.id} className="p-5 rounded-2xl bg-white/5 border border-white/10 hover:border-[#9E398D]/30 transition-all cursor-pointer group flex items-center justify-between">
                       <div className="flex items-center gap-4">
                          <div className="w-10 h-7 rounded bg-black/40 border border-white/10 flex items-center justify-center text-[10px] font-black text-white italic tracking-tighter">
                             {method.brand}
                          </div>
                          <div>
                             <p className="text-xs font-black text-white tracking-widest font-mono">**** {method.last4}</p>
                             {method.isDefault && <p className="text-[8px] font-bold uppercase text-[#9E398D] tracking-widest">Default</p>}
                          </div>
                       </div>
                       <button className="opacity-0 group-hover:opacity-100 p-2 rounded-lg text-neutral-600 hover:text-red-500 transition-all">
                          <Trash2 className="w-4 h-4" />
                       </button>
                    </div>
                 ))}
                 
                 <button className="w-full py-4 rounded-xl border border-dashed border-white/10 text-neutral-500 hover:border-[#9E398D]/50 hover:text-[#9E398D] transition-all flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest">
                    <Plus className="w-4 h-4" /> Add Payment Method
                 </button>
              </div>
           </div>

           <div className="p-8 rounded-[2.5rem] bg-gradient-to-br from-[#9E398D]/5 to-[#521E49]/5 border border-[#9E398D]/20 space-y-6">
              <div className="flex items-center gap-3">
                 <TrendingUp className="w-5 h-5 text-[#9E398D]" />
                 <h3 className="text-sm font-black uppercase tracking-widest text-white">Advanced Insights</h3>
              </div>
              <p className="text-xs text-neutral-400 font-medium leading-relaxed">
                 You spent <span className="text-white font-bold">$142.50</span> in creators this month. That's 20% more than September.
              </p>
              <button className="w-full py-4 bg-white/5 rounded-xl text-[10px] font-black uppercase tracking-widest text-[#9E398D] border border-[#9E398D]/20 flex items-center justify-center gap-2">
                 Financial Report <ExternalLink className="w-3 h-3" />
              </button>
           </div>
        </div>
      </section>
    </div>
  );
}
