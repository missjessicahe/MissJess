/* =========================================================
   FILE: villagerJournals.js
   - VillagerJournalsPanel (list + tabs)
========================================================= */

function VillagerJournals({ villager, memoryText }) {
  const [tab, setTab] = React.useState("daily");

  return (
    <div style={{ minHeight: 0 }}>
      <div className="tabRow">
        <button
          className={"tab " + (tab === "daily" ? "active" : "")}
          onClick={() => setTab("daily")}
          type="button"
        >
          📖 Daily Log
        </button>

        <button
          className={"tab " + (tab === "asp" ? "active" : "")}
          onClick={() => setTab("asp")}
          type="button"
        >
          📈 Aspirations
        </button>
      </div>

      {tab === "daily" && (
        <>
          <div className="journalBox">
            <div className="small" style={{ marginBottom: 8 }}>
              Source: <b>{villager?.memory_file || "villager.txt"}</b>
            </div>
            <div className="journalScroll" style={{ maxHeight: 280, overflow: "auto", paddingRight: 4 }}>
              <pre>{memoryText}</pre>
            </div>
          </div>

          <div className="row" style={{ marginTop: 12 }}>
            <button className="btn warm" type="button" onClick={() => alert("Later: write to villager .txt")}>
              Save Daily Log
            </button>
            <button className="btn" type="button" onClick={() => alert("Later: archive/rotate villager log")}>
              Archive
            </button>
          </div>
        </>
      )}

      {tab === "asp" && (
        <>
          <div className="small" style={{ marginBottom: 8 }}>
            Source: <b>{villager?.id || "villager"}.json</b> (history series)
          </div>

          <AspirationsGraph history={villager?.history || []} />

          <div className="row" style={{ marginTop: 12 }}>
            <button className="btn warm" type="button" onClick={() => alert("Later: export graph data")}>
              Export Series
            </button>
            <button className="btn" type="button" onClick={() => alert("Later: refresh from disk")}>
              Refresh
            </button>
          </div>
        </>
      )}
    </div>
  );
}

function VillagerJournalsPanel({
  query, setQuery,
  filteredVillagers,
  selectedId, setSelectedId,
  selected,
  memoryText
}){
  return (
    <div className="panel journal">
      <h2>📚 Villager Journals</h2>
      <p className="kicker">Select a villager → view Daily Log (.txt) + Aspirations (JSON → graph).</p>

      <div className="split2">
        {/* LEFT: list */}
        <div style={{ minHeight: 0 }}>
          <input
            className="search"
            placeholder="search by name / id / role..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />

          <div className="list" style={{ maxHeight: 420 }}>
            {filteredVillagers.map(v => (
              <div
                key={v.id}
                className={"listItem " + (v.id === selectedId ? "active" : "")}
                onClick={() => setSelectedId(v.id)}
              >
                <div className="avatar">
                  <span className="emoji">{roleEmoji(v.role)}</span>
                  <span>{(v.name || "V").slice(0,1).toUpperCase()}</span>
                </div>

                <div className="liMeta">
                  <div className="name">{v.name} <span className="small">({v.role})</span></div>
                  <div className="sub">{v.id} • mental {v.mental_score}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="small" style={{ marginTop: 10 }}>
            (Later) Selecting a villager loads:
            <br />• <b>{selected?.memory_file}</b> (.txt)
            <br />• <b>{selected?.id}.json</b> (graph series)
          </div>
        </div>

        {/* RIGHT: tabs */}
        <VillagerJournals villager={selected} memoryText={memoryText} />
      </div>
    </div>
  );
}

