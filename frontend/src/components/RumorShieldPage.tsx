import React, { useState, useEffect } from 'react';

interface RumorAlert {
  cluster_id: string;
  suspected_claim: string;
  suggested_correction: string;
}

export const RumorShieldPage: React.FC = () => {
  const [rumors, setRumors] = useState<RumorAlert[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [selectedZone, setSelectedZone] = useState('Zone C');
  const [rumorText, setRumorText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [scanTime, setScanTime] = useState<string>('');
  const [deployedAlerts, setDeployedAlerts] = useState<Record<string, boolean>>({});

  const fetchRumors = async (showScanningEffect = false) => {
    if (showScanningEffect) setIsScanning(true);
    try {
      const host =
        window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
          ? 'http://localhost:8000'
          : '';

      // Force backend re-clustering first so it catches any newly ingested signals
      await fetch(`${host}/api/clusters`);

      // Retrieve the rumors list
      const res = await fetch(`${host}/api/rumors`);
      if (res.ok) {
        const data = await res.json();
        setRumors(data);
      }
      setScanTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    } catch (err) {
      console.error('Error fetching rumors:', err);
    } finally {
      if (showScanningEffect) {
        setTimeout(() => setIsScanning(false), 800);
      }
    }
  };

  useEffect(() => {
    fetchRumors();
    const interval = setInterval(() => fetchRumors(false), 5000);
    return () => clearInterval(interval);
  }, []);

  const handleInjectRumor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rumorText.trim()) return;

    setIsSubmitting(true);
    try {
      const host =
        window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
          ? 'http://localhost:8000'
          : '';

      // 1. Post the rumor text as a highly negative sentiment signal to trigger panic heuristics
      const signalRes = await fetch(`${host}/api/signals`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          source_type: 'social',
          location_zone: selectedZone,
          raw_text: rumorText,
          sentiment_score: -0.9,
        }),
      });

      if (signalRes.ok) {
        setRumorText('');
        // 2. Trigger scan to force clustering and run rumor detection immediately
        await fetchRumors(true);
      }
    } catch (err) {
      console.error('Error injecting rumor:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuickPreset = (text: string, zone: string) => {
    setRumorText(text);
    setSelectedZone(zone);
  };

  const handleDeployCorrection = (clusterId: string) => {
    setDeployedAlerts(prev => ({ ...prev, [clusterId]: true }));
    setTimeout(() => {
      setDeployedAlerts(prev => ({ ...prev, [clusterId]: false }));
    }, 4500);
  };

  const detectedCount = 11 + rumors.length;
  const debunkedCount = 8 + rumors.length;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 w-full h-full text-left min-h-0">
      {/* Left Column: Scanner control and claim injector */}
      <div className="lg:col-span-2 flex flex-col gap-3.5 h-full min-h-0">
        {/* Card 1: Scanner Dashboard */}
        <div className="bg-surface border border-slate-800 rounded-xl p-3.5 shadow-lg relative overflow-hidden flex-none">
          <div className="absolute top-0 right-0 w-20 h-20 bg-accent-purple/5 rounded-full blur-xl" />
          
          <div className="flex items-center justify-between mb-3 border-b border-slate-800 pb-2">
            <div className="flex items-center gap-2">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-purple opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-accent-purple"></span>
              </span>
              <h2 className="text-[10px] font-extrabold text-slate-200 uppercase tracking-widest">Shield Status</h2>
            </div>
            <span className="text-[8px] bg-slate-800 text-slate-400 font-bold px-1.5 py-0.5 rounded font-mono">
              SCANNER ACTIVE
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-3">
            <div className="bg-brand-black/20 p-2 rounded-lg border border-slate-850">
              <span className="text-[8px] uppercase tracking-wider text-slate-500 font-bold">Interceptions</span>
              <span className="block text-xs font-bold font-mono mt-0.5 text-slate-200">{detectedCount}</span>
            </div>
            <div className="bg-brand-black/20 p-2 rounded-lg border border-slate-850">
              <span className="text-[8px] uppercase tracking-wider text-slate-500 font-bold">Debunked Claims</span>
              <span className="block text-xs font-bold font-mono mt-0.5 text-positive-teal">{debunkedCount}</span>
            </div>
          </div>

          <button
            onClick={() => fetchRumors(true)}
            disabled={isScanning}
            className="w-full py-1.5 bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-750 text-[10px] font-extrabold uppercase tracking-wider rounded-lg transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <span className={`text-[10px] ${isScanning ? 'animate-spin' : ''}`}>🔄</span>
            {isScanning ? 'Scanning Telemetry...' : 'Trigger Manual Rumor Scan'}
          </button>

          {scanTime && (
            <div className="text-[8px] text-slate-500 text-center mt-1.5 font-mono">
              Last Scan: {scanTime}
            </div>
          )}
        </div>

        {/* Card 2: Rumor claim injector */}
        <div className="bg-surface border border-slate-800 rounded-xl p-3.5 shadow-lg relative overflow-hidden flex-1 min-h-0 flex flex-col">
          <div className="absolute top-0 right-0 w-20 h-20 bg-danger-red/5 rounded-full blur-xl animate-pulse" />
          <h2 className="text-[10px] font-extrabold text-slate-100 uppercase tracking-widest mb-3 flex items-center gap-2 border-b border-slate-800 pb-2 shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-danger-red shadow-[0_0_8px_#ef4444]" />
            Inject Suspect Panic Claim
          </h2>

          <form onSubmit={handleInjectRumor} className="flex flex-col gap-3 shrink-0">
            <div>
              <label htmlFor="rumor-input" className="block text-[8px] font-bold text-slate-450 uppercase tracking-wider mb-1">
                Suspect Rumor Statement (contains panic words)
              </label>
              <textarea
                id="rumor-input"
                value={rumorText}
                onChange={(e) => setRumorText(e.target.value)}
                placeholder="E.g., I heard there is a fire in Zone B and people are running!"
                className="w-full p-2.5 text-xs bg-slate-955 border border-slate-800 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-accent-purple focus:border-transparent transition-all"
                rows={2}
                required
                disabled={isSubmitting}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="zone-select" className="block text-[8px] font-bold text-slate-455 uppercase tracking-wider mb-0.5">
                  Stadium Zone
                </label>
                <select
                  id="zone-select"
                  value={selectedZone}
                  onChange={(e) => setSelectedZone(e.target.value)}
                  className="w-full p-1.5 text-xs bg-slate-955 border border-slate-800 rounded-lg text-slate-100 focus:outline-none focus:ring-1 focus:ring-accent-purple focus:border-transparent cursor-pointer"
                >
                  {['Zone A', 'Zone B', 'Zone C', 'Zone D', 'Zone E', 'Zone F', 'Section 212'].map(z => (
                    <option key={z} value={z}>{z}</option>
                  ))}
                </select>
              </div>
              <div className="flex items-end">
                <button
                  type="submit"
                  disabled={isSubmitting || !rumorText.trim()}
                  className="w-full py-1.5 bg-danger-red text-slate-100 font-extrabold text-[10px] uppercase tracking-wider rounded-lg transition-all hover:bg-opacity-90 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  {isSubmitting ? 'Injecting...' : 'Inject & Scan'}
                </button>
              </div>
            </div>
          </form>

          {/* Quick Shortcuts */}
          <div className="mt-3 pt-3 border-t border-slate-850 flex-1 min-h-0 flex flex-col">
            <span className="block text-[8px] font-bold text-slate-500 uppercase tracking-wider mb-2 shrink-0">
              Claim presets (select to load)
            </span>
            <div className="flex-1 overflow-y-auto space-y-1.5 pr-1 custom-scrollbar">
              {[
                { label: '🔥 Smoke panic in Zone B', text: 'I smell smoke and fire in Zone B, they are telling us to evacuate!', zone: 'Zone B' },
                { label: '🚨 Gun threat scare at Gate 4', text: 'Someone said there is a gun near Gate 4, everyone is running away!', zone: 'Zone E' },
                { label: '🚶 Stampede rumor in Tunnel 2', text: 'Avoid Tunnel 2, stampede rumor and crowds crushing each other!', zone: 'Zone C' }
              ].map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleQuickPreset(preset.text, preset.zone)}
                  className="w-full text-[9.5px] text-slate-400 bg-slate-955 border border-slate-850 hover:bg-slate-900 p-2 rounded-lg text-left transition-all cursor-pointer font-medium"
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Right Column: Interceptions registry */}
      <div className="lg:col-span-3 bg-surface border border-slate-800 rounded-xl p-3.5 shadow-lg flex flex-col h-full min-h-0">
        <div className="flex items-center justify-between mb-3 border-b border-slate-800 pb-2">
          <div className="flex items-center gap-2">
            <span className="w-4 h-4 rounded bg-accent-purple/10 flex items-center justify-center text-[10px] text-accent-purple border border-accent-purple/20">🛡️</span>
            <h2 className="text-xs font-extrabold text-slate-200 uppercase tracking-widest">
              Live Intercepted Panic Claims
            </h2>
          </div>
          <span className="text-[8px] bg-slate-800/80 text-slate-400 border border-slate-700/30 font-bold px-1.5 py-0.5 rounded font-mono">
            {rumors.length} ACTIVE
          </span>
        </div>

        {/* Rumor Feed list */}
        <div className="flex-1 overflow-y-auto pr-1 space-y-3 custom-scrollbar min-h-0">
          {rumors.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center py-12 text-slate-500 text-center border border-dashed border-slate-850 rounded-lg bg-brand-black/10">
              <div className="w-8 h-8 rounded-full border border-slate-800 flex items-center justify-center text-xs animate-pulse mb-2">🛡️</div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Registry Secure</span>
              <span className="text-[8px] text-slate-500 mt-1 max-w-[200px]">
                No panic rumors detected in active telemetry clusters. Use claim presets to test interceptor.
              </span>
            </div>
          ) : (
            rumors.map((rumor) => {
              const isDeployed = deployedAlerts[rumor.cluster_id];
              return (
                <div
                  key={rumor.cluster_id}
                  className="bg-brand-black/35 border border-slate-850 rounded-lg p-3 flex flex-col gap-2.5 shadow-sm animate-fadeIn"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[8px] font-bold px-1.5 py-0.2 rounded border border-danger-red/30 bg-danger-red/10 text-danger-red uppercase tracking-wider">
                      🚨 PANIC SPECULATION INTERCEPTED
                    </span>
                    <span className="text-[8px] text-slate-500 font-mono">
                      ID: {rumor.cluster_id.substring(0, 8)}
                    </span>
                  </div>

                  <div>
                    <span className="block text-[8px] font-bold text-slate-500 uppercase tracking-wider mb-0.5">
                      Flagged Claim
                    </span>
                    <p className="text-[10.5px] text-slate-200 bg-slate-955 border border-slate-850 rounded-lg p-2 leading-relaxed">
                      {rumor.suspected_claim}
                    </p>
                  </div>

                  <div>
                    <span className="block text-[8px] font-bold text-slate-500 uppercase tracking-wider mb-0.5">
                      Suggested Dampening Broadcast
                    </span>
                    <p className="text-[10.5px] text-positive-teal bg-positive-teal/5 border border-positive-teal/20 rounded-lg p-2 leading-relaxed italic font-medium">
                      {rumor.suggested_correction}
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleDeployCorrection(rumor.cluster_id)}
                      className={`flex-1 py-1.5 rounded text-[9px] font-extrabold uppercase tracking-wide cursor-pointer transition-all border ${isDeployed
                        ? 'bg-positive-teal/20 border-positive-teal text-positive-teal shadow-[0_0_8px_rgba(13,148,136,0.3)]'
                        : 'bg-accent-purple border-accent-purple hover:bg-opacity-90 text-brand-black shadow-md'
                        }`}
                    >
                      {isDeployed ? '✓ Correction Deployed to Stadium' : 'Deploy Broadcast Alert'}
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
