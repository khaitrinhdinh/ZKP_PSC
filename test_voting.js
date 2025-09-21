// test_voting.js
const snarkjs = require("snarkjs");
const fs = require("fs");

async function testVoting() {
    try {
        // 1. Generate witness
        console.log("Generating witness...");
        // (already done above)

        // 2. Generate proof  
        console.log("Generating proof...");
        const { proof, publicSignals } = await snarkjs.groth16.fullProve(
            require("./circuits/inputs/vote.input.json"),
            "./circuits/out/vote_js/vote.wasm", 
            "./vote_final.zkey"
        );

        // 3. Verify proof
        console.log("Verifying proof...");
        const vKey = JSON.parse(fs.readFileSync("verification_key.json"));
        const res = await snarkjs.groth16.verify(vKey, publicSignals, proof);

        console.log("Verification result:", res);
        
        if (res === true) {
            console.log("✅ Vote proof is VALID!");
            console.log("Public signals:", publicSignals);
        } else {
            console.log("❌ Vote proof is INVALID!");
        }

    } catch (error) {
        console.error("Error:", error);
    }
}

testVoting();