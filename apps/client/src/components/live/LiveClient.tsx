'use client';

import { HLSPlayer } from "@/components/player/HLSPlayer";
import { ChatPanel } from "@/components/chat/ChatPanel";
import { PollsOverlay } from "@/components/live/PollsOverlay";
import { Heart, Share2, Users, AlertCircle, BarChart3, Clock, Gift, Star, ChevronDown } from "lucide-react";
import { useState, useEffect } from "react";
import { clsx } from "clsx";
import { liveAdapter } from "@/lib/api/live.adapter";
import type { LiveSession } from "@/lib/api/types";

interface LiveClientProps {
  id: string;
}

// Demo stream — real Mux HLS test stream always available
const DEMO_STREAM: LiveSession & { startedAt: Date; creator: { avatar: string; followers: number } } = {
  id: "demo-stream",
  title: "Live Coding Session — Building a SaaS in 2 hours",
  creatorId: "creator-1",
  creatorName: "Valentin M.",
  status: "LIVE",
  hlsUrl: "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8",
  viewerCount: 143,
  startedAt: new Date(Date.now() - 47 * 60 * 1000),
  creator: {
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop",
    followers: 2847,
  },
};

const SUBSCRIPTION_TIERS = [
  { id: "fan", label: "Fan", price: "Free", description: "Access public streams", color: "text-neutral-300" },
  { id: "supporter", label: "Supporter", price: "€4.99/mo", description: "Full stream access + exclusive chat", color: "text-[#9E398D]" },
  { id: "vip", label: "VIP", price: "€14.99/mo", description: "All perks + 1:1 DMs + early access", color: "text-yellow-400" },
];

const TIP_AMOUNTS = [1, 2, 5, 10];

function formatDuration(startedAt: Date): string {
  const elapsed = Math.floor((Date.now() - startedAt.getTime()) / 1000);
  const h = Math.floor(elapsed / 3600);
  const m = Math.floor((elapsed % 3600) / 60);
  const s = elapsed % 60;
  if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  return `${m}:${String(s).padStart(2, '0')}`;
}

export function LiveClient({ id }: LiveClientProps) {
  const [isFollowing, setIsFollowing] = useState(false);
  const [isPollOpen, setIsPollOpen] = useState(false);
  const [session, setSession] = useState<typeof DEMO_STREAM | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Subscribe UI state
  const [showSubscribeModal, setShowSubscribeModal] = useState(false);
  const [selectedTier, setSelectedTier] = useState("supporter");
  const [subscribed, setSubscribed] = useState(false);

  // Tip UI state
  const [showTipModal, setShowTipModal] = useState(false);
  const [tipAmount, setTipAmount] = useState<number | null>(5);
  const [customTip, setCustomTip] = useState("");
  const [tipped, setTipped] = useState(false);

  // Live timer
  const [elapsed, setElapsed] = useState("0:00");

  useEffect(() => {
    const fetchSession = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await liveAdapter.getSession(id);
        setSession({ ...DEMO_STREAM, ...data });
      } catch {
        // Fall back to demo stream for demo / when API is unavailable
        setSession(DEMO_STREAM);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSession();
  }, [id]);

  // Update elapsed timer
  useEffect(() => {
    if (!session) return;
    const tick = () => setElapsed(formatDuration(session.startedAt));
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [session]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <div className="w-8 h-8 rounded-full border-2 border-[#9E398D] border-t-transparent animate-spin" />
      </div>
    );
  }

  if (error || !session) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <div className="flex flex-col items-center gap-4 p-8 rounded-2xl border border-white/5 bg-[#0a0a0a]">
          <AlertCircle className="w-8 h-8 text-red-500" />
          <div className="text-center space-y-2">
            <p className="text-neutral-300 font-medium">{error || 'Session not found'}</p>
            <a href="/feed" className="text-[#9E398D] text-sm font-bold hover:underline">
              Back to Feed
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-black overflow-hidden font-sans">
      {/* ── Main area ── */}
      <div className="flex flex-col flex-1 min-w-0 overflow-y-auto">

        {/* Player */}
        <div className="p-6 bg-[#060606]">
          <HLSPlayer
            src={session.hlsUrl ?? "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8"}
            autoPlay
            className="max-w-5xl mx-auto shadow-[0_20px_80px_-20px_rgba(158,57,141,0.4)] ring-1 ring-white/5"
          />
        </div>

        {/* Stream meta */}
        <div className="px-8 py-6 border-t border-white/5 space-y-6 max-w-5xl mx-auto w-full">

          {/* Title row */}
          <div className="flex flex-wrap items-start justify-between gap-6">
            <div className="space-y-3 flex-1 min-w-0">
              <div className="flex items-center gap-3 flex-wrap">
                {session.status === "LIVE" && (
                  <span className="px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase bg-red-500 text-white animate-pulse shadow-[0_0_20px_rgba(239,68,68,0.4)]">
                    Live
                  </span>
                )}
                <div className="flex items-center gap-1.5 text-zinc-500 text-xs font-medium">
                  <Clock className="w-3.5 h-3.5" />
                  {elapsed}
                </div>
                <div className="flex items-center gap-1.5 text-zinc-500 text-xs font-medium">
                  <Users className="w-3.5 h-3.5" />
                  {session.viewerCount.toLocaleString()} viewers
                </div>
              </div>
              <h1 className="text-2xl font-black tracking-tight text-white leading-tight">{session.title}</h1>
            </div>

            {/* Actions */}
            <div className="flex gap-3 flex-shrink-0">
              <button
                onClick={() => setIsFollowing(f => !f)}
                className={clsx(
                  "px-6 py-2.5 rounded-xl font-bold uppercase tracking-widest text-xs transition-all transform hover:-translate-y-0.5 active:scale-95 flex items-center gap-2",
                  isFollowing
                    ? "bg-white/5 text-neutral-400 border border-white/10"
                    : "bg-gradient-to-r from-[#9E398D] to-[#521E49] text-white shadow-[0_10px_20px_-5px_rgba(158,57,141,0.3)]"
                )}
              >
                <Heart className={clsx("w-4 h-4", !isFollowing && "fill-current")} />
                {isFollowing ? "Following" : "Follow"}
              </button>

              <button
                onClick={() => setShowSubscribeModal(true)}
                className="px-6 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white font-bold text-xs uppercase tracking-widest hover:bg-white/10 transition-all hover:-translate-y-0.5 flex items-center gap-2"
              >
                <Star className="w-4 h-4 text-yellow-400" />
                Subscribe
              </button>

              <button
                onClick={() => setShowTipModal(true)}
                className="px-6 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white font-bold text-xs uppercase tracking-widest hover:bg-white/10 transition-all hover:-translate-y-0.5 flex items-center gap-2"
              >
                <Gift className="w-4 h-4 text-pink-400" />
                Tip
              </button>

              <button
                title="Share stream"
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({ title: session.title, url: window.location.href }).catch(() => {});
                  } else {
                    navigator.clipboard.writeText(window.location.href);
                  }
                }}
                className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-neutral-400 hover:text-white transition-all hover:-translate-y-0.5"
              >
                <Share2 className="w-4 h-4" />
              </button>

              <button
                onClick={() => setIsPollOpen(!isPollOpen)}
                className={clsx(
                  "p-2.5 rounded-xl border transition-all hover:-translate-y-0.5",
                  isPollOpen
                    ? "bg-[#9E398D]/20 border-[#9E398D]/50 text-[#9E398D]"
                    : "bg-white/5 border-white/10 text-neutral-400 hover:text-white"
                )}
              >
                <BarChart3 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Creator info */}
          <div className="flex items-center gap-4 p-4 bg-white/3 border border-white/5 rounded-2xl">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#9E398D] to-[#521E49] flex items-center justify-center text-lg font-black text-white border border-white/10 flex-shrink-0">
              {session.creatorName.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-black text-white">{session.creatorName}</p>
              <p className="text-[10px] uppercase font-black tracking-widest text-[#9E398D]">
                {session.creator.followers.toLocaleString()} followers
              </p>
            </div>
            <div className="text-right">
              <p className="text-[10px] uppercase font-black tracking-widest text-zinc-500">Professional Creator</p>
            </div>
          </div>

        </div>

        {/* Polls overlay */}
        <PollsOverlay isOpen={isPollOpen} onClose={() => setIsPollOpen(false)} />
      </div>

      {/* ── Chat sidebar ── */}
      <aside className="flex flex-col border-l border-white/5 overflow-hidden w-96 animate-slide-in-right flex-shrink-0">
        <ChatPanel liveSessionId={id} />
      </aside>

      {/* ── Subscribe Modal ── */}
      {showSubscribeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#0a0a0a] border border-white/10 rounded-3xl p-8 w-full max-w-md space-y-6 shadow-2xl">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-black text-white">Subscribe to {session.creatorName}</h2>
                <p className="text-xs text-zinc-500 mt-0.5">Choose a tier that works for you</p>
              </div>
              <button onClick={() => setShowSubscribeModal(false)} className="text-zinc-500 hover:text-white transition-colors text-xl font-bold">✕</button>
            </div>

            {subscribed ? (
              <div className="text-center py-6 space-y-3">
                <div className="text-5xl">🎉</div>
                <p className="text-white font-black text-lg">You're subscribed!</p>
                <p className="text-zinc-400 text-sm">Welcome to the community.</p>
                <button
                  onClick={() => { setSubscribed(false); setShowSubscribeModal(false); }}
                  className="mt-4 px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#9E398D] to-[#521E49] text-white font-bold text-xs uppercase tracking-widest"
                >
                  Done
                </button>
              </div>
            ) : (
              <>
                <div className="space-y-3">
                  {SUBSCRIPTION_TIERS.map((tier) => (
                    <button
                      key={tier.id}
                      onClick={() => setSelectedTier(tier.id)}
                      className={clsx(
                        "w-full flex items-center justify-between p-4 rounded-2xl border transition-all",
                        selectedTier === tier.id
                          ? "border-[#9E398D]/60 bg-[#9E398D]/10"
                          : "border-white/5 bg-white/3 hover:border-white/10"
                      )}
                    >
                      <div className="text-left">
                        <div className={clsx("font-black text-sm", tier.color)}>{tier.label}</div>
                        <div className="text-xs text-zinc-500 mt-0.5">{tier.description}</div>
                      </div>
                      <div className={clsx("font-black text-sm", tier.color)}>{tier.price}</div>
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => setSubscribed(true)}
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#9E398D] to-[#521E49] text-white font-black uppercase tracking-widest text-sm shadow-[0_10px_30px_-5px_rgba(158,57,141,0.4)] hover:scale-[1.02] transition-all"
                >
                  Subscribe — {SUBSCRIPTION_TIERS.find(t => t.id === selectedTier)?.price}
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* ── Tip Modal ── */}
      {showTipModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#0a0a0a] border border-white/10 rounded-3xl p-8 w-full max-w-sm space-y-6 shadow-2xl">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-black text-white">Send a Tip</h2>
                <p className="text-xs text-zinc-500 mt-0.5">Support {session.creatorName}</p>
              </div>
              <button onClick={() => { setShowTipModal(false); setTipped(false); }} className="text-zinc-500 hover:text-white transition-colors text-xl font-bold">✕</button>
            </div>

            {tipped ? (
              <div className="text-center py-6 space-y-3">
                <div className="text-5xl">💝</div>
                <p className="text-white font-black text-lg">Tip sent!</p>
                <p className="text-zinc-400 text-sm">€{tipAmount ?? customTip} sent to {session.creatorName}</p>
                <button
                  onClick={() => { setTipped(false); setShowTipModal(false); }}
                  className="mt-4 px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#9E398D] to-[#521E49] text-white font-bold text-xs uppercase tracking-widest"
                >
                  Done
                </button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-4 gap-2">
                  {TIP_AMOUNTS.map((amt) => (
                    <button
                      key={amt}
                      onClick={() => { setTipAmount(amt); setCustomTip(""); }}
                      className={clsx(
                        "py-3 rounded-xl font-black text-sm transition-all",
                        tipAmount === amt && !customTip
                          ? "bg-gradient-to-r from-[#9E398D] to-[#521E49] text-white shadow-[0_5px_15px_-5px_rgba(158,57,141,0.5)]"
                          : "bg-white/5 border border-white/10 text-neutral-400 hover:text-white hover:border-white/20"
                      )}
                    >
                      €{amt}
                    </button>
                  ))}
                </div>

                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 font-bold">€</span>
                  <input
                    type="number"
                    min="0.5"
                    step="0.5"
                    placeholder="Custom amount"
                    value={customTip}
                    onChange={(e) => { setCustomTip(e.target.value); setTipAmount(null); }}
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-8 pr-4 text-sm focus:outline-none focus:border-[#9E398D]/50 transition-all"
                  />
                </div>

                <button
                  disabled={!tipAmount && !customTip}
                  onClick={() => setTipped(true)}
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-pink-600 to-[#9E398D] text-white font-black uppercase tracking-widest text-sm disabled:opacity-40 disabled:cursor-not-allowed hover:scale-[1.02] transition-all shadow-[0_10px_30px_-5px_rgba(236,72,153,0.4)]"
                >
                  <Gift className="w-4 h-4 inline mr-2" />
                  Send €{(tipAmount ?? customTip) || "—"}
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
