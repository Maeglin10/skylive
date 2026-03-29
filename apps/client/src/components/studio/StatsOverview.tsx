'use client';

import { useEffect, useState } from "react";
import { DollarSign, Users, Eye, TrendingUp } from "lucide-react";
import { apiClient } from "@/lib/api/client";

interface CreatorStats {
  activeSubscribers: number;
  totalTips: number;
  totalPurchases: number;
  revenue: number;
}

export function StatsOverview() {
  const [stats, setStats] = useState<CreatorStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await apiClient.get<CreatorStats>('/creators/me/stats');
        setStats(response.data);
      } catch (error) {
        console.error('Failed to fetch creator stats:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-fade-in">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="p-6 bg-[#0a0a0a] border border-white/5 rounded-2xl">
            <div className="space-y-3">
              <div className="h-8 bg-white/5 rounded-lg animate-pulse" />
              <div className="h-4 bg-white/5 rounded-lg animate-pulse w-3/4" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!stats) {
    return null;
  }

  const displayStats = [
    { label: "Total Revenue", value: `$${stats.revenue.toFixed(2)}`, icon: DollarSign, change: "+12%", color: "text-green-500" },
    { label: "Active Subs", value: stats.activeSubscribers.toString(), icon: Users, change: "+5.4%", color: "text-[#9E398D]" },
    { label: "Total Purchases", value: stats.totalPurchases.toString(), icon: Eye, change: "-2%", color: "text-blue-500" },
    { label: "Tips Received", value: `$${stats.totalTips.toFixed(2)}`, icon: TrendingUp, change: "+24%", color: "text-yellow-500" },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-fade-in">
      {displayStats.map((stat, i) => (
        <div key={i} className="p-6 bg-[#0a0a0a] border border-white/5 rounded-2xl hover:border-white/10 transition-all group">
          <div className="flex items-center justify-between mb-4">
            <div className={`p-2 rounded-xl bg-white/5 group-hover:scale-110 transition-transform ${stat.color}`}>
              <stat.icon className="w-5 h-5" />
            </div>
            <span className={`text-[10px] font-black uppercase tracking-widest ${
              stat.change.startsWith('+') ? 'text-green-500' : 'text-red-500'
            }`}>
              {stat.change}
            </span>
          </div>
          <div className="space-y-1">
            <h3 className="text-2xl font-black tracking-tight text-white">{stat.value}</h3>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-500">
              {stat.label}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
