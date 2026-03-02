import React, { useState } from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { SiteCard } from './SiteCard';
import type { Site } from '../types/site';

interface SiteCardWrapperProps {
  site: Site;
  nextScanIn: number;
  onEdit: (site: Site) => void;
  onDelete: (site: Site) => void;
  animDelay: number;
}

// ─── CardActionBtn ────────────────────────────────────────────────────────────

const CardActionBtn: React.FC<{
  icon: React.ReactNode;
  onClick: () => void;
  color: 'indigo' | 'red';
  title: string;
}> = ({ icon, onClick, color, title }) => {
  const [hov, setHov] = useState(false);
  const rgb = color === 'indigo' ? '99,102,241' : '239,68,68';
  const hex = color === 'indigo' ? '#818cf8' : '#ef4444';

  return (
    <motion.button
      title={title}
      onClick={(e) => { e.stopPropagation(); onClick(); }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.92 }}
      style={{
        width: 28,
        height: 28,
        borderRadius: 8,
        border: `1px solid rgba(${rgb}, ${hov ? 0.45 : 0.2})`,
        background: hov ? `rgba(${rgb}, 0.15)` : 'rgba(8,11,16,0.9)',
        color: hov ? hex : `rgba(${rgb}, 0.45)`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        boxShadow: hov ? `0 0 14px rgba(${rgb}, 0.25)` : 'none',
        transition: 'border-color 0.15s, background 0.15s, color 0.15s, box-shadow 0.15s',
      }}
    >
      {icon}
    </motion.button>
  );
};

// ─── SiteCardWrapper ──────────────────────────────────────────────────────────

const SiteCardWrapper: React.FC<SiteCardWrapperProps> = ({
  site,
  nextScanIn,
  onEdit,
  onDelete,
  animDelay,
}) => {
  const [visible, setVisible] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        delay: animDelay / 1000,
        duration: 0.45,
        ease: [0.22, 1, 0.36, 1],
      }}
      style={{ position: 'relative' }}
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
    >
      <SiteCard site={site} nextScanIn={nextScanIn} />

      {/* Action buttons — appear at bottom-right on hover */}
      <AnimatePresence>
        {visible && (
          <motion.div
            initial={{ opacity: 0, y: -4, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.95 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            style={{
              position: 'absolute',
              bottom: 16,
              right: 16,
              display: 'flex',
              gap: 6,
              zIndex: 30,
            }}
          >
            <CardActionBtn
              icon={<Pencil size={11} strokeWidth={2} />}
              onClick={() => onEdit(site)}
              color="indigo"
              title="Edit site"
            />
            <CardActionBtn
              icon={<Trash2 size={11} strokeWidth={2} />}
              onClick={() => onDelete(site)}
              color="red"
              title="Delete site"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default SiteCardWrapper;