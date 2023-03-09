//organizerAddress = '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266'

// Set the address of the deployed Voting contract
export const VotingAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

// Set the ABI (Application Binary Interface) of the Voting contract
// The ABI is used by ethers.js to interact with the deployed contract
import voting from "./Devapp.json";
export const VotingAddressABI = voting.abi;