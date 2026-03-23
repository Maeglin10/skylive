'use client';

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { 
  Heart, 
  Share2, 
  Users, 
  Grid, 
  Video, 
  Lock, 
  CheckCircle2, 
  Sparkles,
  Zap,
  Star,
  ShieldCheck
} from "lucide-react";
import { clsx } from "clsx";
import { ContentCard } from "@/components/feed/ContentCard";
import { LiveCard } from "@/components/feed/LiveCard";

export default function CreatorProfilePage() {
  const params = useParams();
  const username = params.username as string;
  const [activeTab, setActiveTab] = useState<'POSTS' | 'LIVE'>('POSTS');
  const [isFollowing, setIsFollowing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const creator = {
    username,
    displayName: "Elena Creative",
    bio: "Digital Artist & Creative Coder. Passionate about exploring the intersection of art and tech. 🎨💻",
    avatarUrl: null,
    followerCount: 14200,
    subscriberCount: 890,
    contentCount: 45,
    isVerified: true,
    subscriptionPrice: 9.99
  };

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[80vh]">
         <div className="w-8 h-8 rounded-full border-2 border-[#9E398D] border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black font-sans scrollbar-hide pb-24">
      {/* Profile Banner */}
      <div className="h-64 md:h-80 w-full relative overflow-hidden">
         <div className="absolute inset-0 bg-gradient-to-b from-[#9E398D]/20 to-black/80 blur-3xl scale-125" />
         <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1541963463532-d68292c34b19?auto=format&fit=crop&q=80&w=1200')] bg-cover bg-center mix-blend-overlay opacity-30" />
      </div>

      <div className="container max-w-6xl mx-auto px-6 -mt-32 relative z-10">
        <header className="flex flex-col md:flex-row items-start md:items-end justify-between gap-8 pb-12">
          <div className="flex flex-col md:flex-row items-start md:items-end gap-8">
            <div className="w-32 h-32 md:w-48 md:h-48 rounded-full gradient-primary border-4 border-black p-1 shadow-2xl animate-scale-in">
               <div className="w-full h-full rounded-full overflow-hidden bg-black flex items-center justify-center text-4xl font-extrabold text-white">
                 {creator.displayName[0]}
               </div>
            </div>
            <div className="space-y-4 animate-fade-in delay-150">
               <div className="space-y-1">
                 <div className="flex items-center gap-2">
                    <h1 className="text-4xl font-black text-white tracking-tighter">{creator.displayName}</h1>
                    {creator.isVerified && <CheckCircle2 className="w-6 h-6 text-[#9E398D]" />}
                 </div>
                 <p className="text-[#9E398D] font-black uppercase tracking-[0.2em] text-[10px]">@{creator.username}</p>
               </div>
               
               <p className="max-w-xl text-neutral-400 font-medium tracking-tight text-sm leading-relaxed">
                 {creator.bio}
               </p>

               <div className="flex items-center gap-8 pt-2 overflow-x-auto whitespace-nowrap">
                  <div className="flex flex-col">
                     <span className="text-xl font-black text-white">{creator.followerCount.toLocaleString()}</span>
                     <span className="text-[10px] font-black uppercase text-neutral-600 tracking-widest">Followers</span>
                  </div>
                  <div className="flex flex-col">
                     <span className="text-xl font-black text-white">{creator.subscriberCount.toLocaleString()}</span>
                     <span className="text-[10px] font-black uppercase text-neutral-600 tracking-widest">Subscribers</span>
                  </div>
                  <div className="flex flex-col">
                     <span className="text-xl font-black text-white">{creator.contentCount}</span>
                     <span className="text-[10px] font-black uppercase text-neutral-600 tracking-widest">Creations</span>
                  </div>
               </div>
            </div>
          </div>

          <div className="flex flex-col items-center gap-4 w-full md:w-auto animate-fade-in delay-300">
             <button 
                onClick={() => setIsFollowing(!isFollowing)}
                className={clsx(
                   "w-full md:w-48 py-4 rounded-xl text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all transform hover:-translate-y-1 active:scale-95",
                   isFollowing ? "bg-white/5 border border-white/10 text-neutral-400" : "gradient-primary text-white shadow-xl"
                )}
             >
                {isFollowing ? 'Following' : <><Star className="w-4 h-4 fill-current" /> Follow</>}
             </button>
             <div className="flex gap-4 w-full">
                <button className="flex-1 py-3 rounded-xl bg-white/5 border border-white/5 text-neutral-400 hover:text-white transition-all flex items-center justify-center gap-2">
                  <Share2 className="w-4 h-4" /> <span className="text-[10px] font-black uppercase tracking-widest">Share</span>
                </button>
                <button className="p-3 rounded-xl bg-white/5 border border-white/5 text-neutral-400 hover:text-white transition-all">
                  <Heart className="w-5 h-5" />
                </button>
             </div>
          </div>
        </header>

        {/* Pricing / CTA Section */}
        {!isFollowing && (
           <section className="bg-gradient-to-r from-[#9E398D]/10 to-[#521E49]/10 rounded-[2.5rem] p-12 border border-[#9E398D]/20 mb-12 flex flex-col md:flex-row items-center justify-between gap-12 animate-fade-in shadow-2xl">
              <div className="space-y-6 flex-1 text-center md:text-left">
                 <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-[#9E398D]/20 text-[#9E398D] text-[10px] font-black uppercase tracking-[0.2em] animate-pulse">
                    <Zap className="w-4 h-4" /> Exclusive Access
                 </div>
                 <div className="space-y-2">
                    <h2 className="text-3xl font-black text-white tracking-tight">Support my work</h2>
                    <p className="text-neutral-400 font-medium tracking-tight">Get full access to all my live sessions, tutorials, and premium files.</p>
                 </div>
                 <div className="flex flex-col md:flex-row items-center gap-6 pt-4">
                    <div className="flex items-center gap-3">
                       <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center"><ShieldCheck className="w-5 h-5 text-neutral-400" /></div>
                       <p className="text-[10px] font-black uppercase text-neutral-500 max-w-[100px] leading-tight tracking-[0.1em]">Secure Stripe Checkout</p>
                    </div>
                    <div className="flex items-center gap-3">
                       <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center"><Sparkles className="w-5 h-5 text-neutral-400" /></div>
                       <p className="text-[10px] font-black uppercase text-neutral-500 max-w-[100px] leading-tight tracking-[0.1em]">Premium Resources</p>
                    </div>
                 </div>
              </div>
              <div className="w-full md:w-auto text-center space-y-4">
                 <div className="text-5xl font-black text-white tracking-tighter">${creator.subscriptionPrice.toFixed(2)}<span className="text-sm font-medium text-neutral-600"> / month</span></div>
                 <button className="w-full md:w-64 py-5 rounded-2xl bg-white text-black font-black uppercase text-xs tracking-[0.2em] shadow-2xl hover:bg-neutral-200 transition-all hover:scale-105 active:scale-95">
                   Subscribe Now
                 </button>
              </div>
           </section>
        )}

        {/* Content Tabs */}
        <section className="space-y-8 animate-fade-in delay-500">
           <nav className="flex items-center gap-12 border-b border-white/5 pb-4">
              <button 
                onClick={() => setActiveTab('POSTS')}
                className={clsx(
                  "flex items-center gap-2 text-sm font-black uppercase tracking-[0.2em] pb-4 -mb-4 transition-all border-b-2",
                  activeTab === 'POSTS' ? "text-[#9E398D] border-[#9E398D]" : "text-neutral-500 border-transparent hover:text-white"
                )}
              >
                <Grid className="w-4 h-4" /> Creations
              </button>
              <button 
                onClick={() => setActiveTab('LIVE')}
                className={clsx(
                  "flex items-center gap-2 text-sm font-black uppercase tracking-[0.2em] pb-4 -mb-4 transition-all border-b-2",
                  activeTab === 'LIVE' ? "text-[#9E398D] border-[#9E398D]" : "text-neutral-500 border-transparent hover:text-white"
                )}
              >
                <Video className="w-4 h-4" /> Live History
              </button>
           </nav>

           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {activeTab === 'POSTS' ? (
                <>
                  <ContentCard 
                    id="c_1"
                    creatorName={creator.displayName}
                    type="IMAGE"
                    accessRule="FREE"
                    title="The Sunset Project - Day 42"
                    createdAt="Oct 12, 2026"
                    isLocked={false}
                    thumbnailUrl="https://images.unsplash.com/photo-1541963463532-d68292c34b19?auto=format&fit=crop&q=80&w=600"
                  />
                   <ContentCard 
                    id="c_2"
                    creatorName={creator.displayName}
                    type="VIDEO"
                    accessRule="SUBSCRIPTION"
                    title="Pro Painting Shortcuts for Procreate"
                    createdAt="Oct 10, 2026"
                    isLocked={true}
                    thumbnailUrl="https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&q=80&w=600"
                  />
                </>
              ) : (
                <div className="col-span-full flex flex-col items-center justify-center py-20 text-center opacity-40">
                  <Video className="w-12 h-12 text-neutral-500 mb-4" />
                  <h3 className="text-xl font-black text-white uppercase tracking-tight">No Finished Lives</h3>
                  <p className="text-sm text-neutral-600 font-medium">Elena hasn't finished any live sessions yet.</p>
                </div>
              )}
           </div>
        </section>
      </div>
    </div>
  );
}
