
import React from 'react';
import { RoofMetrics } from '../types';

interface Props {
  metrics: RoofMetrics;
}

export const RoofMetricsCard: React.FC<Props> = ({ metrics }) => {
  return (
    <div className="mt-8 bg-[#0a0f1d] border-2 border-amber-600/60 rounded-xl overflow-hidden shadow-[0_0_40px_rgba(217,119,6,0.15)]">
      {/* Report Header */}
      <div className="bg-amber-600 px-6 py-3 flex justify-between items-center border-b border-amber-700">
        <div className="flex items-center gap-3">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-950" viewBox="0 0 24 24" fill="currentColor">
            <path d="M21,16.5C21,16.88 20.79,17.21 20.47,17.38L12.57,21.82C12.41,21.94 12.21,22 12,22C11.79,22 11.59,21.94 11.43,21.82L3.53,17.38C3.21,17.21 3,16.88 3,16.5V7.5C3,7.12 3.21,6.79 3.53,6.62L11.43,2.18C11.59,2.06 11.79,2 12,2C12.21,2 12.41,2.06 12.57,2.18L20.47,6.62C20.79,6.79 21,7.12 21,7.5V16.5Z" />
          </svg>
          <h3 className="font-black text-slate-950 text-sm uppercase tracking-widest">Architectural Survey Result</h3>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-[10px] bg-slate-950 text-amber-500 px-2 py-0.5 rounded font-mono font-bold">
            CONFIDENCE: {metrics.confidenceScore}%
          </span>
        </div>
      </div>
      
      {/* Primary Data Row */}
      <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-8 bg-gradient-to-b from-slate-900/50 to-transparent">
        <div className="flex flex-col border-l-2 border-amber-500/30 pl-4">
          <span className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mb-1">Total Roof Area</span>
          <span className="text-3xl font-black text-white leading-none">{metrics.totalAreaSqFt.toLocaleString()}</span>
          <span className="text-[10px] text-amber-500/80 font-mono mt-1 font-bold">SQ. FEET</span>
        </div>
        <div className="flex flex-col border-l-2 border-amber-500/30 pl-4">
          <span className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mb-1">Total Squares</span>
          <span className="text-3xl font-black text-white leading-none">{metrics.squares.toFixed(2)}</span>
          <span className="text-[10px] text-amber-500/80 font-mono mt-1 font-bold">100 SQ FT UNITS</span>
        </div>
        <div className="flex flex-col border-l-2 border-amber-500/30 pl-4">
          <span className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mb-1">Primary Pitch</span>
          <span className="text-3xl font-black text-white leading-none">{metrics.primaryPitch}</span>
          <span className="text-[10px] text-amber-500/80 font-mono mt-1 font-bold">RISE / RUN</span>
        </div>
      </div>

      {/* Linear Footages Detail */}
      <div className="px-6 py-4 grid grid-cols-2 md:grid-cols-4 gap-6 border-y border-slate-800 bg-slate-950/40">
        <div>
          <span className="text-[9px] text-slate-600 uppercase font-black">Ridges</span>
          <div className="text-lg font-bold text-slate-200">{metrics.ridgesLengthFt} <span className="text-[10px] text-slate-500">FT</span></div>
        </div>
        <div>
          <span className="text-[9px] text-slate-600 uppercase font-black">Valleys</span>
          <div className="text-lg font-bold text-slate-200">{metrics.valleysLengthFt} <span className="text-[10px] text-slate-500">FT</span></div>
        </div>
        <div>
          <span className="text-[9px] text-slate-600 uppercase font-black">Eaves</span>
          <div className="text-lg font-bold text-slate-200">{metrics.eavesLengthFt} <span className="text-[10px] text-slate-500">FT</span></div>
        </div>
        <div>
          <span className="text-[9px] text-slate-600 uppercase font-black">Rakes</span>
          <div className="text-lg font-bold text-slate-200">{metrics.rakesLengthFt} <span className="text-[10px] text-slate-500">FT</span></div>
        </div>
      </div>

      {/* Waste Estimator Tool */}
      <div className="p-6 bg-amber-600/5">
        <h4 className="text-[10px] font-black text-amber-500/80 uppercase tracking-widest mb-4">Material Ordering (With Waste)</h4>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-slate-900 p-4 rounded border border-slate-800">
            <div className="text-[9px] text-slate-500 font-bold uppercase">10% Waste (Complex)</div>
            <div className="text-xl font-black text-white">{metrics.waste10Percent.toFixed(2)} <span className="text-xs text-slate-500">SQS</span></div>
          </div>
          <div className="bg-slate-900 p-4 rounded border border-slate-800">
            <div className="text-[9px] text-slate-500 font-bold uppercase">15% Waste (High Complexity)</div>
            <div className="text-xl font-black text-white">{metrics.waste15Percent.toFixed(2)} <span className="text-xs text-slate-500">SQS</span></div>
          </div>
        </div>
      </div>

      <div className="bg-slate-900 p-4 flex justify-between items-center border-t border-slate-800">
        <div className="text-[9px] text-slate-600 font-mono">
          REF_ID: RS-{Math.random().toString(36).substr(2, 9).toUpperCase()}
        </div>
        <div className="flex gap-2">
          <button className="text-[10px] px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded font-black transition-all">
            PRINT PREVIEW
          </button>
          <button className="text-[10px] px-4 py-2 bg-amber-600 hover:bg-amber-500 text-slate-950 rounded font-black transition-all shadow-lg shadow-amber-900/20">
            DOWNLOAD CAD REPORT
          </button>
        </div>
      </div>
    </div>
  );
};
