import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface NavBtnProps {
  onClick: () => void;
  title: string;
  children: React.ReactNode;
}

const NavBtn: React.FC<NavBtnProps> = ({ onClick, title, children }) => {
  const [hov, setHov] = useState(false);

  return (
    <motion.button
      onClick={onClick}
      title={title}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.93 }}
      style={{
        width: 32,
        height: 32,
        borderRadius: 9,
        border: `1px solid ${hov ? 'rgba(99,102,241,0.35)' : 'rgba(255,255,255,0.07)'}`,
        background: hov ? 'rgba(99,102,241,0.1)' : 'rgba(255,255,255,0.03)',
        color: hov ? '#818cf8' : '#475569',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        boxShadow: hov ? '0 0 14px rgba(99,102,241,0.2)' : 'none',
        transition: 'border-color 0.15s, background 0.15s, color 0.15s, box-shadow 0.15s',
      }}
    >
      {children}
    </motion.button>
  );
};

export default NavBtn;