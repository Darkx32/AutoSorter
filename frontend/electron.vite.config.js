
import { defineConfig } from "electron-vite";
/**
 * O arquivo de configuração principal do Electron-Vite.
 * Define as configurações específicas para os três contextos principais:
 * - main: processo principal do Electron (controle da aplicação).
 * - preload: script que conecta o processo principal ao renderer com segurança.
 * - renderer: camada de interface gráfica, onde o Vite compila o front-end.
 */

import path from "path";


export default defineConfig({ 

/**
 * Ela exporta a configuração completa do Electron-Vite.
 * Essa função define como os diferentes processos da aplicação Electron serão compilados, resolvidos e integrados durante o build.
 */

  main: {

    /**
   * Configuração do processo principal (main process).
   * É Responsável pela criação de janelas, gerenciar eventos do sistema e inicializar o app.
   */

    base:"./",

     /** 
     * Ele define o caminho base que é relativo aos arquivos de build.
     * Mantém o mesmo diretório (./) para que simplifique a estrutura final.
     */

    build: {
      lib: {
        entry: "electron/main.js",

        /** 
         *  O caminho do arquivo de entrada principal do processo "main".
         * Normalmente contém o código que inicia a janela e que gerencia o ciclo de vida da aplicação.
         */
      }
    },
  },
  preload: {
    build: {
      lib: {

         /**
   * Configuração do processo de preload.
   * O preload é executado antes do conteúdo da página (renderer) ser carregado.
   * Ele fornece uma ponte segura entre o front-end (renderer) e o processo principal (main).
   */

        entry: "electron/preload.js",

        /**
         * O caminho do script de preload.
         * Define quais os APIs e os métodos do Electron ficam expostos ao front-end.
         */

      },
    },
  },
  renderer: {

    /**
   * Configuração do processo renderer (interface gráfica).
   * Essa parte é compilada pelo Vite e representa o front-end da aplicação.
   */

    root: "src/",
    /*
     * Define o diretório raiz dos arquivos de front-end (HTML, JS, CSS, etc).
     */
    build: {
      rollupOptions: {

        /**
         * @property {string} input
         * Arquivo HTML principal que serve como ponto de entrada do app.
         * O Vite vai usar esse arquivo como base para fazer a compilação do front-end.
         */

        input: "src/index.html",
      },
    },
    resolve: {
      alias: {
        /**
         * Define os atalhos de importação para que facilite o uso de caminhos absolutos.
         */
        "@": path.resolve(__dirname, "src/"),
      },
    },
  },
});
