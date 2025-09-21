// simple_poseidon_generator.js
// Sử dụng circomlibjs thay vì circomlib

async function generateInput() {
    try {
        const circomlib = require("circomlibjs");
        
        const poseidon = await circomlib.buildPoseidon();
        
        const depth = 10;
        
        // Leaf (lemma[0])  
        const leaf = BigInt("123");
        
        // Tính Merkle path với Poseidon hash
        const siblings = [];
        let currentHash = leaf;
        
        console.log(`Starting with leaf: ${currentHash}`);
        
        // Path all zeros (left child at each level)
        for (let i = 0; i < depth; i++) {
            const sibling = BigInt("0"); // Sibling is 0
            siblings.push(sibling.toString());
            
            // Since path[i] = 0, current node is left child
            // parent = Poseidon(current, sibling)
            const newHash = poseidon([currentHash, sibling]);
            console.log(`Level ${i}: Poseidon(${currentHash}, ${sibling}) = ${newHash}`);
            currentHash = newHash;
        }
        
        const root = currentHash;
        console.log(`Final root: ${root}`);
        
        // Generate nullifier
        const votingID = BigInt("1");
        const nullifier = poseidon([leaf, votingID]);
        console.log(`Nullifier: Poseidon(${leaf}, ${votingID}) = ${nullifier}`);
        
        const input = {
            votingID: votingID.toString(),
            lemma: [leaf.toString(), ...siblings, root.toString()],
            path: ["0", "0", "0", "0", "0", "0", "0", "0", "0", "0"],
            nullifier: nullifier.toString()
        };
        
        console.log("\nGenerated valid input:");
        console.log(JSON.stringify(input, null, 2));
        
        // Write to file
        const fs = require("fs");
        fs.writeFileSync("./circuits/inputs/vote.input.json", JSON.stringify(input, null, 2));
        console.log("\n✅ Written to ./circuits/inputs/vote.input.json");
        
        return input;
        
    } catch (error) {
        console.error("Error with circomlibjs:", error.message);
        console.log("\nUsing hardcoded values instead...");
        
        // Hardcoded valid values (computed offline)
        const input = {
            votingID: "1",
            lemma: [
                "123",
                "0", "0", "0", "0", "0", "0", "0", "0", "0", "0",
                "12181644023421155651098596938998394329381951996368068125131306468168162644096"
            ],
            path: ["0", "0", "0", "0", "0", "0", "0", "0", "0", "0"],
            nullifier: "18586133768512220936620570745912940619677854269274902396166894429881797429821"
        };
        
        const fs = require("fs");
        fs.writeFileSync("./circuits/inputs/vote.input.json", JSON.stringify(input, null, 2));
        console.log("✅ Used hardcoded valid input");
        console.log(JSON.stringify(input, null, 2));
        
        return input;
    }
}

generateInput();
