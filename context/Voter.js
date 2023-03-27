// This file contains the implementation of a React context provider for a voting app.
// It also includes functions to interact with the Ethereum blockchain, upload files to IPFS, and connect with MetaMask.

import React, { useState, useEffect } from "react";
import Web3Modal from "web3modal";
import { ethers } from "ethers";
import { create } from "ipfs-http-client";
import axios from "axios";
import { useRouter } from "next/router";

//INTERNAL IMPORT
import { VotingAddress, VotingAddressABI } from "./constants";
//import ListOfVoters from "../pages/ListOfVoters";
import Devapp from "./Devapp.json";


// IPFS credentials
const projectId = "2Kdq3ptwRNMhda7ZECqgVSl3yBe";
const projectSecretKey = "612c7614ea7760dfd3a4470623b353ef";
const auth = `Basic ${Buffer.from(`${projectId}:${projectSecretKey}`).toString(
  "base64"
)}`;

const subdomain = "https://devapp.infura-ipfs.io";

const client = create({
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
  const voterListArray = [];
  const [voterArray, setVoterArray] = useState(voterListArray);
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
      //getAllVoterData();
      
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
    //console.log(getAllVoterData)
    // getNewCandidate();
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


  const confirmUserAddress = async (targetAddress) => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const userAddress = await signer.getAddress();
    return userAddress === targetAddress;
  };

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
      alert("Encountered an error while uploading file to IPFS."); // Handle error if encountered while uploading file to IPFS
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
      alert("Encountered an error while uploading file to IPFS."); // Handle error if encountered while uploading file to IPFS
    }
  };
  

  
  const useAdminAddress = (currentAccount) => {
    const [isAdmin, setIsAdmin] = useState(false);
  
    const fetchIsAdmin = async () => {
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contract = fetchContract(signer);
        const account = await provider.listAccounts();
        const currentAccount = account[0];
  
        const isAuthorized = await contract.useAdminAddress();
        setIsAdmin(isAuthorized && currentAccount !== null);
      } catch (error) {
        console.log("Error checking if user is admin:", error);
        setIsAdmin(false);
      }
    };
  
    useEffect(() => {
      if (currentAccount) {
        fetchIsAdmin();
      } else {
        setIsAdmin(false);
      }
    }, [currentAccount]);
  
    return isAdmin;
  };
  
  

  const transferOwnership = async (address) => {
    if(!address) return alert("Input data missing");
    
    try {
      const web3Modal = new Web3Modal();
      const connection = await web3Modal.connect();
      const provider = new ethers.providers.Web3Provider(connection);
      const signer = provider.getSigner();
      const contract = await fetchContract(signer);
  
      await contract.transferOwnership(address);
      console.log(`Ownership transferred to ${address}`);
    } catch (error) {
      console.error(error);
      throw new Error(`Failed to transfer ownership: ${error.message}`);
    }
  };
  
    
  


  //Function to check if Admin
  const checkIfAdmin = async() => {
    
    if (!window.ethereum) return setError("Please, install MetaMask.");
  
    const accounts = await window.ethereum.request({ method: "eth_accounts" });
  
    if (accounts && accounts.length > 0) { // Add a check to ensure accounts is not undefined
      setCurrentAccount(accounts[0]);
      const web3Modal = new Web3Modal();
      const connection = await web3Modal.connect();
      const provider = new ethers.providers.Web3Provider(connection);
      const signer = provider.getSigner();
      const contract = fetchContract(signer);
      const account = await provider.listAccounts();
      const userAddress = account[0];
      const adminAddress = await contract.getAdmin();
  
  
      return userAddress === adminAddress;
        //getAllVoterData();
        
    } else { 
      setError("Please, connect your wallet.");
    }
  }
  
  
  //Function to Create Voter

  const createVoter = async (formInput, fileUrl, router) => {
    const { name, address, position } = formInput;

    if (!name || !address || !position) return alert("Input data is missing");

    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();
    const contract = fetchContract(signer);

    const data = JSON.stringify({
      name,
      address,
      image: fileUrl,
      position,
    });
    const added = await client.add(data);
    console.log ("added ...", added)
    
    const ipfs = `${subdomain}/ipfs/${added.path}`; // `${subdomain}/ipfs/${added.path}``https://ipfs.infura.io/ipfs/${added.path}`;

    const candidate = await contract.createVoters(
      address,
      name,
      ipfs,
      fileUrl
    );
    candidate.wait();

    router.push("/ListOfVoters");
  };

  // =============================================

  const getAllVoterData = async () => {
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();
    const contract = fetchContract(signer);
    await contract.authorizer();

    // VOTER LIST
    const voterListData = await contract.get_voter_list();
    console.log(voterListData)
    setVoterAddress(voterListData);
    console.log(voterListData)

    const voterDetails = await Promise.all(voterListData.map(async (el) => {
        const singleVoterData = await contract.getVoterDetails(el);
        return singleVoterData;
    }));
    setVoterArray(voterDetails);

    // VOTER LENGTH
    const voterList = await contract.getVotersLength();
    console.log(voterList)
    setVoterLength(voterList.toNumber());
    console.log("voterList", voterList);
};



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
    alert(error.message)
    // setError("Ops! You can't vote twice. Reload Browser");
  }
};



//END ELECTION
const endElection = async (value) => {
  try {
   
const web3Modal = new Web3Modal(); // Create Web3Modal instance
const connection = await web3Modal.connect(); // Connect to Web3Modal
const provider = new ethers.providers.Web3Provider(connection); // Create Web3Provider instance
const signer = provider.getSigner(); // Get signer
const contract = fetchContract(signer); // Fetch contract instance
console.log(contract) // Log contract instance to console

    const electionStatus = await contract.endElection(value);

    console.log(electionStatus);
  } catch (error) {
    alert(error.message)
    // setError("Ops! You can't vote twice. Reload Browser");
  }
};


const resetElection = async (value) => {
  try {
   
const web3Modal = new Web3Modal(); // Create Web3Modal instance
const connection = await web3Modal.connect(); // Connect to Web3Modal
const provider = new ethers.providers.Web3Provider(connection); // Create Web3Provider instance
const signer = provider.getSigner(); // Get signer
const contract = fetchContract(signer); // Fetch contract instance
console.log(contract) // Log contract instance to console

    const electionStatus = await contract.resetElection(value);

    console.log(electionStatus);
  } catch (error) {
    alert(error.message)
    // setError("Ops! You can't vote twice. Reload Browser");
  }
};


const fetchLeadingCandidate = async () => {
  try {
    const web3Modal = new Web3Modal(); // Create Web3Modal instance
    const connection = await web3Modal.connect(); // Connect to Web3Modal
    const provider = new ethers.providers.Web3Provider(connection); // Create Web3Provider instance
    const signer = provider.getSigner(); // Get signer
    const contract = fetchContract(signer); // Fetch contract instance
    const leadingCandidate = await contract.fetchLeadingCandidate();
    console.log("winner: ", leadingCandidate)
    return {
      id: leadingCandidate[0].toString(),
      name: leadingCandidate[1],
      ipfs: leadingCandidate[2]
    };
  } catch (error) {
    alert("Election has not started or ended.");
  }
};

const fetchWinner = async () => {
  try {
    const web3Modal = new Web3Modal(); // Create Web3Modal instance
    const connection = await web3Modal.connect(); // Connect to Web3Modal
    const provider = new ethers.providers.Web3Provider(connection); // Create Web3Provider instance
    const signer = provider.getSigner(); // Get signer
    const contract = fetchContract(signer); // Fetch contract instance
    const winner = await contract.fetchWinner();
    console.log("winner: ", winner)
    return {
      id: winner[0].toString(),
      name: winner[1],
      ipfs: winner[2]
    };
  } catch (error) {
    alert("Please, wait till the end of election.");
    return null;
  }
};



  
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

      const voteredList = await contract.voteBooth(voterAddress, voterId);
      console.log(voteredList);
    } catch (error) {
      alert(error.message);
    }
  };
  // =============================================

  const setCandidate = async (candidateForm, fileUrl, router) => {
    const { name, address, age } = candidateForm;

    if (!name || !address || !age) return alert("Input Data is missing");

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

    router.push("/pollingBooth");
  };

  const getNewCandidate = async () => {
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();
    const contract = fetchContract(signer);
  
    //---------ALL CANDIDATE
    const allCandidate = await contract.getCandidateAddress();
    console.log(contract.getCandidateAddress);
  
    //--------CANDIDATE DATA
    const promises = allCandidate.map(async (el) => {
      const singleCandidateData = await contract.getCandidateData(el);
      console.log(singleCandidateData)
      return singleCandidateData;
    });
    const candidateData = await Promise.all(promises);
  
    // check for duplicates before adding to pushCandidate array
    candidateData.forEach((data) => {
      const index = data[2].toNumber();
      if (!candidateIndex.includes(index)) {
        pushCandidate.push(data);
        candidateIndex.push(index);
      }
    });
  
    //---------CANDIDATE LENGTH
    const allCandidateLength = await contract.getCandidateAddressesLength();
    setCandidateLength(allCandidateLength.toNumber());
    console.log(allCandidateLength)
  };
  
  

  
  console.log(error.message);

  return (
    <VotingContext.Provider
      value={{
        currentAccount,
        connectWallet,
        fetchAuthorizerAddress,
        transferOwnership,
        useAdminAddress,
        uploadToIPFS,
        checkIfAdmin,
        startElection,
        endElection,
        resetElection,
        createVoter,
        setCandidate,
        fetchLeadingCandidate,
        fetchWinner,
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