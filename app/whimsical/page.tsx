// app/whimsical/page.tsx
type RepoInfo = {
  stargazers_count: number;
  forks_count: number;
  updated_at: string;
  html_url: string;
};

const REPO_API = "https://api.github.com/repos/missjessicahe/Whimsical";

function fmtDate(iso?: string) {
  if (!iso) return null;
  return new Date(iso).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default async function WhimsicalPage() {
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
      <div className="whimPage">
        <main className="whimWrap">
          <header className="whimTop">
            <a className="whimBack" href="/">
              ← home
            </a>

            <div className="whimMiniNav">
              <a className="whimChipLink" href="/kubesync">
                KubeSync →
              </a>
              <a className="whimChipLink" href="/kubecard">
                KubeCard →
              </a>
              <a
                className="whimChipLink"
                href="https://github.com/missjessicahe"
                target="_blank"
                rel="noreferrer"
              >
                GitHub ↗
              </a>
            </div>
          </header>

          <section className="whimHero whimGlass">
            <div className="whimBadge">🍓 project</div>

            <div className="whimHeroGrid">
              <div className="whimHeroLeft">
                <h1 className="whimH1">Whimsical</h1>
                <p className="whimLead">
                  A playful project page that can evolve into README mirrors, demo links, screenshots,
                  and “what changed this week” logs — all updated by commits.
                </p>

                <div className="whimChips" aria-label="status chips">
                  {repo ? (
                    <>
                      <span className="whimChip">⭐ {repo.stargazers_count.toLocaleString()}</span>
                      <span className="whimChip">⚡ {repo.forks_count.toLocaleString()}</span>
                      {updated && <span className="whimChip">🫧 updated {updated}</span>}
                    </>
                  ) : (
                    <>
                      <span className="whimChip">🫧 git-backed</span>
                      <span className="whimChip">☁️ vercel-ready</span>
                      <span className="whimChip">✨ cute by default</span>
                    </>
                  )}
                </div>

                <div className="whimRow">
                  <a
                    className="whimBtn whimBtnPrimary"
                    href="https://github.com/missjessicahe/Whimsical"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Open repo ↗
                  </a>
                </div>
              </div>

              <div className="whimHeroRight">
                <div className="whimMiniCard whimGlass">
                  <div className="whimMiniTitle">What it is</div>
                  <p className="whimMiniText">
                    A clean little portal. Simple structure, gentle visuals, and an update loop that
                    stays alive.
                  </p>

                  <div className="whimDivider" />

                  <div className="whimMiniTitle">Design rule</div>
                  <p className="whimMiniText">
                    <b>Cute beats complicated.</b> If it’s easy to update, it will keep moving.
                  </p>
                </div>

                <div className="whimOrb whimGlass" aria-hidden="true">
                  <div className="whimOrbTop">
                    <span className="whimOrbDot r" />
                    <span className="whimOrbDot y" />
                    <span className="whimOrbDot g" />
                    <span className="whimOrbLabel">tiny demo aura</span>
                  </div>

                  <div className="whimOrbBody">
                    <div className="whimPulse" />
                    <div className="whimOrbText">
                      <div className="whimOrbBig">🫧</div>
                      <div className="whimOrbSmall">whimsical means: gentle, but intentional.</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="whimGrid">
            <div className="whimCard whimGlass">
              <h3 className="whimH3">What I’m building</h3>
              <ul className="whimList">
                <li>Repo-backed pages that don’t need a database</li>
                <li>Readable “ship logs” that feel like a deck of cards</li>
                <li>Soft gradients + glass UI, consistent across projects</li>
              </ul>
            </div>

            <div className="whimCard whimGlass">
              <h3 className="whimH3">Next upgrades</h3>
              <ul className="whimList">
                <li>Embed README snapshots</li>
                <li>Add screenshot gallery</li>
                <li>Weekly “what changed” bullet log</li>
              </ul>
            </div>

            <div className="whimCard whimGlass">
              <h3 className="whimH3">One-line vibe</h3>
              <p className="whimP">
                Ship light. Iterate often. Make it cute enough that you want to come back tomorrow.
              </p>

              <div className="whimQuote">
                <span className="whimQuoteMark">✦</span>
                <span className="whimQuoteText">quietly lethal. politely unstoppable.</span>
              </div>
            </div>
          </section>

          <footer className="whimFoot">
            <div className="whimFootCard whimGlass">
              <span className="whimMuted">missjess.co</span>
              <span className="whimDot">·</span>
              <span className="whimMuted">whimsical</span>
              <span className="whimDot">·</span>
              <a
                className="whimMuted"
                href="https://github.com/missjessicahe/Whimsical"
                target="_blank"
                rel="noreferrer"
              >
                repo ↗
              </a>
            </div>
          </footer>
        </main>

        <div className="whimBubbles" aria-hidden="true">
          <span className="whimB b1" />
          <span className="whimB b2" />
          <span className="whimB b3" />
          <span className="whimB b4" />
          <span className="whimB b5" />
          <span className="whimB b6" />
        </div>
      </div>

      <style>{styles}</style>
    </>
  );
}

const styles = `
.whimPage{
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

.whimPage *{ box-sizing:border-box; }
.whimPage a{ color:inherit; text-decoration:none; }

.whimGlass{
  background: var(--glass);
  border: 1px solid var(--stroke);
  border-radius: var(--radius);
  box-shadow: var(--shadow);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
}

.whimWrap{
  position:relative;
  max-width: 1040px;
  margin: 0 auto;
  padding: 28px 18px 52px;
  z-index:2;
}

.whimTop{
  display:flex;
  justify-content:space-between;
  align-items:center;
  gap:12px;
}

.whimBack{
  display:inline-flex;
  align-items:center;
  gap:8px;
  padding: 10px 12px;
  border-radius: 999px;
  border: 1px solid rgba(255,255,255,.65);
  background: rgba(255,255,255,.35);
  box-shadow: 0 10px 20px rgba(20,60,110,.08);
  font-size: 14px;
  font-weight: 650;
}

.whimMiniNav{ display:flex; gap:10px; flex-wrap:wrap; justify-content:flex-end; }
.whimChipLink{
  padding: 10px 12px;
  border-radius: 999px;
  border: 1px solid rgba(255,255,255,.65);
  background: rgba(255,255,255,.35);
  box-shadow: 0 10px 20px rgba(20,60,110,.08);
  font-size: 14px;
  font-weight: 650;
}

.whimHero{ margin-top: 14px; padding: 18px; position:relative; overflow:hidden; }
.whimHero:before{
  content:"";
  position:absolute; inset:-40%;
  background:
    radial-gradient(circle at 20% 25%, rgba(255,255,255,.70), transparent 55%),
    radial-gradient(circle at 70% 30%, rgba(255,255,255,.60), transparent 60%),
    radial-gradient(circle at 40% 80%, rgba(255,255,255,.45), transparent 58%);
  filter: blur(16px);
  opacity:.75;
  animation: whimDrift 9s ease-in-out infinite;
}
@keyframes whimDrift{
  0%,100%{ transform: translate(0,0) scale(1); }
  50%{ transform: translate(18px,-10px) scale(1.03); }
}

.whimBadge{
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

.whimHeroGrid{
  position:relative;
  z-index:1;
  display:grid;
  grid-template-columns: 1.2fr .8fr;
  gap: 14px;
  margin-top: 10px;
}

.whimH1{
  margin: 0 0 8px;
  font-size: 44px;
  letter-spacing:-.04em;
  line-height:1.05;
}

.whimLead{ margin: 0; color: var(--muted); line-height:1.65; font-size: 16px; }

.whimChips{
  display:flex;
  flex-wrap:wrap;
  gap:8px;
  margin-top: 12px;
}

.whimChip{
  font-size: 12.5px;
  font-weight: 750;
  color: rgba(11,26,42,.78);
  padding: 7px 10px;
  border-radius: 999px;
  background: rgba(255,255,255,.40);
  border: 1px solid rgba(255,255,255,.65);
}

.whimRow{ display:flex; gap:10px; flex-wrap:wrap; margin-top: 12px; }

.whimBtn{
  padding: 11px 14px;
  border-radius: 14px;
  border: 1px solid rgba(255,255,255,.70);
  background: rgba(255,255,255,.38);
  box-shadow: 0 12px 26px rgba(20,60,110,.10);
  font-weight: 750;
  font-size: 14px;
  transition: transform .15s ease;
}
.whimBtn:hover{ transform: translateY(-1px); }
.whimBtnPrimary{
  background: linear-gradient(180deg, rgba(255,255,255,.80), rgba(255,255,255,.33));
}

.whimHeroRight{ display:grid; gap: 12px; }

.whimMiniCard{ padding: 14px; }
.whimMiniTitle{ font-weight: 900; letter-spacing:-.02em; }
.whimMiniText{ margin: 6px 0 0; color: var(--muted); line-height:1.6; font-size: 14px; }
.whimDivider{ height:1px; background: rgba(255,255,255,.55); margin: 12px 0; }

.whimOrb{ overflow:hidden; }
.whimOrbTop{
  display:flex; align-items:center; gap:8px;
  padding: 10px 12px;
  border-bottom: 1px solid rgba(255,255,255,.55);
  background: rgba(255,255,255,.32);
}
.whimOrbDot{ width:10px; height:10px; border-radius:999px; }
.whimOrbDot.r{ background: rgba(255,70,70,.85); }
.whimOrbDot.y{ background: rgba(255,200,70,.90); }
.whimOrbDot.g{ background: rgba(90,220,140,.90); }
.whimOrbLabel{ margin-left: 6px; font-weight: 900; font-size: 12px; opacity:.78; }
.whimOrbBody{
  padding: 14px;
  position:relative;
  min-height: 120px;
}
.whimPulse{
  position:absolute; inset:-30%;
  background:
    radial-gradient(circle at 30% 25%, rgba(255,255,255,.75), transparent 55%),
    radial-gradient(circle at 70% 65%, rgba(255,255,255,.55), transparent 58%);
  filter: blur(14px);
  animation: whimPulse 6.5s ease-in-out infinite;
  opacity:.85;
}
@keyframes whimPulse{
  0%,100%{ transform: translate(0,0) scale(1); }
  50%{ transform: translate(14px,-10px) scale(1.04); }
}
.whimOrbText{ position:relative; z-index:1; text-align:center; }
.whimOrbBig{ font-size: 40px; }
.whimOrbSmall{ margin-top: 8px; color: var(--muted); font-size: 13.5px; }

.whimGrid{
  margin-top: 14px;
  display:grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 14px;
  position:relative;
  z-index:2;
}
.whimCard{ padding: 16px; }
.whimH3{ margin:0 0 8px; letter-spacing:-.02em; }
.whimP{ margin:0; color: var(--muted); line-height:1.65; }

.whimList{ margin: 10px 0 0; padding-left: 18px; color: var(--muted); line-height:1.8; }
.whimList li{ margin: 4px 0; }

.whimQuote{
  margin-top: 12px;
  display:flex;
  align-items:center;
  gap:10px;
  padding: 10px 12px;
  border-radius: 16px;
  border: 1px solid rgba(255,255,255,.65);
  background: rgba(255,255,255,.30);
}
.whimQuoteMark{ font-weight: 900; opacity:.75; }
.whimQuoteText{ font-weight: 800; opacity:.82; }

.whimFoot{ margin-top: 16px; }
.whimFootCard{
  display:flex;
  justify-content:center;
  gap:10px;
  padding: 12px 14px;
  font-size: 13.5px;
}
.whimMuted{ color: rgba(11,26,42,.72); font-weight: 650; }
.whimDot{ opacity:.55; }

.whimBubbles{ position:absolute; inset:0; pointer-events:none; z-index:1; }
.whimB{
  position:absolute;
  border-radius:999px;
  background: radial-gradient(circle at 30% 30%, rgba(255,255,255,.92), rgba(255,255,255,.30) 55%, rgba(255,255,255,.12));
  box-shadow: 0 20px 50px rgba(0,0,0,.08);
  animation: whimFloat 12s ease-in-out infinite;
  opacity:.95;
}
@keyframes whimFloat{
  0%,100%{ transform: translate(0,0) scale(1); }
  50%{ transform: translate(14px,-12px) scale(1.03); }
}
.whimB.b1{ width:160px; height:160px; left:-40px; top:120px; animation-duration:14s; }
.whimB.b2{ width:90px; height:90px; right:64px; top:110px; animation-duration:10s; }
.whimB.b3{ width:210px; height:210px; right:-78px; top:360px; animation-duration:16s; }
.whimB.b4{ width:120px; height:120px; left:140px; bottom:120px; animation-duration:13s; }
.whimB.b5{ width:70px; height:70px; left:56%; top:62%; animation-duration:9s; }
.whimB.b6{ width:110px; height:110px; left:56%; top:-34px; animation-duration:12s; }

@media (max-width: 980px){
  .whimHeroGrid{ grid-template-columns: 1fr; }
  .whimH1{ font-size: 38px; }
}

@media (max-width: 760px){
  .whimTop{ flex-direction:column; align-items:flex-start; }
  .whimMiniNav{ justify-content:flex-start; }
  .whimGrid{ grid-template-columns: 1fr; }
}
`;
