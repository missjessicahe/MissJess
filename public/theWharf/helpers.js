/* =========================================================
   FILE: helpers.js
   - shared helpers + UI primitives
========================================================= */

const { useMemo, useState } = React;

function roleEmoji(role){
  const r = (role || "").toLowerCase();
  if (r.includes("merchant")) return "🧺";
  if (r.includes("healer")) return "🌿";
  if (r.includes("guard")) return "🛡️";
  if (r.includes("foreman")) return "⚙️";
  if (r.includes("dream")) return "✨";
  if (r.includes("mayor")) return "🗳️";
  return "🐣";
}

function tierFromSmog(smog){
  if (smog <= 0) return 0;
  if (smog < 15) return 1;
  if (smog < 35) return 2;
  if (smog < 60) return 3;
  return 4;
}

function tierLabel(tier){
  switch(tier){
    case 0: return "Calm / Stable";
    case 1: return "Mechanical Degradation";
    case 2: return "Environmental Warning";
    case 3: return "Social + Biological Disasters";
    case 4: return "Total Collapse";
    default: return "Unknown";
  }
}

function tierMessage(tier){
  switch(tier){
    case 0: return "🫧 The village feels steady. Dreams are holding.";
    case 1: return "🪵 Little cracks: tools wear faster, tiny stress ripples.";
    case 2: return "⚠️ The air feels tense. Weather + productivity wobble.";
    case 3: return "🫀 Outbreak risk. Trade penalties + fear loops rising.";
    case 4: return "🌒 Trust collapse. Systems seize. Factions forming.";
    default: return "";
  }
}

function statusDotClass(serverRunning){
  return serverRunning ? "ok" : "warn";
}

function PercentBar({ title, value, onChange, variant = "cool", hint }) {
  const pct = Math.max(0, Math.min(100, value));

  return (
    <div className="barCard" style={{ marginTop: 12 }}>
      <div>
        <div className="barTitle">{title}</div>

        <div className="barTrack">
          <div
            className={"barFill " + (variant === "warm" ? "warm" : "")}
            style={{ width: `${pct}%` }}
          />
          <input
            className="barOverlayInput"
            type="range"
            min="0"
            max="100"
            value={pct}
            onChange={(e) => onChange(parseInt(e.target.value, 10))}
          />
        </div>

        {hint && <div className="barHint">{hint}</div>}
      </div>

      <div className="barValue">{pct}</div>
    </div>
  );
}

function memoryTextForVillager(selected){
  if (!selected) return "";
  if (selected.id === "villager_023") {
    return `[Day 214]\nSpoke with Jess.\nFelt uneasy about trade imbalance.\n\n[Day 215]\nSold baskets faster than usual.\nNoticed Mira watching the market.`;
  }
  if (selected.id === "villager_008") {
    return `[Day 214]\nChecked Wren’s stress markers.\nSuggested rest + soup.\n\n[Day 216]\nWeather warning felt early.\nStocked herbs in case.`;
  }
  if (selected.id === "villager_014") {
    return `[Day 213]\nPatrol route widened.\nHeard rumors around the factory.\n\n[Day 216]\nRaid pressure felt… unnatural.\nKept watch.`;
  }
  if (selected.id === "villager_019") {
    return `[Day 212]\nDreamed of a festival.\nFelt hopeful.\n\n[Day 216]\nSMOG rising made the dream flicker.\nStill trying.`;
  }
  return `[Day 210]\nNoted supply delays.\nCogs jammed twice.\n\n[Day 216]\nTold council: stabilize morale or production breaks.`;
}

function safeMinecraftOpen(){
  try {
    window.location.href = "minecraft://";
    setTimeout(() => {
      alert(
        "If Minecraft didn’t open: your browser may block minecraft:// links.\n" +
        "Later, your Java server can trigger launch locally."
      );
    }, 650);
  } catch (e) {
    alert("Minecraft launch link was blocked. You can wire this to your Java server later.");
  }
}

/* Default mock villagers */
window.__DEFAULT_VILLAGERS__ = [
  {
    id:"villager_023", name:"Wren", role:"Merchant", mental_score:62,
    relationships:["jealous_of:villager_008"], memory_file:"villager_023.txt",
    history: [
      { day: 210, villagerXP: 68 }, { day: 211, villagerXP: 66 },
      { day: 212, villagerXP: 64 }, { day: 213, villagerXP: 63 },
      { day: 214, villagerXP: 62 }, { day: 215, villagerXP: 67 },
      { day: 216, villagerXP: 65 },
    ]
  },
  {
    id:"villager_008", name:"Mira", role:"Healer", mental_score:78,
    relationships:["friend_of:villager_023"], memory_file:"villager_008.txt",
    history: [
      { day: 210, villagerXP: 74 }, { day: 211, villagerXP: 75 },
      { day: 212, villagerXP: 76 }, { day: 213, villagerXP: 77 },
      { day: 214, villagerXP: 78 }, { day: 215, villagerXP: 80 },
      { day: 216, villagerXP: 79 },
    ]
  },
  {
    id:"villager_014", name:"Rowan", role:"Guard", mental_score:54,
    relationships:["rival_of:villager_019"], memory_file:"villager_014.txt",
    history: [
      { day: 210, villagerXP: 60 }, { day: 211, villagerXP: 58 },
      { day: 212, villagerXP: 55 }, { day: 213, villagerXP: 56 },
      { day: 214, villagerXP: 54 }, { day: 215, villagerXP: 52 },
      { day: 216, villagerXP: 53 },
    ]
  },
  {
    id:"villager_019", name:"Jun", role:"Dreamer", mental_score:88,
    relationships:["crush_on:villager_023"], memory_file:"villager_019.txt",
    history: [
      { day: 210, villagerXP: 82 }, { day: 211, villagerXP: 85 },
      { day: 212, villagerXP: 86 }, { day: 213, villagerXP: 87 },
      { day: 214, villagerXP: 88 }, { day: 215, villagerXP: 89 },
      { day: 216, villagerXP: 86 },
    ]
  },
  {
    id:"villager_002", name:"Sage", role:"Foreman", mental_score:46,
    relationships:["suspects_infidelity:villager_014"], memory_file:"villager_002.txt",
    history: [
      { day: 210, villagerXP: 52 }, { day: 211, villagerXP: 50 },
      { day: 212, villagerXP: 48 }, { day: 213, villagerXP: 47 },
      { day: 214, villagerXP: 46 }, { day: 215, villagerXP: 45 },
      { day: 216, villagerXP: 44 },
    ]
  },
];

