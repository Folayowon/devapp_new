import Style from "../styles/allowedVoter.module.css";
import Button from "../components/Button/Button";
import { VotingContext } from "../context/Voter";
import { useContext, useState } from "react";
import Input from "../components/Input/Input";

const ElectionKeys = () => {
  const { startElection, transferOwnership, endElection, resetElection } = useContext(VotingContext);
  const [ownershipResult, setOwnershipResult] = useState("");
  const [newOwner, setNewOwner] = useState("");
  const [age, setAge] = useState("");

  const handleOwnershipTransferred = (result) => {
    setOwnershipResult(result);
  };

  const handleTransferOwnership = () => {
    transferOwnership(newOwner)
      .then((result) => {
        handleOwnershipTransferred(result);
      })
      .catch((error) => {
        console.error(error);
      });
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

      <div className={Style.input__container}>
        
        <div >
        <Input
          inputType="text"
          title="New Owner Address"
          value={newOwner}
          handleChange={(event) => setNewOwner(event.target.value)}
          placeholder="New Owner Address"
          
        /></div>
        <div className={Style.Button}>
          <Button btnName="Transfer Ownership" handleClick={handleTransferOwnership} />
        {ownershipResult && <div>Ownership transferred successfully.</div>}
        </div>
      </div>
    </div>
  );
};

export default ElectionKeys;
