export type TrekHighlight = { title: string; subtext: string };

export function readTrekHighlight(value: string): TrekHighlight {
  if (value.startsWith('{"title":')) {
    try {
      const entry = JSON.parse(value);
      if (typeof entry?.title === "string" && typeof entry?.subtext === "string") return entry;
    } catch {
      // Treat older free-form text as a title if it is not a saved entry.
    }
  }
  const prefix = value.match(/^(?:Day|Night)\s+\d+\s*[:–—]\s*/i)?.[0] ?? "";
  const [title, ...subtext] = value.slice(prefix.length).split(/\s+[–—]\s+/);
  return { title: prefix + title, subtext: subtext.join(" — ") };
}

export function saveTrekHighlights(entries: TrekHighlight[]) {
  return entries
    .map(({ title, subtext }) => ({ title: title.trim(), subtext: subtext.trim() }))
    .filter(({ title }) => title)
    .map((entry) => JSON.stringify(entry));
}
