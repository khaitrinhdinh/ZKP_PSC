// simple_input_generator.js
// Tạo input đơn giản để test circuit

function simpleHash(left, right) {
    // Sử dụng addition thay vì Poseidon để test đơn giản
    // Trong thực tế sẽ dùng Poseidon
    return ((BigInt(left) + BigInt(right)) % BigInt("21888242871839275222246405745257275088548364400416034343698204186575808495617")).toString();
}

function generateSimpleInput() {
    // Tạo một Merkle tree đơn giản với depth=10
    const depth = 10;
    
    // Leaf node (lemma[0])
    const leaf = "123";
    
    // Siblings cho mỗi level (lemma[1] đến lemma[10])
    const siblings = [];
    let currentHash = leaf;
    
    for (let i = 0; i < depth; i++) {
        const sibling = (i + 1).toString();
        siblings.push(sibling);
        
        // Path = 0 means current node is left child
        currentHash = simpleHash(currentHash, sibling);
    }
    
    const root = currentHash;
    
    // Tạo nullifier đơn giản
    const votingID = "1";
    const nullifier = simpleHash(leaf, votingID);
    
    return {
        votingID: votingID,
        lemma: [leaf, ...siblings, root],
        path: ["0", "0", "0", "0", "0", "0", "0", "0", "0", "0"], // All left
        nullifier: nullifier
    };
}

const input = generateSimpleInput();
console.log("Generated input:");
console.log(JSON.stringify(input, null, 2));
