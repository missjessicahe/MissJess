/* =========================================================
   FILE: portal.js
   - Cute Wharf Portal (username + token + submit)
   - No DB assumptions, stateless requests
========================================================= */

const { useMemo, useState } = React;

const PORTAL_API = ""; // base
const REGISTER_PATH = "register"; // POST /register

/* -----------------------------
   Utilities
----------------------------- */

function randomSlug(len = 4) {
  const chars = "abcdefghjkmnpqrstuvwxyz23456789";
  let out = "";
  for (let i = 0; i < len; i++) out += chars[Math.floor(Math.random() * chars.length)];
  return out;
}

function generateUsername() {
  // cute & shareable
  return `byj-${randomSlug(3)}${randomSlug(2)}-${randomSlug(3)}`;
}

function generateToken() {
  // modern browsers
  return crypto.randomUUID();
}

async function postJSON(path, payload) {
  const url = `${PORTAL_API}/${path}`;
  let res;

  try {
    res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      mode: "cors",
      body: JSON.stringify(payload)
    });
  } catch (err) {
    // Network-level error (CORS/DNS/offline)
    throw new Error(`Network error calling ${url}\n${err?.message || err}`);
  }

  let text = "";
  try { text = await res.text(); } catch { /* ignore */ }

  let data = null;
  try { data = text ? JSON.parse(text) : null; } catch { data = { raw: text }; }

  if (!res.ok) {
    const detail = data?.error || data?.message || data?.raw || text || "";
    throw new Error(`API ${res.status} at ${url}${detail ? `\n${detail}` : ""}`);
  }

  return data;
}

async function copyToClipboard(str) {
  try {
    await navigator.clipboard.writeText(str);
    return true;
  } catch {
    return false;
  }
}

/* -----------------------------
   Component
----------------------------- */

function WharfPortal() {
  const [username, setUsername] = useState("");
  const [token, setToken] = useState("");
  const [status, setStatus] = useState({ kind: "idle", msg: "" });
  const [result, setResult] = useState(null);

  const canSubmit = useMemo(() => {
    return username.trim().length >= 3 && token.trim().length >= 10;
  }, [username, token]);

  function onGenerateUsername() {
    setUsername(generateUsername());
    setStatus({ kind: "idle", msg: "" });
  }

  function onGenerateToken() {
    setToken(generateToken());
    setStatus({ kind: "idle", msg: "" });
  }

  async function onSubmit() {
    setStatus({ kind: "loading", msg: "Submitting to the Wharf ledger…" });
    setResult(null);

    try {
      const payload = {
        username: username.trim(),
        token: token.trim(),
        timestamp: Date.now()
      };

      const data = await postJSON(REGISTER_PATH, payload);
      setResult(data);

      setStatus({
        kind: "success",
        msg:
          "✅ Submitted!\n" +
          "Your username is now in the Wharf ledger.\n" +
          "Please wait at least 5 minutes for the git sync to propagate."
      });
    } catch (e) {
      setStatus({ kind: "error", msg: String(e.message || e) });
    }
  }

  return (
    <div className="wharf-shell">
      <div className="wharf-card">
        <div className="wharf-header">
          <div className="wharf-title">
            <span className="wharf-emoji">📡</span>
            <h1>The Wharf Portal</h1>
          </div>
          <p className="wharf-subtitle">
            Welcome to the Wharf — pick a username, mint a doubloon, and join the ledger.
          </p>
        </div>

        <div className="wharf-heroRow">
          <img
            className="wharf-hero"
            src="welcome.png"
            alt="The Wharf map"
          />
          <div className="wharf-heroText">
            <div className="wharf-pill">✨ byJessamine's fandom ledger</div>
            <div className="wharf-note">
              This portal is <b>memoryless</b>. Your doubloon stays local.
              <br />
              Usernames are shareable. Doubloons are not.
            </div>
          </div>
        </div>

        <div className="wharf-form">
          {/* Username */}
          <div className="wharf-field">
            <label>Choose a username</label>
            <div className="wharf-row">
              <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="byj-xxxxx-xxx"
              />
              <button className="wharf-btn" onClick={onGenerateUsername}>
                Generate
              </button>
            </div>
            <div className="wharf-hint">
              Share this username so others can look up your server’s progress.
            </div>
          </div>

          {/* Token */}
          <div className="wharf-field">
            <label>Generate a doubloon (local only)</label>
            <div className="wharf-row">
              <input
                value={token}
                onChange={(e) => setToken(e.target.value)}
                placeholder="click 'generate doubloon'…"
              />
              <button className="wharf-btn" onClick={onGenerateToken}>
                Generate Doubloon
              </button>
              <button
                className="wharf-btn ghost"
                onClick={async () => {
                  if (!token) return;
                  const ok = await copyToClipboard(token);
                  setStatus({
                    kind: ok ? "success" : "error",
                    msg: ok ? "📋 Token copied." : "Couldn’t copy token — copy manually."
                  });
                }}
                disabled={!token}
                title="Copy token"
              >
                Copy
              </button>
            </div>
            <div className="wharf-hint">
              Keep this locally. The server never needs to store it.
            </div>
          </div>

          {/* Submit */}
          <div className="wharf-actions">
            <button
              className="wharf-btn primary"
              onClick={onSubmit}
              disabled={!canSubmit || status.kind === "loading"}
            >
              Submit name to the Portal
            </button>

            <a className="wharf-btn link" href="index.html">
              Go to the View →
            </a>
          </div>

          {/* Status */}
          {status.kind !== "idle" && (
            <div className={`wharf-status ${status.kind}`}>
              <pre>{status.msg}</pre>
            </div>
          )}

          {/* Result */}
          {result && (
            <details className="wharf-result">
              <summary>Response payload</summary>
              <pre>{JSON.stringify(result, null, 2)}</pre>
            </details>
          )}

          <div className="wharf-footer">
            <span>⏳ After submitting, wait <b>at least 5 minutes</b> before refreshing (git sync).</span>
          </div>
        </div>
      </div>
    </div>
  );
}

window.WharfPortal = WharfPortal;
