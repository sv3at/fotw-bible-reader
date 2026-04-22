import { describe, it, expect } from "vitest";
import { kjvPlainFromBollsHtml, kjvStrongsSegments } from "../scripts/kjv-strongs.mjs";

describe("kjvPlainFromBollsHtml", () => {
  it("strips Strong markers and normalizes whitespace", () => {
    const html = "In the beginning<S>7225</S> God<S>430</S> created";
    expect(kjvPlainFromBollsHtml(html)).toBe("In the beginning God created");
  });

  it("removes superscripts and other tags", () => {
    const html = "Foo<sup>1</sup>bar<S>1</S> baz";
    expect(kjvPlainFromBollsHtml(html)).toBe("Foo bar baz");
  });

  it("handles null and empty", () => {
    expect(kjvPlainFromBollsHtml(null)).toBe("");
    expect(kjvPlainFromBollsHtml("")).toBe("");
  });
});

describe("kjvStrongsSegments", () => {
  it("uses Hebrew H- prefix for OT (book < 40)", () => {
    const html = "God<S>430</S> created<S>1254</S>";
    const segs = kjvStrongsSegments(html, 1);
    expect(segs.map((x) => ({ w: x.w, n: x.n ?? x.ns }))).toEqual([
      { w: "God", n: "H430" },
      { w: "created", n: "H1254" },
    ]);
  });

  it("uses Greek G- prefix for NT (book >= 40)", () => {
    const html = "God<S>2316</S> so loved";
    const segs = kjvStrongsSegments(html, 43);
    expect(segs[0]).toMatchObject({ w: "God", n: "G2316" });
    expect(segs[1]).toMatchObject({ w: "so loved", n: null });
  });

  it("pairs a leading orphan Strong number with the following word and the next number (Hebrew idiom style)", () => {
    const html = "<S>853</S>the heaven<S>8064</S>";
    const segs = kjvStrongsSegments(html, 1);
    expect(segs[0]).toEqual({ w: "the heaven", ns: ["H853", "H8064"] });
  });

  it("handles verse starting with a Strong marker", () => {
    const html = "<S>7225</S>In the beginning God";
    const segs = kjvStrongsSegments(html, 1);
    expect(segs[0]).toMatchObject({ w: "In the beginning God", n: "H7225" });
  });

  it("keeps terminal punctuation as its own segment when untagged", () => {
    const html = "earth<S>776</S>.";
    const segs = kjvStrongsSegments(html, 1);
    const last = segs[segs.length - 1];
    expect(last.w).toBe(".");
    expect(last.n).toBeNull();
  });
});
