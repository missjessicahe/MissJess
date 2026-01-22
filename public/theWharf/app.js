/* =========================================================
   FILE: app.js
   - Mounts the app
   - Composes sections:
     VillageHearth, NetworkPanel, WorldMood, WarningsPanel,
     VillagerJournalsPanel, VillagerLedger
========================================================= */

const { useEffect, useMemo, useState } = React;

// Import "modules" (these are separate <script> tags in index.html):
// - helpers.js
// - graphs.js
// - villageHearth.js
// - network.js
// - worldMood.js
// - warnings.js
// - villagerJournals.js
// - villagerLedger.js

function App() {
  // Server UI state (mock)
  const [serverRunning, setServerRunning] = useState(false);

  // Live test controls (lets you simulate tiers)
  const [dreams, setDreams] = useState(42);
  const [jealousy, setJealousy] = useState(61);

  const smog = Math.max(0, jealousy - dreams);
  const tier = tierFromSmog(smog);

  // Network config (form)
  const [network, setNetwork] = useState({
    port: "25565",
    routerStatus: "configured",
    localIp: "192.168.1.24",
    publicIp: ""
  });

  // Villager data (mock; replace with fetch later)
  const [query, setQuery] = useState("");
  const [villagers, setVillagers] = useState(window.__DEFAULT_VILLAGERS__ || []);

  const filteredVillagers = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return villagers;
    return villagers.filter(v =>
      v.id.toLowerCase().includes(q) ||
      (v.name || "").toLowerCase().includes(q) ||
      (v.role || "").toLowerCase().includes(q)
    );
  }, [query, villagers]);

  const [selectedId, setSelectedId] = useState(villagers[0]?.id || "villager_023");
  const selected = useMemo(
    () => villagers.find(v => v.id === selectedId) || villagers[0],
    [selectedId, villagers]
  );

  const memoryText = useMemo(() => memoryTextForVillager(selected), [selected]);

  // Apply tier class to body for mood glow
  useEffect(() => {
    document.body.classList.remove("tier-0","tier-1","tier-2","tier-3","tier-4");
    document.body.classList.add(`tier-${tier}`);
  }, [tier]);

  function onStart(){ setServerRunning(true); }
  function onStop(){ setServerRunning(false); }
  function onRestart(){
    setServerRunning(false);
    setTimeout(() => setServerRunning(true), 500);
  }
  function onReloadChunks(){
    alert("Chunk reload requested (UI demo). Later: POST /chunks/reload");
  }

  return (
    <>
      <div className="mood" />
      <div className="layout">

        {/* LEFT */}
        <div className="col">
          <VillageHearth
            serverRunning={serverRunning}
            onStart={onStart}
            onStop={onStop}
            onRestart={onRestart}
            onReloadChunks={onReloadChunks}
          />

          <NetworkPanel
            network={network}
            setNetwork={setNetwork}
          />
        </div>

        {/* MIDDLE */}
        <div className="col">
          <WorldMood
            dreams={dreams}
            setDreams={setDreams}
            jealousy={jealousy}
            setJealousy={setJealousy}
            smog={smog}
            tier={tier}
          />

          <WarningsPanel
            tier={tier}
            // later: can pass day, tick, etc
          />
        </div>

        {/* RIGHT */}
        <div className="col">
          <VillagerJournalsPanel
            query={query}
            setQuery={setQuery}
            villagers={villagers}
            filteredVillagers={filteredVillagers}
            selectedId={selectedId}
            setSelectedId={setSelectedId}
            selected={selected}
            memoryText={memoryText}
          />

          <VillagerLedger selected={selected} />
        </div>

      </div>
    </>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);

