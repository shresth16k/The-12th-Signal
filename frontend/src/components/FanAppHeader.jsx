import React, { useState } from 'react';

/**
 * FanAppHeader component for the fan-facing mobile view of "The 12th Signal".
 * Displays a premium stadium logo, interactive seat/ticket placeholder, and a notification bell.
 */
export default function FanAppHeader() {
  const [notificationCount, setNotificationCount] = useState(3);
  const [ticketPulse, setTicketPulse] = useState(false);

  // Hardcoded sample fan data
  const fanSeatData = {
    section: '212',
    row: 'K',
    seat: '18',
    gate: 'Gate 3',
  };

  const handleNotificationClick = () => {
    // Clear notification count on click to simulate read state
    setNotificationCount(0);
  };

  const handleTicketClick = () => {
    // Pulse animation trigger on seat block click
    setTicketPulse(true);
    setTimeout(() => setTicketPulse(false), 800);
  };

  return (
    <header className="w-full bg-brand-black/90 backdrop-blur-lg border border-slate-800/60 rounded-xl px-2.5 py-2.5 flex items-center justify-between text-slate-100 select-none shadow-[0_8px_32px_rgba(0,0,0,0.4)] transition-all duration-300">
      {/* 1. Stadium Logo Section */}
      <div className="flex items-center gap-1.5 min-w-0">
        <div className="relative group cursor-pointer shrink-0">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-accent-purple to-positive-teal rounded-lg blur opacity-50 group-hover:opacity-90 transition duration-300"></div>
          <div className="relative w-8 h-8 rounded-lg bg-slate-900/90 flex items-center justify-center border border-slate-700/50 group-hover:border-accent-purple/50 transition-all duration-300">
            {/* Custom stylized "12" logo with a soundwave / signal pulse inside */}
            <svg
              className="w-5 h-5 text-accent-purple group-hover:text-white transition-colors duration-300"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M4 14V10C4 8.89543 4.89543 8 6 8H7C8.10457 8 9 8.89543 9 10V14C9 15.1046 8.10457 16 7 16H6C4.89543 16 4 15.1046 4 14Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M12 8V16M12 16H14M12 8H13.5C14.5 8 15 8.5 15 9.5C15 10.5 14.5 11 13.5 11H12"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path d="M18 6V18" stroke="url(#logo-grad)" strokeWidth="2.5" strokeLinecap="round" />
              <path d="M21 9V15" stroke="url(#logo-grad)" strokeWidth="1.5" strokeLinecap="round" />
              <defs>
                <linearGradient id="logo-grad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#aa3bff" />
                  <stop offset="100%" stopColor="#14b8a6" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>

        <div className="flex flex-col text-left min-w-0">
          <span className="font-extrabold text-[11px] tracking-tight bg-gradient-to-r from-slate-100 via-slate-200 to-slate-400 bg-clip-text text-transparent truncate">
            LUMEN FIELD
          </span>
          <span className="text-[7.5px] text-slate-400 font-bold tracking-wider uppercase truncate">12th Signal</span>
        </div>
      </div>

      {/* 2. Seat Info Placeholder (Digital Ticket Chip) */}
      <div
        onClick={handleTicketClick}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            handleTicketClick();
          }
        }}
        role="button"
        tabIndex={0}
        aria-label={`View matchday digital ticket details: Section ${fanSeatData.section}, Row ${fanSeatData.row}, Seat ${fanSeatData.seat}`}
        className={`flex items-center gap-1.5 px-2 py-1 rounded-lg bg-gradient-to-b from-slate-900/60 to-slate-950/80 border border-slate-800/80 hover:border-accent-purple/40 hover:from-slate-900/80 hover:to-slate-950/90 transition-all duration-300 cursor-pointer shadow-inner shrink-0 focus:outline-none focus:ring-2 focus:ring-accent-purple/80 ${
          ticketPulse ? 'animate-pulse ring-1 ring-accent-purple/50' : ''
        }`}
      >
        {/* Ticket Icon */}
        <div className="flex items-center justify-center w-4 h-4 rounded bg-accent-purple/10 text-accent-purple border border-accent-purple/20 shrink-0">
          <svg
            className="w-2.5 h-2.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={3}
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"
            />
          </svg>
        </div>

        {/* Seat details */}
        <div className="flex flex-col text-left">
          <div className="flex items-center gap-1">
            <span className="text-[7.5px] text-slate-400 font-bold uppercase tracking-wider">Seat</span>
            <span className="w-1 h-1 rounded-full bg-positive-teal animate-ping" aria-hidden="true"></span>
          </div>
          <div className="flex items-center gap-0.5 text-[9.5px] font-mono font-extrabold text-slate-200">
            <span className="text-accent-purple font-semibold">SEC</span>
            <span className="text-slate-100">{fanSeatData.section}</span>
            <span className="text-slate-700 font-normal px-0.5">•</span>
            <span className="text-accent-purple font-semibold">ROW</span>
            <span className="text-slate-100">{fanSeatData.row}</span>
            <span className="text-slate-700 font-normal px-0.5">•</span>
            <span className="text-accent-purple font-semibold">SEAT</span>
            <span className="text-slate-100">{fanSeatData.seat}</span>
          </div>
        </div>
      </div>

      {/* 3. Notification Icon Section */}
      <div className="flex items-center justify-center shrink-0">
        <button
          onClick={handleNotificationClick}
          className="relative p-1.5 rounded-lg bg-slate-900/60 hover:bg-slate-800/80 text-slate-400 hover:text-slate-200 border border-slate-800/80 hover:border-slate-700/80 transition-all duration-300 cursor-pointer group shadow-inner focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-purple/85"
          aria-label="Stadium Notifications"
        >
          {notificationCount > 0 && (
            <span className="absolute top-0.5 right-0.5 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-danger-red opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-danger-red text-[7.5px] font-extrabold text-white items-center justify-center border border-brand-black shadow-sm">
                {notificationCount}
              </span>
            </span>
          )}

          <svg
            className="w-4 h-4 group-hover:animate-wiggle"
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
      </div>
    </header>
  );
}
