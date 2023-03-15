import React, { useState, useEffect, useContext } from "react";
import { AiFillCaretRight } from "react-icons/ai";
import Image from "next/image";
import Countdown from "react-countdown";

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
    
    <div className={Style.container2}> 
    <div>
        {/* <h1>{CountdownTimer}</h1> */}
        
        {/* <h1>About page content goes here</h1> */}
        {/* <div className={Style.Button}>
            <Button
              btnName="timer__"
              handleClick={() => CountdownTimer()}
              />
            
          </div> */}
         <div>
      <h1 className={Style.voting}>Registration Portal</h1>

      <div >
      <div className={Style.btnContainer}>
        <button className={Style.btn2} onClick={handleCandidateRegistration}>Candidate Registration</button></div>
        <div>
          ""
        </div>
      <div>
        <button className={Style.btn2} onClick={handleVoterRegistration}>Voter Registration</button></div>
      </div>

    </div>
      </div>
      </div>
  );
};

export default index;

