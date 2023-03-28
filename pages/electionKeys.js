import Style from "../styles/allowedVoter.module.css";
import Button from "../components/Button/Button";
import { VotingContext } from "../context/Voter";
import { useContext, useState } from "react";

const ElectionKeys = () => {
  const { startElection, transferOwnership, endElection, resetElection } = useContext(VotingContext);
  const [newOwner, setNewOwner] = useState("");

  const handleNewOwnerChange = (event) => {
    setNewOwner(event.target.value);
  };

  const handleTransferOwnership = async () => {
    try {
      await transferOwnership(newOwner);
      console.log("Ownership transferred successfully.");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <div className={Style.Button}>
        <Button btnName="Start Election" handleClick={() => startElection(true)} />
      </div>
      <div className={Style.Button}>
        <Button btnName="End Election" handleClick={() => endElection(true)} />
      </div>
      <div className={Style.Button}>
        <Button btnName="Reset Election" handleClick={() => resetElection(true)} />
      </div>
      <div>
        <input type="text" value={newOwner} onChange={handleNewOwnerChange} placeholder="Enter new address" />
        <button onClick={handleTransferOwnership}>Transfer Ownership</button>
      </div>
    </div>
  );
};

export default ElectionKeys;
