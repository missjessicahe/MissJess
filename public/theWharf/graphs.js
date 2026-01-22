/* =========================================================
   FILE: graphs.js
   - AspirationsGraph + SVG helpers
========================================================= */

function withLifeXP(history) {
  if (!history || history.length === 0) return [];
  return history.map((p, i) => {
    const prev = i > 0 ? history[i - 1].villagerXP : p.villagerXP;
    const lifeXP = p.villagerXP - prev; // ROC
    return { ...p, lifeXP };
  });
}

function normalizeSeries(points, key, height, padY = 10) {
  const vals = points.map(p => p[key]);
  const min = Math.min(...vals);
  const max = Math.max(...vals);
  const span = (max - min) || 1;

  return points.map((p) => {
    const t = (p[key] - min) / span;
    const y = padY + (1 - t) * (height - padY*2);
    return { ...p, _y: y };
  });
}

function toPath(points, width, height, key) {
  if (!points || points.length < 2) return "";
  const n = points.length;
  const padX = 10;
  const spanX = width - padX*2;

  const withY = normalizeSeries(points, key, height, 12);

  const coords = withY.map((p, i) => {
    const x = padX + (i / (n - 1)) * spanX;
    return { x, y: p._y };
  });

  return coords
    .map((c, i) => `${i === 0 ? "M" : "L"} ${c.x.toFixed(2)} ${c.y.toFixed(2)}`)
    .join(" ");
}

function AspirationsGraph({ history }) {
  const points = withLifeXP(history || []);
  const width = 620;
  const height = 220;

  const villagerPath = toPath(points, width, height, "villagerXP");
  const lifePath = toPath(points, width, height, "lifeXP");

  const last = points[points.length - 1] || { villagerXP: 0, lifeXP: 0 };
  const peak = points.length ? points.reduce((m, p) => Math.max(m, p.villagerXP), -Infinity) : 0;
  const trough = points.length ? points.reduce((m, p) => Math.min(m, p.villagerXP), Infinity) : 0;

  const normVillager = normalizeSeries(points, "villagerXP", height, 12);

  return (
    <div className="graphWrap">
      <div className="graphHeader">
        <div className="legend">
          <span className="legendItem">
            <span className="swatch"></span> Villager XP
          </span>
          <span className="legendItem">
            <span className="swatch warm"></span> Life XP (ROC)
          </span>
        </div>
      </div>

      <svg width="100%" viewBox={`0 0 ${width} ${height}`} style={{ display: "block" }}>
        <g opacity="0.35">
          {[40, 80, 120, 160, 200].map((y) => (
            <line key={y} x1="10" x2={width-10} y1={y} y2={y} stroke="rgba(175,205,235,0.7)" />
          ))}
        </g>

        <path d={villagerPath} fill="none" stroke="rgba(110,147,238,0.95)" strokeWidth="4" strokeLinecap="round" />
        <path d={lifePath} fill="none" stroke="rgba(243,196,216,0.95)" strokeWidth="4" strokeLinecap="round" />

        {points.map((p, i) => {
          const x = 10 + (i / Math.max(1, points.length - 1)) * (width - 20);
          const y = normVillager[i]?._y ?? 0;
          return (
            <circle
              key={p.day}
              cx={x}
              cy={y}
              r="5.5"
              fill="white"
              stroke="rgba(110,147,238,0.95)"
              strokeWidth="3"
            />
          );
        })}
      </svg>

      <div className="miniStatRow">
        <div className="miniStat">Current XP: <b>{last.villagerXP}</b></div>
        <div className="miniStat">Life XP (ROC): <b>{last.lifeXP >= 0 ? `+${last.lifeXP}` : last.lifeXP}</b></div>
        <div className="miniStat">Peak: <b>{peak}</b></div>
        <div className="miniStat">Trough: <b>{trough}</b></div>
      </div>

      <div className="small" style={{ marginTop: 10 }}>
        Life XP = day-to-day rate of change (ROC) of villager XP.
      </div>
    </div>
  );
}

