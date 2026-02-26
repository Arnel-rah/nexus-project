import React from 'react';

export type PillColor = 'slate' | 'green' | 'red' | 'yellow';

const pillStyles: Record<PillColor, { bg: string; color: string; border: string }> = {
  slate:  { bg: 'rgba(100,116,139,0.1)', color: '#64748b', border: 'rgba(100,116,139,0.2)' },
  green:  { bg: 'rgba(16,185,129,0.08)', color: '#10b981', border: 'rgba(16,185,129,0.2)'  },
  red:    { bg: 'rgba(239,68,68,0.08)',  color: '#ef4444', border: 'rgba(239,68,68,0.2)'   },
  yellow: { bg: 'rgba(245,158,11,0.08)', color: '#f59e0b', border: 'rgba(245,158,11,0.2)'  },
};

interface StatPillProps {
  label: string;
  value: number | string;
  color: PillColor;
}

const StatPill: React.FC<StatPillProps> = ({ label, value, color }) => {
  const s = pillStyles[color];
  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 7,
        padding: '6px 12px',
        borderRadius: 99,
        background: s.bg,
        border: `1px solid ${s.border}`,
      }}
    >
      <span
        style={{
          fontSize: 13,
          fontWeight: 800,
          fontFamily: "'DM Mono', monospace",
          color: s.color,
          lineHeight: 1,
        }}
      >
        {value}
      </span>
      <span style={{ fontSize: 11, fontWeight: 600, color: s.color, opacity: 0.7 }}>
        {label}
      </span>
    </div>
  );
};

export default StatPill;