import React from 'react';

export const WarRoomPanel: React.FC = () => {
  // Hardcoded chat transcripts for a sample negotiation
  const messages = [
    {
      agent: 'Security Agent',
      icon: '🛡️',
      color: 'border-danger-red/30 text-danger-red bg-danger-red/10',
      time: '74:16',
      text: 'Evacuation/routing concern: Heavy crowd build-up at Gate 4. Requesting detour to prevent bottleneck at concourse entry.'
    },
    {
      agent: 'Transit Agent',
      icon: '🚇',
      color: 'border-info-blue/30 text-info-blue bg-info-blue/10',
      time: '74:16',
      text: 'Concur. Gates 3 and 5 are under-utilized. Detouring traffic will balance corridor flow nicely.'
    },
    {
      agent: 'Concessions Agent',
      icon: '🍔',
      color: 'border-warning-amber/30 text-warning-amber bg-warning-amber/10',
      time: '74:17',
      text: 'Noted. Redirecting fans will push volume past Stand C. Alerting concession staff there to prepare for surge.'
    },
    {
      agent: 'Broadcast Agent',
      icon: '🎥',
      color: 'border-accent-purple/30 text-accent-purple bg-accent-purple/10',
      time: '74:17',
      text: 'Acknowledged. Modifying on-screen overlays to display helpful directional arrows for the detour.'
    },
    {
      agent: 'Medical Agent',
      icon: '🏥',
      color: 'border-positive-teal/30 text-positive-teal bg-positive-teal/10',
      time: '74:18',
      text: 'Route clear. Confirming emergency ambulance pathways at Gate 5 are fully unobstructed for priority dispatch.'
    }
  ];

  return (
    <div className="w-full h-full flex flex-col justify-between text-left select-none">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-accent-purple shadow-[0_0_8px_#aa3bff]" />
          <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider">
            AI War Room
          </h3>
        </div>
        <span className="text-[10px] bg-slate-800 text-slate-400 font-bold px-2 py-0.5 rounded">
          Orchestrator Panel
        </span>
      </div>

      {/* Message list (Chat bubbles) */}
      <div className="flex-1 space-y-3 overflow-y-auto max-h-[30rem] pr-1 mb-4">
        {messages.map((m, idx) => (
          <div key={idx} className="flex flex-col gap-1">
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-2">
                <span className={`w-5 h-5 rounded flex items-center justify-center text-xs border ${m.color}`}>
                  {m.icon}
                </span>
                <span className="text-[11px] font-bold text-slate-300">{m.agent}</span>
              </div>
              <span className="text-[10px] text-slate-500 font-mono font-medium">{m.time}</span>
            </div>
            <div className="bg-brand-black/40 border border-slate-850 rounded-lg p-2.5 text-xs text-slate-300 leading-relaxed shadow-sm">
              {m.text}
            </div>
          </div>
        ))}
      </div>

      {/* Consensus reached card */}
      <div className="bg-accent-purple/10 border border-accent-purple/40 rounded-xl p-4 mb-4 shadow-[0_0_15px_rgba(170,59,255,0.1)]">
        <div className="flex items-center gap-2 mb-2">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-purple opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-accent-purple"></span>
          </span>
          <span className="text-[10px] uppercase tracking-wider text-accent-purple font-bold">
            Consensus Action Reached
          </span>
        </div>
        <p className="text-xs text-slate-200 font-medium leading-relaxed">
          Redirect inbound spectator flow from Gate 4 to Gate 5, adjust camera overlays with directional signs, notify Stand C vendors of crowd surge, and preserve Gate 5 priority corridors.
        </p>
      </div>

      {/* View full transcript button */}
      <button className="w-full bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-750 text-xs font-semibold py-2.5 px-4 rounded-lg transition-all cursor-pointer">
        View Full Transcript Trail
      </button>
    </div>
  );
};
