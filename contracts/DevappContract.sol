// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/utils/Counters.sol"; // import Counters library from OpenZeppelin
import "hardhat/console.sol"; // import console library from Hardhat

contract Devapp {
    using Counters for Counters.Counter; // use Counters library to implement counters

    // State Variables
    Counters.Counter private _voterId; // counter to keep track of the number of voters
    Counters.Counter private _candidateId; // counter to keep track of the number of candidates
    address public authorizer; // public variable to store the contract authorizer's address
    address[] public candidateAddresses; // public array to store the addresses of all candidates
    address[] public voterAddresses; // public arrayn to store the addresses of all voters
    uint256 public totalVotes;
    uint256 public constant ELECTION_DURATION = 30 minutes;
    uint256 public startTime;
    bool public ended;
    bool public started;
    enum ElectionState { NotStarted, Started, Ended }
    ElectionState public state = ElectionState.NotStarted;

    event Action(uint256 timestamp);
    // Structs
    struct Candidate {
        uint256 id; // unique identifier for candidate
        string age; // age of candidate
        string name; // name of candidate
        string image; // IPFS hash of candidate's image
        uint256 voteCount; // number of votes received by the candidate
        address addr; // address of the candidate
        string ipfs; // IPFS hash of candidate's information
    }

    struct Voter {
        uint256 id; // unique identifier for voter
        string name; // name of voter
        string image; // IPFS hash of voter's image
        address addr; // address of the voter
        uint256 voteCredits; // number of votes the voter can cast
        bool voted; // flag to indicate whether the voter has cast their votes or not
        uint256 voteIndex; // index of the candidate voted for by the voter
        // uint voterIndexConverted; // converts the initialized the signed index of a newly registered voter to an unsigned index to avoid compilation error while assigning it to the argument   
        string ipfs; // IPFS hash of voter's information
    }

    // Mappings
    mapping(address => Candidate) public candidates; // mapping to store candidate information based on their address
    mapping(address => Voter) public voters; // mapping to store voter information based on their address
    mapping(address => bool) public hasVoted; // mapping to keep track of whether a voter has voted or not

    // Events
    event CandidateCreated(
        uint256 indexed id,
        string age,
        string name,
        string image,
        uint256 voteCount,
        address addr,
        string ipfs
    ); // event triggered when a candidate is created

    event VoterCreated(
        uint256 indexed id,
        string name,
        string image,
        address addr,
        uint256 voteCredits,
        bool voted,
        uint256 voteIndex,
        string ipfs
    ); // event triggered when a voter is created

    // Modifiers
    modifier onlyAuthorizer() {
        require(msg.sender == authorizer, "Only the contract authorizer can call this function."); // restrict function access to only the authorizer
        require(state == ElectionState.NotStarted, "Election has already started."); //restrict function accessible only if the election has not yet started
        require(state != ElectionState.Ended, "Election has already ended" );// restrict function accessible only if the election has not yet started and ended.
        _; // execute the function
    }

  
    // Constructor
    constructor() {
        authorizer = msg.sender; // set the contract authorizer's address as the sender of the constructor transaction
        state = ElectionState.NotStarted;
        
    }

    // Candidate Functions
    function createCandidate(
        address _addr,
        string memory _name,
        string memory _age,
        string memory _image,
        string memory _ipfs
    ) public onlyAuthorizer{
        _candidateId.increment(); // increment the candidate counter
        uint256 id_number = _candidateId.current(); // get the current value of the candidate counter

        Candidate storage candidate = candidates[_addr]; // create a reference to the candidate with the given address
        candidate.id = id_number; // set the candidate's id
        candidate.name = _name;
        candidate.age = _age;
        candidate.image = _image;
        candidate.voteCount = 0;
        candidate.addr = _addr;
        candidate.ipfs = _ipfs;

        candidateAddresses.push(_addr);

        emit CandidateCreated(
            candidate.id,
            _name,
            _age,
            _image,
            candidate.voteCount,
            candidate.addr,
            candidate.ipfs
            
        );
        
    }

    function getCandidateAddress() public view returns(address[] memory) {
        return candidateAddresses;
    }

    function getCandidateAddressesLength() public view returns (uint256) {
        return candidateAddresses.length;
    }

    function getCandidateData(address _address)
        public
        view
        returns (
            string memory,
            string memory,
            uint256,
            string memory,
            uint256,
            string memory,
            address
        )
    {
        Candidate memory candidate = candidates[_address];
        return (
            candidate.age,
            candidate.name,
            candidate.id,
            candidate.image,
            candidate.voteCount,
            candidate.ipfs,
            candidate.addr
        );
    }

        // Voters Functions
    function createVoters(
        address _addr,
        string memory _name,
        string memory _image,
        string memory _ipfs
    ) public onlyAuthorizer{
        _voterId.increment();
        uint256 id = _voterId.current();
        Voter storage voter = voters[_addr];
        require(voter.voteCredits == 0, "This account already exists");
        voter.voteCredits = 1;
        voter.name = _name;
        voter.image = _image;
        voter.addr = _addr;
        voter.id = id;
        voter.voteIndex = 1000000000;
        voter.voted = false;
        voter.ipfs = _ipfs;
        voterAddresses.push(_addr);
        
    emit VoterCreated(
        voter.id,
        _name,
        _image,
        _addr,
        voter.voteCredits,
        voter.voted,
        voter.voteIndex, 
        voter.ipfs
    );

    }

    function voteBooth(address _candidateAddr, uint256 _candidateUniqueId) external onlyAuthorizer{
        Voter storage voter = voters[msg.sender];
        require(!voter.voted, "You can't vote twice." );
        require(voter.voteCredits != 0, "Your account isn't registered or authorized." );
        
        voter.voted = true;
        voter.voteIndex = _candidateUniqueId;
        voterAddresses.push(msg.sender);
        candidates[_candidateAddr].voteCount += voter.voteCredits;

        }

     function getVoterDetails(address _addr) public view returns (
         uint256,
         string memory,
         string memory,
         address,
         string memory,
         uint256,
         bool
     ){
         return(
             voters[_addr].id,
             voters[_addr].name,
             voters[_addr].image,
             voters[_addr].addr,
             voters[_addr].ipfs,
             voters[_addr].voteCredits,
             voters[_addr].voted


         );
     }

    function getVotersLength() public view returns (uint256) {
        return voterAddresses.length;
    }
    function get_voter_list() public view returns (address[] memory){
        return voterAddresses;
    }

    function commenceElection(bool) public onlyAuthorizer{
        
        startTime = block.timestamp;
        state = ElectionState.Started;
    }
     
    // function getTimeLeft() public returns (uint256) {
    //     require (state != ElectionState.NotStarted, "Election has not yet started.");
    //     require (state == ElectionState.Started, "Election has ended.");
    //     uint256 timeSpent = block.timestamp - startTime;
    //     uint256 timeLeft = ELECTION_DURATION - timeSpent;
    //     emit Action(timeLeft);
    //     return timeLeft;
        
    // }

    function electionEnds() public {
        require (state == ElectionState.Started);
        uint256 elapsedTime = block.timestamp - startTime;
        require(elapsedTime <= ELECTION_DURATION);
        state = ElectionState.Ended; 
        state = ElectionState.NotStarted;  
    }
       
    }

        