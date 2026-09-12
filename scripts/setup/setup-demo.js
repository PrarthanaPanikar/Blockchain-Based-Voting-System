/**
 * Complete Demo Setup Script
 * 
 * This script should be run after `npx hardhat node` to set up a fully functional demo:
 * 1. Deploy VotingSystem contract
 * 2. Add 3 demo candidates
 * 3. Register all 4 authoritative voters
 * 4. Start the election (set to ACTIVE state)
 * 
 * Usage: npx hardhat run scripts/setup-demo.js --network localhost
 */

const hre = require("hardhat");

const VOTERS = [
  { name: "Prarthana Panikar", wallet: "0x70997970c51812dc3a010c7d01b50e0d17dc79c8" },
  { name: "Sumesh Panikar", wallet: "0x3c44cdddb6a900fa2b585dd299e03d12fa4293bc" },
  { name: "Samitha Panikar", wallet: "0x15d34aaf54267db7d7c367839aaf71a00a2c6a65" },
  { name: "Payal Yadhav", wallet: "0x9965507d1a55bcc2695c58ba16fb37d819b0a4dc" },
];

const CANDIDATES = [
  { name: "Rahul Sharma", party: "Independent Party" },
  { name: "Priya Patel", party: "Progressive Alliance" },
  { name: "Arjun Singh", party: "Reform Coalition" },
];

async function main() {
  console.log("\n╔════════════════════════════════════════════════════════════════╗");
  console.log("║           BLOCKCHAIN VOTING SYSTEM - DEMO SETUP                ║");
  console.log("╚════════════════════════════════════════════════════════════════╝\n");

  try {
    const [admin] = await hre.ethers.getSigners();
    console.log("Admin Account:", admin.address);
    console.log("");

    // ─────────────────────────────────────────────────────────────────────────
    // STEP 1: Deploy Contract
    // ─────────────────────────────────────────────────────────────────────────
    console.log("STEP 1: Deploying VotingSystem contract...");
    console.log("─".repeat(65));

    const VotingSystem = await hre.ethers.getContractFactory("VotingSystem");
    const votingSystem = await VotingSystem.deploy();
    await votingSystem.waitForDeployment();

    const contractAddress = await votingSystem.getAddress();
    console.log("✓ Contract deployed to:", contractAddress);
    console.log("");

    // ─────────────────────────────────────────────────────────────────────────
    // STEP 2: Add Candidates
    // ─────────────────────────────────────────────────────────────────────────
    console.log("STEP 2: Adding candidates...");
    console.log("─".repeat(65));

    for (const candidate of CANDIDATES) {
      const tx = await votingSystem.addCandidate(candidate.name, candidate.party);
      await tx.wait();
      console.log(`✓ Added: ${candidate.name} (${candidate.party})`);
    }
    console.log("");

    // ─────────────────────────────────────────────────────────────────────────
    // STEP 3: Register All 4 Voters
    // ─────────────────────────────────────────────────────────────────────────
    console.log("STEP 3: Registering all 4 authoritative voters...");
    console.log("─".repeat(65));

    for (const voter of VOTERS) {
      const tx = await votingSystem.registerVoter(voter.wallet);
      await tx.wait();
      console.log(`✓ Registered: ${voter.name}`);
      console.log(`  Wallet: ${voter.wallet}`);
    }
    console.log("");

    // ─────────────────────────────────────────────────────────────────────────
    // STEP 4: Start Election
    // ─────────────────────────────────────────────────────────────────────────
    console.log("STEP 4: Starting election...");
    console.log("─".repeat(65));

    const startTx = await votingSystem.startElection();
    await startTx.wait();
    console.log("✓ Election started (state: ACTIVE)");
    console.log("");

    // ─────────────────────────────────────────────────────────────────────────
    // VERIFICATION
    // ─────────────────────────────────────────────────────────────────────────
    console.log("VERIFICATION");
    console.log("═".repeat(65));

    const electionStatus = await votingSystem.getElectionStatus();
    const statusName = ["NOT_STARTED", "ACTIVE", "ENDED"][Number(electionStatus)] || "UNKNOWN";
    console.log("Election Status:", statusName);

    const candidateCount = await votingSystem.candidateCount();
    console.log("Candidates:", Number(candidateCount));

    const voterCount = await votingSystem.registeredVoterCount();
    console.log("Registered Voters:", Number(voterCount));
    console.log("");

    console.log("Voter Registration Status:");
    for (const voter of VOTERS) {
      const isReg = await votingSystem.isVoterRegistered(voter.wallet);
      console.log(`  ${voter.name.padEnd(20)} → ${isReg ? "✓ Registered" : "✗ NOT Registered"}`);
    }
    console.log("");

    // ─────────────────────────────────────────────────────────────────────────
    // SUCCESS
    // ─────────────────────────────────────────────────────────────────────────
    console.log("╔════════════════════════════════════════════════════════════════╗");
    console.log("║                   SETUP COMPLETE ✓                            ║");
    console.log("╚════════════════════════════════════════════════════════════════╝");
    console.log("");
    console.log("Contract Address:", contractAddress);
    console.log("Admin Account:   ", admin.address);
    console.log("");
    console.log("UPDATE frontend/.env:");
    console.log(`  VITE_CONTRACT_ADDRESS=${contractAddress}`);
    console.log("");
    console.log("Then:");
    console.log("  1. Restart frontend: npm run dev");
    console.log("  2. Login as any voter and vote");
    console.log("  3. Use Admin Dashboard to manage election");
    console.log("");

  } catch (error) {
    console.error("\n❌ ERROR:", error.message);
    console.error(error);
    process.exit(1);
  }
}

main();
