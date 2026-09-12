// Generate correct voter commitments using the same algorithm as auth.js
const crypto = require('crypto');

const AUTHORITATIVE_VOTERS = [
  { name: 'Prarthana Panikar', aadhaar: '123456781234', wallet: '0x70997970c51812dc3a010c7d01b50e0d17dc79c8' },
  { name: 'Sumesh Panikar', aadhaar: '123456789012', wallet: '0x3c44cdddb6a900fa2b585dd299e03d12fa4293bc' },
  { name: 'Samitha Panikar', aadhaar: '123456789123', wallet: '0x15d34aaf54267db7d7c367839aaf71a00a2c6a65' },
  { name: 'Payal Yadhav', aadhaar: '123456789124', wallet: '0x9965507d1a55bcc2695c58ba16fb37d819b0a4dc' },
];

function createCommitment(name, aadhaar) {
  const combined = `${name.trim().toLowerCase()}:${aadhaar.replace(/\s/g, '')}`;
  return crypto.createHash('sha256').update(combined).digest('hex');
}

function maskAadhaar(aadhaar) {
  const digits = aadhaar.replace(/\s/g, '');
  return `XXXX XXXX ${digits.slice(-4)}`;
}

console.log('\n========== AUTHORITATIVE VOTER COMMITMENTS ==========\n');

const DEFAULT_VOTERS = {};

for (const voter of AUTHORITATIVE_VOTERS) {
  const commitment = createCommitment(voter.name, voter.aadhaar);
  const masked = maskAadhaar(voter.aadhaar);
  
  DEFAULT_VOTERS[commitment] = {
    name: voter.name,
    aadhaarMasked: masked,
    aadhaarHash: commitment,
    walletAddress: voter.wallet.toLowerCase(),
    registered: true,
    registeredAt: new Date().toISOString(),
    confirmedAt: new Date().toISOString(),
  };

  console.log(`${voter.name}`);
  console.log(`  Aadhaar: ${voter.aadhaar}`);
  console.log(`  Masked: ${masked}`);
  console.log(`  Wallet: ${voter.wallet}`);
  console.log(`  Commitment: ${commitment}`);
  console.log();
}

console.log('========== FOR auth.js DEFAULT_VOTERS ==========\n');
console.log('const DEFAULT_VOTERS = ' + JSON.stringify(DEFAULT_VOTERS, null, 2));
console.log('\n================================================\n');
