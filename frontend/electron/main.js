// importação de modulos do nodejs e electron
import path from 'path';
import { fileURLToPath } from 'url';
import {app, BrowserWindow} from 'electron';

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

//certifica que pelo menos uma instância do aplicativo seja executada
if (!app.requestSingleInstanceLock()) {
  app.quit();
  process.exit(0);
}

let win; //variável usada para armezenar a janela local  

//função usada para iniciar a janela de produção
function createWindow() {
  win = new BrowserWindow({
    width: 800,   //largura da janela
    height: 600,  //altura da jenala
    webPreferences: {
      preload: path.join(dirname, "preload.js"),   //roda a aplicação antes do renderer 
      nodeIntegration: true,
      contextIsolation: true
    },
  });

  //quamdo o coteúdo da janela terminar de carregar, ele manda uma mensagem ipc ao render 
  win.webContents.on("did-finish-load", () => {
    win.webContents.send("main-process-message", (new Date).toLocaleString())
  });

  //maximiza a janela assim que terminar de carregar-lá
  win.on("ready-to-show", () => {
    win.maximize();
  });

  //atalho para abrir e fechar DevTools ao pressionar f12
  win.webContents.on("before-input-event", (_, input) => {
    if (input.type == "keyDown" && input.key == "F12") {
      if (win.webContents.isDevToolsOpened())
        win.webContents.closeDevTools();
      else win.webContents.openDevTools();
    }
  });
  
  //carrega o servidor local com hot-reload , assim que estiver em um ambiente de desenvolvimento(vinte)
  if (process.env.VITE_DEV_SERVER_URL) {
    win.loadURL(process.env.VITE_DEV_SERVER_URL)
    
  }
  //carrega o arquivo html estático na versão de produção
  win.loadFile('./src/index.html');
   //remove o menu padrão da jenla 
  win.setMenu(null);
}

//fecha a aplicação quando todas as janelas forem fechadas 
app.on('window-all-closed', () => {
  //mantém a aplicação aberta sem janelas 
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

//recria a janela quando apertar no dock
app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
//inicializa o electon e cria a janela quando estiver pronta 
app.whenReady().then(createWindow);