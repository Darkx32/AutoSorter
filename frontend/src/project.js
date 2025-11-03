// project.js - Sistema completo de visualização de algoritmos de ordenação

class SortVisualizer {
  constructor(canvasId, startFunction) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext('2d');
    this.startFunction = startFunction;
    
    // Configurações
    this.arraySize = 1000;
    this.data = [];
    this.originalData = [];
    this.isRunning = false;
    this.isPaused = false;
    this.currentStep = 0;
    this.sortingSteps = [];
    
    // Configurar canvas
    this.canvas.width = 1000;
    this.canvas.height = 300;
    
    // Inicializar
    this.generateRandomData();
    this.draw();
  }
  
  generateRandomData() {
    this.data = [];
    for (let i = 0; i < this.arraySize; i++) {
      this.data.push(Math.floor(Math.random() * this.canvas.height) + 1);
    }
    this.originalData = [...this.data];
  }
  
  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    const barWidth = this.canvas.width / this.arraySize;
    
    this.data.forEach((value, index) => {
        this.ctx.fillStyle = '#2196f3';
        const x = index * barWidth;
        const y = this.canvas.height - value;
      
        this.ctx.fillRect(x, y, barWidth - 0.5, value);
    });
    
    // Desenhar nome do algoritmo
    this.ctx.fillStyle = '#333';
    this.ctx.font = 'bold 16px Arial';
  }
  
  async start() {
    this.startFunction();
  }
  
  pause() {
    this.isPaused = !this.isPaused;
  }
  
  restart() {
    this.isRunning = false;
    this.isPaused = false;
    this.currentStep = 0;
    this.sortingSteps = [];
    this.generateRandomData();
    this.draw();
  }
  
  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// ==================== INICIALIZAÇÃO ====================

const vizMap = {
  1: "bubble", 2: "selection", 3: "insertion", 4: "merge", 5: "quick", 6: "heap",
  7: "shell", 8: "counting"
};
let visualizers = {};

window.addEventListener('DOMContentLoaded', () => {
  // Criar visualizadores para cada algoritmo
  visualizers.bubble = new SortVisualizer('myChart1', () => {runBubble()}); // Bubble Sort
  visualizers.selection = new SortVisualizer('myChart2', () => {}); // Selection Sort
  visualizers.insertion = new SortVisualizer('myChart3', () => {}); // Insertion Sort
  visualizers.merge = new SortVisualizer('myChart4', () => {}); // Merge Sort
  visualizers.quick = new SortVisualizer('myChart5', () => {}); // Quick Sort
  visualizers.heap = new SortVisualizer('myChart6', () => {}); // Heap Sort
  visualizers.shell = new SortVisualizer('myChart7', () => {}); // Shell Sort
  visualizers.counting = new SortVisualizer('myChart8', () => {}); //Counting Sort
});

function startById(chartNumber) {
  visualizers[vizMap[chartNumber]].start();
}

window.startById = startById;