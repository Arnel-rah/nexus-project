import React, { useMemo, useState } from "react";
import { Globe, Zap, ShieldCheck, Clock } from "lucide-react";
import { motion } from "framer-motion";

interface HistoryPoint {
  checked_at: string;
  is_up: boolean;
  latency: number;
}

interface Site {
  id: number | string;
  name: string;
  url: string;
  is_up: boolean;
  latency: number | null;
  last_check: string;
  history?: HistoryPoint[];
}

interface SiteCardProps {
  site: Site;
  nextScanIn: number;
}

const BarTick: React.FC<{ h: HistoryPoint; maxLatency: number; index: number }> = ({ h, maxLatency, index }) => {
  const [hov, setHov] = useState(false);
  const heightPct = h.is_up ? Math.max((h.latency / maxLatency) * 100, 10) : 100;
  const color = !h.is_up ? "#ff4757" : h.latency > 300 ? "#ffa502" : "#00e5a0";

  return (
    <motion.div
      initial={{ scaleY: 0, opacity: 0 }}
      animate={{ scaleY: 1, opacity: hov ? 1 : 0.55 }}
      transition={{ delay: index * 0.02, duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        flex: 1,
        height: `${heightPct}%`,
        background: hov
          ? color
          : `linear-gradient(180deg, ${color} 0%, ${color}80 100%)`,
        borderRadius: "2px 2px 0 0",
        transformOrigin: "bottom",
        cursor: "default",
        transition: "background 0.15s",
        position: "relative",
      }}
      title={h.is_up ? `${h.latency}ms` : "DOWN"}
    />
  );
};

const StatBox: React.FC<{
  label: string;
  value: string | number;
  unit: string;
  accent: string;
  icon: React.ReactNode;
}> = ({ label, value, unit, accent, icon }) => (
  <div
    style={{
      padding: "12px 14px",
      borderRadius: 12,
      background: "rgba(255,255,255,0.02)",
      border: "1px solid rgba(255,255,255,0.06)",
      position: "relative",
      overflow: "hidden",
    }}
  >
    <div
      style={{
        position: "absolute",
        left: 0,
        top: "20%",
        bottom: "20%",
        width: 2,
        borderRadius: 99,
        background: accent,
        boxShadow: `0 0 8px ${accent}`,
      }}
    />

    <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8, color: "rgba(148,163,184,0.5)" }}>
      {icon}
      <span style={{ fontSize: 8, fontFamily: "'DM Mono', monospace", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase" as const }}>
        {label}
      </span>
    </div>

    <div style={{ display: "flex", alignItems: "baseline", gap: 3 }}>
      <motion.span
        key={String(value)}
        initial={{ opacity: 0, y: 3 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          fontSize: 24,
          fontFamily: "'DM Mono', monospace",
          fontWeight: 600,
          letterSpacing: "-1px",
          color: accent,
          lineHeight: 1,
          textShadow: `0 0 16px ${accent}60`,
        }}
      >
        {value}
      </motion.span>
      <span style={{ fontSize: 9, fontFamily: "'DM Mono', monospace", color: "rgba(100,116,139,0.6)" }}>{unit}</span>
    </div>
  </div>
);

export const SiteCard: React.FC<SiteCardProps> = ({ site, nextScanIn }) => {
  const [hov, setHov] = useState(false);
  const isUp = site.is_up;

  const accent = isUp ? "#00e5a0" : "#ff4757";
  const accentRgb = isUp ? "0,229,160" : "255,71,87";
  const uptimeAccent = (uptime: number) => uptime > 95 ? "#00e5a0" : uptime > 80 ? "#ffa502" : "#ff4757";

  const history = useMemo(() =>
    [...(site.history ?? [])]
      .sort((a, b) => new Date(a.checked_at).getTime() - new Date(b.checked_at).getTime())
      .slice(-28),
    [site.history]
  );

  const maxLatency = Math.max(...history.map(h => h.latency), 100);
  const uptime = history.length
    ? Math.round((history.filter(h => h.is_up).length / history.length) * 100)
    : 0;

  const countdownPct = ((60 - (nextScanIn % 60)) / 60) * 100;
  const cleanUrl = site.url.replace(/^https?:\/\//, "");

  return (
    <motion.div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      animate={{ y: hov ? -3 : 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 22 }}
      style={{
        position: "relative",
        overflow: "hidden",
        borderRadius: 18,
        background: "linear-gradient(160deg, #0d1017 0%, #080b10 100%)",
        border: `1px solid rgba(${accentRgb}, ${hov ? 0.28 : 0.1})`,
        boxShadow: hov
          ? `0 20px 48px -12px rgba(${accentRgb}, 0.18), inset 0 1px 0 rgba(255,255,255,0.04)`
          : `0 4px 20px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.02)`,
        transition: "border-color 0.3s, box-shadow 0.3s",
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1, overflow: "hidden" }}>
        <motion.div
          animate={{ x: ["-100%", "200%"] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: "linear", repeatDelay: 2 }}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "40%",
            height: "100%",
            background: `linear-gradient(90deg, transparent, ${accent}, transparent)`,
            opacity: 0.6,
          }}
        />
      </div>
      <div
        style={{
          position: "absolute",
          top: -60,
          right: -60,
          width: 180,
          height: 180,
          borderRadius: "50%",
          background: `radial-gradient(circle, rgba(${accentRgb}, ${hov ? 0.1 : 0.04}) 0%, transparent 70%)`,
          transition: "background 0.4s",
          pointerEvents: "none",
        }}
      />
      {[
        { top: 0, left: 0 },
        { top: 0, right: 0 },
        { bottom: 0, left: 0 },
        { bottom: 0, right: 0 },
      ].map((pos, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            ...pos,
            width: 10,
            height: 10,
            pointerEvents: "none",
            opacity: hov ? 0.7 : 0.25,
            transition: "opacity 0.3s",
          }}
        >
          <div style={{ position: "absolute", ...(pos.top === 0 ? { top: 0 } : { bottom: 0 }), left: pos.left === 0 ? 0 : "auto", right: pos.right === 0 ? 0 : "auto", width: 6, height: 1, background: accent }} />
          <div style={{ position: "absolute", ...(pos.top === 0 ? { top: 0 } : { bottom: 0 }), left: pos.left === 0 ? 0 : "auto", right: pos.right === 0 ? 0 : "auto", width: 1, height: 6, background: accent }} />
        </div>
      ))}

      <div style={{ padding: "20px 20px 18px", position: "relative", zIndex: 1 }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 18 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ position: "relative" }}>
              {isUp && (
                <motion.div
                  animate={{ opacity: [0.3, 0.6, 0.3] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  style={{
                    position: "absolute",
                    inset: -4,
                    borderRadius: 14,
                    background: `rgba(${accentRgb}, 0.12)`,
                    filter: "blur(4px)",
                  }}
                />
              )}
              <div
                style={{
                  position: "relative",
                  width: 42,
                  height: 42,
                  borderRadius: 12,
                  background: `rgba(${accentRgb}, 0.06)`,
                  border: `1px solid rgba(${accentRgb}, 0.18)`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: accent,
                  transition: "transform 0.2s",
                  transform: hov ? "scale(1.05)" : "scale(1)",
                }}
              >
                <Globe size={18} strokeWidth={1.5} />
              </div>
            </div>

            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 14, fontWeight: 800, color: "#f1f5f9", letterSpacing: "-0.3px", lineHeight: 1.2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: 140 }}>
                {site.name}
              </div>
              <a
                href={site.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{ fontSize: 10, fontFamily: "'DM Mono', monospace", color: "#334155", textDecoration: "none", marginTop: 3, display: "block", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 140, transition: "color 0.2s" }}
                onMouseEnter={e => ((e.currentTarget as HTMLAnchorElement).style.color = "#6366f1")}
                onMouseLeave={e => ((e.currentTarget as HTMLAnchorElement).style.color = "#334155")}
              >
                {cleanUrl}
              </a>
            </div>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 5,
              padding: "4px 10px",
              borderRadius: 6,
              background: `rgba(${accentRgb}, 0.07)`,
              border: `1px solid rgba(${accentRgb}, 0.18)`,
              flexShrink: 0,
            }}
          >
            <motion.span
              animate={{ opacity: isUp ? [1, 0.3, 1] : 1 }}
              transition={{ duration: 1.5, repeat: Infinity }}
              style={{ width: 5, height: 5, borderRadius: "50%", background: accent, display: "block", boxShadow: `0 0 5px ${accent}` }}
            />
            <span style={{ fontSize: 8, fontFamily: "'DM Mono', monospace", fontWeight: 700, letterSpacing: "0.12em", color: accent, textTransform: "uppercase" as const }}>
              {isUp ? "ONLINE" : "DOWN"}
            </span>
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 16 }}>
          <StatBox label="Latency" value={site.latency ?? "---"} unit="ms" accent={accent} icon={<Zap size={9} strokeWidth={2.5} />} />
          <StatBox label="Uptime" value={uptime} unit="%" accent={uptimeAccent(uptime)} icon={<ShieldCheck size={9} strokeWidth={2.5} />} />
        </div>
        {history.length > 0 && (
          <div style={{ marginBottom: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
              <span style={{ fontSize: 8, fontFamily: "'DM Mono', monospace", fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase" as const, color: "#1e2d3d" }}>
                Activity
              </span>
              <span style={{ fontSize: 8, fontFamily: "'DM Mono', monospace", color: "#1e2d3d" }}>
                {history.length}pts
              </span>
            </div>
            <div style={{ display: "flex", alignItems: "flex-end", gap: 2, height: 32 }}>
              {history.map((h, i) => (
                <BarTick key={i} h={h} maxLatency={maxLatency} index={i} />
              ))}
            </div>
          </div>
        )}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            paddingTop: 12,
            borderTop: "1px solid rgba(255,255,255,0.04)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <Clock size={10} strokeWidth={2} color="#1e2d3d" />
            <span style={{ fontSize: 9, fontFamily: "'DM Mono', monospace", color: "#1e2d3d" }}>
              {new Date(site.last_check).toLocaleTimeString("fr-FR")}
            </span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 44, height: 2, background: "rgba(255,255,255,0.05)", borderRadius: 99, overflow: "hidden" }}>
              <motion.div
                style={{ height: "100%", background: accent, borderRadius: 99 }}
                animate={{ width: `${countdownPct}%` }}
                transition={{ duration: 1, ease: "linear" }}
              />
            </div>
            <span style={{ fontSize: 9, fontFamily: "'DM Mono', monospace", fontWeight: 600, color: "#2d3f55", minWidth: 24, textAlign: "right" as const }}>
              {nextScanIn}s
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};