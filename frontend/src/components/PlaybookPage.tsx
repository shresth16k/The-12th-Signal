import React from 'react';

interface PlaybookSOP {
  code: string;
  type: string;
  count: number;
  description: string;
  status: 'Nominal' | 'Active' | 'Under Review';
}

export const PlaybookPage: React.FC = () => {
  const playbookData: PlaybookSOP[] = [
    {
      code: 'SOP-011',
      type: 'Crowd Bottleneck & Gate Congestion',
      count: 14,
      description:
        'Egress/ingress re-routing protocols. Activates directional arrow video displays, updates transit twins, and deploys local guides to redirect spectators from congested gates.',
      status: 'Nominal',
    },
    {
      code: 'SOP-024',
      type: 'Concession Supply Surge',
      count: 9,
      description:
        'Triggered by high purchasing signals. Coordinates stock delivery runners to Stand B/C and instructs vendors to run express checkout procedures.',
      status: 'Nominal',
    },
    {
      code: 'SOP-008',
      type: 'Facilities & Restroom Water Outage',
      count: 3,
      description:
        'Alerts facilities maintenance crews, switches main valves to backup lines, and posts map guides redirecting fans to adjacent working restrooms.',
      status: 'Nominal',
    },
    {
      code: 'SOP-042',
      type: 'Medical Assistance Response',
      count: 11,
      description:
        'Calculates nearest mobile first-aid patrol unit using signal telemetry. Dispatches unit while reserving priority ambulance ingress/egress corridors.',
      status: 'Nominal',
    },
    {
      code: 'SOP-089',
      type: 'Unverified Panic Rumor Dampening',
      count: 12,
      description:
        'Invokes AI Rumor Shield to cross-reference crowd panic terms against official sensors. Pushes fact-checking PA overlays to correct misstatements.',
      status: 'Nominal',
    },
  ];

  const handleExportPDF = () => {
    console.log('[Playbook] Exporting Stadium Playbook SOP list as PDF...');
  };

  return (
    <div className="w-full min-h-screen bg-brand-black text-slate-100 p-6 flex flex-col gap-6 text-left select-none">
      {/* Page Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-100 uppercase tracking-widest">Stadium Playbook</h1>
          <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mt-1">
            Standard Operating Procedures & Automated AI Resolutions
          </p>
        </div>
        <button
          onClick={handleExportPDF}
          className="bg-accent-purple hover:bg-accent-purple/90 text-white text-xs font-bold uppercase tracking-wider px-5 py-2.5 rounded-lg flex items-center gap-2 shadow-[0_0_12px_rgba(170,59,255,0.45)] transition-all cursor-pointer"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          Export as PDF
        </button>
      </div>

      {/* Summary Stats Strip */}
      <div className="bg-surface border border-slate-800 rounded-xl p-4 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-accent-purple/10 border border-accent-purple/20 flex items-center justify-center text-accent-purple">
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
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              />
            </svg>
          </div>
          <div>
            <h2 className="text-xs font-bold text-slate-200 uppercase tracking-wide">Playbook SOP Index</h2>
            <p className="text-[10px] text-slate-400">
              Operational runbooks dynamically coordinated by the AI orchestrator.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-6 font-mono">
          <div className="flex flex-col items-end">
            <span className="text-[8px] uppercase font-bold text-slate-400">Total Runbooks</span>
            <span className="text-base font-extrabold text-slate-200">5 Active</span>
          </div>
          <div className="h-6 w-px bg-slate-800" />
          <div className="flex flex-col items-end">
            <span className="text-[8px] uppercase font-bold text-slate-400">Resolutions Logged</span>
            <span className="text-base font-extrabold text-positive-teal">49 Cases</span>
          </div>
        </div>
      </div>

      {/* Incident List */}
      <div className="space-y-4">
        {playbookData.map((sop) => (
          <div
            key={sop.code}
            className="bg-surface border border-slate-800 rounded-xl p-5 hover:border-slate-700 transition-all shadow-md flex flex-col md:flex-row md:items-start justify-between gap-4"
          >
            {/* Left: Code, Title, Description */}
            <div className="space-y-2 flex-1">
              <div className="flex items-center gap-2">
                <span className="font-mono text-[9px] font-bold px-2 py-0.5 rounded border border-slate-750 bg-brand-black text-slate-400">
                  {sop.code}
                </span>
                <h3 className="text-sm font-bold text-slate-200">{sop.type}</h3>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed max-w-2xl">{sop.description}</p>
            </div>

            {/* Right: Counter and Status Badges */}
            <div className="flex items-center md:flex-col md:items-end justify-between md:justify-start gap-4 font-mono">
              <div className="flex flex-col md:items-end">
                <span className="text-[8px] font-bold text-slate-400 uppercase tracking-wider">Resolved Cases</span>
                <span className="text-sm font-extrabold text-slate-200 mt-0.5">{sop.count} times</span>
              </div>
              <span className="text-[8.5px] font-bold px-2 py-0.5 rounded border border-positive-teal/30 bg-positive-teal/10 text-positive-teal uppercase tracking-wide">
                {sop.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
