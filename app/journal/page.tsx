// app/journal/page.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { ALL_ENTRIES } from "./entries";

// helper: show as "Jan 16, 2026"
function prettyDate(dateISO: string) {
  const d = new Date(dateISO + "T00:00:00");
  return d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
}

// title-only failsafe (matches JournalDeck)
function normalizeTitleQuery(input: string) {
  return input
    .trim()
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s'’-]/gu, "")
    .replace(/\s+/g, " ")
    .slice(0, 60);
}

export default function JournalPage() {
  const [sort, setSort] = useState<"newest" | "oldest">("newest");
  const [dateQuery, setDateQuery] = useState<string>(""); // YYYY-MM-DD
  const [q, setQ] = useState<string>(""); // title search
  const [index, setIndex] = useState(0);

  const [expanded, setExpanded] = useState(false);

  const sorted = useMemo(() => {
    const copy = [...ALL_ENTRIES].sort((a, b) => {
      if (a.dateISO === b.dateISO) return 0;
      return sort === "newest"
        ? a.dateISO < b.dateISO
          ? 1
          : -1
        : a.dateISO < b.dateISO
        ? -1
        : 1;
    });
    return copy;
  }, [sort]);

  const filtered = useMemo(() => {
    let list = sorted;

    if (dateQuery) list = list.filter((e) => e.dateISO === dateQuery);

    const query = normalizeTitleQuery(q);
    if (query) {
      list = list.filter((e) => (e.title ?? "").toLowerCase().includes(query));
    }

    return list;
  }, [sorted, dateQuery, q]);

  useEffect(() => {
    setIndex(0);
  }, [sort, dateQuery, q]);

  const total = ALL_ENTRIES.length;
  const showing = filtered.length;

  const current = showing > 0 ? (filtered[index] as any) : null;
  const CardComp = current?.Card;

  function prev() {
    if (showing === 0) return;
    setIndex((i) => (i - 1 + showing) % showing);
  }

  function next() {
    if (showing === 0) return;
    setIndex((i) => (i + 1) % showing);
  }

  function random() {
    if (showing === 0) return;
    setIndex(Math.floor(Math.random() * showing));
  }

  function newest() {
    setSort("newest");
    setDateQuery("");
    setQ("");
    setIndex(0);
  }

  // keyboard arrows + Esc
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setExpanded(false);
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showing]);

  // lock body scroll during modal
  useEffect(() => {
    if (!expanded) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [expanded]);

  return (
    <>
      <main className="wrap">
        <header className="top">
          <a className="back" href="/">
            ← back home
          </a>

          <div className="right">
            <a className="pill" href="/whimsical">
              Whimsical
            </a>
            <a className="pill" href="/kubesync">
              KubeSync
            </a>
            <a className="pill" href="/kubecard">
              KubeCard
            </a>
          </div>
        </header>

        <section className="hero glass">
          <div className="badge">📓 journal</div>
          <h1>Journal Deck</h1>
          <p>Card-style entries, searchable by date + title, sortable by time. Updates by commits only.</p>

          <div className="controls">
            <div className="control">
              <label>Order</label>
              <select value={sort} onChange={(e) => setSort(e.target.value as any)}>
                <option value="newest">Most recent</option>
                <option value="oldest">Oldest</option>
              </select>
            </div>

            <div className="control">
              <label>Search by date</label>
              <input type="date" value={dateQuery} onChange={(e) => setDateQuery(e.target.value)} />
            </div>

            <div className="control">
              <label>Search titles</label>
              <input
                type="text"
                placeholder="try: build log"
                value={q}
                onChange={(e) => setQ(e.target.value)}
              />
              <div className="hint">Title-only search (failsafe) — no IDs, no parsing.</div>
            </div>

            <div className="counter">
              <div className="countBig">{showing}</div>
              <div className="countSmall">showing / {total} total</div>
            </div>
          </div>
        </section>

        <section className="deckArea">
          <div className="deckTopRow">
            <div className="deckNav">
              <button className="btn primary" onClick={newest}>
                Newest
              </button>
              <button className="btn" onClick={prev} disabled={showing === 0}>
                ←
              </button>
              <button className="btn" onClick={next} disabled={showing === 0}>
                →
              </button>
              <button className="btn" onClick={random} disabled={showing === 0}>
                shuffle
              </button>
            </div>

            <div className="deckMeta">
              {showing === 0 || !current ? (
                <span className="pillSoft">No entries match that filter.</span>
              ) : (
                <>
                  <span className="pillSoft">
                    {index + 1} / {showing}
                  </span>
                  <span className="pillSoft">{prettyDate(current.dateISO)}</span>
                  <span className="pillSoft">{current.mood}</span>
                  <button className="pillBtn" onClick={() => setExpanded(true)}>
                    Expand ⤢
                  </button>
                </>
              )}
            </div>
          </div>

          {showing === 0 ? (
            <div className="empty glass">
              <h3>No matches</h3>
              <p>Try clearing the date and title filters.</p>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                <button className="btn primary" onClick={() => setDateQuery("")}>
                  Clear date
                </button>
                <button className="btn primary" onClick={() => setQ("")}>
                  Clear title
                </button>
                <button className="btn primary" onClick={newest}>
                  Reset
                </button>
              </div>
            </div>
          ) : (
            <article className="card glass">
              <div className="cardHead">
                <div>
                  <div className="title">{current.title}</div>
                  <div className="sub">{prettyDate(current.dateISO)}</div>
                </div>

                {current.tags?.length ? (
                  <div className="tags">
                    {current.tags.slice(0, 4).map((t) => (
                      <span className="tag" key={`${current.id}-${t}`}>
                        #{t}
                      </span>
                    ))}
                  </div>
                ) : null}
              </div>

              {/* Explicit scroll area */}
              <div className="cardBody" aria-label="Entry content (scrollable)">
                <div className="scrollHintTop" />
                {CardComp ? <CardComp /> : null}
                <div className="scrollHintBottom" />
              </div>

              <div className="dots" aria-label="Entry dots">
                {filtered.map((e, i) => (
                  <button
                    key={`${e.id}-${e.dateISO}-${i}`}
                    className={`dot ${i === index ? "active" : ""}`}
                    onClick={() => setIndex(i)}
                    aria-label={`Go to ${e.title}`}
                  />
                ))}
              </div>
            </article>
          )}
        </section>

        <footer className="foot">
          <div className="footCard glass">
            <span className="muted">Tip:</span> Use ← → arrow keys to flip cards. Press Esc to close Expand.
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

      {/* Expand modal */}
      {expanded && current ? (
        <div className="modalBackdrop" role="dialog" aria-modal="true" onClick={() => setExpanded(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modalHead">
              <div>
                <div className="modalTitle">{current.title}</div>
                <div className="modalSub">
                  {prettyDate(current.dateISO)} · {current.mood}
                </div>
              </div>
              <button className="btn" onClick={() => setExpanded(false)}>
                Close ✕
              </button>
            </div>

            <div className="modalBody" aria-label="Expanded entry content (scrollable)">
              <div className="scrollHintTop" />
              {current.Card ? <current.Card /> : null}
              <div className="scrollHintBottom" />
            </div>
          </div>
        </div>
      ) : null}

      <style>{styles}</style>
    </>
  );
}

const styles = `
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

  .wrap{ position:relative; max-width: 980px; margin: 0 auto; padding: 28px 18px 40px; }
  .glass{
    background: var(--glass);
    border: 1px solid var(--stroke);
    box-shadow: var(--shadow2);
    backdrop-filter: blur(14px);
    -webkit-backdrop-filter: blur(14px);
    border-radius: var(--radius);
  }

  .top{ display:flex; justify-content:space-between; gap:12px; align-items:center; margin-bottom:14px; position:relative; z-index:2; }
  .right{ display:flex; gap:10px; flex-wrap:wrap; justify-content:flex-end; }

  .back, .pill{
    display:inline-block;
    padding: 10px 12px;
    border-radius: 999px;
    background: rgba(255,255,255,.35);
    border: 1px solid rgba(255,255,255,.65);
    box-shadow: 0 10px 20px rgba(20,60,110,.08);
    font-size: 14px;
  }

  .hero{ padding: 18px 18px 16px; position:relative; z-index:2; }
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
  h1{ margin: 0 0 8px; letter-spacing:-.03em; font-size: 40px; }
  p, li{ color: var(--muted); line-height:1.6; }
  .hint{ margin-top: 6px; font-size: 12px; color: rgba(11,26,42,.62); }

  .controls{
    display:grid;
    grid-template-columns: 1fr 1fr 1.2fr auto;
    gap: 12px;
    margin-top: 14px;
    align-items:end;
  }
  .control label{ display:block; font-size: 12px; color: rgba(11,26,42,.75); margin: 0 0 6px; }
  select, input[type="date"], input[type="text"]{
    width:100%;
    padding: 10px 12px;
    border-radius: 14px;
    border: 1px solid rgba(255,255,255,.7);
    background: rgba(255,255,255,.45);
    outline:none;
    font-weight: 650;
    color: rgba(11,26,42,.9);
  }

  .counter{
    text-align:right;
    padding: 10px 12px;
    border-radius: 14px;
    border: 1px solid rgba(255,255,255,.7);
    background: rgba(255,255,255,.35);
  }
  .countBig{ font-weight: 900; font-size: 22px; line-height:1; }
  .countSmall{ color: rgba(11,26,42,.7); font-size: 12px; margin-top: 4px; }

  .deckArea{ margin-top: 14px; position:relative; z-index:2; }
  .deckTopRow{ display:flex; justify-content:space-between; gap:12px; flex-wrap:wrap; align-items:center; margin-bottom: 12px; }

  .deckNav{ display:flex; gap:10px; flex-wrap:wrap; }
  .btn{
    padding: 11px 14px;
    border-radius: 14px;
    border: 1px solid rgba(255,255,255,.7);
    background: rgba(255,255,255,.38);
    box-shadow: 0 12px 26px rgba(20,60,110,.10);
    font-weight: 750;
    font-size: 14px;
    cursor:pointer;
    transition: transform .15s ease;
  }
  .btn:hover{ transform: translateY(-1px); }
  .btn:disabled{ opacity:.5; cursor:not-allowed; transform:none; }
  .btn.primary{
    background: linear-gradient(180deg, rgba(255,255,255,.75), rgba(255,255,255,.35));
  }

  .deckMeta{ display:flex; gap:8px; flex-wrap:wrap; justify-content:flex-end; align-items:center; }
  .pillSoft{
    font-size: 12.5px;
    color: rgba(11,26,42,.78);
    padding: 7px 10px;
    border-radius: 999px;
    background: rgba(255,255,255,.4);
    border: 1px solid rgba(255,255,255,.65);
  }
  .pillBtn{
    font-size: 12.5px;
    color: rgba(11,26,42,.85);
    padding: 7px 10px;
    border-radius: 999px;
    background: rgba(255,255,255,.55);
    border: 1px solid rgba(255,255,255,.75);
    cursor:pointer;
    font-weight: 850;
  }
  .pillBtn:hover{ transform: translateY(-1px); transition: transform .15s ease; }

  .card{ padding: 16px; }
  .cardHead{ display:flex; justify-content:space-between; gap:12px; flex-wrap:wrap; align-items:flex-start; margin-bottom: 10px; }
  .title{ font-weight: 900; letter-spacing:-.02em; font-size: 18px; }
  .sub{ color: rgba(11,26,42,.7); font-size: 13px; margin-top: 2px; }
  .tags{ display:flex; gap:8px; flex-wrap:wrap; }
  .tag{
    font-size: 12px;
    padding: 7px 10px;
    border-radius: 999px;
    background: rgba(255,255,255,.35);
    border: 1px solid rgba(255,255,255,.65);
    color: rgba(11,26,42,.72);
  }

  /* EXPLICIT SCROLL AREA */
  .cardBody{
    position: relative;
    max-height: 420px;
    overflow-y: scroll;
    scrollbar-gutter: stable both-edges;
    padding-right: 10px;
    padding-left: 2px;
  }
  .cardBody{ scrollbar-width: thin; scrollbar-color: rgba(11,26,42,.28) rgba(255,255,255,.18); }
  .cardBody::-webkit-scrollbar{ width: 12px; }
  .cardBody::-webkit-scrollbar-thumb{
    background: rgba(11,26,42,.20);
    border: 3px solid rgba(255,255,255,.45);
    border-radius: 999px;
  }
  .cardBody::-webkit-scrollbar-track{
    background: rgba(255,255,255,.20);
    border-radius: 999px;
  }

  .cardBody h3{ margin: 14px 0 8px; letter-spacing:-.02em; }
  .cardBody ul{ margin: 8px 0 0 18px; }
  .cardBody p, .cardBody li{ font-size: 14.5px; }

  .scrollHintTop, .scrollHintBottom{
    position: sticky;
    left: 0; right: 0;
    height: 18px;
    pointer-events:none;
    z-index: 2;
  }
  .scrollHintTop{
    top: 0;
    background: linear-gradient(180deg, rgba(255,255,255,.85), rgba(255,255,255,0));
    margin-bottom: -18px;
  }
  .scrollHintBottom{
    bottom: 0;
    background: linear-gradient(0deg, rgba(255,255,255,.85), rgba(255,255,255,0));
    margin-top: -18px;
  }

  .dots{ display:flex; justify-content:center; gap:8px; margin-top: 14px; }
  .dot{
    width: 10px; height: 10px;
    border-radius: 999px;
    border: 1px solid rgba(255,255,255,.75);
    background: rgba(255,255,255,.45);
    cursor:pointer;
  }
  .dot.active{
    background: rgba(255,255,255,.95);
    box-shadow: 0 10px 20px rgba(20,60,110,.10);
  }

  .empty{ padding: 18px; }
  .foot{ margin-top: 16px; position:relative; z-index:2; }
  .footCard{ padding: 12px 14px; text-align:center; color: rgba(11,26,42,.7); font-size: 13.5px; }

  /* MODAL */
  .modalBackdrop{
    position: fixed;
    inset: 0;
    background: rgba(11,26,42,.42);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    display:flex;
    align-items:center;
    justify-content:center;
    padding: 18px;
    z-index: 9999;
  }
  .modal{
    width: min(980px, 100%);
    max-height: 92vh;
    border-radius: 22px;
    border: 1px solid rgba(255,255,255,.55);
    background: rgba(255,255,255,.70);
    box-shadow: 0 20px 60px rgba(0,0,0,.25);
    display:flex;
    flex-direction:column;
    overflow:hidden;
  }
  .modalHead{
    display:flex;
    justify-content:space-between;
    align-items:flex-start;
    gap: 12px;
    padding: 14px 14px 12px;
    border-bottom: 1px solid rgba(255,255,255,.55);
    background: rgba(255,255,255,.55);
  }
  .modalTitle{ font-weight: 950; letter-spacing:-.02em; font-size: 18px; }
  .modalSub{ margin-top: 3px; color: rgba(11,26,42,.7); font-size: 13px; }

  .modalBody{
    position: relative;
    padding: 14px;
    overflow-y: scroll;
    scrollbar-gutter: stable both-edges;
  }
  .modalBody{ scrollbar-width: thin; scrollbar-color: rgba(11,26,42,.28) rgba(255,255,255,.18); }
  .modalBody::-webkit-scrollbar{ width: 12px; }
  .modalBody::-webkit-scrollbar-thumb{
    background: rgba(11,26,42,.20);
    border: 3px solid rgba(255,255,255,.55);
    border-radius: 999px;
  }
  .modalBody::-webkit-scrollbar-track{
    background: rgba(255,255,255,.25);
    border-radius: 999px;
  }

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
    h1{ font-size: 34px; }
    .controls{ grid-template-columns: 1fr; }
    .top{ flex-direction:column; align-items:flex-start; }
    .right{ justify-content:flex-start; }
    .deckMeta{ justify-content:flex-start; }
  }
`;
