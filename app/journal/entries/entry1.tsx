// entry1.tsx
"use client";

import { useEffect, useMemo, useRef, useState } from "react";

export const entry1 = {
  id: "entry-1",
  dateISO: "2026-01-16",
  title: "Build Log",
  mood: "light-blue focus · gentle momentum 🫧",
  tags: ["deploy", "dns", "vercel", "portfolio"],
  Card() {
    function clamp(n: number, a: number, b: number) {
      return Math.max(a, Math.min(b, n));
    }

    function TerminalTyping() {
      const script = useMemo(
        () => [
          { prompt: "jess@missjess", cmd: "git status", out: "clean — ready to ship ✨" },
          { prompt: "jess@missjess", cmd: "git add .", out: "staged everything cute" },
          { prompt: "jess@missjess", cmd: "git commit -m \"ship bubbles\"", out: "1 file changed, vibes improved" },
          { prompt: "jess@missjess", cmd: "vercel --prod", out: "deployed. domain aura: +999" },
          { prompt: "jess@missjess", cmd: "open https://missjess.co", out: "it’s giving… glossy glass" },
        ],
        []
      );

      const [line, setLine] = useState(0);
      const [typed, setTyped] = useState("");
      const [phase, setPhase] = useState<"typing" | "output">("typing");

      useEffect(() => {
        let t: any;
        const cur = script[line];
        if (!cur) return;

        if (phase === "typing") {
          if (typed.length < cur.cmd.length) {
            t = setTimeout(() => setTyped(cur.cmd.slice(0, typed.length + 1)), 18);
          } else {
            t = setTimeout(() => setPhase("output"), 220);
          }
        } else {
          t = setTimeout(() => {
            setPhase("typing");
            setTyped("");
            setLine((l) => (l + 1) % script.length);
          }, 820);
        }
        return () => clearTimeout(t);
      }, [typed, phase, line, script]);

      const cur = script[line];

      return (
        <div className="term">
          <div className="termTop">
            <span className="dot r" />
            <span className="dot y" />
            <span className="dot g" />
            <span className="termTitle">ship log</span>
          </div>

          <div className="termBody">
            <div className="ln">
              <span className="p">{cur.prompt}</span>
              <span className="s">$</span>
              <span className="c">{typed}</span>
              <span className="cursor" aria-hidden="true" />
            </div>

            <div className="out" style={{ opacity: phase === "output" ? 1 : 0 }}>
              {cur.out}
            </div>
          </div>

          <style jsx>{`
            .term{
              margin-top: 12px;
              border-radius: 18px;
              border: 1px solid rgba(255,255,255,.65);
              background: linear-gradient(180deg, rgba(255,255,255,.55), rgba(255,255,255,.30));
              box-shadow: 0 16px 30px rgba(20,60,110,.12);
              overflow:hidden;
            }
            .termTop{
              display:flex; align-items:center; gap:8px;
              padding:10px 12px;
              border-bottom: 1px solid rgba(255,255,255,.55);
              background: rgba(255,255,255,.35);
            }
            .dot{ width:10px; height:10px; border-radius:999px; }
            .r{ background: rgba(255,70,70,.85); }
            .y{ background: rgba(255,200,70,.9); }
            .g{ background: rgba(90,220,140,.9); }
            .termTitle{ margin-left: 6px; font-weight: 900; font-size: 12px; opacity:.8; letter-spacing:.02em; }

            .termBody{ padding: 12px; font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace; }
            .ln{ display:flex; gap:8px; align-items:center; font-size: 13px; }
            .p{ font-weight: 900; opacity:.85; }
            .s{ opacity:.75; }
            .c{ font-weight: 700; }
            .cursor{
              width: 9px; height: 16px; border-radius: 3px;
              background: rgba(11,26,42,.75);
              margin-left: 2px;
              animation: blink 1s steps(2,end) infinite;
            }
            .out{
              margin-top: 10px;
              font-size: 13px;
              opacity: .85;
              padding: 10px 10px;
              border-radius: 14px;
              border: 1px solid rgba(255,255,255,.55);
              background: rgba(255,255,255,.35);
              transition: opacity .25s ease;
            }
            @keyframes blink { 0%,49%{opacity:1} 50%,100%{opacity:0} }
          `}</style>
        </div>
      );
    }

    function ShipMeter() {
      const [t, setT] = useState(0);
      useEffect(() => {
        const id = setInterval(() => setT((x) => x + 1), 50);
        return () => clearInterval(id);
      }, []);

      const progress = useMemo(() => {
        // cute looping “momentum” curve (0.72..0.98)
        const base = 0.72;
        const wave = 0.26 * (0.5 + 0.5 * Math.sin(t / 18));
        return clamp(base + wave, 0, 1);
      }, [t]);

      const steps = [
        { k: "Domain plan", v: 1.0 },
        { k: "No DB philosophy", v: 0.92 },
        { k: "Glass UI system", v: 0.98 },
        { k: "Deploy loop", v: 0.88 },
      ];

      return (
        <div className="meter">
          <div className="meterHead">
            <div className="meterTitle">Ship Meter</div>
            <div className="meterSub">cute beats complicated (but I still flex)</div>
          </div>

          <div className="barWrap" aria-label="overall progress">
            <div className="barGlow" style={{ width: `${Math.round(progress * 100)}%` }} />
            <div className="barFill" style={{ width: `${Math.round(progress * 100)}%` }} />
            <div className="barText">{Math.round(progress * 100)}% inevitable</div>
          </div>

          <div className="grid">
            {steps.map((s) => (
              <div className="pill" key={s.k}>
                <div className="k">{s.k}</div>
                <div className="mini">
                  <div className="miniFill" style={{ width: `${Math.round(s.v * 100)}%` }} />
                </div>
              </div>
            ))}
          </div>

          <style jsx>{`
            .meter{
              margin-top: 14px;
              border-radius: 20px;
              padding: 14px;
              border: 1px solid rgba(255,255,255,.65);
              background: rgba(255,255,255,.35);
              box-shadow: 0 18px 34px rgba(20,60,110,.10);
              position: relative;
              overflow:hidden;
            }
            .meter:before{
              content:"";
              position:absolute; inset:-40%;
              background:
                radial-gradient(circle at 20% 20%, rgba(255,255,255,.65), transparent 55%),
                radial-gradient(circle at 70% 30%, rgba(255,255,255,.55), transparent 60%),
                radial-gradient(circle at 40% 80%, rgba(255,255,255,.45), transparent 55%);
              filter: blur(14px);
              animation: drift 8s ease-in-out infinite;
              opacity:.75;
            }
            @keyframes drift{
              0%,100%{ transform: translate(0,0) scale(1); }
              50%{ transform: translate(22px,-14px) scale(1.03); }
            }
            .meterHead{ position:relative; z-index:1; }
            .meterTitle{ font-weight: 950; letter-spacing:-.02em; }
            .meterSub{ font-size: 12.5px; opacity:.75; margin-top: 2px; }

            .barWrap{
              position:relative;
              z-index:1;
              margin-top: 10px;
              height: 34px;
              border-radius: 999px;
              border: 1px solid rgba(255,255,255,.65);
              background: rgba(255,255,255,.35);
              overflow:hidden;
            }
            .barGlow{
              position:absolute; inset:0 auto 0 0;
              background: linear-gradient(90deg, rgba(255,255,255,.0), rgba(255,255,255,.85), rgba(255,255,255,.0));
              filter: blur(8px);
              transform: translateX(-40%);
              animation: shine 1.2s ease-in-out infinite;
              opacity:.7;
            }
            @keyframes shine{
              0%{ transform: translateX(-60%); }
              100%{ transform: translateX(120%); }
            }
            .barFill{
              position:absolute; inset:0 auto 0 0;
              background: linear-gradient(90deg, rgba(255,255,255,.80), rgba(255,255,255,.35));
              border-right: 1px solid rgba(255,255,255,.7);
            }
            .barText{
              position:absolute; inset:0;
              display:flex; align-items:center; justify-content:center;
              font-weight: 900;
              font-size: 12.5px;
              opacity:.85;
              text-shadow: 0 8px 18px rgba(20,60,110,.12);
              pointer-events:none;
            }

            .grid{
              position:relative; z-index:1;
              margin-top: 12px;
              display:grid;
              grid-template-columns: 1fr 1fr;
              gap: 10px;
            }
            .pill{
              border-radius: 16px;
              border: 1px solid rgba(255,255,255,.6);
              background: rgba(255,255,255,.30);
              padding: 10px 10px;
            }
            .k{ font-weight: 900; font-size: 12.5px; opacity:.85; }
            .mini{
              margin-top: 8px;
              height: 10px;
              border-radius: 999px;
              border: 1px solid rgba(255,255,255,.55);
              background: rgba(255,255,255,.25);
              overflow:hidden;
            }
            .miniFill{
              height:100%;
              background: rgba(255,255,255,.85);
              box-shadow: 0 12px 20px rgba(20,60,110,.10);
            }

            @media (max-width: 520px){
              .grid{ grid-template-columns: 1fr; }
            }
          `}</style>
        </div>
      );
    }

    return (
      <>
        <h3>Build Log</h3>
        <ul>
          <li>
            Connected domain plan: <b>missjess.co</b> + clean path pages (/whimsical, /kubesync, /kubecard).
          </li>
          <li>Decided: no database — GitHub commits are my “publish” button.</li>
          <li>Made the site feel like iOS bubbles: glass cards, soft gradients, floating dots.</li>
        </ul>

        <ShipMeter />
        <TerminalTyping />

        <h3>Note to future me</h3>
        <p>
          Keep it simple. Cute beats complicated. If it’s easy to update, it will stay alive.
        </p>
      </>
    );
  },
};