'use client';

import { LiveCard } from "@/components/feed/LiveCard";
import { ContentCard } from "@/components/feed/ContentCard";
import { FeedSkeleton } from "@/components/feed/FeedSkeleton";
import { useState, useEffect } from "react";
import { Sparkles, Video, Grid } from "lucide-react";

export default function FeedPage() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Mock loading delay
    const timer = setTimeout(() => setIsLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  // Mock data for live sessions and posts
  const liveSessions = [
    {
      id: "live_1",
      creatorName: "Elena Creative",
      title: "Late night high intensity painting session",
      viewerCount: 142,
      status: "LIVE" as const,
      thumbnailUrl: "https://images.unsplash.com/photo-1541963463532-d68292c34b19?auto=format&fit=crop&q=80&w=800",
    },
    {
      id: "live_2",
      creatorName: "Tech Guru",
      title: "How to build a streaming platform in 2 hours",
      viewerCount: 890,
      status: "LIVE" as const,
      thumbnailUrl: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=800",
    },
    {
      id: "live_3",
      creatorName: "Cyber Punk",
      title: "Future of web design with AI tools",
      viewerCount: 45,
      status: "LIVE" as const,
      thumbnailUrl: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=800",
    },
    {
      id: "live_4",
      creatorName: "Gaming Pro",
      title: "Epic Battle Royale - Join the Squad!",
      viewerCount: 1200,
      status: "LIVE" as const,
      thumbnailUrl: "https://images.unsplash.com/photo-1542751371-adc38148e727?auto=format&fit=crop&q=80&w=800",
    },
  ];

  const posts = [
    { id: "c_1", creatorName: "Elena Creative", type: "IMAGE" as const, accessRule: "FREE" as const, title: "Behind the scenes of my newest project", createdAt: "2h ago", isLocked: false, thumbnailUrl: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&q=80&w=600" },
    { id: "c_2", creatorName: "Tech Guru", type: "VIDEO" as const, accessRule: "SUBSCRIPTION" as const, title: "Deep dive into React 19 architecture patterns", createdAt: "5h ago", isLocked: true, thumbnailUrl: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=600" },
    { id: "c_3", creatorName: "Chef Master", type: "IMAGE" as const, title: "The secret to a perfect sourdough crust", accessRule: "PPV" as const, price: 5, createdAt: "Yesterday", isLocked: true, thumbnailUrl: "https://images.unsplash.com/photo-1550617931-e17a7b70dce2?auto=format&fit=crop&q=80&w=600" },
    { id: "c_4", creatorName: "Digital Nomad", type: "POST" as const, accessRule: "FREE" as const, title: "10 cities you must visit in 2026", createdAt: "Yesterday", isLocked: false, thumbnailUrl: "https://images.unsplash.com/photo-1501785888041-af3ba6f60060?auto=format&fit=crop&q=80&w=600" },
    { id: "c_5", creatorName: "Fitness Fanatic", type: "VIDEO" as const, accessRule: "FREE" as const, title: "Full Body Workout for Beginners", createdAt: "3 days ago", isLocked: false, thumbnailUrl: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&q=80&w=600" },
    { id: "c_6", creatorName: "Art Historian", type: "POST" as const, accessRule: "SUBSCRIPTION" as const, title: "The Renaissance: A New Perspective", createdAt: "1 week ago", isLocked: true, thumbnailUrl: "https://images.unsplash.com/photo-1547891654-e66ad3fd1d63?auto=format&fit=crop&q=80&w=600" },
  ];

  return (
    <div className="container max-w-7xl mx-auto p-8 space-y-12 pb-24 animate-fade-in font-sans">
      <header className="flex justify-between items-end">
        <div className="space-y-1">
          <h1 className="text-3xl font-black tracking-tight text-white flex items-center gap-3">
            Your Feed <Sparkles className="w-5 h-5 text-[#9E398D]" />
          </h1>
          <p className="text-sm text-neutral-400 font-medium tracking-tight">Handpicked content from the creators you follow.</p>
        </div>
      </header>

      {isLoading ? (
        <FeedSkeleton />
      ) : (
        <>
          {/* Live Now Section */}
          <section className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Video className="w-4 h-4 text-[#9E398D]" />
                <h2 className="text-sm font-black uppercase tracking-widest text-neutral-400">Live Channels</h2>
              </div>
              <button className="text-[10px] font-black uppercase tracking-widest text-[#9E398D] hover:underline decoration-2 underline-offset-4 transition-all">
                View All
              </button>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {liveSessions.map((session) => (
                <LiveCard key={session.id} {...session} />
              ))}
            </div>
          </section>

          {/* Recommended Posts Section */}
          <section className="space-y-6 animate-fade-in delay-150">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Grid className="w-4 h-4 text-neutral-500" />
                <h2 className="text-sm font-black uppercase tracking-widest text-neutral-400">Recommended for You</h2>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post) => (
                <ContentCard key={post.id} {...post} />
              ))}
            </div>
          </section>
        </>
      )}
    </div>
  );
}
