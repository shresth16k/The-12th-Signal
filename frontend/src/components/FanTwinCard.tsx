import React from 'react';

export const FanTwinCard: React.FC = () => {
  return (
    <div className="bg-surface border border-slate-800 rounded-xl p-4 flex flex-col justify-between shadow-md relative overflow-hidden group hover:border-slate-700 transition-all duration-300 min-h-[180px] text-left select-none">
      {/* Decorative background pulse */}
      <div className="absolute -top-10 -right-10 w-24 h-24 bg-accent-purple/5 rounded-full blur-xl group-hover:bg-accent-purple/10 transition-all" />

      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-lg bg-info-blue/10 border border-info-blue/20 flex items-center justify-center text-info-blue shadow-sm group-hover:shadow-[0_0_10px_rgba(59,130,246,0.4)] transition-all">
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-bold text-slate-200 uppercase tracking-wider">Fan Twin AI</span>
            <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wide">Personal Assistant</span>
          </div>
        </div>

        {/* Connection Status Indicator */}
        <span className="text-[9px] bg-slate-800 text-slate-400 font-bold px-1.5 py-0.5 rounded font-mono uppercase">
          Online
        </span>
      </div>

      {/* Greeting and Content List */}
      <div className="my-2.5 space-y-2">
        {/* Greeting */}
        <div className="text-xs font-bold text-slate-200">Hi Shresth! Welcome to Section 104.</div>

        {/* Suggestions & Status */}
        <div className="space-y-1">
          <div className="flex items-start gap-1.5 text-[10px] text-slate-400 leading-snug">
            <span className="text-warning-amber shrink-0 mt-0.5">🍔</span>
            <span className="font-medium text-slate-350">
              <span className="font-semibold text-warning-amber">Next Suggestion:</span> Stand B is 2 mins away & has
              hot dogs in stock.
            </span>
          </div>
          <div className="flex items-start gap-1.5 text-[10px] text-slate-400 leading-snug">
            <span className="text-info-blue shrink-0 mt-0.5">🚇</span>
            <span className="font-medium text-slate-350">
              <span className="font-semibold text-info-blue">Route Update:</span> Detour active. Exit via Gate 5 for
              faster train transfer.
            </span>
          </div>
        </div>
      </div>

      {/* Action Button */}
      <button className="w-full bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-750 text-[10px] font-bold uppercase tracking-wider py-2 px-3 rounded-lg transition-all cursor-pointer">
        Chat With Twin
      </button>
    </div>
  );
};
