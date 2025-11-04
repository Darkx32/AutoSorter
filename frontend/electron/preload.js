const { contextBridge } = require("electron");
const path = require("path");

(async () => {
  const ModuleFactory = (await import("../../backend/out/sorts.js")).default;
  const wasmPath = "../../backend/out/sorts.wasm";

  const Module = await ModuleFactory({
    locateFile: () => wasmPath
  });

  const is_sorted = Module.cwrap("is_sorted", "boolean", ["number", "number"]);
  contextBridge.exposeInMainWorld("WASM", {
    sort_test: (data) => {
      const sBytes = data.length * Int32Array.BYTES_PER_ELEMENT;
      const ptr = Module._malloc(sBytes);

      Module.HEAP32.set(data, ptr / Int32Array.BYTES_PER_ELEMENT);
      Module._bubble_sort(ptr, data.length);

      const result = new Int32Array(Module.HEAP32.buffer, ptr, data.length);

      Module._free(ptr);

      return Array.from(result);
    },
    is_sorted: (data) => {
      const sBytes = data.length * Int32Array.BYTES_PER_ELEMENT;
      const ptr = Module._malloc(sBytes);

      Module.HEAP32.set(data, ptr / Int32Array.BYTES_PER_ELEMENT);
      const result = is_sorted(ptr, data.length);

      Module._free(ptr);
      return result;
    }
  });
})();