// Script to export all registered voters from localStorage
// This reads the browser database and displays voter details

const fs = require('fs');

// Simulate reading from localStorage (this would be from browser in real scenario)
// For now, we'll create a comprehensive voter reference with Hardhat accounts

const HARDHAT_ACCOUNTS = [
  { index: 0, address: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266", privateKey: "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80" },
  { index: 1, address: "0x70997970C51812dc3A010C7d01b50e0d17dc79C8", privateKey: "0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d" },
  { index: 2, address: "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC", privateKey: "0x5de4111afa1a4b94908f83103eb1f1706367c2e68ca870fc3fb9a804cdab365a" },
  { index: 3, address: "0x90F79bf6EB2c4f870365E785982E1f101E93b906", privateKey: "0x7c852118294e51e653712a81e05800f419141751be58f605c371e15141b007a6" },
  { index: 4, address: "0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65", privateKey: "0x47e179ec197488593b187f80a00eb0da91f1b9d0b13f8733639f19c30a34926b" },
  { index: 5, address: "0x9965507D1a55bcC2695C58ba16FB37d819B0A4dc", privateKey: "0x8b3a350cf5c34c9194ca85829a2df0ec3153be0318b5e2d3348e872092edffba" },
  { index: 6, address: "0x976EA74026E726554dB657fA54763abd0C3a0aa9", privateKey: "0x92db14e403b83dfe3df233f83dfa3a0d7096f21ca9b0d6d6b8d88b2b4ec1564e" },
  { index: 7, address: "0x14dC79964da2C08b23698B3D3cc7Ca32193d9955", privateKey: "0x4bbbf85ce3377467afe5d46f804f221813b2bb87f24d81f60f1fcdbf7cbf4356" },
  { index: 8, address: "0x23618e81E3f5cdF7f54C3d65f7FBc0aBf5B21E8f", privateKey: "0xdbda1821b80551c9d65939329250132c444b3a62ebf10b6e8e4d22e86bd88fa5" },
  { index: 9, address: "0xa0Ee7A142d267C1f36714E4a8F75612F20a79720", privateKey: "0x2a871d0798f97d79848a013d4936a73bf4cc922c825d33c1cf7073dff6d409c6" },
];

// Voter registration data (from your admin dashboard)
const REGISTERED_VOTERS = [
  { name: "Prarthana Panikar", aadhaar: "123456781234", walletIndex: 1 },
  { name: "Arjun Singh", aadhaar: "123456781234", walletIndex: 5 },
  { name: "Rahul Sharma", aadhaar: "900123", walletIndex: 2 },
  { name: "Sumesh Panikar", aadhaar: "234500", walletIndex: 7 },
  { name: "Samitha Panikar", aadhaar: "901234", walletIndex: 8 },
  { name: "Anika Kapoor", aadhaar: "912345", walletIndex: 6 },
  { name: "Payal Yadhav", aadhaar: "901100", walletIndex: 9 },
];

function main() {
  console.log("\n");
  console.log("╔════════════════════════════════════════════════════════════════════════════════════════╗");
  console.log("║                     BLOCKCHAIN VOTING SYSTEM - VOTER DATABASE                         ║");
  console.log("╚════════════════════════════════════════════════════════════════════════════════════════╝");
  console.log("\n");

  // Build complete voter list with details
  const voterList = REGISTERED_VOTERS.map((voter, index) => {
    const account = HARDHAT_ACCOUNTS[voter.walletIndex];
    return {
      id: index + 1,
      name: voter.name,
      aadhaar: voter.aadhaar,
      walletAddress: account.address,
      privateKey: account.privateKey,
    };
  });

  // Display as formatted table
  console.log("REGISTERED VOTERS - COMPLETE DETAILS");
  console.log("═".repeat(110));
  console.log(
    "ID | Name                  | Aadhaar      | Wallet Address                 | Private Key (First 16 chars)"
  );
  console.log("─".repeat(110));

  voterList.forEach((voter) => {
    console.log(
      `${voter.id.toString().padEnd(2)} | ${voter.name.padEnd(21)} | ${voter.aadhaar.padEnd(12)} | ${voter.walletAddress} | ${voter.privateKey.slice(0, 16)}...`
    );
  });

  console.log("═".repeat(110));
  console.log("\n");

  // Display full private keys
  console.log("FULL PRIVATE KEYS FOR METAMASK IMPORT");
  console.log("─".repeat(110));
  voterList.forEach((voter) => {
    console.log(`\n${voter.id}. ${voter.name}`);
    console.log(`   Name:    ${voter.name}`);
    console.log(`   Aadhaar: ${voter.aadhaar}`);
    console.log(`   Wallet:  ${voter.walletAddress}`);
    console.log(`   Key:     ${voter.privateKey}`);
  });

  console.log("\n═".repeat(110));
  console.log("\n");

  // Export as JSON
  const jsonFile = "voter-database.json";
  fs.writeFileSync(jsonFile, JSON.stringify(voterList, null, 2));
  console.log(`✓ Voter database exported to: ${jsonFile}\n`);

  // Export as CSV
  const csvFile = "voter-database.csv";
  const csvHeader = "ID,Name,Aadhaar,Wallet Address,Private Key\n";
  const csvData = voterList
    .map((v) => `${v.id},"${v.name}","${v.aadhaar}","${v.walletAddress}","${v.privateKey}"`)
    .join("\n");
  fs.writeFileSync(csvFile, csvHeader + csvData);
  console.log(`✓ Voter database exported to: ${csvFile}\n`);

  // Instructions
  console.log("NEXT STEPS - MANUAL VOTING");
  console.log("─".repeat(110));
  console.log("\nFor each voter:");
  console.log("  1. Open MetaMask");
  console.log("  2. Click Account dropdown → Import Account");
  console.log("  3. Paste the Private Key");
  console.log("  4. Go to browser: Voter Login tab");
  console.log("  5. Enter Name + Aadhaar from table above");
  console.log("  6. Connect MetaMask → Complete Verification");
  console.log("  7. Select candidate → Confirm Vote");
  console.log("  8. Repeat for next voter\n");

  console.log("═".repeat(110));
}

main();
