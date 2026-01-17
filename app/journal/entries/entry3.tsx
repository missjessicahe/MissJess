// entry3.tsx
"use client";

import { useEffect, useMemo, useState } from "react";

export const entry3 = {
  id: "entry-3",
  dateISO: "2026-01-18",
  title: "Next steps",
  mood: "calm planning · soft systems 🫧",
  tags: ["planning", "structure"],
  Card() {
    function normalizeQuery(s: string) {
      // failsafe: title-ish search only, safe chars only, clamp length
      return s
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9\s'’-]/g, "")
        .replace(/\s+/g, " ")
        .slice(0, 40);
    }

    function RoadmapBoard() {
      const [cols, setCols] = useState([
        {
          name: "Now",
          items: [
            { id: "ss", t: "Project screenshots" },
            { id: "deck", t: "Journal deck UX polish" },
          ],
        },
        {
          name: "Next",
          items: [
            { id: "search", t: "Title search (failsafe)" },
            { id: "logs", t: "Weekly change logs per project" },
          ],
        },
        {
          name: "Later",
          items: [
            { id: "gallery", t: "Tiny gallery components" },
            { id: "notes", t: "Micro-notes per commit" },
          ],
        },
      ]);

      const [flash, setFlash] = useState<string | null>(null);

      function bump(colIdx: number, itemIdx: number) {
        setCols((prev) => {
          const copy = prev.map((c) => ({ ...c, items: [...c.items] }));
          const [it] = copy[colIdx].items.splice(itemIdx, 1);
          copy[colIdx].items.unshift(it);
          return copy;
        });
        const id = cols[colIdx].items[itemIdx]?.id;
        if (id) {
          setFlash(id);
          setTimeout(() => setFlash(null), 420);
        }
      }

      function moveRight(colIdx: number, itemIdx: number) {
        if (colIdx >= cols.length - 1) return;
        setCols((prev) => {
          const copy = prev.map((c) => ({ ...c, items: [...c.items] }));
          const [it] = copy[colIdx].items.splice(itemIdx, 1);
          copy[colIdx + 1].items.unshift(it);
          return copy;
        });
      }

      function moveLeft(colIdx: number, itemIdx: number) {
        if (colIdx <= 0) return;
        setCols((prev) => {
          const copy = prev.map((c) => ({ ...c, items: [...c.items] }));
          const [it] = copy[colIdx].items.splice(itemIdx, 1);
          copy[colIdx - 1].items.unshift(it);
          return copy;
        });
      }

      return (
        <div className="board">
          <div className="boardTop">
            <div className="title">Roadmap Board</div>
            <div className="sub">click cards to bump, arrows to move — soft systems, hard control</div>
          </div>

          <div className="cols">
            {cols.map((c, ci) => (
              <div className="col" key={c.name}>
                <div className="colHead">
                  <span className="colName">{c.name}</span>
                  <span className="colCount">{c.items.length}</span>
                </div>

                <div className="stack">
                  {c.items.map((it, ii) => (
                    <div
                      key={it.id}
                      className={`card ${flash === it.id ? "flash" : ""}`}
                      onClick={() => bump(ci, ii)}
                      role="button"
                      tabIndex={0}
                      aria-label={`bump ${it.t}`}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") bump(ci, ii);
                      }}
                    >
                      <div className="cardTitle">{it.t}</div>
                      <div className="actions">
                        <button className="a" onClick={(e) => (e.stopPropagation(), moveLeft(ci, ii))}>
                          ←
                        </button>
                        <button className="a" onClick={(e) => (e.stopPropagation(), moveRight(ci, ii))}>
                          →
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <style jsx>{`
            .board{
              margin-top: 12px;
              border-radius: 22px;
              border: 1px solid rgba(255,255,255,.65);
              background: rgba(255,255,255,.32);
              padding: 14px;
              box-shadow: 0 18px 34px rgba(20,60,110,.10);
              overflow:hidden;
              position:relative;
            }
            .board:before{
              content:"";
              position:absolute; inset:-50%;
              background:
                radial-gradient(circle at 20% 25%, rgba(255,255,255,.65), transparent 55%),
                radial-gradient(circle at 75% 35%, rgba(255,255,255,.55), transparent 60%),
                radial-gradient(circle at 40% 80%, rgba(255,255,255,.45), transparent 55%);
              filter: blur(18px);
              animation: drift 9s ease-in-out infinite;
              opacity:.7;
            }
            @keyframes drift{
              0%,100%{ transform: translate(0,0) scale(1); }
              50%{ transform: translate(18px,-12px) scale(1.03); }
            }

            .boardTop{ position:relative; z-index:1; }
            .title{ font-weight: 950; letter-spacing:-.02em; }
            .sub{ font-size: 12.5px; opacity:.75; margin-top: 2px; }

            .cols{
              position:relative; z-index:1;
              margin-top: 12px;
              display:grid;
              grid-template-columns: repeat(3, 1fr);
              gap: 10px;
            }
            .col{
              border-radius: 18px;
              border: 1px solid rgba(255,255,255,.55);
              background: rgba(255,255,255,.22);
              padding: 10px;
              min-height: 180px;
            }
            .colHead{ display:flex; justify-content:space-between; align-items:center; gap:10px; margin-bottom: 8px; }
            .colName{ font-weight: 950; opacity:.85; }
            .colCount{
              font-size: 12px;
              font-weight: 900;
              padding: 4px 8px;
              border-radius: 999px;
              border: 1px solid rgba(255,255,255,.6);
              background: rgba(255,255,255,.35);
              opacity:.85;
            }
            .stack{ display:grid; gap: 8px; }

            .card{
              border-radius: 16px;
              border: 1px solid rgba(255,255,255,.55);
              background: rgba(255,255,255,.28);
              padding: 10px;
              box-shadow: 0 12px 24px rgba(20,60,110,.10);
              cursor:pointer;
              display:flex; justify-content:space-between; align-items:center; gap:10px;
            }
            .card:hover{ transform: translateY(-1px); transition: transform .12s ease; }
            .cardTitle{ font-weight: 850; opacity:.85; font-size: 13.5px; }
            .actions{ display:flex; gap:6px; }
            .a{
              border-radius: 12px;
              border: 1px solid rgba(255,255,255,.6);
              background: rgba(255,255,255,.32);
              padding: 6px 8px;
              font-weight: 900;
              cursor:pointer;
            }
            .a:hover{ transform: translateY(-1px); transition: transform .12s ease; }

            .flash{
              animation: pop 420ms ease;
              outline: 2px solid rgba(255,255,255,.65);
            }
            @keyframes pop{
              0%{ transform: translateY(0) scale(1); }
              40%{ transform: translateY(-2px) scale(1.02); }
              100%{ transform: translateY(0) scale(1); }
            }

            @media (max-width: 760px){
              .cols{ grid-template-columns: 1fr; }
            }
          `}</style>
        </div>
      );
    }

    function TitleSearchDemo() {
      const [raw, setRaw] = useState("");
      const clean = useMemo(() => normalizeQuery(raw), [raw]);

      return (
        <div className="demo">
          <div className="row">
            <div className="t">Search failsafe (title-only)</div>
            <div className="chip">{clean ? `"${clean}"` : "type a title..."}</div>
          </div>

          <input
            className="inp"
            value={raw}
            onChange={(e) => setRaw(e.target.value)}
            placeholder="try: build log"
            aria-label="title search demo"
          />

          <div className="hint">
            This is the vibe: I search like a human (titles), not like a database (IDs).
          </div>

          <style jsx>{`
            .demo{
              margin-top: 12px;
              border-radius: 20px;
              border: 1px solid rgba(255,255,255,.65);
              background: rgba(255,255,255,.30);
              padding: 14px;
              box-shadow: 0 18px 34px rgba(20,60,110,.10);
            }
            .row{ display:flex; justify-content:space-between; align-items:center; gap:10px; flex-wrap:wrap; }
            .t{ font-weight: 950; letter-spacing:-.02em; }
            .chip{
              font-size: 12px;
              font-weight: 900;
              padding: 6px 10px;
              border-radius: 999px;
              border: 1px solid rgba(255,255,255,.6);
              background: rgba(255,255,255,.35);
              opacity:.85;
            }
            .inp{
              margin-top: 10px;
              width:100%;
              padding: 10px 12px;
              border-radius: 14px;
              border: 1px solid rgba(255,255,255,.7);
              background: rgba(255,255,255,.45);
              outline:none;
              font-weight: 750;
              color: rgba(11,26,42,.9);
            }
            .hint{ margin-top: 10px; font-size: 12.5px; opacity:.75; }
          `}</style>
        </div>
      );
    }

    return (
      <>
        <h3>What I want next</h3>
        <ul>
          <li>Add screenshots for each project page.</li>
          <li>Make the journal deck searchable + sortable.</li>
          <li>Maybe add “weekly change log” bullets per project.</li>
        </ul>

        <RoadmapBoard />
        <TitleSearchDemo />

        <h3>Reminder</h3>
        <p>The best portfolio is the one that updates.</p>
      </>
    );
  },
};
