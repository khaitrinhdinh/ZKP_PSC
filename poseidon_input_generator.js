// poseidon_input_generator.js
const circomlib = require("circomlib");

function poseidonHash(inputs) {
    return circomlib.poseidon(inputs).toString();
}

function generateValidInput() {
    try {
        const depth = 10;
        
        // Leaf (lemma[0])
        const leaf = "123";
        
        // Tính Merkle path với Poseidon hash
        const siblings = [];
        let currentHash = leaf;
        
        // Path all zeros (left child at each level)
        for (let i = 0; i < depth; i++) {
            const sibling = "0"; // Sibling is 0
            siblings.push(sibling);
            
            // Since path[i] = 0, current node is left child
            // parent = Poseidon(current, sibling)
            currentHash = poseidonHash([currentHash, sibling]);
        }
        
        const root = currentHash;
        
        // Generate nullifier
        const votingID = "1";
        const nullifier = poseidonHash([leaf, votingID]);
        
        const input = {
            votingID: votingID,
            lemma: [leaf, ...siblings, root],
            path: ["0", "0", "0", "0", "0", "0", "0", "0", "0", "0"],
            nullifier: nullifier
        };
        
        console.log("Generated valid Poseidon input:");
        console.log(JSON.stringify(input, null, 2));
        
        // Verify the computation
        console.log("\nVerification:");
        let hash = leaf;
        console.log(`Start with leaf: ${hash}`);
        
        for (let i = 0; i < depth; i++) {
            const sibling = siblings[i];
            const oldHash = hash;
            hash = poseidonHash([hash, sibling]);
            console.log(`Level ${i}: Poseidon(${oldHash}, ${sibling}) = ${hash}`);
        }
        
        console.log(`Final root: ${hash}`);
        console.log(`Expected root: ${root}`);
        console.log(`Match: ${hash === root}`);
        
        return input;
        
    } catch (error) {
        console.error("Error:", error.message);
        console.log("\nPlease install circomlib:");
        console.log("npm install circomlib");
        return null;
    }
}

const validInput = generateValidInput();

if (validInput) {
    // Write to file
    const fs = require("fs");
    fs.writeFileSync("./circuits/inputs/vote.input.json", JSON.stringify(validInput, null, 2));
    console.log("\n✅ Written to ./circuits/inputs/vote.input.json");
}
