// app/journal/entry-types.ts
import type { ReactNode } from "react";

export type JournalEntry = {
  id: string;
  title: string;
  dateISO: string;
  mood: string;
  tags?: string[];
  Card: () => ReactNode;
};

export function defineEntry<const T extends JournalEntry>(t: T) {
  return t;
}
