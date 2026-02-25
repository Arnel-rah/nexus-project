import React, { useMemo } from 'react';
import { Globe, Activity, ExternalLink, Zap, Clock } from 'lucide-react';
import type { Site } from '../types/site';

interface Props {
  site: Site;
  nextScanIn: number;
}

export const SiteCard: React.FC<Props> = ({ site, nextScanIn }) => {
  const isUp: boolean = site.is_up;
  const history = useMemo(() => {
    const data = site.history ?? [];
    return [...data].sort(
      (a, b) => new Date(a.checked_at).getTime() - new Date(b.checked_at).getTime()
    );
  }, [site.history]);

  const maxLatency: number = useMemo(
    () => (history.length > 0 ? Math.max(...history.map((h) => h.latency), 1) : 1),
    [history]
  );

  const uptime: number | null = useMemo(() => {
    if (!history.length) return null;
    const upCount = history.filter((h) => h.is_up).length;
    return Math.round((upCount / history.length) * 100);
  }, [history]);

  const updatedAt: string | null = site.last_check
    ? new Date(site.last_check).toLocaleTimeString('fr-FR', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      })
    : null;

  const mins: number = Math.floor(nextScanIn / 60);
  const secs: number = nextScanIn % 60;
  const countdownPct: number = ((60 - nextScanIn) / 60) * 100;

  const cleanUrl: string = site.url
    .replace('https://', '')
    .replace('http://', '');

  const getBarColor = (isUp: boolean, latency: number): string => {
    if (!isUp) return 'bg-red-400';
    if (latency > 500) return 'bg-yellow-400';
    return 'bg-green-400/70';
  };

  const getUptimeColor = (uptime: number | null): string => {
    if (uptime === null) return 'text-slate-400';
    if (uptime === 100) return 'text-green-600';
    if (uptime >= 80) return 'text-yellow-500';
    return 'text-red-500';
  };

  return (
    <div
      className={[
        'group relative overflow-hidden rounded-2xl border',
        'transition-all duration-500',
        'hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)]',
        isUp
          ? 'bg-white border-slate-200/60 hover:border-green-200'
          : 'bg-white border-slate-200/60 hover:border-red-200',
      ].join(' ')}
    >
      <div
        className={[
          'absolute -right-12 -top-12 h-24 w-24 rounded-full blur-3xl',
          'opacity-10 transition-opacity group-hover:opacity-20',
          isUp ? 'bg-green-500' : 'bg-red-500',
        ].join(' ')}
      />

      <div className="p-6">
        <div className="flex justify-between items-start mb-5">
          <div className="flex items-center gap-3">
            <div
              className={[
                'relative flex h-11 w-11 items-center justify-center rounded-2xl border',
                'transition-transform duration-300 group-hover:scale-110',
                isUp
                  ? 'bg-green-50/50 border-green-100 text-green-600'
                  : 'bg-red-50/50 border-red-100 text-red-600',
              ].join(' ')}
            >
              <Globe size={20} strokeWidth={1.5} />
              {isUp && (
                <span className="absolute -right-1 -top-1 flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500" />
                </span>
              )}
            </div>

            <div>
              <h3 className="font-bold text-slate-900 tracking-tight leading-none">
                {site.name}
              </h3>
              <a
                href={site.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-xs font-medium text-slate-400 hover:text-indigo-500 transition-colors mt-1"
              >
                <span className="truncate max-w-30">{cleanUrl}</span>
                <ExternalLink size={11} />
              </a>
            </div>
          </div>

          <div
            className={[
              'inline-flex items-center px-2.5 py-1 rounded-full',
              'text-[11px] font-bold uppercase tracking-wider',
              isUp
                ? 'bg-green-100/60 text-green-700 border border-green-200/50'
                : 'bg-red-100/60 text-red-700 border border-red-200/50',
            ].join(' ')}
          >
            {isUp ? 'Online' : 'Down'}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="rounded-xl bg-slate-50/80 p-3 border border-slate-100 group-hover:bg-white transition-colors">
            <div className="flex items-center gap-1.5 mb-1">
              <Activity size={12} className="text-slate-400" />
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">
                Latency
              </span>
            </div>
            <div className="flex items-baseline gap-1">
              <span className={`text-lg font-bold font-mono ${isUp ? 'text-slate-700' : 'text-red-400'}`}>
                {site.latency ?? '---'}
              </span>
              <span className="text-[10px] text-slate-400">ms</span>
            </div>
          </div>

          <div className="rounded-xl bg-slate-50/80 p-3 border border-slate-100 group-hover:bg-white transition-colors">
            <div className="flex items-center gap-1.5 mb-1">
              <Zap size={12} className="text-slate-400" />
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">
                Uptime
              </span>
            </div>
            <div className="flex items-baseline gap-1">
              <span className={`text-lg font-bold font-mono ${getUptimeColor(uptime)}`}>
                {uptime !== null ? uptime : '---'}
              </span>
              <span className="text-[10px] text-slate-400">%</span>
            </div>
          </div>
        </div>

        {history.length > 0 && (
          <div className="mb-4">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">
              Historique latence
            </span>
            <div className="flex items-end gap-0.5 h-10 mt-1.5">
              {history.slice(-20).map((h, i) => {
                const heightPct: number = Math.max((h.latency / maxLatency) * 100, 8);
                return (
                  <div
                    key={i}
                    className="group/bar relative flex-1 rounded-sm transition-all duration-300"
                    style={{ height: `${heightPct}%` }}
                  >
                    <div className={`absolute inset-0 rounded-sm ${getBarColor(h.is_up, h.latency)}`} />
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 hidden group-hover/bar:flex flex-col items-center z-10">
                      <div className="bg-slate-800 text-white text-[10px] font-mono px-1.5 py-0.5 rounded whitespace-nowrap">
                        {h.is_up ? `${h.latency}ms` : 'DOWN'}
                      </div>
                      <div className="w-1.5 h-1.5 bg-slate-800 rotate-45 -mt-0.5" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div className="flex items-center justify-between pt-3 border-t border-slate-100">
          <div className="flex items-center gap-1.5 text-slate-400">
            <Clock size={11} />
            <span className="text-[10px] font-medium">
              {updatedAt ? `Vérifié à ${updatedAt}` : 'Jamais vérifié'}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <div className="w-16 h-1 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-400 rounded-full transition-all duration-1000"
                style={{ width: `${countdownPct}%` }}
              />
            </div>
            <span className="text-[10px] font-mono text-slate-400">
              {mins > 0 ? `${mins}m` : ''}
              {String(secs).padStart(2, '0')}s
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};