import { describe, it, expect } from "vitest";
import {
  cleanVerseText,
  versePlain,
  isStrongsVerseCell,
  stepStrongUrl,
  lookupLexEntry,
} from "../src/verse-model.mjs";

describe("cleanVerseText", () => {
  it("collapses whitespace and newlines", () => {
    expect(cleanVerseText("  a\n\nb  c  ")).toBe("a b c");
  });

  it("coerces nullish to string", () => {
    expect(cleanVerseText(null)).toBe("");
  });
});

describe("versePlain", () => {
  it("returns .p for Strong verse objects", () => {
    expect(versePlain({ p: "Hello world", s: [] })).toBe("Hello world");
  });

  it("stringifies plain string cells", () => {
    expect(versePlain("In the beginning")).toBe("In the beginning");
  });

  it("returns empty string for null", () => {
    expect(versePlain(null)).toBe("");
  });
});

describe("isStrongsVerseCell", () => {
  it("is true only when .s is an array", () => {
    expect(isStrongsVerseCell({ p: "x", s: [] })).toBe(true);
    expect(isStrongsVerseCell({ p: "x", s: {} })).toBe(false);
    expect(isStrongsVerseCell("plain")).toBe(false);
    expect(isStrongsVerseCell(null)).toBe(false);
  });
});

describe("stepStrongUrl", () => {
  it("encodes the Strong id for STEP Bible", () => {
    expect(stepStrongUrl("H430")).toBe("https://www.stepbible.org/?q=strong=H430");
    expect(stepStrongUrl("G2316")).toContain("G2316");
  });
});

describe("lookupLexEntry", () => {
  const lex = {
    H430: { l: "אֱלֹהִים", d: "God" },
    H0001: { l: "padded", d: "one" },
  };

  it("finds exact keys", () => {
    expect(lookupLexEntry(lex, "H430")).toEqual(lex.H430);
  });

  it("falls back to zero-padded Hebrew keys", () => {
    expect(lookupLexEntry(lex, "H1")).toEqual(lex.H0001);
  });

  it("returns null for unknown Greek keys (no padding rule)", () => {
    expect(lookupLexEntry(lex, "G9999")).toBeNull();
  });
});
