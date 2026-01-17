// app/journal/JournalDeck.tsx
"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import { ALL_ENTRIES } from "./entries";
import SlideReel from "./SlideReel";

type Entry = (typeof ALL_ENTRIES)[number] & {
  tags?: string[];
  searchText?: string;
  Card: () => ReactNode;
};

// helper: show as "Jan 16, 2026"
function prettyDate(dateISO: string) {
  const d = new Date(dateISO + "T00:00:00");
  return d.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

// title-only search failsafe (safe + predictable)
function normalizeTitleQuery(input: string) {
  return input
    .trim()
    .toLowerCase()
    // keep letters/numbers/spaces + basic quotes/dashes
    .replace(/[^\p{L}\p{N}\s'’-]/gu, "")
    .replace(/\s+/g, " ")
    .slice(0, 60);
}

export default function JournalDeck(props: { embedded?: boolean }) {
  const embedded = props.embedded ?? false;

  const [sort, setSort] = useState<"newest" | "oldest">("newest");
  const [dateQuery, setDateQuery] = useState<string>(""); // YYYY-MM-DD
  const [q, setQ] = useState<string>(""); // title search
  const [index, setIndex] = useState(0);

  // modal expand (only used when NOT embedded)
  const [expanded, setExpanded] = useState(false);

  const sorted = useMemo<Entry[]>(() => {
    const copy = [...ALL_ENTRIES] as Entry[];
    copy.sort((a, b) => {
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

  const filtered = useMemo<Entry[]>(() => {
    let list: Entry[] = sorted;

    // date filter
    if (dateQuery) list = list.filter((e) => e.dateISO === dateQuery);

    // title-only filter (failsafe)
    const query = normalizeTitleQuery(q);
    if (query) {
      list = list.filter((e) => (e.title ?? "").toLowerCase().includes(query));
    }

    return list;
  }, [sorted, dateQuery, q]);

  // keep index valid when filters change
  useEffect(() => {
    setIndex(0);
  }, [sort, dateQuery, q]);

  const total = ALL_ENTRIES.length;
  const showing = filtered.length;

  const current: Entry | null = showing > 0 ? filtered[Math.min(index, showing - 1)] : null;

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
  function resetNewest() {
    setSort("newest");
    setDateQuery("");
    setQ("");
    setIndex(0);
  }

  // keyboard: arrows for deck when NOT embedded and modal not open
  // Esc closes modal (even if embedded — but modal never opens in embedded)
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setExpanded(false);
        return;
      }
      if (embedded) return;
      if (expanded) return;
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    }

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [embedded, expanded, showing]);

  // lock body scroll when modal open
  useEffect(() => {
    if (!expanded) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [expanded]);

  return (
    <div className={`jd ${embedded ? "jdEmbedded" : ""}`}>
      <div className="jdTop">
        {embedded ? (
          <>
            <div className="jdBadge">💌 journal deck</div>
            <div className="jdTitle">Flip through entries like a slideshow</div>
            <div className="jdDesc">
              Search by date, sort newest/oldest, and search titles — no database.
            </div>
          </>
        ) : (
          <>
            <div className="jdBadge">journal</div>
            <div className="jdTitle">Journal Deck</div>
            <div className="jdDesc">
              Card-style entries, searchable by date + title, sortable by time.
            </div>
          </>
        )}
      </div>

      <div className="jdControls">
        <div className="jdControl">
          <label>Order</label>
          <select value={sort} onChange={(e) => setSort(e.target.value as any)}>
            <option value="newest">Most recent</option>
            <option value="oldest">Oldest</option>
          </select>
        </div>

        <div className="jdControl">
          <label>Search by date</label>
          <input type="date" value={dateQuery} onChange={(e) => setDateQuery(e.target.value)} />
        </div>

        <div className="jdControl">
          <label>Search titles</label>
          <input
            type="text"
            placeholder="try: build log"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>

        <div className="jdCounter" aria-label="Entry count">
          <div className="jdCountBig">{showing}</div>
        </div>
      </div>

      <div className="jdDeckTopRow">
        <div className="jdNav" aria-label="Deck navigation">
          <button className="jdBtn jdBtnPrimary" onClick={resetNewest}>
            Newest
          </button>
          <button className="jdBtn" onClick={prev} disabled={showing === 0} aria-label="Previous entry">
            ←
          </button>
          <button className="jdBtn" onClick={next} disabled={showing === 0} aria-label="Next entry">
            →
          </button>
          <button className="jdBtn" onClick={random} disabled={showing === 0} aria-label="Random entry">
            shuffle
          </button>
        </div>

        <div className="jdMeta" aria-label="Deck metadata">
          {showing === 0 || !current ? (
            <span className="jdPillSoft">No entries match that filter.</span>
          ) : (
            <>
              <span className="jdPillSoft">
                {index + 1} / {showing}
              </span>
              <span className="jdPillSoft">{prettyDate(current.dateISO)}</span>
              <span className="jdPillSoft">{current.mood}</span>

              {/* Only show expand on the /journal page (non-embedded). No button on homepage preview. */}
              {!embedded ? (
                <button
                  className="jdPillBtn"
                  onClick={() => setExpanded(true)}
                  aria-label="Expand entry"
                >
                  Expand ⤢
                </button>
              ) : null}
            </>
          )}
        </div>
      </div>

      {showing === 0 || !current ? (
        <div className="jdEmpty">
          <div className="jdEmptyTitle">No matches</div>
          <div className="jdEmptySub">Try clearing the date and title filters.</div>
          <div className="jdEmptyActions">
            <button className="jdBtn jdBtnPrimary" onClick={() => setDateQuery("")}>
              Clear date
            </button>
            <button className="jdBtn jdBtnPrimary" onClick={() => setQ("")}>
              Clear title
            </button>
            <button className="jdBtn jdBtnPrimary" onClick={resetNewest}>
              Reset
            </button>
          </div>
        </div>
      ) : (
        <SlideReel slides={filtered} index={index} setIndex={setIndex} embedded={embedded} />
      )}

      {/* Expand modal (ONLY for non-embedded mode) */}
      {!embedded && expanded && current ? (
        <div
          className="jdModalBackdrop"
          role="dialog"
          aria-modal="true"
          aria-label="Expanded journal entry"
          onClick={() => setExpanded(false)}
        >
          <div className="jdModal" onClick={(e) => e.stopPropagation()}>
            <div className="jdModalHead">
              <div>
                <div className="jdModalTitle">{current.title}</div>
                <div className="jdModalSub">
                  {prettyDate(current.dateISO)} · {current.mood}
                </div>
              </div>

              <div className="jdModalActions">
                <button className="jdBtn" onClick={() => setExpanded(false)}>
                  Close ✕
                </button>
              </div>
            </div>

            <div className="jdModalBody" aria-label="Expanded entry content (scrollable)">
              <div className="jdScrollHintTop" />
              {current.Card ? <current.Card /> : null}
              <div className="jdScrollHintBottom" />
            </div>
          </div>
        </div>
      ) : null}

      <style>{styles}</style>
    </div>
  );
}

const styles = `
  /* Component-scoped only. No :root, no body. */
  .jd{
    width:100%;
    --ink: #0b1a2a;
    --muted: rgba(11,26,42,.72);
    --muted2: rgba(11,26,42,.62);
    --glass: rgba(255,255,255,.58);
    --stroke: rgba(255,255,255,.52);
    --shadow: 0 10px 30px rgba(20,60,110,.14);
    --shadowSoft: 0 12px 26px rgba(20,60,110,.10);
    --radius: 22px;
    --radius2: 18px;
    --focus: 0 0 0 4px rgba(180,220,255,.65);
    --jd-card-h: 420px;
  }

  .jdEmbedded{ --jd-card-h: 360px; }

  .jd *{ box-sizing:border-box; }

  .jdTop{ margin-bottom: 12px; }
  .jdBadge{
    display:inline-block;
    padding: 7px 10px;
    border-radius: 999px;
    background: rgba(255,255,255,.40);
    border: 1px solid rgba(255,255,255,.65);
    color: rgba(11,26,42,.80);
    font-size: 13px;
    margin-bottom: 10px;
  }
  .jdTitle{
    font-weight: 900;
    letter-spacing:-.03em;
    font-size: 20px;
    margin-bottom: 6px;
  }
  .jdDesc{ color: var(--muted); line-height:1.55; }

  .jdControls{
    display:grid;
    grid-template-columns: 1fr 1fr 1.2fr auto;
    gap: 12px;
    align-items:end;
    margin: 12px 0 12px;
  }
  .jdControl label{
    display:block;
    font-size: 12px;
    color: rgba(11,26,42,.75);
    margin: 0 0 6px;
  }

  .jdControls select,
  .jdControls input[type="date"],
  .jdControls input[type="text"]{
    width:100%;
    padding: 10px 12px;
    border-radius: 14px;
    border: 1px solid rgba(255,255,255,.72);
    background: rgba(255,255,255,.52);
    outline:none;
    font-weight: 650;
    color: rgba(11,26,42,.92);
    box-shadow: 0 1px 0 rgba(255,255,255,.55) inset;
  }
  .jdControls select:focus,
  .jdControls input[type="date"]:focus,
  .jdControls input[type="text"]:focus{
    box-shadow: var(--focus);
  }

  .jdHint{
    margin-top: 6px;
    font-size: 12px;
    color: var(--muted2);
  }

  .jdCounter{
    text-align:right;
    padding: 10px 12px;
    border-radius: 14px;
    border: 1px solid rgba(255,255,255,.72);
    background: rgba(255,255,255,.40);
  }
  .jdCountBig{ font-weight: 950; font-size: 22px; line-height:1; letter-spacing:-.02em; }
  .jdCountSmall{ color: rgba(11,26,42,.70); font-size: 12px; margin-top: 4px; }

  .jdDeckTopRow{
    display:flex;
    justify-content:space-between;
    gap:12px;
    flex-wrap:wrap;
    align-items:center;
    margin-bottom: 12px;
  }

  .jdNav{ display:flex; gap:10px; flex-wrap:wrap; }

  .jdBtn{
    padding: 11px 14px;
    border-radius: 14px;
    border: 1px solid rgba(255,255,255,.72);
    background: rgba(255,255,255,.44);
    box-shadow: var(--shadowSoft);
    font-weight: 780;
    font-size: 14px;
    cursor:pointer;
    transition: transform .12s ease, box-shadow .12s ease, opacity .12s ease;
  }
  .jdBtn:hover{ transform: translateY(-1px); }
  .jdBtn:active{ transform: translateY(0); }
  .jdBtn:focus-visible{ outline:none; box-shadow: var(--focus); }
  .jdBtn:disabled{ opacity:.5; cursor:not-allowed; transform:none; }
  .jdBtnPrimary{
    background: linear-gradient(180deg, rgba(255,255,255,.80), rgba(255,255,255,.42));
  }

  .jdMeta{ display:flex; gap:8px; flex-wrap:wrap; justify-content:flex-end; align-items:center; }

  .jdPillSoft{
    font-size: 12.5px;
    color: rgba(11,26,42,.78);
    padding: 7px 10px;
    border-radius: 999px;
    background: rgba(255,255,255,.42);
    border: 1px solid rgba(255,255,255,.68);
  }

  .jdPillBtn{
    display:inline-flex;
    align-items:center;
    gap:8px;
    font-size: 12.5px;
    color: rgba(11,26,42,.88);
    padding: 7px 10px;
    border-radius: 999px;
    background: rgba(255,255,255,.62);
    border: 1px solid rgba(255,255,255,.78);
    cursor:pointer;
    font-weight: 900;
    transition: transform .12s ease, opacity .12s ease;
    text-decoration:none;
  }
  .jdPillBtn:hover{ transform: translateY(-1px); opacity:.95; }
  .jdPillBtn:active{ transform: translateY(0); }
  .jdPillBtn:focus-visible{ outline:none; box-shadow: var(--focus); }

    .jdCard{
    padding: 16px;
    border-radius: var(--radius);
    background: var(--glass);
    border: 1px solid var(--stroke);
    box-shadow: var(--shadow);
    backdrop-filter: blur(14px);
    -webkit-backdrop-filter: blur(14px);

    height: var(--jd-card-h);
    overflow: auto;        /* ✅ card scrolls */
    min-height: 0;
    }

  .jdCardHead{
    display:flex;
    justify-content:space-between;
    gap:12px;
    flex-wrap:wrap;
    align-items:flex-start;
    margin-bottom: 10px;
  }
  .jdCardTitle{ font-weight: 950; letter-spacing:-.02em; font-size: 18px; color: var(--ink); }
  .jdCardSub{ color: rgba(11,26,42,.70); font-size: 13px; margin-top: 2px; }

  .jdTags{ display:flex; gap:8px; flex-wrap:wrap; }
  .jdTag{
    font-size: 12px;
    padding: 7px 10px;
    border-radius: 999px;
    background: rgba(255,255,255,.38);
    border: 1px solid rgba(255,255,255,.68);
    color: rgba(11,26,42,.72);
  }

  /* Explicit scroll area */
    .jdCardBody{
    position: relative;
    overflow: visible;     /* ✅ no inner scroll */
    padding-right: 0;
    padding-left: 0;
    }
    
  /* Firefox */
  .jdCardBody{ scrollbar-width: thin; scrollbar-color: rgba(11,26,42,.28) rgba(255,255,255,.18); }

  .jdCardBody h3{ margin: 14px 0 8px; letter-spacing:-.02em; }
  .jdCardBody ul{ margin: 8px 0 0 18px; }
  .jdCardBody p, .jdCardBody li{
    color: rgba(11,26,42,.74);
    line-height:1.65;
    font-size: 14.5px;
  }

  /* Webkit scrollbars */
  .jdCardBody::-webkit-scrollbar{ width: 12px; }
  .jdCardBody::-webkit-scrollbar-thumb{
    background: rgba(11,26,42,.18);
    border: 3px solid rgba(255,255,255,.50);
    border-radius: 999px;
  }
  .jdCardBody::-webkit-scrollbar-track{
    background: rgba(255,255,255,.18);
    border-radius: 999px;
  }

  /* subtle scroll “fade” hints */
  .jdScrollHintTop, .jdScrollHintBottom{
    position: sticky;
    left: 0; right: 0;
    height: 18px;
    pointer-events:none;
    z-index: 2;
  }
  .jdScrollHintTop{
    top: 0;
    background: linear-gradient(180deg, rgba(255,255,255,.82), rgba(255,255,255,0));
    margin-bottom: -18px;
  }
  .jdScrollHintBottom{
    bottom: 0;
    background: linear-gradient(0deg, rgba(255,255,255,.82), rgba(255,255,255,0));
    margin-top: -18px;
  }

  .jdDots{ display:flex; justify-content:center; gap:8px; margin-top: 14px; }
  .jdDot{
    width: 10px; height: 10px;
    border-radius: 999px;
    border: 1px solid rgba(255,255,255,.78);
    background: rgba(255,255,255,.50);
    cursor:pointer;
    transition: transform .12s ease, opacity .12s ease;
  }
  .jdDot:hover{ transform: translateY(-1px); }
  .jdDot:focus-visible{ outline:none; box-shadow: var(--focus); }
  .jdDot.active{
    background: rgba(255,255,255,.95);
    box-shadow: 0 10px 20px rgba(20,60,110,.10);
  }

  .jdEmpty{
    padding: 16px;
    border-radius: var(--radius);
    background: rgba(255,255,255,.50);
    border: 1px solid rgba(255,255,255,.65);
  }
  .jdEmptyTitle{ font-weight: 950; margin-bottom: 6px; letter-spacing:-.02em; }
  .jdEmptySub{ color: rgba(11,26,42,.72); margin-bottom: 10px; }
  .jdEmptyActions{ display:flex; gap:10px; flex-wrap:wrap; }

  /* MODAL (polished glass) */
  .jdModalBackdrop{
    position: fixed;
    inset: 0;
    background: rgba(8,16,28,.55);
    backdrop-filter: blur(14px);
    -webkit-backdrop-filter: blur(14px);
    display:flex;
    align-items:center;
    justify-content:center;
    padding: 18px;
    z-index: 9999;
  }

  .jdModal{
    width: min(940px, 96vw);
    max-height: min(92vh, 920px);
    border-radius: 26px;
    border: 1px solid rgba(255,255,255,.55);
    background: linear-gradient(180deg, rgba(255,255,255,.82), rgba(255,255,255,.66));
    box-shadow:
      0 30px 90px rgba(0,0,0,.30),
      0 1px 0 rgba(255,255,255,.35) inset;
    overflow: hidden;
    display:flex;
    flex-direction:column;
    transform: translateY(6px) scale(.985);
    animation: jdPop .16s ease-out forwards;
    min-height: 0;
  }

  @keyframes jdPop{
    to { transform: translateY(0) scale(1); }
  }

  .jdModalHead{
    display:flex;
    justify-content:space-between;
    align-items:flex-start;
    gap: 14px;
    padding: 16px 16px 14px;
    border-bottom: 1px solid rgba(11,26,42,.06);
    background: rgba(255,255,255,.55);
  }

  .jdModalTitle{
    font-weight: 950;
    letter-spacing:-.02em;
    font-size: 20px;
    color: var(--ink);
  }
  .jdModalSub{
    margin-top: 4px;
    color: rgba(11,26,42,.68);
    font-size: 13.5px;
  }

  .jdModalActions{ display:flex; gap: 10px; align-items:center; }

  .jdModalBody{
    position: relative;
    padding: 16px;
    overflow: auto;
    scrollbar-gutter: stable both-edges;
    min-height: 0;
  }
  .jdModalBody{ scrollbar-width: thin; scrollbar-color: rgba(11,26,42,.26) rgba(255,255,255,.18); }
  .jdModalBody::-webkit-scrollbar{ width: 12px; }
  .jdModalBody::-webkit-scrollbar-thumb{
    background: rgba(11,26,42,.18);
    border: 3px solid rgba(255,255,255,.55);
    border-radius: 999px;
  }
  .jdModalBody::-webkit-scrollbar-track{
    background: rgba(255,255,255,.22);
    border-radius: 999px;
  }

  /* Responsive */
  @media (max-width: 900px){
    .jdControls{ grid-template-columns: 1fr; }
    .jdMeta{ justify-content:flex-start; }
  }
      .jdP{ margin: 0 0 10px; color: rgba(11,26,42,.74); line-height:1.65; font-size: 14.5px; }
  .jdSection{ margin-top: 14px; }
  .jdH3{ margin: 0 0 8px; letter-spacing:-.02em; }
  .jdSectionBody{ }

  .jdList{ margin: 8px 0 0 18px; padding: 0; }
  .jdListTight{ margin-top: 0; }
  .jdLi{ color: rgba(11,26,42,.74); line-height:1.65; font-size: 14.5px; }

  .jdStrong{ font-weight: 900; color: rgba(11,26,42,.90); }
  .jdMono{
    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
    font-size: .92em;
    padding: 1px 6px;
    border-radius: 999px;
    background: rgba(255,255,255,.52);
    border: 1px solid rgba(255,255,255,.68);
    color: rgba(11,26,42,.82);
  }
`;
