
import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from 'recharts';

const data = [
  { name: 'Area', val: 85 },
  { name: 'Pitch', val: 92 },
  { name: 'Detail', val: 78 },
  { name: 'Scale', val: 95 },
];

export const SatelliteVisual: React.FC = () => {
  return (
    <div className="relative w-full h-72 bg-slate-900 border-2 border-amber-500/40 rounded-xl overflow-hidden shadow-2xl">
      {/* Reticle / Viewfinder Overlay */}
      <div className="absolute inset-0 pointer-events-none z-20">
        <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-amber-400"></div>
        <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-amber-400"></div>
        <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-amber-400"></div>
        <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-amber-400"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-16 h-16 border border-amber-500/30 rounded-full flex items-center justify-center">
            <div className="w-1 h-1 bg-amber-500 rounded-full"></div>
          </div>
        </div>
      </div>
      
      {/* Scanning Line */}
      <div className="absolute inset-0 scan-line-horizontal z-10 pointer-events-none"></div>
      
      {/* Background Image (Mock Satellite) */}
      <div className="absolute inset-0 opacity-40">
        <img 
          src="https://images.unsplash.com/photo-1542281286-9e0a16bb7366?auto=format&fit=crop&q=80&w=800" 
          className="w-full h-full object-cover grayscale brightness-50" 
          alt="Satellite Overlay"
        />
      </div>

      <div className="relative z-30 p-4 h-full flex flex-col justify-between">
        <div className="flex justify-between items-start">
          <div className="text-[10px] font-mono text-amber-500 leading-none">
            MODE: SPATIAL_SCAN_v2<br/>
            ALT: 1240m<br/>
            COORD: SYNCING...
          </div>
          <div className="bg-amber-500 text-slate-950 px-2 py-0.5 text-[10px] font-bold rounded">
            LIVE ANALYTICS
          </div>
        </div>
        
        <div className="w-full h-32 mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#475569" vertical={false} />
              <XAxis dataKey="name" tick={{ fill: '#fbbf24', fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis hide domain={[0, 100]} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #fbbf24', color: '#fff' }}
                itemStyle={{ color: '#fbbf24' }}
              />
              <Bar dataKey="val" radius={[4, 4, 0, 0]}>
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#fbbf24' : '#d97706'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
