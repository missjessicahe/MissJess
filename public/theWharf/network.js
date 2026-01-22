/* =========================================================
   FILE: network.js
   - NetworkPanel component (form)
========================================================= */

function NetworkPanel({ network, setNetwork }) {
  return (
    <div className="panel">
      <h2>📡 Network</h2>
      <p className="kicker">How players reach your world.</p>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          alert("Saved Network Config (UI demo). Later: POST /config/network");
        }}
      >
        <div className="formGrid">
          <div className="field">
            <label>Port</label>
            <input
              className="input"
              type="number"
              min="1"
              max="65535"
              value={network.port}
              onChange={(e) => setNetwork({ ...network, port: e.target.value })}
              placeholder="25565"
            />
          </div>

          <div className="field">
            <label>Router Status</label>
            <select
              className="input"
              value={network.routerStatus}
              onChange={(e) => setNetwork({ ...network, routerStatus: e.target.value })}
            >
              <option value="configured">configured</option>
              <option value="not_configured">not configured</option>
              <option value="unknown">unknown</option>
            </select>
          </div>

          <div className="field">
            <label>Local IP</label>
            <input
              className="input"
              value={network.localIp}
              onChange={(e) => setNetwork({ ...network, localIp: e.target.value })}
              placeholder="192.168.1.24"
            />
          </div>

          <div className="field">
            <label>Public IP (optional)</label>
            <input
              className="input"
              value={network.publicIp}
              onChange={(e) => setNetwork({ ...network, publicIp: e.target.value })}
              placeholder="73.12.45.99"
            />
          </div>
        </div>

        <div className="formActions">
          <button className="btn primary" type="submit">Save Network Config</button>
          <button
            className="btn"
            type="button"
            onClick={() => alert("Later: show port-forward guide modal.")}
          >
            Port-Forward Guide
          </button>
        </div>

        <p className="helper" style={{ marginTop: 10 }}>
          In the real app: your Java server can auto-detect local IP + check if port is reachable.
        </p>
      </form>
    </div>
  );
}

