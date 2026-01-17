// entry4.tsx
"use client";

import { useEffect, useMemo, useState } from "react";

export const entry4 = {
  id: "entry-4",
  dateISO: "2026-01-20",
  title: "Soft launch energy",
  mood: "quietly lethal · cute momentum ♾️",
  tags: ["momentum", "shipping", "systems"],
  Card() {
    function InevitabilityGauge() {
      const [tick, setTick] = useState(0);
      useEffect(() => {
        const id = setInterval(() => setTick((t) => t + 1), 40);
        return () => clearInterval(id);
      }, []);

      const pct = useMemo(() => {
        // slow fill with gentle wobble, capped
        const base = Math.min(0.92, 0.55 + tick / 900);
        const wobble = 0.03 * Math.sin(tick / 18);
        return Math.max(0, Math.min(0.96, base + wobble));
      }, [tick]);

      return (
        <div className="g">
          <div className="top">
            <div className="t">Inevitability Gauge</div>
            <div className="r">{Math.round(pct * 100)}%</div>
          </div>

          <div className="ring" aria-label="inevitability ring">
            <svg width="140" height="140" viewBox="0 0 140 140">
              <defs>
                <linearGradient id="lg" x1="0" x2="1">
                  <stop offset="0%" stopColor="rgba(255,255,255,0.95)" />
                  <stop offset="100%" stopColor="rgba(255,255,255,0.30)" />
                </linearGradient>
              </defs>
              <circle cx="70" cy="70" r="52" fill="rgba(255,255,255,0.18)" stroke="rgba(255,255,255,0.45)" />
              <circle
                cx="70"
                cy="70"
                r="52"
                fill="transparent"
                stroke="url(#lg)"
                strokeWidth="10"
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 52}`}
                strokeDashoffset={`${2 * Math.PI * 52 * (1 - pct)}`}
                transform="rotate(-90 70 70)"
              />
              <text x="70" y="78" textAnchor="middle" fontSize="26" fontWeight="900" fill="rgba(11,26,42,0.75)">
                ♾️
              </text>
            </svg>
          </div>

          <div className="sub">quietly lethal. politely unstoppable.</div>

          <style jsx>{`
            .g{
              margin-top: 12px;
              border-radius: 22px;
              border: 1px solid rgba(255,255,255,.65);
              background: rgba(255,255,255,.30);
              padding: 14px;
              box-shadow: 0 18px 34px rgba(20,60,110,.10);
            }
            .top{ display:flex; justify-content:space-between; align-items:center; }
            .t{ font-weight: 950; letter-spacing:-.02em; }
            .r{
              font-weight: 950;
              padding: 6px 10px;
              border-radius: 999px;
              border: 1px solid rgba(255,255,255,.6);
              background: rgba(255,255,255,.35);
              opacity:.85;
              font-size: 12.5px;
            }
            .ring{
              margin-top: 10px;
              display:flex;
              justify-content:center;
              align-items:center;
            }
            .sub{ margin-top: 8px; text-align:center; font-size: 12.5px; opacity:.75; }
          `}</style>
        </div>
      );
    }

    function BubbleField() {
      const bubbles = useMemo(
        () =>
          Array.from({ length: 14 }).map((_, i) => ({
            id: `b-${i}`,
            size: 34 + (i % 7) * 14,
            left: (i * 7) % 100,
            top: (i * 11) % 100,
            dur: 7 + (i % 5) * 2,
            delay: (i % 6) * -1.2,
          })),
        []
      );

      return (
        <div className="bf" aria-hidden="true">
          {bubbles.map((b) => (
            <span
              key={b.id}
              className="b"
              style={{
                width: `${b.size}px`,
                height: `${b.size}px`,
                left: `${b.left}%`,
                top: `${b.top}%`,
                animationDuration: `${b.dur}s`,
                animationDelay: `${b.delay}s`,
              }}
            />
          ))}

          <style jsx>{`
            .bf{
              position:relative;
              height: 160px;
              margin-top: 12px;
              border-radius: 22px;
              border: 1px solid rgba(255,255,255,.65);
              background:
                radial-gradient(900px 240px at 20% 30%, rgba(255,255,255,.55), transparent 60%),
                radial-gradient(700px 240px at 80% 40%, rgba(255,255,255,.45), transparent 60%),
                rgba(255,255,255,.22);
              overflow:hidden;
              box-shadow: 0 18px 34px rgba(20,60,110,.10);
            }
            .b{
              position:absolute;
              border-radius: 999px;
              background: radial-gradient(circle at 30% 30%, rgba(255,255,255,.92), rgba(255,255,255,.28) 55%, rgba(255,255,255,.10));
              box-shadow: 0 18px 44px rgba(0,0,0,.08);
              animation: floaty ease-in-out infinite;
              opacity: .9;
            }
            @keyframes floaty{
              0%,100%{ transform: translate(0,0) scale(1); }
              50%{ transform: translate(16px,-14px) scale(1.03); }
            }
          `}</style>
        </div>
      );
    }

    return (
      <>
        <h3>Soft launch energy</h3>
        <ul>
          <li>I’m not “working on a site” — I’m maintaining a public artifact that keeps updating.</li>
          <li>Easy updates = real updates. That’s the cheat code.</li>
          <li>Calm vibe, aggressive trajectory. That’s my whole thing.</li>
        </ul>

        <InevitabilityGauge />
        <BubbleField />

        <h3>One sentence prophecy</h3>
        <p>If I keep it light, I keep it moving — and if I keep it moving, nobody can catch me.</p>
      </>
    );
  },
};