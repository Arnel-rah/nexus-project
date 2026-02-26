import React, { useMemo } from 'react';
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

  const cleanUrl: string = site.url.replace(/^https?:\/\//, '');

  const getBarColor = (isUp: boolean, latency: number): string => {
    if (!isUp) return '#ef4444';
    if (latency > 500) return '#f59e0b';
    return '#10b981';
  };

  const getUptimeColor = (uptime: number | null): string => {
    if (uptime === null) return '#64748b';
    if (uptime === 100) return '#10b981';
    if (uptime >= 80) return '#f59e0b';
    return '#ef4444';
  };

  const accentColor = isUp ? '#10b981' : '#ef4444';
  const accentRgb = isUp ? '16, 185, 129' : '239, 68, 68';

  return (
    <div
      style={{
        position: 'relative',
        background: 'linear-gradient(145deg, #0f1117 0%, #13161f 100%)',
        borderRadius: '20px',
        border: `1px solid rgba(${accentRgb}, 0.15)`,
        overflow: 'hidden',
        fontFamily: "'DM Sans', 'Inter', sans-serif",
        transition: 'transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease',
        cursor: 'default',
        boxShadow: `0 0 0 0 rgba(${accentRgb}, 0)`,
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget;
        el.style.transform = 'translateY(-3px)';
        el.style.boxShadow = `0 20px 60px -15px rgba(${accentRgb}, 0.25), 0 0 0 1px rgba(${accentRgb}, 0.2)`;
        el.style.borderColor = `rgba(${accentRgb}, 0.35)`;
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget;
        el.style.transform = 'translateY(0)';
        el.style.boxShadow = `0 0 0 0 rgba(${accentRgb}, 0)`;
        el.style.borderColor = `rgba(${accentRgb}, 0.15)`;
      }}
    >
      {/* Ambient glow top-right */}
      <div
        style={{
          position: 'absolute',
          top: -60,
          right: -60,
          width: 180,
          height: 180,
          borderRadius: '50%',
          background: `radial-gradient(circle, rgba(${accentRgb}, 0.12) 0%, transparent 70%)`,
          pointerEvents: 'none',
        }}
      />

      {/* Top accent line */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: '10%',
          right: '10%',
          height: 1,
          background: `linear-gradient(90deg, transparent, rgba(${accentRgb}, 0.6), transparent)`,
        }}
      />

      <div style={{ padding: '24px' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            {/* Icon + pulse */}
            <div style={{ position: 'relative' }}>
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 14,
                  background: `rgba(${accentRgb}, 0.08)`,
                  border: `1px solid rgba(${accentRgb}, 0.2)`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {/* Globe SVG */}
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" strokeWidth="1.5" stroke={accentColor}>
                  <circle cx="12" cy="12" r="10" />
                  <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                </svg>
              </div>
              {isUp && (
                <span
                  style={{
                    position: 'absolute',
                    top: -3,
                    right: -3,
                    width: 10,
                    height: 10,
                    borderRadius: '50%',
                    background: accentColor,
                    boxShadow: `0 0 0 3px rgba(${accentRgb}, 0.3)`,
                  }}
                />
              )}
            </div>

            <div>
              <h3
                style={{
                  margin: 0,
                  fontSize: 15,
                  fontWeight: 700,
                  color: '#f1f5f9',
                  letterSpacing: '-0.3px',
                  lineHeight: 1.2,
                }}
              >
                {site.name}
              </h3>
              <a
                href={site.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 4,
                  marginTop: 4,
                  fontSize: 11,
                  fontWeight: 500,
                  color: '#475569',
                  textDecoration: 'none',
                  transition: 'color 0.2s',
                  maxWidth: 160,
                  overflow: 'hidden',
                  whiteSpace: 'nowrap',
                  textOverflow: 'ellipsis',
                }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = '#818cf8')}
                onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = '#475569')}
              >
                {cleanUrl}
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14 21 3" />
                </svg>
              </a>
            </div>
          </div>

          {/* Status badge */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              padding: '5px 11px',
              borderRadius: 99,
              background: `rgba(${accentRgb}, 0.1)`,
              border: `1px solid rgba(${accentRgb}, 0.25)`,
            }}
          >
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: '50%',
                background: accentColor,
                display: 'block',
                boxShadow: `0 0 6px ${accentColor}`,
              }}
            />
            <span
              style={{
                fontSize: 10,
                fontWeight: 800,
                letterSpacing: '0.08em',
                color: accentColor,
                textTransform: 'uppercase',
              }}
            >
              {isUp ? 'Online' : 'Down'}
            </span>
          </div>
        </div>

        {/* Stats row */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 18 }}>
          {[
            {
              label: 'Latency',
              value: site.latency ?? '---',
              unit: 'ms',
              icon: (
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2">
                  <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                </svg>
              ),
              color: isUp ? '#e2e8f0' : '#ef4444',
            },
            {
              label: 'Uptime',
              value: uptime ?? '---',
              unit: '%',
              icon: (
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2">
                  <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                </svg>
              ),
              color: getUptimeColor(uptime),
            },
          ].map(({ label, value, unit, icon, color }) => (
            <div
              key={label}
              style={{
                borderRadius: 14,
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.06)',
                padding: '12px 14px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 8 }}>
                {icon}
                <span style={{ fontSize: 10, fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  {label}
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 3 }}>
                <span style={{ fontSize: 22, fontWeight: 800, fontFamily: "'DM Mono', monospace", color, lineHeight: 1 }}>
                  {value}
                </span>
                <span style={{ fontSize: 11, color: '#475569', fontWeight: 500 }}>{unit}</span>
              </div>
            </div>
          ))}
        </div>

        {/* History bars */}
        {history.length > 0 && (
          <div style={{ marginBottom: 18 }}>
            <span style={{ fontSize: 10, fontWeight: 700, color: '#334155', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Latency history
            </span>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 2, height: 36, marginTop: 10 }}>
              {history.slice(-24).map((h, i) => {
                const heightPct: number = Math.max((h.latency / maxLatency) * 100, 8);
                const color = getBarColor(h.is_up, h.latency);
                return (
                  <div
                    key={i}
                    title={h.is_up ? `${h.latency}ms` : 'DOWN'}
                    style={{
                      flex: 1,
                      height: `${heightPct}%`,
                      borderRadius: 3,
                      background: color,
                      opacity: 0.7,
                      transition: 'opacity 0.15s, transform 0.15s',
                      cursor: 'default',
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLElement).style.opacity = '1';
                      (e.currentTarget as HTMLElement).style.transform = 'scaleY(1.05)';
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.opacity = '0.7';
                      (e.currentTarget as HTMLElement).style.transform = 'scaleY(1)';
                    }}
                  />
                );
              })}
            </div>
          </div>
        )}

        {/* Footer */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingTop: 14,
            borderTop: '1px solid rgba(255,255,255,0.05)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#334155" strokeWidth="2">
              <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
            </svg>
            <span style={{ fontSize: 10, fontWeight: 500, color: '#334155' }}>
              {updatedAt ? `${updatedAt}` : 'Never checked'}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {/* Countdown bar */}
            <div
              style={{
                width: 52,
                height: 3,
                borderRadius: 99,
                background: 'rgba(255,255,255,0.06)',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  height: '100%',
                  width: `${countdownPct}%`,
                  background: 'linear-gradient(90deg, #6366f1, #818cf8)',
                  borderRadius: 99,
                  transition: 'width 1s linear',
                }}
              />
            </div>
            <span style={{ fontSize: 10, fontFamily: "'DM Mono', monospace", fontWeight: 600, color: '#334155', letterSpacing: '0.04em' }}>
              {mins > 0 ? `${mins}m` : ''}{String(secs).padStart(2, '0')}s
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};