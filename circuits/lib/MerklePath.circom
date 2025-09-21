pragma circom 2.2.2;
include "poseidon.circom";

template MerklePath(depth){
    signal input leaf;
    signal input pathElements[depth];
    signal input pathIndex[depth];
    signal output root;

    // pathIndex must be boolean
    for (var i = 0; i < depth; i++) {
        pathIndex[i] * (pathIndex[i] - 1) === 0;
    }

    // declare arrays outside loops
    signal left[depth];
    signal right[depth];
    signal t1[depth];
    signal cur[depth + 1];

    // init
    cur[0] <== leaf;

    component H[depth];
    for (var i = 0; i < depth; i++) {
        H[i] = Poseidon(2);

        // single-mul trick to avoid non-quadratic constraint
        t1[i]    <== pathIndex[i] * (pathElements[i] - cur[i]);
        left[i]  <== cur[i] + t1[i];
        right[i] <== pathElements[i] - t1[i];

        H[i].inputs[0] <== left[i];
        H[i].inputs[1] <== right[i];

        cur[i + 1] <== H[i].out;
    }

    root <== cur[depth];
}