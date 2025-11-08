function isSorted(data) {
    return window.WASM.is_sorted(data);
}

function runBubble(data) {
    return window.WASM.bubble_sort(data);
}

function runQuick(data) {
    return window.WASM.quick_sort(data);
}

function resetQuick() {
    window.WASM.reset_quick_sort_state();
}

window.isSorted = isSorted;
window.runBubble = runBubble;
window.runQuick = runQuick;
window.resetQuick = resetQuick;