/* =========================================================
   FILE: warnings.js
   - WarningsPanel (API-ready warnings log)
   - Pulls from backend and appends new warnings as they occur
   - Includes: polling + optional SSE (EventSource) support
   - You can wire to your Java server:
       GET  /api/warnings?since=<iso>
       POST /api/warnings/ack   (optional)
       GET  /api/warnings/stream (optional SSE)

   Expected warning shape:
   {
     id: "warn_000123",            // unique + stable
     ts: "2026-01-22T14:18:00Z",   // ISO timestamp
     mc_day: 216,                  // minecraft day (int)
     mc_hour: 9,                   // 0-23 (int)
     tier: 2,                      // 0-4 (int)
     code: "WEATHER_THUNDER",      // machine code
     title: "Thunderstorm",        // short title
     message: "Lightning strikes increased near the market.",
     severity: "warn",             // "ok" | "warn" | "danger"
     tags: ["weather","thunder"],  // optional
     source: "server",             // optional
     meta: { smog: 12, biome: "plains" } // optional
   }

========================================================= */

function formatTs(iso) {
  if (!iso) return "";
  try {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return iso;
    return d.toLocaleString();
  } catch {
    return iso;
  }
}

function clamp(n, a, b) {
  return Math.max(a, Math.min(b, n));
}

function severityToClass(sev, tier) {
  const s = (sev || "").toLowerCase();
  if (s === "danger" || s === "error" || tier >= 3) return "danger";
  if (s === "warn" || tier === 2) return "warn";
  return "ok";
}

function buildDefaultWarningFromTier(tier) {
  // fallback banner when no log is available
  return {
    id: "tier_fallback",
    ts: new Date().toISOString(),
    mc_day: null,
    mc_hour: null,
    tier,
    code: "TIER_STATUS",
    title: `Tier ${tier}: ${tierLabel(tier)}`,
    message: tierMessage(tier),
    severity: tier <= 1 ? "ok" : tier === 2 ? "warn" : "danger",
    tags: ["system"],
    source: "ui",
    meta: {}
  };
}

/**
 * Contract:
 * GET /api/warnings?since=<iso>
 * Response: { items: Warning[], serverTime?: iso }
 *
 * Backend should return warnings newer than `since`
 * sorted ascending by ts, and stable `id`s.
 */
async function fetchWarningsSince(sinceIso) {
  const url = sinceIso
    ? `/api/warnings?since=${encodeURIComponent(sinceIso)}`
    : `/api/warnings`;

  const res = await fetch(url, { headers: { "Accept": "application/json" } });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`fetchWarningsSince failed (${res.status}): ${text || res.statusText}`);
  }
  const data = await res.json();
  const items = Array.isArray(data?.items) ? data.items : [];
  return items;
}

/**
 * Optional:
 * POST /api/warnings/ack
 * Body: { ids: string[] }
 */
async function ackWarnings(ids) {
  if (!ids?.length) return;
  try {
    await fetch("/api/warnings/ack", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids })
    });
  } catch {
    // non-blocking (optional feature)
  }
}

function WarningsPanel({
  tier,
  // API config
  apiBase = "",               // optional prefix like "http://localhost:8080"
  pollMs = 2500,              // polling interval
  maxItems = 80,              // keep list lightweight
  useSSE = false,             // turn on SSE if backend supports it
  showControls = true         // show pause/clear/ack UI
}) {
  const [items, setItems] = React.useState([]);
  const [paused, setPaused] = React.useState(false);
  const [error, setError] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  // Track latest timestamp we've seen so we only request deltas
  const [since, setSince] = React.useState(null);

  // For "new items" indicator
  const [newCount, setNewCount] = React.useState(0);

  // Apply apiBase by temporarily wrapping fetch if needed
  // (simple + safe: only prepend if apiBase is non-empty and url starts with "/")
  const apiFetch = React.useCallback((url, opts) => {
    const u = apiBase && url.startsWith("/") ? `${apiBase}${url}` : url;
    return fetch(u, opts);
  }, [apiBase]);

  async function pullOnce() {
    if (paused) return;
    setLoading(true);
    setError("");

    try {
      const url = since
        ? `/api/warnings?since=${encodeURIComponent(since)}`
        : `/api/warnings`;

      const res = await apiFetch(url, { headers: { "Accept": "application/json" } });
      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(`GET ${url} (${res.status}): ${text || res.statusText}`);
      }
      const data = await res.json();
      const incoming = Array.isArray(data?.items) ? data.items : [];

      if (incoming.length) {
        // de-dupe by id (stable ids are important)
        setItems((prev) => {
          const seen = new Set(prev.map(x => x.id));
          const merged = [...prev];

          for (const w of incoming) {
            if (w?.id && !seen.has(w.id)) merged.push(w);
          }

          // sort by ts ascending (stable display)
          merged.sort((a, b) => (new Date(a.ts) - new Date(b.ts)));

          // cap length
          const trimmed = merged.slice(-maxItems);

          return trimmed;
        });

        // update "since" to latest ts we got
        const latest = incoming
          .map(w => w.ts)
          .filter(Boolean)
          .sort((a, b) => (new Date(a) - new Date(b)))[incoming.length - 1];

        if (latest) setSince(latest);

        setNewCount((c) => c + incoming.length);
      } else {
        // if backend returns serverTime, you can set since to serverTime on first pull
        if (!since && data?.serverTime) setSince(data.serverTime);
      }
    } catch (e) {
      setError(e?.message || "Failed to load warnings.");
    } finally {
      setLoading(false);
    }
  }

  // Polling loop
  React.useEffect(() => {
    let t = null;
    // initial pull
    pullOnce();

    t = setInterval(() => {
      pullOnce();
    }, clamp(pollMs, 800, 20000));

    return () => clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pollMs, paused, since, apiFetch]); // keep it simple for browser+babel env

  // Optional SSE stream: /api/warnings/stream
  React.useEffect(() => {
    if (!useSSE) return;
    if (paused) return;

    let es = null;
    try {
      const url = apiBase ? `${apiBase}/api/warnings/stream` : "/api/warnings/stream";
      es = new EventSource(url);
      es.onmessage = (evt) => {
        try {
          const w = JSON.parse(evt.data);
          if (!w?.id) return;

          setItems((prev) => {
            if (prev.some(x => x.id === w.id)) return prev;
            const merged = [...prev, w].sort((a, b) => (new Date(a.ts) - new Date(b.ts)));
            return merged.slice(-maxItems);
          });

          if (w.ts) setSince(w.ts);
          setNewCount((c) => c + 1);
        } catch {
          // ignore malformed stream messages
        }
      };
      es.onerror = () => {
        // keep polling as fallback; just show a tiny hint
        setError((prev) => prev || "SSE stream error (polling continues).");
      };
    } catch {
      setError((prev) => prev || "SSE stream unavailable (polling continues).");
    }

    return () => {
      if (es) es.close();
    };
  }, [useSSE, paused, apiBase, maxItems]);

  function clearLog() {
    setItems([]);
    setNewCount(0);
  }

  async function ackAll() {
    const ids = items.map(x => x.id).filter(Boolean);
    await ackWarnings(ids);
    // you can also visually mark acked instead of clearing
    clearLog();
  }

  const displayItems = items.length ? items : [buildDefaultWarningFromTier(tier)];

  return (
    <div className="panel">
      <div className="row" style={{ justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h2 style={{ marginBottom: 4 }}>⚠️ Warnings Log</h2>
          <p className="kicker" style={{ marginTop: 0 }}>
            Append-only events from the server (weather, raids, SMOG/pollution pressure, epidemics).
          </p>
        </div>

        {showControls && (
          <div className="row" style={{ gap: 8 }}>
            <span className="pill">
              {loading ? "syncing…" : "live"} • {newCount ? <b>+{newCount}</b> : "—"}
            </span>
            <button className="btn" type="button" onClick={() => setPaused(p => !p)}>
              {paused ? "Resume" : "Pause"}
            </button>
            <button className="btn" type="button" onClick={clearLog}>
              Clear
            </button>
            <button className="btn warm" type="button" onClick={ackAll}>
              Acknowledge All
            </button>
          </div>
        )}
      </div>

      {error && (
        <div className="warningLine warn" style={{ marginTop: 10 }}>
          ⚠️ {error}
        </div>
      )}

      <div className="logList" style={{ marginTop: 10, maxHeight: 260, overflow: "auto", paddingRight: 4 }}>
        {displayItems
          .slice()
          .sort((a, b) => (new Date(b.ts) - new Date(a.ts))) // newest first
          .map((w) => {
            const cls = severityToClass(w.severity, w.tier);
            const day = (w.mc_day ?? "—");
            const hour = (w.mc_hour ?? "—");
            return (
              <div key={w.id} className={"logItem " + cls} style={{ marginBottom: 10 }}>
                <div className="logTop">
                  <div className="logTitle">
                    <b>{w.title || w.code || "Warning"}</b>{" "}
                    <span className="small">
                      • Tier {w.tier ?? tier} • Day {day} @ {hour}h
                    </span>
                  </div>
                  <div className="small">{formatTs(w.ts)}</div>
                </div>

                <div className="logMsg">{w.message || tierMessage(w.tier ?? tier)}</div>

                {Array.isArray(w.tags) && w.tags.length > 0 && (
                  <div className="tagRow">
                    {w.tags.slice(0, 6).map((t) => (
                      <span key={t} className="tag">{t}</span>
                    ))}
                  </div>
                )}

                {/* Optional debug */}
                {/* <pre className="small">{JSON.stringify(w.meta, null, 2)}</pre> */}
              </div>
            );
          })}
      </div>

      <div className="small" style={{ marginTop: 10 }}>
        Backend contract (suggested): <b>GET /api/warnings?since=ISO</b> → {"{ items: [...] }"}.
        Stable <b>id</b> + ISO <b>ts</b> lets the UI append cleanly.
      </div>
    </div>
  );
}
