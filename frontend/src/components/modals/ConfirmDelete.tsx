import React, { useState } from 'react';
import { Trash2, RefreshCw, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';
import Overlay from './Overlay';
import type { Site } from '../../types/site';

interface ConfirmDeleteProps {
  site: Site;
  onClose: () => void;
  onConfirm: () => Promise<void>;
}

const ConfirmDelete: React.FC<ConfirmDeleteProps> = ({ site, onClose, onConfirm }) => {
  const [deleting, setDeleting] = useState(false);
  const [hovCancel, setHovCancel] = useState(false);
  const [hovDelete, setHovDelete] = useState(false);

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
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 8 }}
        transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
        style={{
          width: '100%',
          maxWidth: 360,
          background: 'linear-gradient(160deg, #0d1017 0%, #080b10 100%)',
          border: '1px solid rgba(255,71,87,0.2)',
          borderRadius: 18,
          padding: 28,
          boxShadow: '0 32px 80px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,71,87,0.05)',
          textAlign: 'center' as const,
          position: 'relative',
          overflow: 'hidden',
          fontFamily: "'DM Sans', sans-serif",
        }}
      >
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'linear-gradient(90deg, transparent, rgba(255,71,87,0.5), transparent)' }} />

        {[
          { top: 0, left: 0 }, { top: 0, right: 0 },
          { bottom: 0, left: 0 }, { bottom: 0, right: 0 },
        ].map((pos, i) => (
          <div key={i} style={{ position: 'absolute', ...pos, width: 10, height: 10, pointerEvents: 'none', opacity: 0.4 }}>
            <div style={{ position: 'absolute', ...(pos.top === 0 ? { top: 0 } : { bottom: 0 }), ...(pos.left === 0 ? { left: 0 } : { right: 0 }), width: 6, height: 1, background: '#ff4757' }} />
            <div style={{ position: 'absolute', ...(pos.top === 0 ? { top: 0 } : { bottom: 0 }), ...(pos.left === 0 ? { left: 0 } : { right: 0 }), width: 1, height: 6, background: '#ff4757' }} />
          </div>
        ))}

        <div style={{ position: 'absolute', top: -40, right: -40, width: 140, height: 140, borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,71,87,0.08) 0%, transparent 70%)', pointerEvents: 'none' }} />

        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1, type: 'spring', stiffness: 300, damping: 20 }}
          style={{
            width: 52,
            height: 52,
            borderRadius: 14,
            background: 'rgba(255,71,87,0.08)',
            border: '1px solid rgba(255,71,87,0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 20px',
            color: '#ff4757',
            position: 'relative',
          }}
        >
          <AlertTriangle size={22} strokeWidth={1.8} />
          <div style={{ position: 'absolute', inset: -6, borderRadius: 18, background: 'rgba(255,71,87,0.04)', border: '1px solid rgba(255,71,87,0.06)' }} />
        </motion.div>

        <div style={{ fontSize: 16, fontWeight: 800, fontFamily: "'Syne', sans-serif", color: '#f1f5f9', marginBottom: 10, letterSpacing: '-0.3px' }}>
          Delete endpoint?
        </div>

        <div style={{ fontSize: 12, color: '#64748b', lineHeight: 1.7, marginBottom: 8 }}>
          <span
            style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: 11,
              color: '#ff4757',
              background: 'rgba(255,71,87,0.08)',
              border: '1px solid rgba(255,71,87,0.15)',
              borderRadius: 6,
              padding: '2px 8px',
            }}
          >
            {site.name}
          </span>
        </div>

        <div style={{ fontSize: 11, fontFamily: "'DM Mono', monospace", color: '#475569', marginBottom: 26, letterSpacing: '0.02em' }}>
          This action is permanent and cannot be undone.
        </div>

        <div style={{ display: 'flex', gap: 8 }}>
          <button
            onClick={onClose}
            onMouseEnter={() => setHovCancel(true)}
            onMouseLeave={() => setHovCancel(false)}
            style={{
              flex: 1,
              padding: '10px',
              borderRadius: 10,
              border: `1px solid rgba(255,255,255,${hovCancel ? 0.1 : 0.06})`,
              background: hovCancel ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.02)',
              color: hovCancel ? '#94a3b8' : '#64748b',
              fontSize: 12,
              fontWeight: 600,
              cursor: 'pointer',
              fontFamily: "'DM Mono', monospace",
              letterSpacing: '0.04em',
              transition: 'all 0.15s',
            }}
          >
            Cancel
          </button>

          <motion.button
            onClick={handle}
            disabled={deleting}
            onMouseEnter={() => setHovDelete(true)}
            onMouseLeave={() => setHovDelete(false)}
            whileHover={{ scale: deleting ? 1 : 1.02 }}
            whileTap={{ scale: deleting ? 1 : 0.97 }}
            style={{
              flex: 1,
              padding: '10px',
              borderRadius: 10,
              border: `1px solid rgba(255,71,87,${hovDelete ? 0.45 : 0.25})`,
              background: hovDelete ? 'rgba(255,71,87,0.18)' : 'rgba(255,71,87,0.1)',
              color: '#ff4757',
              fontSize: 12,
              fontWeight: 700,
              cursor: deleting ? 'not-allowed' : 'pointer',
              fontFamily: "'DM Mono', monospace",
              letterSpacing: '0.04em',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 7,
              boxShadow: hovDelete ? '0 0 20px rgba(255,71,87,0.15)' : 'none',
              transition: 'border-color 0.15s, background 0.15s, box-shadow 0.15s',
            }}
          >
            {deleting
              ? <RefreshCw size={12} style={{ animation: 'spin 0.8s linear infinite' }} />
              : <Trash2 size={12} strokeWidth={2} />
            }
            {deleting ? 'Deleting…' : 'Delete'}
          </motion.button>
        </div>
      </motion.div>
    </Overlay>
  );
};

export default ConfirmDelete;