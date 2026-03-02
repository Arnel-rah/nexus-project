import React from 'react';
import { motion } from 'framer-motion';

export type PillColor = 'sky' | 'emerald' | 'rose' | 'amber' | 'indigo';

const colorMap: Record<PillColor, { hex: string; dim: string; rgb: string }> = {
  sky:     { hex: '#38bdf8', dim: '#0ea5e920', rgb: '56,189,248'   },
  emerald: { hex: '#34d399', dim: '#10b98120', rgb: '52,211,153'   },
  rose:    { hex: '#fb7185', dim: '#f43f5e20', rgb: '251,113,133'  },
  amber:   { hex: '#fbbf24', dim: '#f59e0b20', rgb: '251,191,36'   },
  indigo:  { hex: '#818cf8', dim: '#6366f120', rgb: '129,140,248'  },
};

interface StatPillProps {
  label: string;
  value: number | string;
  color?: PillColor;
}

const StatPill: React.FC<StatPillProps> = ({ label, value, color = 'sky' }) => {
  const c = colorMap[color] ?? colorMap.sky;

  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      whileHover={{ x: 3 }}
      transition={{ type: 'spring', stiffness: 300, damping: 24 }}
      style={{
        position: 'relative',
        display: 'inline-flex',
        alignItems: 'stretch',
        gap: 0,
        minWidth: 148,
        cursor: 'default',
        userSelect: 'none',
      }}
    >
      <div
        style={{
          width: 4,
          borderRadius: '4px 0 0 4px',
          background: `rgba(${c.rgb}, 0.15)`,
          position: 'relative',
          overflow: 'hidden',
          flexShrink: 0,
        }}
      >
        <motion.div
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '100%',
            background: c.hex,
            transformOrigin: 'bottom',
            boxShadow: `0 0 8px ${c.hex}`,
          }}
        />
        {[0.25, 0.5, 0.75].map((pos) => (
          <div
            key={pos}
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              bottom: `${pos * 100}%`,
              height: 1,
              background: 'rgba(0,0,0,0.4)',
              zIndex: 2,
            }}
          />
        ))}
      </div>

      <div
        style={{
          flex: 1,
          padding: '10px 14px 10px 12px',
          background: `linear-gradient(120deg, ${c.dim}, rgba(0,0,0,0) 60%)`,
          border: `1px solid rgba(${c.rgb}, 0.12)`,
          borderLeft: 'none',
          borderRadius: '0 10px 10px 0',
          backdropFilter: 'blur(12px)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <svg
          width="32"
          height="32"
          viewBox="0 0 32 32"
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            opacity: 0.06,
            pointerEvents: 'none',
          }}
        >
          {[0, 6, 12, 18, 24, 30].map((x) => (
            <line key={x} x1={x} y1="0" x2="32" y2={32 - x} stroke={c.hex} strokeWidth="1.5" />
          ))}
        </svg>
        <div
          style={{
            fontSize: 8,
            fontFamily: "'DM Mono', monospace",
            fontWeight: 700,
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: 'rgba(148,163,184,0.5)',
            marginBottom: 5,
            lineHeight: 1,
          }}
        >
          {label}
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 1 }}>
          <motion.span
            key={String(value)}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            style={{
              fontSize: 26,
              fontFamily: "'DM Mono', monospace",
              fontWeight: 600,
              letterSpacing: '-1px',
              color: c.hex,
              lineHeight: 1,
              textShadow: `0 0 20px rgba(${c.rgb}, 0.4)`,
            }}
          >
            {value}
          </motion.span>
        </div>
      </div>
    </motion.div>
  );
};

export default StatPill;