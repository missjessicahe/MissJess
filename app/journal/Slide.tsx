// app/journal/Slide.tsx
import type { JournalEntry } from "./entries/entry-types";

function prettyDate(dateISO: string) {
  const d = new Date(dateISO + "T00:00:00");
  return d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
}

export default function Slide({
  entry,
  embedded = false,
  maxTags = 4,
}: {
  entry: JournalEntry;
  embedded?: boolean;
  maxTags?: number;
}) {
  const CardComp = entry.Card;

  return (
    <article className="jdCard" aria-label="Journal entry card">
      <div className="jdCardHead">
        <div>
          <div className="jdCardTitle">{entry.title}</div>
          <div className="jdCardSub">{prettyDate(entry.dateISO)}</div>
        </div>

        {entry.tags?.length ? (
          <div className="jdTags" aria-label="Tags">
            {entry.tags.slice(0, maxTags).map((t) => (
              <span className="jdTag" key={`${entry.id}-${t}`}>
                #{t}
              </span>
            ))}
          </div>
        ) : null}
      </div>

      <div className="jdCardBody" aria-label="Entry content (scrollable)">
        <div className="jdScrollHintTop" />
        <CardComp />
        <div className="jdScrollHintBottom" />
      </div>
    </article>
  );
}
