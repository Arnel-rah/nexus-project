import React, { useState } from 'react';

interface NavBtnProps {
  onClick: () => void;
  title: string;
  children: React.ReactNode;
}

const NavBtn: React.FC<NavBtnProps> = ({ onClick, title, children }) => {
  const [hov, setHov] = useState(false);

  return (
    <button
      onClick={onClick}
      title={title}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        width: 34,
        height: 34,
        borderRadius: 9,
        border: `1px solid ${hov ? 'rgba(99,102,241,0.3)' : 'rgba(255,255,255,0.08)'}`,
        background: hov ? 'rgba(99,102,241,0.12)' : 'rgba(255,255,255,0.04)',
        color: hov ? '#818cf8' : '#475569',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        transition: 'all 0.2s',
      }}
    >
      {children}
    </button>
  );
};

export default NavBtn;