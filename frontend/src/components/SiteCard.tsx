import React from 'react';
import { Globe, Activity, CheckCircle2, AlertCircle } from 'lucide-react';
import type { Site } from '../types/site';

interface Props {
  site: Site;
}

export const SiteCard: React.FC<Props> = ({ site }) => {
  const isUp = site.is_up;

  return (
    <div className={`p-5 rounded-xl border transition-all shadow-sm ${
      isUp ? 'bg-white border-green-200 shadow-green-50' : 'bg-white border-red-200 shadow-red-50'
    }`}>
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-4">
          <div className={`p-3 rounded-lg ${isUp ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
            <Globe size={24} />
          </div>
          <div>
            <h3 className="font-bold text-gray-800 text-lg">{site.name}</h3>
            <p className="text-sm text-gray-500 truncate max-w-45">{site.url}</p>
          </div>
        </div>
        {isUp ? 
          <CheckCircle2 className="text-green-500" size={24} /> : 
          <AlertCircle className="text-red-500" size={24} />
        }
      </div>

      <div className="mt-6 flex items-center justify-between">
        <div className="flex items-center gap-2 text-gray-600">
          <Activity size={18} className={isUp ? 'text-green-500' : 'text-red-500'} />
          <span className="font-mono text-sm">{site.latency}ms</span>
        </div>
        <div className={`text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider ${
          isUp ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
        }`}>
          {isUp ? 'Online' : 'Offline'}
        </div>
      </div>
    </div>
  );
};