import React from 'react';

export const AnalyticsPage: React.FC = () => {
  return (
    <div className="w-full min-h-screen bg-brand-black text-slate-100 p-6 flex flex-col gap-6 text-left">
      {/* Page Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-100 uppercase tracking-widest">
            System Analytics
          </h1>
          <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mt-1">
            Stadium Operations Intelligence & Telemetry Logs
          </p>
        </div>
        <div className="flex gap-2">
          <button className="bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 text-xs font-bold uppercase tracking-wider px-4 py-2 rounded-lg cursor-pointer">
            Refresh Data
          </button>
        </div>
      </div>

      {/* Row 1: High-Level KPI Widgets */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: 'Total Ingested Signals', value: '24,892', delta: '+12.4% vs last match', color: 'text-info-blue' },
          { label: 'Avg Cluster Resolution', value: '1m 48s', delta: '-18.2% idle time', color: 'text-positive-teal' },
          { label: 'Peak Crowd Sentiment', value: '86%', delta: 'Very High Satisfaction', color: 'text-accent-purple' }
        ].map((kpi, idx) => (
          <div key={idx} className="bg-surface border border-slate-800 rounded-xl p-4 flex flex-col justify-between shadow-md">
            <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
              {kpi.label}
            </span>
            <span className={`text-2xl font-extrabold font-mono my-1 ${kpi.color}`}>
              {kpi.value}
            </span>
            <span className="text-[9px] text-slate-400 font-medium font-sans">
              {kpi.delta}
            </span>
          </div>
        ))}
      </div>

      {/* Row 2: Grid of Custom Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Chart 1: Signals Over Time (Smooth SVG Area Chart) */}
        <div className="bg-surface border border-slate-800 rounded-xl p-5 shadow-md flex flex-col justify-between">
          <div className="mb-4">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-350">
              Signals Over Time (Match Progression)
            </h3>
            <p className="text-[10px] text-slate-500 font-medium">
              Volume peaks during kick-off, half-time, and goals.
            </p>
          </div>
          
          <div className="relative w-full h-48 bg-brand-black/35 rounded-lg border border-slate-850 p-2 flex items-center justify-center">
            {/* SVG Line Area Chart */}
            <svg viewBox="0 0 500 150" className="w-full h-full overflow-visible">
              <defs>
                <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#aa3bff" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#aa3bff" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              
              {/* Grid Lines */}
              <line x1="30" y1="20" x2="480" y2="20" stroke="#1e293b" strokeDasharray="3,3" />
              <line x1="30" y1="60" x2="480" y2="60" stroke="#1e293b" strokeDasharray="3,3" />
              <line x1="30" y1="100" x2="480" y2="100" stroke="#1e293b" strokeDasharray="3,3" />
              <line x1="30" y1="130" x2="480" y2="130" stroke="#334155" />

              {/* Area path */}
              <path 
                d="M30 130 C60 110, 90 120, 120 70 C150 30, 180 90, 210 100 C240 110, 270 40, 300 20 C330 10, 360 80, 390 110 C420 125, 450 60, 480 50 L480 130 L30 130 Z" 
                fill="url(#areaGradient)" 
              />

              {/* Stroke path */}
              <path 
                d="M30 130 C60 110, 90 120, 120 70 C150 30, 180 90, 210 100 C240 110, 270 40, 300 20 C330 10, 360 80, 390 110 C420 125, 450 60, 480 50" 
                fill="none" 
                stroke="#aa3bff" 
                strokeWidth="2.5" 
              />
              
              {/* Highlight Nodes */}
              <circle cx="300" cy="20" r="4.5" fill="#ffffff" stroke="#aa3bff" strokeWidth="2" />
              <circle cx="120" cy="70" r="3.5" fill="#aa3bff" />

              {/* Labels */}
              <text x="30" y="145" fill="#64748b" fontSize="8" textAnchor="middle">0m</text>
              <text x="120" y="145" fill="#64748b" fontSize="8" textAnchor="middle">Kickoff</text>
              <text x="210" y="145" fill="#64748b" fontSize="8" textAnchor="middle">30m</text>
              <text x="300" y="145" fill="#64748b" fontSize="8" textAnchor="middle">Halftime</text>
              <text x="390" y="145" fill="#64748b" fontSize="8" textAnchor="middle">75m</text>
              <text x="480" y="145" fill="#64748b" fontSize="8" textAnchor="middle">Fulltime</text>
            </svg>
          </div>
        </div>

        {/* Chart 2: Resolution Times by Zone (Custom SVG Bar Chart) */}
        <div className="bg-surface border border-slate-800 rounded-xl p-5 shadow-md flex flex-col justify-between">
          <div className="mb-4">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-350">
              Avg Resolution Time by Zone (Seconds)
            </h3>
            <p className="text-[10px] text-slate-500 font-medium">
              Comparison across stadium concourse zones.
            </p>
          </div>

          <div className="relative w-full h-48 bg-brand-black/35 rounded-lg border border-slate-850 p-2 flex items-center justify-center">
            {/* SVG Bar Chart */}
            <svg viewBox="0 0 500 150" className="w-full h-full overflow-visible">
              {/* Horizontal Grid */}
              <line x1="30" y1="20" x2="480" y2="20" stroke="#1e293b" strokeDasharray="3,3" />
              <line x1="30" y1="65" x2="480" y2="65" stroke="#1e293b" strokeDasharray="3,3" />
              <line x1="30" y1="110" x2="480" y2="110" stroke="#1e293b" strokeDasharray="3,3" />
              <line x1="30" y1="130" x2="480" y2="130" stroke="#334155" />

              {/* Bar 1 - Zone 101 (45s - Teal) */}
              <rect x="50" y="85" width="30" height="45" rx="3" fill="#14b8a6" />
              <text x="65" y="80" fill="#14b8a6" fontSize="8" textAnchor="middle" fontWeight="bold">45s</text>
              <text x="65" y="142" fill="#64748b" fontSize="8" textAnchor="middle">Z101</text>

              {/* Bar 2 - Zone 102 (110s - Amber) */}
              <rect x="120" y="20" width="30" height="110" rx="3" fill="#f59e0b" />
              <text x="135" y="15" fill="#f59e0b" fontSize="8" textAnchor="middle" fontWeight="bold">110s</text>
              <text x="135" y="142" fill="#64748b" fontSize="8" textAnchor="middle">Z102</text>

              {/* Bar 3 - Zone 103 (60s - Blue) */}
              <rect x="190" y="70" width="30" height="60" rx="3" fill="#3b82f6" />
              <text x="205" y="65" fill="#3b82f6" fontSize="8" textAnchor="middle" fontWeight="bold">60s</text>
              <text x="205" y="142" fill="#64748b" fontSize="8" textAnchor="middle">Z103</text>

              {/* Bar 4 - Zone 104 (125s - Red) */}
              <rect x="260" y="5" width="30" height="125" rx="3" fill="#ef4444" />
              <text x="275" y="0" fill="#ef4444" fontSize="8" textAnchor="middle" fontWeight="bold">125s</text>
              <text x="275" y="142" fill="#64748b" fontSize="8" textAnchor="middle">Z104</text>

              {/* Bar 5 - Zone 105 (30s - Teal) */}
              <rect x="330" y="100" width="30" height="30" rx="3" fill="#14b8a6" />
              <text x="345" y="95" fill="#14b8a6" fontSize="8" textAnchor="middle" fontWeight="bold">30s</text>
              <text x="345" y="142" fill="#64748b" fontSize="8" textAnchor="middle">Z105</text>

              {/* Bar 6 - Zone 106 (80s - Blue) */}
              <rect x="400" y="50" width="30" height="80" rx="3" fill="#3b82f6" />
              <text x="415" y="45" fill="#3b82f6" fontSize="8" textAnchor="middle" fontWeight="bold">80s</text>
              <text x="415" y="142" fill="#64748b" fontSize="8" textAnchor="middle">Z106</text>
            </svg>
          </div>
        </div>

      </div>
    </div>
  );
};
