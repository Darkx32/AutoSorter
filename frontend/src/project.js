class SortVisualizer {
  constructor(canvasId, startFunction, resetFunction) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext('2d');
    this.startFunction = startFunction;
    this.resetFunction = resetFunction;

    this.arraySize = 1000;
    this.data = [];
    this.isRunning = false;
    this.isPaused = false;
    this.iteractionCount = 0;
    this.timePassed = 0;

    this.canvas.width = 1000;
    this.canvas.height = 300;

    this.generateRandomData();
    this.draw();
  }

  generateRandomData() {
    this.data = [];
    for (let i = 0; i < this.arraySize; i++) {
      this.data.push(Math.floor(Math.random() * this.canvas.height) + 1);
    }
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

    this.ctx.fillStyle = '#333';
    this.ctx.font = 'bold 16px Arial';
    this.ctx.fillText(`Trocas: ${this.iteractionCount}`, 900, 20);
    this.ctx.fillText(`Tempo: ${(this.timePassed / 1000).toFixed(2)}s`, 900, 40);
  }

  async start() {
    if (this.isRunning) return;

    this.isRunning = true;
    while (this.isRunning) {
      if (!this.isPaused) {
        const startTime = new Date();
        const result = this.startFunction(this.data);
        
        this.data = result;
        this.draw();

        this.timePassed += new Date().getTime() - startTime.getTime();
        this.iteractionCount++;
      }
      await this.sleep(10);
      if (isSorted(this.data))
        this.isRunning = false;
    }
  }

  pause() {
    this.isPaused = !this.isPaused;
  }

  restart() {
    this.isRunning = false;
    this.isPaused = false;
    this.iteractionCount = 0;
    this.timePassed = 0;
    this.generateRandomData();
    this.draw();
    this.resetFunction();
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

const vizMap = {
  1: "bubble", 2: "quick"
};
let visualizers = {};

window.addEventListener('DOMContentLoaded', () => {
  visualizers.bubble = new SortVisualizer('bubbleCanva', runBubble, () => {});
  visualizers.quick = new SortVisualizer('quickCanva', runQuick, resetQuick);
});

function startById(chartNumber) {
  visualizers[vizMap[chartNumber]].start();
}

function pauseById(chartNumber) {
  visualizers[vizMap[chartNumber]].pause();
}

function restartById(chartNumber) {
  visualizers[vizMap[chartNumber]].restart();
}

window.startById = startById;
window.pauseById = pauseById;
window.restartById = restartById;