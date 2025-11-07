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

//Fiz na pressa não sei se tá bom. ps. quero morrer
extern "C" {
    void troca(int* a, int* b) {
        int temp = *a;
        *a = *b;
        *b = temp;
    }

    int particao(int* data, int low, int high) {
        int pivo = data[high];
        int i = (low - 1);
        for (int j = low; j <= high - 1; j++) {
            if (data[j] < pivo) {
                i++;
                troca(&data[i], &data[j]);
            }
        }
        
        troca(&data[i + 1], &data[high]);
        return (i + 1);
    } 

    void quick_sort(int* data, int low, int high) {
        if (low < high) {
            int pi = particao(data, low, high);
            quick_sort(data, low, pi - 1);
            quick_sort(data, pi + 1, high);
        }
    }
    int* quick_sort_wrapper(int* data, int length) {
        quick_sort(data, 0, length - 1);
        return data;
    } 
}