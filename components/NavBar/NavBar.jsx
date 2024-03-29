import React, { useState, useContext } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import Link from "next/link";
import { AiFillLock, AiFillUnlock } from "react-icons/ai";
import Style from "./NavBar.module.css";
import logo from "../../Log.svg";
import { VotingContext } from "../../context/Voter";

const NavBar = () => {
  const {
    connectWallet,
    error,
    currentAccount,
    fetchAuthorizerAddress,
    useAdminAddress,
  } = useContext(VotingContext);
  const [openNav, setOpenNav] = useState(true);
  const [connected, setConnected] = useState(false);
  const isAdmin = useAdminAddress(currentAccount);

  return (
    <div className={Style.navbar}>
      {error === "" ? (
        ""
      ) : (
        <div className={Style.message__Box}>
          <div style={Style.message}>
            <p className={Style.text}>{error}</p>
          </div>
        </div>
      )}

      <div className={Style.navbar_box}>
        <div className={Style.title}>
          <Link href={{ pathname: "/" }}>
            <Image src={logo} alt="logo" width={100} height={100} />
          </Link>
        </div>

        <div className={Style.nav_flex}>
          {currentAccount && (
            <div className={Style.navbar_section}>
              <p>
                <Link href={{ pathname: "/" }}>Home</Link>
              </p>
              {currentAccount && isAdmin && (
                <>
                  <p>
                    <Link
                      className={Style.linkWeight}
                      href={{ pathname: "./registrationPortal" }}
                    >
                      Registration
                    </Link>
                  </p>

                  <p>
                    <Link href={{ pathname: "electionKeys" }}>Protocols</Link>
                  </p>
                </>
              )}
              <p>
                <Link href={{ pathname: "ListOfVoters" }}>Voters</Link>
              </p>
              <p>
                <Link href={{ pathname: "pollingBooth" }}>Polling Booth</Link>
              </p>
              <p>
                <Link href={{ pathname: "electionSummary" }}>Election Summary</Link>
              </p>
            </div>
          )}

          <div className={Style.connect}>
            {currentAccount ? (
              <div>
                <div className={Style.connect_flex}>
                  <button onClick={() => setOpenNav()}>
                    {currentAccount.slice(0, 10)}..
                  </button>
                  {currentAccount && (
                    <span className={Style.mobile}>
                      {openNav ? (
                        <AiFillUnlock onClick={() => setOpenNav()} />
                      ) : (
                        <AiFillLock onClick={() => setOpenNav()} />
                      )}
                    </span>
                  )}
                </div>

                {openNav && (
                  <div className={Style.nav}>
                    <div className={Style.navigation}>
                      <p>
                        <Link href={{ pathname: "/" }}>Home</Link>
                      </p>
                      {currentAccount && isAdmin && (
                        <>
                          <p>
                            <Link
                              className={Style.linkWeight}
                              href={{ pathname: "./registrationPortal" }}
                            >
                              Registration
                            </Link>
                          </p>
                          <p>
                            <Link href={{ pathname: "electionKeys" }}>
                              Protocols
                            </Link>
                          </p>
                        </>
                      )}
                      <p>
                        <Link href={{ pathname: "ListOfVoters" }}>Voters</Link>
                      </p>
                      <p>
                        <Link href={{ pathname: "pollingBooth" }}>
                          Polling Booth
                        </Link>
                      </p>

                      <p>
                        <Link href={{ pathname: "electionSummary" }}>
                          Election Summary
                        </Link>
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button onClick={() => connectWallet()}>Connect Wallet</button> )}</div>
        </div>
      </div>
    </div>
  );
};

export default NavBar;