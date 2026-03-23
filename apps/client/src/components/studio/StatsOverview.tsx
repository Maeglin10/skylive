'use client';

import { DollarSign, Users, Eye, TrendingUp } from "lucide-react";

export function StatsOverview() {
  const stats = [
    { label: "Total Revenue", value: "$4,290.50", icon: DollarSign, change: "+12%", color: "text-green-500" },
    { label: "Active Subs", value: "1,204", icon: Users, change: "+5.4%", color: "text-[#9E398D]" },
    { label: "Total Views", value: "45.2K", icon: Eye, change: "-2%", color: "text-blue-500" },
    { label: "Tips Received", value: "$840.00", icon: TrendingUp, change: "+24%", color: "text-yellow-500" },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-fade-in">
      {stats.map((stat, i) => (
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
