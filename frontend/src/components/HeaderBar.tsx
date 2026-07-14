import React from 'react';

interface HeaderBarProps {
  onLogoClick?: () => void;
}

export const HeaderBar: React.FC<HeaderBarProps> = ({ onLogoClick }) => {
  return (
    <header className="w-full bg-surface border-b border-slate-800 px-6 py-4 flex items-center justify-between text-slate-100 select-none">
      {/* Left section: Logo + Title */}
      <div onClick={onLogoClick} className="flex items-center gap-3 cursor-pointer group">
        <div className="w-10 h-10 rounded-lg bg-brand-black flex items-center justify-center border border-accent-purple/30 group-hover:border-accent-purple/70 transition-all duration-300 shadow-[0_0_15px_rgba(170,59,255,0.15)]">
          <svg
            className="w-6 h-6 text-accent-purple animate-pulse"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <div className="flex flex-col text-left">
          <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-slate-100 to-slate-300 bg-clip-text text-transparent group-hover:from-accent-purple group-hover:to-slate-100 transition-all duration-300">
            The 12th Signal
          </span>
          <span className="text-xs text-slate-400 font-medium tracking-wider uppercase">Stadium nervous system</span>
        </div>
      </div>

      {/* Middle section: Match Score Chip */}
      <div className="flex items-center gap-4 bg-brand-black/60 border border-slate-800/80 rounded-full px-5 py-2 shadow-inner">
        <div className="flex items-center gap-2">
          <span className="font-bold text-sm text-slate-200">USA</span>
          <span className="px-2 py-0.5 bg-slate-800 text-xs font-bold rounded text-slate-300">2</span>
          <span className="text-slate-500 font-medium text-xs">—</span>
          <span className="px-2 py-0.5 bg-slate-800 text-xs font-bold rounded text-slate-300">1</span>
          <span className="font-bold text-sm text-slate-200">MEX</span>
        </div>
        <div className="h-4 w-px bg-slate-800" />
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-positive-teal opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-positive-teal"></span>
          </span>
          <span className="font-mono text-sm font-semibold text-positive-teal tracking-wider">74:15</span>
        </div>
      </div>

      {/* Right-middle section: Statistics */}
      <div className="hidden md:flex items-center gap-6">
        <div className="flex flex-col items-end">
          <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">Signals / Min</span>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className="font-mono font-bold text-slate-100 text-base">142</span>
            <svg
              className="w-3.5 h-3.5 text-positive-teal"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={3}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
          </div>
        </div>
        <div className="h-8 w-px bg-slate-800" />
        <div className="flex flex-col items-end">
          <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">Attendance</span>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className="font-mono font-bold text-slate-100 text-base">84,320</span>
            <span className="text-[10px] px-1 bg-slate-800 text-slate-400 font-bold rounded">98%</span>
          </div>
        </div>
      </div>

      {/* Right section: Notifications + Commander profile */}
      <div className="flex items-center gap-4">
        {/* Notification bell */}
        <button className="relative p-2 rounded-lg bg-slate-850 hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-all border border-slate-800 hover:border-slate-700 cursor-pointer">
          <span className="absolute top-1.5 right-1.5 flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-danger-red opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-danger-red"></span>
          </span>
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
            />
          </svg>
        </button>

        {/* Profile Card */}
        <div className="flex items-center gap-3 pl-2 border-l border-slate-800">
          <div className="relative">
            <div className="w-9 h-9 rounded-full bg-accent-purple/20 border border-accent-purple/40 flex items-center justify-center text-accent-purple font-bold text-sm">
              SK
            </div>
            <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-positive-teal rounded-full border-2 border-surface" />
          </div>
          <div className="hidden lg:flex flex-col text-left">
            <span className="text-sm font-semibold text-slate-200">Shresth K.</span>
            <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">Ops Commander</span>
          </div>
        </div>
      </div>
    </header>
  );
};
