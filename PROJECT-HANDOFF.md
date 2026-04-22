# Bible app — handoff snapshot and continuation guide

This file captures what exists now, where key logic lives, and how to continue safely.

---

## 1. Current product state

- Offline-first Bible reader with local data under `public/bible-data/`.
- KJV includes per-word Strong's (`{ p, s }` verse cells); other translations are plain string verses.
- Strong's chips open local gloss dialog and support external STEP links.
- Parallel reading mode supports two translations on one page.
- Psalm chapter mapping in parallel mode handles Synodal vs MT/English numbering differences.
- Verse selection mirrors across both columns; word selection is intentionally single-side only.

---

## 2. Key files

| Path | Role |
|------|------|
| `index.html` | App shell, toolbar controls, parallel/compare UI containers |
| `src/main.js` | App state, data loading, rendering, parallel mode, selections, Psalm mapping |
| `src/style.css` | Responsive layout, parallel mode styling, highlights |
| `src/verse-model.mjs` | Pure helpers for verse/Strong's behavior used by app and tests |
| `scripts/build-bible-data.mjs` | Build pipeline for translations + lexicon |
| `scripts/kjv-strongs.mjs` | Parse Bolls `<S>…</S>` Strong's markup |
| `scripts/strong-lexicon-vm.mjs` | VM loader for Open Scriptures dictionary scripts |
| `public/bible-data/` | Generated runtime bundle (`manifest.json`, `t-*.json`, `lexicon-slim.json`) |
| `tests/*.test.mjs` | Vitest suite |
| `README.md` | User-facing docs |
| `CUSTOM-TRANSLATIONS.md` | How to add custom translation JSON files |
| `FORK-AND-CURSOR-SETUP.md` | How to fork/import into Cursor and continue development |

---

## 3. Commands

```bash
npm install
npm test
npm run build:bible
npm run dev
npm run build && npm run preview
```

---

## 4. Important behavior contracts

1. No runtime Bible API calls; content is local JSON.
2. KJV verse cells may be object-form (`{ p, s }`), so do not assume verse is always a string.
3. `resolveDataBase()` fallback sequence must keep supporting Vite and Python server paths.
4. Parallel mode:
   - disabled: single full-width column, compare selector disabled
   - enabled: side-by-side columns (with horizontal overflow on narrow screens)
5. Selection model:
   - verse highlight can mirror across both columns
   - word highlight is local to the clicked side only
   - word clicks must not trigger verse auto-scroll jump
6. Psalm mapping:
   - only applied in parallel mode for `PSA`
   - Synodal side is remapped against MT/English chapter numbers

---

## 5. Test coverage

| File | What it guards |
|------|----------------|
| `tests/kjv-strongs.test.mjs` | Strong's parsing and OT/NT id formatting |
| `tests/verse-model.test.mjs` | Core helper behavior |
| `tests/strong-lexicon-vm.test.mjs` | Dictionary VM loader |
| `tests/usfm-books.test.mjs` | Canon mapping sanity |
| `tests/manifest-shape.test.mjs` | Manifest schema + optional generated bundle checks |

CI note: tests pass without generated data; bundle-dependent checks are skipped if `public/bible-data` is absent.

---

## 6. Suggested prompts for next chats

- **Bugfix prompt**
  - "Fix [symptom] in `src/main.js` and `src/style.css`; keep behavior contracts from `PROJECT-HANDOFF.md`; run `npm test`."
- **Feature prompt**
  - "Add [feature] without breaking KJV `{p,s}` and offline-only data model; update tests."
- **Data prompt**
  - "Update `scripts/build-bible-data.mjs` for [source change], run `npm run build:bible`, and update docs."
- **UI prompt**
  - "Adjust toolbar/passage layout in `index.html` + `src/style.css` and keep parallel mode behavior."

---

## 7. Known backlog

- Add E2E tests (Playwright) for parallel mode + Psalm mapping + selection behavior.
- Consider optional "clear highlights" control.
- Consider schema validation script for custom translation JSON before manifest registration.

---

## 8. Attribution reminders

- KJV text is public domain; Strong's tagging from Bolls export.
- `lexicon-slim.json` derives from Open Scriptures Strong's dictionaries (CC BY-SA).

---

Last aligned with: parallel mode, Synodal Psalm mapping, side-scoped word selection, mobile parallel layout, toolbar reorder, and README screenshot/docs updates.
