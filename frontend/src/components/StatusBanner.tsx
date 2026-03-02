import React from 'react';
import { Check, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';
import StatPill from './StatPill';

interface StatusBannerProps {
  upCount: number;
  downCount: number;
  total: number;
  uptimePct: number | null;
}

const StatusBanner: React.FC<StatusBannerProps> = ({ upCount, downCount, total, uptimePct }) => {
  const allUp = downCount === 0 && total > 0;
  const accent = allUp ? '#00e5a0' : '#ff4757';
  const accentRgb = allUp ? '0,229,160' : '255,71,87';

  return (
    <motion.div
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      style={{
        position: 'relative',
        marginBottom: 28,
        borderRadius: 16,
        padding: '18px 22px',
        background: `linear-gradient(135deg, rgba(${accentRgb}, 0.06) 0%, rgba(${accentRgb}, 0.02) 100%)`,
        border: `1px solid rgba(${accentRgb}, 0.15)`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap' as const,
        gap: 16,
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 1,
          background: `linear-gradient(90deg, transparent, rgba(${accentRgb}, 0.5), transparent)`,
        }}
      />

      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: 11,
            background: `rgba(${accentRgb}, 0.08)`,
            border: `1px solid rgba(${accentRgb}, 0.2)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: accent,
            flexShrink: 0,
          }}
        >
          {allUp
            ? <Check size={17} strokeWidth={2.5} />
            : <AlertTriangle size={17} strokeWidth={2} />
          }
        </div>

        <div>
          <div
            style={{
              fontSize: 14,
              fontWeight: 800,
              fontFamily: "'Syne', sans-serif",
              color: accent,
              letterSpacing: '-0.2px',
              lineHeight: 1.2,
              textShadow: `0 0 20px rgba(${accentRgb}, 0.3)`,
            }}
          >
            {allUp ? 'All systems operational' : `${downCount} service${downCount > 1 ? 's' : ''} down`}
          </div>
          <div
            style={{
              fontSize: 10,
              fontFamily: "'DM Mono', monospace",
              color: '#64748b',
              marginTop: 4,
              letterSpacing: '0.04em',
            }}
          >
            {upCount} / {total} endpoints online
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' as const }}>
        <StatPill value={total}    label="Total"  color="indigo" />
        <StatPill value={upCount}  label="Online" color="emerald" />
        {downCount > 0 && (
          <StatPill value={downCount} label="Down" color="rose" />
        )}
        {uptimePct !== null && (
          <StatPill
            value={`${uptimePct}%`}
            label="Uptime"
            color={uptimePct === 100 ? 'emerald' : uptimePct >= 80 ? 'amber' : 'rose'}
          />
        )}
      </div>
    </motion.div>
  );
};

export default StatusBanner;