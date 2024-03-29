import Style from "../styles/allowedVoter.module.css";
import Button from "../components/Button/Button";
import { VotingContext } from "../context/Voter";
import { useContext, useState } from "react";

const ElectionSummary = () => {
  const { fetchWinner, fetchLeadingCandidate } = useContext(VotingContext);
  const [winner, setWinner] = useState(null);
  const [leadingCandidate, setLeadingCandidate] = useState(null);
  
  const handleFetchWinner = async () => {
    try {
      const result = await fetchWinner();
      setWinner(result);
    } catch (error) {
      console.error(error);
    }
  };

  const handleFetchLeadingCandidate = async () => {
    try {
      const result = await fetchLeadingCandidate();
      setLeadingCandidate(result);
    } catch (error) {
      console.error(error);
    }
  };

  const handleImgError = (event) => {
    event.target.style.display = "none";
  }

  return (
    <div>
      <div className={Style.Button}>
        <Button btnName="Click here to see the leading candidate." handleClick={handleFetchLeadingCandidate} />
      </div>

      <div className={Style.Button}>
        <Button btnName="Click here to see the winner." handleClick={handleFetchWinner} />
      </div>

      {leadingCandidate && (
        <div>
          <h3 className={Style.Button}>Leading Candidate</h3>
          <p className={Style.Button}>ID: {leadingCandidate.id}</p>
          <p className={Style.Button}>Age: {leadingCandidate.age}</p>
          {leadingCandidate.ipfs && (
            <img src={`${leadingCandidate.ipfs}`} alt="Leading Candidate" onError={handleImgError} />
          )}
        </div>
      )}

      {winner && (
        <div>
          <h3 className={Style.Button}>Winner</h3>
          <p className={Style.Button}>ID: {winner.id}</p>
          <p className={Style.Button}>Age: {winner.age}</p>
          {winner.ipfs && (
            <img src={`${winner.ipfs}`} alt="Winner" onError={handleImgError} />
          )}
        </div>
      )}
    </div>
  );
};

export default ElectionSummary;
