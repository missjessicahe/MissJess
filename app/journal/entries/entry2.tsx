// entry2.tsx
"use client";

import { useEffect, useMemo, useState } from "react";

export const entry2 = {
  id: "entry-2",
  dateISO: "2026-01-17",
  title: "Little polish day",
  mood: "bubbles + favicon + finishing touches ✨",
  tags: ["ui", "favicon", "polish"],
  Card() {
    function HoneyOrb() {
      const [spin, setSpin] = useState(0);
      useEffect(() => {
        const id = setInterval(() => setSpin((s) => (s + 1) % 360), 30);
        return () => clearInterval(id);
      }, []);

      // SVG “honeysuckle-ish” flower icon (cute abstract)
      return (
        <div className="orbWrap" aria-label="honeysuckle orbit">
          <div className="orb">
            <svg width="54" height="54" viewBox="0 0 54 54" aria-hidden="true">
              <defs>
                <radialGradient id="g1" cx="30%" cy="30%" r="70%">
                  <stop offset="0%" stopColor="rgba(255,255,255,0.95)" />
                  <stop offset="55%" stopColor="rgba(255,255,255,0.55)" />
                  <stop offset="100%" stopColor="rgba(255,255,255,0.18)" />
                </radialGradient>
              </defs>
              <circle cx="27" cy="27" r="24" fill="url(#g1)" stroke="rgba(255,255,255,0.55)" />
              <g transform={`translate(27 27) rotate(${spin})`}>
                {[0, 72, 144, 216, 288].map((a) => (
                  <g key={a} transform={`rotate(${a}) translate(0 -12)`}>
                    <path
                      d="M0 -9 C 6 -9, 7 -1, 0 4 C -7 -1, -6 -9, 0 -9 Z"
                      fill="rgba(255,255,255,0.78)"
                      stroke="rgba(255,255,255,0.55)"
                      strokeWidth="0.8"
                    />
                  </g>
                ))}
                <circle cx="0" cy="0" r="4.2" fill="rgba(11,26,42,0.12)" />
                <circle cx="0" cy="0" r="2.6" fill="rgba(255,255,255,0.9)" />
              </g>
            </svg>

            <div className="satellite" style={{ transform: `rotate(${spin}deg) translateX(36px)` }}>
              <span className="spark" />
            </div>
          </div>
        </div>
      );
    }

    function TogglePolishChecklist() {
      const [items, setItems] = useState([
        { k: "Consistent glass styling", done: true },
        { k: "Honeysuckle favicon swap", done: true },
        { k: "Journal deck mental model", done: true },
        { k: "Micro-copy + spacing pass", done: false },
      ]);

      const score = useMemo(() => {
        const done = items.filter((i) => i.done).length;
        return Math.round((done / items.length) * 100);
      }, [items]);

      return (
        <div className="box">
          <div className="row">
            <div className="t">Polish Checklist</div>
            <div className="badge">{score}% glossy</div>
          </div>

          <div className="list">
            {items.map((it, idx) => (
              <button
                key={it.k}
                className={`it ${it.done ? "done" : ""}`}
                onClick={() =>
                  setItems((prev) => prev.map((p, i) => (i === idx ? { ...p, done: !p.done } : p)))
                }
                aria-label={`toggle ${it.k}`}
              >
                <span className="check">{it.done ? "✓" : "○"}</span>
                <span className="txt">{it.k}</span>
              </button>
            ))}
          </div>

          <style jsx>{`
            .box{
              margin-top: 12px;
              border-radius: 20px;
              border: 1px solid rgba(255,255,255,.65);
              background: rgba(255,255,255,.30);
              padding: 14px;
              box-shadow: 0 18px 34px rgba(20,60,110,.10);
            }
            .row{ display:flex; justify-content:space-between; align-items:center; gap:10px; }
            .t{ font-weight: 950; letter-spacing:-.02em; }
            .badge{
              font-size: 12px;
              font-weight: 900;
              padding: 6px 10px;
              border-radius: 999px;
              border: 1px solid rgba(255,255,255,.6);
              background: rgba(255,255,255,.38);
              opacity:.9;
            }
            .list{ margin-top: 10px; display:grid; gap: 8px; }
            .it{
              display:flex; align-items:center; gap:10px;
              padding: 10px 10px;
              border-radius: 16px;
              border: 1px solid rgba(255,255,255,.55);
              background: rgba(255,255,255,.22);
              cursor:pointer;
              text-align:left;
            }
            .it:hover{ transform: translateY(-1px); transition: transform .12s ease; }
            .check{
              width: 26px; height: 26px; border-radius: 999px;
              display:flex; align-items:center; justify-content:center;
              border: 1px solid rgba(255,255,255,.6);
              background: rgba(255,255,255,.35);
              font-weight: 900;
              opacity:.9;
            }
            .txt{ font-weight: 800; opacity:.85; }
            .done .txt{ text-decoration: line-through; opacity:.65; }
          `}</style>
        </div>
      );
    }

    return (
      <>
        <h3>Polish</h3>
        <ul>
          <li>Added project pages + consistent “glass” vibe.</li>
          <li>Swapped favicon to honeysuckle.</li>
          <li>Started thinking about journal as a deck instead of a scroll dump.</li>
        </ul>

        <HoneyOrb />
        <TogglePolishChecklist />

        <h3>Rule</h3>
        <p>One small improvement at a time. If it stays cute, I’ll keep shipping.</p>
      </>
    );
  },
};
