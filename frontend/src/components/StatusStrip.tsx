import React from 'react';

export const StatusStrip: React.FC = () => {
  return (
    <div className="w-full flex items-center justify-between bg-brand-black/55 border border-slate-850 rounded-lg p-2.5 text-[10px] text-slate-400 select-none shadow-inner">
      {/* Left: Critical Alerts */}
      <div className="flex items-center gap-1.5">
        <span className="flex h-2 w-2 relative">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-danger-red opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-danger-red"></span>
        </span>
        <span className="font-bold text-slate-300 uppercase tracking-wider">Alerts:</span>
        <span className="bg-danger-red/20 text-danger-red border border-danger-red/30 px-1.5 py-0.2 rounded font-extrabold font-mono text-[9px]">
          2
        </span>
      </div>

      {/* Divider */}
      <div className="h-4 w-px bg-slate-800" />

      {/* Right: System Status */}
      <div className="flex items-center gap-1.5">
        <span className="w-1.5 h-1.5 rounded-full bg-positive-teal shadow-[0_0_6px_#14b8a6]" />
        <span className="font-medium text-slate-300">SYS OPERATIONAL</span>
      </div>
    </div>
  );
};
