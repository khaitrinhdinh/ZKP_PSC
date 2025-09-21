pragma circom 2.2.2;
include "poseidon.circom";

template Nullifier() {
    signal input secret;
    signal input context;
    signal output nullifierHash;

    component h = Poseidon(2);
    h.inputs[0] <== secret;
    h.inputs[1] <== context;
    nullifierHash <== h.out;
}