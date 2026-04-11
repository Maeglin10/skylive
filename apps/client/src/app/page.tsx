'use client';

import Link from "next/link";
import { motion } from "framer-motion";
import { 
  Sparkles, 
  Video, 
  Gamepad2, 
  Heart, 
  Zap, 
  Rocket, 
  ArrowRight, 
  ShieldCheck,
  Globe,
  Star
} from "lucide-react";
import { clsx } from "clsx";

export default function LandingPage() {
  return (
    <div className="bg-black text-white font-sans overflow-x-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 p-6 flex items-center justify-between backdrop-blur-md border-b border-white/5 mx-auto max-w-7xl rounded-b-3xl">
         <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black tracking-tighter text-[#06B6D4]">SkyLive</h1>
         </div>
         <div className="hidden md:flex items-center gap-8 text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400">
            <a href="#features" className="hover:text-white transition-all">Features</a>
            <a href="#creators" className="hover:text-white transition-all">Creators</a>
            <a href="#pricing" className="hover:text-white transition-all">Pricing</a>
         </div>
         <div className="flex items-center gap-4">
            <Link href="/login" className="text-xs font-black uppercase tracking-widest text-neutral-400 hover:text-white transition-all px-4">Sign In</Link>
            <Link href="/demo" className="text-[10px] font-black uppercase tracking-[0.2em] px-6 py-3 rounded-full border border-white/20 hover:border-white/40 text-white/70 hover:text-white transition-all">Try Demo</Link>
            <Link href="/register" className="gradient-primary text-white text-[10px] font-black uppercase tracking-[0.2em] px-8 py-3 rounded-full hover:scale-105 transition-all shadow-xl">Join Now</Link>
         </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center pt-24 pb-20 px-6 overflow-hidden">
         {/* Background Effects */}
         <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1541963463532-d68292c34b19?auto=format&fit=crop&q=80&w=1200')] bg-cover bg-center opacity-20" />
         <div className="absolute inset-0 bg-gradient-to-b from-black/0 via-black/80 to-black" />
         <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(158,57,141,0.1),transparent_70%)]" />
         
         <div className="relative z-10 max-w-6xl mx-auto flex flex-col items-center text-center space-y-12">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="inline-flex items-center gap-2 px-6 py-2 rounded-full border border-[#9E398D]/30 bg-[#9E398D]/10 text-[#9E398D] text-[10px] font-black uppercase tracking-[0.2em]"
            >
               <Sparkles className="w-4 h-4" /> The future of content creation
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-6xl md:text-9xl font-black tracking-tighter leading-[0.95] max-w-4xl"
            >
              OWN YOUR <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#06B6D4] to-[#0891B2]">CREATIVITY</span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-xl md:text-2xl text-neutral-400 font-medium max-w-2xl tracking-tight leading-relaxed"
            >
              Antigravity is the premium platform for live streaming and exclusive content.
              No middlemen. No shadow-bans. Just pure creation.
            </motion.p>
            
            <motion.div 
               initial={{ opacity: 0, y: 30 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ duration: 0.8, delay: 0.6 }}
               className="flex flex-col md:flex-row gap-6 w-full md:w-auto"
            >
               <Link href="/register" className="px-12 py-6 rounded-2xl gradient-primary text-white font-black uppercase text-xs tracking-[0.2em] shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3">
                  Start Creating <ArrowRight className="w-4 h-4" />
               </Link>
               <Link href="/feed" className="px-12 py-6 rounded-2xl border border-white/10 bg-white/5 text-white font-black uppercase text-xs tracking-[0.2em] hover:bg-white/10 transition-all active:scale-95 flex items-center justify-center gap-3">
                  Watch Live <Video className="w-4 h-4" />
               </Link>
            </motion.div>

            {/* Social Proof */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 1 }}
              className="pt-12 flex flex-col items-center gap-6"
            >
               <div className="flex -space-x-4">
                  {[1,2,3,4,5].map(i => (
                     <div key={i} className="w-12 h-12 rounded-full border-4 border-black bg-neutral-900 flex items-center justify-center overflow-hidden">
                        <UserCircleIcon className="w-full h-full text-neutral-700" />
                     </div>
                  ))}
               </div>
               <p className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-600">
                  Joined by <span className="text-white">1,420+</span> pro creators this week
               </p>
            </motion.div>
         </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-32 px-6 max-w-7xl mx-auto space-y-20">
         <div className="text-center space-y-6">
            <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-[#06B6D4]">Why Antigravity?</h2>
            <h3 className="text-4xl md:text-6xl font-black tracking-tight">PLATFORM FOR THE NEXT GEN</h3>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <FeatureCard 
               icon={Zap}
               title="Ultra Low Latency"
               description="Real-time interaction with your fans. Less than 2 seconds delay on live streams."
            />
            <FeatureCard 
               icon={Heart}
               title="Direct Funding"
               description="Fans support you directly with PPV, subscriptions, and tips. Instant payouts."
            />
            <FeatureCard 
               icon={ShieldCheck}
               title="Ownership First"
               description="You own your content and your audience. We never sell your data or shadow-ban you."
            />
         </div>
      </section>

      {/* Creator Showcase */}
      <section id="creators" className="py-32 px-6 bg-[#0a0a0a] border-y border-white/5 relative overflow-hidden">
         <div className="absolute top-0 right-0 w-1/3 h-full bg-[#9E398D]/10 blur-[100px] rounded-full translate-x-1/2" />
         <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="space-y-12">
               <div className="space-y-6">
                  <h2 className="text-5xl md:text-7xl font-black tracking-tighter leading-tight">MADE FOR <br />PROFESSIONALS</h2>
                  <p className="text-xl text-neutral-400 font-medium tracking-tight leading-relaxed max-w-lg">
                    Manage your entire career from a single dashboard. 
                    Monitor analytics, moderate chat, and grow your revenue like a startup.
                  </p>
               </div>
               
               <ul className="space-y-6">
                  {[
                     { icon: Gamepad2, label: "Advanced Gaming Tools", color: "text-blue-500" },
                     { icon: Rocket, label: "Instant Global Payouts", color: "text-[#06B6D4]" },
                     { icon: Globe, label: "Global Content Delivery", color: "text-green-500" }
                  ].map((item, i) => (
                     <li key={i} className="flex items-center gap-6 group cursor-pointer">
                        <div className={clsx("w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center transition-all group-hover:bg-white/10", item.color)}>
                           <item.icon className="w-6 h-6" />
                        </div>
                        <span className="text-lg font-black text-white uppercase tracking-tight group-hover:translate-x-2 transition-all">{item.label}</span>
                     </li>
                  ))}
               </ul>

               <Link href="/creator/studio" className="inline-flex items-center gap-4 text-[#06B6D4] font-black uppercase tracking-[0.2em] text-[10px] hover:translate-x-2 transition-all">
                  Explore Creator Tools <ArrowRight className="w-4 h-4" />
               </Link>
            </div>

            <div className="relative group">
               <div className="absolute inset-0 bg-gradient-to-r from-[#9E398D]/20 to-[#521E49]/20 blur-3xl rounded-[3rem] animate-pulse" />
               <div className="relative rounded-[3rem] border border-white/10 overflow-hidden bg-black aspect-square shadow-2xl">
                  <img 
                    src="https://images.unsplash.com/photo-1541963463532-d68292c34b19?auto=format&fit=crop&q=80&w=800" 
                    className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110 grayscale hover:grayscale-0"
                    alt="Abstract Creative"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/0 text-white p-12 flex flex-col justify-end gap-2">
                     <div className="flex items-center gap-2 px-4 py-1 rounded-full bg-[#06B6D4] w-fit text-[10px] font-black uppercase tracking-widest mb-4">Live</div>
                     <p className="text-3xl font-black uppercase tracking-tighter">Elena Creative</p>
                     <p className="text-sm font-medium text-neutral-400">Late night painting & coding session</p>
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* CTA Section */}
      <section id="pricing" className="py-40 px-6 max-w-5xl mx-auto text-center space-y-12">
         <h2 className="text-6xl md:text-8xl font-black tracking-tighter">READY TO SCALE?</h2>
         <p className="text-xl text-neutral-400 font-medium tracking-tight">Join the next wave of independent creators today.</p>
         <div className="pt-8">
            <Link href="/register" className="px-16 py-8 rounded-3xl gradient-primary text-white font-black uppercase text-sm tracking-[0.3em] shadow-[0_20px_40px_-10px_rgba(158,57,141,0.5)] hover:scale-105 active:scale-95 transition-all inline-block">
               Create Free Account
            </Link>
         </div>
      </section>

      {/* Footer */}
      <footer className="p-12 border-t border-white/5 mx-auto max-w-7xl flex flex-col md:flex-row justify-between items-center gap-8">
         <div className="flex flex-col items-center md:items-start gap-2 text-center md:text-left">
            <h1 className="text-xl font-black tracking-tighter text-[#06B6D4]">SkyLive</h1>
            <p className="text-[10px] font-black uppercase tracking-widest text-neutral-600">The Ultimate Creator Hub © 2026</p>
         </div>
         <div className="flex gap-12 text-[10px] font-black uppercase tracking-widest text-neutral-500">
            <a href="#" className="hover:text-white transition-all">Twitter</a>
            <a href="#" className="hover:text-white transition-all">Instagram</a>
            <a href="#" className="hover:text-white transition-all">Discord</a>
            <a href="#" className="hover:text-white transition-all">TOS</a>
         </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon: Icon, title, description }: { icon: any; title: string; description: string }) {
  return (
    <div className="p-12 rounded-[2.5rem] bg-white/5 border border-white/5 hover:border-[#9E398D]/30 transition-all group hover:-translate-y-2 shadow-2xl">
       <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-[#06B6D4] mb-8 group-hover:scale-110 transition-all">
          <Icon className="w-8 h-8" />
       </div>
       <h4 className="text-2xl font-black text-white tracking-tight mb-4 uppercase">{title}</h4>
       <p className="text-neutral-500 font-medium tracking-tight leading-relaxed">{description}</p>
    </div>
  );
}

function UserCircleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  );
}
