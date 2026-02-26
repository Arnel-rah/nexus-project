import React, { useEffect, useState, useCallback } from 'react';
import { ShieldCheck, RefreshCw, Plus, Globe } from 'lucide-react';

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

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#080b11',
        fontFamily: "'DM Sans', 'Helvetica Neue', sans-serif",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700;800&family=DM+Mono:wght@500;600&display=swap');
        * { box-sizing: border-box; }
        body { margin: 0; background: #080b11; }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes ping {
          0%, 100% { transform: scale(1); opacity: 0.75; }
          50%       { transform: scale(1.8); opacity: 0; }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .card-appear { animation: fadeUp 0.4s ease both; }
        input::placeholder { color: #334155; }
      `}</style>

      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 50,
          background: 'rgba(8,11,17,0.85)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        <div
          style={{
            maxWidth: 1100,
            margin: '0 auto',
            padding: '0 24px',
            height: 60,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                background: 'linear-gradient(135deg, #6366f1, #818cf8)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                boxShadow: '0 4px 16px rgba(99,102,241,0.35)',
              }}
            >
              <ShieldCheck size={18} strokeWidth={1.8} />
            </div>
            <div>
              <div
                style={{
                  fontSize: 16,
                  fontWeight: 800,
                  color: '#f1f5f9',
                  letterSpacing: '-0.4px',
                  lineHeight: 1,
                }}
              >
                NEXUS<span style={{ color: '#6366f1' }}>.</span>
              </div>
              <div
                style={{
                  fontSize: 9,
                  fontWeight: 700,
                  color: '#334155',
                  textTransform: 'uppercase',
                  letterSpacing: '0.12em',
                  marginTop: 2,
                }}
              >
                Monitoring
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {lastUpdated && (
              <span
                style={{
                  fontSize: 11,
                  color: '#334155',
                  fontWeight: 500,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 5,
                }}
              >
                Updated{' '}
                <span
                  style={{
                    fontFamily: "'DM Mono', monospace",
                    color: '#475569',
                    fontWeight: 600,
                  }}
                >
                  {lastUpdated.toLocaleTimeString('fr-FR', {
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                  })}
                </span>
              </span>
            )}

            <NavBtn onClick={fetchData} title="Refresh now">
              <RefreshCw
                size={14}
                style={{ animation: refreshing ? 'spin 0.8s linear infinite' : 'none' }}
              />
            </NavBtn>

            <AddSiteBtn onClick={() => setModal({ type: 'add' })} />

            {/* Live dot */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
              <div style={{ position: 'relative', width: 8, height: 8 }}>
                <span
                  style={{
                    position: 'absolute',
                    inset: 0,
                    borderRadius: '50%',
                    background: '#10b981',
                    animation: 'ping 1.5s ease-in-out infinite',
                    opacity: 0.6,
                  }}
                />
                <span
                  style={{
                    position: 'absolute',
                    inset: 0,
                    borderRadius: '50%',
                    background: '#10b981',
                    boxShadow: '0 0 6px #10b981',
                  }}
                />
              </div>
              <span
                style={{
                  fontSize: 10,
                  fontWeight: 800,
                  color: '#334155',
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                }}
              >
                Live
              </span>
            </div>
          </div>
        </div>
      </header>

      <main style={{ maxWidth: 1100, margin: '0 auto', padding: '40px 24px' }}>

        {!loading && sites.length > 0 && (
          <StatusBanner
            upCount={upCount}
            downCount={downCount}
            total={sites.length}
            uptimePct={uptimePct}
          />
        )}

        {loading && sites.length === 0 ? (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '120px 0',
              gap: 16,
            }}
          >
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: '50%',
                border: '3px solid rgba(99,102,241,0.15)',
                borderTopColor: '#6366f1',
                animation: 'spin 0.8s linear infinite',
              }}
            />
            <p style={{ fontSize: 13, color: '#334155', fontWeight: 500, margin: 0 }}>
              Connecting to Nexus backend…
            </p>
          </div>

        ) : sites.length === 0 ? (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '100px 0',
              gap: 20,
            }}
          >
            <div
              style={{
                width: 60,
                height: 60,
                borderRadius: 18,
                background: 'rgba(99,102,241,0.08)',
                border: '1px solid rgba(99,102,241,0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#6366f1',
              }}
            >
              <Globe size={26} strokeWidth={1.5} />
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 16, fontWeight: 700, color: '#f1f5f9', marginBottom: 6 }}>
                No sites monitored yet
              </div>
              <div style={{ fontSize: 13, color: '#475569' }}>
                Add your first site to start monitoring.
              </div>
            </div>
            <button
              onClick={() => setModal({ type: 'add' })}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '10px 20px',
                borderRadius: 11,
                border: 'none',
                background: 'linear-gradient(135deg, #6366f1, #818cf8)',
                color: '#fff',
                fontSize: 13,
                fontWeight: 700,
                cursor: 'pointer',
                fontFamily: "'DM Sans', sans-serif",
                boxShadow: '0 4px 20px rgba(99,102,241,0.3)',
              }}
            >
              <Plus size={15} />
              Add your first site
            </button>
          </div>

        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
              gap: 14,
            }}
          >
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

      <footer
        style={{
          textAlign: 'center',
          padding: '24px',
          borderTop: '1px solid rgba(255,255,255,0.04)',
          marginTop: 20,
        }}
      >
        <span style={{ fontSize: 11, color: '#1e293b', fontWeight: 500 }}>
          Nexus Monitoring · auto-refresh every 60s
        </span>
      </footer>

      {modal?.type === 'add' && (
        <SiteModal
          title="Add new site"
          onClose={() => setModal(null)}
          onSubmit={handleAdd}
        />
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
        <ConfirmDelete
          site={modal.site}
          onClose={() => setModal(null)}
          onConfirm={handleDelete}
        />
      )}
    </div>
  );
};

export default App;