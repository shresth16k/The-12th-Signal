import React, { useState, useEffect } from 'react';

interface WarRoomPanelProps {
  clusterId?: string;
}

export const WarRoomPanel: React.FC<WarRoomPanelProps> = ({ clusterId }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [consensus, setConsensus] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!clusterId) {
      setConsensus(null);
      setError(null);
      return;
    }

    const fetchNegotiation = async () => {
      setLoading(true);
      setError(null);
      try {
        const host =
          window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
            ? 'http://localhost:8000'
            : '';
        const res = await fetch(`${host}/api/negotiate`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ cluster_id: clusterId }),
        });

        if (res.ok) {
          const data = await res.json();
          setConsensus(data);
        } else {
          const errData = await res.json().catch(() => ({}));
          setError(errData.detail || 'Failed to negotiate cluster consensus');
        }
      } catch (err) {
        console.error('Error negotiating cluster:', err);
        setError('Network error negotiating cluster consensus');
      } finally {
        setLoading(false);
      }
    };

    fetchNegotiation();
  }, [clusterId]);

  // Helper to map agent names to layout visual elements
  const getAgentDetails = (name: string) => {
    const nameLower = name.toLowerCase();
    if (nameLower.includes('security')) {
      return {
        icon: '🛡️',
        color: 'border-danger-red/30 text-danger-red bg-danger-red/10',
      };
    }
    if (nameLower.includes('transit')) {
      return {
        icon: '🚇',
        color: 'border-info-blue/30 text-info-blue bg-info-blue/10',
      };
    }
    if (nameLower.includes('concessions') || nameLower.includes('concession')) {
      return {
        icon: '🍔',
        color: 'border-warning-amber/30 text-warning-amber bg-warning-amber/10',
      };
    }
    if (nameLower.includes('broadcast')) {
      return {
        icon: '🎥',
        color: 'border-accent-purple/30 text-accent-purple bg-accent-purple/10',
      };
    }
    if (nameLower.includes('medical')) {
      return {
        icon: '🏥',
        color: 'border-positive-teal/30 text-positive-teal bg-positive-teal/10',
      };
    }
    return {
      icon: '🤖',
      color: 'border-slate-800 text-slate-400 bg-slate-900',
    };
  };

  const formatTime = (isoString?: string) => {
    if (!isoString) return 'Just now';
    try {
      const d = new Date(isoString);
      return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
      return 'Just now';
    }
  };

  if (!clusterId) {
    return (
      <div className="w-full h-full flex flex-col justify-between text-left select-none">
        {/* Header */}
        <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-accent-purple shadow-[0_0_8px_#aa3bff]" />
            <h2 className="text-sm font-bold text-slate-200 uppercase tracking-wider">AI War Room</h2>
          </div>
          <span className="text-[10px] bg-slate-800 text-slate-400 font-bold px-2 py-0.5 rounded">
            Orchestrator Panel
          </span>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center text-slate-500 bg-brand-black/20 border border-dashed border-slate-800 rounded-lg p-6 text-center">
          <svg
            className="w-10 h-10 mb-3 text-slate-700"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Awaiting Target Selection
          </span>
          <span className="text-[10px] text-slate-400 mt-2 max-w-[220px]">
            Select an active fan signal cluster to initiate multi-agent operations consensus.
          </span>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="w-full h-full flex flex-col justify-between text-left select-none">
        {/* Header */}
        <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-accent-purple shadow-[0_0_8px_#9b2bf6]" />
            <h2 className="text-sm font-bold text-slate-200 uppercase tracking-wider">AI War Room</h2>
          </div>
          <span className="text-[10px] bg-slate-800 text-slate-400 font-bold px-2 py-0.5 rounded">
            Orchestrator Panel
          </span>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center text-slate-500 bg-brand-black/20 border border-dashed border-slate-850 rounded-lg p-6 text-center">
          <div className="w-8 h-8 rounded-full border-2 border-accent-purple border-t-transparent animate-spin mb-3" />
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Synthesizing Consensus...
          </span>
          <span className="text-[10px] text-slate-400 mt-2 max-w-[220px]">
            Calling Security, Concessions, Medical, Transit, and Broadcast agents to resolve action plan.
          </span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-full flex flex-col justify-between text-left select-none">
        {/* Header */}
        <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-danger-red animate-pulse" />
            <h2 className="text-sm font-bold text-slate-200 uppercase tracking-wider">AI War Room</h2>
          </div>
          <span className="text-[10px] bg-slate-800 text-slate-400 font-bold px-2 py-0.5 rounded">
            Orchestrator Panel
          </span>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center text-danger-red bg-danger-red/5 border border-dashed border-danger-red/20 rounded-lg p-6 text-center">
          <span className="text-2xl mb-2">⚠️</span>
          <span className="text-xs font-semibold uppercase tracking-wider text-danger-red">
            Consensus Negotiation Failed
          </span>
          <span className="text-[10px] text-slate-400 mt-2 max-w-[220px]">{error}</span>
        </div>
      </div>
    );
  }

  const opinions = consensus?.contributing_opinions || [];

  return (
    <div className="w-full h-full flex flex-col justify-between text-left select-none">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-accent-purple shadow-[0_0_8px_#9b2bf6]" />
          <h2 className="text-sm font-bold text-slate-200 uppercase tracking-wider">AI War Room</h2>
        </div>
        <span className="text-[10px] bg-slate-800 text-slate-400 font-bold px-2 py-0.5 rounded">
          Orchestrator Panel
        </span>
      </div>

      {/* Message list (Chat bubbles) */}
      <div className="flex-1 space-y-3 overflow-y-auto max-h-[30rem] pr-1 mb-4">
        {opinions.length === 0 ? (
          <div className="text-xs text-slate-500 text-center py-10 border border-dashed border-slate-850 rounded-lg bg-brand-black/20">
            No agent opinions recorded. Safety filter may have short-circuited negotiation.
          </div>
        ) : (
          opinions.map((o: any, idx: number) => {
            const details = getAgentDetails(o.agent_name);
            return (
              <div key={idx} className="flex flex-col gap-1">
                <div className="flex items-center justify-between px-1">
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-5 h-5 rounded flex items-center justify-center text-[10px] border ${details.color}`}
                    >
                      {details.icon}
                    </span>
                    <span className="text-[11px] font-bold text-slate-300">{o.agent_name}</span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono font-medium">
                    {formatTime(consensus.timestamp)}
                  </span>
                </div>
                <div className="bg-brand-black/40 border border-slate-850 rounded-lg p-2.5 text-xs text-slate-300 leading-relaxed shadow-sm">
                  <div className="font-semibold text-slate-200 mb-1">{o.recommendation}</div>
                  <div className="text-[10px] text-slate-400 italic bg-brand-black/25 border-l border-slate-700 pl-2 mt-1.5 py-0.5">
                    {o.reasoning}
                  </div>
                  {o.constraints && o.constraints.length > 0 && (
                    <div className="text-[9px] text-slate-400 mt-1 flex flex-wrap gap-1">
                      <span className="font-semibold text-slate-400">Constraints:</span>
                      {o.constraints.map((c: string, cIdx: number) => (
                        <span key={cIdx} className="bg-slate-800/80 px-1 py-0.2 rounded text-[8px] text-slate-400">
                          {c}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Consensus reached card */}
      <div className="bg-accent-purple/10 border border-accent-purple/40 rounded-xl p-4 mb-4 shadow-[0_0_15px_rgba(170,59,255,0.1)] animate-fadeIn">
        <div className="flex items-center gap-2 mb-2">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-purple opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-accent-purple"></span>
          </span>
          <span className="text-[10px] uppercase tracking-wider text-accent-purple font-bold">
            Consensus Action Reached
          </span>
        </div>
        <p className="text-xs text-slate-200 font-medium leading-relaxed">
          {consensus?.final_action || 'Determining consensus actions...'}
        </p>
      </div>

      {/* View full transcript button */}
      <button className="w-full bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-750 text-xs font-semibold py-2.5 px-4 rounded-lg transition-all cursor-pointer">
        View Full Transcript Trail
      </button>
    </div>
  );
};
