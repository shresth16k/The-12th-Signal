import React from 'react';

export const StadiumPulse: React.FC = () => {
  // Sample sentiment data
  const positiveSentiment = 58;
  const neutralSentiment = 26;
  const negativeSentiment = 16;

  // Sample top clusters in the last 5 minutes
  const mockClusters = [
    {
      id: 'c1',
      topic: 'Restroom C Flooding',
      zone: 'Zone C',
      count: 42,
      severity: 'high',
      icon: (
        <span className="w-8 h-8 rounded-lg bg-danger-red/10 border border-danger-red/30 flex items-center justify-center text-danger-red text-xs">
          💧
        </span>
      )
    },
    {
      id: 'c2',
      topic: 'Gate 4 Bottleneck',
      zone: 'Zone B',
      count: 25,
      severity: 'medium',
      icon: (
        <span className="w-8 h-8 rounded-lg bg-warning-amber/10 border border-warning-amber/30 flex items-center justify-center text-warning-amber text-xs">
          🚶
        </span>
      )
    },
    {
      id: 'c3',
      topic: 'Hot Dog Stock Shortage',
      zone: 'Zone A',
      count: 14,
      severity: 'low',
      icon: (
        <span className="w-8 h-8 rounded-lg bg-accent-purple/10 border border-accent-purple/30 flex items-center justify-center text-accent-purple text-xs">
          🌭
        </span>
      )
    },
    {
      id: 'c4',
      topic: 'Heat Exhaustion Section 102',
      zone: 'Zone D',
      count: 8,
      severity: 'high',
      icon: (
        <span className="w-8 h-8 rounded-lg bg-positive-teal/10 border border-positive-teal/30 flex items-center justify-center text-positive-teal text-xs">
          ❤️
        </span>
      )
    }
  ];

  return (
    <div className="w-full h-full flex flex-col justify-between text-left select-none">
      {/* 1. Header with Title */}
      <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-accent-purple animate-pulse" />
          <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider">
            Stadium Pulse
          </h3>
        </div>
        <span className="text-[10px] bg-slate-800 text-slate-400 font-bold px-2 py-0.5 rounded">
          Fan Sentiment & Signals
        </span>
      </div>

      {/* 2. Sentiment + Sparkline */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        {/* Sentiment Distribution */}
        <div className="space-y-2">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Crowd Sentiment Breakdown
          </span>
          <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
            <span className="text-positive-teal">Positive ({positiveSentiment}%)</span>
            <span className="text-slate-400">Neutral ({neutralSentiment}%)</span>
            <span className="text-danger-red">Negative ({negativeSentiment}%)</span>
          </div>
          {/* Segmented bar */}
          <div className="w-full h-2.5 bg-slate-800 rounded-full flex overflow-hidden">
            <div className="h-full bg-positive-teal" style={{ width: `${positiveSentiment}%` }} />
            <div className="h-full bg-slate-500" style={{ width: `${neutralSentiment}%` }} />
            <div className="h-full bg-danger-red" style={{ width: `${negativeSentiment}%` }} />
          </div>
        </div>

        {/* Sparkline Trend */}
        <div className="flex flex-col justify-between">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Sentiment Trend (Last 90m)
          </span>
          <div className="h-10 w-full mt-1.5 bg-brand-black/30 border border-slate-850 rounded-lg p-1 relative">
            <svg className="w-full h-full" viewBox="0 0 100 20" preserveAspectRatio="none">
              <defs>
                <linearGradient id="sparklineGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#aa3bff" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#aa3bff" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              <path
                d="M0,15 Q10,12 20,16 T40,10 T60,5 T80,18 T100,12 L100,20 L0,20 Z"
                fill="url(#sparklineGrad)"
              />
              <path
                d="M0,15 Q10,12 20,16 T40,10 T60,5 T80,18 T100,12"
                fill="none"
                stroke="#aa3bff"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* 3. Top Signal Clusters */}
      <div className="flex-1 space-y-2 mb-4">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
          Top Signal Clusters — Last 5 Minutes
        </span>
        <div className="space-y-2 overflow-y-auto max-h-48 pr-1">
          {mockClusters.map((c) => {
            const severityColor = 
              c.severity === 'high' 
                ? 'bg-danger-red/10 text-danger-red border-danger-red/30' 
                : c.severity === 'medium'
                ? 'bg-warning-amber/10 text-warning-amber border-warning-amber/30'
                : 'bg-info-blue/10 text-info-blue border-info-blue/30';
            return (
              <div 
                key={c.id} 
                className="flex items-center justify-between p-2 rounded-lg bg-brand-black/40 border border-slate-850 hover:border-slate-800 transition-all"
              >
                <div className="flex items-center gap-3">
                  {c.icon}
                  <div className="flex flex-col">
                    <span className="text-xs font-semibold text-slate-200">{c.topic}</span>
                    <span className="text-[10px] text-slate-500 font-medium">{c.zone}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold border uppercase tracking-wide ${severityColor}`}>
                    {c.severity}
                  </span>
                  <span className="text-xs font-mono font-bold text-slate-400">
                    {c.count} sigs
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. Bottom Stats (4 columns) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-3 border-t border-slate-850">
        {[
          { label: 'Active Signals', value: '142', color: 'text-slate-100' },
          { label: 'Avg Response', value: '1.8m', color: 'text-positive-teal' },
          { label: 'Resolved today', value: '1,240', color: 'text-slate-100' },
          { label: 'Fan Sat Index', value: '94%', color: 'text-accent-purple' }
        ].map((s, idx) => (
          <div key={idx} className="flex flex-col bg-brand-black/20 p-2 rounded-lg border border-slate-850">
            <span className="text-[9px] uppercase tracking-wider text-slate-500 font-semibold">
              {s.label}
            </span>
            <span className={`text-sm font-bold font-mono mt-0.5 ${s.color}`}>
              {s.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
