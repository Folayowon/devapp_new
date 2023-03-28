//organizerAddress = '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266'

// Set the address of the deployed Voting contract
export const VotingAddress = "0x1339c74faa254052898668F0ac444Bd918D33f59";

// Set the ABI (Application Binary Interface) of the Voting contract
// The ABI is used by ethers.js to interact with the deployed contract
import voting from "./Devapp.json";
export const VotingAddressABI = voting.abi;