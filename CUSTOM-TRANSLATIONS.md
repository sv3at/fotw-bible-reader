# Adding Custom Bible Versions (JSON)

Use this guide to add your own translation files to the app without changing code.

## 1) Add your JSON file

Place your translation JSON in:

- `public/bible-data/t-yourid.json`

Example:

- `public/bible-data/t-myversion.json`

## 2) Required JSON shape

Your file should look like this:

```json
{
  "bookOrder": ["GEN", "EXO", "LEV"],
  "books": {
    "GEN": {
      "n": "Genesis",
      "ch": [
        null,
        ["In the beginning...", "..."],
        ["Thus the heavens...", "..."]
      ]
    }
  },
  "_meta": {
    "name": "My Version",
    "language": "English",
    "license": "Your license",
    "source": "Your source"
  }
}
```

Notes:

- `bookOrder`: list of USFM book ids in display order.
- `books[USFM].n`: display name for the book.
- `books[USFM].ch`: chapter array where index `1` is chapter 1 (`ch[0]` should be `null`).
- each chapter is an array of verse strings where index `0` is verse 1.
- `_meta` is optional but recommended (used in the footer).

## 3) Register it in the manifest

Add a translation row to:

- `public/bible-data/manifest.json`

Example entry:

```json
{
  "id": "myversion",
  "name": "My Version",
  "language": "English",
  "license": "Your license",
  "dataFile": "t-myversion.json",
  "source": "Your source"
}
```

Then reload the app; it appears in the translation selector.

## 4) USFM book IDs

Use standard USFM ids, for example:

- `GEN`, `EXO`, `LEV`, ... `PSA`, ... `MAT`, `MRK`, `LUK`, `JHN`, ... `REV`

You can include all 66 books or a subset (for example NT-only).

## 5) Optional: Strong's-enabled verse objects

A verse can be either:

- plain string (normal translation), or
- object form for Strong's data:

```json
{
  "p": "In the beginning God created the heaven and the earth.",
  "s": [
    { "w": "In the beginning", "n": "H7225" },
    { "w": "God", "n": "H430" },
    { "w": "the heaven", "ns": ["H853", "H8064"] }
  ]
}
```

Where:

- `p` = plain text
- `s` = token segments with Strong's ids (`n` for one id, `ns` for multiple)

## 6) Common mistakes

- invalid JSON (trailing commas/comments)
- wrong `dataFile` in `manifest.json`
- missing `bookOrder`
- wrong book ids (non-USFM)
- chapter arrays not 1-indexed (`ch[1]` must be chapter 1)
- chapter text stored as one big string instead of verse arrays

