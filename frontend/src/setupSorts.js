function isSorted(data) {
    return window.WASM.is_sorted(data);
}

function runBubble(data) {
    return window.WASM.sort_test(data);
}

window.isSorted = isSorted;
window.runBubble = runBubble;