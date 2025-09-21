// test_voting.js
const snarkjs = require("snarkjs");
const fs = require("fs");

const ZKEY_PATH = process.env.VOTE_ZKEY_PATH || "./vote_final.zkey";

async function testVoting() {
    try {
        console.log("Generating witness...");

        console.log("Generating proof...");
        if (!fs.existsSync(ZKEY_PATH)) {
            throw new Error(
                `Missing proving key at "${ZKEY_PATH}". Please run 'snarkjs groth16 setup' to generate vote_final.zkey before running this test.`
            );
        }

        const { proof, publicSignals } = await snarkjs.groth16.fullProve(
            require("./circuits/inputs/vote.input.json"),
            "./circuits/out/vote_js/vote.wasm", 
            ZKEY_PATH
        );

        console.log("Verifying proof...");
        const vKey = JSON.parse(fs.readFileSync("verification_key.json"));
        const res = await snarkjs.groth16.verify(vKey, publicSignals, proof);

        console.log("Verification result:", res);
        
        if (res === true) {
            console.log("Vote proof is VALID!");
            console.log("Public signals:", publicSignals);
        } else {
            console.log("Vote proof is INVALID!");
        }

    } catch (error) {
        console.error("Error:", error);
    }
}

testVoting();