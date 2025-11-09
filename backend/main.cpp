#include <emscripten/emscripten.h>

int l = -1, r = -1, pivot = 0;
bool working = false;
struct Range { int l, r; };
Range stack[64];
int top = -1;

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

    void push(int l, int r) {
        stack[++top] = {l, r};
    }

    void pop() {
        top--;
    }

    void start_partition(int* v) {
        l = stack[top].l;
        r = stack[top].r;
        pivot = v[(l + r) / 2];
        working = true;
    }

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

    void reset_quick_sort_state() {
        l = r = pivot = 0;
        working = false;
        top = -1;
    }

    bool is_sorted(const int* data, int length) {
        for (int i = 0; i < length - 1; i++)
            if (data[i] > data[i + 1])
                return false;
        return true;
    }
}