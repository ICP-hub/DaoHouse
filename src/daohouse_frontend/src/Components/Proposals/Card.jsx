// import React, { useEffect, useState } from "react";
// import avatar from "../../../assets/avatar.png";
// import { CircularProgressBar } from "./CircularProgressBar";
// import Lottie from "react-lottie";
// import ProgressAnimation from "./MyProposals/proposal-cards-animations/progress-animation.json";
// import ApprovedAnimation from "./MyProposals/proposal-cards-animations/approved-animation.json";
// import RejectedAnimation from "./MyProposals/proposal-cards-animations/rejected-animation.json";
// import { Principal } from "@dfinity/principal";
// import ViewModal from "../Dao/ViewModal";

// export default function Card({ proposal, voteApi }) {
  

//   const [isModalOpen, setIsModalOpen] = useState(false);
  // const [voteStatus, setVoteStatus] = useState(""); // Track user vote (Yes/No)
  // const [approvedVotes, setApprovedVotes] = useState(proposal?.proposal_approved_votes || 0);
  // const [rejectedVotes, setRejectedVotes] = useState(proposal?.proposal_rejected_votes || 0);
  // const [voteCount, setVoteCount] = useState(approvedVotes + rejectedVotes);
//   const [timeRemaining, setTimeRemaining] = useState("");

  // const a = proposal?.proposal_description;
  // const principalOfAction = proposal.principal_of_action.toText()
  // const approvedProposals = Number(BigInt(proposal?.proposal_approved_votes || 0));
  // const rejectedvoters = Number(BigInt(proposal?.proposal_rejected_votes || 0));
  // const status = proposal?.proposal_status
  // ? Object.keys(proposal.proposal_status)[0] || "No Status"
  // : "No Status";

//   const sharecount = Number(BigInt(proposal?.share_count || 0));
//   const requiredVotes = Number(BigInt(proposal?.required_votes || 0))
//   const votecount = Number(BigInt(0));
//   const commentcount = Number(BigInt(proposal?.comments || 0));

//   // Convert BigInt timestamps to dates
//   const submittedOn = new Date(Number(proposal?.proposal_submitted_at) / 1_000_000); // Convert nanoseconds to milliseconds
//   const expiresOn = new Date(Number(proposal?.proposal_expired_at) / 1_000_000);

//   // Format the dates to be human-readable
//   const formattedSubmittedOn = submittedOn.toLocaleString();
//   const formattedExpiresOn = expiresOn.toLocaleString();

//   // Function to split date and time
//   const splitDateTime = (dateTimeString) => {
//     const [date, time] = dateTimeString.split(", ");
//     return { date, time };
//   };

//   const { date: submittedDate, time: submittedTime } = splitDateTime(formattedSubmittedOn);
//   const { date: expiresDate, time: expiresTime } = splitDateTime(formattedExpiresOn);

//   // Custom date formatting
//   const formatDate = (date) => {
//     return new Intl.DateTimeFormat('en-US', {
//       year: '2-digit',
//       month: '2-digit',
//       day: '2-digit',
//     }).format(date);
//   };

//   // Custom time formatting
//   const formatTime = (date) => {
//     return new Intl.DateTimeFormat('en-US', {
//       hour: '2-digit',
//       minute: '2-digit',
//       second: '2-digit',
//       hour12: true,
//     }).format(date);
//   };

//   const submittedOnDate = formatDate(submittedOn);
//   const submittedOnTime = formatTime(submittedOn);
//   const expiresOnDate = formatDate(expiresOn);
//   const expiresOnTime = formatTime(expiresOn);

//   const principalString = proposal?.created_by
//     ? Principal.fromUint8Array(new Uint8Array(proposal.created_by)).toText()
//     : "Unknown";



//     useEffect(() => {
//       const intervalId = setInterval(() => {
//         const now = new Date();
//         const timeDiff = new Date(Number(proposal?.proposal_expired_at) / 1_000_000) - now;
//         if (timeDiff <= 0) {
//           clearInterval(intervalId);
//           setTimeRemaining("Voting closed");
//         } else {
//           const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
//           const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
//           const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
//           const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);
//           setTimeRemaining(`${days}d ${hours}h ${minutes}m ${seconds}s left`);
//         }
//       }, 1000);
//       return () => clearInterval(intervalId);
//     }, [proposal]);

//   function handleOnClose(){
//     setIsModalOpen(false)
//   }

  // const handleVoteSubmit = async (e) => {
  //   e.preventDefault();
  //   if (!voteStatus) return;

  //   console.log("Hello");
    

  //   try {
  //     const voteParam = voteStatus === "In Favor" ? { Yes: null } : { No: null };
  //     const result = await voteApi.vote(proposal.proposal_id, voteParam);

  //     if (result?.Ok) {
  //       // Update the vote counts locally based on the user vote
  //       if (voteStatus === "In Favor") {
  //         setApprovedVotes((prev) => prev + 1);
  //       } else {
  //         setRejectedVotes((prev) => prev + 1);
  //       }
  //       setVoteCount((prev) => prev + 1);
  //     } else {
  //       console.error("Error voting:", result.Err);
  //     }
  //   } catch (error) {
  //     console.error("Error submitting vote:", error);
  //   }
  // };

  // const handleVotesClick = () => {
  //   setIsModalOpen(true)
  // }

//   const defaultOptions = {
//     loop: true,
//     autoplay: true,
//     animationData: ProgressAnimation,
//     rendererSettings: {
//       preserveAspectRatio: "xMidYMid slice",
//       id: "lottie-bigCircle",
//     },
//   };

//   return (
//         <div className="bg-white rounded-xl shadow-md flex flex-col md:flex-row">
//       {/* Left Section */}
//       <div className="w-full md:w-1/4 flex flex-col items-center bg-[#0E3746] px-4 py-8 md:py-12 rounded-xl md:rounded-lg md:rounded-r-none">
//         <img src={avatar} alt="user avatar" className="w-16 h-16 rounded-full mb-4" />
//         <h4 className="text-white text-xl font-semibold truncate ... w-40">{principalOfAction}</h4>
//         <div>
//           <div
//             className={`mt-2 px-4 py-1 rounded-full text-white text-sm font-semibold ${
//               status === "Approved" ? "bg-[#4CAF50]" : status === "Rejected" ? "bg-red-500" : "bg-[#4993B0]"
//             }`}
//           >
//             {status}
//           </div>
//         </div>
//         <div className="flex gap-4 mt-4">
//           <div className="flex flex-col justify-center">
//             <CircularProgressBar percentage={approvedProposals} color="#4CAF50" />
//             <span className="text-white mt-2 text-center">{approvedProposals} votes</span>
//           </div>
//           <div className="flex flex-col items-center">
//             <CircularProgressBar percentage={rejectedvoters} color="red" />
//             <span className="text-white mt-2 text-center">{rejectedvoters} votes</span>
//           </div>
//         </div>
//       </div>

//       {/* Right Section */}
//       <div className="w-full md:w-3/4 px-4 py-8 xl:ml-8">
//       <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center mb-4 gap-4">
//         <div className="max-w-full lg:max-w-full">
//           <h4 className="text-xl font-bold text-[#0E3746] overflow-hidden text-ellipsis whitespace-nowrap">
//             Transfer | <span className="md:text-[1rem] text-[1rem]">Proposal ID: #{proposal?.proposal_id}</span>
//           </h4>
//         </div>
      



//           <div className="py-1 px-4 rounded-full bg-[#4993B0] text-white font-semibold">
//             {timeRemaining}
//           </div>
//         </div>

//         <p className="text-gray-900 mb-4">{proposal?.proposal_description}</p>

//         <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-8">
//           <div className="flex md:flex-col items-start">
//             <span className="font-semibold text-gray-900">• Submitted On: </span>
//             <span className="text-md ml-2">{submittedOnDate} <span className="text-xs text-gray-400">{submittedOnTime}</span></span>
//           </div>
//           <div className="flex md:flex-col items-start">
//             <span className="font-semibold text-gray-900">• Expires On: </span>
//             <span className="text-md ml-2">{expiresOnDate} <span className="text-xs text-gray-400">{expiresOnTime}</span></span>
//           </div>
//           <div className="flex md:flex-col items-start">
//             <span className="font-semibold text-gray-900">• Votes Required: </span>
//             <span className="text-md ml-2">{requiredVotes}</span>
//           </div>
//         </div>

//         {/* Cast Vote Section */}
        // <div className="bg-sky-200 w-full md:w-96 p-4 rounded-md mt-6">
        //   <h1 className="text-lg font-semibold mb-2">Cast Vote</h1>
        //   <form className="flex flex-col md:flex-row items-start md:items-center" onSubmit={handleVoteSubmit}>
        //     <div className="flex items-center space-x-4 mr-0 md:mr-4 mb-4 md:mb-0">
        //       <label className="text-md text-[#0E3746] flex items-center">
        //         <input
        //           type="radio"
        //           name="vote"
        //           value="In Favor"
        //           className="mr-2"
        //           onChange={() => setVoteStatus("In Favor")}
        //         />
        //         In Favor
        //       </label>
        //       <label className="text-md text-[#0E3746] flex-col items-center">
        //         <input
        //           type="radio"
        //           name="vote"
        //           value="Against"
        //           className="mr-2"
        //           onChange={() => setVoteStatus("Against")}
        //         />
        //         Against
        //       </label>
        //     </div>
        //     <button
        //       type="submit"
        //       className="bg-[#0E3746] hover:bg-[#051c24] text-white py-1 px-4 rounded-full transition-colors duration-300"
        //     >
        //       Submit
        //     </button>
        //   </form>
        // </div>

//         <div className="flex justify-evenly md:justify-start mt-8 space-x-4">
//           <button className="flex flex-col items-center text-gray-600 md:flex-row md:items-center">
//             <svg className="mb-1" width="16" height="15" viewBox="0 0 16 15">
//               <path d="M3.11111 9.22293H12.8889V8.34456H3.11111V9.22293ZM3.11111 6.58781H12.8889V5.70943H3.11111V6.58781ZM3.11111 3.95269H12.8889V3.07431H3.11111V3.95269ZM16 15L13.2649 12.2972H1.43556C1.02667 12.2972 0.685333 12.162 0.411556 11.8914C0.137778 11.6209 0.000592593 11.2833 0 10.8787V1.41857C0 1.01452 0.137185 0.677227 0.411556 0.406687C0.685926 0.136148 1.02726 0.000585583 1.43556 0H14.5644C14.9733 0 15.3147 0.135562 15.5884 0.406687C15.8622 0.677812 15.9994 1.01511 16 1.41857V15ZM1.43556 11.4189H13.6444L15.1111 12.8629V1.41857C15.1111 1.28389 15.0542 1.16004 14.9404 1.04702C14.8267 0.934005 14.7013 0.877789 14.5644 0.878374H1.43556C1.29926 0.878374 1.17393 0.93459 1.05956 1.04702C0.945185 1.15945 0.888296 1.2833 0.888889 1.41857V10.8787C0.888889 11.0134 0.945778 11.1372 1.05956 11.2502C1.17333 11.3632 1.29867 11.4195 1.43556 11.4189Z" fill="black" />
//             </svg>
//             <span className="md:ml-2">{commentcount} Comments</span>
//           </button>

//           <button className="flex flex-col items-center text-gray-600 md:flex-row md:items-center">
//             <svg className="mb-1" width="17" height="17" viewBox="0 0 17 17">
//               <path d="M16 1L1 5.85294L6.73529 8.5L12.9118 4.08824L8.5 10.2647L11.1471 16L16 1Z" stroke="black" strokeLinecap="round" strokeLinejoin="round" />
//             </svg>
//             <span className="md:ml-2">{sharecount} Shares</span>
//           </button>

//           <button className="flex flex-col items-center text-gray-600 md:flex-row md:items-center" onClick={handleVotesClick}>
//             <svg className="mb-1" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//               <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4z"/>
//               <path d="M19.07 18.93C17.66 17.52 15.48 16.5 12 16.5s-5.66 1.02-7.07 2.43A2 2 0 0 0 6.34 22h11.32a2 2 0 0 0 1.41-3.07z"/>
//             </svg>
//             <span className="md:ml-2">{votecount} Votes</span>
//           </button>
//         </div>

//       </div>
//       <ViewModal open={isModalOpen } onClose={handleOnClose}/>
//     </div>
//   );
// }




import React, { useEffect, useState } from "react";
import avatar from "../../../assets/avatar.png";
import { CircularProgressBar } from "./CircularProgressBar";
import Lottie from "react-lottie";
import ProgressAnimation from "./MyProposals/proposal-cards-animations/progress-animation.json";
import ApprovedAnimation from "./MyProposals/proposal-cards-animations/approved-animation.json";
import RejectedAnimation from "./MyProposals/proposal-cards-animations/rejected-animation.json";
import { Principal } from "@dfinity/principal";
import ViewModal from "../Dao/ViewModal";
import { useNavigate } from "react-router-dom";

export default function Card({ proposal, voteApi, showActions, isProposalDetails }) {

  // console.log("Vote API", voteApi);
  

  const [voteStatus, setVoteStatus] = useState(""); // Track user vote (Yes/No)
  const [approvedVotes, setApprovedVotes] = useState(proposal?.proposal_approved_votes || 0);
  const [rejectedVotes, setRejectedVotes] = useState(proposal?.proposal_rejected_votes || 0);
  const [voteCount, setVoteCount] = useState(approvedVotes + rejectedVotes);

  // console.log(proposal.dao_canister_id);
  const proposalId = proposal.proposal_id
  const daoCanisterId = proposal.dao_canister_id;
  

  const [isModalOpen,setIsModalOpen]=useState(false)
  const navigate = useNavigate()

  const a = proposal?.proposal_description;
  const principalOfAction = proposal.principal_of_action.toText() || "aaaaa-aa"
  const approvedProposals = Number(BigInt(proposal?.proposal_approved_votes || 0));
  const rejectedvoters = Number(BigInt(proposal?.proposal_rejected_votes || 0));
  const status = proposal?.proposal_status
  ? Object.keys(proposal.proposal_status)[0] || "No Status"
  : "No Status";

  const sharecount = Number(BigInt(proposal?.share_count || 0));
  const requiredVotes = Number(BigInt(proposal?.required_votes || 0))
  const votecount = Number(BigInt(0));
  const commentcount = Number(BigInt(proposal?.comments || 0));

  // Convert BigInt timestamps to dates
  const submittedOn = new Date(Number(proposal?.proposal_submitted_at) / 1_000_000); // Convert nanoseconds to milliseconds
  const expiresOn = new Date(Number(proposal?.proposal_expired_at) / 1_000_000);

  // Format the dates to be human-readable
  const formattedSubmittedOn = submittedOn.toLocaleString();
  const formattedExpiresOn = expiresOn.toLocaleString();

  // Function to split date and time
  const splitDateTime = (dateTimeString) => {
    const [date, time] = dateTimeString.split(", ");
    return { date, time };
  };

  const { date: submittedDate, time: submittedTime } = splitDateTime(formattedSubmittedOn);
  const { date: expiresDate, time: expiresTime } = splitDateTime(formattedExpiresOn);

  // Custom date formatting
  const formatDate = (date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: '2-digit',
      month: '2-digit',
      day: '2-digit',
    }).format(date);
  };

  // Custom time formatting
  const formatTime = (date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    }).format(date);
  };

  const submittedOnDate = formatDate(submittedOn);
  const submittedOnTime = formatTime(submittedOn);
  const expiresOnDate = formatDate(expiresOn);
  const expiresOnTime = formatTime(expiresOn);

  const principalString = proposal?.created_by
    ? Principal.fromUint8Array(new Uint8Array(proposal.created_by)).toText()
    : "Unknown";

    const getTimeRemaining = (expiryDate) => {
      const now = new Date();
      const timeDiff = expiryDate - now;
  
      if (timeDiff <= 0) return "00d 00h 00m 00s left";
  
      const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);
  
      return `${days}d ${hours}h ${minutes}m ${seconds}s left`;
    };

    const [timeRemaining, setTimeRemaining] = useState(getTimeRemaining(expiresOn));

    useEffect(() => {
      const intervalId = setInterval(() => {
        setTimeRemaining(getTimeRemaining(expiresOn));
      }, 1000);
  
      return () => clearInterval(intervalId);
    }, [expiresOn]);

  function handleOnClose(){
    setIsModalOpen(false)
  }

  const handleViewMore = () => {
    navigate(`/social-feed/proposal/${proposalId}/dao/${daoCanisterId}`)
  }


  const handleVoteSubmit = async (e) => {
    e.preventDefault();
    if (!voteStatus) return;


    try {
      const voteParam = voteStatus === "In Favor" ? { Yes: null } : { No: null };
      const result = await voteApi.vote(proposal.proposal_id, voteParam);
      console.log("Result", result);
      

      if (result?.Ok) {
        // Update the vote counts locally based on the user vote
        if (voteStatus === "In Favor") {
          setApprovedVotes((prev) => prev + 1);
        } else {
          setRejectedVotes((prev) => prev + 1);
        }
        setVoteCount((prev) => prev + 1);
      } else {
        console.error("Error voting:", result.Err);
      }
    } catch (error) {
      console.error("Error submitting vote:", error);
    }
  };

  const handleVotesClick = () => {
    setIsModalOpen(true)
  }

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: ProgressAnimation,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
      id: "lottie-bigCircle",
    },
  };

  {
    return (
      <div className={`bg-white font-mulish ${isProposalDetails ? "rounded-t-xl": "rounded-xl" } shadow-md flex flex-col md:flex-col`}>
        {/* Top Section */}
        <div className="w-full flex justify-between items-center bg-[#0E3746] px-[20px] md:px-12 py-6  rounded-t-lg rounded-b-none">
          <div className="flex gap-[12px] md:gap-8 justify-center items-center">
            <img src={avatar} alt="user avatar" className="w-8 h-8 md:w-16 md:h-16 rounded-full" />
            <h4 className="text-white text-sm md:text-xl font-semibold">{principalString}</h4>
          </div>
          <div className="flex gap-4">
            <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4">
              <CircularProgressBar percentage={approvedProposals} color="#4CAF50" />
              <span className="text-white mt-2 text-center">{approvedProposals} votes</span>
            </div>
            <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4">
              <CircularProgressBar percentage={rejectedvoters} color="red" />
              <span className="text-white mt-2 text-center">{rejectedvoters} votes</span>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="w-full px-4 lg:px-12 py-4 md:py-8">
          <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center mb-4 gap-4">
            <div className="max-w-full lg:max-w-full">
              <h4 className="text-xl font-bold text-[#0E3746] overflow-hidden text-ellipsis whitespace-nowrap">
                {proposal.proposal_title} | <span className="md:text-[1rem] text-[1rem]">Proposal ID: #{proposal?.proposal_id}</span>
              </h4>
            </div>
    



            <div className="flex gap-4">
              <span className="md:py-1 px-4 rounded-full bg-[#4993B0] text-white font-semibold text-sm small_phone:text-base">
                {timeRemaining}
              </span>
              <span
                className={`px-4 md:py-1 rounded-full text-white font-semibold text-sm small_phone:text-base ${
                  status === "Approved" ? "bg-[#4CAF50]" : status === "Rejected" ? "bg-red-500" : "bg-[#4993B0]"
                }`}
              >
                {status}
              </span>
            </div>
          </div>

          <p className="text-gray-900 text-sm mobile:text-xl mb-4">{proposal?.proposal_description}</p>
          <div className="flex flex-wrap gap-4 flex-col md:flex-row md:justify-between items-start md:items-center space-y-4 md:space-y-0 xl:space-x-8">
            <div className="flex flex-col gap-4 items-start justify-start">
                <div className=" flex mobile:space-x-2 xl:space-x-8">
                  <div className="flex flex-col items-start">
                    <span className="font-bold text-xs mobile:text-sm lg:text-lg text-gray-900">• Submitted On </span>
                    <span className="text-[10px] small_phone:text-xs md:text-sm lg:text-lg ml-2 md:ml-3">{submittedOnDate} <span className="text-[8px] small_phone:text-[8px] md:text-xs font-normal text-gray-400">{submittedOnTime}</span></span>
                  </div>
                  <div className="flex flex-col items-start">
                    <span className="font-bold text-xs mobile:text-sm lg:text-lg text-gray-900">• Expires On </span>
                    <span className=" text-[10px] small_phone:text-xs md:text-sm lg:text-lg ml-2 md:ml-3">{expiresOnDate} <span className="text-[8px]  small_phone:text-[8px] md:text-xs font-normal text-gray-400">{expiresOnTime}</span></span>
                  </div>
                  <div className="flex flex-col items-start">
                    <span className="font-bold text-xs mobile:text-sm lg:text-lg text-gray-900">• Votes Required </span>
                    <span className="text-[10px] small_phone:text-xs md:text-sm lg:text-lg ml-2 md:ml-3">{requiredVotes}</span>
                  </div>
                </div>

                <div className="flex flex-wrap justify-start md:justify-start md:mt-0 space-x-2 small_phone:space-x-4">
                  {showActions && (              
                    <button className="flex items-center justify-center gap-1 mobile:gap-2 text-gray-600">
                      <svg className="mb-1" width="16" height="15" viewBox="0 0 16 15">
                        <path d="M3.11111 9.22293H12.8889V8.34456H3.11111V9.22293ZM3.11111 6.58781H12.8889V5.70943H3.11111V6.58781ZM3.11111 3.95269H12.8889V3.07431H3.11111V3.95269ZM16 15L13.2649 12.2972H1.43556C1.02667 12.2972 0.685333 12.162 0.411556 11.8914C0.137778 11.6209 0.000592593 11.2833 0 10.8787V1.41857C0 1.01452 0.137185 0.677227 0.411556 0.406687C0.685926 0.136148 1.02726 0.000585583 1.43556 0H14.5644C14.9733 0 15.3147 0.135562 15.5884 0.406687C15.8622 0.677812 15.9994 1.01511 16 1.41857V15ZM1.43556 11.4189H13.6444L15.1111 12.8629V1.41857C15.1111 1.28389 15.0542 1.16004 14.9404 1.04702C14.8267 0.934005 14.7013 0.877789 14.5644 0.878374H1.43556C1.29926 0.878374 1.17393 0.93459 1.05956 1.04702C0.945185 1.15945 0.888296 1.2833 0.888889 1.41857V10.8787C0.888889 11.0134 0.945778 11.1372 1.05956 11.2502C1.17333 11.3632 1.29867 11.4195 1.43556 11.4189Z" fill="black" />
                      </svg>
                      <span className="md:ml-2 text-sm mobile:text-base">{commentcount} Comments</span>
                    </button>
                  )}

                <button className="flex items-center justify-center mobile:gap-2 text-gray-600" onClick={handleVotesClick}>
                  <svg className="mb-1" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4z"/>
                    <path d="M19.07 18.93C17.66 17.52 15.48 16.5 12 16.5s-5.66 1.02-7.07 2.43A2 2 0 0 0 6.34 22h11.32a2 2 0 0 0 1.41-3.07z"/>
                  </svg>
                  <span className="md:ml-2 text-sm mobile:text-base">{votecount} Voters</span>
                </button>
                <button className="flex items-center justify-center mobile:gap-2 text-gray-600">
                    <svg className="mb-1" width="17" height="17" viewBox="0 0 17 17">
                      <path d="M16 1L1 5.85294L6.73529 8.5L12.9118 4.08824L8.5 10.2647L11.1471 16L16 1Z" stroke="black" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span className="md:ml-2 text-sm mobile:text-base">{sharecount} Shares</span>
                  </button>
              </div>
              </div>

        
            {/* Cast Vote Section */}
              {showActions && (
                <div className="bg-sky-200 w-full md:w-96 p-4 rounded-md mt-6">
                <h1 className="text-lg font-semibold mb-2">Cast Vote</h1>
                <form className="flex flex-col md:flex-row items-start md:items-center" onSubmit={handleVoteSubmit}>
                  <div className="flex items-center space-x-4 mr-0 md:mr-4 mb-4 md:mb-0">
                    <label className="text-md text-[#0E3746] flex items-center">
                      <input
                        type="radio"
                        name="vote"
                        value="In Favor"
                        className="mr-2"
                        onChange={() => setVoteStatus("In Favor")}
                      />
                      In Favor
                    </label>
                    <label className="text-md text-[#0E3746] flex-col items-center">
                      <input
                        type="radio"
                        name="vote"
                        value="Against"
                        className="mr-2"
                        onChange={() => setVoteStatus("Against")}
                      />
                      Against
                    </label>
                  </div>
                  <button
                    type="submit"
                    className="bg-[#0E3746] hover:bg-[#051c24] text-white py-1 px-4 rounded-full transition-colors duration-300"
                  >
                    Submit
                  </button>
                </form>
              </div>
              )}
            </div>
            {!showActions && (
            <div className="mt-4 xl:mt-8 bg-[#CDEFFE] w-32 rounded-xl cursor-pointer">
            <button className=" px-6 py-2 font-semibold" onClick={handleViewMore}>View More</button>
          </div>
          )}

        
      <ViewModal open={isModalOpen } onClose={handleOnClose}/>
          </div>
        </div>
    );
  }
}