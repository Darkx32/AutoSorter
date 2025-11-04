#include <emscripten/emscripten.h>
#include <cmath>

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

    bool is_sorted(const int* data, int length) {
        for (int i = 0; i < length - 1; i++)
            if (data[i] > data[i + 1])
                return false;
        return true;
    }
}