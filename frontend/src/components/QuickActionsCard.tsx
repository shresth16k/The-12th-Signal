import React from 'react';

export const QuickActionsCard: React.FC = () => {
  const actions = [
    {
      id: 'announcement',
      label: 'Send Announcement',
      icon: '📢',
      colorClass: 'border-slate-800 hover:border-info-blue/50 hover:bg-info-blue/5 text-slate-300 hover:text-slate-200'
    },
    {
      id: 'deploy',
      label: 'Deploy Staff',
      icon: '🚶',
      colorClass: 'border-slate-800 hover:border-positive-teal/50 hover:bg-positive-teal/5 text-slate-300 hover:text-slate-200'
    },
    {
      id: 'cameras',
      label: 'View All Cameras',
      icon: '📹',
      colorClass: 'border-slate-800 hover:border-accent-purple/50 hover:bg-accent-purple/5 text-slate-300 hover:text-slate-200'
    },
    {
      id: 'emergency',
      label: 'Emergency Protocol',
      icon: '🚨',
      colorClass: 'border-danger-red/30 bg-danger-red/5 hover:bg-danger-red/15 hover:border-danger-red/60 text-danger-red'
    }
  ];

  const handleActionClick = (id: string, label: string) => {
    console.log(`[Quick Action] Triggered action: "${label}" (ID: ${id})`);
  };

  return (
    <div className="bg-surface border border-slate-800 rounded-xl p-4 flex flex-col justify-between shadow-md relative overflow-hidden group hover:border-slate-700 transition-all duration-300 min-h-[180px] text-left select-none">
      {/* Background Decorative Blur */}
      <div className="absolute -top-10 -right-10 w-24 h-24 bg-accent-purple/5 rounded-full blur-xl group-hover:bg-accent-purple/10 transition-all" />

      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-lg bg-warning-amber/10 border border-warning-amber/20 flex items-center justify-center text-warning-amber shadow-sm group-hover:shadow-[0_0_10px_rgba(245,158,11,0.4)] transition-all">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-bold text-slate-200 uppercase tracking-wider">
              Quick Actions
            </span>
            <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wide">
              Operator Panel
            </span>
          </div>
        </div>
      </div>

      {/* Action Buttons Grid */}
      <div className="grid grid-cols-2 gap-2 my-3">
        {actions.map((act) => (
          <button
            key={act.id}
            onClick={() => handleActionClick(act.id, act.label)}
            className={`flex flex-col items-center justify-center p-2 rounded-lg border text-center transition-all duration-200 cursor-pointer ${act.colorClass}`}
          >
            <span className="text-sm mb-1">{act.icon}</span>
            <span className="text-[9px] font-bold uppercase tracking-wider leading-none">
              {act.label}
            </span>
          </button>
        ))}
      </div>

      {/* Footnote */}
      <div className="border-t border-slate-850 pt-2 flex items-center justify-between text-[8px] font-bold text-slate-500 uppercase tracking-wider">
        <span>Active Session: Admin</span>
        <span>Secure Link</span>
      </div>
    </div>
  );
};
