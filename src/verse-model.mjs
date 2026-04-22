/**
 * Pure helpers shared by `main.js` and unit tests (verse shape, Strong’s URLs, lexicon keys).
 */

export function cleanVerseText(t) {
  return String(t ?? "")
    .replace(/\n+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/** Plain display string for a verse cell (string or KJV `{ p, s }`). */
export function versePlain(cell) {
  if (cell != null && typeof cell === "object" && typeof cell.p === "string") return cell.p;
  return cell != null ? String(cell) : "";
}

export function isStrongsVerseCell(cell) {
  return cell != null && typeof cell === "object" && Array.isArray(cell.s);
}

export function stepStrongUrl(strongId) {
  return `https://www.stepbible.org/?q=strong=${encodeURIComponent(strongId)}`;
}

/**
 * @param {Record<string, unknown> | null | undefined} lex
 * @param {string} strongId e.g. H430, G2316
 */
export function lookupLexEntry(lex, strongId) {
  if (!lex || !strongId) return null;
  if (lex[strongId]) return lex[strongId];
  const hm = /^H(\d+)$/.exec(strongId);
  if (hm) {
    const n = hm[1];
    for (const pad of [4, 5]) {
      const alt = `H${n.padStart(pad, "0")}`;
      if (lex[alt]) return lex[alt];
    }
  }
  return null;
}
