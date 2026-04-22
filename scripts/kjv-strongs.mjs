/**
 * Parse Bolls KJV HTML: "In the beginning<S>7225</S> God<S>430</S> ..."
 * OT numbers are Hebrew Strong's (H-prefix); NT is Greek (G-prefix).
 */
export function kjvPlainFromBollsHtml(html) {
  if (html == null) return "";
  return String(html)
    .replace(/<sup[\s\S]*?<\/sup>/gi, " ")
    .replace(/<S>\d+<\/S>/g, "")
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&[a-z]+;/gi, " ")
    .replace(/&#?\d+;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * @param {string} html
 * @param {number} bookNum 1..66 (Bolls book id)
 * @returns {{ w: string, n: string | null, ns?: string[] }[]}
 */
export function kjvStrongsSegments(html, bookNum) {
  const nt = bookNum >= 40;
  const fmt = (num) => (nt ? `G${num}` : `H${num}`);
  const clean = String(html || "").replace(/<sup[\s\S]*?<\/sup>/gi, "");
  const parts = clean.split(/<S>(\d+)<\/S>/);
  const out = [];
  let orphan = null;
  for (let i = 0; i < parts.length; i += 2) {
    const w = (parts[i] || "").replace(/\s+/g, " ").trim();
    const num = parts[i + 1];
    if (!w) {
      if (num) orphan = num;
      continue;
    }
    if (orphan && num) {
      out.push({ w, ns: [fmt(String(orphan)), fmt(String(num))] });
      orphan = null;
    } else if (orphan) {
      out.push({ w, n: fmt(String(orphan)) });
      orphan = null;
    } else if (num) {
      out.push({ w, n: fmt(String(num)) });
    } else {
      out.push({ w, n: null });
    }
  }
  return out;
}
