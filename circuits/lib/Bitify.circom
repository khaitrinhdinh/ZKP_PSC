pragma circom 2.2.2;
template BoolCheck() {
    signal input b;
    b * (b - 1) === 0;
}
