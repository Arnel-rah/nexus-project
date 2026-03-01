import { useState, useEffect } from "react";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=Syne:wght@600;700;800&display=swap');

  @keyframes pulseRing {
    0% { transform: scale(0.8); opacity: 0.8; }
    70% { transform: scale(1.8); opacity: 0; }
    100% { transform: scale(0.8); opacity: 0; }
  }
  @keyframes shimmer {
    0% { transform: translateX(-100%); }
    100% { transform: translateX(300%); }
  }
  @keyframes blink {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.2; }
  }
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .site-card {
    position: relative;
    font-family: 'Syne', sans-serif;
    border-radius: 16px;
    overflow: hidden;
    cursor: default;
    transition: transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1),
                box-shadow 0.35s ease,
                border-color 0.35s ease;
    animation: fadeIn 0.5s ease forwards;
  }
  .site-card:hover {
    transform: translateY(-5px) scale(1.006);
  }
  .scanline-overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(to bottom, transparent 50%, rgba(0,0,0,0.045) 50%);
    background-size: 100% 3px;
    pointer-events: none;
    opacity: 0.35;
    z-index: 1;
    border-radius: inherit;
  }
  .stat-box {
    border-radius: 10px;
    padding: 12px 14px;
    background: rgba(255,255,255,0.025);
    border: 1px solid rgba(255,255,255,0.07);
    transition: background 0.2s, border-color 0.2s;
  }
  .stat-box:hover {
    background: rgba(255,255,255,0.045);
    border-color: rgba(255,255,255,0.12);
  }
  .bar-item {
    flex: 1;
    border-radius: 2px;
    opacity: 0.65;
    transition: opacity 0.15s, transform 0.15s;
    transform-origin: bottom;
    cursor: default;
  }
  .bar-item:hover {
    opacity: 1;
    transform: scaleY(1.1);
  }
  .url-link {
    font-family: 'Space Mono', monospace;
    font-size: 10.5px;
    color: #4b5675;
    text-decoration: none;
    transition: color 0.2s;
  }
  .url-link:hover { color: #7c8cf8; }
`;

const MOCK_HISTORY = Array.from({ length: 24 }, (_, i) => ({
  checked_at: new Date(Date.now() - (24 - i) * 60000).toISOString(),
  is_up: Math.random() > 0.08,
  latency: Math.floor(Math.random() * 450 + 30),
}));

const MOCK_HISTORY_DOWN = Array.from({ length: 24 }, (_, i) => ({
  checked_at: new Date(Date.now() - (24 - i) * 60000).toISOString(),
  is_up: i < 18 ? true : false,
  latency: i < 18 ? Math.floor(Math.random() * 450 + 30) : 0,
}));

const SITES = [
  {
    id: 1,
    name: "api.acme.io",
    url: "https://api.acme.io/health",
    is_up: true,
    latency: 87,
    last_check: new Date().toISOString(),
    history: MOCK_HISTORY,
  },
  {
    id: 2,
    name: "dashboard.acme.io",
    url: "https://dashboard.acme.io",
    is_up: false,
    latency: null,
    last_check: new Date(Date.now() - 120000).toISOString(),
    history: MOCK_HISTORY_DOWN,
  },
  {
    id: 3,
    name: "cdn.acme.io",
    url: "https://cdn.acme.io",
    is_up: true,
    latency: 623,
    last_check: new Date(Date.now() - 30000).toISOString(),
    history: MOCK_HISTORY.map((h) => ({ ...h, latency: h.latency + 300 })),
  },
];

export function SiteCard({ site, nextScanIn }) {
  const isUp = site.is_up;

  const history = [...(site.history ?? [])].sort(
    (a, b) => new Date(a.checked_at).getTime() - new Date(b.checked_at).getTime()
  );

  const maxLatency = history.length > 0 ? Math.max(...history.map((h) => h.latency), 1) : 1;

  const uptime = history.length
    ? Math.round((history.filter((h) => h.is_up).length / history.length) * 100)
    : null;

  const updatedAt = site.last_check
    ? new Date(site.last_check).toLocaleTimeString("fr-FR", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      })
    : null;

  const mins = Math.floor(nextScanIn / 60);
  const secs = nextScanIn % 60;
  const countdownPct = ((60 - nextScanIn) / 60) * 100;
  const cleanUrl = site.url.replace(/^https?:\/\//, "");

  const UP_COLOR = "#00e5a0";
  const DOWN_COLOR = "#ff4757";
  const WARN_COLOR = "#ffa502";
  const UP_RGB = "0, 229, 160";
  const DOWN_RGB = "255, 71, 87";
  const accentColor = isUp ? UP_COLOR : DOWN_COLOR;
  const accentRgb = isUp ? UP_RGB : DOWN_RGB;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const getBarColor = (isUp: any, latency: number) => {
    if (!isUp) return DOWN_COLOR;
    if (latency > 500) return WARN_COLOR;
    return UP_COLOR;
  };

  const getUptimeColor = (uptime: number | null) => {
    if (uptime === null) return "#4b5675";
    if (uptime === 100) return UP_COLOR;
    if (uptime >= 80) return WARN_COLOR;
    return DOWN_COLOR;
  };

  const latencyColor = (() => {
    if (!isUp) return DOWN_COLOR;
    const l = site.latency ?? 0;
    if (l > 500) return WARN_COLOR;
    return UP_COLOR;
  })();

  return (
    <div
      className="site-card"
      style={{
        background: "linear-gradient(160deg, #080a10 0%, #0c0f18 60%, #090c14 100%)",
        border: `1px solid rgba(${accentRgb}, 0.18)`,
        boxShadow: `0 1px 0 inset rgba(255,255,255,0.04), 0 0 40px -10px rgba(${accentRgb}, 0.1)`,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = `0 1px 0 inset rgba(255,255,255,0.04), 0 28px 60px -10px rgba(${accentRgb}, 0.24), 0 0 0 1px rgba(${accentRgb}, 0.28)`;
        e.currentTarget.style.borderColor = `rgba(${accentRgb}, 0.35)`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = `0 1px 0 inset rgba(255,255,255,0.04), 0 0 40px -10px rgba(${accentRgb}, 0.1)`;
        e.currentTarget.style.borderColor = `rgba(${accentRgb}, 0.18)`;
      }}
    >
      <div className="scanline-overlay" />

      <div style={{
        position: "absolute", top: 0, left: 0, width: 80, height: 80,
        background: `radial-gradient(circle at 0 0, rgba(${accentRgb}, 0.1) 0%, transparent 70%)`,
        pointerEvents: "none", zIndex: 1,
      }} />

      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: 1,
        background: `rgba(${accentRgb}, 0.1)`, overflow: "hidden", zIndex: 3,
      }}>
        <div style={{
          position: "absolute", top: 0, left: 0, height: "100%", width: "35%",
          background: `linear-gradient(90deg, transparent, rgba(${accentRgb}, 0.8), transparent)`,
          animation: "shimmer 3.5s ease-in-out infinite",
        }} />
      </div>

      <div style={{ padding: "22px", position: "relative", zIndex: 2 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 13 }}>
            <div style={{ position: "relative", flexShrink: 0 }}>
              {isUp && (
                <>
                  <div style={{
                    position: "absolute", inset: -5, borderRadius: "50%",
                    border: `1px solid rgba(${accentRgb}, 0.45)`,
                    animation: "pulseRing 2.4s ease-out infinite",
                  }} />
                  <div style={{
                    position: "absolute", inset: -5, borderRadius: "50%",
                    border: `1px solid rgba(${accentRgb}, 0.25)`,
                    animation: "pulseRing 2.4s ease-out 0.9s infinite",
                  }} />
                </>
              )}
              <div style={{
                width: 42, height: 42, borderRadius: 12,
                background: `linear-gradient(135deg, rgba(${accentRgb}, 0.14) 0%, rgba(${accentRgb}, 0.04) 100%)`,
                border: `1px solid rgba(${accentRgb}, 0.25)`,
                display: "flex", alignItems: "center", justifyContent: "center",
                boxShadow: `0 0 20px -4px rgba(${accentRgb}, 0.35)`,
              }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" strokeWidth="1.6" stroke={accentColor}>
                  <circle cx="12" cy="12" r="10" />
                  <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                </svg>
              </div>
            </div>

            <div style={{ minWidth: 0 }}>
              <h3 style={{
                margin: 0, fontSize: 14, fontWeight: 800, color: "#e8eaf0",
                letterSpacing: "-0.2px", lineHeight: 1.2, fontFamily: "'Syne', sans-serif",
                whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: 150,
              }}>
                {site.name}
              </h3>
              <a href={site.url} target="_blank" rel="noopener noreferrer" className="url-link" style={{ marginTop: 3, display: "block", maxWidth: 150, overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis" }}>
                {cleanUrl}
              </a>
            </div>
          </div>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 5,
            padding: "5px 10px", borderRadius: 8,
            background: `rgba(${accentRgb}, 0.08)`,
            border: `1px solid rgba(${accentRgb}, 0.22)`,
            flexShrink: 0,
          }}>
            <span style={{
              width: 5, height: 5, borderRadius: "50%",
              background: accentColor, display: "block",
              boxShadow: `0 0 8px 2px rgba(${accentRgb}, 0.7)`,
              animation: isUp ? "blink 2.5s ease-in-out infinite" : "none",
            }} />
            <span style={{
              fontSize: 10, fontWeight: 700, letterSpacing: "0.1em",
              color: accentColor, textTransform: "uppercase",
              fontFamily: "'Space Mono', monospace",
            }}>
              {isUp ? "ONLINE" : "DOWN"}
            </span>
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 18 }}>
          {[
            {
              label: "Latency", value: site.latency ?? "---", unit: "ms",
              color: latencyColor,
              icon: <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#2e3450" strokeWidth="2.5"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12" /></svg>,
            },
            {
              label: "Uptime", value: uptime ?? "---", unit: "%",
              color: getUptimeColor(uptime),
              icon: <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#2e3450" strokeWidth="2.5"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>,
            },
          ].map(({ label, value, unit, color, icon }) => (
            <div key={label} className="stat-box">
              <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 9 }}>
                {icon}
                <span style={{ fontSize: 9, fontWeight: 700, color: "#2e3450", textTransform: "uppercase", letterSpacing: "0.09em", fontFamily: "'Syne', sans-serif" }}>
                  {label}
                </span>
              </div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 2 }}>
                <span style={{ fontSize: 26, fontWeight: 700, fontFamily: "'Space Mono', monospace", color, lineHeight: 1, letterSpacing: "-1px" }}>
                  {value}
                </span>
                <span style={{ fontSize: 10, color: "#2e3450", fontFamily: "'Space Mono', monospace" }}>{unit}</span>
              </div>
            </div>
          ))}
        </div>
        {history.length > 0 && (
          <div style={{ marginBottom: 18 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 9 }}>
              <span style={{ fontSize: 9, fontWeight: 700, color: "#242840", textTransform: "uppercase", letterSpacing: "0.1em", fontFamily: "'Syne', sans-serif" }}>
                History
              </span>
              <span style={{ fontSize: 9, fontFamily: "'Space Mono', monospace", color: "#242840" }}>
                last {Math.min(history.length, 24)}
              </span>
            </div>
            <div style={{ display: "flex", alignItems: "flex-end", gap: 2, height: 40 }}>
              {history.slice(-24).map((h, i) => {
                const heightPct = Math.max((h.latency / maxLatency) * 100, 7);
                const color = getBarColor(h.is_up, h.latency);
                return (
                  <div
                    key={i}
                    className="bar-item"
                    title={h.is_up ? `${h.latency}ms` : "DOWN"}
                    style={{
                      height: `${heightPct}%`,
                      background: `linear-gradient(to top, ${color}88, ${color})`,
                    }}
                  />
                );
              })}
            </div>
          </div>
        )}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          paddingTop: 14, borderTop: "1px solid rgba(255,255,255,0.04)",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#242840" strokeWidth="2.2">
              <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
            </svg>
            <span style={{ fontSize: 10, color: "#2e3450", fontFamily: "'Space Mono', monospace" }}>
              {updatedAt ?? "never"}
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{
              position: "relative", width: 56, height: 3,
              borderRadius: 99, background: "rgba(255,255,255,0.05)", overflow: "hidden",
            }}>
              <div style={{
                position: "absolute", left: 0, top: 0, height: "100%",
                width: `${countdownPct}%`,
                background: `linear-gradient(90deg, rgba(${accentRgb}, 0.4), rgba(${accentRgb}, 0.9))`,
                borderRadius: 99, transition: "width 1s linear",
                boxShadow: `0 0 6px rgba(${accentRgb}, 0.5)`,
              }} />
            </div>
            <span style={{ fontSize: 10, fontFamily: "'Space Mono', monospace", fontWeight: 700, color: "#2e3450" }}>
              {mins > 0 ? `${mins}m` : ""}{String(secs).padStart(2, "0")}s
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [countdown, setCountdown] = useState(42);

  useEffect(() => {
    const t = setInterval(() => {
      setCountdown((c) => (c <= 0 ? 60 : c - 1));
    }, 1000);
    return () => clearInterval(t);
  }, []);

  return (
    <>
      <style>{styles}</style>
      <div style={{
        minHeight: "100vh",
        background: "linear-gradient(160deg, #06080e 0%, #080b12 100%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 24px",
        gap: 0,
      }}>
        <div style={{ marginBottom: 36, textAlign: "center" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginBottom: 6 }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#00e5a0", boxShadow: "0 0 10px #00e5a0" }} />
            <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, color: "#00e5a0", letterSpacing: "0.15em", textTransform: "uppercase" }}>
              monitoring · live
            </span>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#00e5a0", boxShadow: "0 0 10px #00e5a0" }} />
          </div>
          <h1 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 28, color: "#e8eaf0", margin: 0, letterSpacing: "-0.5px" }}>
            Uptime Dashboard
          </h1>
        </div>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(270px, 320px))",
          gap: 16,
          width: "100%",
          maxWidth: 1000,
          justifyContent: "center",
        }}>
          {SITES.map((site, i) => (
            <SiteCard key={site.id} site={site} nextScanIn={Math.max(0, countdown - i * 14)} />
          ))}
        </div>
      </div>
    </>
  );
}