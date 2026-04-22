import { describe, it, expect } from "vitest";
import { loadStrongDictionaryScript } from "../scripts/strong-lexicon-vm.mjs";

describe("loadStrongDictionaryScript", () => {
  it("loads a minimal CommonJS-style Strong dictionary export", () => {
    const js = `
      var strongsGreekDictionary = {"G1":{"lemma":"alpha","kjv_def":"a"}};
      module.exports = strongsGreekDictionary;
    `;
    const dict = loadStrongDictionaryScript(js);
    expect(dict.G1).toMatchObject({ lemma: "alpha" });
  });

  it("throws when module.exports is not a non-array object", () => {
    const js = `module.exports = 42;`;
    expect(() => loadStrongDictionaryScript(js)).toThrow(/Unexpected module\.exports/);
  });
});
