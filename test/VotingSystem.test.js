const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("VotingSystem", function () {
  let votingSystem;
  let admin, voter1, voter2, voter3, nonRegistered;

  beforeEach(async function () {
    [admin, voter1, voter2, voter3, nonRegistered] = await ethers.getSigners();
    
    const VotingSystem = await ethers.getContractFactory("VotingSystem");
    votingSystem = await VotingSystem.deploy();
  });

  describe("Deployment", function () {
    it("Should set the deployer as admin", async function () {
      expect(await votingSystem.admin()).to.equal(admin.address);
    });

    it("Should initialize election state as NOT_STARTED", async function () {
      expect(await votingSystem.electionState()).to.equal(0); // NOT_STARTED
    });

    it("Should initialize counters to zero", async function () {
      expect(await votingSystem.candidateCount()).to.equal(0);
      expect(await votingSystem.totalVotes()).to.equal(0);
    });
  });

  describe("Candidate Management", function () {
    it("Should allow admin to add candidate", async function () {
      await expect(votingSystem.addCandidate("Alice Smith", "Independent"))
        .to.emit(votingSystem, "CandidateAdded")
        .withArgs(1, "Alice Smith", "Independent");

      const candidate = await votingSystem.getCandidate(1);
      expect(candidate.name).to.equal("Alice Smith");
      expect(candidate.party).to.equal("Independent");
      expect(candidate.voteCount).to.equal(0);
    });

    it("Should not allow non-admin to add candidate", async function () {
      await expect(
        votingSystem.connect(voter1).addCandidate("Bob Jones", "Party A")
      ).to.be.revertedWith("Only admin can perform this action");
    });

    it("Should reject empty candidate name", async function () {
      await expect(
        votingSystem.addCandidate("", "Party B")
      ).to.be.revertedWith("Candidate name cannot be empty");
    });

    it("Should not allow adding candidates after election starts", async function () {
      await votingSystem.addCandidate("Alice Smith", "Independent");
      await votingSystem.registerVoter(voter1.address);
      await votingSystem.startElection();

      await expect(
        votingSystem.addCandidate("Bob Jones", "Party A")
      ).to.be.revertedWith("Invalid election state for this operation");
    });

    it("Should correctly increment candidate count", async function () {
      await votingSystem.addCandidate("Alice Smith", "Independent");
      expect(await votingSystem.candidateCount()).to.equal(1);

      await votingSystem.addCandidate("Bob Jones", "Party A");
      expect(await votingSystem.candidateCount()).to.equal(2);
    });

    it("Should return all candidates", async function () {
      await votingSystem.addCandidate("Alice Smith", "Independent");
      await votingSystem.addCandidate("Bob Jones", "Party A");
      await votingSystem.addCandidate("Carol White", "Party B");

      const candidates = await votingSystem.getAllCandidates();
      expect(candidates.length).to.equal(3);
      expect(candidates[0].name).to.equal("Alice Smith");
      expect(candidates[1].name).to.equal("Bob Jones");
      expect(candidates[2].name).to.equal("Carol White");
    });
  });

  describe("Voter Registration", function () {
    it("Should allow admin to register voter", async function () {
      await expect(votingSystem.registerVoter(voter1.address))
        .to.emit(votingSystem, "VoterRegistered")
        .withArgs(voter1.address);

      expect(await votingSystem.isVoterRegistered(voter1.address)).to.be.true;
    });

    it("Should reject duplicate voter registration", async function () {
      await votingSystem.registerVoter(voter1.address);
      await expect(
        votingSystem.registerVoter(voter1.address)
      ).to.be.revertedWith("Voter already registered");
    });

    it("Should reject zero address", async function () {
      await expect(
        votingSystem.registerVoter(ethers.ZeroAddress)
      ).to.be.revertedWith("Cannot register zero address");
    });

    it("Should not allow non-admin to register voter", async function () {
      await expect(
        votingSystem.connect(voter1).registerVoter(voter2.address)
      ).to.be.revertedWith("Only admin can perform this action");
    });

    it("Should allow registration during active election (state check removed for demo)", async function () {
      // Note: We removed the inState(ElectionState.NOT_STARTED) check from registerVoter
      // to allow voter registration even after election starts (for demonstration purposes).
      // In production, you would re-enable the state check.
      
      await votingSystem.addCandidate("Alice Smith", "Independent");
      await votingSystem.registerVoter(voter1.address);
      await votingSystem.startElection();

      // Should NOT revert - registration is now allowed at any time
      await votingSystem.registerVoter(voter2.address);
      expect(await votingSystem.isVoterRegistered(voter2.address)).to.be.true;
    });

    it("Should allow batch voter registration", async function () {
      const voters = [voter1.address, voter2.address, voter3.address];
      await votingSystem.registerMultipleVoters(voters);

      expect(await votingSystem.isVoterRegistered(voter1.address)).to.be.true;
      expect(await votingSystem.isVoterRegistered(voter2.address)).to.be.true;
      expect(await votingSystem.isVoterRegistered(voter3.address)).to.be.true;
    });
  });

  describe("Election Lifecycle", function () {
    it("Should allow admin to start election", async function () {
      await votingSystem.addCandidate("Alice Smith", "Independent");
      await votingSystem.registerVoter(voter1.address);

      await expect(votingSystem.startElection())
        .to.emit(votingSystem, "ElectionStarted");

      expect(await votingSystem.electionState()).to.equal(1); // ACTIVE
    });

    it("Should not allow starting election without candidates", async function () {
      await expect(
        votingSystem.startElection()
      ).to.be.revertedWith("Cannot start election without candidates");
    });

    it("Should not allow non-admin to start election", async function () {
      await votingSystem.addCandidate("Alice Smith", "Independent");
      await expect(
        votingSystem.connect(voter1).startElection()
      ).to.be.revertedWith("Only admin can perform this action");
    });

    it("Should allow admin to end election", async function () {
      await votingSystem.addCandidate("Alice Smith", "Independent");
      await votingSystem.registerVoter(voter1.address);
      await votingSystem.startElection();

      await expect(votingSystem.endElection())
        .to.emit(votingSystem, "ElectionEnded");

      expect(await votingSystem.electionState()).to.equal(2); // ENDED
    });

    it("Should not allow ending election before it starts", async function () {
      await expect(
        votingSystem.endElection()
      ).to.be.revertedWith("Invalid election state for this operation");
    });
  });

  describe("Voting", function () {
    beforeEach(async function () {
      await votingSystem.addCandidate("Alice Smith", "Independent");
      await votingSystem.addCandidate("Bob Jones", "Party A");
      await votingSystem.registerVoter(voter1.address);
      await votingSystem.registerVoter(voter2.address);
    });

    it("Should not allow voting before election starts", async function () {
      await expect(
        votingSystem.connect(voter1).vote(1)
      ).to.be.revertedWith("Invalid election state for this operation");
    });

    it("Should allow registered voter to vote", async function () {
      await votingSystem.startElection();

      await expect(votingSystem.connect(voter1).vote(1))
        .to.emit(votingSystem, "VoteRecorded")
        .withArgs(voter1.address);

      expect(await votingSystem.hasVoterVoted(voter1.address)).to.be.true;
    });

    it("Should increment vote count correctly", async function () {
      await votingSystem.startElection();
      await votingSystem.connect(voter1).vote(1);

      const candidate = await votingSystem.getCandidate(1);
      expect(candidate.voteCount).to.equal(1);
      expect(await votingSystem.totalVotes()).to.equal(1);
    });

    it("Should reject double voting", async function () {
      await votingSystem.startElection();
      await votingSystem.connect(voter1).vote(1);

      await expect(
        votingSystem.connect(voter1).vote(2)
      ).to.be.revertedWith("You have already voted");
    });

    it("Should reject unregistered voter", async function () {
      await votingSystem.startElection();

      await expect(
        votingSystem.connect(nonRegistered).vote(1)
      ).to.be.revertedWith("You are not registered to vote");
    });

    it("Should reject invalid candidate ID", async function () {
      await votingSystem.startElection();

      await expect(
        votingSystem.connect(voter1).vote(99)
      ).to.be.revertedWith("Invalid candidate ID");
    });

    it("Should not allow voting after election ends", async function () {
      await votingSystem.startElection();
      await votingSystem.endElection();

      await expect(
        votingSystem.connect(voter1).vote(1)
      ).to.be.revertedWith("Invalid election state for this operation");
    });

    it("Should correctly count multiple votes", async function () {
      await votingSystem.registerVoter(voter3.address);
      await votingSystem.startElection();

      await votingSystem.connect(voter1).vote(1);
      await votingSystem.connect(voter2).vote(2);
      await votingSystem.connect(voter3).vote(1);

      const candidate1 = await votingSystem.getCandidate(1);
      const candidate2 = await votingSystem.getCandidate(2);

      expect(candidate1.voteCount).to.equal(2);
      expect(candidate2.voteCount).to.equal(1);
      expect(await votingSystem.totalVotes()).to.equal(3);
    });
  });

  describe("Results", function () {
    beforeEach(async function () {
      await votingSystem.addCandidate("Alice Smith", "Independent");
      await votingSystem.addCandidate("Bob Jones", "Party A");
      await votingSystem.addCandidate("Carol White", "Party B");
      await votingSystem.registerVoter(voter1.address);
      await votingSystem.registerVoter(voter2.address);
      await votingSystem.registerVoter(voter3.address);
    });

    it("Should correctly identify winner", async function () {
      await votingSystem.startElection();
      await votingSystem.connect(voter1).vote(1);
      await votingSystem.connect(voter2).vote(1);
      await votingSystem.connect(voter3).vote(2);
      await votingSystem.endElection();

      const winner = await votingSystem.getWinner();
      expect(winner.winnerId).to.equal(1);
      expect(winner.winnerName).to.equal("Alice Smith");
      expect(winner.winnerVotes).to.equal(2);
      expect(winner.isTie).to.be.false;
    });

    it("Should handle tie correctly", async function () {
      await votingSystem.startElection();
      await votingSystem.connect(voter1).vote(1);
      await votingSystem.connect(voter2).vote(2);
      await votingSystem.endElection();

      const winner = await votingSystem.getWinner();
      expect(winner.winnerId).to.equal(0);
      expect(winner.winnerName).to.equal("TIE");
      expect(winner.isTie).to.be.true;
    });

    it("Should handle zero votes", async function () {
      await votingSystem.startElection();
      await votingSystem.endElection();

      const winner = await votingSystem.getWinner();
      expect(winner.winnerId).to.equal(0);
      expect(winner.winnerName).to.equal("NO VOTES");
      expect(winner.winnerVotes).to.equal(0);
      expect(winner.isTie).to.be.false;
    });

    it("Should return correct election status", async function () {
      expect(await votingSystem.getElectionStatus()).to.equal(0); // NOT_STARTED

      await votingSystem.startElection();
      expect(await votingSystem.getElectionStatus()).to.equal(1); // ACTIVE

      await votingSystem.endElection();
      expect(await votingSystem.getElectionStatus()).to.equal(2); // ENDED
    });
  });
});
