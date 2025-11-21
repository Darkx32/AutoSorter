function isSorted(data) {
    // @ts-ignore
    return window.WASM.is_sorted(data);

/**
 * Verifica se um array está ordenado.
 * @param {Int32Array | number[]} data - Array de inteiros a ser verificado
 * É `true` se o array estiver ordenado; caso contrário, é `false`.
 */
}

/**
 * Executa a passagem do algoritmo Bubble Sort no módulo WASM.
 * @param {Int32Array | number[]} data - Array de inteiros a ser ordenado.
 * @returns {Int32Array | number[]} O array parcialmente ordenado após a execução.
 */
function runBubble(data) {
    // @ts-ignore
    return window.WASM.bubble_sort(data);
}


/**
 * Executa o algoritmo Quick Sort no módulo WASM.
 * @param {Int32Array | number[]} data - Array de inteiros a ser ordenado.
 * @returns {Int32Array | number[]} O array parcialmente ou totalmente ordenado.
 */

function runQuick(data) {
    // @ts-ignore
    return window.WASM.quick_sort(data);
}

/**
 * Ela reinicia o estado interno do Quick Sort no módulo WASM.
 * Essa função é útil quando o algoritmo do Quick Sort é executado de forma interativa ou seja (por etapas) e precisa ser reiniciado sem recarregar o módulo.
 */
function resetQuick() {
    // @ts-ignore
    window.WASM.reset_quick_sort_state();
}

/**
 *Funções principais no escopo global `window` para que possam ser chamadas diretamente por outros scripts.
 */
window.isSorted = isSorted;
window.runBubble = runBubble;
window.runQuick = runQuick;
window.resetQuick = resetQuick;