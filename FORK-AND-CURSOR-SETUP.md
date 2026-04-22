# Fork and Continue Development in Cursor

This guide explains how to fork this repository, open it in Cursor, and continue developing the Simple Bible Reader app.

## 1) Fork the repository on GitHub

1. Open the source repository in GitHub.
2. Click **Fork**.
3. Choose your account/org and create the fork.

If you prefer CLI:

```bash
gh repo fork <owner>/<repo> --clone
```

## 2) Clone your fork locally

If you used the GitHub UI to fork:

```bash
git clone https://github.com/<you>/<your-fork>.git
cd <your-fork>
```

Optional: add upstream remote for syncing:

```bash
git remote add upstream https://github.com/<owner>/<repo>.git
git fetch upstream
```

## 3) Open the project in Cursor

- In Cursor: **File → Open Folder…**
- Select your cloned repository folder.

If you already have another workspace open, open this fork in a new window to avoid path confusion.

## 4) Install dependencies and verify baseline

From the project root:

```bash
npm install
npm test
npm run build:bible
npm run dev
```

Then open the local URL shown by Vite.

## 5) Understand the project quickly

Start with:

- `README.md` (usage + data sources)
- `PROJECT-HANDOFF.md` (current architecture + behavior contracts)
- `CUSTOM-TRANSLATIONS.md` (custom JSON format)

Key code files:

- `src/main.js`
- `src/style.css`
- `src/verse-model.mjs`
- `scripts/build-bible-data.mjs`

## 6) Recommended development workflow

1. Create a branch:

```bash
git checkout -b feat/<short-name>
```

2. Make focused changes.
3. Run checks:

```bash
npm test
npm run build
```

4. If data/build pipeline changed, also run:

```bash
npm run build:bible
```

5. Commit with clear message:

```bash
git add .
git commit -m "Add <feature> and update tests"
```

6. Push branch and open PR:

```bash
git push -u origin HEAD
gh pr create
```

## 7) Continue development with Cursor agent

In chat, include high-signal context:

- Mention `PROJECT-HANDOFF.md`
- Mention exact files you expect changed
- State constraints (offline-only, KJV `{p,s}` compatibility, etc.)
- Require `npm test` before completion

Prompt template:

> Implement [feature/bugfix] in this repo. Respect behavior contracts in `PROJECT-HANDOFF.md`. Touch only required files, update tests where needed, then run `npm test` and `npm run build`.

## 8) Sync your fork with upstream (optional)

```bash
git fetch upstream
git checkout main
git merge upstream/main
git push origin main
```

## 9) Common setup issues

- **Blank app / no translations**: run `npm run build:bible`.
- **Path errors**: ensure you are at the repository root where `package.json` lives.
- **Python server path mismatch**: prefer `npm run dev`, or read README troubleshooting for `/bible-data` vs `/public/bible-data`.

