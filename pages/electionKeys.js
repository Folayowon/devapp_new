import Style from "../styles/allowedVoter.module.css";
import Button from "../components/Button/Button";
import {VotingContext} from "../context/Voter"
import { useContext, useEffect, useState } from "react";





const electionKeys = () => {


    // const startElectionButton = "Start Election";
  const {startElection, CountdownTimer, endElection} = useContext(VotingContext);
    // function handleClick() {
    //   console.log("The election has commenced.");

    return (
      <div>
        {/* <h1>{CountdownTimer}</h1> */}
        
        {/* <h1>About page content goes here</h1> */}
        {/* <div className={Style.Button}>
            <Button
              btnName="timer__"
              handleClick={() => CountdownTimer()}
              />
            
          </div> */}
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



