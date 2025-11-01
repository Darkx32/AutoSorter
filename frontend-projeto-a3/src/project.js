// project.js - Sistema completo de visualização de algoritmos de ordenação

class SortVisualizer {
  constructor(canvasId, algorithmName, sortFunction) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext('2d');
    this.algorithmName = algorithmName;
    this.sortFunction = sortFunction;
    
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
  
  draw(highlightIndices = []) {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    const barWidth = this.canvas.width / this.arraySize;
    
    this.data.forEach((value, index) => {
      // Cor das barras
      if (highlightIndices.includes(index)) {
        this.ctx.fillStyle = '#ff4757'; // Vermelho para comparação
      } else {
        this.ctx.fillStyle = '#2196f3'; // Azul padrão
      }
      
      const x = index * barWidth;
      const y = this.canvas.height - value;
      
      this.ctx.fillRect(x, y, barWidth - 0.5, value);
    });
    
    // Desenhar nome do algoritmo
    this.ctx.fillStyle = '#333';
    this.ctx.font = 'bold 16px Arial';
    this.ctx.fillText(this.algorithmName, 10, 20);
  }
  
  async start() {
    if (this.isRunning) return;
    
    this.isRunning = true;
    this.isPaused = false;
    
    // Gerar passos de ordenação
    this.sortingSteps = [];
    await this.sortFunction(this.data, (arr, indices) => {
      this.sortingSteps.push({
        array: [...arr],
        highlight: [...indices]
      });
    });
    
    // Executar animação
    for (let i = this.currentStep; i < this.sortingSteps.length; i++) {
      if (!this.isRunning) break;
      
      while (this.isPaused) {
        await this.sleep(100);
      }
      
      this.currentStep = i;
      this.data = this.sortingSteps[i].array;
      this.draw(this.sortingSteps[i].highlight);
      
      await this.sleep(5); // Velocidade da animação (5ms por passo)
    }
    
    this.isRunning = false;
    this.currentStep = 0;
    this.draw(); // Desenho final sem highlights
  }
  
  pause() {
    this.isPaused = !this.isPaused;
  }
  
  reset() {
    this.isRunning = false;
    this.isPaused = false;
    this.currentStep = 0;
    this.sortingSteps = [];
    this.data = [...this.originalData];
    this.draw();
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

// ==================== ALGORITMOS DE ORDENAÇÃO ====================

// 1. Bubble Sort
async function bubbleSort(arr, callback) {
  const array = [...arr];
  const n = array.length;
  
  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      callback(array, [j, j + 1]);
      
      if (array[j] > array[j + 1]) {
        [array[j], array[j + 1]] = [array[j + 1], array[j]];
      }
    }
  }
  
  return array;
}

// 2. Selection Sort
async function selectionSort(arr, callback) {
  const array = [...arr];
  const n = array.length;
  
  for (let i = 0; i < n - 1; i++) {
    let minIdx = i;
    
    for (let j = i + 1; j < n; j++) {
      callback(array, [minIdx, j]);
      
      if (array[j] < array[minIdx]) {
        minIdx = j;
      }
    }
    
    if (minIdx !== i) {
      [array[i], array[minIdx]] = [array[minIdx], array[i]];
    }
  }
  
  return array;
}

// 3. Insertion Sort
async function insertionSort(arr, callback) {
  const array = [...arr];
  const n = array.length;
  
  for (let i = 1; i < n; i++) {
    let key = array[i];
    let j = i - 1;
    
    while (j >= 0 && array[j] > key) {
      callback(array, [j, j + 1]);
      array[j + 1] = array[j];
      j--;
    }
    
    array[j + 1] = key;
  }
  
  return array;
}

// 4. Merge Sort
async function mergeSort(arr, callback) {
  const array = [...arr];
  
  async function merge(arr, left, mid, right) {
    const n1 = mid - left + 1;
    const n2 = right - mid;
    
    const L = arr.slice(left, mid + 1);
    const R = arr.slice(mid + 1, right + 1);
    
    let i = 0, j = 0, k = left;
    
    while (i < n1 && j < n2) {
      callback(arr, [left + i, mid + 1 + j]);
      
      if (L[i] <= R[j]) {
        arr[k] = L[i];
        i++;
      } else {
        arr[k] = R[j];
        j++;
      }
      k++;
    }
    
    while (i < n1) {
      arr[k] = L[i];
      i++;
      k++;
    }
    
    while (j < n2) {
      arr[k] = R[j];
      j++;
      k++;
    }
  }
  
  async function mergeSortHelper(arr, left, right) {
    if (left < right) {
      const mid = Math.floor((left + right) / 2);
      
      await mergeSortHelper(arr, left, mid);
      await mergeSortHelper(arr, mid + 1, right);
      await merge(arr, left, mid, right);
    }
  }
  
  await mergeSortHelper(array, 0, array.length - 1);
  return array;
}

// 5. Quick Sort
async function quickSort(arr, callback) {
  const array = [...arr];
  
  async function partition(arr, low, high) {
    const pivot = arr[high];
    let i = low - 1;
    
    for (let j = low; j < high; j++) {
      callback(arr, [j, high]);
      
      if (arr[j] < pivot) {
        i++;
        [arr[i], arr[j]] = [arr[j], arr[i]];
      }
    }
    
    [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
    return i + 1;
  }
  
  async function quickSortHelper(arr, low, high) {
    if (low < high) {
      const pi = await partition(arr, low, high);
      
      await quickSortHelper(arr, low, pi - 1);
      await quickSortHelper(arr, pi + 1, high);
    }
  }
  
  await quickSortHelper(array, 0, array.length - 1);
  return array;
}

// 6. Heap Sort
async function heapSort(arr, callback) {
  const array = [...arr];
  const n = array.length;
  
  async function heapify(arr, n, i) {
    let largest = i;
    const left = 2 * i + 1;
    const right = 2 * i + 2;
    
    if (left < n && arr[left] > arr[largest]) {
      largest = left;
    }
    
    if (right < n && arr[right] > arr[largest]) {
      largest = right;
    }
    
    if (largest !== i) {
      callback(arr, [i, largest]);
      [arr[i], arr[largest]] = [arr[largest], arr[i]];
      await heapify(arr, n, largest);
    }
  }
  
  // Construir heap
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    await heapify(array, n, i);
  }
  
  // Extrair elementos do heap
  for (let i = n - 1; i > 0; i--) {
    callback(array, [0, i]);
    [array[0], array[i]] = [array[i], array[0]];
    await heapify(array, i, 0);
  }
  
  return array;
}

// 7. Shell Sort
async function shellSort(arr, callback) {
  const array = [...arr];
  const n = array.length;
  
  for (let gap = Math.floor(n / 2); gap > 0; gap = Math.floor(gap / 2)) {
    for (let i = gap; i < n; i++) {
      const temp = array[i];
      let j = i;
      
      while (j >= gap && array[j - gap] > temp) {
        callback(array, [j, j - gap]);
        array[j] = array[j - gap];
        j -= gap;
      }
      
      array[j] = temp;
    }
  }
  
  return array;
}

// 8. Counting Sort
async function countingSort(arr, callback) {
  const array = [...arr];
  const max = Math.max(...array);
  const min = Math.min(...array);
  const range = max - min + 1;
  
  const count = new Array(range).fill(0);
  const output = new Array(array.length);
  
  // Contar ocorrências
  for (let i = 0; i < array.length; i++) {
    count[array[i] - min]++;
    callback(array, [i]);
  }
  
  // Modificar count para posições
  for (let i = 1; i < count.length; i++) {
    count[i] += count[i - 1];
  }
  
  // Construir array ordenado
  for (let i = array.length - 1; i >= 0; i--) {
    output[count[array[i] - min] - 1] = array[i];
    count[array[i] - min]--;
    callback(output, [i]);
  }
  
  return output;
}

// ==================== INICIALIZAÇÃO ====================

let visualizers = {};

window.addEventListener('DOMContentLoaded', () => {
  // Criar visualizadores para cada algoritmo
  visualizers.bubble = new SortVisualizer('myChart1', '', bubbleSort); // Bubble Sort
  visualizers.selection = new SortVisualizer('myChart2', '', selectionSort); // Selection Sort
  visualizers.insertion = new SortVisualizer('myChart3', '', insertionSort); // Insertion Sort
  visualizers.merge = new SortVisualizer('myChart4', '', mergeSort); // Merge Sort
  visualizers.quick = new SortVisualizer('myChart5', '', quickSort); // Quick Sort
  visualizers.heap = new SortVisualizer('myChart6', '', heapSort); // Heap Sort
  visualizers.shell = new SortVisualizer('myChart7', '', shellSort); // Shell Sort
  visualizers.counting = new SortVisualizer('myChart8', '', countingSort); //Counting Sort
});

// Funções globais para os botões
function startSort(chartNumber) {
  const vizMap = {
    1: 'bubble', 2: 'selection', 3: 'insertion', 4: 'merge',
    5: 'quick', 6: 'heap', 7: 'shell', 8: 'counting'
  };
  visualizers[vizMap[chartNumber]].start();
}

function pauseSort(chartNumber) {
  const vizMap = {
    1: 'bubble', 2: 'selection', 3: 'insertion', 4: 'merge',
    5: 'quick', 6: 'heap', 7: 'shell', 8: 'counting'
  };
  visualizers[vizMap[chartNumber]].pause();
}

function resetSort(chartNumber) {
  const vizMap = {
    1: 'bubble', 2: 'selection', 3: 'insertion', 4: 'merge',
    5: 'quick', 6: 'heap', 7: 'shell', 8: 'counting'
  };
  visualizers[vizMap[chartNumber]].reset();
}

function restartSort(chartNumber) {
  const vizMap = {
    1: 'bubble', 2: 'selection', 3: 'insertion', 4: 'merge',
    5: 'quick', 6: 'heap', 7: 'shell', 8: 'counting'
  };
  visualizers[vizMap[chartNumber]].restart();
}