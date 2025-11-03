import path from 'path';
import { fileURLToPath } from 'url';
import {app, BrowserWindow} from 'electron';

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

if (!app.requestSingleInstanceLock()) {
  app.quit();
  process.exit(0);
}

let win;
function createWindow() {
  win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(dirname, "preload.js"),
      nodeIntegration: true,
      contextIsolation: true
    },
  });

  win.webContents.on("did-finish-load", () => {
    win.webContents.send("main-process-message", (new Date).toLocaleString())
  });

  win.on("ready-to-show", () => {
    win.maximize();
  });

  win.webContents.on("before-input-event", (_, input) => {
    if (input.type == "keyDown" && input.key == "F12") {
      if (win.webContents.isDevToolsOpened())
        win.webContents.closeDevTools();
      else win.webContents.openDevTools();
    }
  });

  if (process.env.VITE_DEV_SERVER_URL) {
    win.loadURL(process.env.VITE_DEV_SERVER_URL)
    
  }

  win.loadFile('./src/index.html');
  win.setMenu(null);
}

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

app.whenReady().then(createWindow);