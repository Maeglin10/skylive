'use client';

import { LiveCard } from "@/components/feed/LiveCard";
import { ContentCard } from "@/components/feed/ContentCard";
import { FeedSkeleton } from "@/components/feed/FeedSkeleton";
import { LiveStories } from "@/components/feed/LiveStories";
import { useState, useEffect } from "react";
import { Sparkles, Video, Grid, AlertCircle } from "lucide-react";
import { feedAdapter } from "@/lib/api/feed.adapter";
import { liveAdapter } from "@/lib/api/live.adapter";
import type { ContentItem, LiveSession } from "@/lib/api/types";

export default function FeedPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [liveSessions, setLiveSessions] = useState<LiveSession[]>([]);
  const [posts, setPosts] = useState<ContentItem[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const [feedData, sessionsData] = await Promise.all([
          feedAdapter.getFeed(),
          liveAdapter.getSessions('LIVE'),
        ]);

        setLiveSessions(sessionsData);
        setPosts(feedData.content);
      } catch (err) {
        console.error('Failed to fetch feed data:', err);
        setError('Failed to load feed. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

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
      ) : error ? (
        <div className="flex items-center justify-center p-12 rounded-2xl border border-white/5 bg-[#0a0a0a] gap-4">
          <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
          <p className="text-neutral-300">{error}</p>
        </div>
      ) : (
        <>
          {/* Stories Section */}
          <section className="space-y-6 pb-4">
             <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#9E398D]" />
                <h2 className="text-sm font-black uppercase tracking-widest text-neutral-400">Live Stories</h2>
             </div>
             <LiveStories />
          </section>

          {/* Live Now Section */}
          {liveSessions.length > 0 && (
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
                  <LiveCard
                    key={session.id}
                    id={session.id}
                    creatorName={session.creatorName}
                    title={session.title}
                    viewerCount={session.viewerCount}
                    status={session.status}
                  />
                ))}
              </div>
            </section>
          )}

          {/* Recommended Posts Section */}
          {posts.length > 0 && (
            <section className="space-y-6 animate-fade-in delay-150">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Grid className="w-4 h-4 text-neutral-500" />
                  <h2 className="text-sm font-black uppercase tracking-widest text-neutral-400">Recommended for You</h2>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {posts.map((post) => (
                  <ContentCard
                    key={post.id}
                    id={post.id}
                    creatorName={post.creatorName}
                    type={post.type}
                    accessRule={post.accessRule}
                    title={post.title}
                    createdAt={post.createdAt}
                    isLocked={!post.isUnlocked}
                    thumbnailUrl={post.thumbnailUrl}
                    price={post.price}
                  />
                ))}
              </div>
            </section>
          )}
        </>
      )}
    </div>
  );
}
