import React, { useState } from 'react';
import { Trash2, RefreshCw } from 'lucide-react';
import Overlay from './Overlay';
import type { Site } from '../../types/site';

interface ConfirmDeleteProps {
  site: Site;
  onClose: () => void;
  onConfirm: () => Promise<void>;
}

const ConfirmDelete: React.FC<ConfirmDeleteProps> = ({ site, onClose, onConfirm }) => {
  const [deleting, setDeleting] = useState(false);

  const handle = async () => {
    setDeleting(true);
    try {
      await onConfirm();
      onClose();
    } finally {
      setDeleting(false);
    }
  };

  return (
    <Overlay onClose={onClose}>
      <div
        style={{
          width: '100%',
          maxWidth: 380,
          background: 'linear-gradient(145deg, #0f1117, #13161f)',
          border: '1px solid rgba(239,68,68,0.2)',
          borderRadius: 20,
          padding: 28,
          boxShadow: '0 32px 80px rgba(0,0,0,0.6)',
          animation: 'fadeUp 0.25s ease both',
          textAlign: 'center' as const,
        }}
      >
        <div
          style={{
            width: 52,
            height: 52,
            borderRadius: 16,
            background: 'rgba(239,68,68,0.1)',
            border: '1px solid rgba(239,68,68,0.25)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 18px',
            color: '#ef4444',
          }}
        >
          <Trash2 size={22} strokeWidth={1.8} />
        </div>

        <div style={{ fontSize: 16, fontWeight: 800, color: '#f1f5f9', marginBottom: 8 }}>
          Delete site?
        </div>
        <div style={{ fontSize: 13, color: '#475569', lineHeight: 1.6, marginBottom: 24 }}>
          <span style={{ color: '#94a3b8', fontWeight: 600 }}>{site.name}</span> will be
          permanently removed. This cannot be undone.
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          <button
            onClick={onClose}
            style={{
              flex: 1,
              padding: '10px',
              borderRadius: 10,
              border: '1px solid rgba(255,255,255,0.08)',
              background: 'rgba(255,255,255,0.04)',
              color: '#64748b',
              fontSize: 13,
              fontWeight: 600,
              cursor: 'pointer',
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            Cancel
          </button>
          <button
            onClick={handle}
            disabled={deleting}
            style={{
              flex: 1,
              padding: '10px',
              borderRadius: 10,
              border: '1px solid rgba(239,68,68,0.3)',
              background: 'rgba(239,68,68,0.12)',
              color: '#ef4444',
              fontSize: 13,
              fontWeight: 700,
              cursor: deleting ? 'not-allowed' : 'pointer',
              fontFamily: "'DM Sans', sans-serif",
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 7,
            }}
          >
            {deleting
              ? <RefreshCw size={13} style={{ animation: 'spin 0.8s linear infinite' }} />
              : <Trash2 size={13} />
            }
            {deleting ? 'Deleting…' : 'Delete'}
          </button>
        </div>
      </div>
    </Overlay>
  );
};

export default ConfirmDelete;