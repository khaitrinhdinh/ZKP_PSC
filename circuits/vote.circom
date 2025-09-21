pragma circom 2.2.2;

include "poseidon.circom";
include "./lib/MerklePath.circom";
include "./lib/Bitify.circom";

template Vote(depth) {
    signal input secret;
    signal input voteValue;
    signal input pathElements[depth];
    signal input pathIndex[depth];
    
    signal input merkleRoot;
    signal input nullifierHash;

    
    component boolCheck = BoolCheck();
    boolCheck.b <== voteValue;
    
    component leafHasher = Poseidon(1);
    leafHasher.inputs[0] <== secret;
    signal leaf <== leafHasher.out;
    
    component merkleProof = MerklePath(depth);
    merkleProof.leaf <== leaf;
    for (var i = 0; i < depth; i++) {
        merkleProof.pathElements[i] <== pathElements[i];
        merkleProof.pathIndex[i] <== pathIndex[i];
    }
    merkleProof.root === merkleRoot;
    
    component nullifierHasher = Poseidon(1); 
    nullifierHasher.inputs[0] <== secret;
    nullifierHasher.out === nullifierHash;
}

component main { 
    public [merkleRoot, nullifierHash] 
} = Vote(10);
