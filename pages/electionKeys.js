import Style from "../styles/allowedVoter.module.css";
import Button from "../components/Button/Button";
import {VotingContext} from "../context/Voter"
import { useContext, useEffect, useState } from "react";





const electionKeys = () => {


    
  const {startElection, CountdownTimer, endElection, resetElection} = useContext(VotingContext);
   

    return (
      <div>
        
        <div className={Style.Button}>
            <Button
              btnName="Start Election"
              handleClick={() => startElection(true)}
              />
            
          </div>

          <div className={Style.Button}>
            <Button
            btnName="End Election"
            handleClick={() => endElection(true)}
            />
          </div>

          <div className={Style.Button}>
            <Button
            btnName="reset Election"
            handleClick={() => resetElection()}
            />
          </div>
      </div>
    );
  }
  
  export default electionKeys;



