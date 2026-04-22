import { describe, it, expect } from "vitest";
import { USFM_LIST, BNUMBER_TO_USFM, USFM_BY_ID } from "../scripts/usfm-books.mjs";

describe("usfm-books", () => {
  it("maps Bolls book numbers 1 and 40 to Genesis and Matthew", () => {
    expect(BNUMBER_TO_USFM[1]).toBe("GEN");
    expect(BNUMBER_TO_USFM[40]).toBe("MAT");
  });

  it("has 66 USFM entries in order", () => {
    expect(USFM_LIST).toHaveLength(66);
    expect(USFM_LIST[0].id).toBe("GEN");
    expect(USFM_LIST[65].id).toBe("REV");
  });

  it("USFM_BY_ID matches display names", () => {
    expect(USFM_BY_ID.JHN.n).toMatch(/John/i);
  });
});
