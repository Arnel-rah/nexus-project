import React, { useState } from 'react';
import { Globe, X, Check, AlertTriangle, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';
import Overlay from './Overlay';
import FormField from '../ui/FormField';

export interface SiteFormData {
  name: string;
  url: string;
}

interface SiteModalProps {
  title: string;
  initial?: SiteFormData;
  onClose: () => void;
  onSubmit: (data: SiteFormData) => Promise<void>;
}

const SiteModal: React.FC<SiteModalProps> = ({ title, initial, onClose, onSubmit }) => {
  const [form, setForm] = useState<SiteFormData>(initial ?? { name: '', url: 'https://' });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hovCancel, setHovCancel] = useState(false);

  const set = (key: keyof SiteFormData) => (v: string) =>
    setForm((f) => ({ ...f, [key]: v }));

  const handleSubmit = async () => {
    if (!form.name.trim()) return setError('Name is required.');
    if (!form.url.startsWith('http')) return setError('URL must start with http:// or https://');
    setSaving(true);
    setError(null);
    try {
      await onSubmit(form);
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to save. Please try again.');
      setSaving(false);
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
          maxWidth: 420,
          background: 'linear-gradient(160deg, #0d1017 0%, #080b10 100%)',
          border: '1px solid rgba(99,102,241,0.2)',
          borderRadius: 18,
          overflow: 'hidden',
          boxShadow: '0 32px 80px rgba(0,0,0,0.7), 0 0 0 1px rgba(99,102,241,0.05)',
          position: 'relative',
          fontFamily: "'DM Sans', sans-serif",
        }}
      >
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'linear-gradient(90deg, transparent, rgba(99,102,241,0.6), transparent)' }} />

        {[
          { top: 0, left: 0 }, { top: 0, right: 0 },
          { bottom: 0, left: 0 }, { bottom: 0, right: 0 },
        ].map((pos, i) => (
          <div key={i} style={{ position: 'absolute', ...pos, width: 10, height: 10, pointerEvents: 'none', opacity: 0.4, zIndex: 1 }}>
            <div style={{ position: 'absolute', ...(pos.top === 0 ? { top: 0 } : { bottom: 0 }), ...(pos.left === 0 ? { left: 0 } : { right: 0 }), width: 6, height: 1, background: '#818cf8' }} />
            <div style={{ position: 'absolute', ...(pos.top === 0 ? { top: 0 } : { bottom: 0 }), ...(pos.left === 0 ? { left: 0 } : { right: 0 }), width: 1, height: 6, background: '#818cf8' }} />
          </div>
        ))}

        <div style={{ position: 'absolute', top: -40, right: -40, width: 160, height: 160, borderRadius: '50%', background: 'radial-gradient(circle, rgba(99,102,241,0.07) 0%, transparent 70%)', pointerEvents: 'none' }} />
        
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '20px 22px 18px',
            borderBottom: '1px solid rgba(255,255,255,0.05)',
            position: 'relative',
            zIndex: 1,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1, type: 'spring', stiffness: 300, damping: 20 }}
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                background: 'rgba(99,102,241,0.08)',
                border: '1px solid rgba(99,102,241,0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#818cf8',
              }}
            >
              <Globe size={16} strokeWidth={1.8} />
            </motion.div>
            <span
              style={{
                fontSize: 15,
                fontWeight: 800,
                fontFamily: "'Syne', sans-serif",
                color: '#f1f5f9',
                letterSpacing: '-0.3px',
              }}
            >
              {title}
            </span>
          </div>

          <motion.button
            onClick={onClose}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.92 }}
            style={{
              width: 28,
              height: 28,
              borderRadius: 8,
              border: '1px solid rgba(255,255,255,0.07)',
              background: 'rgba(255,255,255,0.03)',
              color: '#475569',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
            }}
          >
            <X size={13} />
          </motion.button>
        </div>
        <div style={{ padding: '22px 22px 18px', display: 'flex', flexDirection: 'column', gap: 14, position: 'relative', zIndex: 1 }}>
          <FormField
            label="Site Name"
            placeholder="e.g. Production API"
            value={form.name}
            onChange={set('name')}
          />
          <FormField
            label="URL"
            placeholder="https://example.com"
            value={form.url}
            onChange={set('url')}
            type="url"
            mono
          />

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '9px 12px',
                borderRadius: 9,
                background: 'rgba(255,71,87,0.07)',
                border: '1px solid rgba(255,71,87,0.2)',
                color: '#ff4757',
                fontSize: 11,
                fontFamily: "'DM Mono', monospace",
                fontWeight: 500,
                letterSpacing: '0.02em',
              }}
            >
              <AlertTriangle size={12} />
              {error}
            </motion.div>
          )}
        </div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            gap: 8,
            padding: '16px 22px',
            borderTop: '1px solid rgba(255,255,255,0.05)',
            position: 'relative',
            zIndex: 1,
          }}
        >
          <button
            onClick={onClose}
            onMouseEnter={() => setHovCancel(true)}
            onMouseLeave={() => setHovCancel(false)}
            style={{
              padding: '9px 18px',
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
            onClick={handleSubmit}
            disabled={saving}
            whileHover={{ scale: saving ? 1 : 1.03 }}
            whileTap={{ scale: saving ? 1 : 0.97 }}
            style={{
              padding: '9px 20px',
              borderRadius: 10,
              border: 'none',
              background: saving
                ? 'rgba(99,102,241,0.4)'
                : 'linear-gradient(135deg, #6366f1, #818cf8)',
              color: '#fff',
              fontSize: 12,
              fontWeight: 700,
              cursor: saving ? 'not-allowed' : 'pointer',
              fontFamily: "'DM Mono', monospace",
              letterSpacing: '0.04em',
              display: 'flex',
              alignItems: 'center',
              gap: 7,
              boxShadow: saving ? 'none' : '0 4px 20px rgba(99,102,241,0.3)',
              transition: 'background 0.2s, box-shadow 0.2s',
            }}
          >
            {saving
              ? <RefreshCw size={12} style={{ animation: 'spin 0.8s linear infinite' }} />
              : <Check size={12} strokeWidth={2.5} />
            }
            {saving ? 'Saving…' : 'Save'}
          </motion.button>
        </div>
      </motion.div>
    </Overlay>
  );
};

export default SiteModal;