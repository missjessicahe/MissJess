// app/page.tsx
import JournalDeck from "./journal/JournalDeck";

export default function HomePage() {
  const updated = "Jan 16, 2026";

  return (
    <>
      {/* ✅ Scope ALL “global-looking” styles to this wrapper so JournalDeck styles don’t fight it */}
      <main className="homeWrap">
        <div className="shell">
          {/* soft floating bubbles */}
          <div className="bubbles" aria-hidden="true">
            <span className="b b1" />
            <span className="b b2" />
            <span className="b b3" />
            <span className="b b4" />
            <span className="b b5" />
            <span className="b b6" />
          </div>

          <header className="topbar">
            <div className="brand">
              <div className="avatar" aria-hidden="true">
                J.
              </div>
              <div className="brandText">
                <div className="name">Miss Jess</div>
                <div className="tag">portfolio · bubble iOS · git-backed</div>
              </div>
            </div>

            <nav className="nav">
              <a className="pill" href="/whimsical">
                Whimsical
              </a>
              <a className="pill" href="/kubesync">
                KubeSync
              </a>
              <a className="pill" href="/kubecard">
                KubeCard
              </a>
              <a
                className="pill ghost"
                href="https://github.com/missjessicahe"
                target="_blank"
                rel="noreferrer"
              >
                GitHub ↗
              </a>
            </nav>
          </header>

          <section className="hero">
            <div className="heroCard glass">
              <div className="sparkle" aria-hidden="true">
                ✦
              </div>
              <h1>Hi, I’m Jess 🫧</h1>
              <p>
                This is my tiny, cozy corner of the internet — a journal + portfolio
                that updates whenever I push commits. I like clean systems, gentle
                aesthetics, and projects that feel alive.
              </p>

              <div className="metaRow">
                <span className="metaChip">Last updated: {updated}</span>
                <span className="metaChip">Theme: Bubble iOS · light blues</span>
                <span className="metaChip">Deploy: Vercel</span>
              </div>

              <div className="ctaRow">
                <a className="cta primary" href="/journal">
                  Open Journal Deck
                </a>
                <a className="cta" href="#projects">
                  See projects
                </a>
              </div>
            </div>

            <div className="sideStack">
              <div className="mini glass">
                <div className="miniTitle">Now</div>
                <div className="miniBody">
                  building <b>missjess.co</b> → journal + project pages
                </div>
              </div>
              <div className="mini glass">
                <div className="miniTitle">Vibe</div>
                <div className="miniBody">
                  soft gradients, glass cards, floating bubbles ✧
                </div>
              </div>
              <div className="mini glass">
                <div className="miniTitle">How it updates</div>
                <div className="miniBody">edit → commit → push → auto rebuild</div>
              </div>
            </div>
          </section>

          <section id="projects" className="section">
            <div className="sectionHeader">
              <h2>Projects</h2>
              <p>Little portals into the things I’m building.</p>
            </div>

            <div className="grid">
              <a className="card glass" href="/whimsical">
                <div className="cardTop">
                  <div className="icon">🍓</div>
                  <div>
                    <div className="cardTitle">Whimsical</div>
                    <div className="cardSub">A playful project showcase</div>
                  </div>
                </div>
                <div className="cardBody">
                  A cute, demo-friendly page that can mirror your GitHub README later.
                </div>
                <div className="cardFoot">Open →</div>
              </a>

              <a className="card glass" href="/kubesync">
                <div className="cardTop">
                  <div className="icon">📻</div>
                  <div>
                    <div className="cardTitle">KubeSync</div>
                    <div className="cardSub">Resilience / comms prototype</div>
                  </div>
                </div>
                <div className="cardBody">
                  A landing page for the KubeSync concept, links, and updates.
                </div>
                <div className="cardFoot">Open →</div>
              </a>

              <a className="card glass" href="/kubecard">
                <div className="cardTop">
                  <div className="icon">🧾</div>
                  <div>
                    <div className="cardTitle">KubeCard</div>
                    <div className="cardSub">Research + literature</div>
                  </div>
                </div>
                <div className="cardBody">
                  A polished page for write-ups, citations, and artifacts.
                </div>
                <div className="cardFoot">Open →</div>
              </a>
            </div>
          </section>

          {/* Journal CTA section */}
          <section className="section">
            <div className="sectionHeader">
              <h2>Journal</h2>
              <p>Card-style entries with sort + search (updated by commits).</p>
            </div>

            <div className="journalCtaLeft">
              <div className="jdPreview">
                <div className="jdPreviewInner">
                  <JournalDeck embedded />
                </div>
              </div>
            </div>
          </section>

          <footer className="footer">
            <div className="footerCard glass">
              <div className="footerRow">
                <span>© {new Date().getFullYear()} Miss Jess</span>
              </div>
            </div>
          </footer>
        </div>
      </main>

      {/* ✅ NOT style jsx — keep this as plain style so it works in Server Components */}
      <style>{`
        .homeWrap{
          --bg1:#e8f4ff;
          --bg2:#cfe9ff;
          --bg3:#b7ddff;

          --ink:#0b1a2a;
          --muted:rgba(11,26,42,.70);

          --glass:rgba(255,255,255,.58);
          --stroke:rgba(255,255,255,.62);
          --stroke2:rgba(11,26,42,.06);

          --shadow: 0 22px 70px rgba(20,60,110,.18);
          --shadow2: 0 10px 26px rgba(20,60,110,.12);

          --radius: 22px;

          min-height:100vh;
          color:var(--ink);
          font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, "Apple Color Emoji","Segoe UI Emoji";
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;

          background:
            radial-gradient(1200px 600px at 10% 10%, #ffffff 0%, transparent 60%),
            radial-gradient(900px 500px at 90% 15%, rgba(255,255,255,.9) 0%, transparent 65%),
            linear-gradient(180deg, var(--bg1), var(--bg2) 45%, var(--bg3));
          overflow-x:hidden;
        }

        .homeWrap *{ box-sizing:border-box; }
        .homeWrap a{ color:inherit; text-decoration:none; }
        .homeWrap a:hover{ opacity:.95; }

        .homeWrap :focus-visible{
          outline: 2px solid rgba(70,140,255,.55);
          outline-offset: 3px;
          border-radius: 12px;
        }

        .shell{
          position:relative;
          min-height:100vh;
          padding: 28px 18px 46px;
          max-width: 1100px;
          margin: 0 auto;
        }

        .glass{
          background: var(--glass);
          border: 1px solid var(--stroke);
          box-shadow: var(--shadow2);
          backdrop-filter: blur(14px);
          -webkit-backdrop-filter: blur(14px);
          border-radius: var(--radius);
        }

        /* bubbles */
        .bubbles{ position:absolute; inset:0; pointer-events:none; z-index:0; }
        .b{
          position:absolute;
          border-radius:999px;
          background:
            radial-gradient(circle at 30% 30%, rgba(255,255,255,.95), rgba(255,255,255,.35) 55%, rgba(255,255,255,.12));
          box-shadow: 0 18px 55px rgba(0,0,0,.08);
          filter: saturate(1.1);
          animation: floaty 10s ease-in-out infinite;
        }
        .b1{ width:140px; height:140px; left:-30px; top:120px; animation-duration:12s; }
        .b2{ width:90px; height:90px; right:40px; top:110px; animation-duration:9s; }
        .b3{ width:170px; height:170px; right:-60px; top:420px; animation-duration:14s; }
        .b4{ width:110px; height:110px; left:120px; bottom:130px; animation-duration:11s; }
        .b5{ width:70px; height:70px; left:60%; top:58%; animation-duration:8s; }
        .b6{ width:120px; height:120px; left:42%; top:-40px; animation-duration:13s; }

        @keyframes floaty{
          0%,100%{ transform: translateY(0) translateX(0) scale(1); }
          50%{ transform: translateY(-16px) translateX(10px) scale(1.03); }
        }

        .topbar{
          position:relative;
          z-index:1;
          display:flex;
          gap:14px;
          align-items:center;
          justify-content:space-between;
          margin-bottom: 18px;
        }

        .brand{ display:flex; align-items:center; gap:12px; }
        .avatar{
          width:44px; height:44px;
          border-radius: 16px;
          display:grid; place-items:center;
          font-weight:850;
          background: radial-gradient(circle at 30% 30%, #ffffff, rgba(255,255,255,.32));
          border:1px solid rgba(255,255,255,.75);
          box-shadow: 0 10px 30px rgba(20,60,110,.12);
        }
        .name{ font-weight:850; letter-spacing:-.02em; }
        .tag{ font-size:13px; color:var(--muted); margin-top:2px; }

        .nav{ display:flex; flex-wrap:wrap; gap:10px; justify-content:flex-end; }
        .pill{
          padding: 10px 12px;
          border-radius: 999px;
          border: 1px solid rgba(255,255,255,.70);
          background: rgba(255,255,255,.34);
          box-shadow: 0 10px 20px rgba(20,60,110,.08);
          font-size: 14px;
          transition: transform .15s ease, background .15s ease;
        }
        .pill:hover{
          transform: translateY(-1px);
          background: rgba(255,255,255,.42);
        }
        .pill.ghost{ background: rgba(255,255,255,.22); }

        .hero{
          position:relative;
          z-index:1;
          display:grid;
          grid-template-columns: 1.35fr .65fr;
          gap: 16px;
          align-items:stretch;
          margin: 10px 0 26px;
        }

        .heroCard{
          position:relative;
          padding: 22px 22px 18px;
          overflow:hidden;
        }
        .sparkle{
          position:absolute;
          right:16px; top:14px;
          opacity:.55;
          font-size: 20px;
        }
        .heroCard h1{
          margin:0 0 10px;
          font-size: clamp(28px, 3.2vw, 40px);
          letter-spacing:-.03em;
          line-height:1.05;
        }
        .heroCard p{
          margin:0 0 14px;
          color: var(--muted);
          font-size: 15.5px;
          line-height: 1.55;
          max-width: 60ch;
        }

        .metaRow{
          display:flex;
          flex-wrap:wrap;
          gap:8px;
          margin: 10px 0 16px;
        }
        .metaChip{
          font-size: 12.5px;
          color: rgba(11,26,42,.78);
          padding: 7px 10px;
          border-radius: 999px;
          background: rgba(255,255,255,.42);
          border: 1px solid rgba(255,255,255,.70);
        }

        .ctaRow{ display:flex; gap:10px; flex-wrap:wrap; }
        .cta{
          padding: 11px 14px;
          border-radius: 14px;
          border: 1px solid rgba(255,255,255,.75);
          background: rgba(255,255,255,.36);
          box-shadow: 0 12px 26px rgba(20,60,110,.10);
          font-weight: 700;
          font-size: 14px;
          transition: transform .15s ease, background .15s ease;
        }
        .cta:hover{
          transform: translateY(-1px);
          background: rgba(255,255,255,.46);
        }
        .cta.primary{
          background: linear-gradient(180deg, rgba(255,255,255,.80), rgba(255,255,255,.34));
        }

        .sideStack{ display:grid; gap:12px; }
        .mini{ padding: 14px 14px 12px; border: 1px solid rgba(255,255,255,.65); }
        .miniTitle{ font-weight:850; margin-bottom:6px; letter-spacing:-.02em; }
        .miniBody{ color: var(--muted); font-size: 14px; line-height:1.5; }

        .section{ position:relative; z-index:1; margin: 26px 0; }
        .sectionHeader h2{
          margin:0;
          font-size: 20px;
          letter-spacing:-.02em;
        }
        .sectionHeader p{
          margin:6px 0 14px;
          color: var(--muted);
        }

        .grid{
          display:grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 14px;
        }
        .card{
          padding: 16px 16px 14px;
          transition: transform .15s ease, box-shadow .15s ease;
          border: 1px solid rgba(255,255,255,.62);
        }
        .card:hover{
          transform: translateY(-2px);
          box-shadow: var(--shadow);
        }
        .cardTop{ display:flex; gap:12px; align-items:center; margin-bottom: 10px; }
        .icon{
          width:44px; height:44px;
          border-radius: 16px;
          display:grid; place-items:center;
          background: rgba(255,255,255,.55);
          border: 1px solid rgba(255,255,255,.74);
          box-shadow: 0 10px 20px rgba(20,60,110,.09);
          font-size: 20px;
        }
        .cardTitle{ font-weight:900; letter-spacing:-.02em; }
        .cardSub{ color: var(--muted); font-size: 13px; margin-top:2px; }
        .cardBody{ color: var(--muted); font-size: 14px; line-height:1.5; margin: 6px 0 10px; }
        .cardFoot{ font-weight:800; font-size: 14px; }

        /* Journal preview frame */
        .journalCtaLeft{ flex: 1; min-width: 240px; }

        .jdPreview{
          position: relative;
          border-radius: 22px;
          overflow: hidden;
          border: 1px solid rgba(255,255,255,.65);
          background: rgba(255,255,255,.22);
          box-shadow: 0 18px 50px rgba(20,60,110,.12);
          height: clamp(520px, 60vh, 640px);
        }

        .jdPreviewInner{
          position: relative;
          z-index: 1;         /* ✅ sits above ::before/::after */
          height: 100%;
          overflow: hidden;
          padding: 14px;
          min-height: 0;
        }

        /* ✅ no :global here — plain CSS */
        .jdPreviewInner .jd{
          position: relative;
          z-index: 2;
        }

        .jdPreview::before,
        .jdPreview::after{
          content:"";
          position:absolute;
          inset: 0;
          border-radius: 22px;
          border: 1px solid rgba(255,255,255,.45);
          background: rgba(255,255,255,.10);
          pointer-events:none;
          z-index: 0;
        }
        .jdPreview::before{ transform: translate(10px, 10px); opacity: .55; }
        .jdPreview::after{ transform: translate(18px, 18px); opacity: .30; }

        .jdFade{
          pointer-events: none;
          position:absolute;
          left:0; right:0; bottom:0;
          height: 110px;
          background: linear-gradient(
            180deg,
            rgba(232,244,255,0) 0%,
            rgba(232,244,255,.85) 55%,
            rgba(232,244,255,1) 100%
          );
          z-index: 3;
        }

        .footer{
          margin-top: 18px;
          display: flex;
          justify-content: flex-end; /* pushes card to right */
        }

        .footerCard{
          display: inline-flex;
          align-items: center;
          justify-content: flex-end;

          /* rectangle look */
          border-radius: 12px;                 /* not pill */
          border: 1px solid rgba(255,255,255,.70);
          background: rgba(255,255,255,.28);
          padding: 12px 14px;
          box-shadow: 0 12px 26px rgba(20,60,110,.10);
        }

        .footerRow{
          font-size: 13.5px;
          font-weight: 700;
          color: rgba(11,26,42,.72);
        }

        .dot{ opacity:.55; }

        @media (max-width: 900px){
          .hero{ grid-template-columns: 1fr; }
          .grid{ grid-template-columns: 1fr; }
          .topbar{ flex-direction:column; align-items:flex-start; }
          .nav{ justify-content:flex-start; }
        }
      `}</style>
    </>
  );
}
