// Script to cast votes for all registered voters
// This simulates the voting process for demonstration purposes
const hre = require("hardhat");

const CONTRACT_ADDRESS = "0x5FC8d32690cc91D4c39d9d3abcBD16989F875707";

// Voters to vote (wallet -> candidate ID)
// Candidate IDs: 1=Rahul Sharma, 2=Priya Patel, 3=Arjun Singh
const VOTES = [
  { wallet: "0x70997970C51812dc3A010C7d01b50e0d17dc79C8", candidateId: 1, name: "Prarthana Panikar" },
  { wallet: "0x90f7dafe7d9d1c0e5cd1a056f1f8ae53d1c5e3b9", candidateId: 2, name: "Arjun Singh" },
  { wallet: "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC", candidateId: 3, name: "Rahul Sharma" },
  { wallet: "0x90F79bf6EB2c4f870365E785982E1f101E93b906", candidateId: 1, name: "Priya Patel" },
  { wallet: "0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65", candidateId: 2, name: "Arjun Singh (2)" },
];

async function main() {
  console.log("\n========== BATCH VOTE CASTING ==========\n");

  const [admin] = await hre.ethers.getSigners();
  console.log("Admin signer:", admin.address);
  console.log("Contract address:", CONTRACT_ADDRESS);
  console.log("Voters to vote:", VOTES.length);
  console.log("\n--- Starting voting ---\n");

  const contract = await hre.ethers.getContractAt("VotingSystem", CONTRACT_ADDRESS, admin);

  let successCount = 0;
  let errorCount = 0;

  for (let i = 0; i < VOTES.length; i++) {
    const { wallet, candidateId, name } = VOTES[i];
    console.log(`\n[${i + 1}/${VOTES.length}] Voting for ${name}...`);
    console.log(`  Wallet: ${wallet}`);
    console.log(`  Candidate ID: ${candidateId}`);

    try {
      // Check if already voted
      const hasVoted = await contract.hasVoterVoted(wallet);
      if (hasVoted) {
        console.log("  ⊗ Already voted (skipping)");
        continue;
      }

      // Cast vote
      console.log("  → Submitting vote transaction...");
      const tx = await contract.vote(candidateId);
      console.log(`  → Transaction hash: ${tx.hash}`);
      
      // Wait for confirmation
      console.log("  → Waiting for confirmation...");
      const receipt = await tx.wait();
      console.log(`  ✓ Vote recorded in block ${receipt.blockNumber}`);
      successCount++;

    } catch (error) {
      console.log(`  ✗ Error: ${error.message}`);
      errorCount++;
    }
  }

  console.log("\n========== VOTING SUMMARY ==========\n");
  console.log(`Successfully voted: ${successCount}`);
  console.log(`Errors: ${errorCount}`);

  // Final results
  console.log("\n--- Final vote counts ---\n");
  
  const candidateCount = await contract.candidateCount();
  for (let i = 1; i <= Number(candidateCount); i++) {
    const candidate = await contract.getCandidate(i);
    console.log(`  ${candidate[1]} (${candidate[2]}): ${candidate[3]} votes`);
  }

  const totalVotes = await contract.totalVotes();
  console.log(`\nTotal votes cast: ${totalVotes.toString()}`);

  console.log("\n=====================================\n");
}

main().catch(console.error);
