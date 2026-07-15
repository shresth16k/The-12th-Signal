import React, { useState, useEffect } from 'react';

interface StadiumPulseProps {
  onSelectCluster?: (id: string) => void;
  selectedClusterId?: string;
}

export const StadiumPulse: React.FC<StadiumPulseProps> = ({ onSelectCluster, selectedClusterId }) => {
  // Sample sentiment data
  const positiveSentiment = 58;
  const neutralSentiment = 26;
  const negativeSentiment = 16;

  const [clusters, setClusters] = useState<any[]>([]);

  useEffect(() => {
    const fetchClusters = async () => {
      try {
        const host =
          window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
            ? 'http://localhost:8000'
            : '';
        const res = await fetch(`${host}/api/clusters`);
        if (res.ok) {
          const data = await res.json();
          setClusters(data);
        }
      } catch (err) {
        console.error('Error fetching clusters:', err);
      }
    };

    fetchClusters();
    const interval = setInterval(fetchClusters, 10000);
    return () => clearInterval(interval);
  }, []);

  // Map the live clusters
  const mappedClusters = clusters.slice(0, 4).map((c: any) => {
    const topicLower = c.topic.toLowerCase();
    let severity = 'low';
    let iconEmoji = '📣';

    // Heuristics for icons and severity
    if (
      topicLower.includes('flood') ||
      topicLower.includes('leak') ||
      topicLower.includes('water') ||
      topicLower.includes('restroom')
    ) {
      iconEmoji = '💧';
      severity = c.signal_ids?.length >= 30 ? 'high' : 'medium';
    } else if (
      topicLower.includes('gate') ||
      topicLower.includes('crowd') ||
      topicLower.includes('bottleneck') ||
      topicLower.includes('line') ||
      topicLower.includes('queue')
    ) {
      iconEmoji = '🚶';
      severity = c.signal_ids?.length >= 35 ? 'high' : 'medium';
    } else if (
      topicLower.includes('food') ||
      topicLower.includes('stock') ||
      topicLower.includes('concession') ||
      topicLower.includes('hot dog') ||
      topicLower.includes('vendor')
    ) {
      iconEmoji = '🌭';
      severity = 'low';
    } else if (
      topicLower.includes('medical') ||
      topicLower.includes('exhaustion') ||
      topicLower.includes('heat') ||
      topicLower.includes('injury')
    ) {
      iconEmoji = '❤️';
      severity = 'high';
    }

    return {
      id: c.id,
      topic: c.topic,
      zone: c.zone,
      count: c.signal_ids?.length || 0,
      severity,
      icon: (
        <span
          className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs border ${
            severity === 'high'
              ? 'bg-danger-red/10 border-danger-red/30 text-danger-red'
              : severity === 'medium'
                ? 'bg-warning-amber/10 border-warning-amber/30 text-warning-amber'
                : 'bg-accent-purple/10 border-accent-purple/30 text-accent-purple'
          }`}
        >
          {iconEmoji}
        </span>
      ),
    };
  });

  return (
    <div className="w-full h-full flex flex-col justify-between text-left select-none">
      {/* 1. Header with Title */}
      <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-accent-purple animate-pulse" />
          <h2 className="text-sm font-bold text-slate-200 uppercase tracking-wider">Stadium Pulse</h2>
        </div>
        <span className="text-[10px] bg-slate-800 text-slate-400 font-bold px-2 py-0.5 rounded">
          Fan Sentiment & Signals
        </span>
      </div>

      {/* 2. Sentiment + Sparkline */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        {/* Sentiment Distribution */}
        <div className="space-y-2">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Crowd Sentiment Breakdown
          </span>
          <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
            <span className="text-positive-teal">Positive ({positiveSentiment}%)</span>
            <span className="text-slate-400">Neutral ({neutralSentiment}%)</span>
            <span className="text-danger-red">Negative ({negativeSentiment}%)</span>
          </div>
          {/* Segmented bar */}
          <div className="w-full h-2.5 bg-slate-800 rounded-full flex overflow-hidden">
            <div className="h-full bg-positive-teal" style={{ width: `${positiveSentiment}%` }} />
            <div className="h-full bg-slate-500" style={{ width: `${neutralSentiment}%` }} />
            <div className="h-full bg-danger-red" style={{ width: `${negativeSentiment}%` }} />
          </div>
        </div>

        {/* Sparkline Trend */}
        <div className="flex flex-col justify-between">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Sentiment Trend (Last 90m)
          </span>
          <div className="h-10 w-full mt-1.5 bg-brand-black/30 border border-slate-850 rounded-lg p-1 relative">
            <svg className="w-full h-full" viewBox="0 0 100 20" preserveAspectRatio="none" aria-hidden="true">
              <defs>
                <linearGradient id="sparklineGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#aa3bff" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#aa3bff" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              <path d="M0,15 Q10,12 20,16 T40,10 T60,5 T80,18 T100,12 L100,20 L0,20 Z" fill="url(#sparklineGrad)" />
              <path
                d="M0,15 Q10,12 20,16 T40,10 T60,5 T80,18 T100,12"
                fill="none"
                stroke="#aa3bff"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* 3. Top Signal Clusters */}
      <div className="flex-1 space-y-2 mb-4">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
          Top Signal Clusters — Last 5 Minutes
        </span>
        <div className="space-y-2 overflow-y-auto max-h-48 pr-1">
          {mappedClusters.length === 0 ? (
            <div className="text-xs text-slate-500 text-center py-8 border border-dashed border-slate-800 rounded-lg bg-brand-black/20">
              No active signal clusters detected
            </div>
          ) : (
            mappedClusters.map((c) => {
              const severityColor =
                c.severity === 'high'
                  ? 'bg-danger-red/10 text-danger-red border-danger-red/30'
                  : c.severity === 'medium'
                    ? 'bg-warning-amber/10 text-warning-amber border-warning-amber/30'
                    : 'bg-info-blue/10 text-info-blue border-info-blue/30';
              const isSelected = selectedClusterId === c.id;
              return (
                <button
                  type="button"
                  key={c.id}
                  onClick={() => onSelectCluster && onSelectCluster(c.id)}
                  aria-label={`Cluster: ${c.topic} in ${c.zone}, Severity: ${c.severity}, Count: ${c.count} signals`}
                  className={`flex items-center justify-between p-2.5 rounded-lg transition-all cursor-pointer w-full text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-purple ${
                    isSelected
                      ? 'bg-accent-purple/10 border border-accent-purple shadow-[0_0_12px_rgba(170,59,255,0.2)]'
                      : 'bg-brand-black/45 border border-slate-850 hover:border-slate-800 hover:focus-visible:border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {c.icon}
                    <div className="flex flex-col">
                      <span className="text-xs font-semibold text-slate-200">{c.topic}</span>
                      <span className="text-[10px] text-slate-500 font-medium">{c.zone}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[9px] px-1.5 py-0.5 rounded font-bold border uppercase tracking-wide ${severityColor}`}
                    >
                      {c.severity}
                    </span>
                    <span className="text-xs font-mono font-bold text-slate-400">{c.count} sigs</span>
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* 4. Bottom Stats (4 columns) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-3 border-t border-slate-850">
        {[
          { label: 'Active Signals', value: '142', color: 'text-slate-100' },
          { label: 'Avg Response', value: '1.8m', color: 'text-positive-teal' },
          { label: 'Resolved today', value: '1,240', color: 'text-slate-100' },
          { label: 'Fan Sat Index', value: '94%', color: 'text-accent-purple' },
        ].map((s, idx) => (
          <div key={idx} className="flex flex-col bg-brand-black/20 p-2 rounded-lg border border-slate-850">
            <span className="text-[9px] uppercase tracking-wider text-slate-500 font-semibold">{s.label}</span>
            <span className={`text-sm font-bold font-mono mt-0.5 ${s.color}`}>{s.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
