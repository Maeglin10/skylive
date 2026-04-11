"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Play, Users, Heart, MessageCircle, Zap, Lock, ArrowLeft } from "lucide-react";

const mockCreators = [
  { id: 1, name: "Alex Rivera", handle: "@alexcreates", avatar: "AR", followers: "124K", isLive: true, category: "Gaming", color: "from-purple-500 to-pink-500" },
  { id: 2, name: "Marie Dubois", handle: "@mariedubois", avatar: "MD", followers: "89K", isLive: true, category: "Music", color: "from-cyan-500 to-blue-500" },
  { id: 3, name: "Jordan Kim", handle: "@jordankim", avatar: "JK", followers: "210K", isLive: false, category: "Art", color: "from-orange-500 to-amber-400" },
  { id: 4, name: "Sofia Tanaka", handle: "@sofiatanaka", avatar: "ST", followers: "67K", isLive: true, category: "Fitness", color: "from-green-500 to-emerald-400" },
];

const mockVideos = [
  { id: 1, title: "Late Night Stream — Chill vibes 🎵", creator: "Marie Dubois", views: "12K", duration: "2:34:10", thumbnail: "🎵" },
  { id: 2, title: "Pro Tips: Advanced Techniques", creator: "Alex Rivera", views: "8.4K", duration: "45:22", thumbnail: "🎮" },
  { id: 3, title: "Speed Paint — Fantasy Landscape", creator: "Jordan Kim", views: "31K", duration: "1:12:05", thumbnail: "🎨" },
  { id: 4, title: "Morning Yoga with Sofia", creator: "Sofia Tanaka", views: "5.2K", duration: "28:40", thumbnail: "🧘" },
];

export default function DemoPage() {
  return (
    <div className="bg-black text-white min-h-screen font-sans">
      {/* Demo Banner */}
      <div className="bg-gradient-to-r from-[#9E398D] to-[#06B6D4] text-white text-center py-2 text-xs font-bold uppercase tracking-widest">
        ✦ Mode Démo — Données simulées · <Link href="/register" className="underline hover:no-underline">Créer un compte pour accéder au contenu complet</Link>
      </div>

      {/* Nav */}
      <nav className="px-6 py-4 flex items-center justify-between border-b border-white/5">
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2 text-white/50 hover:text-white transition-colors text-sm">
            <ArrowLeft className="w-4 h-4" /> Back
          </Link>
          <h1 className="text-xl font-black tracking-tighter text-[#06B6D4]">SkyLive</h1>
          <span className="text-[10px] bg-white/10 text-white/60 px-2 py-0.5 rounded-full uppercase tracking-wider">Demo</span>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/login" className="text-xs text-white/50 hover:text-white transition-colors px-4">Sign In</Link>
          <Link href="/register" className="bg-gradient-to-r from-[#9E398D] to-[#06B6D4] text-white text-xs font-bold uppercase tracking-widest px-6 py-2 rounded-full hover:scale-105 transition-all">
            Join Free
          </Link>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-12">
        {/* Live Now */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <h2 className="text-lg font-black uppercase tracking-widest text-white/80">Live Now</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {mockCreators.filter(c => c.isLive).map((creator) => (
              <motion.div
                key={creator.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative rounded-2xl overflow-hidden border border-white/10 bg-white/5 p-4 hover:border-white/20 transition-all cursor-pointer group"
                onClick={() => alert("Créez un compte gratuit pour accéder aux streams en direct !")}
              >
                <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${creator.color} flex items-center justify-center font-black text-sm mb-3`}>
                  {creator.avatar}
                </div>
                <div className="absolute top-3 right-3 bg-red-500 text-white text-[9px] font-black uppercase px-2 py-0.5 rounded-full flex items-center gap-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />LIVE
                </div>
                <p className="font-bold text-sm">{creator.name}</p>
                <p className="text-xs text-white/40">{creator.handle}</p>
                <p className="text-xs text-white/30 mt-1">{creator.followers} followers</p>
                <div className="mt-3 flex items-center gap-1 text-[10px] text-white/30">
                  <Play className="w-3 h-3" />
                  <span>{creator.category}</span>
                </div>
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Lock className="w-6 h-6 text-white/80" />
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Recent Videos */}
        <section>
          <h2 className="text-lg font-black uppercase tracking-widest text-white/80 mb-6">Recent Content</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {mockVideos.map((video) => (
              <motion.div
                key={video.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-2xl border border-white/10 bg-white/5 overflow-hidden hover:border-white/20 transition-all cursor-pointer group"
                onClick={() => alert("Créez un compte gratuit pour accéder au contenu !")}
              >
                <div className="h-36 bg-white/5 flex items-center justify-center text-5xl relative">
                  {video.thumbnail}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-white/10 border border-white/20 flex items-center justify-center">
                      <Lock className="w-5 h-5 text-white/80" />
                    </div>
                  </div>
                  <span className="absolute bottom-2 right-2 bg-black/70 text-white/80 text-[10px] px-2 py-0.5 rounded">{video.duration}</span>
                </div>
                <div className="p-3">
                  <p className="text-sm font-semibold leading-tight line-clamp-2">{video.title}</p>
                  <p className="text-xs text-white/40 mt-1">{video.creator} · {video.views} views</p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="rounded-3xl bg-gradient-to-br from-[#9E398D]/20 to-[#06B6D4]/20 border border-white/10 p-12 text-center">
          <Zap className="w-12 h-12 text-[#06B6D4] mx-auto mb-4" />
          <h2 className="text-3xl font-black mb-4">Ready to go further?</h2>
          <p className="text-white/60 mb-8 max-w-md mx-auto">Create a free account to follow creators, join live streams, subscribe to exclusive content, and more.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register" className="bg-gradient-to-r from-[#9E398D] to-[#06B6D4] text-white font-black uppercase tracking-widest px-10 py-4 rounded-full hover:scale-105 transition-all">
              Create Free Account
            </Link>
            <Link href="/" className="border border-white/20 text-white/70 font-bold px-10 py-4 rounded-full hover:border-white/40 hover:text-white transition-all">
              Back to Home
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
