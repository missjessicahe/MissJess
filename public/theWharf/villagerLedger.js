/* =========================================================
   FILE: villagerLedger.js
   - VillagerLedger component
========================================================= */

function VillagerLedger({ selected }) {
  return (
    <div className="panel">
      <h2>📜 Villager Ledger</h2>
      <p className="kicker">The villager as a JSON object (schema-friendly).</p>
      <pre>{JSON.stringify(selected, null, 2)}</pre>
    </div>
  );
}

