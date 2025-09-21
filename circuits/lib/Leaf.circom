pragma circom 2.2.2;
include "poseidon.circom";

template Leaf() {
    signal input secret;
    signal output leaf;
    component h = Poseidon(1);
    h.inputs[0] <== secret;
    leaf <== h.out;
}
