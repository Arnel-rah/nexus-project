import React, { useEffect, useState } from 'react';
import { SiteCard } from './components/SiteCard';
import type { Site } from './types/site';

const App: React.FC = () => {
  const [sites, setSites] = useState<Site[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchData = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/sites');
      const data: Site[] = await response.json();
      setSites(data);
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const timer = setInterval(fetchData, 10000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-12">
      <header className="max-w-7xl mx-auto mb-12 flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter">
            NEXUS<span className="text-blue-600">.</span>
          </h1>
          <p className="text-slate-500 font-medium">Monitoring Dashboard</p>
        </div>
        <div className="flex gap-2 items-center">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
            </span>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Live Updates</span>
        </div>
      </header>

      <main className="max-w-7xl mx-auto">
        {loading && sites.length === 0 ? (
          <div className="flex justify-center py-20 text-slate-400 italic">Connecting to Nexus Backend...</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {sites.map(site => (
              <SiteCard key={site.ID} site={site} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default App;