import React from 'react';

export const CommandCenter: React.FC = () => {
  return (
    <div className="flex-1 bg-brand-black p-6 overflow-y-auto space-y-6 text-left select-none">
      {/* 1. Top Metrics Row Placeholder */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Active Fan Signals', value: '200 Ingested', color: 'border-slate-800' },
          { label: 'Semantic Clusters', value: '4 Detected', color: 'border-accent-purple/30' },
          { label: 'Rumor Shield Warnings', value: '0 Active', color: 'border-positive-teal/30' },
          { label: 'Stadium Health Index', value: '98% Nominal', color: 'border-info-blue/30' }
        ].map((m, idx) => (
          <div 
            key={idx} 
            className={`bg-surface border ${m.color} rounded-xl p-5 flex flex-col justify-between shadow-lg relative overflow-hidden group hover:border-slate-700 transition-all duration-300`}
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-accent-purple/5 rounded-full blur-2xl group-hover:bg-accent-purple/10 transition-all" />
            <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
              {m.label}
            </span>
            <span className="text-xl font-extrabold text-slate-100 mt-2 font-mono">
              {m.value}
            </span>
          </div>
        ))}
      </div>

      {/* 2. Main Two-Column Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (Stadium Pulse + Zone Map stacked) */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* Stadium Pulse Card Placeholder */}
          <div className="bg-surface border border-slate-800 rounded-xl p-6 h-96 flex flex-col shadow-lg relative overflow-hidden group hover:border-slate-700 transition-all">
            <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-accent-purple animate-pulse" />
                <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider">
                  Stadium Pulse
                </h3>
              </div>
              <span className="text-[10px] bg-slate-800 text-slate-400 font-bold px-2 py-0.5 rounded">
                Fan Signal Feed
              </span>
            </div>
            
            <div className="flex-1 border border-dashed border-slate-800/80 rounded-lg flex flex-col items-center justify-center text-slate-500 bg-brand-black/20">
              <svg className="w-8 h-8 mb-2 text-slate-600 group-hover:text-accent-purple/50 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              </svg>
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Stadium Pulse Stream Viewport
              </span>
              <span className="text-[10px] text-slate-500 mt-1">
                Real-time streaming fan signals will render here.
              </span>
            </div>
          </div>

          {/* Zone Map Card Placeholder */}
          <div className="bg-surface border border-slate-800 rounded-xl p-6 h-80 flex flex-col shadow-lg relative overflow-hidden group hover:border-slate-700 transition-all">
            <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-info-blue" />
                <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider">
                  Zone Map
                </h3>
              </div>
              <span className="text-[10px] bg-slate-800 text-slate-400 font-bold px-2 py-0.5 rounded">
                Spatial Crowd Density
              </span>
            </div>
            
            <div className="flex-1 border border-dashed border-slate-800/80 rounded-lg flex flex-col items-center justify-center text-slate-500 bg-brand-black/20">
              <svg className="w-8 h-8 mb-2 text-slate-600 group-hover:text-info-blue/50 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Stadium Spatial Map Viewport
              </span>
              <span className="text-[10px] text-slate-500 mt-1">
                Visual zone crowd status and density heatmap will render here.
              </span>
            </div>
          </div>
        </div>

        {/* Right Column (AI War Room panel) */}
        <div className="bg-surface border border-slate-800 rounded-xl p-6 h-[46.5rem] flex flex-col shadow-lg relative overflow-hidden group hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-accent-purple shadow-[0_0_8px_#aa3bff]" />
              <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider">
                AI War Room
              </h3>
            </div>
            <span className="text-[10px] bg-slate-800 text-slate-400 font-bold px-2 py-0.5 rounded">
              Orchestrator Panel
            </span>
          </div>
          
          <div className="flex-1 border border-dashed border-slate-800/80 rounded-lg flex flex-col items-center justify-center text-slate-500 bg-brand-black/20 px-4 text-center">
            <svg className="w-10 h-10 mb-3 text-slate-600 group-hover:text-accent-purple/50 transition-colors animate-spin-slow" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            </svg>
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Department Opinions & Consensus
            </span>
            <span className="text-[10px] text-slate-500 mt-2 max-w-[200px]">
              Synthesis details and agent operations consensus plans will render here.
            </span>
          </div>
        </div>
      </div>

      {/* 3. Bottom Row: 5 Department Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[
          { name: 'Security Agent', detail: 'Safety / Egress', color: 'border-danger-red/20 hover:border-danger-red/50' },
          { name: 'Concessions Agent', detail: 'Food / Staffing', color: 'border-warning-amber/20 hover:border-warning-amber/50' },
          { name: 'Medical Agent', detail: 'Paramedics / Bays', color: 'border-positive-teal/20 hover:border-positive-teal/50' },
          { name: 'Transit Agent', detail: 'Gates / Transport', color: 'border-info-blue/20 hover:border-info-blue/50' },
          { name: 'Broadcast Agent', detail: 'Cameras / Feeds', color: 'border-accent-purple/20 hover:border-accent-purple/50' }
        ].map((agent, idx) => (
          <div 
            key={idx} 
            className={`bg-surface border ${agent.color} rounded-xl p-4 flex flex-col justify-between shadow-md relative overflow-hidden group transition-all duration-300`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-200 group-hover:text-slate-100 transition-colors">
                {agent.name}
              </span>
              <span className="h-2 w-2 rounded-full bg-slate-700 group-hover:bg-accent-purple transition-all duration-300"></span>
            </div>
            <span className="text-[10px] text-slate-500 mt-2 font-medium tracking-wide">
              {agent.detail}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
