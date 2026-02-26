import React, { useEffect, useState, useCallback } from 'react';
import {
  ShieldCheck,
  RefreshCw,
  Plus,
  Trash2,
  Pencil,
  X,
  Globe,
  Check,
  AlertTriangle,
} from 'lucide-react';
import { SiteCard } from './components/SiteCard';
import type { Site } from './types/site';

type Modal =
  | { type: 'add' }
  | { type: 'edit'; site: Site }
  | { type: 'delete'; site: Site }
  | null;

interface SiteFormData {
  name: string;
  url: string;
}


const NavBtn: React.FC<{ onClick: () => void; title: string; children: React.ReactNode }> = ({
  onClick,
  title,
  children,
}) => {
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


const ActionBtn: React.FC<{
  icon: React.ReactNode;
  onClick: () => void;
  color: 'indigo' | 'red';
  title: string;
}> = ({ icon, onClick, color, title }) => {
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

const FormField: React.FC<{
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  mono?: boolean;
  type?: string;
}> = ({ label, value, onChange, placeholder, mono, type = 'text' }) => (
  <div>
    <label
      style={{
        display: 'block',
        fontSize: 11,
        fontWeight: 700,
        color: '#475569',
        textTransform: 'uppercase' as const,
        letterSpacing: '0.07em',
        marginBottom: 8,
      }}
    >
      {label}
    </label>
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      style={{
        width: '100%',
        padding: '10px 14px',
        borderRadius: 11,
        border: '1px solid rgba(255,255,255,0.08)',
        background: 'rgba(255,255,255,0.04)',
        color: '#f1f5f9',
        fontSize: 13,
        fontFamily: mono ? "'DM Mono', monospace" : "'DM Sans', sans-serif",
        outline: 'none',
        transition: 'border-color 0.2s',
      }}
      onFocus={(e) => (e.target.style.borderColor = 'rgba(99,102,241,0.5)')}
      onBlur={(e) => (e.target.style.borderColor = 'rgba(255,255,255,0.08)')}
    />
  </div>
);


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
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 24px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 32, height: 32, borderRadius: 9, background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#818cf8' }}>
              <Globe size={15} strokeWidth={1.8} />
            </div>
            <span style={{ fontSize: 15, fontWeight: 700, color: '#f1f5f9', letterSpacing: '-0.3px' }}>{title}</span>
          </div>
          <button
            onClick={onClose}
            style={{ width: 30, height: 30, borderRadius: 8, border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.04)', color: '#475569', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
          >
            <X size={14} />
          </button>
        </div>
        <div style={{ padding: 24, display: 'flex', flexDirection: 'column' as const, gap: 16 }}>
          <FormField label="Site Name" placeholder="e.g. Production API" value={form.name} onChange={set('name')} />
          <FormField label="URL" placeholder="https://example.com" value={form.url} onChange={set('url')} type="url" mono />
          {error && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 12px', borderRadius: 10, background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', color: '#ef4444', fontSize: 12, fontWeight: 500 }}>
              <AlertTriangle size={13} />
              {error}
            </div>
          )}
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, padding: '16px 24px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <button
            onClick={onClose}
            style={{ padding: '9px 18px', borderRadius: 10, border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.04)', color: '#64748b', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={saving}
            style={{ padding: '9px 20px', borderRadius: 10, border: 'none', background: saving ? 'rgba(99,102,241,0.5)' : 'linear-gradient(135deg, #6366f1, #818cf8)', color: '#fff', fontSize: 13, fontWeight: 700, cursor: saving ? 'not-allowed' : 'pointer', fontFamily: "'DM Sans', sans-serif", display: 'flex', alignItems: 'center', gap: 7, boxShadow: '0 4px 14px rgba(99,102,241,0.3)' }}
          >
            {saving ? <RefreshCw size={13} style={{ animation: 'spin 0.8s linear infinite' }} /> : <Check size={13} />}
            {saving ? 'Saving…' : 'Save'}
          </button>
        </div>
      </div>
    </Overlay>
  );
};


const ConfirmDelete: React.FC<{ site: Site; onClose: () => void; onConfirm: () => Promise<void> }> = ({
  site,
  onClose,
  onConfirm,
}) => {
  const [deleting, setDeleting] = useState(false);

  const handle = async () => {
    setDeleting(true);
    try { await onConfirm(); onClose(); } finally { setDeleting(false); }
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
        <div style={{ width: 52, height: 52, borderRadius: 16, background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 18px', color: '#ef4444' }}>
          <Trash2 size={22} strokeWidth={1.8} />
        </div>
        <div style={{ fontSize: 16, fontWeight: 800, color: '#f1f5f9', marginBottom: 8 }}>Delete site?</div>
        <div style={{ fontSize: 13, color: '#475569', lineHeight: 1.6, marginBottom: 24 }}>
          <span style={{ color: '#94a3b8', fontWeight: 600 }}>{site.name}</span> will be permanently removed. This cannot be undone.
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={onClose} style={{ flex: 1, padding: '10px', borderRadius: 10, border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.04)', color: '#64748b', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}>
            Cancel
          </button>
          <button
            onClick={handle}
            disabled={deleting}
            style={{ flex: 1, padding: '10px', borderRadius: 10, border: '1px solid rgba(239,68,68,0.3)', background: 'rgba(239,68,68,0.12)', color: '#ef4444', fontSize: 13, fontWeight: 700, cursor: deleting ? 'not-allowed' : 'pointer', fontFamily: "'DM Sans', sans-serif", display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7 }}
          >
            {deleting ? <RefreshCw size={13} style={{ animation: 'spin 0.8s linear infinite' }} /> : <Trash2 size={13} />}
            {deleting ? 'Deleting…' : 'Delete'}
          </button>
        </div>
      </div>
    </Overlay>
  );
};

const Overlay: React.FC<{ onClose: () => void; children: React.ReactNode }> = ({ onClose, children }) => (
  <div
    onClick={onClose}
    style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: 24 }}
  >
    <div onClick={(e) => e.stopPropagation()}>{children}</div>
  </div>
);

const SiteCardWrapper: React.FC<{
  site: Site;
  nextScanIn: number;
  onEdit: (s: Site) => void;
  onDelete: (s: Site) => void;
  animDelay: number;
}> = ({ site, nextScanIn, onEdit, onDelete, animDelay }) => {
  const [visible, setVisible] = useState(false);

  return (
    <div
      className="card-appear"
      style={{ animationDelay: `${animDelay}ms`, position: 'relative' }}
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
    >
      <SiteCard site={site} nextScanIn={nextScanIn} />
      <div
        style={{
          position: 'absolute',
          top: 12,
          right: 12,
          display: 'flex',
          gap: 6,
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0)' : 'translateY(-4px)',
          transition: 'opacity 0.2s, transform 0.2s',
          pointerEvents: visible ? 'auto' : 'none',
          zIndex: 20,
        }}
      >
        <ActionBtn icon={<Pencil size={12} />} onClick={() => onEdit(site)} color="indigo" title="Edit site" />
        <ActionBtn icon={<Trash2 size={12} />} onClick={() => onDelete(site)} color="red" title="Delete site" />
      </div>
    </div>
  );
};


type PillColor = 'slate' | 'green' | 'red' | 'yellow';

const pillStyles: Record<PillColor, { bg: string; color: string; border: string }> = {
  slate:  { bg: 'rgba(100,116,139,0.1)', color: '#64748b', border: 'rgba(100,116,139,0.2)' },
  green:  { bg: 'rgba(16,185,129,0.08)', color: '#10b981', border: 'rgba(16,185,129,0.2)'  },
  red:    { bg: 'rgba(239,68,68,0.08)',  color: '#ef4444', border: 'rgba(239,68,68,0.2)'   },
  yellow: { bg: 'rgba(245,158,11,0.08)', color: '#f59e0b', border: 'rgba(245,158,11,0.2)'  },
};

const StatPill: React.FC<{ label: string; value: number | string; color: PillColor }> = ({ label, value, color }) => {
  const s = pillStyles[color];
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '6px 12px', borderRadius: 99, background: s.bg, border: `1px solid ${s.border}` }}>
      <span style={{ fontSize: 13, fontWeight: 800, fontFamily: "'DM Mono', monospace", color: s.color, lineHeight: 1 }}>{value}</span>
      <span style={{ fontSize: 11, fontWeight: 600, color: s.color, opacity: 0.7 }}>{label}</span>
    </div>
  );
};

const App: React.FC = () => {
  const [sites, setSites] = useState<Site[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [nextScanIn, setNextScanIn] = useState(60);
  const [modal, setModal] = useState<Modal>(null);

  const fetchData = useCallback(async () => {
    setRefreshing(true);
    try {
      const res = await fetch('http://localhost:8080/api/sites');
      const data: Site[] = await res.json();
      setSites(data);
      setLastUpdated(new Date());
      setNextScanIn(60);
    } catch (err) {
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    const poll = setInterval(fetchData, 60_000);
    return () => clearInterval(poll);
  }, [fetchData]);

  useEffect(() => {
    const t = setInterval(() => setNextScanIn((s) => (s <= 0 ? 0 : s - 1)), 1000);
    return () => clearInterval(t);
  }, []);

  const handleAdd = async (data: SiteFormData) => {
    await fetch('http://localhost:8080/api/sites', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    await fetchData();
  };

  const handleEdit = async (data: SiteFormData) => {
    if (modal?.type !== 'edit') return;
    await fetch(`http://localhost:8080/api/sites/${modal.site.ID}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    await fetchData();
  };

  const handleDelete = async () => {
    if (modal?.type !== 'delete') return;
    await fetch(`http://localhost:8080/api/sites/${modal.site.ID}`, { method: 'DELETE' });
    await fetchData();
  };

  const upCount = sites.filter((s) => s.is_up).length;
  const downCount = sites.length - upCount;
  const uptimePct = sites.length > 0 ? Math.round((upCount / sites.length) * 100) : null;
  const allUp = downCount === 0 && sites.length > 0;

  return (
    <div style={{ minHeight: '100vh', background: '#080b11', fontFamily: "'DM Sans', 'Helvetica Neue', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700;800&family=DM+Mono:wght@500;600&display=swap');
        * { box-sizing: border-box; }
        body { margin: 0; background: #080b11; }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes ping {
          0%, 100% { transform: scale(1); opacity: 0.75; }
          50% { transform: scale(1.8); opacity: 0; }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .card-appear { animation: fadeUp 0.4s ease both; }
        input::placeholder { color: #334155; }
      `}</style>

      <header style={{ position: 'sticky', top: 0, zIndex: 50, background: 'rgba(8,11,17,0.85)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px', height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg, #6366f1, #818cf8)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', boxShadow: '0 4px 16px rgba(99,102,241,0.35)' }}>
              <ShieldCheck size={18} strokeWidth={1.8} />
            </div>
            <div>
              <div style={{ fontSize: 16, fontWeight: 800, color: '#f1f5f9', letterSpacing: '-0.4px', lineHeight: 1 }}>
                NEXUS<span style={{ color: '#6366f1' }}>.</span>
              </div>
              <div style={{ fontSize: 9, fontWeight: 700, color: '#334155', textTransform: 'uppercase', letterSpacing: '0.12em', marginTop: 2 }}>Monitoring</div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {lastUpdated && (
              <span style={{ fontSize: 11, color: '#334155', fontWeight: 500, display: 'flex', alignItems: 'center', gap: 5 }}>
                Updated{' '}
                <span style={{ fontFamily: "'DM Mono', monospace", color: '#475569', fontWeight: 600 }}>
                  {lastUpdated.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                </span>
              </span>
            )}

            <NavBtn onClick={fetchData} title="Refresh now">
              <RefreshCw size={14} style={{ animation: refreshing ? 'spin 0.8s linear infinite' : 'none' }} />
            </NavBtn>

            <AddSiteBtn onClick={() => setModal({ type: 'add' })} />
            <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
              <div style={{ position: 'relative', width: 8, height: 8 }}>
                <span style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: '#10b981', animation: 'ping 1.5s ease-in-out infinite', opacity: 0.6 }} />
                <span style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: '#10b981', boxShadow: '0 0 6px #10b981' }} />
              </div>
              <span style={{ fontSize: 10, fontWeight: 800, color: '#334155', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Live</span>
            </div>
          </div>
        </div>
      </header>
      <main style={{ maxWidth: 1100, margin: '0 auto', padding: '40px 24px' }}>
        {!loading && sites.length > 0 && (
          <div
            className="card-appear"
            style={{
              marginBottom: 32,
              borderRadius: 18,
              padding: '20px 24px',
              background: allUp
                ? 'linear-gradient(135deg, rgba(16,185,129,0.08), rgba(16,185,129,0.04))'
                : 'linear-gradient(135deg, rgba(239,68,68,0.08), rgba(239,68,68,0.04))',
              border: `1px solid ${allUp ? 'rgba(16,185,129,0.2)' : 'rgba(239,68,68,0.2)'}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap' as const,
              gap: 16,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{ width: 42, height: 42, borderRadius: 12, background: allUp ? 'rgba(16,185,129,0.12)' : 'rgba(239,68,68,0.12)', border: `1px solid ${allUp ? 'rgba(16,185,129,0.25)' : 'rgba(239,68,68,0.25)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: allUp ? '#10b981' : '#ef4444' }}>
                {allUp ? <Check size={18} strokeWidth={2.5} /> : <AlertTriangle size={18} strokeWidth={2} />}
              </div>
              <div>
                <div style={{ fontSize: 15, fontWeight: 800, color: allUp ? '#10b981' : '#ef4444', letterSpacing: '-0.3px' }}>
                  {allUp ? 'All systems operational' : `${downCount} service${downCount > 1 ? 's' : ''} down`}
                </div>
                <div style={{ fontSize: 12, color: '#475569', marginTop: 2 }}>{upCount} of {sites.length} services running</div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' as const }}>
              <StatPill value={sites.length} label="Total" color="slate" />
              <StatPill value={upCount} label="Online" color="green" />
              {downCount > 0 && <StatPill value={downCount} label="Down" color="red" />}
              {uptimePct !== null && (
                <StatPill value={`${uptimePct}%`} label="Uptime" color={uptimePct === 100 ? 'green' : uptimePct >= 80 ? 'yellow' : 'red'} />
              )}
            </div>
          </div>
        )}
        {loading && sites.length === 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column' as const, alignItems: 'center', justifyContent: 'center', padding: '120px 0', gap: 16 }}>
            <div style={{ width: 40, height: 40, borderRadius: '50%', border: '3px solid rgba(99,102,241,0.15)', borderTopColor: '#6366f1', animation: 'spin 0.8s linear infinite' }} />
            <p style={{ fontSize: 13, color: '#334155', fontWeight: 500, margin: 0 }}>Connecting to Nexus backend…</p>
          </div>
        ) : sites.length === 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column' as const, alignItems: 'center', justifyContent: 'center', padding: '100px 0', gap: 20 }}>
            <div style={{ width: 60, height: 60, borderRadius: 18, background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6366f1' }}>
              <Globe size={26} strokeWidth={1.5} />
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 16, fontWeight: 700, color: '#f1f5f9', marginBottom: 6 }}>No sites monitored yet</div>
              <div style={{ fontSize: 13, color: '#475569' }}>Add your first site to start monitoring.</div>
            </div>
            <button
              onClick={() => setModal({ type: 'add' })}
              style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 20px', borderRadius: 11, border: 'none', background: 'linear-gradient(135deg, #6366f1, #818cf8)', color: '#fff', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", boxShadow: '0 4px 20px rgba(99,102,241,0.3)' }}
            >
              <Plus size={15} />
              Add your first site
            </button>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 14 }}>
            {sites.map((site, i) => (
              <SiteCardWrapper
                key={site.ID}
                site={site}
                nextScanIn={nextScanIn}
                onEdit={(s) => setModal({ type: 'edit', site: s })}
                onDelete={(s) => setModal({ type: 'delete', site: s })}
                animDelay={i * 50}
              />
            ))}
          </div>
        )}
      </main>

      <footer style={{ textAlign: 'center', padding: '24px', borderTop: '1px solid rgba(255,255,255,0.04)', marginTop: 20 }}>
        <span style={{ fontSize: 11, color: '#1e293b', fontWeight: 500 }}>Nexus Monitoring · auto-refresh every 60s</span>
      </footer>
      {modal?.type === 'add' && (
        <SiteModal title="Add new site" onClose={() => setModal(null)} onSubmit={handleAdd} />
      )}
      {modal?.type === 'edit' && (
        <SiteModal title="Edit site" initial={{ name: modal.site.name, url: modal.site.url }} onClose={() => setModal(null)} onSubmit={handleEdit} />
      )}
      {modal?.type === 'delete' && (
        <ConfirmDelete site={modal.site} onClose={() => setModal(null)} onConfirm={handleDelete} />
      )}
    </div>
  );
};


const AddSiteBtn: React.FC<{ onClick: () => void }> = ({ onClick }) => {
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

export default App;