//importa o contexBridge do electron para expor APIs seguras 
const { contextBridge } = require("electron");
//importa manipulação de caminhos
const path = require("path");

//permite async/await na parte superior
(async () => {

  //importa o (sorts.js) gerado pelo Emscripten 
  const ModuleFactory = (await import("../../backend/out/sorts.js")).default;

  //caminho para o arquivo WASM compilado
  const wasmPath = "../../backend/out/sorts.wasm";

  //inicia o webAssembly passando as configurações personalizadas 
  const Module = await ModuleFactory({
    //informa ao emscripten a onde está o .wasm
    locateFile: () => wasmPath
  });

  //cria funções JAVAscript que chamam funcões exportadas do wasm
  const is_sorted = Module.cwrap("is_sorted", "boolean", ["number", "number"]);

  
  //reset_quick_sort_state -- reseta o estado do quick sort 
  const reset_quick_sort_state = Module.cwrap("reset_quick_sort_state", "void", []);

  //expôem no navegar de forma global (WINDOw.WASM)
  contextBridge.exposeInMainWorld("WASM", {

    //função que vai executar o bubble sort usando webassembly
    bubble_sort: (data) => {

      //vai calcular quantos bytes vão ser usados para armazenar o array
      const sBytes = data.length * Int32Array.BYTES_PER_ELEMENT;

      
      //aloca a memória no webassembly
      const ptr = Module._malloc(sBytes);

      //pega os dados do jsavascript e copia esses dados para o heap wasm
      Module.HEAP32.set(data, ptr / Int32Array.BYTES_PER_ELEMENT);

      //chama a função -bubble_sort dentro do webassembly
      Module._bubble_sort(ptr, data.length);

      const result = new Int32Array(Module.HEAP32.buffer, ptr, data.length).slice();

      //libera a mémoria alocado
      Module._free(ptr);

      //retorna uma cópia em formato array javascript
      return Array.from(result);
    },

    //função que executa o quicksort usando webassembly
    quick_sort: (data) => {
      const sBytes = data.length * Int32Array.BYTES_PER_ELEMENT;
      const ptr = Module._malloc(sBytes);

      Module.HEAP32.set(data, ptr / Int32Array.BYTES_PER_ELEMENT);
      Module._quick_sort(ptr, data.length);

      //ler o array ordenado acima
      const result = new Int32Array(Module.HEAP32.buffer, ptr, data.length).slice();

      Module._free(ptr);

      return Array.from(result);
    },

    //função que verifica se o array está ordenando via WebAssembly
    is_sorted: (data) => {
      const sBytes = data.length * Int32Array.BYTES_PER_ELEMENT;
      const ptr = Module._malloc(sBytes);

      Module.HEAP32.set(data, ptr / Int32Array.BYTES_PER_ELEMENT);

      //chama a função is_sorted (ptr, length)
      const result = is_sorted(ptr, data.length);

      //vai liberar memória
      Module._free(ptr);
      //retorna true ou falso
      return result;
    },
    
    //reserta qualquer estado interno usado pelo quicksort no WebAssembly
    reset_quick_sort_state: () => {
      reset_quick_sort_state()
    }
  });
})();