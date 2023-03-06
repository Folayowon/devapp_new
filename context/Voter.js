import React, { useState, useEffect } from "react";
import Web3Modal from "web3modal";
import { ethers } from "ethers";
import { create as ipfsHttpClient } from "ipfs-http-client";
import axios from "axios";
import { useRouter } from "next/router";

//INTERNAL IMPORT
import { VotingAddress, VotingAddressABI } from "./constants";

const projectId = "2Kdq3ptwRNMhda7ZECqgVSl3yBe";
const projectSecretKey = "612c7614ea7760dfd3a4470623b353ef";
const auth = `Basic ${Buffer.from(`${projectId}:${projectSecretKey}`).toString(
  "base64"
)}`;

const subdomain = "https://devapp.infura-ipfs.io";

const client = ipfsHttpClient({
  host: "infura-ipfs.io",
  port: 5001,
  protocol: "https",
  headers: {
    authorization: auth,
  },
});

const fetchContract = (signerOrProvider) =>
  new ethers.Contract(VotingAddress, VotingAddressABI, signerOrProvider);

export const VotingContext = React.createContext();

export const VotingProvider = ({ children }) => {
  const router = useRouter();
  const [currentAccount, setCurrentAccount] = useState("");
  const [candidateLength, setCandidateLength] = useState("");
  const pushCandidate = [];
  const candidateIndex = [];
  const [candidateArray, setCandidateArray] = useState(pushCandidate);
  // =========================================================


  //---Error Message---
  const [error, setError] = useState("");
  const higestVote = [];

  const pushVoter = [];
  const [voterArray, setVoterArray] = useState(pushVoter);
  const [voterLength, setVoterLength] = useState("");
  const [voterAddress, setVoterAddress] = useState([]);    
  const [timerValue, setTimerValue] = useState()
  // const timing = async () =>{
  //   const timingValue = await timer()
  //   setTimerValue(timingValue);
  // }
  //   useEffect(() =>{
  //   timing()
  //   })

  


  ///Connecting MetaMask---
  const checkIfWalletIsConnected = async () => {
    if (!window.ethereum) return setError("Please, install MetaMask.");

      const accounts = await window.ethereum.request({ method: "eth_accounts" });

    if (accounts.length > 0) {
      setCurrentAccount(accounts[0]);
      //getAllVoterData();
      //getNewCandidate();
    } else {
      setError("Please, connect your wallet.");

      // Listen for accountsChanged event to handle user rejection.
      window.ethereum.on("accountsChanged", (accounts) =>{
        if (accounts.length > 0) {
          setCurrentAccount(accounts[0]);
          setError(false);
        }
      });
    }
  };

  // ===========================================================
  //CONNECT WALLET FUNCTION
  const connectWallet = async () => {
    if (!window.ethereum) return alert("Please, install MetaMask");

    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });

    setCurrentAccount(accounts[0]);
    getAllVoterData();
    getNewCandidate();
  };
  // ================================================


  const fetchAuthorizerAddress = async() =>{
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();
    const contract = fetchContract(signer);
    return await contract.authorizer()
    // console.log(await contract.authorizer())
     
  } 


  //UPLOAD TO IPFS Voter
  const uploadToIPFS = async (file) => {
    try {
      const added = await client.add({ content: file });

      const url = `${subdomain}/ipfs/${added.path}`;
      //const url = `https://ipfs.infura.io/ipfs/${added.path}`;

      // setImage(url);
      return url;
    } catch (error) {
      console.log("Encountered an error while uploading file to IPFS.");
    }
  };

  //UPLOAD Candidate to infura-IPFS 
  const uploadToIPFSCandidate = async (file) => {
    try {
      const added = await client.add({ content: file });

      //const url = `https://ipfs.infura.io/ipfs/${added.path}`;
      const url = `${subdomain}/ipfs/${added.path}`;
      console.log(url);
      return url;
    } catch (error) {
      console.log("Encountered an error while uploading file to IPFS.");
    }
  };
  // =============================================
  //Function to Create Voter
  const createVoter = async (formInput, fileUrl) => {
    const { name, address, position } = formInput;

    if (!name || !address || !position)
      return console.log("Please, check your input. Something is missing!");

    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();
    const contract = fetchContract(signer);

    const data = JSON.stringify({ name, address, position, image: fileUrl });
    const added = await client.add(data);

    const url = `${subdomain}/ipfs/${added.path}`; //`${subdomain}/ipfs/${added.path}` `https://ipfs.infura.io/ipfs/${added.path}`;

    const voter = await contract.createVoters(address, name, url, fileUrl);
    voter.wait();

    router.push("/ListOfVoters");
  };
  // =============================================

  const getAllVoterData = async () => {
    try {
      const web3Modal = new Web3Modal();
      const connection = await web3Modal.connect();
      const provider = new ethers.providers.Web3Provider(connection);
      const signer = provider.getSigner();
      const contract = fetchContract(signer);
      console.log(contract)
      //VOTER LIST
      const voterListData = await contract.get_voter_list();
      console.log(voterListData)
      setVoterAddress(voterListData);
      
      voterListData.map(async (el) => {
        
        const singleVoterData = await contract.getVoterDetails(el);
        
        pushVoter.push(singleVoterData);
      });

      //VOTER LENGTH
      const voterList = await contract.getVoterLength();
      setVoterLength(voterList.toNumber());
      console.log(voterLength);
    } catch (error) {
      console.log("All data");
    }
  };

  // =============================================

  // =============================================
//START ELECTION
const startElection = async (value) => {
  try {
   
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();
    const contract = fetchContract(signer);

    const electionStatus = await contract.commenceElection(value);

    console.log(electionStatus);
  } catch (error) {
    console.log(error.message)
    // setError("Ops! You can't vote twice. Reload Browser");
  }
};

const endElection = async () => {

  try {
   
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();
    const contract = fetchContract(signer);

    const electionStatus = await contract.electionEnds();
    console.log(electionStatus);
  } catch (error) {
    console.log(error)
    // setError("Ops! You can't vote twice. Reload Browser");
  }
}

const timer = async () => {
  try {
    // const voterAddress = id.address;
    // const voterId = id.id;
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();
    const contract = fetchContract(signer);

    const timerStatus = await contract.getTimeLeft();
    console.log(timerStatus);
    return timerStatus;
  } catch (error) {
    console.log(error.message)
    // setError("Ops! You can't vote twice. Reload Browser");
  }
}

  ////////GIVE VOTE
  const giveVote = async (id) => {
    try {
      const voterAddress = id.address;
      const voterId = id.id;
      const web3Modal = new Web3Modal();
      const connection = await web3Modal.connect();
      const provider = new ethers.providers.Web3Provider(connection);
      const signer = provider.getSigner();
      const contract = fetchContract(signer);

      const voteredList = await contract.vote(voterAddress, voterId);
      console.log(voteredList);
    } catch (error) {
      setError("Ops! You can't vote twice. Reload Browser");
    }
  };
  // =============================================

  const setCandidate = async (candidateForm, fileUrl, router) => {
    const { name, address, age } = candidateForm;

    if (!name || !address || !age) return console.log("Input Data is missing");

    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();
    const contract = fetchContract(signer);

    const data = JSON.stringify({
      name,
      address,
      image: fileUrl,
      age,
    });
    const added = await client.add(data);
    console.log ("added ...", added)
    const ipfs = `${subdomain}/ipfs/${added.path}`; // `${subdomain}/ipfs/${added.path}``https://ipfs.infura.io/ipfs/${added.path}`;

    const candidate = await contract.createCandidate(
      address,
      age,
      name,
      fileUrl,
      ipfs
    );
    candidate.wait();

    router.push("/");
  };

  const getNewCandidate = async () => {
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();
    const contract = fetchContract(signer);
    console.log(contract);

    //---------ALL CANDIDATE
    const allCandidate = await contract.getCandidateAddress();
    console.log(contract.getCandidateAddress);
    


    //--------CANDIDATE DATA
    allCandidate.map(async (el) => {
      const singleCandidateData = await contract.getCandidateData(el);

      pushCandidate.push(singleCandidateData);
      candidateIndex.push(singleCandidateData[2].toNumber());
    });

    //---------CANDIDATE LENGTH
    const allCandidateLength = await contract.getCandidateAddressesLength();
    setCandidateLength(allCandidateLength.toNumber());
  };

  console.log(error);

  return (
    <VotingContext.Provider
      value={{
        currentAccount,
        connectWallet,
        fetchAuthorizerAddress,
        uploadToIPFS,
        timer,
        endElection,
        startElection,
        createVoter,
        setCandidate,
        getNewCandidate,
        giveVote,
        pushCandidate,
        candidateArray,
        uploadToIPFSCandidate,
        getAllVoterData,
        voterArray,
        giveVote,
        checkIfWalletIsConnected,
        error,
        candidateLength,
        voterLength,
      }}
    >
      {children}
    </VotingContext.Provider>
  );
};
