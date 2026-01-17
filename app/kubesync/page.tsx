// app/kubesync/page.tsx
type RepoInfo = {
  stargazers_count: number;
  forks_count: number;
  updated_at: string;
  html_url: string;
};

const REPO_API = "https://api.github.com/repos/missjessicahe/KubeSync";

export default async function KubeSyncPage() {
  let repo: RepoInfo | null = null;

  try {
    const res = await fetch(REPO_API, { next: { revalidate: 3600 } });
    if (res.ok) repo = (await res.json()) as RepoInfo;
  } catch {
    repo = null;
  }

  const updated = repo?.updated_at
    ? new Date(repo.updated_at).toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : null;

  return (
    <>
      <main className="wrap">
        <header className="top">
          <a className="back" href="/">
            ← back home
          </a>

          <div className="miniNav">
            <a className="miniPill" href="/whimsical">
              Whimsical →
            </a>
            <a className="miniPill" href="/kubecard">
              KubeCard →
            </a>
          </div>
        </header>

        <section className="hero glass">
          <div className="badge">📻 project</div>
          <h1>KubeSync</h1>

          <p>
            A resilience + comms prototype page. The goal: keep the “what it is / why it matters / what changed”
            story clean, readable, and alive with commits.
          </p>

          {repo && (
            <div className="repoPills" aria-label="Repository stats">
              <span className="pill">⭐ {repo.stargazers_count.toLocaleString()}</span>
              <span className="pill">⚡️ {repo.forks_count.toLocaleString()}</span>
              {updated && <span className="pill">🫧 updated {updated}</span>}
            </div>
          )}

          <div className="row">
            <a
              className="btn primary"
              href="https://github.com/missjessicahe/KubeSync"
              target="_blank"
              rel="noreferrer"
            >
              GitHub ↗
            </a>
            <a className="btn" href="/">
              Journal
            </a>
          </div>
        </section>

        <section className="grid">
          <div className="card glass">
            <h3>Core idea</h3>
            <p>
              Lightweight systems that still feel dependable when conditions aren’t perfect.
            </p>
          </div>

          <div className="card glass">
            <h3>What to show here</h3>
            <ul>
              <li>1–2 paragraph overview</li>
              <li>Architecture sketch</li>
              <li>Demo links / screenshots</li>
            </ul>
          </div>

          <div className="card glass">
            <h3>Next small ship</h3>
            <p>
              Add a weekly “changes” section — 3 bullets max — so your progress stays visible.
            </p>
          </div>
        </section>

        <footer className="foot">
          <div className="footCard glass">
            <span className="muted">missjess.co</span>
            <span className="dot">·</span>
            <a
              href="https://github.com/missjessicahe/KubeSync"
              target="_blank"
              rel="noreferrer"
              className="muted"
            >
              repo
            </a>
          </div>
        </footer>

        <div className="bubbles" aria-hidden="true">
          <span className="b b1" />
          <span className="b b2" />
          <span className="b b3" />
          <span className="b b4" />
          <span className="b b5" />
        </div>
      </main>

      <style>{baseStyles}</style>
    </>
  );
}

const baseStyles = `
  :root{
    --bg1:#e8f4ff;
    --bg2:#cfe9ff;
    --bg3:#b7ddff;
    --ink:#0b1a2a;
    --muted:rgba(11,26,42,.72);
    --glass:rgba(255,255,255,.58);
    --stroke:rgba(255,255,255,.5);
    --shadow2: 0 10px 30px rgba(20,60,110,.14);
    --radius: 22px;
  }

  *{ box-sizing:border-box; }
  body{
    margin:0;
    color:var(--ink);
    font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial;
    background:
      radial-gradient(1200px 600px at 10% 10%, #ffffff 0%, transparent 60%),
      radial-gradient(900px 500px at 90% 15%, rgba(255,255,255,.9) 0%, transparent 65%),
      linear-gradient(180deg, var(--bg1), var(--bg2) 45%, var(--bg3));
    overflow-x:hidden;
  }
  a{ color:inherit; text-decoration:none; }

  .glass{
    background: var(--glass);
    border: 1px solid var(--stroke);
    box-shadow: var(--shadow2);
    backdrop-filter: blur(14px);
    -webkit-backdrop-filter: blur(14px);
    border-radius: var(--radius);
  }

  .wrap{
    position:relative;
    max-width: 980px;
    margin: 0 auto;
    padding: 28px 18px 44px;
  }

  .top{
    display:flex;
    align-items:center;
    justify-content:space-between;
    gap:12px;
    margin-bottom:14px;
    position:relative;
    z-index:2;
  }

  .miniNav{ display:flex; gap:10px; flex-wrap:wrap; justify-content:flex-end; }
  .miniPill{
    padding: 10px 12px;
    border-radius: 999px;
    background: rgba(255,255,255,.35);
    border: 1px solid rgba(255,255,255,.65);
    box-shadow: 0 10px 20px rgba(20,60,110,.08);
    font-size: 14px;
  }

  .back{
    display:inline-block;
    padding: 10px 12px;
    border-radius: 999px;
    background: rgba(255,255,255,.35);
    border: 1px solid rgba(255,255,255,.65);
    box-shadow: 0 10px 20px rgba(20,60,110,.08);
    font-size: 14px;
  }

  .hero{
    padding: 18px 18px 16px;
    position:relative;
    z-index:2;
  }

  .badge{
    display:inline-block;
    padding: 7px 10px;
    border-radius: 999px;
    background: rgba(255,255,255,.4);
    border: 1px solid rgba(255,255,255,.65);
    color: rgba(11,26,42,.8);
    font-size: 13px;
    margin-bottom: 10px;
  }

  h1{
    margin: 0 0 8px;
    letter-spacing:-.03em;
    font-size: 40px;
  }

  p, li{ color: var(--muted); line-height:1.6; }

  .repoPills{
    display:flex;
    flex-wrap:wrap;
    gap:8px;
    margin: 10px 0 12px;
  }

  .pill{
    font-size: 12.5px;
    color: rgba(11,26,42,.78);
    padding: 7px 10px;
    border-radius: 999px;
    background: rgba(255,255,255,.4);
    border: 1px solid rgba(255,255,255,.65);
  }

  .row{
    display:flex;
    gap:10px;
    flex-wrap:wrap;
    margin-top: 8px;
  }

  .btn{
    padding: 11px 14px;
    border-radius: 14px;
    border: 1px solid rgba(255,255,255,.7);
    background: rgba(255,255,255,.38);
    box-shadow: 0 12px 26px rgba(20,60,110,.10);
    font-weight: 650;
    font-size: 14px;
    transition: transform .15s ease;
  }

  .btn:hover{ transform: translateY(-1px); }

  .btn.primary{
    background: linear-gradient(180deg, rgba(255,255,255,.75), rgba(255,255,255,.35));
  }

  .grid{
    position:relative;
    z-index:2;
    display:grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 14px;
    margin-top: 14px;
  }

  .card{ padding: 16px; }
  h3{ margin: 0 0 6px; letter-spacing:-.02em; }

  .foot{ position:relative; z-index:2; margin-top: 16px; }
  .footCard{
    display:flex;
    justify-content:center;
    gap:10px;
    padding: 12px 14px;
    font-size: 13.5px;
  }
  .muted{ color: rgba(11,26,42,.72); }
  .dot{ opacity:.55; }

  .bubbles{ position:absolute; inset:0; pointer-events:none; z-index:1; }
  .b{
    position:absolute;
    border-radius:999px;
    background: radial-gradient(circle at 30% 30%, rgba(255,255,255,.95), rgba(255,255,255,.35) 55%, rgba(255,255,255,.12));
    box-shadow: 0 20px 50px rgba(0,0,0,.08);
    animation: floaty 10s ease-in-out infinite;
  }
  .b1{ width:140px; height:140px; left:-30px; top:120px; animation-duration:12s; }
  .b2{ width:90px; height:90px; right:40px; top:110px; animation-duration:9s; }
  .b3{ width:170px; height:170px; right:-60px; top:360px; animation-duration:14s; }
  .b4{ width:110px; height:110px; left:120px; bottom:110px; animation-duration:11s; }
  .b5{ width:70px; height:70px; left:58%; top:58%; animation-duration:8s; }

  @keyframes floaty{
    0%,100%{ transform: translateY(0) translateX(0) scale(1); }
    50%{ transform: translateY(-16px) translateX(10px) scale(1.03); }
  }

  @media (max-width: 900px){
    .grid{ grid-template-columns: 1fr; }
    h1{ font-size: 34px; }
    .top{ flex-direction:column; align-items:flex-start; }
    .miniNav{ justify-content:flex-start; }
  }
`;
