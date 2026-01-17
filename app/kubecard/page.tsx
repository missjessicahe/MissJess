// app/kubecard/page.tsx
type RepoInfo = {
  stargazers_count: number;
  forks_count: number;
  updated_at: string;
  html_url: string;
};

const REPO_API = "https://api.github.com/repos/missjessicahe/KubeCard";

function fmtDate(iso?: string) {
  if (!iso) return null;
  return new Date(iso).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default async function KubeCardPage() {
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
      <div className="kcPage">
        <main className="kcWrap">
          <header className="kcTop">
            <a className="kcBack" href="/">
              ← home
            </a>

            <div className="kcNav">
              <a className="kcChipLink" href="/whimsical">
                Whimsical →
              </a>
              <a className="kcChipLink" href="/kubesync">
                KubeSync →
              </a>
              <a
                className="kcChipLink"
                href="https://github.com/missjessicahe"
                target="_blank"
                rel="noreferrer"
              >
                GitHub ↗
              </a>
            </div>
          </header>

          <section className="kcHero kcGlass">
            <div className="kcBadge">📚 research</div>

            <div className="kcHeroGrid">
              <div>
                <h1 className="kcH1">KubeCard</h1>
                <p className="kcLead">
                  A polished home for write-ups, citations, and artifacts — designed like a calm,
                  readable lab notebook with a bubble-glass aesthetic.
                </p>

                <div className="kcChips">
                  {repo ? (
                    <>
                      <span className="kcChip">⭐ {repo.stargazers_count.toLocaleString()}</span>
                      <span className="kcChip">⚡ {repo.forks_count.toLocaleString()}</span>
                      {updated && <span className="kcChip">🫧 updated {updated}</span>}
                    </>
                  ) : (
                    <>
                      <span className="kcChip">🫧 git-backed</span>
                      <span className="kcChip">🧾 citations</span>
                      <span className="kcChip">🗂 artifacts</span>
                    </>
                  )}
                </div>

                <div className="kcRow">
                  <a
                    className="kcBtn kcBtnPrimary"
                    href={repo?.html_url ?? "https://github.com/missjessicahe"}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Open repo ↗
                  </a>
                  <a className="kcBtn" href="/journal">
                    Read journal context →
                  </a>
                </div>
              </div>

              <div className="kcRight">
                <div className="kcPanel kcGlass">
                  <div className="kcPanelTitle">What lives here</div>

                  <div className="kcPills">
                    <span className="kcPill">abstracts</span>
                    <span className="kcPill">citations</span>
                    <span className="kcPill">diagrams</span>
                    <span className="kcPill">notes</span>
                    <span className="kcPill">links</span>
                  </div>

                  <p className="kcP">
                    Think of it as: <b>a library card catalog</b>, but cute and modern — where each
                    page is a small, well-scoped artifact.
                  </p>
                </div>

                <div className="kcPaper kcGlass" aria-hidden="true">
                  <div className="kcPaperTop">
                    <span className="kcDot r" />
                    <span className="kcDot y" />
                    <span className="kcDot g" />
                    <span className="kcPaperLabel">index card</span>
                  </div>

                  <div className="kcPaperBody">
                    <div className="kcLines">
                      <span />
                      <span />
                      <span />
                      <span />
                      <span />
                    </div>
                    <div className="kcStamp">KUBE / CARD</div>
                    <div className="kcPaperText">
                      readable artifacts → strong memory → real science.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="kcCards">
            <div className="kcCard kcGlass">
              <h3 className="kcH3">Structure</h3>
              <ul className="kcList">
                <li>Short pages with a single point</li>
                <li>References + links at the bottom</li>
                <li>Commit-backed update trail</li>
              </ul>
            </div>

            <div className="kcCard kcGlass">
              <h3 className="kcH3">What I’m adding</h3>
              <ul className="kcList">
                <li>“Key claims” callouts</li>
                <li>Artifact gallery cards</li>
                <li>Topic index (tag map)</li>
              </ul>
            </div>

            <div className="kcCard kcGlass">
              <h3 className="kcH3">Promise</h3>
              <p className="kcP">
                If it stays readable, it stays useful — and if it stays useful, it will compound.
              </p>

              <div className="kcQuote">
                <span className="kcQuoteMark">✦</span>
                <span className="kcQuoteText">quiet clarity wins.</span>
              </div>
            </div>
          </section>

          <footer className="kcFoot">
            <div className="kcFootCard kcGlass">
              <span className="kcMuted">missjess.co</span>
              <span className="kcDotSep">·</span>
              <span className="kcMuted">kubecard</span>
              <span className="kcDotSep">·</span>
              <a
                className="kcMuted"
                href={repo?.html_url ?? "https://github.com/missjessicahe"}
                target="_blank"
                rel="noreferrer"
              >
                repo ↗
              </a>
            </div>
          </footer>
        </main>

        <div className="kcBubbles" aria-hidden="true">
          <span className="kcB b1" />
          <span className="kcB b2" />
          <span className="kcB b3" />
          <span className="kcB b4" />
          <span className="kcB b5" />
          <span className="kcB b6" />
        </div>
      </div>

      <style>{styles}</style>
    </>
  );
}

const styles = `
.kcPage{
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
.kcPage *{ box-sizing:border-box; }
.kcPage a{ color:inherit; text-decoration:none; }

.kcGlass{
  background: var(--glass);
  border: 1px solid var(--stroke);
  border-radius: var(--radius);
  box-shadow: var(--shadow);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
}

.kcWrap{
  position:relative;
  max-width: 1040px;
  margin: 0 auto;
  padding: 28px 18px 52px;
  z-index:2;
}

.kcTop{
  display:flex;
  justify-content:space-between;
  align-items:center;
  gap:12px;
}
.kcBack, .kcChipLink{
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
.kcNav{ display:flex; gap:10px; flex-wrap:wrap; justify-content:flex-end; }

.kcHero{
  margin-top: 14px;
  padding: 18px;
  position:relative;
  overflow:hidden;
}
.kcHero:before{
  content:"";
  position:absolute; inset:-40%;
  background:
    radial-gradient(circle at 20% 25%, rgba(255,255,255,.70), transparent 55%),
    radial-gradient(circle at 70% 30%, rgba(255,255,255,.60), transparent 60%),
    radial-gradient(circle at 40% 80%, rgba(255,255,255,.45), transparent 58%);
  filter: blur(16px);
  opacity:.75;
  animation: kcDrift 9s ease-in-out infinite;
}
@keyframes kcDrift{
  0%,100%{ transform: translate(0,0) scale(1); }
  50%{ transform: translate(18px,-10px) scale(1.03); }
}

.kcBadge{
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

.kcHeroGrid{
  position:relative;
  z-index:1;
  display:grid;
  grid-template-columns: 1.12fr .88fr;
  gap: 14px;
  margin-top: 10px;
}

.kcH1{
  margin: 0 0 8px;
  font-size: 44px;
  letter-spacing:-.04em;
  line-height:1.05;
}
.kcLead{ margin: 0; color: var(--muted); line-height:1.65; font-size: 16px; }

.kcChips{ display:flex; flex-wrap:wrap; gap:8px; margin-top: 12px; }
.kcChip{
  font-size: 12.5px;
  font-weight: 750;
  color: rgba(11,26,42,.78);
  padding: 7px 10px;
  border-radius: 999px;
  background: rgba(255,255,255,.40);
  border: 1px solid rgba(255,255,255,.65);
}

.kcRow{ display:flex; gap:10px; flex-wrap:wrap; margin-top: 12px; }
.kcBtn{
  padding: 11px 14px;
  border-radius: 14px;
  border: 1px solid rgba(255,255,255,.70);
  background: rgba(255,255,255,.38);
  box-shadow: 0 12px 26px rgba(20,60,110,.10);
  font-weight: 750;
  font-size: 14px;
  transition: transform .15s ease;
}
.kcBtn:hover{ transform: translateY(-1px); }
.kcBtnPrimary{ background: linear-gradient(180deg, rgba(255,255,255,.80), rgba(255,255,255,.33)); }

.kcRight{ display:grid; gap: 12px; }
.kcPanel{ padding: 14px; }
.kcPanelTitle{ font-weight: 900; letter-spacing:-.02em; margin-bottom: 10px; }

.kcPills{ display:flex; gap:8px; flex-wrap:wrap; }
.kcPill{
  font-size: 12px;
  font-weight: 850;
  padding: 6px 10px;
  border-radius: 999px;
  border: 1px solid rgba(255,255,255,.65);
  background: rgba(255,255,255,.28);
  opacity:.9;
}

.kcP{ margin: 12px 0 0; color: var(--muted); line-height:1.65; }

.kcPaper{ overflow:hidden; }
.kcPaperTop{
  display:flex; align-items:center; gap:8px;
  padding: 10px 12px;
  border-bottom: 1px solid rgba(255,255,255,.55);
  background: rgba(255,255,255,.32);
}
.kcDot{ width:10px; height:10px; border-radius:999px; }
.kcDot.r{ background: rgba(255,70,70,.85); }
.kcDot.y{ background: rgba(255,200,70,.90); }
.kcDot.g{ background: rgba(90,220,140,.90); }
.kcPaperLabel{ margin-left: 6px; font-weight: 900; font-size: 12px; opacity:.78; }

.kcPaperBody{
  position:relative;
  padding: 14px;
  min-height: 170px;
  overflow:hidden;
}
.kcLines{
  position:absolute; inset: 12px 12px auto 12px;
  display:grid;
  gap: 10px;
  opacity:.55;
}
.kcLines span{
  height: 1px;
  background: rgba(11,26,42,.12);
}
.kcStamp{
  position:absolute;
  right: 14px;
  top: 16px;
  border-radius: 14px;
  border: 1px solid rgba(255,255,255,.65);
  background: rgba(255,255,255,.38);
  padding: 8px 10px;
  font-weight: 950;
  letter-spacing: .08em;
  font-size: 11px;
  opacity:.88;
}
.kcPaperText{
  position:relative;
  z-index:1;
  margin-top: 88px;
  text-align:center;
  font-weight: 900;
  opacity:.80;
  font-size: 13.5px;
}

.kcCards{
  margin-top: 14px;
  display:grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 14px;
}
.kcCard{ padding: 16px; }
.kcH3{ margin:0 0 8px; letter-spacing:-.02em; }
.kcList{ margin: 10px 0 0; padding-left: 18px; color: var(--muted); line-height:1.8; }
.kcList li{ margin: 4px 0; }

.kcQuote{
  margin-top: 12px;
  display:flex;
  align-items:center;
  gap:10px;
  padding: 10px 12px;
  border-radius: 16px;
  border: 1px solid rgba(255,255,255,.65);
  background: rgba(255,255,255,.30);
}
.kcQuoteMark{ font-weight: 900; opacity:.75; }
.kcQuoteText{ font-weight: 800; opacity:.82; }

.kcFoot{ margin-top: 16px; }
.kcFootCard{
  display:flex;
  justify-content:center;
  gap:10px;
  padding: 12px 14px;
  font-size: 13.5px;
}
.kcMuted{ color: rgba(11,26,42,.72); font-weight: 650; }
.kcDotSep{ opacity:.55; }

.kcBubbles{ position:absolute; inset:0; pointer-events:none; z-index:1; }
.kcB{
  position:absolute;
  border-radius:999px;
  background: radial-gradient(circle at 30% 30%, rgba(255,255,255,.92), rgba(255,255,255,.30) 55%, rgba(255,255,255,.12));
  box-shadow: 0 20px 50px rgba(0,0,0,.08);
  animation: kcFloat 12s ease-in-out infinite;
  opacity:.95;
}
@keyframes kcFloat{
  0%,100%{ transform: translate(0,0) scale(1); }
  50%{ transform: translate(14px,-12px) scale(1.03); }
}
.kcB.b1{ width:160px; height:160px; left:-40px; top:120px; animation-duration:14s; }
.kcB.b2{ width:90px; height:90px; right:64px; top:110px; animation-duration:10s; }
.kcB.b3{ width:230px; height:230px; right:-98px; top:360px; animation-duration:16s; }
.kcB.b4{ width:120px; height:120px; left:140px; bottom:120px; animation-duration:13s; }
.kcB.b5{ width:70px; height:70px; left:54%; top:-30px; animation-duration:11s; }
.kcB.b6{ width:110px; height:110px; left:60%; top:62%; animation-duration:13s; }

@media (max-width: 980px){
  .kcHeroGrid{ grid-template-columns: 1fr; }
  .kcH1{ font-size: 38px; }
}
@media (max-width: 760px){
  .kcTop{ flex-direction:column; align-items:flex-start; }
  .kcNav{ justify-content:flex-start; }
  .kcCards{ grid-template-columns: 1fr; }
}
`;
