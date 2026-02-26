import React, { useState } from 'react';

interface ActionBtnProps {
  icon: React.ReactNode;
  onClick: () => void;
  color: 'indigo' | 'red';
  title: string;
}

const ActionBtn: React.FC<ActionBtnProps> = ({ icon, onClick, color, title }) => {
  const [hov, setHov] = useState(false);
  const rgb = color === 'indigo' ? '99,102,241' : '239,68,68';
  const textColor = color === 'indigo' ? '#818cf8' : '#ef4444';

  return (
    <button
      title={title}
      onClick={(e) => { e.stopPropagation(); onClick(); }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        width: 28,
        height: 28,
        borderRadius: 8,
        border: `1px solid rgba(${rgb}, ${hov ? 0.4 : 0.2})`,
        background: `rgba(${rgb}, ${hov ? 0.18 : 0.1})`,
        color: textColor,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        transition: 'all 0.15s',
        backdropFilter: 'blur(8px)',
      }}
    >
      {icon}
    </button>
  );
};

export default ActionBtn;