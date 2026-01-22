/* =========================================================
   FILE: villageHearth.js
   - VillageHearth component
========================================================= */

function VillageHearth({ serverRunning, onStart, onStop, onRestart, onReloadChunks }) {
  return (
    <div className="panel soft">
      <h2>🏡 Village Hearth</h2>
      <p className="kicker">A cozy control panel for your SMOG village server.</p>

      <div className="row" style={{ marginBottom: 12 }}>
        <span className="pill">
          <span className={`dot ${statusDotClass(serverRunning)}`}></span>
          Status:{" "}
          <b style={{ color: serverRunning ? "var(--ok)" : "var(--warn)" }}>
            {serverRunning ? "RUNNING" : "STOPPED"}
          </b>
        </span>
      </div>

      <div className="row">
        <button className="btn primary" onClick={onStart}>Start Server</button>
        <button className="btn danger" onClick={onStop}>Stop Server</button>
        <button className="btn" onClick={onRestart}>Restart</button>
        <button className="btn warm" onClick={onReloadChunks}>Reload Chunks</button>
      </div>

      <div className="row" style={{ marginTop: 12 }}>
        <button className="btn primary" onClick={safeMinecraftOpen}>🎮 Open Minecraft</button>
      </div>

      <p className="small" style={{ marginTop: 10 }}>
        (UI demo) Later these buttons call your Java server endpoints.
      </p>
    </div>
  );
}

