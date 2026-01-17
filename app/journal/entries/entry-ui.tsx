// app/journal/entry-ui.tsx
import type { ReactNode } from "react";

export function Strong({ children }: { children: ReactNode }) {
  return <strong className="jdStrong">{children}</strong>;
}

export function Mono({ children }: { children: ReactNode }) {
  return <code className="jdMono">{children}</code>;
}

export function Para({ children }: { children: ReactNode }) {
  return <p className="jdP">{children}</p>;
}

export function Section({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="jdSection">
      <h3 className="jdH3">{title}</h3>
      <div className="jdSectionBody">{children}</div>
    </section>
  );
}

export function List({
  items,
  tight = false,
}: {
  items: ReactNode[];
  tight?: boolean;
}) {
  return (
    <ul className={`jdList ${tight ? "jdListTight" : ""}`}>
      {items.map((it, i) => (
        <li key={i} className="jdLi">
          {it}
        </li>
      ))}
    </ul>
  );
}

export function Callout({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="jdCallout" role="note" aria-label={title}>
      <div className="jdCalloutTitle">{title}</div>
      <div className="jdCalloutSmall">{children}</div>
    </div>
  );
}
