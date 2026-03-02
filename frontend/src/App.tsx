import React, { useEffect, useState, useCallback } from 'react';
import { ShieldCheck, RefreshCw, Plus, Globe, Activity } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import type { Site } from './types/site';
import SiteCardWrapper from './components/SiteCardWrapper';
import StatusBanner from './components/StatusBanner';
import NavBtn from './components/ui/NavBtn';
import AddSiteBtn from './components/ui/AddSiteBtn';
import SiteModal, { type SiteFormData } from './components/modals/SiteModal';
import ConfirmDelete from './components/modals/ConfirmDelete';


type Modal =
  | { type: 'add' }
  | { type: 'edit'; site: Site }
  | { type: 'delete'; site: Site }
  | null;

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
    const res = await fetch('http://localhost:8080/api/sites', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new Error(body.error ?? 'Failed to create site');
    }
    await fetchData();
    setModal(null);
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

  return (
    <div style={{ minHeight: '100vh', background: '#080b10', fontFamily: "'DM Sans', 'Helvetica Neue', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700;800&family=DM+Mono:wght@400;500;600&family=Syne:wght@700;800&display=swap');
        *, *::before, *::after { box-sizing: border-box; }
        body { margin: 0; background: #080b10; }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes ping {
          0%,100% { transform: scale(1); opacity: 0.8; }
          50%      { transform: scale(2); opacity: 0; }
        }
        @keyframes gridFade {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .card-appear { animation: gridFade 0.5s cubic-bezier(0.22,1,0.36,1) both; }
        input::placeholder { color: #475569; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #1e2d3d; border-radius: 99px; }
      `}</style>

      <div
        style={{
          position: 'fixed',
          inset: 0,
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px)
          `,
          backgroundSize: '48px 48px',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 50,
          background: 'rgba(8,11,16,0.9)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(255,255,255,0.05)',
        }}
      >
        <div style={{ height: 1, background: 'linear-gradient(90deg, transparent 0%, rgba(99,102,241,0.5) 40%, rgba(0,229,160,0.3) 70%, transparent 100%)' }} />

        <div
          style={{
            maxWidth: 1120,
            margin: '0 auto',
            padding: '0 24px',
            height: 58,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div
              style={{
                width: 34,
                height: 34,
                borderRadius: 9,
                background: 'linear-gradient(135deg, #6366f1 0%, #818cf8 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                boxShadow: '0 0 20px rgba(99,102,241,0.4)',
                flexShrink: 0,
              }}
            >
              <ShieldCheck size={17} strokeWidth={1.8} />
            </div>
            <div>
              <div
                style={{
                  fontSize: 15,
                  fontWeight: 800,
                  fontFamily: "'Syne', sans-serif",
                  color: '#f1f5f9',
                  letterSpacing: '-0.5px',
                  lineHeight: 1,
                }}
              >
                NEXUS<span style={{ color: '#6366f1' }}>.</span>
              </div>
              <div
                style={{
                  fontSize: 8,
                  fontFamily: "'DM Mono', monospace",
                  fontWeight: 600,
                  color: '#64748b',
                  textTransform: 'uppercase',
                  letterSpacing: '0.2em',
                  marginTop: 3,
                }}
              >
                monitoring
              </div>
            </div>
            <div style={{ width: 1, height: 24, background: 'rgba(255,255,255,0.06)', marginLeft: 4 }} />
            {!loading && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '3px 10px',
                  borderRadius: 6,
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.06)',
                }}
              >
                <Activity size={10} color="#475569" />
                <span
                  style={{
                    fontSize: 9,
                    fontFamily: "'DM Mono', monospace",
                    fontWeight: 600,
                    color: '#475569',
                    letterSpacing: '0.08em',
                  }}
                >
                  {sites.length} ENDPOINT{sites.length !== 1 ? 'S' : ''}
                </span>
              </motion.div>
            )}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {lastUpdated && (
              <span
                style={{
                  fontSize: 10,
                  fontFamily: "'DM Mono', monospace",
                  color: '#475569',
                  fontWeight: 500,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                }}
              >
                <span style={{ color: '#ffff' }}>sync</span>{' '}
                {lastUpdated.toLocaleTimeString('fr-FR', {
                  hour: '2-digit',
                  minute: '2-digit',
                  second: '2-digit',
                })}
              </span>
            )}

            <NavBtn onClick={fetchData} title="Refresh now">
              <RefreshCw
                size={13}
                style={{ animation: refreshing ? 'spin 0.8s linear infinite' : 'none' }}
              />
            </NavBtn>

            <AddSiteBtn onClick={() => setModal({ type: 'add' })} />
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, paddingLeft: 4 }}>
              <div style={{ position: 'relative', width: 7, height: 7 }}>
                <span style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: '#00e5a0', animation: 'ping 2s ease-in-out infinite', opacity: 0.5 }} />
                <span style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: '#00e5a0', boxShadow: '0 0 8px #00e5a0' }} />
              </div>
              <span style={{ fontSize: 8, fontFamily: "'DM Mono', monospace", fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.15em' }}>
                live
              </span>
            </div>
          </div>
        </div>
      </header>
      <main style={{ maxWidth: 1120, margin: '0 auto', padding: '36px 24px 60px', position: 'relative', zIndex: 1 }}>
        <AnimatePresence>
          {!loading && sites.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
            >
              <StatusBanner
                upCount={upCount}
                downCount={downCount}
                total={sites.length}
                uptimePct={uptimePct}
              />
            </motion.div>
          )}
        </AnimatePresence>
        {loading && sites.length === 0 ? (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '120px 0',
              gap: 20,
            }}
          >
            <div style={{ position: 'relative', width: 48, height: 48 }}>
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  borderRadius: '50%',
                  border: '2px solid rgba(99,102,241,0.1)',
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  borderRadius: '50%',
                  border: '2px solid transparent',
                  borderTopColor: '#6366f1',
                  animation: 'spin 0.9s linear infinite',
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  inset: 8,
                  borderRadius: '50%',
                  border: '1px solid transparent',
                  borderTopColor: '#00e5a0',
                  animation: 'spin 1.4s linear infinite reverse',
                }}
              />
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 13, fontFamily: "'DM Mono', monospace", color: '#64748b', fontWeight: 500, letterSpacing: '0.06em' }}>
                CONNECTING TO BACKEND
              </div>
              <div style={{ fontSize: 10, color: '#475569', marginTop: 6, fontFamily: "'DM Mono', monospace" }}>
                localhost:8080
              </div>
            </div>
          </div>

        ) : sites.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '100px 0',
              gap: 24,
            }}
          >
            <div style={{ position: 'relative' }}>
              <div
                style={{
                  position: 'absolute',
                  inset: -12,
                  borderRadius: '50%',
                  background: 'radial-gradient(circle, rgba(99,102,241,0.08) 0%, transparent 70%)',
                }}
              />
              <div
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: 18,
                  background: 'rgba(99,102,241,0.06)',
                  border: '1px solid rgba(99,102,241,0.12)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#6366f1',
                  position: 'relative',
                }}
              >
                <Globe size={28} strokeWidth={1.3} />
                {['top-0 left-0', 'top-0 right-0', 'bottom-0 left-0', 'bottom-0 right-0'].map((_, i) => (
                  <div key={i} style={{ position: 'absolute', [i < 2 ? 'top' : 'bottom']: 0, [i % 2 === 0 ? 'left' : 'right']: 0, width: 8, height: 8 }}>
                    <div style={{ position: 'absolute', [i < 2 ? 'top' : 'bottom']: 0, [i % 2 === 0 ? 'left' : 'right']: 0, width: 5, height: 1, background: '#6366f1', opacity: 0.5 }} />
                    <div style={{ position: 'absolute', [i < 2 ? 'top' : 'bottom']: 0, [i % 2 === 0 ? 'left' : 'right']: 0, width: 1, height: 5, background: '#6366f1', opacity: 0.5 }} />
                  </div>
                ))}
              </div>
            </div>

            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 16, fontWeight: 800, fontFamily: "'Syne', sans-serif", color: '#f1f5f9', marginBottom: 8, letterSpacing: '-0.3px' }}>
                No endpoints monitored
              </div>
              <div style={{ fontSize: 12, fontFamily: "'DM Mono', monospace", color: '#64748b' }}>
                Add your first site to start tracking.
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.04, y: -1 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setModal({ type: 'add' })}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '10px 22px',
                borderRadius: 10,
                border: 'none',
                background: 'linear-gradient(135deg, #6366f1, #818cf8)',
                color: '#fff',
                fontSize: 12,
                fontWeight: 700,
                fontFamily: "'DM Sans', sans-serif",
                cursor: 'pointer',
                boxShadow: '0 4px 24px rgba(99,102,241,0.35)',
              }}
            >
              <Plus size={14} />
              Add first endpoint
            </motion.button>
          </motion.div>

        ) : (
          /* Cards grid */
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(310px, 1fr))',
              gap: 16,
            }}
          >
            {sites.map((site, i) => (
              <SiteCardWrapper
                key={site.ID}
                site={site}
                nextScanIn={nextScanIn}
                onEdit={(s) => setModal({ type: 'edit', site: s })}
                onDelete={(s) => setModal({ type: 'delete', site: s })}
                animDelay={i * 60}
              />
            ))}
          </div>
        )}
      </main>

      {/* ── Footer ── */}
      <footer
        style={{
          position: 'relative',
          zIndex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 16,
          padding: '18px 24px',
          borderTop: '1px solid rgba(255,255,255,0.04)',
        }}
      >
        <div style={{ width: 4, height: 4, borderRadius: '50%', background: '#64748b' }} />
        <span style={{ fontSize: 9, fontFamily: "'DM Mono', monospace", color: '#475569', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
          Nexus Monitoring
        </span>
        <div style={{ width: 4, height: 4, borderRadius: '50%', background: '#64748b' }} />
        <span style={{ fontSize: 9, fontFamily: "'DM Mono', monospace", color: '#475569', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
          Auto-refresh 60s
        </span>
        <div style={{ width: 4, height: 4, borderRadius: '50%', background: '#64748b' }} />
      </footer>
      {modal?.type === 'add' && (
        <SiteModal title="Add new site" onClose={() => setModal(null)} onSubmit={handleAdd} />
      )}
      {modal?.type === 'edit' && (
        <SiteModal
          title="Edit site"
          initial={{ name: modal.site.name, url: modal.site.url }}
          onClose={() => setModal(null)}
          onSubmit={handleEdit}
        />
      )}
      {modal?.type === 'delete' && (
        <ConfirmDelete site={modal.site} onClose={() => setModal(null)} onConfirm={handleDelete} />
      )}
    </div>
  );
};

export default App;