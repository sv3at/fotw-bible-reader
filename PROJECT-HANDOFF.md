# Bible app — handoff snapshot and continuation guide

This file captures **what exists today**, **where things live**, and **how to keep working** in Cursor (or similar) without losing context. It is meant to be copied into a new chat or shared with a teammate.

---

## 1. What this project is

- **Offline-first Bible reader** in the browser: `index.html` + `src/main.js` + `src/style.css`.
- **Data** lives under `public/bible-data/` (generated). The app probes **`/bible-data/`** (Vite) and **`/public/bible-data/`** (Python `http.server` from repo root) plus a URL-relative `public/bible-data/` fallback.
- **Build pipeline** (`npm run build:bible`) downloads upstream JSON/XML, normalizes to a common `{ books, bookOrder, _meta?, _strongs? }` shape, and writes `manifest.json` + `t-*.json` + **`lexicon-slim.json`** (Strong’s glosses).
- **KJV** is special: verses are **`{ p, s }`** (`p` = plain text, `s` = token segments with `H…` / `G…` Strong’s ids from Bolls `<S>n</S>` markup). Other translations use **plain strings** per verse.
- **UI**: Strong’s chips link to STEP Bible; click opens a **dialog** with a short local gloss from `lexicon-slim.json` (Open Scriptures, CC BY-SA).

---

## 2. File map (high signal)

| Path | Role |
|------|------|
| `src/main.js` | Boot, `fetch` manifest + translation JSON, navigation, KJV rendering, lexicon dialog |
| `src/verse-model.mjs` | **Pure** helpers: `versePlain`, `isStrongsVerseCell`, `stepStrongUrl`, `lookupLexEntry`, `cleanVerseText` — shared with tests |
| `scripts/build-bible-data.mjs` | Download + normalize all translations + lexicon |
| `scripts/kjv-strongs.mjs` | Parse Bolls KJV HTML → plain + segments |
| `scripts/strong-lexicon-vm.mjs` | Run Open Scriptures dictionary **`.js`** in `node:vm` → object |
| `scripts/usfm-books.mjs` | `USFM_LIST`, `BNUMBER_TO_USFM`, `USFM_BY_ID` |
| `public/bible-data/` | Generated output — do not hand-edit |
| `tests/*.test.mjs` | Vitest unit + optional integration checks |
| `README.md` | User-facing setup, licenses, troubleshooting |

---

## 3. Commands

```bash
npm install
npm test                 # Vitest (node); safe without built data except skipped describe
npm run build:bible      # Regenerate public/bible-data (network)
npm run dev              # Vite dev server
npm run build && npm run preview   # Production static build
```

---

## 4. Design constraints worth preserving

1. **No runtime Bible API** — everything from local JSON (+ optional external STEP link in new tab / dialog).
2. **KJV verse cells are objects** — any code that assumes `verse` is always a string will break random verse, search, or copy. Use **`versePlain()`** for display / emptiness checks; use **`isStrongsVerseCell()`** before treating `.s` as an array.
3. **Python vs Vite paths** — `resolveDataBase()` must keep trying multiple bases; regressions show up as “Could not load Bible data”.
4. **Duplicate HTTP listeners** on one port can cause **`ERR_EMPTY_RESPONSE`**; document in README, not magic-fixed in code.
5. **Lexicon** — `lookupLexEntry` supports **zero-padded Hebrew** keys (`H0001`) vs short ids (`H1`) from segmentation.

---

## 5. Best prompts to continue (copy/paste templates)

Use these in a **new agent chat** after `@`-mentioning `PROJECT-HANDOFF.md` and `README.md`.

### Bugfix (symptom-first)

> In `bible-app/`, [describe symptom + URL if any]. Relevant files: `PROJECT-HANDOFF.md`, `src/main.js`, `scripts/…`. Run `npm test` and fix until green; keep the fix minimal and add or extend a test in `tests/` if the bug could regress.

### Feature (behavior contract)

> Add [feature] to the offline Bible app. Constraints: stay local JSON, no new runtime third-party Bible APIs, keep KJV `{p,s}` shape compatible. Touch only needed files; extend `tests/` for new logic. Run `npm test` and summarize behavior for KJV vs non-KJV.

### Data / Strong’s pipeline

> Change `scripts/build-bible-data.mjs` / `kjv-strongs.mjs` so that [goal]. After edits, run `npm run build:bible` locally (I will run network) and ensure `tests/manifest-shape.test.mjs` expectations still match. Document license/source changes in `README.md`.

### UI / a11y

> Update `index.html` + `src/style.css` + `src/main.js` for [UI goal]. Preserve existing toolbar flow and data probing. Add a short test only if you extract new pure logic into `src/verse-model.mjs` (or another testable module).

### Refactor (discipline)

> Refactor [area] for clarity without changing behavior. Run `npm test` before and after; no unrelated formatting churn.

---

## 6. Test suite overview (`npm test`)

| File | What it guards |
|------|----------------|
| `tests/kjv-strongs.test.mjs` | Bolls HTML → plain text + OT/NT `H`/`G` segments + orphan pairing |
| `tests/verse-model.test.mjs` | Verse cell shape, STEP URL, lexicon key fallback |
| `tests/strong-lexicon-vm.test.mjs` | VM loader for dictionary scripts (build-time dependency) |
| `tests/usfm-books.test.mjs` | 66-book map sanity (`GEN`/`MAT` indices) |
| `tests/manifest-shape.test.mjs` | Static manifest schema + **optional** checks on `public/bible-data` when present (`describe.skipIf`) |

**CI tip:** Tests pass **without** `public/bible-data`; the generated-bundle describe is skipped until someone runs `npm run build:bible`.

---

## 7. Known follow-ups (optional backlog)

- Parser edge cases: consecutive `<S>` with empty text between (if Bolls ever emits them).
- E2E: Playwright against `vite preview` (heavier; not in repo yet).
- Strong’s on translations other than KJV only if a tagged source is added to the build.

---

## 8. License / attribution reminders

- KJV text: public domain; Strong’s **tags** from Bolls export.
- `lexicon-slim.json`: derived from **Open Scriptures** Strong’s dictionaries (**CC BY-SA**) — keep attribution in UI/README when shipping.

---

*Last aligned with repo layout: handoff doc + Vitest + `verse-model.mjs` + `strong-lexicon-vm.mjs` extraction.*
