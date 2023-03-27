import Style from "../styles/allowedVoter.module.css";
import Button from "../components/Button/Button";
import { VotingContext } from "../context/Voter";
import { useContext, useState } from "react";

const ElectionSummary = () => {
  const { fetchWinner, fetchLeadingCandidate } = useContext(VotingContext);
  const [winner, setWinner] = useState("");
  const [leadingCandidate, setLeadingCandidate] = useState("");

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

  return (
    <div>
      <div className={Style.Button}>
        <Button btnName="Click here to see the leading candidate." handleClick={handleFetchLeadingCandidate} />
      </div>

      <div className={Style.Button}>
        <Button btnName="Click here to see the winner." handleClick={handleFetchWinner} />
      </div>
    </div>
  );
};

export default ElectionSummary;
