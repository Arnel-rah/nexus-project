import React from 'react';
import { Check, AlertTriangle } from 'lucide-react';
import StatPill from './StatPill';

interface StatusBannerProps {
  upCount: number;
  downCount: number;
  total: number;
  uptimePct: number | null;
}

const StatusBanner: React.FC<StatusBannerProps> = ({ upCount, downCount, total, uptimePct }) => {
  const allUp = downCount === 0 && total > 0;

  return (
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
        <div
          style={{
            width: 42,
            height: 42,
            borderRadius: 12,
            background: allUp ? 'rgba(16,185,129,0.12)' : 'rgba(239,68,68,0.12)',
            border: `1px solid ${allUp ? 'rgba(16,185,129,0.25)' : 'rgba(239,68,68,0.25)'}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: allUp ? '#10b981' : '#ef4444',
          }}
        >
          {allUp
            ? <Check size={18} strokeWidth={2.5} />
            : <AlertTriangle size={18} strokeWidth={2} />
          }
        </div>
        <div>
          <div
            style={{
              fontSize: 15,
              fontWeight: 800,
              color: allUp ? '#10b981' : '#ef4444',
              letterSpacing: '-0.3px',
            }}
          >
            {allUp
              ? 'All systems operational'
              : `${downCount} service${downCount > 1 ? 's' : ''} down`
            }
          </div>
          <div style={{ fontSize: 12, color: '#475569', marginTop: 2 }}>
            {upCount} of {total} services running
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' as const }}>
        <StatPill value={total} label="Total" color="slate" />
        <StatPill value={upCount} label="Online" color="green" />
        {downCount > 0 && <StatPill value={downCount} label="Down" color="red" />}
        {uptimePct !== null && (
          <StatPill
            value={`${uptimePct}%`}
            label="Uptime"
            color={uptimePct === 100 ? 'green' : uptimePct >= 80 ? 'yellow' : 'red'}
          />
        )}
      </div>
    </div>
  );
};

export default StatusBanner;