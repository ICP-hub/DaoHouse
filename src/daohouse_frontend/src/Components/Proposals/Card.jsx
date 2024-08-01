import React from "react";
import avatar from "../../../assets/avatar.png";
import { CircularProgressBar } from "./CircularProgressBar";
import SmallCard from "./SmallCard";
import { buttons, sectionsData } from "./proposalsData";
import { CircularProgressBarMobile } from "./CircularProgressBarMobile";
import ProgressAnimation from "./MyProposals/proposal-cards-animations/progress-animation.json";
import ApprovedAnimation from "./MyProposals/proposal-cards-animations/approved-animation.json";
import RejectedAnimation from "./MyProposals/proposal-cards-animations/rejected-animation.json";
import Lottie from "react-lottie";
import { Principal } from "@dfinity/principal";



export default function Card({ proposal, resData, proposals }) {
  console.log("8888888888888", proposal)
  console.log(resData, "all data ")
  const a = proposal?.proposal_description;

  console.log("Annn", a)
  const bigIntValue10 = BigInt(proposal?.proposal_approved_votes || 0);
  const approvedProposals = Number(bigIntValue10);
  console.log("approved proposals", approvedProposals)

  const bigIntValue1 = BigInt(proposal?.proposal_rejected_votes || 0);
  const rejectedvoters = Number(bigIntValue1);
  console.log("///rr?", rejectedvoters)


  const stsatus = proposal?.proposal_status;
  console.log("ss", stsatus)
  // Animation options for the progress
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: ProgressAnimation,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
      id: "lottie-bigCircle",
    },
  };

  const bigIntValue2 = BigInt(proposal?.share_count || 0);
  const sharecount = Number(bigIntValue2);
  console.log("share", sharecount)
  const bigIntValue3 = BigInt(proposal?.required_votes
    || 0);
  const votecount = Number(bigIntValue3);
  console.log("like", votecount)
  const bigIntValue4 = BigInt(proposal?.comments || 0);
  const commentcount = Number(bigIntValue4);
  console.log("comment", commentcount)
  const buttons = [
    {
      icon: (
        <svg
          width="16"
          height="15"
          viewBox="0 0 16 15"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M3.11111 9.22293H12.8889V8.34456H3.11111V9.22293ZM3.11111 6.58781H12.8889V5.70943H3.11111V6.58781ZM3.11111 3.95269H12.8889V3.07431H3.11111V3.95269ZM16 15L13.2649 12.2972H1.43556C1.02667 12.2972 0.685333 12.162 0.411556 11.8914C0.137778 11.6209 0.000592593 11.2833 0 10.8787V1.41857C0 1.01452 0.137185 0.677227 0.411556 0.406687C0.685926 0.136148 1.02726 0.000585583 1.43556 0H14.5644C14.9733 0 15.3147 0.135562 15.5884 0.406687C15.8622 0.677812 15.9994 1.01511 16 1.41857V15ZM1.43556 11.4189H13.6444L15.1111 12.8629V1.41857C15.1111 1.28389 15.0542 1.16004 14.9404 1.04702C14.8267 0.934005 14.7013 0.877789 14.5644 0.878374H1.43556C1.29926 0.878374 1.17393 0.93459 1.05956 1.04702C0.945185 1.15945 0.888296 1.2833 0.888889 1.41857V10.8787C0.888889 11.0134 0.945778 11.1372 1.05956 11.2502C1.17333 11.3632 1.29867 11.4195 1.43556 11.4189Z"
            fill="black"
          />
        </svg>
      ),
      text: commentcount,
    },
    {
      icon: (
        <svg
          width="17"
          height="17"
          viewBox="0 0 17 17"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M16 1L1 5.85294L6.73529 8.5L12.9118 4.08824L8.5 10.2647L11.1471 16L16 1Z"
            stroke="black"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
      text: sharecount
    },
    {
      icon: (
        <svg
          width="12"
          height="15"
          viewBox="0 0 12 15"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M10.1104 15H1.88964C1.38848 15 0.907841 14.8012 0.553464 14.4473C0.199087 14.0935 0 13.6135 0 13.1131V12.4889C0 9.49331 2.69161 7.05469 6 7.05469C9.30839 7.05469 12 9.4918 12 12.4889V13.1131C12 13.6135 11.8009 14.0935 11.4465 14.4473C11.0922 14.8012 10.6115 15 10.1104 15ZM6 7.81096C3.10809 7.81096 0.755858 9.90918 0.755858 12.4904V13.1146C0.755858 13.4149 0.87531 13.7028 1.08794 13.9152C1.30056 14.1275 1.58895 14.2468 1.88964 14.2468H10.1104C10.4111 14.2468 10.6994 14.1275 10.9121 13.9152C11.1247 13.7028 11.2441 13.4149 11.2441 13.1146V12.4889C11.2441 9.90918 8.89191 7.81096 6 7.81096ZM6 5.92332C5.41335 5.92347 4.83983 5.7499 4.35198 5.42455C3.86413 5.09921 3.48385 4.63672 3.25925 4.09556C3.03464 3.5544 2.9758 2.95889 3.09016 2.38433C3.20451 1.80978 3.48694 1.28199 3.90171 0.867718C4.31648 0.453447 4.84497 0.171301 5.42033 0.056964C5.9957 -0.0573734 6.5921 0.0012332 7.1341 0.225372C7.67611 0.449511 8.13938 0.829113 8.46532 1.31617C8.79126 1.80323 8.96523 2.37587 8.96523 2.96166C8.96463 3.74683 8.65206 4.49967 8.09612 5.05494C7.54018 5.61021 6.78631 5.92252 6 5.92332ZM6 0.755511C5.56281 0.755362 5.1354 0.884686 4.77183 1.12713C4.40826 1.36957 4.12487 1.71423 3.9575 2.11752C3.79012 2.52081 3.74629 2.96461 3.83155 3.39277C3.9168 3.82094 4.12731 4.21424 4.43645 4.52293C4.74559 4.83162 5.13946 5.04182 5.56826 5.12695C5.99705 5.21208 6.44149 5.16831 6.84537 5.00118C7.24925 4.83405 7.59442 4.55107 7.83721 4.18803C8.08001 3.82499 8.20952 3.39821 8.20937 2.96166C8.20877 2.37674 7.97581 1.81594 7.5616 1.40234C7.14739 0.988736 6.58578 0.75611 6 0.755511Z"
            fill="black"
          />
        </svg>
      ),
      text: votecount,
    },
  ];


  const gridItems = [
    {
      label: "Submitted On:", value: proposal?.
        proposal_submitted_at, time: "5:32:11"
    },
    {
      label: "Expires On:", value: proposal?.proposal_expired_at
      , time: "5:32:11"
    },
    { label: "Votes Required:", value: proposal?.required_votes }
  ];

  // console.log("-----g",gridItems)
  // Animation options for the approved






  const principalString = proposal?.created_by
    ? Principal.fromUint8Array(new Uint8Array(proposal.created_by)).toText()
    : "Unknown";
  console.log("////////////", principalString)
  const defaultOptions2 = {
    loop: true,
    autoplay: true,
    animationData: ApprovedAnimation,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
      id: "lottie-smallCircle",
    },
  };
  // Animation options for the rejected
  const defaultOptions3 = {
    loop: true,
    autoplay: true,
    animationData: RejectedAnimation,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
      id: "lottie-mediumCircle",
    },
  };
  return (
    <div className="rounded-l-lg rounded-t-lg w-full  shadow-md flex">
      <div className="w-full">

        <div className="bg-[#000000] flex items-center justify-between w-full rounded-t-lg">
          <div className="flex p-3 ">
            <img src={avatar} alt="user photo" className="rounded-full mr-4" />

            <div className="flex flex-col border-red-900">
              <h4 className="text-[20px] font-semibold text-white border-green-900">
                {principalString}
              </h4>

            </div>
          </div>

          <div className="p-3 mx-4 md:block hidden">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <CircularProgressBar percentage={25} color="#4CAF50" />;
                <span className="text-base text-white">
                  {approvedProposals} votes

                </span>
              </div>
              <div className="flex items-center space-x-2">
                <CircularProgressBar percentage={1} color="red" />;
                <span className="text-base text-white">{rejectedvoters} votes</span>
              </div>
            </div>
            <div className="mt-1 "></div>
          </div>

          <div
            className={`w-fit  ${proposal?.status === "Rejected"
                ? "bg-[#D85032]"
                : proposal.status === "Approved"
                  ? "bg-[#4FB565]"
                  : proposal.status === "In Progress"
                    ? "bg-[#4993B0]"
                    : ""
              } ml-auto text-white text-xs font-semibold rounded-full my-4 mx-4 pr-3 pl-7 py-1 inline-block md:hidden relative`}
          >
            {" "}
            <span
              className={`absolute  ${proposal.status === "Rejected"
                  ? "  w-[35%] h-[35%] -left-[0%] -top-[10%]"
                  : proposal.status === "Approved"
                    ? " w-[60%] h-[60%] -left-[14%] -top-[65%]"
                    : proposal.status === "In Progress"
                      ? " w-[100%] h-[100%] -left-[33%] -top-[150%]"
                      : ""
                } `}
            >
              <div
                id="lottie-container"
                style={{ width: "100%", height: "auto" }}
              >
                {proposal.status === "In Progress" && (
                  <Lottie
                    options={defaultOptions}
                    style={{ width: "100%", height: "100%" }}
                  />
                )}
                {proposal.status === "Approved" && (
                  <Lottie
                    options={defaultOptions2}
                    style={{ width: "100%", height: "100%" }}
                  />
                )}
                {proposal.status === "Rejected" && (
                  <Lottie
                    options={defaultOptions3}
                    style={{ width: "100%", height: "100%" }}
                  />
                )}
              </div>
            </span>
            {proposal.status}
          </div>
        </div>
        <div className="md:flex gap-4 text-xs py-2 px-6  bg-[#AAC8D6] rounded-b-lg hidden">
          {gridItems.map((item, index) => (
            <div
              key={index}
              className="text-[16px] text-black py-2 rounded-md text-nowrap"
            >
              <span className="font-bold text-[12px] text-nowrap	">
                {" "}
                • {item.label}
              </span>
              <br />
              <div className="text-nowrap	py-1 text-[16px] mx-2">
                <span className=" text-[16px]"> {item.value}</span>

                {item.time && (
                  <span className="text-[#55646b] mx-1 text-[12px]">
                    {" "}
                    {item.time}
                  </span>
                )}
              </div>
            </div>
          ))}
          <div
            className={`w-fit  ${proposal.status === "Rejected"
                ? "bg-[#D85032]"
                : proposal.status === "Approved"
                  ? "bg-[#4FB565]"
                  : proposal.status === "In Progress"
                    ? "bg-[#4993B0]"
                    : ""
              } ml-auto text-white text-xs font-semibold rounded-full my-4 mx-4 px-4 py-2 inline-block relative`}
          >
            {" "}
            <span className="text-[#34342a] text-[16px] ml-4">
              <span
                className={`absolute  ${proposal.status === "Rejected"
                    ? "  w-[35%] h-[35%] -left-[0%] top-[2%]"
                    : proposal.status === "Approved"
                      ? " w-[60%] h-[60%] -left-[14%] -top-[40%]"
                      : proposal.status === "In Progress"
                        ? " w-[100%] h-[100%] -left-[35%] -top-[105%]"
                        : ""
                  } `}
              >
                <div
                  id="lottie-container"
                  style={{ width: "100%", height: "auto" }}
                >
                  {proposal.status === "In Progress" && (
                    <Lottie
                      options={defaultOptions}
                      style={{ width: "100%", height: "100%" }}
                    />
                  )}
                  {proposal.status === "Approved" && (
                    <Lottie
                      options={defaultOptions2}
                      style={{ width: "100%", height: "100%" }}
                    />
                  )}
                  {proposal.status === "Rejected" && (
                    <Lottie
                      options={defaultOptions3}
                      style={{ width: "100%", height: "100%" }}
                    />
                  )}
                </div>
              </span>
            </span>{" "}
            {proposal.status}
          </div>
        </div>

        <div className="p-4">
          <div className="flex flex-col right-card flex-1 relative">
          <div className="flex items-center justify-start">
            <div className="font-bold text-xl text-[#229ED9] mb-2 p-2 hidden md:block">
              Transfer
            </div>
            <span className="border-r-2 h-6 border-[#229ED9] mx-2 hidden md:block" />
            <div className="font-semibold md:text-[16px] text-[14px] text-[#229ED9] mb-2 p-2 truncate ... w-60 md:w-150 lg:w-full">
              Proposal ID: #{proposal?.proposal_id}
            </div>
          </div>


            {proposal?.proposal_description && (
              <div
                className="mx-4 text-black text-[12px] md:text-[16px] font-normal my-3"
                dangerouslySetInnerHTML={{ __html: proposal?.proposal_description }}
              />
            )}

            <div className="md:flex justify-start items-center gap-2 hidden">
              {sectionsData.map((section, index) => (
                <SmallCard
                  key={index}
                  title={section.title}
                  input1={section.input1}
                  input2={section.input2}
                />
              ))}
            </div>
            {/**  <div className="flex justify-start items-center gap-2 md:hidden">
              {sectionsData.slice(0, 1).map((section, index) => (
                <SmallCard
                  key={index}
                  title={section.title}
                  input1={section.input1}
                  input2={section.input2}
                />
              ))}
            </div>*/}
            <div className="md:mt-4 mt-2 absolute right-4 text-right md:text-sm text-[10px] text-white bg-[#4993B0] w-fit px-2 py-1 rounded-2xl">
              {resData?.proposal_expired_at}
            </div>
          </div>

          <div className="flex gap-2 text-xs py-2 px-2 rounded-b-lg flex-wrap md:hidden">
            {gridItems.map((item, index) => (
              <div
                key={index}
                className="text-black py-2 rounded-md text-nowrap"
              >
                <span className="font-bold text-[12px] text-nowrap	">
                  {" "}
                  • {item.label}
                </span>
                <br />
                <div className="text-nowrap	py-1 text-[16px] mx-2">
                  <span className=" text-[12px]"> {item.value}</span>

                  {item.time && (
                    <span className="text-[#55646b] mx-1 text-[10px]">
                      {" "}
                      {item.time}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="p-2 md:hidden">
            <div className="flex items-center space-x-8">
              <div className="flex items-center space-x-3">
                <CircularProgressBarMobile percentage={25} color="#4CAF50" />
                <span className="text-base text-black">{approvedProposals} votes</span>
              </div>
              <div className="flex items-center space-x-3">
                <CircularProgressBarMobile percentage={1} color="red" />
                <span className="text-base text-black">{rejectedvoters} votes</span>
              </div>
            </div>
            <div className="mt-1 "></div>
          </div>

          {/** <div className="flex justify-start items-center gap-2 md:hidden">
            {sectionsData.slice(1, 2).map((section, index) => (
              <SmallCard
                key={index}
                title={section.title}
                input1={section.input1}
                input2={section.input2}
              />
            ))}
          </div>*/}


          <div className="dark:border-zinc-700 py-2 flex md:justify-start justify-around gap-4 text-zinc-500 dark:text-zinc-400">
            {buttons.map((button, index) => (
              <React.Fragment key={index}>
                <button className="flex flex-col sm:flex-row items-center justify-center sm:space-x-2 md:mx-4">
                  {button.icon}
                  <span className="text-black text-[14px]">{button.text}</span>
                </button>
                {index !== buttons.length - 1 && (
                  <span className="border-r h-6 border-black mx-2 hidden md:block" />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </div>
  );



}



