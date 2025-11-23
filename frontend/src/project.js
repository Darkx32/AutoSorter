//classe responsável por desenhar e animar algoritmo de ordenação do canvas 
class SortVisualizer {
  /**
   * @param {string} canvasId  //id do elemento'canvas' no HTML 
   * @param {{ (data: Int32Array | number[]): Int32Array | number[]; (data: Int32Array | number[]): Int32Array | number[]; }} startFunction   //função que executa uma interação dos algortimos 
   * @param {{ (): void; (): void; }} resetFunction //função que reserta o estado interno do algoritmo 
   */
  
  constructor(canvasId, startFunction, resetFunction) {
    this.canvas = document.getElementById(canvasId); //obtém o canvas pelo id 
    // @ts-ignore
    this.ctx = this.canvas.getContext('2d');   //contexto 2d para desenhar 
    this.startFunction = startFunction;        //função que roda um passo de ordenação 
    this.resetFunction = resetFunction;        //função que serta o algoritmo 

    this.arraySize = 1000;                     //quantidades de barras no gráfico 
    this.data = [];                            //array de valores a ser desenhados 
    this.isRunning = false;                    //contrala se o algortimo está rodando 
    this.isPaused = false;                     //controle de pausa 
    this.iteractionCount = 0;                  //contador de iterações
    this.timePassed = 0;                       //tempo total de execução 

    // @ts-ignore
    this.canvas.width = 1000;                  //largura do canvas 
    // @ts-ignore
    this.canvas.height = 300;                  //altura do canvas

    this.generateRandomData();                 //cria números aleatórios

    this.draw();                               //desenha o gráfico inicial 
  }

  //----------------------------------------
  //gera 1000 númerol aleatórios no canvas//
  //----------------------------------------

  generateRandomData() {
    this.data = [];
    for (let i = 0; i < this.arraySize; i++) {
      // @ts-ignore
      this.data.push(Math.floor(Math.random() * this.canvas.height) + 1);
    }
  }

  //------------------------------------------
  //desenha todas as barras do array no canvas
  //------------------------------------------

  draw() {
    // @ts-ignore
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // @ts-ignore
    const barWidth = this.canvas.width / this.arraySize;

    this.data.forEach((value, index) => {
        this.ctx.fillStyle = '#2196f3';
        const x = index * barWidth;        //posição horizontal
        // @ts-ignore
        const y = this.canvas.height - value;   //posição vertical invertida

        this.ctx.fillRect(x, y, barWidth - 0.5, value);  //desenha barra 
    });

    //mostra textos das estatísticas
    this.ctx.fillStyle = '#333';
    this.ctx.font = 'bold 16px Arial';
    this.ctx.fillText(`Trocas: ${this.iteractionCount}`, 900, 20);
    this.ctx.fillText(`Tempo: ${(this.timePassed / 1000).toFixed(2)}s`, 900, 40);
  }

  //inicia a animação do algortimo de ordenação , executa em loop até ordenar tudo 
  async start() {
    if (this.isRunning) return;         //evita iniciar duas vezes 

    this.isRunning = true;   
    while (this.isRunning) {
      if (!this.isPaused) {
        const startTime = new Date();       //marca inicio do ciclo 
        const result = this.startFunction(this.data);   //executa 1 passo do algoritmo 
        
        // @ts-ignore
        this.data = result;     //atualiza array 
        this.draw();            //redesenha tela 
 
        this.timePassed += new Date().getTime() - startTime.getTime();   //soma tempo 
        this.iteractionCount++;                //conta iteração 
      }
      await this.sleep(10);    //pequena pausa para animação 
      if (isSorted(this.data))   //para quando estiver ordenado 
        this.isRunning = false;
    }
  }

  //------------------------------
  //alterna entre pause e continuar 
  //------------------------------ 

  pause() {
    this.isPaused = !this.isPaused;
  }

  //reinicia toda a visualização
  restart() {
    this.isRunning = false;
    this.isPaused = false;
    this.iteractionCount = 0;
    this.timePassed = 0;
    this.generateRandomData();   //gera novos valores aleatórios 
    this.draw();                 //redesenha o gráfico 
    this.resetFunction();        //reseta o estado do algoritmo 
  }

 //função de delay para animação 
  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

//mapeias tipos de gráficos 
const vizMap = {
  1: "bubble", 2: "quick"
};
let visualizers = {};

//cria visualizadores quando a página carrega 
window.addEventListener('DOMContentLoaded', () => {
  visualizers.bubble = new SortVisualizer('bubbleCanva', runBubble, () => {});
  visualizers.quick = new SortVisualizer('quickCanva', runQuick, resetQuick);
});

/**
 * @param {number} chartNumber
 */

//----------------------------
//chamadas para os botões HTML
//----------------------------

function startById(chartNumber) {
  visualizers[vizMap[chartNumber]].start();
}

/**
 * @param {number} chartNumber
 */
function pauseById(chartNumber) {
  visualizers[vizMap[chartNumber]].pause();
}

/**
 * @param {number} chartNumber
 */
function restartById(chartNumber) {
  visualizers[vizMap[chartNumber]].restart();
}

window.startById = startById;
window.pauseById = pauseById;
window.restartById = restartById;