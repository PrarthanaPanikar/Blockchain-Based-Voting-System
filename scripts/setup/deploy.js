const hre = require("hardhat");

async function main() {
  console.log("\n========================================");
  console.log("BLOCKCHAIN VOTING SYSTEM - DEPLOYMENT");
  console.log("========================================\n");

  // Get signers (local test accounts)
  const [admin, voter1, voter2, voter3] = await hre.ethers.getSigners();

  console.log("Deploying VotingSystem contract...");
  console.log("Admin address:", admin.address);

  // Deploy contract — constructor() takes no arguments; election name defaults to "General Election"
  const VotingSystem = await hre.ethers.getContractFactory("VotingSystem");
  const votingSystem = await VotingSystem.deploy();
  await votingSystem.waitForDeployment();

  const contractAddress = await votingSystem.getAddress();
  console.log("\n✓ VotingSystem deployed to:", contractAddress);

  // Setup dummy election
  console.log("\n----------------------------------------");
  console.log("Setting up demonstration election...");
  console.log("----------------------------------------\n");

  // Add candidates
  console.log("Adding candidates...");
  await votingSystem.addCandidate("Rahul Sharma", "Independent Party");
  console.log("  ✓ Added: Rahul Sharma (Independent Party)");

  await votingSystem.addCandidate("Priya Patel", "Progressive Alliance");
  console.log("  ✓ Added: Priya Patel (Progressive Alliance)");

  await votingSystem.addCandidate("Arjun Singh", "Reform Coalition");
  console.log("  ✓ Added: Arjun Singh (Reform Coalition)");

  // NOTE: Voters are NOT pre-registered here.
  // Use the Admin Dashboard → Voter Management tab to register voters,
  // which stores identity (name + Aadhaar) in the frontend and registers
  // the wallet address on-chain in one step.
  console.log("\nNo voters pre-registered — use Admin Dashboard to register voters.");

  console.log("\n========================================");
  console.log("DEPLOYMENT COMPLETE");
  console.log("========================================");
  console.log("\nContract Details:");
  console.log("  Address:", contractAddress);
  console.log("  Admin:", admin.address);
  console.log("  Candidates: 3");
  console.log("  Registered Voters: 0 (register via Admin Dashboard)");
  console.log("  Election State: NOT_STARTED");
  console.log("\nNext Steps:");
  console.log("  1. Update frontend/.env with contract address:");
  console.log(`     VITE_CONTRACT_ADDRESS=${contractAddress}`);
  console.log("  2. Restart the frontend dev server");
  console.log("  3. Login as Admin → Voter Management → Register voters");
  console.log("  4. Admin address:", admin.address);
  console.log("\n========================================\n");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
