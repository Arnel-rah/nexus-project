import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface ActionBtnProps {
  icon: React.ReactNode;
  onClick: () => void;
  color: 'indigo' | 'red';
  title: string;
}

const ActionBtn: React.FC<ActionBtnProps> = ({ icon, onClick, color, title }) => {
  const [hov, setHov] = useState(false);
  const rgb = color === 'indigo' ? '99,102,241' : '255,71,87';
  const hex = color === 'indigo' ? '#818cf8' : '#ff4757';

  return (
    <motion.button
      title={title}
      onClick={(e) => { e.stopPropagation(); onClick(); }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.92 }}
      style={{
        width: 28,
        height: 28,
        borderRadius: 8,
        border: `1px solid rgba(${rgb}, ${hov ? 0.45 : 0.2})`,
        background: hov ? `rgba(${rgb}, 0.15)` : 'rgba(8,11,16,0.9)',
        color: hov ? hex : `rgba(${rgb}, 0.45)`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        boxShadow: hov ? `0 0 14px rgba(${rgb}, 0.2)` : 'none',
        transition: 'border-color 0.15s, background 0.15s, color 0.15s, box-shadow 0.15s',
      }}
    >
      {icon}
    </motion.button>
  );
};

export default ActionBtn;