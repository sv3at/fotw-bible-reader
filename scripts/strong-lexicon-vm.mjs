/**
 * Run openscriptures `var strongs…Dictionary = {…}; module.exports = …` in an isolated VM.
 * Shared by `build-bible-data.mjs` and unit tests.
 */
import vm from "node:vm";

export function loadStrongDictionaryScript(jsText) {
  const sandbox = { module: { exports: {} }, exports: {} };
  vm.createContext(sandbox);
  vm.runInContext(jsText, sandbox, { timeout: 120_000 });
  const out = sandbox.module.exports;
  if (!out || typeof out !== "object" || Array.isArray(out)) {
    throw new Error("Unexpected module.exports from Strong's dictionary script");
  }
  return out;
}
