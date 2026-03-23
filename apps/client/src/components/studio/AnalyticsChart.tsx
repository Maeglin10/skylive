'use client';

import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

const data = [
  { name: 'Mon', revenue: 420 },
  { name: 'Tue', revenue: 580 },
  { name: 'Wed', revenue: 890 },
  { name: 'Thu', revenue: 640 },
  { name: 'Fri', revenue: 1100 },
  { name: 'Sat', revenue: 1450 },
  { name: 'Sun', revenue: 1280 },
];

export function AnalyticsChart() {
  return (
    <div className="h-[300px] w-full mt-6 bg-white/5 rounded-3xl p-6 border border-white/5 overflow-hidden">
      <div className="flex items-center justify-between mb-8">
         <h3 className="text-sm font-black uppercase tracking-widest text-neutral-400">Revenue Stream (Last 7 Days)</h3>
         <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#9E398D]" />
            <span className="text-[10px] font-black uppercase text-neutral-500">Gross Earnings</span>
         </div>
      </div>
      
      <ResponsiveContainer width="100%" height="80%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#9E398D" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#9E398D" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
          <XAxis 
            dataKey="name" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#666', fontSize: 10, fontWeight: 900 }}
            dy={10}
          />
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#666', fontSize: 10, fontWeight: 900 }}
            tickFormatter={(value) => `$${value}`}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#0a0a0a', 
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '12px',
              fontSize: '12px',
              fontWeight: 900,
              color: 'white'
            }}
            itemStyle={{ color: '#9E398D' }}
          />
          <Area 
            type="monotone" 
            dataKey="revenue" 
            stroke="#9E398D" 
            strokeWidth={4}
            fillOpacity={1} 
            fill="url(#colorRevenue)" 
            animationDuration={2000}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
