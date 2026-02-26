import React, { useState } from 'react';
import { Globe, X, Check, AlertTriangle, RefreshCw } from 'lucide-react';
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
    } catch {
      setError('Failed to save. Please try again.');
      setSaving(false);
    }
  };

  return (
    <Overlay onClose={onClose}>
      <div
        style={{
          width: '100%',
          maxWidth: 440,
          background: 'linear-gradient(145deg, #0f1117, #13161f)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: 20,
          overflow: 'hidden',
          boxShadow: '0 32px 80px rgba(0,0,0,0.6)',
          animation: 'fadeUp 0.25s ease both',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '20px 24px',
            borderBottom: '1px solid rgba(255,255,255,0.06)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: 9,
                background: 'rgba(99,102,241,0.12)',
                border: '1px solid rgba(99,102,241,0.25)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#818cf8',
              }}
            >
              <Globe size={15} strokeWidth={1.8} />
            </div>
            <span style={{ fontSize: 15, fontWeight: 700, color: '#f1f5f9', letterSpacing: '-0.3px' }}>
              {title}
            </span>
          </div>
          <button
            onClick={onClose}
            style={{
              width: 30,
              height: 30,
              borderRadius: 8,
              border: '1px solid rgba(255,255,255,0.08)',
              background: 'rgba(255,255,255,0.04)',
              color: '#475569',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
            }}
          >
            <X size={14} />
          </button>
        </div>

        <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
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
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '10px 12px',
                borderRadius: 10,
                background: 'rgba(239,68,68,0.08)',
                border: '1px solid rgba(239,68,68,0.2)',
                color: '#ef4444',
                fontSize: 12,
                fontWeight: 500,
              }}
            >
              <AlertTriangle size={13} />
              {error}
            </div>
          )}
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            gap: 10,
            padding: '16px 24px',
            borderTop: '1px solid rgba(255,255,255,0.06)',
          }}
        >
          <button
            onClick={onClose}
            style={{
              padding: '9px 18px',
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
            onClick={handleSubmit}
            disabled={saving}
            style={{
              padding: '9px 20px',
              borderRadius: 10,
              border: 'none',
              background: saving
                ? 'rgba(99,102,241,0.5)'
                : 'linear-gradient(135deg, #6366f1, #818cf8)',
              color: '#fff',
              fontSize: 13,
              fontWeight: 700,
              cursor: saving ? 'not-allowed' : 'pointer',
              fontFamily: "'DM Sans', sans-serif",
              display: 'flex',
              alignItems: 'center',
              gap: 7,
              boxShadow: '0 4px 14px rgba(99,102,241,0.3)',
            }}
          >
            {saving
              ? <RefreshCw size={13} style={{ animation: 'spin 0.8s linear infinite' }} />
              : <Check size={13} />
            }
            {saving ? 'Saving…' : 'Save'}
          </button>
        </div>
      </div>
    </Overlay>
  );
};

export default SiteModal;