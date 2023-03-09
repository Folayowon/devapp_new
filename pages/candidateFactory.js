import { useState, useMemo, useCallback, useContext, useEffect } from "react";
import { useRouter } from "next/router";
import { useDropzone } from "react-dropzone";
import Image from "next/image";
//import "../styles/globals.css";

//INTRNAL IMPORT
import { VotingContext } from "../context/Voter";
import Style from "../styles/allowedVoter.module.css";
import images from "../assets";
import Button from "../components/Button/Button";
import Input from "../components/Input/Input";
import voter from "../voter.jpg";

const candidateRegisration = () => {
  const [fileUrl, setFileUrl] = useState(null);
  const {
    uploadToIPFSCandidate,
    setCandidate,
    getNewCandidate,
    candidateArray,
  } = useContext(VotingContext);
  const [candidateForm, setCandidateForm] = useState({
    name: "",
    address: "",
    age: "",
  });

  const router = useRouter();

  //-------------VOTERS
  const onDrop = useCallback(async (acceptedFile) => {
    const url = await uploadToIPFSCandidate(acceptedFile[0]);
    console.log(url);
    setFileUrl(url);
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: "image/*",
    maxSize: 5000000,
  });

  useEffect(() => {
    getNewCandidate();
  }, []);
  return (
    <div className={Style.createVoter}>
      <div>
        <div className={Style.sideInfo}>
          <div className={Style.sideInfo_box}>
            <h4>Create Candidate For Voting</h4>
            <p>
              Devapp Blockchain voting application, ethereum blockchain ecosystem
            </p>
            <p className={Style.sideInfo_para}>Contract Candidate List</p>
          </div>
          <div className={Style.car}>
            {candidateArray.map((el, i) => (
              <div key={i + 1} className={Style.card_box}>
                <div className={Style.image}>
                  <img
                    src={el[3]}
                    alt="Profile photo"
                    className={Style.image__img}
                  />
                </div>

                <div className={Style.card_info}>
                  <p>
                    {el[1]} #{el[2].toNumber()}
                  </p>
                  <p>{el[0]}</p>
                  <p>Address: {el[6].slice(0, 10)}..</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className={Style.voter}>
        <div className={Style.voter__container}>
          <h1 className={Style.newCandidate}>Candidate Registration Page</h1>
          <div className={Style.voter__container__box}>
            <div className={Style.voter__container__box__div}>
              <div {...getRootProps()}>
                <input {...getInputProps()} />

                <div className={Style.voterContainer__box__div_info}>
                  <div className={Style.voter__container__box__div__image}>
                    {fileUrl && (
                      <div>
                        <img
                          className={Style.voterInfo}
                          src={fileUrl}
                          alt="asset_file"
                        />
                      </div>
                    )}
                    {!fileUrl && (
                      <div>
                        <p className={Style.voterContainer}>
                          Upload File: JPG, PNG, GIF, WEBM MAX 100MB
                        </p>
                        <Image
                          src={images.upload}
                          width={50}
                          height={50}
                          objectFit="contain"
                          alt="file upload"
                        />
                        <div className={Style.voterContainer}>
                          <p>Drag & Drop File</p>
                          <p>or Browse media on your device</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className={Style.input__container}>
          <Input
            inputType="text"
            title="Name"
            placeholder="Candidate's name"
            handleClick={(e) =>
              setCandidateForm({ ...candidateForm, name: e.target.value })
            }
          />
          <Input
            inputType="text"
            title="Address"
            placeholder="Candidate's address"
            handleClick={(e) =>
              setCandidateForm({ ...candidateForm, address: e.target.value })
            }
          />
          <Input
            inputType="text"
            title="Age"
            placeholder="Candidate's age"
            handleClick={(e) =>
              setCandidateForm({ ...candidateForm, age: e.target.value })
            }
          />

          <div className={Style.Button}>
            <Button
              btnName="Register Candidate"
              handleClick={() => setCandidate(candidateForm, fileUrl, router)}
            />
          </div>
        </div>
      </div>

      <div className={Style.createdVorter}>
        <div className={Style.createdVorter__info}>
          <Image src={voter} alt="user profile" className={Style.voter_image} />
          <p className={Style.notice}>Notice</p>
          <p>
            Organizer <span>0xf39Fd6e51..</span>
          </p>
          <p>
            Please, note that only the organizer of <br />
            this election can perform this operation.
          </p>
        </div>
      </div>
    </div>
  );
};

export default candidateRegisration;
