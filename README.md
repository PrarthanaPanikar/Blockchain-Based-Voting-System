# 🗳️ Blockchain-Based Voting System

An educational blockchain voting prototype built with Solidity smart contracts, Hardhat, and React. This system demonstrates voter registration, candidate management, one-vote-per-wallet enforcement, transparent counting, and auditable election state management.

## ⚠️ Educational Disclaimer

**This is an educational prototype and is NOT suitable for governmental/public elections without substantial additional identity verification, privacy mechanisms (e.g., zero-knowledge proofs), accessibility features, coercion-resistance, legal frameworks, operational procedures, professional security audits, and comprehensive testing.**

This project is designed for:
- Learning blockchain development
- Understanding smart contract security
- Demonstrating decentralized application architecture
- Portfolio and interview preparation
- Academic coursework in blockchain technology

## 📋 Table of Contents

- [Overview](#overview)
- [Problem Statement](#problem-statement)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [System Architecture](#system-architecture)
- [Installation](#installation)
- [Usage](#usage)
- [Testing](#testing)
- [Remix Simulation](#remix-simulation)
- [Security & Privacy](#security--privacy)
- [Limitations](#limitations)
- [Future Improvements](#future-improvements)
- [Learning Outcomes](#learning-outcomes)

## 🎯 Overview

This project implements a blockchain-based voting system that leverages Ethereum smart contracts to provide:
- Transparent and tamper-proof vote counting
- One-vote-per-wallet enforcement through blockchain state
- Admin-controlled election lifecycle management
- Real-time result verification
- Immutable audit trail via blockchain events

## 🔍 Problem Statement

Traditional voting systems face challenges including:
- Lack of transparency in vote counting
- Potential for vote tampering or manipulation
- Difficulty in verifying election integrity
- Complex audit processes
- Voter fraud concerns

Blockchain technology offers potential solutions through:
- Immutable record-keeping
- Transparent and verifiable transactions
- Cryptographic security
- Decentralized trust

## ✨ Features

### Smart Contract Features
- **Admin Controls**: Deployer becomes admin with exclusive management rights
- **Candidate Management**: Add candidates with name and party/affiliation
- **Voter Registration**: Register eligible voters before election starts
- **Election Lifecycle**: NOT_STARTED → ACTIVE → ENDED state management
- **Secure Voting**: One vote per registered wallet with validation
- **Result Calculation**: Automatic winner determination with tie handling
- **Event Logging**: Privacy-conscious events for auditability
- **Security Validations**: Comprehensive checks against invalid operations

### Frontend Features
- **MetaMask Integration**: Connect wallet to participate
- **Admin Dashboard**: Manage candidates, voters, and election state
- **Voter Interface**: View candidates and cast votes
- **Real-time Updates**: Live election status and vote counts
- **Responsive Design**: Mobile-friendly interface
- **Status Indicators**: Clear visual feedback on election state

## 🛠️ Technology Stack

### Blockchain
- **Solidity** ^0.8.20 - Smart contract language
- **Hardhat** - Development environment and testing framework
- **Ethers.js** v6 - Ethereum interaction library
- **OpenZeppelin** - Security-audited contract patterns

### Frontend
- **React** 18 - UI framework
- **Vite** - Build tool and dev server
- **Ethers.js** - Web3 provider
- **CSS3** - Responsive styling

### Testing
- **Hardhat Toolbox** - Testing utilities
- **Chai** - Assertion library
- **Ethers** - Contract interaction

## 🏗️ System Architecture

### Actors

1. **Admin**
   - Deployer of the smart contract
   - Can add candidates
   - Can register voters
   - Can start/end election
   - Full election management authority

2. **Registered Voters**
   - Ethereum addresses registered by admin
   - Can vote once during ACTIVE state
   - Can view candidates and results

3. **Public**
   - Anyone can view candidates
   - Anyone can view results after election ends
   - Cannot vote unless registered

### Election Lifecycle

```
NOT_STARTED
    ├─ Admin adds candidates
    ├─ Admin registers voters
    └─ Admin starts election
         ↓
       ACTIVE
    ├─ Registered voters cast votes
    ├─ One vote per wallet enforced
    └─ Admin ends election
         ↓
        ENDED
    ├─ Results visible
    ├─ Winner determined
    └─ No further voting
```

### Smart Contract Functions

#### Admin Functions
- `addCandidate(string name, string party)` - Add a candidate
- `registerVoter(address voter)` - Register single voter
- `registerMultipleVoters(address[] voters)` - Batch register voters
- `startElection()` - Transition to ACTIVE state
- `endElection()` - Transition to ENDED state

#### Voter Functions
- `vote(uint256 candidateId)` - Cast a vote for a candidate

#### View Functions
- `getCandidate(uint256 id)` - Get candidate details
- `getAllCandidates()` - Get all candidates
- `getWinner()` - Get election winner (after election ends)
- `getElectionStatus()` - Get current election state
- `isVoterRegistered(address)` - Check voter registration
- `hasVoterVoted(address)` - Check if voter has voted

## 📦 Installation

### Prerequisites
- Node.js v16 or higher
- npm or yarn
- MetaMask browser extension

### Backend Setup

1. Clone the repository:
```bash
git clone https://github.com/yourusername/Blockchain-Based-Voting-System.git
cd Blockchain-Based-Voting-System
```

2. Install dependencies:
```bash
npm install
```

3. Compile contracts:
```bash
npx hardhat compile
```

4. Run tests:
```bash
npx hardhat test
```

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create .env file:
```bash
cp .env.example .env
```

4. Update contract address in `.env` after deployment

## 🚀 Usage

### 1. Start Local Blockchain

In terminal 1:
```bash
npx hardhat node
```

This starts a local Ethereum blockchain at `http://127.0.0.1:8545`

### 2. Deploy Smart Contract

In terminal 2:
```bash
npx hardhat run scripts/deploy.js --network localhost
```

Copy the deployed contract address and update `frontend/.env`:
```
VITE_CONTRACT_ADDRESS=0x5FbDB2315678afecb367f032d93F642f64180aa3
```

### 3. Start Frontend

In terminal 3:
```bash
cd frontend
npm run dev
```

Frontend runs at `http://localhost:3000`

### 4. Configure MetaMask

1. Add Hardhat network to MetaMask:
   - Network Name: Hardhat Local
   - RPC URL: http://127.0.0.1:8545
   - Chain ID: 31337
   - Currency: ETH

2. Import test accounts from Hardhat output:
   - Account #0: Admin
   - Account #1-3: Voters

### 5. Demo Workflow

1. **Connect Admin Wallet**: Use Account #0
2. **Add Candidates**: Use admin panel to add 2-3 candidates
3. **Register Voters**: Register Accounts #1, #2, #3
4. **Start Election**: Click "Start Election"
5. **Vote**: Switch to voter accounts and cast votes
6. **End Election**: Switch back to admin, click "End Election"
7. **View Results**: Check winner and vote counts

## 🧪 Testing

Run the comprehensive test suite:

```bash
npx hardhat test
```

Test coverage includes:
- Deployment and initialization
- Candidate management (add, validate, reject)
- Voter registration (single, batch, duplicates)
- Election lifecycle (start, end, invalid transitions)
- Voting logic (valid votes, double-voting, unregistered)
- Result calculation (winner, ties, zero votes)
- Event emissions
- Access control
- Security validations

Expected output: **All tests passing**

## 🎮 Remix Simulation

### Step-by-Step Remix IDE Testing

1. **Open Remix**: https://remix.ethereum.org

2. **Create File**: `VotingSystem.sol` and paste contract code

3. **Compile**:
   - Compiler: 0.8.20
   - Click "Compile VotingSystem.sol"

4. **Deploy**:
   - Environment: "Remix VM (Shanghai)"
   - Select Account 1 (Admin)
   - Deploy contract

5. **Test Scenario**:

```javascript
// Use Account 1 (Admin)
addCandidate("Alice Smith", "Independent")
addCandidate("Bob Jones", "Progressive")
addCandidate("Carol White", "Reform")

// Register voters
registerVoter(0x...Account2Address)
registerVoter(0x...Account3Address)
registerVoter(0x...Account4Address)

// Try voting before start (should fail)
// Switch to Account 2
vote(1) // ❌ Should revert: "Invalid election state"

// Switch back to Admin (Account 1)
startElection()

// Switch to Account 2 (Voter)
vote(1) // ✅ Success

// Switch to Account 3 (Voter)
vote(1) // ✅ Success

// Switch to Account 4 (Voter)
vote(2) // ✅ Success

// Switch to Account 2, try double vote
vote(2) // ❌ Should revert: "You have already voted"

// Try with unregistered Account 5
vote(1) // ❌ Should revert: "You are not registered"

// Switch to Admin
endElection()

// Try voting after election ends
// Switch to any voter
vote(1) // ❌ Should revert: "Invalid election state"

// View results
getWinner() // Returns: Alice Smith, 2 votes
getCandidate(1) // Alice: 2 votes
getCandidate(2) // Bob: 1 vote
totalVotes() // 3
```

Full Remix testing guide: [docs/remix-simulation.md](docs/remix-simulation.md)

## 🔒 Security & Privacy

### Security Features
- **Access Control**: Admin-only functions protected by `onlyAdmin` modifier
- **State Validation**: Election state checks prevent invalid operations
- **Double-Vote Prevention**: `hasVoted` mapping enforces one-vote-per-wallet
- **Input Validation**: Zero address checks, empty string validation
- **Reentrancy Safe**: No external calls in state-changing functions
- **Integer Safety**: Solidity 0.8+ built-in overflow protection

### Privacy Limitations

⚠️ **Important**: This system does NOT provide ballot secrecy.

**What is NOT private**:
- Voter registration (addresses are public)
- Participation (VoteRecorded event emits voter address)
- Transaction metadata (all on public blockchain)

**What is somewhat protected**:
- Individual candidate choices (not explicitly logged in events)
- However, vote transactions can be analyzed on blockchain

**Privacy does NOT mean**:
- Anonymous voting (wallet addresses are pseudonymous, not anonymous)
- Coercion resistance (no protection against vote buying or intimidation)
- Complete ballot secrecy

For detailed security analysis: [docs/security-and-privacy.md](docs/security-and-privacy.md)

## ⚠️ Limitations

### Technical Limitations
- No identity verification (any Ethereum address can be registered)
- No Sybil attack protection (admin can create multiple addresses)
- Limited privacy (blockchain transparency exposes participation)
- No receipt-freeness (voters can prove their vote)
- Gas costs for transactions (requires ETH)
- Scalability constraints (blockchain throughput limits)

### Operational Limitations
- Centralized admin (single point of control/failure)
- No voter authentication beyond wallet ownership
- No accessibility features for diverse populations
- No dispute resolution mechanism
- No regulatory compliance

### Security Limitations
- Smart contract bugs (requires professional audit)
- Front-running possibilities
- Admin abuse potential
- Wallet compromise risks
- No recovery mechanism for lost private keys

## 🚀 Future Improvements

### Privacy Enhancements
- **Commit-Reveal Scheme**: Hide votes during election, reveal after
- **Zero-Knowledge Proofs**: Prove vote validity without revealing choice
- **Ring Signatures**: Anonymous voting within registered group
- **Homomorphic Encryption**: Encrypted vote tallying

### Identity & Security
- **Decentralized Identity (DID)**: Blockchain-based identity verification
- **Multi-signature Admin**: Distributed admin control
- **Time-locks**: Automatic election state transitions
- **Quadratic Voting**: Weighted voting mechanisms

### Scalability
- **Layer 2 Solutions**: Rollups for lower gas costs
- **IPFS Integration**: Off-chain data storage
- **Batch Processing**: Optimized voter registration

### Features
- **Multiple Elections**: Support concurrent elections
- **Delegate Voting**: Proxy voting capabilities
- **Ranked Choice**: Alternative voting methods
- **Mobile App**: Native mobile interface

## 📚 Learning Outcomes

### Blockchain Concepts
✅ Smart contract development in Solidity  
✅ State management and lifecycle patterns  
✅ Event emission and logging  
✅ Access control and security modifiers  
✅ Testing with Hardhat and Chai  

### Web3 Development
✅ MetaMask integration  
✅ Ethers.js library usage  
✅ Contract ABI interaction  
✅ Transaction handling  
✅ Network configuration  

### System Design
✅ State machine implementation  
✅ Role-based access control  
✅ Data validation and error handling  
✅ User interface design  
✅ Security considerations  

### Professional Skills
✅ Git version control  
✅ Project documentation  
✅ Testing methodologies  
✅ Deployment procedures  
✅ Code organization  

## 📖 Additional Documentation

- [Interview Preparation](docs/interview-preparation.md) - Common questions and answers
- [Security & Privacy Analysis](docs/security-and-privacy.md) - Detailed security discussion
- [Development History](docs/development-history.md) - Project timeline and commits
- [Demo Checklist](docs/demo-checklist.md) - Screenshot and proof guide
- [Requirements Traceability](docs/requirements-traceability.md) - Feature completion matrix
- [Remix Simulation Guide](docs/remix-simulation.md) - Detailed Remix testing

## 📝 License

MIT License - See LICENSE file for details

## 👤 Author

Prarthana Panikar
- LinkedIn: www.linkedin.com/in/prarthana-panikar-930983370


## 🙏 Acknowledgments

- OpenZeppelin for secure contract patterns
- Hardhat team for excellent development tools
- Ethereum community for blockchain innovation
- Course instructors and peers

## 📞 Contact

For questions or collaboration:
- Email: prarthanapanikar@gmail.com
---

**Built with ❤️ for learning and education**
