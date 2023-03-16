import React from "react";
import Image from "next/image";

import Style from "../card/card.module.css";
import voterCardStyle from "./voterCard.module.css";

const VoterCard = ({ voterArray }) => {
  return (
    <div className={Style.card}>
      {voterArray.map((el) => (
        <div key={el.id} className={Style.card_box}>
          <div className={Style.image}>
            <img src={el[4]} alt="Profile photo" />
          </div>

          <div className={Style.card_info}>
            <h2>
              {el[1]} #{el[0].toNumber()}
            </h2>
            <p>Address: {el[3].slice(0, 30)}..</p>
            <p>
              {el[1]} is authorized to vote.
            </p>
            <p className={voterCardStyle.vote_Status}>
              {el[6] == true
                ? "You can't vote twice."
                : "Not yet voted."}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default VoterCard;
