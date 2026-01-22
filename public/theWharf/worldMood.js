/* =========================================================
   FILE: worldMood.js
   - WorldMood component (sliders + tier)
========================================================= */

function WorldMood({ dreams, setDreams, jealousy, setJealousy, smog, tier }) {
  return (
    <div className="panel soft">
      <h2>🌤️ World Mood</h2>
      <p className="kicker">Live SMOG telemetry (testable with sliders).</p>

      <div className="statLine">
        <div>
          <div className="label">Dreams (D)</div>
          <div className="small">ambition + wellbeing-driven progress</div>
        </div>
        <div className="bigValue breathe">{dreams}</div>
      </div>

      <div className="statLine">
        <div>
          <div className="label">Jealousy (J)</div>
          <div className="small">resentment + rivalry pressure</div>
        </div>
        <div className="bigValue breathe">{jealousy}</div>
      </div>

      <div className="statLine">
        <div>
          <div className="label">SMOG</div>
          <div className="math">max(0, J − D)</div>
        </div>
        <div className="bigValue breathe">{smog}</div>
      </div>

      <div className="row" style={{ marginTop: 6 }}>
        <span className={"badge " + (tier <= 1 ? "ok" : tier === 2 ? "warn" : "danger")}>
          Tier {tier}: {tierLabel(tier)}
        </span>
      </div>

      <PercentBar
        title="Adjust Dreams"
        value={dreams}
        onChange={(v) => setDreams(v)}
        variant="cool"
        hint="Dreams = ambition + wellbeing-driven progress (try lowering to see SMOG rise)."
      />

      <PercentBar
        title="Adjust Jealousy"
        value={jealousy}
        onChange={(v) => setJealousy(v)}
        variant="warm"
        hint="Jealousy = resentment + rivalry pressure (try raising to trigger warnings)."
      />
    </div>
  );
}

