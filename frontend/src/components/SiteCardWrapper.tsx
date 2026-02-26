import React, { useState } from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import { SiteCard } from './SiteCard';
import ActionBtn from './ui/ActionBtn';
import type { Site } from '../types/site';

interface SiteCardWrapperProps {
  site: Site;
  nextScanIn: number;
  onEdit: (site: Site) => void;
  onDelete: (site: Site) => void;
  animDelay: number;
}

const SiteCardWrapper: React.FC<SiteCardWrapperProps> = ({
  site,
  nextScanIn,
  onEdit,
  onDelete,
  animDelay,
}) => {
  const [visible, setVisible] = useState(false);

  return (
    <div
      className="card-appear"
      style={{ animationDelay: `${animDelay}ms`, position: 'relative' }}
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
    >
      <SiteCard site={site} nextScanIn={nextScanIn} />

      {/* Hover action buttons */}
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
        <ActionBtn
          icon={<Pencil size={12} />}
          onClick={() => onEdit(site)}
          color="indigo"
          title="Edit site"
        />
        <ActionBtn
          icon={<Trash2 size={12} />}
          onClick={() => onDelete(site)}
          color="red"
          title="Delete site"
        />
      </div>
    </div>
  );
};

export default SiteCardWrapper;