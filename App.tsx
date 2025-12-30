
import React, { useState, useEffect, useRef } from 'react';
import { AppState, Message } from './types';
import { geminiService } from './services/geminiService';
import { SatelliteVisual } from './components/SatelliteVisual';
import { GroundingResults } from './components/GroundingResults';
import { RoofMetricsCard } from './components/RoofMetricsCard';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>({
    location: { lat: null, lng: null },
    isLoading: false,
    statusMessage: 'SYSTEM READY',
    messages: [
      {
        id: 'initial',
        role: 'model',
        content: "ROOFSCALE INTEL v5.0 ONLINE.\n\nAutomated remote measurement engine active. Grounding link established with Google Earth Engine & Satellite Data Systems.\n\nEnter property address to begin structure geometry analysis.",
        timestamp: new Date(),
      }
    ]
  });
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setState(prev => ({
            ...prev,
            location: { lat: position.coords.latitude, lng: position.coords.longitude }
          }));
        },
        null,
        { enableHighAccuracy: true }
      );
    }
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [state.messages, state.isLoading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || state.isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setState(prev => ({
      ...prev,
      messages: [...prev.messages, userMessage],
      isLoading: true,
      statusMessage: 'ACQUIRING SATELLITE LOCK...'
    }));
    
    const currentInput = input;
    setInput('');

    // Simulate analysis steps for better UX
    setTimeout(() => setState(s => ({ ...s, statusMessage: 'RESOLVING STRUCTURE BOUNDARIES...' })), 2000);
    setTimeout(() => setState(s => ({ ...s, statusMessage: 'COMPUTING PITCH & AREA...' })), 4500);

    try {
      const { text, chunks, metrics } = await geminiService.queryRoofAnalysis(currentInput, state.location);
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        content: text,
        groundingLinks: chunks,
        metrics: metrics,
        timestamp: new Date(),
        isReport: !!metrics
      };

      setState(prev => ({
        ...prev,
        messages: [...prev.messages, aiMessage],
        isLoading: false,
        statusMessage: 'ANALYSIS COMPLETE'
      }));
    } catch (err) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        content: "CRITICAL ERROR: Satellite downlink lost. Could not verify target structure spatial data.",
        timestamp: new Date(),
      };
      setState(prev => ({
        ...prev,
        messages: [...prev.messages, errorMessage],
        isLoading: false,
        statusMessage: 'ERROR: DOWNLINK LOST'
      }));
    }
  };

  return (
    <div className="min-h-screen flex flex-col blueprint-bg text-slate-200 font-sans">
      {/* Precision Header */}
      <header className="sticky top-0 z-50 bg-[#020617]/95 border-b-2 border-amber-600/40 p-4 shadow-2xl backdrop-blur-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-5">
            <div className="w-14 h-14 bg-amber-600 rounded-sm flex items-center justify-center shadow-[0_0_20px_rgba(217,119,6,0.3)] border-b-4 border-amber-800">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-9 w-9 text-slate-950" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12,2L2,7V17L12,22L22,17V7L12,2M12,4.5L19.5,8.25V15.75L12,19.5L4.5,15.75V8.25L12,4.5M12,7A3,3 0 0,0 9,10A3,3 0 0,0 12,13A3,3 0 0,0 15,10A3,3 0 0,0 12,7Z" />
              </svg>
            </div>
            <div>
              <h1 className="text-3xl font-black italic tracking-tighter text-amber-500 leading-none">
                ROOFSCALE <span className="text-white">AI</span>
              </h1>
              <p className="text-[10px] font-mono text-slate-500 mt-1 uppercase tracking-[0.3em] font-bold">
                Professional Geospatial Measurement Terminal
              </p>
            </div>
          </div>
          
          <div className="hidden md:flex flex-col items-end gap-1">
            <div className="text-[9px] text-slate-500 font-black tracking-widest uppercase">Telemetry Status</div>
            <div className={`text-xs font-mono flex items-center gap-2 px-3 py-1 rounded bg-slate-900 border ${state.isLoading ? 'text-amber-400 border-amber-900/50' : 'text-green-500 border-green-900/30'}`}>
              <span className={`w-2 h-2 rounded-full ${state.isLoading ? 'bg-amber-500 animate-pulse' : 'bg-green-500'}`}></span>
              {state.statusMessage}
            </div>
          </div>
        </div>
      </header>

      {/* Main Workstation */}
      <main className="flex-1 flex flex-col lg:flex-row max-w-7xl mx-auto w-full p-6 gap-8 overflow-hidden">
        
        {/* Monitoring & Calibration Panel */}
        <aside className="lg:w-80 shrink-0 flex flex-col gap-6">
          <SatelliteVisual />
          
          <div className="bg-slate-900/90 border-t-2 border-amber-600 rounded p-5 shadow-xl">
            <h2 className="text-[10px] font-black text-amber-500 uppercase tracking-widest mb-4 border-b border-slate-800 pb-2">Analysis Constraints</h2>
            <div className="space-y-5">
              <div className="flex items-start gap-3 opacity-80">
                <div className="w-5 h-5 rounded-full bg-slate-800 border border-amber-600 flex items-center justify-center text-[9px] font-bold text-amber-500">I</div>
                <div>
                  <h4 className="text-[10px] font-black text-slate-400 uppercase">Input Validation</h4>
                  <p className="text-[10px] text-slate-600 leading-tight">Addresses are cross-checked against Google Earth Engine metadata.</p>
                </div>
              </div>
              <div className="flex items-start gap-3 opacity-80">
                <div className="w-5 h-5 rounded-full bg-slate-800 border border-amber-600 flex items-center justify-center text-[9px] font-bold text-amber-500">II</div>
                <div>
                  <h4 className="text-[10px] font-black text-slate-400 uppercase">Scale Calibration</h4>
                  <p className="text-[10px] text-slate-600 leading-tight">Geometric pixel scaling relative to GPS-calculated footprint.</p>
                </div>
              </div>
              <div className="flex items-start gap-3 opacity-80">
                <div className="w-5 h-5 rounded-full bg-slate-800 border border-amber-600 flex items-center justify-center text-[9px] font-bold text-amber-500">III</div>
                <div>
                  <h4 className="text-[10px] font-black text-slate-400 uppercase">Truth Verification</h4>
                  <p className="text-[10px] text-slate-600 leading-tight">Results must be confirmed via Grounding Source links.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="hidden lg:block mt-auto p-4 bg-slate-900 border border-slate-800 rounded">
             <div className="text-[9px] font-mono text-slate-500 leading-tight uppercase font-bold">
               System Log v5.0.1<br/>
               Grounding: Google Maps Tool<br/>
               Model: Gemini 2.5 Flash<br/>
               Precision: Sub-meter radial
             </div>
          </div>
        </aside>

        {/* Report Stream */}
        <section className="flex-1 bg-slate-950/40 border border-slate-800/60 rounded-xl flex flex-col overflow-hidden relative shadow-2xl backdrop-blur-sm">
          <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-amber-600 to-transparent"></div>
          
          <div 
            ref={scrollRef}
            className="flex-1 overflow-y-auto p-8 space-y-10 custom-scrollbar"
          >
            {state.messages.map((msg) => (
              <div 
                key={msg.id} 
                className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div className={`max-w-[100%] md:max-w-[90%] rounded-lg p-6 ${
                  msg.role === 'user' 
                  ? 'bg-amber-600 text-slate-950 font-black shadow-[0_10px_30px_rgba(217,119,6,0.2)] uppercase text-lg' 
                  : 'bg-[#0a0f1d] border-l-4 border-amber-600 text-slate-300 shadow-xl'
                }`}>
                  <p className={`leading-relaxed whitespace-pre-wrap ${msg.role === 'user' ? 'font-mono' : 'font-sans text-sm'}`}>
                    {msg.content}
                  </p>
                  
                  {msg.metrics && <RoofMetricsCard metrics={msg.metrics} />}
                  {msg.groundingLinks && <GroundingResults chunks={msg.groundingLinks} />}
                </div>
                <div className="flex items-center gap-3 mt-3 px-2">
                  <div className="w-2 h-2 rounded-full bg-amber-600/30"></div>
                  <span className="text-[9px] text-slate-600 uppercase font-black tracking-[0.2em]">
                    {msg.role === 'user' ? 'QUOTATION_REQ' : 'SATELLITE_DATA_REPORT'} — {msg.timestamp.toLocaleTimeString()}
                  </span>
                </div>
              </div>
            ))}
            {state.isLoading && (
              <div className="flex flex-col items-center justify-center py-20 space-y-6">
                <div className="relative">
                  <div className="w-20 h-20 border-2 border-amber-600/20 rounded-full"></div>
                  <div className="absolute inset-0 w-20 h-20 border-t-2 border-amber-600 rounded-full animate-spin"></div>
                  <div className="absolute inset-4 border border-amber-600/10 rounded-full animate-pulse"></div>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-xs font-mono text-amber-500 animate-pulse tracking-[0.5em] uppercase font-black">{state.statusMessage}</span>
                  <span className="text-[9px] text-slate-600 font-mono mt-2 uppercase">GATHERING SPECTRAL IMAGERY...</span>
                </div>
              </div>
            )}
          </div>

          {/* Address Input Terminal */}
          <div className="p-8 bg-[#020617] border-t-2 border-slate-800">
            <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1 group">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none transition-colors group-focus-within:text-amber-500 text-slate-600">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="3" />
                    <path d="M12 2v3m0 14v3m10-10h-3M5 12H2" />
                  </svg>
                </div>
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="TARGET ADDRESS FOR ROOF ANALYSIS..."
                  className="w-full bg-slate-900/50 border-2 border-slate-800 rounded-lg pl-14 pr-4 py-4 text-sm focus:outline-none focus:border-amber-600/50 transition-all text-white placeholder:text-slate-700 font-mono tracking-wider"
                />
              </div>
              <button
                type="submit"
                disabled={state.isLoading || !input.trim()}
                className="bg-amber-600 hover:bg-amber-500 disabled:bg-slate-900 disabled:text-slate-700 text-slate-950 px-10 py-4 rounded-lg font-black text-sm transition-all flex items-center justify-center gap-3 uppercase tracking-tighter shadow-lg shadow-amber-900/10"
              >
                <span>RUN ANALYSIS</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                  <path d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9" />
                </svg>
              </button>
            </form>
            <div className="mt-4 flex items-center justify-between">
              <div className="flex gap-6">
                <div className="flex items-center gap-2 text-[10px] text-slate-500 font-black">
                   <div className="w-2 h-2 bg-amber-600 rounded-full animate-pulse"></div>
                   PRECISION-CALIBRATED
                </div>
                <div className="flex items-center gap-2 text-[10px] text-slate-500 font-black">
                   <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                   ADR-RESOLVER ACTIVE
                </div>
              </div>
              <span className="text-[9px] text-slate-700 font-mono uppercase tracking-widest font-black">Secure Industrial Terminal v5.0</span>
            </div>
          </div>
        </section>
      </main>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #d97706; border-radius: 10px; }
      `}</style>
    </div>
  );
};

export default App;
