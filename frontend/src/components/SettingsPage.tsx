import React from 'react';

export const SettingsPage: React.FC = () => {
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('[Settings] Saving operator settings options...');
  };

  return (
    <div className="w-full h-full text-slate-100 flex flex-col gap-3 text-left select-none min-h-0">
      {/* Page Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-2 flex-none">
        <div>
          <h1 className="text-sm font-extrabold text-slate-100 uppercase tracking-widest">System Settings</h1>
          <p className="text-[9px] text-slate-400 font-semibold uppercase tracking-wider mt-0.5">
            Configure Command Center Preferences & Data Streams
          </p>
        </div>
      </div>

      <form onSubmit={handleSave} className="flex-1 flex flex-col min-h-0 gap-3.5">
        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 flex-grow min-h-0">
          
          {/* Left Column: Operator Profile & Session Logins */}
          <div className="lg:col-span-2 flex flex-col gap-3.5 h-full min-h-0">
            {/* Card 1: Operator Profile */}
            <div className="bg-surface border border-slate-800 rounded-xl p-3.5 shadow-lg relative overflow-hidden flex-none">
              <div className="absolute top-0 right-0 w-20 h-20 bg-accent-purple/5 rounded-full blur-xl animate-pulse" />
              
              <div className="flex items-center gap-2 pb-2 border-b border-slate-850 mb-3">
                <span className="text-xs" aria-hidden="true">👤</span>
                <h2 className="text-[10px] font-extrabold uppercase tracking-widest text-slate-200">Operator Profile</h2>
              </div>

              <div className="flex flex-col gap-3">
                <div>
                  <label
                    htmlFor="settings-full-name"
                    className="block text-[8px] font-bold text-slate-450 uppercase tracking-wider mb-1"
                  >
                    Full Name
                  </label>
                  <input
                    id="settings-full-name"
                    type="text"
                    defaultValue="Ops Commander"
                    className="w-full bg-slate-955 border border-slate-800 focus:border-accent-purple focus:ring-1 focus:ring-accent-purple rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none transition-all"
                  />
                </div>

                <div>
                  <label
                    htmlFor="settings-email"
                    className="block text-[8px] font-bold text-slate-450 uppercase tracking-wider mb-1"
                  >
                    Email Address
                  </label>
                  <input
                    id="settings-email"
                    type="email"
                    defaultValue="commander@fifa.worldcup2026.org"
                    className="w-full bg-slate-955 border border-slate-800 focus:border-accent-purple focus:ring-1 focus:ring-accent-purple rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none transition-all"
                  />
                </div>

                <div>
                  <label
                    htmlFor="settings-role"
                    className="block text-[8px] font-bold text-slate-450 uppercase tracking-wider mb-1"
                  >
                    Operational Role
                  </label>
                  <input
                    id="settings-role"
                    type="text"
                    defaultValue="Lead Stadium Security & Crowd Operations Director"
                    disabled
                    className="w-full bg-slate-900 border border-slate-850 rounded-lg px-2.5 py-1.5 text-xs text-slate-500 cursor-not-allowed"
                  />
                </div>
              </div>
            </div>

            {/* Card 2: Security & Session Logins */}
            <div className="bg-surface border border-slate-800 rounded-xl p-3.5 shadow-lg flex-1 min-h-0 flex flex-col">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-850 mb-2 shrink-0">
                <span className="text-xs" aria-hidden="true">🔑</span>
                <h2 className="text-[10px] font-extrabold uppercase tracking-widest text-slate-200">Active Operator Terminals</h2>
              </div>
              
              <div className="flex-1 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
                {[
                  { term: 'Terminal CC-01 (This Console)', ip: '10.240.2.14', activity: 'Active now', icon: '💻' },
                  { term: 'Terminal WR-04 (War Room Panel)', ip: '10.240.2.18', activity: 'Active 2m ago', icon: '🖥️' },
                  { term: 'Mobile Tablet A-2 (Ops Field)', ip: '10.240.5.99', activity: 'Active 12m ago', icon: '📱' }
                ].map((s, idx) => (
                  <div key={idx} className="flex items-center justify-between p-2 rounded-lg border border-slate-850 bg-brand-black/35 text-[9.5px]">
                    <div className="flex items-center gap-2">
                      <span className="text-xs">{s.icon}</span>
                      <div>
                        <span className="block font-bold text-slate-300">{s.term}</span>
                        <span className="text-[7.5px] text-slate-500 font-mono">{s.ip}</span>
                      </div>
                    </div>
                    <span className="text-[8px] font-mono text-positive-teal font-semibold">{s.activity}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: System Settings Alerts & Connected Feeds */}
          <div className="lg:col-span-3 flex flex-col gap-3.5 h-full min-h-0">
            {/* Card 3: Notification Preferences */}
            <div className="bg-surface border border-slate-800 rounded-xl p-3.5 shadow-lg space-y-3 flex-none">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-850 mb-1">
                <span className="text-xs" aria-hidden="true">🔔</span>
                <h2 className="text-[10px] font-extrabold uppercase tracking-widest text-slate-200">
                  System Alerts & Notifications
                </h2>
              </div>
              <div className="space-y-2">
                {[
                  {
                    id: 'crit-push',
                    label: 'Push Critical Crowd Alerts to Mobile Client',
                    desc: 'Instant warning notifications for any cluster exceeding severity thresholds.',
                    defaultChecked: true,
                  },
                  {
                    id: 'auto-resol',
                    label: 'Enable Automated SOP Dispatching',
                    desc: 'Allows AI orchestrator to recommend immediate reroutes to digital signage.',
                    defaultChecked: true,
                  },
                  {
                    id: 'rumor-sound',
                    label: 'Play Sound Alert on Rumor Shield Trigger',
                    desc: 'Audible alarm in the war room when potential spectator panic claims are detected.',
                    defaultChecked: false,
                  },
                ].map((pref) => (
                  <div key={pref.id} className="flex items-start justify-between gap-4 p-2 rounded bg-brand-black/20 border border-slate-850/50">
                    <div className="flex flex-col">
                      <label htmlFor={pref.id} className="text-[9.5px] font-bold text-slate-350 cursor-pointer">
                        {pref.label}
                      </label>
                      <span className="text-[8px] text-slate-500 font-medium mt-0.5">{pref.desc}</span>
                    </div>
                    <input
                      id={pref.id}
                      type="checkbox"
                      defaultChecked={pref.defaultChecked}
                      className="w-3.5 h-3.5 rounded text-accent-purple bg-brand-black border-slate-800 accent-accent-purple cursor-pointer focus:outline-none mt-0.5"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Card 4: Connected Data Sources */}
            <div className="bg-surface border border-slate-800 rounded-xl p-3.5 shadow-lg flex-grow min-h-0 flex flex-col">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-850 mb-2 shrink-0">
                <span className="text-xs" aria-hidden="true">🔗</span>
                <h2 className="text-[10px] font-extrabold uppercase tracking-widest text-slate-200">
                  Connected Telemetry Inputs
                </h2>
              </div>
              
              <div className="flex-1 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
                {[
                  {
                    source: 'FIFA Fan App Feed API',
                    status: 'Connected',
                    speed: '120ms lat',
                    color: 'text-positive-teal border-positive-teal/20 bg-positive-teal/5',
                  },
                  {
                    source: 'Stadium Crowd Camera Analytics',
                    status: 'Connected',
                    speed: 'Live Stream',
                    color: 'text-positive-teal border-positive-teal/20 bg-positive-teal/5',
                  },
                  {
                    source: 'Transit & Egress Gateway Telemetry',
                    status: 'Connected',
                    speed: '250ms polling',
                    color: 'text-positive-teal border-positive-teal/20 bg-positive-teal/5',
                  },
                  {
                    source: 'AR Telemetry Broadcast Stream',
                    status: 'Connected',
                    speed: 'Live Stream',
                    color: 'text-positive-teal border-positive-teal/20 bg-positive-teal/5',
                  }
                ].map((src, idx) => (
                  <div
                    key={idx}
                    className="grid grid-cols-[1fr_100px_90px] items-center p-2 rounded-lg border border-slate-850 bg-brand-black/35 text-[9.5px]"
                  >
                    <span className="font-bold text-slate-350 truncate pr-2">{src.source}</span>
                    <span className="text-[8px] text-slate-500 font-semibold font-mono text-right pr-3">{src.speed}</span>
                    <div className="flex justify-end">
                      <span
                        className={`px-2 py-0.5 rounded border uppercase tracking-wider text-[7.5px] font-bold text-center w-full block ${src.color}`}
                      >
                        {src.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Card 5: Actions Form Buttons */}
            <div className="bg-surface/50 border border-slate-800 rounded-xl p-3 flex justify-end gap-3 shrink-0">
              <button
                type="button"
                className="bg-slate-800 hover:bg-slate-750 text-slate-350 border border-slate-700 text-[9px] font-extrabold uppercase tracking-wider px-5 py-2 rounded-lg cursor-pointer transition-all"
              >
                Reset Defaults
              </button>
              <button
                type="submit"
                className="bg-accent-purple hover:bg-accent-purple/95 text-white text-[9px] font-extrabold uppercase tracking-wider px-7 py-2 rounded-lg cursor-pointer transition-all shadow-[0_0_12px_rgba(170,59,255,0.45)]"
              >
                Save Preferences
              </button>
            </div>
          </div>

        </div>
      </form>
    </div>
  );
};
