import "../styles/globals.css";
import Image from "next/image";
//INTERNAL IMPORT
import { VotingProvider } from "../context/Voter";
import NavBar from "../components/NavBar/NavBar";
import background from "../blockchain.svg";

const MyApp = ({ Component, pageProps }) => (
  <VotingProvider style={{ backgroundImage: `url(${background})` }}>
    <div>
      <NavBar />
      <div>
        <Component {...pageProps} />
      </div>
    </div>
  </VotingProvider>
);

export default MyApp;
