import React, { useState } from 'react';

/**
 * FanAccessibilitySettings component for the fan-facing mobile app of "The 12th Signal".
 * Allows fans to toggle local accessibility features on their device.
 */
export default function FanAccessibilitySettings() {
  const [signLanguage, setSignLanguage] = useState(false);
  const [audioDescription, setAudioDescription] = useState(false);
  const [largerText, setLargerText] = useState(false);

  return (
    <div className="p-4 w-full max-w-md mx-auto bg-slate-900 border border-slate-800 rounded-xl text-slate-100 shadow-md">
      <div className="flex items-center gap-2 mb-4 border-b border-slate-800 pb-3">
        <svg
          className="w-5 h-5 text-accent-purple"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
          />
        </svg>
        <h2 className="text-base font-bold text-white uppercase tracking-wider">Accessibility Settings</h2>
      </div>

      <p className="text-[11px] text-slate-400 mb-5 leading-relaxed">
        Customize your matchday viewing preferences. These settings will apply locally to your device’s media players
        and text displays inside Lumen Field.
      </p>

      <div className="space-y-4">
        {/* 1. Sign Language Display Toggle */}
        <div className="flex items-center justify-between p-3 bg-slate-950/60 border border-slate-850 rounded-lg hover:border-slate-800 transition-colors">
          <div className="flex flex-col text-left pr-4">
            <span className="text-xs font-bold text-slate-200">Sign Language PIP</span>
            <span className="text-[9.5px] text-slate-400 mt-0.5">
              Show a picture-in-picture sign language interpreter during stadium live-broadcasts.
            </span>
          </div>
          <button
            onClick={() => setSignLanguage(!signLanguage)}
            className={`w-9 h-5 flex items-center rounded-full p-0.5 transition-colors duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 focus-visible:ring-accent-purple shrink-0 cursor-pointer ${
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
        <div className="flex items-center justify-between p-3 bg-slate-950/60 border border-slate-850 rounded-lg hover:border-slate-800 transition-colors">
          <div className="flex flex-col text-left pr-4">
            <span className="text-xs font-bold text-slate-200">Audio Description</span>
            <span className="text-[9.5px] text-slate-400 mt-0.5">
              Enable real-time descriptive narration of on-field action, plays, and referee calls.
            </span>
          </div>
          <button
            onClick={() => setAudioDescription(!audioDescription)}
            className={`w-9 h-5 flex items-center rounded-full p-0.5 transition-colors duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 focus-visible:ring-accent-purple shrink-0 cursor-pointer ${
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
        <div className="flex items-center justify-between p-3 bg-slate-950/60 border border-slate-850 rounded-lg hover:border-slate-800 transition-colors">
          <div className="flex flex-col text-left pr-4">
            <span className="text-xs font-bold text-slate-200">Larger Display Text</span>
            <span className="text-[9.5px] text-slate-400 mt-0.5">
              Increase font sizes for text elements, chat logs, and concession menus.
            </span>
          </div>
          <button
            onClick={() => setLargerText(!largerText)}
            className={`w-9 h-5 flex items-center rounded-full p-0.5 transition-colors duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 focus-visible:ring-accent-purple shrink-0 cursor-pointer ${
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

      <div className="mt-4 pt-3 border-t border-slate-850 flex items-center justify-between text-[8px] font-mono text-slate-400 uppercase tracking-wider">
        <span>Device settings only</span>
        <span>Version 1.0.0</span>
      </div>
    </div>
  );
}
