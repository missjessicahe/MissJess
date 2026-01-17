// app/kubesync/page.tsx
type RepoInfo = {
  stargazers_count: number;
  forks_count: number;
  updated_at: string;
  html_url: string;
};

const REPO_API = "https://api.github.com/repos/missjessicahe/KubeSync";

function fmtDate(iso?: string) {
  if (!iso) return null;
  return new Date(iso).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default async function KubeSyncPage() {
  let repo: RepoInfo | null = null;
  try {
    const res = await fetch(REPO_API, { next: { revalidate: 3600 } });
    if (res.ok) repo = (await res.json()) as RepoInfo;
  } catch {
    repo = null;
  }
  const updated = fmtDate(repo?.updated_at);

  return (
    <>
      <div className="syncPage">
        <main className="syncWrap">
          <header className="syncTop">
            <a className="syncBack" href="/">
              ← home
            </a>

            <div className="syncNav">
              <a className="syncChipLink" href="/whimsical">
                Whimsical →
              </a>
              <a className="syncChipLink" href="/kubecard">
                KubeCard →
              </a>
              <a
                className="syncChipLink"
                href="https://github.com/missjessicahe"
                target="_blank"
                rel="noreferrer"
              >
                GitHub ↗
              </a>
            </div>
          </header>

          <section className="syncHero syncGlass">
            <div className="syncBadge">📡 concept</div>

            <div className="syncHeroGrid">
              <div>
                <h1 className="syncH1">KubeSync</h1>
                <p className="syncLead">
                  A resilience + comms prototype mindset: lightweight systems, survivable updates,
                  and tooling that stays calm under stress.
                </p>

                <div className="syncChips">
                  {repo ? (
                    <>
                      <span className="syncChip">⭐ {repo.stargazers_count.toLocaleString()}</span>
                      <span className="syncChip">⚡ {repo.forks_count.toLocaleString()}</span>
                      {updated && <span className="syncChip">🫧 updated {updated}</span>}
                    </>
                  ) : (
                    <>
                      <span className="syncChip">🫧 git-backed</span>
                      <span className="syncChip">🔁 update loop</span>
                      <span className="syncChip">🧊 calm UI</span>
                    </>
                  )}
                </div>

                <div className="syncRow">
                  <a
                    className="syncBtn syncBtnPrimary"
                    href={repo?.html_url ?? "https://github.com/missjessicahe"}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Open repo ↗
                  </a>
                  <a className="syncBtn" href="/journal">
                    See build notes →
                  </a>
                </div>
              </div>

              <div className="syncRight">
                <div className="syncPanel syncGlass">
                  <div className="syncPanelTitle">What it is</div>
                  <p className="syncP">
                    A landing page for the KubeSync idea: concepts, small demos, and a weekly log of
                    what changed.
                  </p>

                  <div className="syncSplit">
                    <div className="syncTiny">
                      <div className="syncTinyK">Constraint</div>
                      <div className="syncTinyV">No fragile dependencies</div>
                    </div>
                    <div className="syncTiny">
                      <div className="syncTinyK">Rule</div>
                      <div className="syncTinyV">small changes, often</div>
                    </div>
                  </div>
                </div>

                <div className="syncViz syncGlass" aria-hidden="true">
                  <div className="syncVizTop">
                    <span className="syncDot r" />
                    <span className="syncDot y" />
                    <span className="syncDot g" />
                    <span className="syncVizLabel">signal map</span>
                  </div>

                  <div className="syncVizBody">
                    <div className="syncGridlines" />
                    <div className="syncNode n1" />
                    <div className="syncNode n2" />
                    <div className="syncNode n3" />
                    <div className="syncNode n4" />
                    <div className="syncWave" />
                    <div className="syncVizText">resilience is a system, not a feature.</div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="syncCards">
            <div className="syncCard syncGlass">
              <h3 className="syncH3">Principles</h3>
              <ul className="syncList">
                <li>ship the smallest working loop</li>
                <li>prefer readable artifacts over hidden state</li>
                <li>design for “bad network days”</li>
              </ul>
            </div>

            <div className="syncCard syncGlass">
              <h3 className="syncH3">Modules (planned)</h3>
              <ul className="syncList">
                <li>Status + health pings</li>
                <li>Event log feed (commit-backed)</li>
                <li>Mini demo widgets</li>
              </ul>
            </div>

            <div className="syncCard syncGlass">
              <h3 className="syncH3">One sentence</h3>
              <p className="syncP">
                Build systems that stay kind under pressure — and they’ll stay alive in real life.
              </p>

              <div className="syncQuote">
                <span className="syncQuoteMark">✦</span>
                <span className="syncQuoteText">calm surface, strong backbone.</span>
              </div>
            </div>
          </section>

          <footer className="syncFoot">
            <div className="syncFootCard syncGlass">
              <span className="syncMuted">missjess.co</span>
              <span className="syncDotSep">·</span>
              <span className="syncMuted">kubesync</span>
              <span className="syncDotSep">·</span>
              <a
                className="syncMuted"
                href={repo?.html_url ?? "https://github.com/missjessicahe"}
                target="_blank"
                rel="noreferrer"
              >
                repo ↗
              </a>
            </div>
          </footer>
        </main>

        <div className="syncBubbles" aria-hidden="true">
          <span className="syncB b1" />
          <span className="syncB b2" />
          <span className="syncB b3" />
          <span className="syncB b4" />
          <span className="syncB b5" />
        </div>
      </div>

      <style>{styles}</style>
    </>
  );
}

const styles = `
.syncPage{
  --bg1:#eaf6ff;
  --bg2:#d4ecff;
  --bg3:#bfe1ff;
  --ink:#0b1a2a;
  --muted:rgba(11,26,42,.72);
  --glass:rgba(255,255,255,.56);
  --stroke:rgba(255,255,255,.52);
  --shadow: 0 18px 40px rgba(20,60,110,.12);
  --radius: 22px;

  min-height:100vh;
  color:var(--ink);
  background:
    radial-gradient(1200px 560px at 12% 12%, rgba(255,255,255,.95), transparent 60%),
    radial-gradient(900px 520px at 88% 15%, rgba(255,255,255,.88), transparent 62%),
    linear-gradient(180deg, var(--bg1), var(--bg2) 45%, var(--bg3));
  overflow-x:hidden;
  position:relative;
}
.syncPage *{ box-sizing:border-box; }
.syncPage a{ color:inherit; text-decoration:none; }

.syncGlass{
  background: var(--glass);
  border: 1px solid var(--stroke);
  border-radius: var(--radius);
  box-shadow: var(--shadow);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
}

.syncWrap{
  position:relative;
  max-width: 1040px;
  margin: 0 auto;
  padding: 28px 18px 52px;
  z-index:2;
}

.syncTop{
  display:flex;
  justify-content:space-between;
  align-items:center;
  gap:12px;
}
.syncBack, .syncChipLink{
  padding: 10px 12px;
  border-radius: 999px;
  border: 1px solid rgba(255,255,255,.65);
  background: rgba(255,255,255,.35);
  box-shadow: 0 10px 20px rgba(20,60,110,.08);
  font-size: 14px;
  font-weight: 650;
  display:inline-flex;
  align-items:center;
  gap:8px;
}
.syncNav{ display:flex; gap:10px; flex-wrap:wrap; justify-content:flex-end; }

.syncHero{
  margin-top: 14px;
  padding: 18px;
  position:relative;
  overflow:hidden;
}
.syncHero:before{
  content:"";
  position:absolute; inset:-40%;
  background:
    radial-gradient(circle at 20% 25%, rgba(255,255,255,.70), transparent 55%),
    radial-gradient(circle at 70% 30%, rgba(255,255,255,.60), transparent 60%),
    radial-gradient(circle at 40% 80%, rgba(255,255,255,.45), transparent 58%);
  filter: blur(16px);
  opacity:.75;
  animation: syncDrift 9s ease-in-out infinite;
}
@keyframes syncDrift{
  0%,100%{ transform: translate(0,0) scale(1); }
  50%{ transform: translate(18px,-10px) scale(1.03); }
}

.syncBadge{
  position:relative;
  display:inline-flex;
  align-items:center;
  gap:8px;
  padding: 7px 10px;
  border-radius: 999px;
  border: 1px solid rgba(255,255,255,.65);
  background: rgba(255,255,255,.40);
  color: rgba(11,26,42,.82);
  font-size: 13px;
  font-weight: 750;
  z-index:1;
}

.syncHeroGrid{
  position:relative;
  z-index:1;
  display:grid;
  grid-template-columns: 1.12fr .88fr;
  gap: 14px;
  margin-top: 10px;
}

.syncH1{
  margin: 0 0 8px;
  font-size: 44px;
  letter-spacing:-.04em;
  line-height:1.05;
}
.syncLead{ margin: 0; color: var(--muted); line-height:1.65; font-size: 16px; }

.syncChips{ display:flex; flex-wrap:wrap; gap:8px; margin-top: 12px; }
.syncChip{
  font-size: 12.5px;
  font-weight: 750;
  color: rgba(11,26,42,.78);
  padding: 7px 10px;
  border-radius: 999px;
  background: rgba(255,255,255,.40);
  border: 1px solid rgba(255,255,255,.65);
}

.syncRow{ display:flex; gap:10px; flex-wrap:wrap; margin-top: 12px; }
.syncBtn{
  padding: 11px 14px;
  border-radius: 14px;
  border: 1px solid rgba(255,255,255,.70);
  background: rgba(255,255,255,.38);
  box-shadow: 0 12px 26px rgba(20,60,110,.10);
  font-weight: 750;
  font-size: 14px;
  transition: transform .15s ease;
}
.syncBtn:hover{ transform: translateY(-1px); }
.syncBtnPrimary{ background: linear-gradient(180deg, rgba(255,255,255,.80), rgba(255,255,255,.33)); }

.syncRight{ display:grid; gap: 12px; }
.syncPanel{ padding: 14px; }
.syncPanelTitle{ font-weight: 900; letter-spacing:-.02em; margin-bottom: 8px; }
.syncP{ margin: 0; color: var(--muted); line-height:1.65; }
.syncSplit{ display:grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-top: 12px; }
.syncTiny{
  border-radius: 16px;
  border: 1px solid rgba(255,255,255,.6);
  background: rgba(255,255,255,.26);
  padding: 10px;
}
.syncTinyK{ font-weight: 900; font-size: 12.5px; opacity:.82; }
.syncTinyV{ margin-top: 6px; font-weight: 800; opacity:.78; font-size: 13px; }

.syncViz{ overflow:hidden; }
.syncVizTop{
  display:flex; align-items:center; gap:8px;
  padding: 10px 12px;
  border-bottom: 1px solid rgba(255,255,255,.55);
  background: rgba(255,255,255,.32);
}
.syncDot{ width:10px; height:10px; border-radius:999px; }
.syncDot.r{ background: rgba(255,70,70,.85); }
.syncDot.y{ background: rgba(255,200,70,.90); }
.syncDot.g{ background: rgba(90,220,140,.90); }
.syncVizLabel{ margin-left: 6px; font-weight: 900; font-size: 12px; opacity:.78; }

.syncVizBody{
  position:relative;
  padding: 14px;
  min-height: 160px;
  overflow:hidden;
}
.syncGridlines{
  position:absolute; inset:-20%;
  background:
    linear-gradient(rgba(255,255,255,.18) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255,255,255,.18) 1px, transparent 1px);
  background-size: 26px 26px;
  filter: blur(.2px);
  opacity:.65;
}
.syncNode{
  position:absolute;
  width: 14px; height: 14px;
  border-radius: 999px;
  border: 1px solid rgba(255,255,255,.65);
  background: rgba(255,255,255,.75);
  box-shadow: 0 12px 24px rgba(20,60,110,.10);
}
.syncNode.n1{ left: 22px; top: 72px; }
.syncNode.n2{ left: 44%; top: 34px; width: 16px; height: 16px; }
.syncNode.n3{ right: 28px; top: 76px; }
.syncNode.n4{ left: 52%; bottom: 22px; }

.syncWave{
  position:absolute; inset:0;
  background:
    radial-gradient(220px 140px at 30% 52%, rgba(255,255,255,.55), transparent 60%),
    radial-gradient(240px 160px at 70% 56%, rgba(255,255,255,.45), transparent 62%);
  filter: blur(16px);
  opacity:.75;
  animation: syncWave 7.5s ease-in-out infinite;
}
@keyframes syncWave{
  0%,100%{ transform: translate(0,0) scale(1); }
  50%{ transform: translate(16px,-10px) scale(1.04); }
}

.syncVizText{
  position:relative;
  z-index:1;
  margin-top: 100px;
  text-align:center;
  font-weight: 850;
  opacity:.78;
  font-size: 13.5px;
}

.syncCards{
  margin-top: 14px;
  display:grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 14px;
}
.syncCard{ padding: 16px; }
.syncH3{ margin:0 0 8px; letter-spacing:-.02em; }
.syncList{ margin: 10px 0 0; padding-left: 18px; color: var(--muted); line-height:1.8; }
.syncList li{ margin: 4px 0; }

.syncQuote{
  margin-top: 12px;
  display:flex;
  align-items:center;
  gap:10px;
  padding: 10px 12px;
  border-radius: 16px;
  border: 1px solid rgba(255,255,255,.65);
  background: rgba(255,255,255,.30);
}
.syncQuoteMark{ font-weight: 900; opacity:.75; }
.syncQuoteText{ font-weight: 800; opacity:.82; }

.syncFoot{ margin-top: 16px; }
.syncFootCard{
  display:flex;
  justify-content:center;
  gap:10px;
  padding: 12px 14px;
  font-size: 13.5px;
}
.syncMuted{ color: rgba(11,26,42,.72); font-weight: 650; }
.syncDotSep{ opacity:.55; }

.syncBubbles{ position:absolute; inset:0; pointer-events:none; z-index:1; }
.syncB{
  position:absolute;
  border-radius:999px;
  background: radial-gradient(circle at 30% 30%, rgba(255,255,255,.92), rgba(255,255,255,.30) 55%, rgba(255,255,255,.12));
  box-shadow: 0 20px 50px rgba(0,0,0,.08);
  animation: syncFloat 12s ease-in-out infinite;
  opacity:.95;
}
@keyframes syncFloat{
  0%,100%{ transform: translate(0,0) scale(1); }
  50%{ transform: translate(14px,-12px) scale(1.03); }
}
.syncB.b1{ width:160px; height:160px; left:-40px; top:120px; animation-duration:14s; }
.syncB.b2{ width:90px; height:90px; right:64px; top:110px; animation-duration:10s; }
.syncB.b3{ width:220px; height:220px; right:-88px; top:360px; animation-duration:16s; }
.syncB.b4{ width:120px; height:120px; left:140px; bottom:120px; animation-duration:13s; }
.syncB.b5{ width:70px; height:70px; left:54%; top:-30px; animation-duration:11s; }

@media (max-width: 980px){
  .syncHeroGrid{ grid-template-columns: 1fr; }
  .syncH1{ font-size: 38px; }
}
@media (max-width: 760px){
  .syncTop{ flex-direction:column; align-items:flex-start; }
  .syncNav{ justify-content:flex-start; }
  .syncCards{ grid-template-columns: 1fr; }
  .syncSplit{ grid-template-columns: 1fr; }
}
`;
