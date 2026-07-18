import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import logoDark from '../assets/logo-dark.png';
import logoLight from '../assets/logo-light.png';

interface HeaderBarProps {
  onLogoClick?: () => void;
  theme?: 'dark' | 'light';
  onThemeToggle?: () => void;
}

export const HeaderBar: React.FC<HeaderBarProps> = ({ onLogoClick, theme = 'dark', onThemeToggle }) => {
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(2);
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: 'Restroom Flooding Spike',
      zone: 'Zone C',
      desc: '45 fan signals reports water leak. Multi-agent negotiation active.',
      time: '2m ago',
      unread: true,
      critical: true,
    },
    {
      id: 2,
      title: 'Crowd Congestion Alert',
      zone: 'Gate 3 Entrance',
      desc: '35 reports of slow moving queues. Suggested detour route calculated.',
      time: '5m ago',
      unread: true,
      critical: false,
    },
  ]);

  const bellRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (bellRef.current && !bellRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="w-full bg-surface/90 backdrop-blur-md border-b border-slate-800/30 px-5 py-1.5 flex items-center justify-between text-slate-100 select-none z-50">
      {/* Left section: Logo + Title */}
      <div
        onClick={onLogoClick}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            onLogoClick?.();
          }
        }}
        role="button"
        tabIndex={0}
        aria-label="The 12th Signal Logo - Go to Dashboard"
        className="flex items-center gap-2 cursor-pointer group focus:outline-none focus:ring-2 focus:ring-accent-purple rounded"
      >
        <div className="w-6.5 h-6.5 rounded bg-brand-black flex items-center justify-center border border-accent-purple/20 group-hover:border-accent-purple/40 transition-all duration-300 overflow-hidden p-0.5 shadow-[0_0_8px_rgba(170,59,255,0.1)]">
          <img
            src={theme === 'dark' ? logoDark : logoLight}
            alt="The 12th Signal Logo"
            className="w-full h-full object-contain"
          />
        </div>
        <div className="flex flex-col text-left">
          <span
            role="heading"
            aria-level={1}
            className="font-extrabold text-[12.5px] tracking-wide bg-gradient-to-r from-slate-100 to-slate-350 bg-clip-text text-transparent group-hover:from-accent-purple group-hover:to-slate-100 transition-all duration-300 leading-none mb-0.5"
          >
            The 12th Signal
          </span>
          <span className="text-[7.5px] text-slate-400 font-bold tracking-wider uppercase leading-none">
            Stadium nervous system
          </span>
        </div>
      </div>

      {/* Middle section: Match Score Chip */}
      <div className="flex items-center gap-2.5 bg-brand-black/40 border border-slate-800/30 rounded-full px-3 py-1 shadow-inner">
        <div className="flex items-center gap-1">
          <span className="font-extrabold text-[10.5px] text-slate-350">USA</span>
          <span className="px-1 py-0.2 bg-slate-800/60 text-[8.5px] font-mono font-bold rounded text-slate-400">2</span>
          <span className="text-slate-700 font-medium text-[8px]">—</span>
          <span className="px-1 py-0.2 bg-slate-800/60 text-[8.5px] font-mono font-bold rounded text-slate-400">1</span>
          <span className="font-extrabold text-[10.5px] text-slate-350">MEX</span>
        </div>
        <div className="h-2.5 w-px bg-slate-800/50" />
        <div className="flex items-center gap-1">
          <span className="relative flex h-1 w-1">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-positive-teal opacity-75"></span>
            <span className="relative inline-flex rounded-full h-1 w-1 bg-positive-teal"></span>
          </span>
          <span className="font-mono text-[10.5px] font-bold text-positive-teal tracking-wider">74:15</span>
        </div>
      </div>

      {/* Right-middle section: Statistics */}
      <div className="hidden md:flex items-center gap-4">
        <div className="flex flex-col items-end">
          <span className="text-[8px] uppercase tracking-wider text-slate-400 font-bold">Signals / Min</span>
          <div className="flex items-center gap-0.5 mt-0.2">
            <span className="font-mono font-bold text-slate-300 text-[11px]">142</span>
            <svg
              className="w-2.5 h-2.5 text-positive-teal"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={4}
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
          </div>
        </div>
        <div className="h-5 w-px bg-slate-800/40" />
        <div className="flex flex-col items-end">
          <span className="text-[8px] uppercase tracking-wider text-slate-400 font-bold">Attendance</span>
          <div className="flex items-center gap-1 mt-0.2">
            <span className="font-mono font-bold text-slate-300 text-[11px]">84,320</span>
            <span className="text-[8px] px-1 bg-slate-800 text-slate-400 font-bold rounded">98%</span>
          </div>
        </div>
      </div>

      {/* Right section: Notifications + Commander profile */}
      <div className="flex items-center gap-2.5">
        {/* Theme Toggle Button */}
        <button
          onClick={onThemeToggle}
          aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
          className="relative p-1 rounded bg-slate-850 hover:bg-slate-800 text-slate-450 hover:text-slate-250 transition-all border border-slate-800/60 hover:border-slate-700 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-purple"
        >
          {theme === 'dark' ? (
            /* Sun Icon */
            <svg
              className="w-3.5 h-3.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.364 17.636l-.707.707M1.636 5.636l-.707-.707m12.728 12.728l-.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z"
              />
            </svg>
          ) : (
            /* Moon Icon */
            <svg
              className="w-3.5 h-3.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
              />
            </svg>
          )}
        </button>

        {/* Notification bell and dropdown wrapper */}
        <div ref={bellRef} className="relative">
          <button
            onClick={() => {
              setShowNotifications((prev) => !prev);
              setUnreadCount(0);
            }}
            aria-label="View notifications"
            className="relative p-1 rounded bg-slate-850 hover:bg-slate-800 text-slate-450 hover:text-slate-250 transition-all border border-slate-800/60 hover:border-slate-700 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-purple"
          >
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 flex h-1 w-1">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-danger-red opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1 w-1 bg-danger-red"></span>
              </span>
            )}
            <svg
              className="w-3.5 h-3.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
              />
            </svg>
          </button>

          {/* Notifications Dropdown menu */}
          {showNotifications && (
            <div className="absolute right-0 mt-2.5 w-80 bg-surface border border-slate-800/60 rounded-xl shadow-[0_10px_25px_rgba(0,0,0,0.5)] z-[100] p-4 text-left animate-fadeIn">
              <div className="flex items-center justify-between border-b border-slate-800/30 pb-2 mb-3">
                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                  Matchday Alerts
                </span>
                {notifications.some((n) => n.unread) && (
                  <button
                    onClick={() => {
                      setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
                      setUnreadCount(0);
                    }}
                    className="text-[9px] font-extrabold text-accent-purple hover:text-accent-purple/80 uppercase tracking-wider cursor-pointer"
                  >
                    Clear All
                  </button>
                )}
              </div>

              <div className="space-y-2.5 max-h-64 overflow-y-auto custom-scrollbar pr-1">
                {notifications.length === 0 ? (
                  <div className="text-center py-6 text-slate-500 text-xs">
                    No active system alerts.
                  </div>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      className={`p-2.5 rounded-lg border transition-all ${
                        n.unread
                          ? 'bg-brand-black/40 border-slate-800/80'
                          : 'bg-brand-black/10 border-slate-850/50 opacity-60'
                      }`}
                    >
                      <div className="flex items-start gap-2">
                        <span className="text-xs mt-0.5">{n.critical ? '💧' : '🚶'}</span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-1.5">
                            <span className="text-xs font-bold text-slate-200 truncate">{n.title}</span>
                            <span className="text-[8px] font-mono text-slate-500 font-bold shrink-0">{n.time}</span>
                          </div>
                          <span className="text-[9px] text-slate-400 font-semibold uppercase tracking-wide block mt-0.5">
                            {n.zone}
                          </span>
                          <p className="text-[10px] text-slate-400 font-medium leading-relaxed mt-1">
                            {n.desc}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Profile Card */}
        <button
          onClick={() => navigate('/settings')}
          aria-label="View developer settings and profile"
          className="flex items-center gap-2 pl-2 border-l border-slate-800/40 hover:bg-slate-850/30 p-1 rounded-lg transition-all text-left focus:outline-none focus:ring-1 focus:ring-accent-purple cursor-pointer group"
        >
          <div className="relative">
            <div className="w-6.5 h-6.5 rounded-full bg-accent-purple/20 border border-accent-purple/40 group-hover:border-accent-purple flex items-center justify-center text-slate-100 font-extrabold text-[10px] transition-all">
              SK
            </div>
            <div className="absolute bottom-0 right-0 w-1.5 h-1.5 bg-positive-teal rounded-full border border-surface" />
          </div>
          <div className="hidden lg:flex flex-col text-left">
            <span className="text-[11px] font-bold text-slate-250 leading-tight group-hover:text-slate-100 transition-all">
              Shresth K.
            </span>
            <span className="text-[8px] text-slate-400 font-bold uppercase tracking-wider group-hover:text-slate-300 transition-all">
              Ops Commander
            </span>
          </div>
        </button>
      </div>
    </header>
  );
};

