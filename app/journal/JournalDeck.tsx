// app/journal/JournalDeck.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { ALL_ENTRIES } from "./entries";

type JournalEntry = {
  id: string;
  dateISO: string;
  title: string;
  mood: string;
  tags?: string[];
  searchText?: string;
  Card: () => React.ReactNode;
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
  const [q, setQ] = useState<string>(""); // title search (failsafe)
  const [index, setIndex] = useState(0);

  // modal expand
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

    // date filter
    if (dateQuery) list = list.filter((e) => e.dateISO === dateQuery);

    // title-only keyword filter (failsafe)
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

  const current: JournalEntry | null = showing > 0 ? (filtered[index] as any) : null;
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

  // keyboard arrows (only when NOT embedded) + Esc to close modal
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setExpanded(false);
      if (embedded) return;
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showing, embedded]);

  // lock page scroll when modal open
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
      {!embedded ? (
        <div className="jdTop">
          <div className="jdBadge"> journal</div>
          <div className="jdTitle">Journal Deck</div>
          <div className="jdDesc">
            Card-style entries, searchable by date + title, sortable by time. Updates by commits only.
          </div>
        </div>
      ) : (
        <div className="jdTop">
          <div className="jdBadge">💌 journal deck</div>
          <div className="jdTitle">Flip through entries like a slideshow</div>
          <div className="jdDesc">Search by date, sort newest/oldest, and search titles — no database.</div>
        </div>
      )}

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
          <div className="jdHint">Title-only search (failsafe) — no IDs, no parsing drama.</div>
        </div>

        <div className="jdCounter">
          <div className="jdCountBig">{showing}</div>
          <div className="jdCountSmall">showing / {total} total</div>
        </div>
      </div>

      <div className="jdDeckTopRow">
        <div className="jdNav">
          <button className="jdBtn jdBtnPrimary" onClick={newest}>
            Newest
          </button>
          <button className="jdBtn" onClick={prev} disabled={showing === 0}>
            ←
          </button>
          <button className="jdBtn" onClick={next} disabled={showing === 0}>
            →
          </button>
          <button className="jdBtn" onClick={random} disabled={showing === 0}>
            shuffle
          </button>
        </div>

        <div className="jdMeta">
          {showing === 0 || !current ? (
            <span className="jdPillSoft">No entries match that filter.</span>
          ) : (
            <>
              <span className="jdPillSoft">
                {index + 1} / {showing}
              </span>
              <span className="jdPillSoft">{prettyDate(current.dateISO)}</span>
              <span className="jdPillSoft">{current.mood}</span>
              <button className="jdPillBtn" onClick={() => setExpanded(true)} aria-label="Expand entry">
                Expand ⤢
              </button>
            </>
          )}
        </div>
      </div>

      {showing === 0 ? (
        <div className="jdEmpty">
          <div className="jdEmptyTitle">No matches</div>
          <div className="jdEmptySub">Try clearing the date and title filters.</div>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <button className="jdBtn jdBtnPrimary" onClick={() => setDateQuery("")}>
              Clear date
            </button>
            <button className="jdBtn jdBtnPrimary" onClick={() => setQ("")}>
              Clear title
            </button>
            <button className="jdBtn jdBtnPrimary" onClick={newest}>
              Reset
            </button>
          </div>
        </div>
      ) : (
        <article className="jdCard">
          <div className="jdCardHead">
            <div>
              <div className="jdCardTitle">{current!.title}</div>
              <div className="jdCardSub">{prettyDate(current!.dateISO)}</div>
            </div>

            {current!.tags?.length ? (
              <div className="jdTags">
                {current!.tags.slice(0, 4).map((t) => (
                  <span className="jdTag" key={`${current!.id}-${t}`}>
                    #{t}
                  </span>
                ))}
              </div>
            ) : null}
          </div>

          {/* Explicit scroll area */}
          <div className="jdCardBody" aria-label="Entry content (scrollable)">
            <div className="jdScrollHintTop" />
            {CardComp ? <CardComp /> : null}
            <div className="jdScrollHintBottom" />
          </div>

          <div className="jdDots" aria-label="Entry dots">
            {filtered.map((e, i) => (
              <button
                key={`${e.id}-${e.dateISO}-${i}`}
                className={`jdDot ${i === index ? "active" : ""}`}
                onClick={() => setIndex(i)}
                aria-label={`Go to ${e.title}`}
              />
            ))}
          </div>
        </article>
      )}

      {/* Expand modal */}
      {expanded && current ? (
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
  .jd{ width:100%; }

  .jdTop{ margin-bottom: 12px; }
  .jdBadge{
    display:inline-block;
    padding: 7px 10px;
    border-radius: 999px;
    background: rgba(255,255,255,.4);
    border: 1px solid rgba(255,255,255,.65);
    color: rgba(11,26,42,.8);
    font-size: 13px;
    margin-bottom: 10px;
  }
  .jdTitle{
    font-weight: 900;
    letter-spacing:-.03em;
    font-size: 22px;
    margin-bottom: 6px;
  }
  .jdDesc{ color: rgba(11,26,42,.72); line-height:1.55; }

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
    border: 1px solid rgba(255,255,255,.7);
    background: rgba(255,255,255,.45);
    outline:none;
    font-weight: 650;
    color: rgba(11,26,42,.9);
  }
  .jdHint{
    margin-top: 6px;
    font-size: 12px;
    color: rgba(11,26,42,.62);
  }

  .jdCounter{
    text-align:right;
    padding: 10px 12px;
    border-radius: 14px;
    border: 1px solid rgba(255,255,255,.7);
    background: rgba(255,255,255,.35);
  }
  .jdCountBig{ font-weight: 900; font-size: 22px; line-height:1; }
  .jdCountSmall{ color: rgba(11,26,42,.7); font-size: 12px; margin-top: 4px; }

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
    border: 1px solid rgba(255,255,255,.7);
    background: rgba(255,255,255,.38);
    box-shadow: 0 12px 26px rgba(20,60,110,.10);
    font-weight: 750;
    font-size: 14px;
    cursor:pointer;
    transition: transform .15s ease;
  }
  .jdBtn:hover{ transform: translateY(-1px); }
  .jdBtn:disabled{ opacity:.5; cursor:not-allowed; transform:none; }
  .jdBtnPrimary{
    background: linear-gradient(180deg, rgba(255,255,255,.75), rgba(255,255,255,.35));
  }

  .jdMeta{ display:flex; gap:8px; flex-wrap:wrap; justify-content:flex-end; align-items:center; }
  .jdPillSoft{
    font-size: 12.5px;
    color: rgba(11,26,42,.78);
    padding: 7px 10px;
    border-radius: 999px;
    background: rgba(255,255,255,.4);
    border: 1px solid rgba(255,255,255,.65);
  }
  .jdPillBtn{
    font-size: 12.5px;
    color: rgba(11,26,42,.85);
    padding: 7px 10px;
    border-radius: 999px;
    background: rgba(255,255,255,.55);
    border: 1px solid rgba(255,255,255,.75);
    cursor:pointer;
    font-weight: 850;
  }
  .jdPillBtn:hover{ transform: translateY(-1px); transition: transform .15s ease; }

  .jdCard{
    padding: 16px;
    border-radius: 22px;
    background: rgba(255,255,255,.58);
    border: 1px solid rgba(255,255,255,.5);
    box-shadow: 0 10px 30px rgba(20,60,110,.14);
    backdrop-filter: blur(14px);
    -webkit-backdrop-filter: blur(14px);
    height: 420px;
    display:flex;
    flex-direction:column;
  }
  .jdCardHead{
    display:flex;
    justify-content:space-between;
    gap:12px;
    flex-wrap:wrap;
    align-items:flex-start;
    margin-bottom: 10px;
  }
  .jdCardTitle{ font-weight: 900; letter-spacing:-.02em; font-size: 18px; }
  .jdCardSub{ color: rgba(11,26,42,.7); font-size: 13px; margin-top: 2px; }
  .jdTags{ display:flex; gap:8px; flex-wrap:wrap; }
  .jdTag{
    font-size: 12px;
    padding: 7px 10px;
    border-radius: 999px;
    background: rgba(255,255,255,.35);
    border: 1px solid rgba(255,255,255,.65);
    color: rgba(11,26,42,.72);
  }

  /* EXPLICIT SCROLL AREA */
  .jdCardBody{
    position: relative;
    flex: 1;
    overflow-y: scroll;                 /* explicit scrollbar area */
    scrollbar-gutter: stable both-edges;/* keep layout stable */
    padding-right: 10px;
    padding-left: 2px;
  }
  /* Firefox */
  .jdCardBody{ scrollbar-width: thin; scrollbar-color: rgba(11,26,42,.28) rgba(255,255,255,.18); }

  .jdCardBody h3{ margin: 14px 0 8px; letter-spacing:-.02em; }
  .jdCardBody ul{ margin: 8px 0 0 18px; }
  .jdCardBody p, .jdCardBody li{ color: rgba(11,26,42,.72); line-height:1.6; font-size: 14.5px; }

  /* Webkit scrollbars */
  .jdCardBody::-webkit-scrollbar{ width: 12px; }
  .jdCardBody::-webkit-scrollbar-thumb{
    background: rgba(11,26,42,.20);
    border: 3px solid rgba(255,255,255,.45);
    border-radius: 999px;
  }
  .jdCardBody::-webkit-scrollbar-track{
    background: rgba(255,255,255,.20);
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
    background: linear-gradient(180deg, rgba(255,255,255,.85), rgba(255,255,255,0));
    margin-bottom: -18px;
  }
  .jdScrollHintBottom{
    bottom: 0;
    background: linear-gradient(0deg, rgba(255,255,255,.85), rgba(255,255,255,0));
    margin-top: -18px;
  }

  .jdDots{ display:flex; justify-content:center; gap:8px; margin-top: 14px; }
  .jdDot{
    width: 10px; height: 10px;
    border-radius: 999px;
    border: 1px solid rgba(255,255,255,.75);
    background: rgba(255,255,255,.45);
    cursor:pointer;
  }
  .jdDot.active{
    background: rgba(255,255,255,.95);
    box-shadow: 0 10px 20px rgba(20,60,110,.10);
  }

  .jdEmpty{
    padding: 16px;
    border-radius: 22px;
    background: rgba(255,255,255,.50);
    border: 1px solid rgba(255,255,255,.65);
  }
  .jdEmptyTitle{ font-weight: 900; margin-bottom: 6px; }
  .jdEmptySub{ color: rgba(11,26,42,.72); margin-bottom: 10px; }

  /* MODAL */
  .jdModalBackdrop{
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
  .jdModal{
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
  .jdModalHead{
    display:flex;
    justify-content:space-between;
    align-items:flex-start;
    gap: 12px;
    padding: 14px 14px 12px;
    border-bottom: 1px solid rgba(255,255,255,.55);
    background: rgba(255,255,255,.55);
  }
  .jdModalTitle{ font-weight: 950; letter-spacing:-.02em; font-size: 18px; }
  .jdModalSub{ margin-top: 3px; color: rgba(11,26,42,.7); font-size: 13px; }
  .jdModalActions{ display:flex; gap: 10px; align-items:center; }

  .jdModalBody{
    position: relative;
    padding: 14px;
    overflow-y: scroll;                 /* explicit scrollbar */
    scrollbar-gutter: stable both-edges;
  }
  .jdModalBody{ scrollbar-width: thin; scrollbar-color: rgba(11,26,42,.28) rgba(255,255,255,.18); }
  .jdModalBody::-webkit-scrollbar{ width: 12px; }
  .jdModalBody::-webkit-scrollbar-thumb{
    background: rgba(11,26,42,.20);
    border: 3px solid rgba(255,255,255,.55);
    border-radius: 999px;
  }
  .jdModalBody::-webkit-scrollbar-track{
    background: rgba(255,255,255,.25);
    border-radius: 999px;
  }

  /* embedded tweaks */
  .jdEmbedded .jdTitle{ font-size: 18px; }
  .jdEmbedded .jdControls{ grid-template-columns: 1fr 1fr 1.2fr auto; }

  @media (max-width: 900px){
    .jdControls{ grid-template-columns: 1fr; }
    .jdMeta{ justify-content:flex-start; }
  }
`;
