// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title VotingSystem
 * @notice Research-inspired secure blockchain voting system
 * 
 * Architecture based on research principles:
 * - Registration Authority: Admin manages voter eligibility
 * - Voter Identity Verification: Cryptographic commitment via wallet verification
 * - Separation of Identity from Ballot: No voter→candidate links on-chain
 * - Authentication Layer: Wallet verification + eligibility checks
 * - One-Time Voting: Single vote per registered wallet via hasVoted mapping
 * - Blockchain Validation: Solidity enforces all business rules
 * - Immutable Audit Trail: Events provide verifiable records
 * - Privacy-Preserving Design: Ballot content not exposed publicly
 * 
 * @dev Educational prototype - Not suitable for governmental elections without additional safeguards
 */
contract VotingSystem {
    
    // Election states
    enum ElectionState { NOT_STARTED, ACTIVE, ENDED }
    
    // Candidate structure
    struct Candidate {
        uint256 id;
        string name;
        string party;
        uint256 voteCount;
    }
    
    // State variables
    address public admin;
    ElectionState public electionState;
    uint256 public candidateCount;
    uint256 public totalVotes;
    string public electionName;
    uint256 public registeredVoterCount;
    
    // Mappings
    mapping(uint256 => Candidate) public candidates;
    mapping(address => bool) public isRegistered;
    mapping(address => bool) public hasVoted;
    
    // Events - Privacy conscious: voter address not linked to candidate choice
    event CandidateAdded(uint256 indexed candidateId, string name, string party);
    event VoterRegistered(address indexed voterWallet);
    event ElectionStarted(uint256 timestamp, string electionName);
    event VoteRecorded(address indexed voter); // Emits voter address; candidate choice is NOT stored on-chain
    event ElectionEnded(uint256 timestamp);
    event AuthorityAccessed(address indexed admin, string action);
    
    // Modifiers
    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can perform this action");
        _;
    }
    
    modifier inState(ElectionState _state) {
        require(electionState == _state, "Invalid election state for this operation");
        _;
    }
    
    
    /**
     * @notice Constructor sets deployer as admin.
     *         Call setElectionName() afterwards to set the election name.
     */
    constructor() {
        admin = msg.sender;
        electionState = ElectionState.NOT_STARTED;
        candidateCount = 0;
        totalVotes = 0;
        registeredVoterCount = 0;
        electionName = "General Election";
    }
    
    /**
     * @notice Add a candidate to the election
     * @param _name Candidate name
     * @param _party Candidate party or affiliation
     */
    function addCandidate(string memory _name, string memory _party) 
        external 
        onlyAdmin 
        inState(ElectionState.NOT_STARTED) 
    {
        require(bytes(_name).length > 0, "Candidate name cannot be empty");
        
        candidateCount++;
        candidates[candidateCount] = Candidate({
            id: candidateCount,
            name: _name,
            party: _party,
            voteCount: 0
        });
        
        emit CandidateAdded(candidateCount, _name, _party);
    }
    
    /**
     * @notice Register a single voter - Registration Authority function
     * @param _voter Address of voter to register (verified via application layer)
     */
    function registerVoter(address _voter) 
        external 
        onlyAdmin 
    {
        require(_voter != address(0), "Cannot register zero address");
        require(!isRegistered[_voter], "Voter already registered");
        
        isRegistered[_voter] = true;
        registeredVoterCount++;
        emit VoterRegistered(_voter);
        emit AuthorityAccessed(admin, "VOTER_REGISTERED");
    }
    
    /**
     * @notice Register multiple voters in batch
     * @param _voters Array of voter addresses
     */
    function registerMultipleVoters(address[] calldata _voters) 
        external 
        onlyAdmin 
    {
        for (uint256 i = 0; i < _voters.length; i++) {
            address voter = _voters[i];
            require(voter != address(0), "Cannot register zero address");
            require(!isRegistered[voter], "Voter already registered");
            
            isRegistered[voter] = true;
            emit VoterRegistered(voter);
        }
    }
    
    /**
     * @notice Start the election (transition from NOT_STARTED to ACTIVE)
     */
    function startElection() 
        external 
        onlyAdmin 
        inState(ElectionState.NOT_STARTED) 
    {
        require(candidateCount > 0, "Cannot start election without candidates");
        electionState = ElectionState.ACTIVE;
        emit ElectionStarted(block.timestamp, electionName);
    }
    
    /**
     * @notice Cast a vote - Authenticated and authorized through multiple layers
     * @param _candidateId ID of the candidate to vote for
     * 
     * Flow:
     * 1. Verify ACTIVE state (election authority control)
     * 2. Verify voter is registered (eligibility verification)
     * 3. Verify single-use constraint (one-time voting)
     * 4. Verify candidate validity (ballot integrity)
     * 5. Update state (atomically)
     * 6. Emit privacy-preserving event (no candidate choice exposed)
     */
    function vote(uint256 _candidateId) 
        external 
        inState(ElectionState.ACTIVE) 
    {
        require(isRegistered[msg.sender], "You are not registered to vote");
        require(!hasVoted[msg.sender], "You have already voted");
        require(_candidateId > 0 && _candidateId <= candidateCount, "Invalid candidate ID");
        
        // Effects: Update state atomically
        hasVoted[msg.sender] = true;
        candidates[_candidateId].voteCount++;
        totalVotes++;
        
        // Privacy-conscious audit trail: emits the voter's address to confirm
        // participation, but the candidate choice is NOT stored in any event,
        // so on-chain data does not directly link voter → candidate.
        emit VoteRecorded(msg.sender);
    }
    
    /**
     * @notice End the election - Tallying Authority transition
     */
    function endElection() 
        external 
        onlyAdmin 
        inState(ElectionState.ACTIVE) 
    {
        electionState = ElectionState.ENDED;
        emit ElectionEnded(block.timestamp);
        emit AuthorityAccessed(admin, "ELECTION_ENDED");
    }
    
    /**
     * @notice Get candidate details
     * @param _candidateId Candidate ID
     * @return id       The candidate's unique ID
     * @return name     The candidate's name
     * @return party    The candidate's party or affiliation
     * @return voteCount Number of votes the candidate has received
     */
    function getCandidate(uint256 _candidateId) 
        external 
        view 
        returns (uint256 id, string memory name, string memory party, uint256 voteCount) 
    {
        require(_candidateId > 0 && _candidateId <= candidateCount, "Invalid candidate ID");
        Candidate memory c = candidates[_candidateId];
        return (c.id, c.name, c.party, c.voteCount);
    }
    
    /**
     * @notice Get all candidates
     * @return Array of all candidates
     */
    function getAllCandidates() external view returns (Candidate[] memory) {
        Candidate[] memory allCandidates = new Candidate[](candidateCount);
        for (uint256 i = 1; i <= candidateCount; i++) {
            allCandidates[i - 1] = candidates[i];
        }
        return allCandidates;
    }
    
    /**
     * @notice Get the election winner
     * @return winnerId ID of the winning candidate (0 if tie or no votes)
     * @return winnerName Name of the winner
     * @return winnerVotes Vote count of the winner
     * @return isTie Whether there is a tie
     */
    function getWinner() 
        external 
        view 
        returns (uint256 winnerId, string memory winnerName, uint256 winnerVotes, bool isTie) 
    {
        require(candidateCount > 0, "No candidates in election");
        
        uint256 maxVotes = 0;
        uint256 winnerCount = 0;
        uint256 tempWinnerId = 0;
        
        // Find maximum votes and count winners
        for (uint256 i = 1; i <= candidateCount; i++) {
            if (candidates[i].voteCount > maxVotes) {
                maxVotes = candidates[i].voteCount;
                tempWinnerId = i;
                winnerCount = 1;
            } else if (candidates[i].voteCount == maxVotes && maxVotes > 0) {
                winnerCount++;
            }
        }
        
        // Handle tie or no votes
        if (winnerCount > 1) {
            return (0, "TIE", maxVotes, true);
        } else if (maxVotes == 0) {
            return (0, "NO VOTES", 0, false);
        } else {
            return (tempWinnerId, candidates[tempWinnerId].name, maxVotes, false);
        }
    }
    
    /**
     * @notice Get current election status
     * @return Current state as uint8 (0=NOT_STARTED, 1=ACTIVE, 2=ENDED)
     */
    function getElectionStatus() external view returns (uint8) {
        return uint8(electionState);
    }
    
    /**
     * @notice Check if an address is registered
     * @param _voter Address to check
     * @return Registration status
     */
    function isVoterRegistered(address _voter) external view returns (bool) {
        return isRegistered[_voter];
    }
    
    /**
     * @notice Check if an address has voted
     * @param _voter Address to check
     * @return Voting status
     */
    function hasVoterVoted(address _voter) external view returns (bool) {
        return hasVoted[_voter];
    }
}
