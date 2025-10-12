import { defineConfig } from "electron-vite";
import path from "path";


export default defineConfig({   
  main: {
    base:"./",
    build: {
      lib: {
        entry: "electron/main.js",
      },
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
    optimizeDeps: {
      include: ["chart.js", 'chart.js/auto', 'chart.js/dist/chart.esm.js', 'chart.js/dist/chart.umd.js'],
    },
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "src/"),
      },
    },
  },
});
