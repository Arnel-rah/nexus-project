import React from 'react';
import { motion } from 'framer-motion';

export type PillColor = 'sky' | 'emerald' | 'rose' | 'amber' | 'indigo';

const colorMap: Record<PillColor, { border: string; glow: string; text: string; bg: string }> = {
  sky:     { border: 'border-sky-500/30', glow: 'shadow-sky-500/20', text: 'text-sky-400', bg: 'bg-sky-500/10' },
  emerald: { border: 'border-emerald-500/30', glow: 'shadow-emerald-500/20', text: 'text-emerald-400', bg: 'bg-emerald-500/10' },
  rose:    { border: 'border-rose-500/30', glow: 'shadow-rose-500/20', text: 'text-rose-400', bg: 'bg-rose-500/10' },
  amber:   { border: 'border-amber-500/30', glow: 'shadow-amber-500/20', text: 'text-amber-400', bg: 'bg-amber-500/10' },
  indigo:  { border: 'border-indigo-500/30', glow: 'shadow-indigo-500/20', text: 'text-indigo-400', bg: 'bg-indigo-500/10' },
};

interface StatPillProps {
  label: string;
  value: number | string;
  color: PillColor;
}

const StatPill: React.FC<StatPillProps> = ({ label, value, color }) => {
  const theme = colorMap[color];

  return (
    <motion.div
      whileHover={{ scale: 1.02, backgroundColor: "rgba(255, 255, 255, 0.05)" }}
      className={`
        relative overflow-hidden flex flex-col items-start min-w-30 
        px-4 py-3 rounded-xl border-l-4 border-t border-r border-b 
        ${theme.border} ${theme.bg} backdrop-blur-xl 
        transition-all duration-300 group cursor-pointer shadow-xl
      `}
    >
      <div className={`absolute -right-4 -top-4 w-12 h-12 rounded-full blur-2xl opacity-0 group-hover:opacity-40 transition-opacity duration-500 ${theme.bg}`} />

      <div className="flex items-center gap-2 mb-1">
        <span className="relative flex h-1.5 w-1.5">
          <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${theme.text} bg-current`} />
          <span className={`relative inline-flex rounded-full h-1.5 w-1.5 ${theme.text} bg-current`} />
        </span>
        
        <span className={`text-[9px] font-black uppercase tracking-[0.25em] text-slate-500 group-hover:text-slate-300 transition-colors`}>
          {label}
        </span>
      </div>

      <div className="flex items-baseline gap-1">
        <span className={`font-mono text-2xl font-bold tracking-tighter ${theme.text} drop-shadow-[0_0_8px_rgba(0,0,0,0.5)]`}>
          {value}
        </span>
        <span className="text-[10px] text-slate-600 font-mono">_SYS</span>
      </div>
      <motion.div 
        initial={{ x: "-100%" }}
        animate={{ x: "100%" }}
        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
        className="absolute bottom-0 left-0 h-px w-full bg-linear-to-r from-transparent via-current to-transparent opacity-20"
        style={{ color: theme.text }}
      />
    </motion.div>
  );
};

export default StatPill;