import React, { useState } from 'react';
import { Plus } from 'lucide-react';

interface AddSiteBtnProps {
  onClick: () => void;
}

const AddSiteBtn: React.FC<AddSiteBtnProps> = ({ onClick }) => {
  const [hov, setHov] = useState(false);

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 7,
        padding: '7px 14px',
        borderRadius: 9,
        border: `1px solid ${hov ? 'rgba(99,102,241,0.5)' : 'rgba(99,102,241,0.3)'}`,
        background: hov ? 'rgba(99,102,241,0.22)' : 'rgba(99,102,241,0.12)',
        color: '#818cf8',
        fontSize: 12,
        fontWeight: 700,
        cursor: 'pointer',
        fontFamily: "'DM Sans', sans-serif",
        transition: 'all 0.2s',
      }}
    >
      <Plus size={14} />
      Add site
    </button>
  );
};

export default AddSiteBtn;