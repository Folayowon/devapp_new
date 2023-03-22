import React, {useEffect, useContext } from "react";
import VoterCard from "../components/voterCard/voterCard";
import Style from "../styles/voterList.module.css";
import { VotingContext } from "../context/Voter";

const ListOfVoters = () => {
  const { getAllVoterData, voterArray } = useContext(VotingContext);

  useEffect(() => {
    getAllVoterData();
    // console.log(voterArray)
    
  }, []);

  return (
    <div className={Style.voterList}>
      <VoterCard voterArray={voterArray} />
    </div>
  );
};

export default ListOfVoters;