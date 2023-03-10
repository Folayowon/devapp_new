// This file contains the implementation of a React context provider for a voting app.
// It also includes functions to interact with the Ethereum blockchain, upload files to IPFS, and connect with MetaMask.

import React, { useState, useEffect } from "react";
import Web3Modal from "web3modal";
import { ethers } from "ethers";
import { create as ipfsHttpClient } from "ipfs-http-client";
import axios from "axios";
import { useRouter } from "next/router";

//INTERNAL IMPORT
import { VotingAddress, VotingAddressABI } from "./constants";


// IPFS credentials
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


// Fetches the contract using ethers.js
const fetchContract = (signerOrProvider) =>
  new ethers.Contract(VotingAddress, VotingAddressABI, signerOrProvider);


  // Creates the context and the provider component
export const VotingContext = React.createContext();
export const VotingProvider = ({ children }) => {
  const router = useRouter();
  const [currentAccount, setCurrentAccount] = useState("");
  const [candidateLength, setCandidateLength] = useState("");
  const pushCandidate = [];
  const candidateIndex = [];
  const [candidateArray, setCandidateArray] = useState(pushCandidate);

// Error message states
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

  


 // MetaMask connection check
  const checkIfWalletIsConnected = async () => {
    if (!window.ethereum) return setError("Please, install MetaMask.");

      const accounts = await window.ethereum.request({ method: "eth_accounts" });

    if (accounts.length > 0) {
      setCurrentAccount(accounts[0]);
      getAllVoterData();
      getNewCandidate();
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

 

// Connects the user's wallet to the app
  const connectWallet = async () => {
    if (!window.ethereum) return alert("Please, install MetaMask");

    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });

    setCurrentAccount(accounts[0]);
    getAllVoterData();
    getNewCandidate();
  };
 
// Fetches the authorizer address from the contract
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

      const url = `${subdomain}/ipfs/${added.path}`; // Generate URL to access file
     //const url = `https://ipfs.infura.io/ipfs/${added.path}`;

      // setImage(url); // Set image using URL
      // setImage(url);
      return url;
    } catch (error) {
      console.log("Encountered an error while uploading file to IPFS."); // Handle error if encountered while uploading file to IPFS
    }  
  }; 

  //UPLOAD Candidate to infura-IPFS 
  const uploadToIPFSCandidate = async (file) => {
    try {
      const added = await client.add({ content: file });  // Add file to IPFS

      //const url = `https://ipfs.infura.io/ipfs/${added.path}`;
      const url = `${subdomain}/ipfs/${added.path}`;
      console.log(url);
      return url;
    } catch (error) {
      console.log("Encountered an error while uploading file to IPFS."); // Handle error if encountered while uploading file to IPFS
    }
  };
  
  
  //Function to Create Voter
  const createVoter = async (formInput, fileUrl) => {
    const { name, address, position } = formInput;

    if (!name || !address || !position)
      return console.log("Please, check your input. Something is missing!");  // Validate input data

    const web3Modal = new Web3Modal(); // Create Web3Modal instance
    const connection = await web3Modal.connect(); // Connect to Web3Modal
    const provider = new ethers.providers.Web3Provider(connection); // Create Web3Provider instance
    const signer = provider.getSigner(); // Get signer
    const contract = fetchContract(signer); // Fetch contract instance

    const data = JSON.stringify({ name, address, position, image: fileUrl });// Serialize voter data
    const added = await client.add(data); // Add voter data to IPFS

    const url = `${subdomain}/ipfs/${added.path}`; // Generate URL to access voter data //`${subdomain}/ipfs/${added.path}` `https://ipfs.infura.io/ipfs/${added.path}`;

    const voter = await contract.createVoters(address, name, url, fileUrl); // Create voter using contract method
    voter.wait();  // Wait for voter creation

    router.push("/ListOfVoters"); // Navigate to voter list page
  };
  // =============================================

  const getAllVoterData = async () => {
    try {
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
   
    const web3Modal = new Web3Modal(); // Create Web3Modal instance
const connection = await web3Modal.connect(); // Connect to Web3Modal
const provider = new ethers.providers.Web3Provider(connection); // Create Web3Provider instance
const signer = provider.getSigner(); // Get signer
const contract = fetchContract(signer); // Fetch contract instance
console.log(contract) // Log contract instance to console

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

// const CountdownTimer = async () => {
//   // const [timerStatus, setTimerStatus] = useState(0);

//   // useEffect(() => {
//   //   const getTimerStatus = async () => {
//       try {
//         const web3Modal = new Web3Modal();
//         const connection = await web3Modal.connect();
//         const provider = new ethers.providers.Web3Provider(connection);
//         const signer = provider.getSigner();
//         const contract = fetchContract(signer);
//         const timerStatus = await contract.getTimeLeft();
//         console.log(newDate(timerStatus.toNumber()).getTime())// setTimerStatus(timerStatus);
//       } catch (error) {
//         console.log(error.message);
//       }
//     };

    // getTimerStatus();
    // const interval = setInterval(() => {
    //   getTimerStatus();
    // }, 10000);

    // return () => clearInterval(interval);
  // }, []);

  // const formatCountdown = (countdown) => {
  //   const hours = Math.floor(countdown / 3600);
  //   const minutes = Math.floor((countdown % 3600) / 60);
  //   const seconds = Math.floor(countdown % 60);
  //   return `${hours}:${minutes}:${seconds}`;
  // };
  // return (
  //   <div>
  //     Time left: {formatCountdown(timerStatus)}
  // //   </div>
  // );
// }

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
        //CountdownTimer,
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
