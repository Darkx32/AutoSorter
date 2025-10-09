import { defineConfig } from "electron-vite";

export default defineConfig({
    main: {
        build: {
            lib: {
                entry: "./electron/main.js"
            }
        }
    }, 
    preload: {
        build: {
            lib: {
                entry: "./electron/preload.js"
            }
        }
    },
    renderer: {
        root: "src/",
        build: {
            rollupOptions: {
                input: "src/index.html"
            }
        }
    }
})