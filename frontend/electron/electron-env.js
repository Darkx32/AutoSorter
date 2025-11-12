
/**
 * Declara o namespace global NodeJS, que adiciona as variáveis personalizadas à interface `ProcessEnv`.
 */

declare namespace NodeJS {
  interface ProcessEnv {
    DIST: string
    VITE_PUBLIC: string
  }
}

 /**
   * @interface ProcessEnv
   * @description Define as variáveis de ambiente personalizadas acessíveis através de `process.env`.
   * @property {string} DIST - Um caminho absoluto para a pasta de distribuição (build output).
   * @property {string} VITE_PUBLIC - URL pública usada pelo Vite para servir recursos estáticos.
   */



interface Window {
  /**
 * Estende o objeto global `Window` para incluir a API `ipcRenderer` do Electron.
 * Isso permite a comunicação segura entre o processo principal (Main) e o Renderer que isa o sistema de mensagens do electron
 */

  ipcRenderer: import('electron').IpcRenderer
  /**
   * @property {Electron.IpcRenderer} ipcRenderer
   * @description Instância do `ipcRenderer` do Electron injetada no contexto da janela.
   * Permite enviar e receber mensagens do processo principal
   * */
}