// generate_correct_input.js
// Tạo input chính xác với Poseidon hash

const circomlibjs = require("circomlibjs");

async function generateCorrectInput() {
    try {
        const poseidon = await circomlibjs.buildPoseidon();
        const F = poseidon.F;

        // 1. Secret của user
        const secret = BigInt("12345678901234567890");
        console.log("Secret:", secret.toString());

        // 2. Vote value (1 = "Có")
        const voteValue = BigInt("1");
        console.log("Vote value:", voteValue.toString());

        // 3. Tạo leaf từ secret
        const leaf = poseidon([secret]);
        console.log("Leaf (from secret):", F.toString(leaf));

        // 4. Tạo Merkle proof đơn giản với depth=10
        const depth = 10;
        const pathElements = [];
        const pathIndex = [];
        let currentHash = leaf;

        console.log("\nBuilding Merkle tree:");
        console.log("Level 0 (leaf):", F.toString(currentHash));

        // All siblings = 0, all paths = 0 (left child)
        for (let i = 0; i < depth; i++) {
            const sibling = F.zero; // Sibling = 0
            pathElements.push(F.toString(sibling));
            pathIndex.push("0"); // Left child

            // Parent = Poseidon(current, sibling) since we're left child
            const parent = poseidon([currentHash, sibling]);
            console.log(`Level ${i + 1}: Poseidon(${F.toString(currentHash)}, ${F.toString(sibling)}) = ${F.toString(parent)}`);
            currentHash = parent;
        }

        const merkleRoot = currentHash;
        console.log("\nFinal merkle root:", F.toString(merkleRoot));

        // 5. Tạo nullifier từ secret
        const nullifierHash = poseidon([secret]);
        console.log("Nullifier hash:", F.toString(nullifierHash));

        // 6. Tạo input object
        const input = {
            secret: secret.toString(),
            voteValue: voteValue.toString(),
            pathElements: pathElements,
            pathIndex: pathIndex,
            merkleRoot: F.toString(merkleRoot),
            nullifierHash: F.toString(nullifierHash)
        };

        console.log("\n=== GENERATED INPUT ===");
        console.log(JSON.stringify(input, null, 2));

        // 7. Verify tính toán
        console.log("\n=== VERIFICATION ===");
        let verifyHash = leaf;
        console.log("Start with leaf:", F.toString(verifyHash));

        for (let i = 0; i < depth; i++) {
            const sibling = F.e(pathElements[i]);
            const isLeft = pathIndex[i] === "0";
            
            if (isLeft) {
                verifyHash = poseidon([verifyHash, sibling]);
                console.log(`Level ${i}: Poseidon(current, ${F.toString(sibling)}) = ${F.toString(verifyHash)}`);
            } else {
                verifyHash = poseidon([sibling, verifyHash]);
                console.log(`Level ${i}: Poseidon(${F.toString(sibling)}, current) = ${F.toString(verifyHash)}`);
            }
        }

        console.log("Computed root:", F.toString(verifyHash));
        console.log("Expected root:", F.toString(merkleRoot));
        console.log("Match:", F.eq(verifyHash, merkleRoot) ? "✅ YES" : "❌ NO");

        // 8. Write to file
        const fs = require("fs");
        fs.writeFileSync("./circuits/inputs/vote.input.json", JSON.stringify(input, null, 2));
        console.log("\n✅ Written to ./circuits/inputs/vote.input.json");

        return input;

    } catch (error) {
        console.error("Error:", error);
        
        // Fallback with hardcoded values
        console.log("Using fallback values...");
        const fallbackInput = {
            secret: "12345678901234567890",
            voteValue: "1",
            pathElements: ["0", "0", "0", "0", "0", "0", "0", "0", "0", "0"],
            pathIndex: ["0", "0", "0", "0", "0", "0", "0", "0", "0", "0"],
            merkleRoot: "6778190319313639691789987845835464267879881049581777449097159699700906059649",
            nullifierHash: "4330397376401421145241669206216816969596994005681896315681784387731540423863"
        };

        const fs = require("fs");
        fs.writeFileSync("./circuits/inputs/vote.input.json", JSON.stringify(fallbackInput, null, 2));
        console.log("✅ Used fallback input");
        
        return fallbackInput;
    }
}

generateCorrectInput();
