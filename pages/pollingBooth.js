import React, { useState, useEffect, useContext } from "react";
import { AiFillCaretRight } from "react-icons/ai";
import Image from "next/image";
import Countdown from "react-countdown";

//INTERNAL IMPORT
import { VotingContext } from "../context/Voter";
import Style from "../styles/index.module.css";
import Card from "../components/card/card";
import image from "../candidate.png";
import background from "../blockchain.svg";

const pollingBooth = () => {
  const {
    getNewCandidate,
    candidateArray,
    giveVote,
    connectWallet,
    checkIfWalletIsConnected,
    candidateLength,
    getAllVoterData,
    currentAccount,
    voterLength,
  } = useContext(VotingContext);

  useEffect(() => {
    // getNewCandidate();
    // console.log(candidateArray);/
    checkIfWalletIsConnected();
  }, []);

  return (
    <div className={Style.home}>
      {/* <div className={Style.hero}>
        <div className={Style.heroLeft}>
          <div className={Style.heroText}>
            <h4>Be a Part of Decision</h4>
            <h1 style={{ overflow: "hidden" }}>
              Vote <span id="voteTxt">Today.</span>
            </h1>
            <h3>
              An online voting platform that will replace the <br /> centralized voting
              system
            </h3>
          </div>

          <div className={Style.heroBtn}>
            <h4>
              Do you like to be a part
              of the outcome?
            </h4>
            <br />
            <div className={Style.regBtn}>Connect Wallet</div>
          </div>
        </div>
        <div className={Style.heroRight}></div>
      </div> */}
      {
        // <div className={Style.container}>
        //   <span className={Style.img}>
        //     <Image src={background} />
        //   </span>
        //   <div className={Style.homeContainer}>
        //     <div> 
        //     <p className={Style.container_title}>Be a part of Decision!</p>
        //     <div className={Style.home_vote}>
        //       <span>Vote </span>
        //       <span className={Style.voteColor}>Today</span>
        //       <span className={Style.border}></span>
        //     </div>
        //     <div className={Style.voting}>
        //       An online voting that will replace the centralized voting system
        //     </div>
        //     <div className={Style.accredited_voter}>
        //       <AiFillCaretRight className={Style.icon} />
        //       <div className={Style.accredited}>Get accredited to vote</div>
        //     </div>
        //     <div className={Style.btnContainer}>
        //       {/* <button >Register</button> */}
        //       {!currentAccount && (
        //         <button className={Style.btn} onClick={() => connectWallet()}>
        //           Connect Wallet
        //         </button>
        //       )}
        //     </div>
        //     </div>
        //   </div>
        // </div>
      }
      {/* {currentAccount && (
        <div className={Style.winner}>
          <div className={Style.winner_info}>
            <div className={Style.candidate_list}>
              <p>
                No Candidate:<span>{candidateLength}</span>
              </p>
            </div>
            <div className={Style.candidate_list}>
              <p>
                No Voter:<span>{voterLength}</span>
              </p>
            </div>
          </div>
          <div className={Style.winner_message}>
            <small>
              <Countdown date={Date.now() + 1000000000} />
            </small>
          </div>
        </div>
      )} */}

      <Card candidateArray={candidateArray} giveVote={giveVote} />
    </div>
  );
};

export default pollingBooth;
