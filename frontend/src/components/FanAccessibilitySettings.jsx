import React, { useState } from 'react';

/**
 * FanAccessibilitySettings component for the fan-facing mobile app of "The 12th Signal".
 * Refactored into a high-density, screen-fitted control dashboard with interactive previews,
 * acoustics tuning, and an accessible services stadium beacon map.
 */
export default function FanAccessibilitySettings() {
  const [signLanguage, setSignLanguage] = useState(false);
  const [audioDescription, setAudioDescription] = useState(false);
  const [largerText, setLargerText] = useState(false);

  // High-Tech acoustics deck states
  const [crowdDampening, setCrowdDampening] = useState(40);
  const [refAudioBoost, setRefAudioBoost] = useState(60);
  const [hearingAidSync, setHearingAidSync] = useState(false);
  const [tactileFeedback, setTactileFeedback] = useState(false);

  // Quick Preset Handlers
  const handleApplyPreset = (type) => {
    if (type === 'hearing') {
      setSignLanguage(true);
      setAudioDescription(false);
      setLargerText(false);
      setCrowdDampening(80);
      setRefAudioBoost(90);
      setHearingAidSync(true);
    } else if (type === 'vision') {
      setSignLanguage(false);
      setAudioDescription(true);
      setLargerText(true);
      setCrowdDampening(30);
      setRefAudioBoost(70);
    } else {
      setSignLanguage(false);
      setAudioDescription(false);
      setLargerText(false);
      setCrowdDampening(40);
      setRefAudioBoost(60);
      setHearingAidSync(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 w-full h-full text-left min-h-0">
      {/* Left side: Accessibility Core Controls & Acoustics Deck */}
      <div className="lg:col-span-2 flex flex-col gap-3.5 h-full min-h-0">
        
        {/* Card 1: Core Toggles */}
        <div className="bg-surface border border-slate-800 rounded-xl p-3.5 shadow-lg relative overflow-hidden flex-none">
          <div className="absolute top-0 right-0 w-20 h-20 bg-accent-purple/5 rounded-full blur-xl animate-pulse" />
          
          <div className="flex items-center gap-2 mb-3 border-b border-slate-800 pb-2">
            <svg
              className="w-4 h-4 text-accent-purple"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
              />
            </svg>
            <h2 className="text-[10px] font-extrabold text-white uppercase tracking-widest">Accessibility Settings</h2>
          </div>

          <p className="text-[9.5px] text-slate-450 mb-3 leading-relaxed">
            Customize your matchday viewing preferences. These settings will apply locally to your device’s media players and text displays inside Lumen Field.
          </p>

          <div className="space-y-2">
            {/* 1. Sign Language Display Toggle */}
            <div className="flex items-center justify-between p-2 bg-slate-955 border border-slate-850 rounded-lg hover:border-slate-800 transition-colors">
              <div className="flex flex-col text-left pr-3">
                <span className="text-[10.5px] font-bold text-slate-200">Sign Language PIP</span>
                <span className="text-[8.5px] text-slate-500 leading-normal mt-0.5">
                  Show a picture-in-picture sign-language interpreter during live broadcasts.
                </span>
              </div>
              <button
                onClick={() => setSignLanguage(!signLanguage)}
                className={`w-9 h-5 flex items-center rounded-full p-0.5 transition-colors duration-300 focus:outline-none focus-visible:ring-1 focus-visible:ring-accent-purple shrink-0 cursor-pointer ${
                  signLanguage ? 'bg-accent-purple' : 'bg-slate-800'
                }`}
                aria-label="Toggle Sign Language PIP"
              >
                <div
                  className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${
                    signLanguage ? 'translate-x-4' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* 2. Audio Description Toggle */}
            <div className="flex items-center justify-between p-2 bg-slate-955 border border-slate-850 rounded-lg hover:border-slate-800 transition-colors">
              <div className="flex flex-col text-left pr-3">
                <span className="text-[10.5px] font-bold text-slate-200">Audio Description</span>
                <span className="text-[8.5px] text-slate-500 leading-normal mt-0.5">
                  Enable real-time descriptive narration of on-field action and referee calls.
                </span>
              </div>
              <button
                onClick={() => setAudioDescription(!audioDescription)}
                className={`w-9 h-5 flex items-center rounded-full p-0.5 transition-colors duration-300 focus:outline-none focus-visible:ring-1 focus-visible:ring-accent-purple shrink-0 cursor-pointer ${
                  audioDescription ? 'bg-accent-purple' : 'bg-slate-800'
                }`}
                aria-label="Toggle Audio Description"
              >
                <div
                  className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${
                    audioDescription ? 'translate-x-4' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* 3. Larger Text Toggle */}
            <div className="flex items-center justify-between p-2 bg-slate-955 border border-slate-850 rounded-lg hover:border-slate-800 transition-colors">
              <div className="flex flex-col text-left pr-3">
                <span className="text-[10.5px] font-bold text-slate-200">Larger Display Text</span>
                <span className="text-[8.5px] text-slate-500 leading-normal mt-0.5">
                  Increase font sizes for text elements, chat logs, and concession menus.
                </span>
              </div>
              <button
                onClick={() => setLargerText(!largerText)}
                className={`w-9 h-5 flex items-center rounded-full p-0.5 transition-colors duration-300 focus:outline-none focus-visible:ring-1 focus-visible:ring-accent-purple shrink-0 cursor-pointer ${
                  largerText ? 'bg-accent-purple' : 'bg-slate-800'
                }`}
                aria-label="Toggle Larger Display Text"
              >
                <div
                  className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${
                    largerText ? 'translate-x-4' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>

          <div className="mt-3 pt-3 border-t border-slate-850 flex items-center justify-between text-[8px] font-mono text-slate-500 uppercase tracking-wider">
            <span>Device settings only</span>
            <span>Version 1.0.0</span>
          </div>
        </div>

        {/* Card 2: Acoustics Equalizer & Assistive Audio */}
        <div className="bg-surface border border-slate-800 rounded-xl p-3.5 shadow-lg relative overflow-hidden flex-1 min-h-0 flex flex-col">
          <div className="absolute top-0 right-0 w-20 h-20 bg-info-blue/5 rounded-full blur-xl" />
          <h2 className="text-[10px] font-extrabold text-slate-100 uppercase tracking-widest mb-2 border-b border-slate-800 pb-2 flex items-center gap-2 shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-info-blue animate-pulse" />
            Assistive Acoustics & acoustics deck
          </h2>

          <div className="flex-1 overflow-y-auto space-y-3 pr-1 custom-scrollbar">
            {/* Quick Matchday presets */}
            <div>
              <span className="block text-[8px] font-bold text-slate-550 uppercase tracking-wider mb-1.5">
                Matchday Quick Assistive Presets
              </span>
              <div className="grid grid-cols-3 gap-1.5">
                <button
                  type="button"
                  onClick={() => handleApplyPreset('hearing')}
                  className="py-1 bg-slate-955 hover:bg-slate-900 border border-slate-800 hover:border-slate-700 rounded text-[8px] font-bold uppercase tracking-wider text-slate-300 cursor-pointer text-center"
                >
                  👂 Hearing Aid
                </button>
                <button
                  type="button"
                  onClick={() => handleApplyPreset('vision')}
                  className="py-1 bg-slate-955 hover:bg-slate-900 border border-slate-800 hover:border-slate-700 rounded text-[8px] font-bold uppercase tracking-wider text-slate-300 cursor-pointer text-center"
                >
                  👁️ Low Vision
                </button>
                <button
                  type="button"
                  onClick={() => handleApplyPreset('standard')}
                  className="py-1 bg-slate-955 hover:bg-slate-900 border border-slate-800 hover:border-slate-700 rounded text-[8px] font-bold uppercase tracking-wider text-slate-400 cursor-pointer text-center"
                >
                  🔄 Reset Mode
                </button>
              </div>
            </div>

            {/* Sliders */}
            <div className="space-y-2">
              <div>
                <div className="flex justify-between text-[8px] font-bold text-slate-450 uppercase mb-1">
                  <span>Crowd Noise Dampening</span>
                  <span className="font-mono text-slate-300">{crowdDampening}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={crowdDampening}
                  onChange={(e) => setCrowdDampening(parseInt(e.target.value))}
                  className="w-full h-1 bg-slate-850 rounded appearance-none cursor-pointer accent-info-blue"
                />
              </div>

              <div>
                <div className="flex justify-between text-[8px] font-bold text-slate-450 uppercase mb-1">
                  <span>Referee Voice Channel Boost</span>
                  <span className="font-mono text-slate-300">{refAudioBoost}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={refAudioBoost}
                  onChange={(e) => setRefAudioBoost(parseInt(e.target.value))}
                  className="w-full h-1 bg-slate-850 rounded appearance-none cursor-pointer accent-info-blue"
                />
              </div>
            </div>

            {/* Special Toggles */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                type="button"
                onClick={() => setHearingAidSync(!hearingAidSync)}
                className={`p-2 rounded-lg border text-left cursor-pointer transition-all flex flex-col justify-between ${
                  hearingAidSync
                    ? 'bg-info-blue/10 border-info-blue/40 text-info-blue'
                    : 'bg-slate-955 border-slate-850 text-slate-400'
                }`}
              >
                <span className="text-[9px] font-extrabold uppercase">T-Coil Hearing Sync</span>
                <span className="text-[7.5px] mt-0.5 leading-tight text-slate-500">
                  {hearingAidSync ? 'CONNECTED TO LOCAL LOOP' : 'DISCONNECTED'}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setTactileFeedback(!tactileFeedback)}
                className={`p-2 rounded-lg border text-left cursor-pointer transition-all flex flex-col justify-between ${
                  tactileFeedback
                    ? 'bg-accent-purple/10 border-accent-purple/40 text-accent-purple'
                    : 'bg-slate-955 border-slate-850 text-slate-400'
                }`}
              >
                <span className="text-[9px] font-extrabold uppercase">Tactile Game Rumble</span>
                <span className="text-[7.5px] mt-0.5 leading-tight text-slate-500">
                  {tactileFeedback ? 'VIBRATE ON TOUCHDOWNS' : 'DISABLED'}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Right side: Stadium Live Accessibility Video Simulator & Helper Map */}
      <div className="lg:col-span-3 flex flex-col gap-3.5 h-full min-h-0">
        
        {/* Card 3: Screen Simulation */}
        <div className="bg-surface border border-slate-800 rounded-xl p-3.5 shadow-lg flex flex-col flex-grow min-h-0 relative overflow-hidden">
          <h2 className="text-[10px] font-extrabold text-slate-200 uppercase tracking-widest mb-2 border-b border-slate-800 pb-2.5 flex items-center justify-between shrink-0">
            <span>Stadium Assistive Media Feed</span>
            <span className="text-[8px] bg-slate-850 border border-slate-700/50 text-slate-400 px-1.5 py-0.2 rounded font-mono">
              SIMULATED BROADCAST FEED
            </span>
          </h2>

          {/* Video simulation screen container */}
          <div className="flex-1 bg-black rounded-lg border border-slate-850 relative overflow-hidden flex flex-col justify-end p-4 min-h-[160px]">
            {/* Background elements to represent a match */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-900 via-brand-black to-black opacity-90 flex flex-col items-center justify-center p-4">
              <span className="text-[20px] filter drop-shadow-[0_0_8px_rgba(255,255,255,0.2)] animate-pulse">🏟️</span>
              <span className="text-[8px] uppercase tracking-widest text-slate-650 font-bold mt-2">LUMEN FIELD MAIN SCREEN</span>
            </div>

            {/* ASL Interpreter overlay (if Sign Language PIP enabled) */}
            {signLanguage && (
              <div className="absolute top-3 right-3 w-16 h-20 bg-slate-950/90 border border-accent-purple/35 rounded-lg flex flex-col items-center justify-center text-center animate-fadeIn shadow-lg p-1">
                <span className="text-[14px]">🤟</span>
                <span className="text-[6.5px] uppercase tracking-wider text-accent-purple font-extrabold mt-1">ASL LIVE</span>
                <div className="w-full bg-accent-purple/20 h-0.5 rounded-full mt-1.5 overflow-hidden">
                  <div className="bg-accent-purple h-full w-2/3 animate-ping" />
                </div>
              </div>
            )}

            {/* Subtitles Overlay */}
            <div className="relative z-10 w-full bg-slate-950/80 border border-slate-800/60 p-2.5 rounded-lg backdrop-blur-sm">
              <div className="flex items-center gap-1.5 mb-1 shrink-0">
                <span className="w-1.5 h-1.5 rounded-full bg-positive-teal animate-ping" />
                <span className="text-[7px] text-slate-500 font-mono uppercase">Live Transcript Overlay</span>
              </div>
              <p className={`text-slate-100 font-medium leading-relaxed ${largerText ? 'text-sm' : 'text-[10px]'}`}>
                Referee: <span className="text-slate-300">"Offside, defense, number 52. 5-yard penalty. Repeat first down."</span>
              </p>
            </div>

            {/* Audio Narrative notification */}
            {audioDescription && (
              <div className="absolute top-3 left-3 bg-positive-teal/10 border border-positive-teal/30 px-2 py-0.5 rounded text-[8px] text-positive-teal font-extrabold uppercase flex items-center gap-1 animate-fadeIn">
                <span className="animate-pulse">🔊</span> Live Narration Active
              </div>
            )}
          </div>
        </div>

        {/* Card 4: Accessibility Infrastructure Map */}
        <div className="bg-surface border border-slate-800 rounded-xl p-3.5 shadow-lg flex flex-col h-[11.5rem] min-h-0 flex-none">
          <h2 className="text-[10px] font-extrabold text-slate-100 uppercase tracking-widest mb-2 border-b border-slate-800 pb-2 flex items-center gap-1.5">
            <span>Accessible Facilities & Helper Beacons</span>
          </h2>

          <div className="grid grid-cols-3 gap-2 flex-grow overflow-y-auto pr-0.5 custom-scrollbar">
            {[
              { zone: 'Section 212', title: '🧑‍🦽 Wheelchair Platform A', status: 'Clear access paths', helper: 'Kiosk helper on standby' },
              { zone: 'Zone B', title: '🧘 Sensory Calm Room', status: 'Noise-reduced space', helper: 'Kiosk 12' },
              { zone: 'Zone C', title: '👂 Audio Device Counter', status: 'Receiver rentals', helper: 'Customer Relations' }
            ].map((facility, idx) => (
              <div key={idx} className="bg-brand-black/35 border border-slate-850 p-2 rounded-lg text-left flex flex-col justify-between h-full hover:border-slate-800 transition-colors">
                <div>
                  <div className="flex justify-between items-center text-[7.5px] font-mono text-slate-500 font-bold uppercase">
                    <span>{facility.zone}</span>
                    <span className="text-positive-teal">● Active</span>
                  </div>
                  <div className="text-[9.5px] font-bold text-slate-200 mt-1 line-clamp-1">{facility.title}</div>
                  <div className="text-[8px] text-slate-450 leading-tight mt-0.5 line-clamp-1">{facility.status}</div>
                </div>
                <div className="text-[7.5px] text-slate-550 border-t border-slate-850/50 pt-1 mt-1 truncate">
                  📍 {facility.helper}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
