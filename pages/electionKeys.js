import Style from "../styles/allowedVoter.module.css";
import Button from "../components/Button/Button";
import {VotingContext} from "../context/Voter"
import { useContext, useEffect, useState } from "react";





const electionKeys = () => {


    // const startElectionButton = "Start Election";
  const {startElection, timer, endElection} = useContext(VotingContext)
    // function handleClick() {
    //   console.log("The election has commenced.");

    return (
      <div>
        {/* <h1>{timer}</h1> */}
        
        <h1>About page content goes here</h1>
        <div className={Style.Button}>
            <Button
              btnName="End Election"
              handleClick={() => endElection()}
              />
            
          </div>
        <div className={Style.Button}>
            <Button
              btnName="Start Election"
              handleClick={() => startElection(true)}
              />
            
          </div>
      </div>
    );
  }
  
  export default electionKeys;



