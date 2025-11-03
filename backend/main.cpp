#include <emscripten/emscripten.h>
#include <cmath>

extern "C" {
    int sqrt_cpp(int x) {
        return sqrt(x);
    }
}