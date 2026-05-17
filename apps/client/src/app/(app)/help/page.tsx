'use client';

import { useState } from "react";
import { 
  Search, 
  BookOpen, 
  MessageSquare, 
  Lock, 
  Zap, 
  Video, 
  TrendingUp,
  ShieldCheck,
  ChevronRight,
  Sparkles
} from "lucide-react";
import { clsx } from "clsx";

const categories = [
  { id: '1', icon: Video, title: 'Streaming', desc: 'Setup your OBS, stream keys and bitrate.' },
  { id: '2', icon: Lock, title: 'Privacy', desc: 'Manage your blocks, 2FA and data.' },
  { id: '3', icon: Zap, title: 'Payments', desc: 'Subscription pricing and payouts.' },
  { id: '4', icon: TrendingUp, title: 'Growth', desc: 'Promote your channel and analytics.' },
];

const faqs = [
  { q: "How do I get paid?", a: "Payments are processed through Stripe and sent to your bank account every 7 days." },
  { q: "Is any content allowed?", a: "We have strict guidelines. No illegal or highly sensitive content as per our TOS." },
  { q: "What is the platform fee?", a: "AeviaLive takes a flat 10% on payments to cover server costs and hosting." },
  { q: "How to connect OBS?", a: "Go to your Creator Studio and copy your unique Stream Key into OBS Settings." },
];

export default function HelpPage() {
  const [search, setSearch] = useState("");

  return (
    <div className="container max-w-7xl mx-auto p-8 space-y-12 pb-24 animate-fade-in font-sans">
      {/* Help Header */}
      <header className="relative py-20 px-12 rounded-[3rem] bg-gradient-to-br from-[#9E398D]/20 to-[#521E49]/20 border border-[#9E398D]/20 overflow-hidden text-center space-y-8">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-white/[0.02] -skew-x-12 translate-x-1/2" />
        <div className="space-y-4 relative z-10">
           <h1 className="text-5xl font-black text-white tracking-tighter flex items-center justify-center gap-4">
             How can we help? <Sparkles className="w-8 h-8 text-[#9E398D]" />
           </h1>
           <p className="text-lg text-neutral-400 font-medium tracking-tight">Search our documentation or contact our support team.</p>
        </div>
        
        <div className="max-w-2xl mx-auto relative z-10 group">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-neutral-500 group-focus-within:text-[#9E398D] transition-all" />
          <input 
            type="text" 
            placeholder="Search keywords: 'obs', 'payout', 'password'..." 
            className="w-full h-16 pl-16 pr-8 rounded-2xl bg-black/60 border border-white/10 text-white focus:outline-none focus:border-[#9E398D] transition-all shadow-2xl"
          />
        </div>
      </header>

      {/* Categories Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
         {categories.map((cat) => (
            <div key={cat.id} className="p-8 rounded-3xl bg-white/5 border border-white/5 hover:border-[#9E398D]/30 transition-all group cursor-pointer shadow-xl">
               <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-[#9E398D] mb-6 group-hover:scale-110 transition-all">
                  <cat.icon className="w-6 h-6" />
               </div>
               <h3 className="text-lg font-black text-white uppercase tracking-tight mb-2">{cat.title}</h3>
               <p className="text-xs text-neutral-500 font-medium leading-relaxed">{cat.desc}</p>
            </div>
         ))}
      </section>

      {/* FAQ Section */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-20 py-12">
         <div className="space-y-6">
            <h2 className="text-3xl font-black text-white tracking-tight">Frequent Questions</h2>
            <p className="text-neutral-500 font-medium tracking-tight leading-relaxed">
               Can't find what you're looking for? Check our top-rated guides or reach out to us directly.
            </p>
            <div className="pt-6">
               <button className="px-8 py-4 rounded-xl gradient-primary text-white text-[10px] font-black uppercase tracking-widest shadow-xl flex items-center gap-3">
                  <MessageSquare className="w-4 h-4" /> Open Support Ticket
               </button>
            </div>
         </div>

         <div className="lg:col-span-2 space-y-4">
            {faqs.map((faq, i) => (
               <div key={i} className="p-8 rounded-2xl bg-[#0a0a0a] border border-white/5 hover:border-white/10 transition-all group cursor-pointer flex items-center justify-between">
                  <div className="space-y-2 max-w-xl">
                     <p className="text-sm font-black text-white uppercase tracking-tight group-hover:text-[#9E398D] transition-all">{faq.q}</p>
                     <p className="text-xs text-neutral-500 font-medium leading-relaxed">{faq.a}</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-neutral-700 group-hover:translate-x-1 transition-all" />
               </div>
            ))}
         </div>
      </section>

      {/* Trust & Safety Banner */}
      <section className="p-12 rounded-[2.5rem] bg-white/[0.02] border border-white/5 flex flex-col md:flex-row items-center justify-between gap-12">
         <div className="flex items-center gap-8 text-center md:text-left">
            <div className="w-16 h-16 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-500">
               <ShieldCheck className="w-8 h-8" />
            </div>
            <div className="space-y-1">
               <h3 className="text-xl font-black text-white uppercase tracking-tight">Trust & Safety</h3>
               <p className="text-xs text-neutral-500 font-medium">Read our Community Guidelines and Transparency Report.</p>
            </div>
         </div>
         <button className="px-12 py-5 rounded-2xl border border-white/10 text-[10px] font-black uppercase tracking-widest hover:bg-white/5 transition-all">
            See TOS
         </button>
      </section>
    </div>
  );
}
