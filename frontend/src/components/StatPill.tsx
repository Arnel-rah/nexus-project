import React from 'react';
import { motion } from 'framer-motion';

export type PillColor = 'sky' | 'emerald' | 'rose' | 'amber' | 'indigo';

const colorMap: Record<PillColor, string> = {
  sky:     'text-sky-400 border-sky-500/20 bg-sky-500/5 shadow-sky-500/10',
  emerald: 'text-emerald-400 border-emerald-500/20 bg-emerald-500/5 shadow-emerald-500/10',
  rose:    'text-rose-400 border-rose-500/20 bg-rose-500/5 shadow-rose-500/10',
  amber:   'text-amber-400 border-amber-500/20 bg-amber-500/5 shadow-amber-500/10',
  indigo:  'text-indigo-400 border-indigo-500/20 bg-indigo-500/5 shadow-indigo-500/10',
};

interface StatPillProps {
  label: string;
  value: number | string;
  color: PillColor;
}

const StatPill: React.FC<StatPillProps> = ({ label, value, color }) => {
  const colorStyle = colorMap[color];

  return (
    <motion.div
      whileHover={{ scale: 1.05, y: -2 }}
      className={`
        inline-flex items-center gap-2.5 px-3 py-1.5 rounded-full border 
        backdrop-blur-md transition-all duration-300 cursor-default
        ${colorStyle} shadow-lg
      `}
    >
      {/* Indicateur d'état (Dot) */}
      <span className="relative flex h-2 w-2">
        <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 bg-current`} />
        <span className={`relative inline-flex rounded-full h-2 w-2 bg-current`} />
      </span>

      {/* Valeur numérique */}
      <span className="font-mono text-sm font-black tracking-tighter leading-none">
        {value}
      </span>

      {/* Séparateur subtil */}
      <span className="w-[1px] h-3 bg-current opacity-20" />

      {/* Label */}
      <span className="text-[10px] font-bold uppercase tracking-[0.15em] opacity-60 leading-none">
        {label}
      </span>
    </motion.div>
  );
};

export default StatPill;