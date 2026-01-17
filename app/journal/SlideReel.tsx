// app/journal/SlideReel.tsx
import type { JournalEntry } from "./entries/entry-types";
import Slide from "./Slide";

export default function SlideReel({
  slides,
  index,
  setIndex,
  embedded = false,
}: {
  slides: JournalEntry[];
  index: number;
  setIndex: (i: number) => void;
  embedded?: boolean;
}) {
  if (!slides.length) return null;

  const safeIndex = Math.min(Math.max(index, 0), slides.length - 1);
  const current = slides[safeIndex];

  return (
    <>
      <Slide entry={current} embedded={embedded} maxTags={embedded ? 3 : 4} />

      {!embedded ? (
        <div className="jdDots" aria-label="Entry dots">
          {slides.map((e, i) => (
            <button
              key={`${e.id}-${e.dateISO}-${i}`}
              className={`jdDot ${i === safeIndex ? "active" : ""}`}
              onClick={() => setIndex(i)}
              aria-label={`Go to ${e.title}`}
            />
          ))}
        </div>
      ) : null}
    </>
  );
}
