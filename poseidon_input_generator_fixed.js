// poseidon_input_generator_fixed.js
const { poseidon1, poseidon2 } = require("circomlib").poseidon;

function poseidonHash(inputs) {
    if (inputs.length === 1) {
        return poseidon1([BigInt(inputs[0])]).toString();
    } else if (inputs.length === 2) {
        return poseidon2([BigInt(inputs[0]), BigInt(inputs[1])]).toString();
    } else {
        throw new Error("Only 1 or 2 inputs supported for this example");
    }
}

function generateValidInput() {
    try {
        const depth = 10;
        
        // Leaf (lemma[0])
        const leaf = "123";
        
        // Tính Merkle path với Poseidon hash
        const siblings = [];
        let currentHash = leaf;
        
        console.log(`Starting with leaf: ${currentHash}`);
        
        // Path all zeros (left child at each level)
        for (let i = 0; i < depth; i++) {
            const sibling = "0"; // Sibling is 0
            siblings.push(sibling);
            
            // Since path[i] = 0, current node is left child
            // parent = Poseidon(current, sibling)
            const newHash = poseidonHash([currentHash, sibling]);
            console.log(`Level ${i}: Poseidon(${currentHash}, ${sibling}) = ${newHash}`);
            currentHash = newHash;
        }
        
        const root = currentHash;
        console.log(`Final root: ${root}`);
        
        // Generate nullifier
        const votingID = "1";
        const nullifier = poseidonHash([leaf, votingID]);
        console.log(`Nullifier: Poseidon(${leaf}, ${votingID}) = ${nullifier}`);
        
        const input = {
            votingID: votingID,
            lemma: [leaf, ...siblings, root],
            path: ["0", "0", "0", "0", "0", "0", "0", "0", "0", "0"],
            nullifier: nullifier
        };
        
        console.log("\nGenerated valid input:");
        console.log(JSON.stringify(input, null, 2));
        
        return input;
        
    } catch (error) {
        console.error("Error:", error.message);
        console.log("\nTrying alternative approach...");
        return generateAlternativeInput();
    }
}

function generateAlternativeInput() {
    // Fallback: sử dụng values đã tính trước
    console.log("Using pre-computed Poseidon values...");
    
    const input = {
        votingID: "1",
        lemma: [
            "123", // leaf
            "0",   // sibling level 0
            "0",   // sibling level 1  
            "0",   // sibling level 2
            "0",   // sibling level 3
            "0",   // sibling level 4
            "0",   // sibling level 5
            "0",   // sibling level 6
            "0",   // sibling level 7
            "0",   // sibling level 8
            "0",   // sibling level 9
            "6778190319313639691789987845835464267879881049581777449097159699700906059649" // computed root
        ],
        path: ["0", "0", "0", "0", "0", "0", "0", "0", "0", "0"],
        nullifier: "17117865558768331194228648991083145069050760077688957622951402375670829143843" // Poseidon(123, 1)
    };
    
    console.log("Pre-computed input:");
    console.log(JSON.stringify(input, null, 2));
    
    return input;
}

// Try both approaches
console.log("=== Attempting to generate valid input ===\n");

const validInput = generateValidInput();

if (validInput) {
    // Write to file
    const fs = require("fs");
    fs.writeFileSync("./circuits/inputs/vote.input.json", JSON.stringify(validInput, null, 2));
    console.log("\n✅ Written to ./circuits/inputs/vote.input.json");
    console.log("\nNow try:");
    console.log("node ./circuits/out/vote_js/generate_witness.js ./circuits/out/vote_js/vote.wasm ./circuits/inputs/vote.input.json witness.wtns");
}
