class VisualizadorDeOrdenacao {
  constructor(idCanvas, funcaoDeInicio) {
    this.canvas = document.getElementById(idCanvas);
    this.ctx = this.canvas.getContext('2d');
    this.funcaoDeInicio = funcaoDeInicio;
    
    this.tamanhoArray = 1000;
    this.dados = [];
    this.dadosOriginais = [];
    this.emExecucao = false;
    this.emPausa = false;
    
    this.trocas = 0;
    this.tempoInicio = 0;
    this.tempoPassado = 0;
    
    this.canvas.width = 1000;
    this.canvas.height = 300;
    
    this.gerarDadosAleatorios();
    this.desenhar();
  }
  
  gerarDadosAleatorios() {
    this.dados = [];
    for (let i = 0; i < this.tamanhoArray; i++) {
      this.dados.push(Math.floor(Math.random() * this.canvas.height) + 1);
    }
    this.dadosOriginais = [...this.dados];
    this.trocas = 0;
    this.tempoPassado = 0;
  }
  
  desenhar() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    const larguraBarra = this.canvas.width / this.tamanhoArray;
    
    this.dados.forEach((valor, i) => {
      this.ctx.fillStyle = '#2196f3';
      const x = i * larguraBarra;
      const y = this.canvas.height - valor;
      this.ctx.fillRect(x, y, larguraBarra - 0.5, valor);
    });

    this.ctx.fillStyle = '#333';
    this.ctx.font = 'bold 16px Arial';
    this.ctx.fillText(`Trocas: ${this.trocas}`, 900, 20);
    this.ctx.fillText(`Tempo: ${(this.tempoPassado / 1000).toFixed(2)}s`, 900, 40);
  }
  
  async iniciar() {
    if (this.emExecucao) return;

    this.emExecucao = true;
    this.tempoInicio = performance.now();

    const resultado = await this.funcaoDeInicio(this.dados, (trocas) => {
      this.trocas = trocas;
      this.desenhar();
    });

    this.dados = resultado;
    this.emExecucao = false;
    this.tempoPassado = performance.now() - this.tempoInicio;
    this.desenhar();
  }
  
  pausar() {
    this.emPausa = !this.emPausa;
  }
  
  reiniciar() {
    this.emExecucao = false;
    this.emPausa = false;
    this.gerarDadosAleatorios();
    this.desenhar();
  }
  
  esperar(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

async function bubbleSort(arr, atualizarTrocas) {
  let dados = [...arr];
  let trocas = 0;

  for (let i = 0; i < dados.length; i++) {
    for (let j = 0; j < dados.length - i - 1; j++) {
      if (dados[j] > dados[j + 1]) {
        [dados[j], dados[j + 1]] = [dados[j + 1], dados[j]];
        trocas++;
        atualizarTrocas(trocas);
        await esperar(1);
      }
    }
  }
  return dados;
}

function esperar(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const mapeamento = {
  1: "bubble", 2: "quick"
};

let visualizadores = {};

window.addEventListener('DOMContentLoaded', () => {
  visualizadores.bubble = new VisualizadorDeOrdenacao('meuGrafico1', bubbleSort);
  visualizadores.quick = new VisualizadorDeOrdenacao('meuGrafico2', () => {});
});

function iniciarPeloId(numeroGrafico) {
  visualizadores[mapeamento[numeroGrafico]].iniciar();
}

function pausarPeloId(numeroGrafico) {
  visualizadores[mapeamento[numeroGrafico]].pausar();
}

function reiniciarPeloId(numeroGrafico) {
  visualizadores[mapeamento[numeroGrafico]].reiniciar();
}

window.iniciarPeloId = iniciarPeloId;
window.pausarPeloId = pausarPeloId;
window.reiniciarPeloId = reiniciarPeloId;
