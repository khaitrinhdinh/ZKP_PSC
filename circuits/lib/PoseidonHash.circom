pragma circom 2.2.2;
include "poseidon.circom";

template Poseidon2() {
    signal input a;
    signal input b;
    signal output out;
    component h = Poseidon(2);
    h.inputs[0] <== a;
    h.inputs[1] <== b;
    out <== h.out;
}
