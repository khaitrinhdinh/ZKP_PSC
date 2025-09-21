pragma circom 2.2.2;
include "poseidon.circom";
include "./lib/MerkleTree.circom";

template Vote(depth) {
    // Logic:
    // 1. Verify user exists in Merkle tree
    // 2. Generate nullifier to prevent double voting
    // 3. Link vote to specific voting campaign
    signal input votingID;
    signal input lemma[depth+2];
    signal input path[depth];
    signal input nullifier;

    component merkleProof = MerkleProof(depth);
    component poseidon = Poseidon(2);

    merkleProof.lemma <== lemma;
    merkleProof.path <== path;

    poseidon.inputs[0] <== votingID;
    poseidon.inputs[1] <== lemma[0];

    poseidon.out === nullifier;
}

component main { public [votingID, nullifier] } = Vote(10);