// Register all 4 authoritative voters on blockchain
const hre = require("hardhat");

const CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

const VOTERS = [
  { name: "Prarthana Panikar", wallet: "0x70997970c51812dc3a010c7d01b50e0d17dc79c8" },
  { name: "Sumesh Panikar", wallet: "0x3c44cdddb6a900fa2b585dd299e03d12fa4293bc" },
  { name: "Samitha Panikar", wallet: "0x15d34aaf54267db7d7c367839aaf71a00a2c6a65" },
  { name: "Payal Yadhav", wallet: "0x9965507d1a55bcc2695c58ba16fb37d819b0a4dc" },
];

async function main() {
  console.log("\n========== REGISTER ALL 4 AUTHORITATIVE VOTERS ==========\n");

  const [admin] = await hre.ethers.getSigners();
  console.log("Admin:", admin.address);
  console.log("Contract:", CONTRACT_ADDRESS);
  console.log();

  const contract = await hre.ethers.getContractAt("VotingSystem", CONTRACT_ADDRESS, admin);

  let registered = 0;
  let alreadyReg = 0;

  for (const voter of VOTERS) {
    console.log(`\n${voter.name}`);
    console.log(`Wallet: ${voter.wallet}`);

    try {
      const isReg = await contract.isVoterRegistered(voter.wallet);
      if (isReg) {
        console.log("✓ Already registered on blockchain");
        alreadyReg++;
        continue;
      }

      console.log("→ Registering on blockchain...");
      const tx = await contract.registerVoter(voter.wallet);
      const receipt = await tx.wait();
      console.log(`✓ Registered in block ${receipt.blockNumber}`);
      registered++;

    } catch (error) {
      console.log(`✗ Error: ${error.message}`);
    }
  }

  console.log("\n--- REGISTRATION SUMMARY ---\n");
  console.log(`Newly registered: ${registered}`);
  console.log(`Already registered: ${alreadyReg}`);

  const totalReg = await contract.registeredVoterCount();
  console.log(`\nTotal voters on blockchain: ${totalReg.toString()}`);

  console.log("\n--- VERIFICATION ---\n");
  for (const voter of VOTERS) {
    const isReg = await contract.isVoterRegistered(voter.wallet);
    console.log(`${voter.name.padEnd(20)} → ${isReg ? "✓ Registered" : "✗ NOT registered"}`);
  }

  console.log("\n=============================================\n");
}

main().catch(console.error);
