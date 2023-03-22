import React, { useState, useEffect, useContext } from "react";
import { AiFillCaretRight } from "react-icons/ai";
import Image from "next/image";
import Countdown from "react-countdown";
import Button from "../../components/Button/Button";


//INTERNAL IMPORT
import { VotingContext } from "../../context/Voter";
import Style from "../../styles/index.module.css";
import Card from "../../components/card/card";
import image from "../../candidate.png";
import background from "../../blockchain.svg";

const index = () => {
  const handleCandidateRegistration = () =>{
    window.location.href = "./candidateFactory"
  };
  const handleVoterRegistration = () => {
    window.location.href = "./votersFactory"
  }
  
  const {
     getNewCandidate,
    // candidateArray,
    // giveVote,
    // connectWallet,
    checkIfWalletIsConnected,
    // candidateLength,
    // getAllVoterData,
    currentAccount,
    //voterLength,
  } = useContext(VotingContext);

  useEffect(() => {
    // getNewCandidate();
    // console.log(candidateArray);/
    checkIfWalletIsConnected();
  }, []);

  return (
    <div className={Style.containerReg}>
      <div className={Style.itemReg}>
        <Button
          btnName="Register Candidate"
          handleClick={() => handleCandidateRegistration(true)}
        />
      </div>
      <div className={Style.itemReg}></div>
      <div className={`${Style.itemReg} ${Style.bottomReg}`}>
        <Button
          btnName="Register Voter"
          handleClick={() => handleVoterRegistration(true)}
        />
      </div>
    </div>
  );
};

export default index;
