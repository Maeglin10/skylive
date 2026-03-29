'use client';

import { useState, useEffect } from "react";
import {
  Users,
  TrendingUp,
  BarChart3,
  ShieldAlert,
  DollarSign,
  Eye,
  Activity,
  Zap,
  CheckCircle2,
  Sparkles,
  Server,
  Lock,
  Flag,
  Loader2
} from "lucide-react";
import { clsx } from "clsx";
import { apiClient } from "@/lib/api/client";

interface AdminStats {
  totalRevenue?: number;
  activeUsers?: number;
  liveStreams?: number;
  platformFee?: number;
}

interface StatConfig {
  label: string;
  value?: string | number;
  change: string;
  icon: any;
}

const flags = [
  { id: '1', user: '@CyberPunk', reason: 'Copyright', status: 'PENDING' },
  { id: '2', user: '@ElenaFans', reason: 'Spam', status: 'REVIEWED' },
  { id: '3', user: '@WebDev99', reason: 'Sensitive Content', status: 'PENDING' },
];

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'MODERATION' | 'SYSTEM'>('OVERVIEW');
  const [adminStats, setAdminStats] = useState<AdminStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await apiClient.get<AdminStats>('/admin/stats');
        setAdminStats(response.data);
      } catch (error) {
        console.error('Failed to fetch admin stats:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  const stats: StatConfig[] = [
    { label: 'Total Revenue', value: `$${(adminStats?.totalRevenue || 0).toLocaleString()}`, change: '+12.5%', icon: DollarSign },
    { label: 'Active Users', value: (adminStats?.activeUsers || 0).toLocaleString(), change: '+5.2%', icon: Users },
    { label: 'Live Streams', value: (adminStats?.liveStreams || 0).toLocaleString(), change: '+24.1%', icon: Activity },
    { label: 'Platform Fee', value: `$${(adminStats?.platformFee || 0).toLocaleString()}`, change: '+12.5%', icon: Zap },
  ];

  return (
    <div className="container max-w-7xl mx-auto p-8 space-y-12 pb-24 animate-fade-in font-sans">
      <header className="flex justify-between items-end gap-6">
        <div className="space-y-1">
          <h1 className="text-4xl font-black tracking-tight text-white flex items-center gap-3">
             Admin Terminal <Sparkles className="w-6 h-6 text-[#9E398D]" />
          </h1>
          <p className="text-sm text-neutral-400 font-medium tracking-tight">System overview and platform governance.</p>
        </div>
        <div className="px-6 py-2 rounded-full bg-green-500/10 border border-green-500/20 text-green-500 text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
           <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
           System Healthy
        </div>
      </header>

      {/* Admin Tabs */}
      <nav className="flex items-center gap-12 border-b border-white/5 pb-4">
        {['OVERVIEW', 'MODERATION', 'SYSTEM'].map((tab) => (
          <button 
            key={tab} 
            onClick={() => setActiveTab(tab as any)}
            className={clsx(
              "text-[10px] font-black uppercase tracking-[0.2em] pb-4 -mb-4 transition-all border-b-2",
              activeTab === tab ? "text-[#9E398D] border-[#9E398D]" : "text-neutral-500 border-transparent hover:text-white"
            )}
          >
            {tab}
          </button>
        ))}
      </nav>

      {activeTab === 'OVERVIEW' && (
        <>
          {/* Stats Grid */}
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {isLoading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="p-8 rounded-[2.5rem] bg-white/[0.02] border border-white/5">
                  <div className="space-y-3">
                    <div className="w-12 h-12 rounded-2xl bg-white/5 animate-pulse" />
                    <div className="h-6 bg-white/5 rounded-lg animate-pulse" />
                    <div className="h-4 bg-white/5 rounded-lg animate-pulse w-3/4" />
                  </div>
                </div>
              ))
            ) : (
              stats.map((s, i) => (
                <div key={i} className="p-8 rounded-[2.5rem] bg-white/[0.02] border border-white/5 hover:border-[#9E398D]/20 transition-all group shadow-xl">
                  <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-[#9E398D] mb-6 group-hover:scale-110 transition-all">
                    <s.icon className="w-5 h-5" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-black uppercase text-neutral-500 tracking-widest">{s.label}</p>
                    <div className="flex items-end justify-between">
                      <span className="text-3xl font-black text-white">{s.value}</span>
                      <span className="text-[10px] font-black text-green-500 mb-1">{s.change}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </section>

          {/* Revenue Chart Placeholder */}
          <section className="p-12 rounded-[2.5rem] bg-gradient-to-br from-[#0a0a0a] to-white/[0.02] border border-white/5 relative overflow-hidden shadow-2xl">
             <div className="flex items-center justify-between mb-12">
                <div className="space-y-1">
                   <h3 className="text-xl font-black text-white uppercase tracking-tight">Revenue Stream</h3>
                   <p className="text-xs text-neutral-500 font-medium">Monthly platform profit metrics.</p>
                </div>
                <div className="flex gap-4">
                   <button className="px-4 py-2 rounded-xl bg-white/5 text-[8px] font-black uppercase tracking-widest border border-white/10 hover:bg-white/10 transition-all">All Time</button>
                   <button className="px-4 py-2 rounded-xl gradient-primary text-[8px] font-black uppercase tracking-widest text-white shadow-xl">Past 30 Days</button>
                </div>
             </div>
             <div className="h-64 w-full bg-white/[0.01] rounded-3xl border border-white/5 flex items-center justify-center relative overflow-hidden">
                <BarChart3 className="absolute inset-0 w-full h-full text-white/[0.02] -rotate-6" />
                <p className="text-[10px] font-black uppercase text-neutral-700 tracking-[0.4em] z-10">Chart Signal Processing...</p>
             </div>
          </section>
        </>
      )}

      {activeTab === 'MODERATION' && (
        <section className="space-y-8 animate-fade-in">
           <div className="flex items-center justify-between">
              <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-3">
                 <ShieldAlert className="w-6 h-6 text-red-500" /> Pending Flags
              </h2>
           </div>
           <div className="space-y-4">
              {flags.map((f) => (
                 <div key={f.id} className="p-8 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-between group">
                    <div className="flex items-center gap-8">
                       <span className="text-sm font-black text-white uppercase tracking-tight group-hover:text-red-500 transition-all">{f.user}</span>
                       <div className="flex flex-col">
                          <span className="text-[10px] font-black uppercase text-neutral-600 tracking-widest">Reason</span>
                          <span className="text-xs font-medium text-neutral-400">{f.reason}</span>
                       </div>
                    </div>
                    <div className="flex items-center gap-6">
                       <span className={clsx(
                          "px-3 py-1 rounded-full text-[8px] font-black tracking-widest uppercase",
                          f.status === 'PENDING' ? "bg-red-500/10 text-red-500" : "bg-neutral-500/10 text-neutral-500"
                       )}>
                          {f.status}
                       </span>
                       <button className="p-3 rounded-xl bg-white/5 border border-white/5 text-neutral-400 hover:text-white transition-all"><Eye className="w-4 h-4" /></button>
                       <button className="p-3 rounded-xl bg-red-600/20 text-red-500 border border-red-500/20 hover:bg-red-600 transition-all hover:text-white"><Flag className="w-4 h-4" /></button>
                       <button className="p-3 rounded-xl bg-green-500/20 text-green-500 border border-green-500/20 hover:bg-green-500 transition-all hover:text-white"><CheckCircle2 className="w-4 h-4" /></button>
                    </div>
                 </div>
              ))}
           </div>
        </section>
      )}

      {activeTab === 'SYSTEM' && (
         <section className="grid grid-cols-1 md:grid-cols-2 gap-12 animate-fade-in">
            <div className="p-10 rounded-[2.5rem] bg-white/[0.02] border border-white/5 space-y-8 shadow-xl">
               <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-500">
                     <Server className="w-5 h-5" />
                  </div>
                  <h3 className="text-xl font-black text-white uppercase tracking-tight">Core Infrastructure</h3>
               </div>
               <div className="space-y-4">
                  {[
                     { name: 'Nginx RTMP', status: 'HEALTHY' },
                     { name: 'Stripe Gateway', status: 'READY' },
                     { name: 'Prisma Client', status: 'CONNECTED' },
                  ].map((s, i) => (
                     <div key={i} className="flex justify-between items-center p-4 rounded-xl bg-black/40 border border-white/5">
                        <span className="text-[10px] font-black uppercase text-neutral-400 tracking-widest">{s.name}</span>
                        <span className="text-[8px] font-black text-green-500 tracking-widest uppercase">{s.status}</span>
                     </div>
                  ))}
               </div>
            </div>
            
            <div className="p-10 rounded-[2.5rem] bg-white/[0.02] border border-white/5 space-y-8 shadow-xl">
               <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center text-yellow-500">
                     <Lock className="w-5 h-5" />
                  </div>
                  <h3 className="text-xl font-black text-white uppercase tracking-tight">Security Flags</h3>
               </div>
               <div className="p-8 rounded-2xl bg-yellow-500/5 border border-yellow-500/10 text-yellow-500 space-y-4">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] animate-pulse">Warning: Auth Rate Limit High</p>
                  <p className="text-xs font-medium leading-relaxed opacity-80">
                     Suspicious activity detected on the /auth/login endpoint (IP: 192.168.1.18). Automatic throttling initiated.
                  </p>
               </div>
            </div>
         </section>
      )}
    </div>
  );
}
