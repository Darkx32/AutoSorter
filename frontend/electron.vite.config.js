import { defineConfig } from "electron-vite";
import path from "path";


export default defineConfig({   
  main: {
    base:"./",
    build: {
      lib: {
        entry: "electron/main.js",
      }
    },
  },
  preload: {
    build: {
      lib: {
        entry: "electron/preload.js",
      },
    },
  },
  renderer: {
    root: "src/",
    build: {
      rollupOptions: {
        input: "src/index.html",
      },
    },
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "src/"),
      },
    },
  },
});
