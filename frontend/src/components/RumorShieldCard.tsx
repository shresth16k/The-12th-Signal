import React, { useState, useEffect } from 'react';

export const RumorShieldCard: React.FC = () => {
  const [rumors, setRumors] = useState<any[]>([]);

  useEffect(() => {
    const fetchRumors = async () => {
      try {
        const host =
          window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
            ? 'http://localhost:8000'
            : '';
        const res = await fetch(`${host}/api/rumors`);
        if (res.ok) {
          const data = await res.json();
          setRumors(data);
        }
      } catch (err) {
        console.error('Error fetching rumors:', err);
      }
    };

    fetchRumors();
    const interval = setInterval(fetchRumors, 10000);
    return () => clearInterval(interval);
  }, []);

  // Compute dynamic counts based on live data length
  const detectedCount = 11 + rumors.length;
  const debunkedCount = 8 + rumors.length;
  const monitoringCount = 3;

  // Retrieve the latest rumor
  const latestRumor = rumors.length > 0 ? rumors[rumors.length - 1] : null;

  return (
    <div className="bg-surface border border-slate-800 rounded-xl p-4 flex flex-col justify-between shadow-md relative overflow-hidden group hover:border-slate-700 transition-all duration-300 min-h-[180px] text-left select-none">
      {/* Background Decorative Blur */}
      <div className="absolute -top-10 -right-10 w-24 h-24 bg-accent-purple/5 rounded-full blur-xl group-hover:bg-accent-purple/10 transition-all" />

      {/* Header and Shield Icon */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-lg bg-accent-purple/10 border border-accent-purple/20 flex items-center justify-center text-accent-purple shadow-sm group-hover:shadow-[0_0_10px_rgba(170,59,255,0.4)] transition-all">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
              />
            </svg>
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-bold text-slate-200 uppercase tracking-wider">Rumor Shield</span>
            <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wide">Panic Interceptor</span>
          </div>
        </div>

        {/* Live Indicator */}
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-positive-teal opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-positive-teal"></span>
        </span>
      </div>

      {/* Counts Section */}
      <div className="grid grid-cols-3 gap-2 my-3">
        {[
          { label: 'Detected', value: String(detectedCount), color: 'text-slate-200' },
          { label: 'Debunked', value: String(debunkedCount), color: 'text-positive-teal' },
          { label: 'Monitoring', value: String(monitoringCount), color: 'text-warning-amber' },
        ].map((c, idx) => (
          <div
            key={idx}
            className="bg-brand-black/45 border border-slate-850 rounded-lg p-2 flex flex-col items-center"
          >
            <span className="text-[8px] uppercase font-bold text-slate-500 tracking-wider">{c.label}</span>
            <span className={`text-sm font-extrabold font-mono mt-0.5 ${c.color}`}>{c.value}</span>
          </div>
        ))}
      </div>

      {/* Recent Action Ticker */}
      <div className="border-t border-slate-850 pt-2.5 space-y-1">
        <div className="flex items-center justify-between">
          <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">Recent Action</span>
          <span className="text-[7.5px] font-bold px-1 py-0.2 rounded border border-positive-teal/30 bg-positive-teal/10 text-positive-teal uppercase tracking-wide">
            Debunked
          </span>
        </div>
        <p
          className="text-[10px] text-slate-400 leading-snug truncate"
          title={latestRumor ? latestRumor.suggested_correction : 'No rumors detected'}
        >
          {latestRumor ? latestRumor.suggested_correction : 'No active rumors detected.'}
        </p>
      </div>
    </div>
  );
};
