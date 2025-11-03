#include <emscripten/emscripten.h>

extern "C" {
    EMSCRIPTEN_KEEPALIVE
    int sqrt(int x) {
        return sqrt(x);
    }
}