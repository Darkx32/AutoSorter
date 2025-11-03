const { contextBridge } = require("electron");
const path = require("path");

(async () => {
  const ModuleFactory = (await import("../../backend/out/sorts.js")).default;
  const wasmPath = "../../backend/out/sorts.wasm";

  const Module = await ModuleFactory({
    locateFile: () => wasmPath
  });

  const sqrt = Module.cwrap("sqrt_cpp", "number", ["number"]);
  contextBridge.exposeInMainWorld("WASM", {
    sqrt: (x) => sqrt(x)
  });
})();