import React from 'react';

export const StadiumZoneMap: React.FC = () => {
  // Hardcoded layout zones
  const zones = [
    { id: 'Z101', name: 'Zone A (101)', path: 'M 100 20 A 80 80 0 0 1 156.56 43.43 L 132.42 67.57 A 46 46 0 0 0 100 54 Z', labelX: 125, labelY: 42, status: 'nominal' },
    { id: 'Z102', name: 'Zone B (102)', path: 'M 156.56 43.43 A 80 80 0 0 1 180 100 L 146 100 A 46 46 0 0 0 132.42 67.57 Z', labelX: 158, labelY: 75, status: 'warning' },
    { id: 'Z103', name: 'Zone C (103)', path: 'M 180 100 A 80 80 0 0 1 156.56 156.56 L 132.42 132.42 A 46 46 0 0 0 146 100 Z', labelX: 158, labelY: 125, status: 'danger' },
    { id: 'Z104', name: 'Zone D (104)', path: 'M 156.56 156.56 A 80 80 0 0 1 100 180 L 100 146 A 46 46 0 0 0 132.42 132.42 Z', labelX: 125, labelY: 158, status: 'nominal' },
    { id: 'Z105', name: 'Zone E (105)', path: 'M 100 180 A 80 80 0 0 1 43.43 156.56 L 67.57 132.42 A 46 46 0 0 0 100 146 Z', labelX: 75, labelY: 158, status: 'nominal' },
    { id: 'Z106', name: 'Zone F (106)', path: 'M 43.43 156.56 A 80 80 0 0 1 20 100 L 54 100 A 46 46 0 0 0 67.57 132.42 Z', labelX: 42, labelY: 125, status: 'nominal' },
    { id: 'Z107', name: 'Zone G (107)', path: 'M 20 100 A 80 80 0 0 1 43.43 43.43 L 67.57 67.57 A 46 46 0 0 0 54 100 Z', labelX: 42, labelY: 75, status: 'nominal' },
    { id: 'Z108', name: 'Zone H (108)', path: 'M 43.43 43.43 A 80 80 0 0 1 100 20 L 100 54 A 46 46 0 0 0 67.57 67.57 Z', labelX: 75, labelY: 42, status: 'nominal' }
  ];

  return (
    <div className="w-full h-full flex flex-col justify-between text-left select-none">
      {/* Header */}
      <div className="flex items-center justify-between mb-2 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-info-blue" />
          <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider">
            Zone Map
          </h3>
        </div>
        <span className="text-[10px] bg-slate-800 text-slate-400 font-bold px-2 py-0.5 rounded">
          Spatial Crowd Status
        </span>
      </div>

      {/* Map SVG */}
      <div className="flex-1 flex items-center justify-center p-2 relative">
        <svg 
          className="w-52 h-52 filter drop-shadow-[0_0_15px_rgba(0,0,0,0.5)]" 
          viewBox="0 0 200 200"
        >
          {/* Outer ring glow */}
          <circle cx="100" cy="100" r="82" fill="none" stroke="#1e293b" strokeWidth="1" />
          
          {/* Seating Sectors */}
          {zones.map((z) => {
            let fillColor = 'fill-slate-800/40 hover:fill-slate-700/60 stroke-slate-800';
            if (z.status === 'warning') {
              fillColor = 'fill-warning-amber/20 hover:fill-warning-amber/30 stroke-warning-amber/60';
            } else if (z.status === 'danger') {
              fillColor = 'fill-danger-red/20 hover:fill-danger-red/30 stroke-danger-red/60';
            }
            return (
              <g key={z.id} className="cursor-pointer group">
                <path 
                  d={z.path} 
                  className={`${fillColor} transition-all duration-300`} 
                  strokeWidth="1.5"
                />
                <text 
                  x={z.labelX} 
                  y={z.labelY} 
                  textAnchor="middle" 
                  dominantBaseline="middle"
                  className="fill-slate-400 group-hover:fill-slate-100 font-mono text-[9px] font-bold pointer-events-none transition-colors"
                >
                  {z.id}
                </text>
              </g>
            );
          })}

          {/* Center Pitch shape (seating outline) */}
          <rect 
            x="76" 
            y="76" 
            width="48" 
            height="48" 
            rx="4"
            className="fill-brand-black stroke-slate-800" 
            strokeWidth="1.5" 
          />
          {/* Inner pitch design */}
          <rect 
            x="81" 
            y="81" 
            width="38" 
            height="38" 
            rx="2"
            fill="none" 
            stroke="rgba(20, 184, 166, 0.4)" 
            strokeWidth="1" 
          />
          <circle cx="100" cy="100" r="6" fill="none" stroke="rgba(20, 184, 166, 0.4)" strokeWidth="1" />
          <line x1="81" y1="100" x2="119" y2="100" stroke="rgba(20, 184, 166, 0.4)" strokeWidth="1" />

          {/* Active Beacons */}
          {/* Zone B Warning Beacon */}
          <g className="pointer-events-none">
            <circle cx="158" cy="75" r="4" className="fill-warning-amber" />
            <circle cx="158" cy="75" r="10" fill="none" stroke="#f59e0b" strokeWidth="1" className="animate-ping opacity-60" />
          </g>

          {/* Zone C Danger Beacon */}
          <g className="pointer-events-none">
            <circle cx="158" cy="125" r="4" className="fill-danger-red" />
            <circle cx="158" cy="125" r="10" fill="none" stroke="#ef4444" strokeWidth="1" className="animate-ping opacity-60" />
          </g>
        </svg>

        {/* Floating Sector Details Tooltip-style side panel */}
        <div className="absolute right-0 bottom-0 bg-brand-black/80 border border-slate-850 rounded-lg p-2 flex flex-col gap-1 text-[9px] font-medium backdrop-blur-md">
          <div className="flex items-center gap-1.5 text-danger-red">
            <span className="h-1.5 w-1.5 rounded-full bg-danger-red" />
            <span>Z103: Restroom Leak</span>
          </div>
          <div className="flex items-center gap-1.5 text-warning-amber">
            <span className="h-1.5 w-1.5 rounded-full bg-warning-amber" />
            <span>Z102: Gate 4 Queue</span>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-6 pt-3 border-t border-slate-850 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
        <div className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-slate-800 border border-slate-700" />
          <span>Nominal</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-warning-amber/20 border border-warning-amber" />
          <span>Warning</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-danger-red/20 border border-danger-red" />
          <span>Critical</span>
        </div>
      </div>
    </div>
  );
};
