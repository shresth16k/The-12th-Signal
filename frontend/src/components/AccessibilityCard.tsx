import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface AccessibilityService {
  id: string;
  name: string;
  detail: string;
  icon: string;
}

export const AccessibilityCard: React.FC = () => {
  const navigate = useNavigate();
  // Local state to manage toggle interaction
  const [activeServices, setActiveServices] = useState<Record<string, boolean>>({
    'sign-language': true,
    'audio-desc': false,
    tts: true,
  });

  const services: AccessibilityService[] = [
    {
      id: 'sign-language',
      name: 'Sign Language',
      detail: 'AR Feed overlay',
      icon: '🙌',
    },
    {
      id: 'audio-desc',
      name: 'Audio Description',
      detail: 'Live descriptive audio',
      icon: '🎧',
    },
    {
      id: 'tts',
      name: 'Text-to-Speech',
      detail: 'Announcements ticker',
      icon: '🗣️',
    },
  ];

  const handleToggle = (id: string) => {
    setActiveServices((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <div className="bg-surface border border-slate-800 rounded-xl p-4 flex flex-col justify-between shadow-md relative overflow-hidden group hover:border-slate-700 transition-all duration-300 min-h-[180px] text-left select-none">
      {/* Decorative background circle */}
      <div className="absolute -top-10 -right-10 w-24 h-24 bg-accent-purple/5 rounded-full blur-xl group-hover:bg-accent-purple/10 transition-all" />

      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-lg bg-positive-teal/10 border border-positive-teal/20 flex items-center justify-center text-positive-teal shadow-sm group-hover:shadow-[0_0_10px_rgba(20,184,166,0.4)] transition-all">
            <svg
              className="w-5 h-5"
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
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-bold text-slate-200 uppercase tracking-wider">Accessibility</span>
            <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wide">Accommodations</span>
          </div>
        </div>
      </div>

      {/* Service list with toggles */}
      <div className="my-3 space-y-2">
        {services.map((s) => {
          const isActive = activeServices[s.id];
          return (
            <div
              key={s.id}
              className="flex items-center justify-between p-1.5 rounded bg-brand-black/35 border border-slate-850 hover:border-slate-800 transition-all"
            >
              <div className="flex items-center gap-2">
                <span className="text-xs">{s.icon}</span>
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-slate-350 leading-tight">{s.name}</span>
                  <span className="text-[8px] text-slate-500 font-medium leading-none">{s.detail}</span>
                </div>
              </div>

              {/* Status Badge & Toggle Action Switch */}
              <div className="flex items-center gap-2">
                <span
                  className={`text-[7.5px] font-bold px-1 py-0.2 rounded border uppercase tracking-wide ${
                    isActive
                      ? 'border-positive-teal/30 bg-positive-teal/10 text-positive-teal'
                      : 'border-slate-800 bg-slate-900/50 text-slate-500'
                  }`}
                >
                  {isActive ? 'Active' : 'Inactive'}
                </span>

                <button
                  onClick={() => handleToggle(s.id)}
                  aria-label={`Toggle ${s.name}`}
                  className={`w-6 h-3.5 flex items-center rounded-full p-0.5 transition-all duration-200 cursor-pointer ${
                    isActive ? 'bg-positive-teal' : 'bg-slate-800'
                  }`}
                >
                  <div
                    className={`bg-slate-100 w-2.5 h-2.5 rounded-full shadow-sm transform transition-all duration-200 ${
                      isActive ? 'translate-x-2.5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Action Button */}
      <button
        onClick={() => navigate('/accessibility')}
        className="w-full bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-750 text-[10px] font-bold uppercase tracking-wider py-2 px-3 rounded-lg transition-all cursor-pointer"
      >
        Accessibility Settings
      </button>
    </div>
  );
};
