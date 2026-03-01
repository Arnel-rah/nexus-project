import React, { useMemo } from "react";
import { Globe, Zap, ShieldCheck, Clock } from "lucide-react";

interface HistoryPoint {
  checked_at: string;
  is_up: boolean;
  latency: number;
}

interface Site {
  id: number | string;
  name: string;
  url: string;
  is_up: boolean;
  latency: number | null;
  last_check: string;
  history?: HistoryPoint[];
}

interface SiteCardProps {
  site: Site;
  nextScanIn: number;
}

export const SiteCard: React.FC<SiteCardProps> = ({ site, nextScanIn }) => {
  const isUp = site.is_up;
  const theme = {
    accent: isUp ? "#00e5a0" : "#ff4757",
    rgb: isUp ? "0, 229, 160" : "255, 71, 87",
    bg: isUp ? "rgba(0, 229, 160, 0.03)" : "rgba(255, 71, 87, 0.03)",
  };

  const history = useMemo(() => 
    [...(site.history ?? [])].sort((a, b) => 
      new Date(a.checked_at).getTime() - new Date(b.checked_at).getTime()
    ).slice(-24), 
  [site.history]);

  const maxLatency = Math.max(...history.map(h => h.latency), 100);
  const uptime = history.length 
    ? Math.round((history.filter(h => h.is_up).length / history.length) * 100) 
    : 0;

  const countdownPct = ((60 - (nextScanIn % 60)) / 60) * 100;

  return (
    <div 
      className="group relative overflow-hidden rounded-2xl border transition-all duration-500 hover:-translate-y-1"
      style={{
        background: `linear-gradient(165deg, #0f121d 0%, #080a0f 100%)`,
        borderColor: `rgba(${theme.rgb}, 0.15)`,
        boxShadow: `0 10px 30px -15px rgba(0,0,0,0.5)`,
      }}
    >
      <div 
        className="absolute -inset-px opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background: `radial-gradient(600px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(${theme.rgb}, 0.12), transparent 40%)`
        }}
      />
      <div className="absolute top-0 left-0 h-1 w-full overflow-hidden">
        <div 
          className="h-full w-1/3 animate-[shimmer_3s_infinite]"
          style={{ background: `linear-gradient(90deg, transparent, ${theme.accent}, transparent)` }}
        />
      </div>

      <div className="relative z-10 p-5">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="relative">
              {isUp && (
                <div className="absolute -inset-1 animate-pulse rounded-xl blur-sm" style={{ backgroundColor: `rgba(${theme.rgb}, 0.2)` }} />
              )}
              <div 
                className="relative flex h-11 w-11 items-center justify-center rounded-xl border"
                style={{ 
                    backgroundColor: theme.bg, 
                    borderColor: `rgba(${theme.rgb}, 0.2)`,
                    color: theme.accent 
                }}
              >
                <Globe size={20} strokeWidth={1.5} />
              </div>
            </div>
            <div>
              <h3 className="font-syne text-[15px] font-bold text-slate-100 leading-tight">{site.name}</h3>
              <p className="font-mono text-[10px] text-slate-500 mt-1 uppercase tracking-wider">{site.url.replace(/^https?:\/\//, "")}</p>
            </div>
          </div>

          <div 
            className="flex items-center gap-1.5 rounded-full px-2.5 py-1 border font-mono text-[9px] font-bold tracking-tighter"
            style={{ backgroundColor: theme.bg, borderColor: `rgba(${theme.rgb}, 0.2)`, color: theme.accent }}
          >
            <span className={`h-1.5 w-1.5 rounded-full ${isUp ? 'animate-pulse' : ''}`} style={{ backgroundColor: theme.accent }} />
            {isUp ? "SYSTEM_ONLINE" : "SERVICE_CRITICAL"}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-6">
          <StatBox 
            label="Latency" 
            value={site.latency ?? "---"} 
            unit="ms" 
            accent={theme.accent} 
            icon={<Zap size={10} strokeWidth={2.5} />} 
          />
          <StatBox 
            label="Uptime" 
            value={uptime} 
            unit="%" 
            accent={uptime > 95 ? "#00e5a0" : "#ffa502"} 
            icon={<ShieldCheck size={10} strokeWidth={2.5} />} 
          />
        </div>

        <div className="mb-6">
          <div className="flex justify-between text-[9px] font-bold text-slate-600 uppercase mb-2 font-syne">
            <span>Activity Log</span>
            <span className="font-mono text-slate-400">24 Cycles</span>
          </div>
          <div className="flex items-end gap-2 h-10">
            {history.map((h, i) => (
              <div
                key={i}
                className="flex-1 rounded-t-[1px] transition-all duration-300 hover:opacity-100 opacity-60"
                style={{
                  height: h.is_up ? `${Math.max((h.latency / maxLatency) * 100, 15)}%` : "100%",
                  backgroundColor: h.is_up ? (h.latency > 300 ? "#ffa502" : "#00e5a0") : "#ff4757",
                }}
              />
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-slate-800/50">
          <div className="flex items-center gap-2 text-slate-500 font-mono text-[10px]">
             <Clock size={12} strokeWidth={2} />
             <span>{new Date(site.last_check).toLocaleTimeString('fr-FR')}</span>
          </div>
          
          <div className="flex items-center gap-3">
             <div className="w-12 h-1 bg-slate-800 rounded-full overflow-hidden">
                <div 
                  className="h-full transition-all duration-1000" 
                  style={{ width: `${countdownPct}%`, backgroundColor: theme.accent }}
                />
             </div>
             <span className="text-slate-400 font-mono text-[10px] font-bold w-6">{nextScanIn}s</span>
          </div>
        </div>
      </div>
    </div>
  );
};

interface StatBoxProps {
  label: string;
  value: string | number;
  unit: string;
  accent: string;
  icon: React.ReactNode;
}

const StatBox: React.FC<StatBoxProps> = ({ label, value, unit, accent, icon }) => (
  <div className="rounded-xl border border-slate-800/50 bg-slate-900/30 p-3 hover:bg-slate-800/40 transition-colors">
    <div className="flex items-center gap-2 mb-2 text-slate-600">
      {icon}
      <span className="font-syne text-[9px] font-bold uppercase tracking-widest">{label}</span>
    </div>
    <div className="flex items-baseline gap-1">
      <span className="font-mono text-2xl font-bold leading-none tracking-tighter" style={{ color: accent }}>{value}</span>
      <span className="font-mono text-[10px] text-slate-600">{unit}</span>
    </div>
  </div>
);