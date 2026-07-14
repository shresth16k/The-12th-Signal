/**
 * Aligns with 'Smart Stadiums & Tournament Operations — Smart Stadiums & Tournament Operations'.
 * Main cockpit interface that integrates real-time signals, spatial stadium zone maps, and the AI War Room.
 */
import React, { useState } from 'react';
import { StadiumPulse } from './StadiumPulse';
import { StadiumZoneMap } from './StadiumZoneMap';
import { WarRoomPanel } from './WarRoomPanel';
import { RumorShieldCard } from './RumorShieldCard';
import { FanTwinCard } from './FanTwinCard';
import { AccessibilityCard } from './AccessibilityCard';
import { BroadcastAICard } from './BroadcastAICard';
import { QuickActionsCard } from './QuickActionsCard';

export const CommandCenter: React.FC = () => {
  const [selectedClusterId, setSelectedClusterId] = useState<string | undefined>(undefined);

  return (
    <div className="flex-1 bg-brand-black p-6 overflow-y-auto space-y-6 text-left select-none">
      {/* 1. Top Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Active Fan Signals', value: '200 Ingested', color: 'border-slate-800' },
          { label: 'Semantic Clusters', value: '4 Detected', color: 'border-accent-purple/30' },
          { label: 'Rumor Shield Warnings', value: '0 Active', color: 'border-positive-teal/30' },
          { label: 'Stadium Health Index', value: '98% Nominal', color: 'border-info-blue/30' }
        ].map((m, idx) => (
          <div 
            key={idx} 
            className={`bg-surface border ${m.color} rounded-xl p-5 flex flex-col justify-between shadow-lg relative overflow-hidden group hover:border-slate-700 transition-all duration-300`}
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-accent-purple/5 rounded-full blur-2xl group-hover:bg-accent-purple/10 transition-all" />
            <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
              {m.label}
            </span>
            <span className="text-xl font-extrabold text-slate-100 mt-2 font-mono">
              {m.value}
            </span>
          </div>
        ))}
      </div>

      {/* 2. Main Two-Column Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (Stadium Pulse + Zone Map stacked) */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* Stadium Pulse Card */}
          <div className="bg-surface border border-slate-800 rounded-xl p-6 h-96 flex flex-col shadow-lg relative overflow-hidden hover:border-slate-700 transition-all">
            <StadiumPulse onSelectCluster={setSelectedClusterId} selectedClusterId={selectedClusterId} />
          </div>

          {/* Zone Map Card */}
          <div className="bg-surface border border-slate-800 rounded-xl p-6 h-80 flex flex-col shadow-lg relative overflow-hidden hover:border-slate-700 transition-all">
            <StadiumZoneMap />
          </div>
        </div>

        {/* Right Column (AI War Room panel) */}
        <div className="bg-surface border border-slate-800 rounded-xl p-6 h-[46.5rem] flex flex-col shadow-lg relative overflow-hidden hover:border-slate-700 transition-all">
          <WarRoomPanel clusterId={selectedClusterId} />
        </div>
      </div>

      {/* 3. Bottom Row: 5 Department Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <RumorShieldCard />
        <FanTwinCard />
        <AccessibilityCard />
        <BroadcastAICard />
        <QuickActionsCard />
      </div>
    </div>
  );
};
