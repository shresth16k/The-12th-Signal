import React from 'react';
import { StatusStrip } from './StatusStrip';
import { useNavigate, useLocation } from 'react-router-dom';

interface SidebarProps {
  onItemChange?: (itemName: string) => void;
}

interface NavItem {
  name: string;
  icon: React.ReactNode;
}

const pathToItemMap: Record<string, string> = {
  '/': 'Command Center',
  '/war-room': 'AI War Room',
  '/signals': 'Signals',
  '/fan-twins': 'Fan Twins',
  '/rumor-shield': 'Rumor Shield',
  '/accessibility': 'Accessibility',
  '/broadcast-ai': 'Broadcast AI',
  '/analytics': 'Analytics',
  '/playbook': 'Playbook',
  '/settings': 'Settings'
};

const itemToPathMap: Record<string, string> = {
  'Command Center': '/',
  'AI War Room': '/war-room',
  'Signals': '/signals',
  'Fan Twins': '/fan-twins',
  'Rumor Shield': '/rumor-shield',
  'Accessibility': '/accessibility',
  'Broadcast AI': '/broadcast-ai',
  'Analytics': '/analytics',
  'Playbook': '/playbook',
  'Settings': '/settings'
};

export const Sidebar: React.FC<SidebarProps> = ({ onItemChange }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const currentPath = location.pathname;
  const activeItem = pathToItemMap[currentPath] || 'Command Center';


  const navItems: NavItem[] = [
    {
      name: 'Command Center',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
        </svg>
      )
    },
    {
      name: 'AI War Room',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
        </svg>
      )
    },
    {
      name: 'Signals',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5.05 9.878a7 7 0 019.9 0M3.636 8.464a9 9 0 0112.728 0M11.99 12.01a1 1 0 100-2 1 1 0 000 2zm3.03 3.03a4 4 0 00-6.06 0" />
        </svg>
      )
    },
    {
      name: 'Fan Twins',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      )
    },
    {
      name: 'Rumor Shield',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      )
    },
    {
      name: 'Accessibility',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      )
    },
    {
      name: 'Broadcast AI',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
      )
    },
    {
      name: 'Analytics',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2h2a2 2 0 002-2zm12 0v-3a2 2 0 00-2-2h-2a2 2 0 00-2 2v3a2 2 0 002 2h2a2 2 0 002-2zm0 0v-7a2 2 0 00-2-2h-2a2 2 0 00-2 2v7a2 2 0 002 2h2a2 2 0 002-2z" />
        </svg>
      )
    },
    {
      name: 'Playbook',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.168.477 4 1.253m0-13C13.168 5.477 14.754 5S16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4 1.253" />
        </svg>
      )
    },
    {
      name: 'Settings',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      )
    }
  ];

  const handleItemClick = (name: string) => {
    const path = itemToPathMap[name];
    if (path) {
      navigate(path);
    }
    if (onItemChange) {
      onItemChange(name);
    }
  };

  return (
    <aside className="w-64 bg-surface border-r border-slate-800 flex flex-col h-full text-slate-300 select-none">
      {/* Navigation menu */}
      <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = activeItem === item.name;
          return (
            <button
              key={item.name}
              onClick={() => handleItemClick(item.name)}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer ${
                isActive
                  ? 'bg-accent-purple text-slate-100 shadow-[0_0_15px_rgba(170,59,255,0.3)]'
                  : 'hover:bg-slate-850 hover:text-slate-100 text-slate-400'
              }`}
            >
              <span className={`transition-transform duration-200 ${isActive ? 'scale-110 text-slate-100' : 'group-hover:scale-115'}`}>
                {item.icon}
              </span>
              <span>{item.name}</span>
            </button>
          );
        })}
      </nav>

      {/* Pinned bottom status block */}
      <div className="border-t border-slate-800 p-4 bg-brand-black/40">
        <StatusStrip />
      </div>
    </aside>
  );
};
