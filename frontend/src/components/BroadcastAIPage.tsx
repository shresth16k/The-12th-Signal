import React, { useState } from 'react';

interface BroadcastLog {
  id: string;
  timestamp: string;
  zone: string;
  channel: string;
  message: string;
  status: 'active' | 'completed' | 'queued';
  reach: number;
}

export const BroadcastAIPage: React.FC = () => {
  const [announcementText, setAnnouncementText] = useState('');
  const [selectedZone, setSelectedZone] = useState('All Zones');
  const [selectedChannel, setSelectedChannel] = useState('JumboTron');
  const [voiceVolume, setVoiceVolume] = useState(80);
  const [voiceSpeed, setVoiceSpeed] = useState(1.0);
  const [isSynthesizing, setIsSynthesizing] = useState(false);

  const [logs, setLogs] = useState<BroadcastLog[]>([
    {
      id: 'tx-101',
      timestamp: '04:41 PM',
      zone: 'Zone B',
      channel: 'Concourse Speakers',
      message: 'Restroom queue in Zone B is congested. Please use the facilities in Zone C.',
      status: 'completed',
      reach: 12450
    },
    {
      id: 'tx-102',
      timestamp: '04:38 PM',
      zone: 'Section 212',
      channel: 'Mobile Push',
      message: 'Notice: Elevator access at Gate 3 has been restored. Staff are on site to assist.',
      status: 'completed',
      reach: 2310
    },
    {
      id: 'tx-103',
      timestamp: '04:35 PM',
      zone: 'All Zones',
      channel: 'JumboTron',
      message: 'USA vs MEX: Match halftime activities begin in 5 minutes.',
      status: 'completed',
      reach: 84320
    }
  ]);

  const handleDispatch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!announcementText.trim()) return;

    setIsSynthesizing(true);
    setTimeout(() => {
      const newLog: BroadcastLog = {
        id: `tx-${Math.floor(100 + Math.random() * 900)}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        zone: selectedZone,
        channel: selectedChannel,
        message: announcementText,
        status: 'active',
        reach: selectedZone === 'All Zones' ? 84320 : Math.floor(2000 + Math.random() * 10000)
      };

      setLogs(prev => [newLog, ...prev]);
      setAnnouncementText('');
      setIsSynthesizing(false);
    }, 1200);
  };

  const handleCancelBroadcast = (id: string) => {
    setLogs(prev => prev.map(log => log.id === id ? { ...log, status: 'completed' as const } : log));
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 w-full h-full text-left min-h-0">
      {/* Left Column: Input Panel & Voice Settings */}
      <div className="lg:col-span-2 flex flex-col gap-3.5 h-full min-h-0">
        
        {/* Card 1: Dispatch Console */}
        <div className="bg-surface border border-slate-800 rounded-xl p-3.5 shadow-lg relative overflow-hidden flex-none">
          <div className="absolute top-0 right-0 w-20 h-20 bg-accent-purple/5 rounded-full blur-xl animate-pulse" />
          
          <div className="flex items-center gap-2 mb-3 border-b border-slate-800 pb-2">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-purple opacity-75"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-accent-purple"></span>
            </span>
            <h2 className="text-[10px] font-extrabold text-slate-200 uppercase tracking-widest">AI Broadcast Dispatcher</h2>
          </div>

          <form onSubmit={handleDispatch} className="flex flex-col gap-3">
            <div>
              <label htmlFor="announcement-input" className="block text-[8px] font-bold text-slate-450 uppercase tracking-wider mb-1">
                Announcement Message (AI Synthesized)
              </label>
              <textarea
                id="announcement-input"
                value={announcementText}
                onChange={(e) => setAnnouncementText(e.target.value)}
                placeholder="E.g., Halftime operations: concession line 4 is currently low-wait..."
                className="w-full p-2.5 text-xs bg-slate-955 border border-slate-800 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-accent-purple focus:border-transparent transition-all"
                rows={2.5}
                required
                disabled={isSynthesizing}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="zone-select" className="block text-[8px] font-bold text-slate-450 uppercase tracking-wider mb-1">
                  Target Zone
                </label>
                <select
                  id="zone-select"
                  value={selectedZone}
                  onChange={(e) => setSelectedZone(e.target.value)}
                  className="w-full p-1.5 text-xs bg-slate-955 border border-slate-800 rounded-lg text-slate-100 focus:outline-none focus:ring-1 focus:ring-accent-purple focus:border-transparent cursor-pointer"
                >
                  {['All Zones', 'Zone A', 'Zone B', 'Zone C', 'Zone D', 'Section 212'].map(z => (
                    <option key={z} value={z}>{z}</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="channel-select" className="block text-[8px] font-bold text-slate-450 uppercase tracking-wider mb-1">
                  Output Channel
                </label>
                <select
                  id="channel-select"
                  value={selectedChannel}
                  onChange={(e) => setSelectedChannel(e.target.value)}
                  className="w-full p-1.5 text-xs bg-slate-955 border border-slate-800 rounded-lg text-slate-100 focus:outline-none focus:ring-1 focus:ring-accent-purple focus:border-transparent cursor-pointer"
                >
                  <option value="JumboTron">📺 JumboTron Overlay</option>
                  <option value="Concourse Speakers">🔊 Concourse Audio</option>
                  <option value="Mobile Push">📱 Fan App Notification</option>
                  <option value="AR Overlay">🕶️ AR Lens System</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSynthesizing || !announcementText.trim()}
              className="w-full py-2 bg-accent-purple text-brand-black font-extrabold text-[10px] uppercase tracking-wider rounded-lg transition-all hover:bg-opacity-90 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_15px_rgba(170,59,255,0.2)] cursor-pointer"
            >
              {isSynthesizing ? 'Synthesizing & Dispatching...' : 'Dispatch Live Broadcast'}
            </button>
          </form>
        </div>

        {/* Card 2: Acoustics & Synthesizer Equalizer */}
        <div className="bg-surface border border-slate-800 rounded-xl p-3.5 shadow-lg relative overflow-hidden flex-1 min-h-0 flex flex-col">
          <div className="absolute top-0 right-0 w-20 h-20 bg-info-blue/5 rounded-full blur-xl" />
          <h2 className="text-[10px] font-extrabold text-slate-100 uppercase tracking-widest mb-2 border-b border-slate-800 pb-2 flex items-center gap-2 shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-info-blue animate-pulse" />
            Synthesizer & Audio Modulation
          </h2>

          <div className="flex-1 overflow-y-auto space-y-3.5 pr-1 custom-scrollbar">
            {/* Quick Templates */}
            <div>
              <span className="block text-[8px] font-bold text-slate-550 uppercase tracking-wider mb-1.5">
                AI Announcement Templates
              </span>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: '🍕 Concessions Open', text: 'Attention Fans: Concession areas have low waiting lines. Skip the queue now!' },
                  { label: '🚨 Safety Evacuation', text: 'Operations Warning: Please move in an orderly fashion to your nearest exit gates.' },
                  { label: '🚾 Bathroom Congestion', text: 'Facility Notice: Restrooms in Section 212 are busy. Alternative stalls are open in Section 216.' },
                  { label: '🚶 Exit Gate Flow', text: 'Exit Notice: Gate 4 is currently operating at maximum exit capacity. Use Gate 5 for faster egress.' }
                ].map((tpl, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setAnnouncementText(tpl.text)}
                    className="text-[9px] text-slate-400 bg-slate-955 border border-slate-850 hover:bg-slate-900/60 p-2 rounded text-left transition-all cursor-pointer font-medium truncate"
                  >
                    {tpl.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Diagnostics sliders */}
            <div className="space-y-2">
              <div>
                <div className="flex justify-between text-[8px] font-bold text-slate-450 uppercase mb-1">
                  <span>Synthesized Voice Volume</span>
                  <span className="font-mono text-slate-350">{voiceVolume}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={voiceVolume}
                  onChange={(e) => setVoiceVolume(parseInt(e.target.value))}
                  className="w-full h-1 bg-slate-850 rounded appearance-none cursor-pointer accent-info-blue"
                />
              </div>

              <div>
                <div className="flex justify-between text-[8px] font-bold text-slate-450 uppercase mb-1">
                  <span>Synthesis Speech Speed</span>
                  <span className="font-mono text-slate-350">{voiceSpeed.toFixed(1)}x</span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="2.0"
                  step="0.1"
                  value={voiceSpeed}
                  onChange={(e) => setVoiceSpeed(parseFloat(e.target.value))}
                  className="w-full h-1 bg-slate-850 rounded appearance-none cursor-pointer accent-info-blue"
                />
              </div>
            </div>

            {/* Glowing audio visualizer wave */}
            <div className="bg-brand-black/40 border border-slate-850 rounded-lg p-2 flex flex-col justify-center items-center h-12">
              <div className="flex items-center gap-1.5 mb-1.5">
                <span className="text-[7px] text-slate-500 uppercase tracking-widest font-mono">Live Wave Monitor</span>
              </div>
              <div className="flex items-end justify-center gap-0.5 h-4 w-full">
                {[12, 18, 8, 22, 14, 30, 26, 12, 20, 36, 28, 16, 22, 10, 24, 8, 14].map((h, i) => (
                  <div
                    key={i}
                    style={{ height: `${h}%` }}
                    className={`w-1 rounded-t transition-all ${
                      isSynthesizing ? 'bg-accent-purple animate-pulse' : 'bg-slate-700'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column: JumboTron Media Screen Simulator & Transmission Logs */}
      <div className="lg:col-span-3 flex flex-col gap-3.5 h-full min-h-0">
        
        {/* Card 3: JumboTron Visual simulation */}
        <div className="bg-surface border border-slate-800 rounded-xl p-3.5 shadow-lg flex flex-col flex-grow min-h-0 relative overflow-hidden">
          <h2 className="text-[10px] font-extrabold text-slate-200 uppercase tracking-widest mb-2 border-b border-slate-800 pb-2.5 flex items-center justify-between shrink-0">
            <span>JumboTron Broadcast Display Simulator</span>
            <span className="text-[8px] bg-slate-850 border border-slate-700/50 text-slate-400 px-1.5 py-0.2 rounded font-mono">
              SCREEN PREVIEW
            </span>
          </h2>

          <div className="flex-1 bg-black rounded-lg border border-slate-850 relative overflow-hidden flex flex-col justify-end p-4 min-h-[160px]">
            {/* Background stadium image replica */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,_var(--tw-gradient-stops))] from-slate-900 via-brand-black to-black opacity-90 flex flex-col items-center justify-center p-4">
              <span className="text-[22px] filter drop-shadow-[0_0_8px_rgba(255,255,255,0.25)]">📺</span>
              <span className="text-[8px] uppercase tracking-widest text-slate-650 font-bold mt-2">Jumbotron Main Display</span>
            </div>

            {/* JumboTron Overlay Banner */}
            <div className="relative z-10 w-full bg-slate-950/90 border border-slate-800 p-3 rounded-lg backdrop-blur-md animate-fadeIn">
              <div className="flex items-center justify-between gap-2 mb-1.5 border-b border-slate-850 pb-1 shrink-0">
                <div className="flex items-center gap-1.5">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-danger-red opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-danger-red"></span>
                  </span>
                  <span className="text-[8px] text-danger-red font-extrabold uppercase tracking-wider">AI Stadium Announcement</span>
                </div>
                <span className="text-[7px] text-slate-500 font-mono uppercase">Lumen Field Network</span>
              </div>
              <p className="text-slate-100 font-extrabold text-[12px] leading-relaxed text-center py-1">
                {logs[0] && logs[0].status === 'active' ? logs[0].message : "USA vs MEX: Match halftime activities begin in 5 minutes."}
              </p>
            </div>
          </div>
        </div>

        {/* Card 4: Transmission Logs */}
        <div className="bg-surface border border-slate-800 rounded-xl p-3.5 shadow-lg flex flex-col h-[13rem] min-h-0 flex-none">
          <div className="flex items-center justify-between mb-2 border-b border-slate-800 pb-2">
            <h2 className="text-[10px] font-extrabold text-slate-100 uppercase tracking-widest">
              Live Broadcast Transmission Registry
            </h2>
            <span className="text-[8px] bg-slate-850 text-slate-400 font-bold px-1.5 py-0.2 rounded font-mono">
              {logs.filter(l => l.status === 'active').length} ACTIVE BROADCASTS
            </span>
          </div>

          <div className="flex-1 overflow-y-auto pr-0.5 space-y-2 custom-scrollbar">
            {logs.map((log) => (
              <div
                key={log.id}
                className="bg-brand-black/35 border border-slate-850 hover:border-slate-800 p-2 rounded-lg flex items-start gap-2.5 transition-colors"
              >
                <div className="text-[14px] shrink-0">
                  {log.channel === 'JumboTron' ? '📺' : log.channel === 'Concourse Speakers' ? '🔊' : '📱'}
                </div>
                <div className="flex-grow min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-0.5">
                    <span className="text-[9px] font-bold text-slate-200">{log.zone} • <span className="text-slate-500 font-normal">{log.channel}</span></span>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[7.5px] text-slate-500 font-mono">{log.timestamp}</span>
                      <span className={`text-[7.5px] font-bold uppercase px-1 rounded font-mono ${
                        log.status === 'active'
                          ? 'bg-danger-red/10 border border-danger-red/35 text-danger-red animate-pulse'
                          : 'bg-slate-800 border border-slate-700/50 text-slate-400'
                      }`}>
                        {log.status}
                      </span>
                    </div>
                  </div>
                  <p className="text-[9.5px] text-slate-350 line-clamp-1">{log.message}</p>
                  <div className="flex items-center justify-between mt-1 text-[7.5px] text-slate-500 border-t border-slate-850/50 pt-1">
                    <span>Audience Reach: <strong className="text-slate-400 font-semibold">{log.reach.toLocaleString()} fans</strong></span>
                    {log.status === 'active' && (
                      <button
                        type="button"
                        onClick={() => handleCancelBroadcast(log.id)}
                        className="text-[7.5px] text-danger-red hover:underline font-bold uppercase cursor-pointer"
                      >
                        Cancel Transmission
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
