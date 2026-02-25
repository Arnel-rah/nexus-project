import React, { useEffect, useState } from 'react';
import { SiteCard } from './components/SiteCard';
import type { Site } from './types/site';
import { ShieldCheck, RefreshCw } from 'lucide-react';

const App: React.FC = () => {
  const [sites, setSites] = useState<Site[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = async () => {
    setRefreshing(true);
    try {
      const response = await fetch('http://localhost:8080/api/sites');
      const data: Site[] = await response.json();
      setSites(data);
      setLastUpdated(new Date());
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
    const timer = setInterval(fetchData, 10000);
    return () => clearInterval(timer);
  }, []);

  const upCount = sites.filter(s => s.is_up).length;
  const downCount = sites.length - upCount;

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-100 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
            <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded-xl">
              <ShieldCheck size={20} className="text-white" />
            </div>
            <div>
              <h1 className="text-xl font-black text-slate-900 tracking-tight leading-none">
                NEXUS<span className="text-blue-600">.</span>
              </h1>
              <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-widest">Monitoring</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            {lastUpdated && (
              <span className="hidden sm:block text-xs text-slate-400">
                Mis à jour à{' '}
                <span className="font-semibold text-slate-500">
                  {lastUpdated.toLocaleTimeString()}
                </span>
              </span>
            )}
            <button
              onClick={fetchData}
              className="p-2 rounded-lg hover:bg-slate-100 transition-colors text-slate-400 hover:text-blue-500"
              title="Rafraîchir"
            >
              <RefreshCw size={16} className={refreshing ? 'animate-spin' : ''} />
            </button>
            <div className="flex gap-1.5 items-center">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-blue-500" />
              </span>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Live</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-10">

        {!loading && sites.length > 0 && (
          <div className="flex flex-wrap gap-4 mb-10">
            <StatChip label="Total" value={sites.length} color="slate" />
            <StatChip label="En ligne" value={upCount} color="green" />
            <StatChip label="Hors ligne" value={downCount} color="red" />
            <StatChip
              label="Disponibilité"
              value={`${Math.round((upCount / sites.length) * 100)}%`}
              color={upCount === sites.length ? 'green' : downCount === sites.length ? 'red' : 'yellow'}
            />
          </div>
        )}

        {loading && sites.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 gap-4 text-slate-400">
            <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin" />
            <p className="text-sm font-medium">Connexion au backend Nexus…</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {sites.map(site => (
              <SiteCard key={site.ID} site={site} nextScanIn={0} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

type Color = 'slate' | 'green' | 'red' | 'yellow';

const colorMap: Record<Color, string> = {
  slate:  'bg-slate-100 text-slate-600',
  green:  'bg-green-50 text-green-600',
  red:    'bg-red-50 text-red-500',
  yellow: 'bg-yellow-50 text-yellow-600',
};

const StatChip: React.FC<{ label: string; value: number | string; color: Color }> = ({ label, value, color }) => (
  <div className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold ${colorMap[color]}`}>
    <span className="text-lg font-black">{value}</span>
    <span className="font-medium opacity-75">{label}</span>
  </div>
);

export default App;