import React from 'react';

export const BroadcastAICard: React.FC = () => {
  return (
    <div className="bg-surface border border-slate-800 rounded-xl p-4 flex flex-col justify-between shadow-md relative overflow-hidden group hover:border-slate-700 transition-all duration-300 min-h-[180px] text-left select-none">
      {/* Background Decorative Gradient */}
      <div className="absolute -top-10 -right-10 w-24 h-24 bg-accent-purple/5 rounded-full blur-xl group-hover:bg-accent-purple/10 transition-all" />

      {/* Header */}
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-lg bg-info-blue/10 border border-info-blue/20 flex items-center justify-center text-info-blue shadow-sm group-hover:shadow-[0_0_10px_rgba(59,130,246,0.4)] transition-all">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
              />
            </svg>
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-bold text-slate-200 uppercase tracking-wider">Broadcast AI</span>
            <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wide">
              Highlight Generator
            </span>
          </div>
        </div>
      </div>

      {/* Thumbnail Area */}
      <div className="relative w-full h-20 rounded-lg overflow-hidden border border-slate-800 bg-brand-black flex items-center justify-center shadow-inner group/thumb mb-2">
        {/* Pitch-like CSS background gradient */}
        <div className="absolute inset-0 bg-gradient-to-tr from-emerald-950 via-slate-900 to-accent-purple/20 opacity-80" />

        {/* Play Icon */}
        <div className="z-10 w-7 h-7 rounded-full bg-slate-900/80 border border-slate-700/50 flex items-center justify-center text-slate-200 group-hover/thumb:scale-110 group-hover/thumb:bg-slate-800 transition-all cursor-pointer">
          <svg className="w-3.5 h-3.5 fill-current ml-0.5" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z" />
          </svg>
        </div>

        {/* Thumbnail Labels */}
        <div className="absolute top-1.5 left-1.5 bg-brand-black/60 px-1.5 py-0.5 rounded text-[8px] font-mono text-slate-400 border border-slate-800">
          REEL #28
        </div>

        <div className="absolute bottom-1.5 right-1.5 bg-brand-black/60 px-1.5 py-0.5 rounded text-[8px] font-mono text-slate-400 border border-slate-800">
          74:12 - 74:18
        </div>
      </div>

      {/* Crowd Emotion and Energy Percentage */}
      <div className="space-y-1 mb-2">
        <div className="flex items-center justify-between text-[10px]">
          <span className="font-semibold text-slate-400 flex items-center gap-1">
            <span>🔥</span> Crowd Sentiment: <span className="text-slate-200 font-bold">Roaring Celebration</span>
          </span>
          <span className="text-accent-purple font-mono font-extrabold">92%</span>
        </div>

        {/* Energy bar */}
        <div className="w-full h-1.5 bg-slate-850 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-info-blue via-accent-purple to-pink-500 rounded-full"
            style={{ width: '92%' }}
          />
        </div>
      </div>

      {/* Action Button */}
      <button className="w-full bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-750 text-[10px] font-bold uppercase tracking-wider py-2 px-3 rounded-lg transition-all cursor-pointer">
        Create More Content
      </button>
    </div>
  );
};
