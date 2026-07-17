import React from 'react';

export const SettingsPage: React.FC = () => {
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('[Settings] Saving operator settings options...');
  };

  return (
    <div className="w-full min-h-screen bg-brand-black text-slate-100 p-6 flex flex-col gap-6 text-left select-none">
      {/* Page Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-100 uppercase tracking-widest">System Settings</h1>
          <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mt-1">
            Configure Command Center Preferences & Data Streams
          </p>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6 max-w-3xl">
        {/* Section 1: Profile */}
        <div className="bg-surface border border-slate-800 rounded-xl p-5 shadow-md space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-850">
            <span className="text-sm" aria-hidden="true">
              👤
            </span>
            <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-200">Operator Profile</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="settings-full-name"
                className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5"
              >
                Full Name
              </label>
              <input
                id="settings-full-name"
                type="text"
                defaultValue="Ops Commander"
                className="w-full bg-brand-black/50 border border-slate-800 focus:border-accent-purple focus:ring-2 focus:ring-accent-purple/80 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none transition-all"
              />
            </div>
            <div>
              <label
                htmlFor="settings-email"
                className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5"
              >
                Email Address
              </label>
              <input
                id="settings-email"
                type="email"
                defaultValue="commander@fifa.worldcup2026.org"
                className="w-full bg-brand-black/50 border border-slate-800 focus:border-accent-purple focus:ring-2 focus:ring-accent-purple/80 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none transition-all"
              />
            </div>
            <div className="md:col-span-2">
              <label
                htmlFor="settings-role"
                className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5"
              >
                Operational Role
              </label>
              <input
                id="settings-role"
                type="text"
                defaultValue="Lead Stadium Security & Crowd Operations Director"
                disabled
                className="w-full bg-brand-black/25 border border-slate-850 rounded-lg px-3 py-2 text-xs text-slate-500 cursor-not-allowed"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Notification Preferences */}
        <div className="bg-surface border border-slate-800 rounded-xl p-5 shadow-md space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-850">
            <span className="text-sm" aria-hidden="true">
              🔔
            </span>
            <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-200">
              System Alerts & Notifications
            </h2>
          </div>
          <div className="space-y-3">
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
              <div key={pref.id} className="flex items-start justify-between gap-4 p-2 rounded bg-brand-black/20">
                <div className="flex flex-col">
                  <label htmlFor={pref.id} className="text-[10px] font-bold text-slate-300 cursor-pointer">
                    {pref.label}
                  </label>
                  <span className="text-[9px] text-slate-400 font-medium mt-0.5">{pref.desc}</span>
                </div>
                <input
                  id={pref.id}
                  type="checkbox"
                  defaultChecked={pref.defaultChecked}
                  className="w-4 h-4 rounded text-accent-purple bg-brand-black border-slate-800 accent-accent-purple cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-accent-purple mt-0.5"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Section 3: Connected Data Sources */}
        <div className="bg-surface border border-slate-800 rounded-xl p-5 shadow-md space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-850">
            <span className="text-sm" aria-hidden="true">
              🔗
            </span>
            <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-200">
              Connected Telemetry Inputs
            </h2>
          </div>
          <div className="space-y-2">
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
            ].map((src, idx) => (
              <div
                key={idx}
                className="grid grid-cols-[1fr_120px_90px] items-center p-2.5 rounded-lg border border-slate-850 bg-brand-black/35 text-[10px]"
              >
                <span className="font-bold text-slate-300 truncate pr-2">{src.source}</span>
                <span className="text-[9.5px] text-slate-500 font-semibold font-mono text-right pr-4">{src.speed}</span>
                <div className="flex justify-end">
                  <span
                    className={`px-2 py-0.5 rounded border uppercase tracking-wider text-[8px] font-bold text-center w-full block ${src.color}`}
                  >
                    {src.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Save Actions Button */}
        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            className="bg-slate-800 hover:bg-slate-750 text-slate-350 border border-slate-700 text-xs font-bold uppercase tracking-wider px-6 py-2.5 rounded-lg cursor-pointer transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-700"
          >
            Reset
          </button>
          <button
            type="submit"
            className="bg-accent-purple hover:bg-accent-purple/95 text-white text-xs font-bold uppercase tracking-wider px-8 py-2.5 rounded-lg cursor-pointer transition-all shadow-[0_0_12px_rgba(170,59,255,0.45)] focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-purple"
          >
            Save Preferences
          </button>
        </div>
      </form>
    </div>
  );
};
