#include <emscripten/emscripten.h>

int l = -1, r = -1, pivot = 0;
bool working = false;
struct Range { int l, r; };
Range stack[64];
int top = -1;

/**
     @function bubble_sort
      @description Executa uma única passagem do algoritmo Bubble Sort em um array de inteiros.
      Apenas compara e troca elementos adjacentes que estão fora de ordem.
      @param {number*} data - Ponteiro para o início do array de inteiros (em HEAP32 no JS).
      @param {number} length - Número total de elementos do array.
      @returns {number*} Ponteiro para o mesmo array, já parcialmente ordenado.
     */

extern "C" {
    int* bubble_sort(int* data, int length) {
        for (int j = 0; j < length - 1; j++) {
            if (data[j] > data[j+1]) {
                int temp = data[j];
                data[j] = data[j+1];
                data[j+1] = temp;
            }
        }

        return data;
    }

/**
     * @function push
     * @description Empilha intervalos (esquerda e direita) na pilha usada pelo algoritmo do Quick Sort.
     * 
     * @param {number} l - Índice do lado esquerdo do intervalo.
     * @param {number} r - Índice do lado direito do intervalo.
     */

    void push(int l, int r) {
        stack[++top] = {l, r};
    }

    /** 
    * @function pop
     * @description Remove o intervalo mais recente da pilha de partições do Quick Sort.
     */
    void pop() {
        top--;
    }



/**
     * @function start_partition
     * @description Inicia uma nova partição do Quick Sort com base no topo da pilha.
     * Define `l`, `r` e o `pivot` e marca o algoritmo em execução.
     * @param {number*} v - Ponteiro para o array de inteiros.
     */
    
    void start_partition(int* v) {
        l = stack[top].l;
        r = stack[top].r;
        pivot = v[(l + r) / 2];
        working = true;
    }


    /**
     * @function quick_sort
     * @description Executa etapa incremental do algoritmo Quick Sort.
     * Este método é projetado para que seja chamado repetidamente até que a ordenação seja concluída.
     * @param {number*} v - Ponteiro para o início do array (HEAP32 no JavaScript).
     * @param {number} length - Número de elementos do array.
     * */

    void quick_sort(int* v, int length) {
        if (top == -1 && !working) {
            push(0, length - 1);
            start_partition(v);
        }

        if (top == -1) return;

        if (l <= r) {

            while (v[l] < pivot) l++;
            while (v[r] > pivot) r--;

            if (l <= r) {
                int tmp = v[l];
                v[l] = v[r];
                v[r] = tmp;
                l++;
                r--;
            }

            return;
        }

        int L = stack[top].l;
        int R = stack[top].r;
        pop();

        if (L < r) push(L, r);
        if (l < R) push(l, R);

        working = false;

        if (top >= 0)
            start_partition(v);
    }

  /**
      * @function reset_quick_sort_state
     * @description Restaura o estado interno do algoritmo Quick Sort.
     * É útil quando se deseja iniciar uma nova ordenação após a outra.
     * */

    void reset_quick_sort_state() {
        l = r = pivot = 0;
        working = false;
        top = -1;
    }

/**
     * @function is_sorted
     * @description Verifica se o array está ordenado em ordem crescente.
     * @param {number*} data - Ponteiro para o início do array.
     * @param {number} length - A quantidade de elementos.
     * @returns {boolean} `true` se o array estiver ordenado, caso contrário `false`.
     * */

    bool is_sorted(const int* data, int length) {
        for (int i = 0; i < length - 1; i++)
            if (data[i] > data[i + 1])
                return false;
        return true;
    }
}