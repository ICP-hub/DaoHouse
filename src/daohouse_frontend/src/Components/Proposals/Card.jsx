import React, { useEffect, useMemo, useState } from "react";
import avatar from "../../../assets/avatar.png";
import { CircularProgressBar } from "./CircularProgressBar";
import Lottie from "react-lottie";
import ProgressAnimation from "./MyProposals/proposal-cards-animations/progress-animation.json";
import ApprovedAnimation from "./MyProposals/proposal-cards-animations/approved-animation.json";
import RejectedAnimation from "./MyProposals/proposal-cards-animations/rejected-animation.json";
import { Principal } from "@dfinity/principal";
import ViewModal from "../Dao/ViewModal";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../utils/useAuthClient";
import userImage from "../../../assets/commentUser.jpg";
import { CircularProgress } from "@mui/material";
import ShareModal from "./ShareModal";


export default function Card({ proposal, voteApi, daoCanisterId, showActions, isProposalDetails, isComment, setIsComment, commentCount, isSubmittedProposals, showComments}) {

  console.log("Vote API", proposal);
  
  const {backendActor, createDaoActor, stringPrincipal} = useAuth();
  const [voteStatus, setVoteStatus] = useState(""); // Track user vote (Yes/No)
  const [approvedVotes, setApprovedVotes] = useState(Number(proposal?.proposal_approved_votes || 0n));
  const [rejectedVotes, setRejectedVotes] = useState(Number(proposal?.proposal_rejected_votes || 0n));
  const [voteCount, setVoteCount] = useState(approvedVotes + rejectedVotes);
  const [votersList, setVotersList] = useState(null)
  const [userProfile, setUserProfile] = useState({})
  const [profileImg, setProfileImg] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isVoteLoading, setIsVoteLoading] = useState(false)
  const [isDisabled, setIsDisabled] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [copySuccess, setCopySuccess] = useState("");
  const [daoName, setDaoName] = useState("");
  const protocol = process.env.DFX_NETWORK === "ic" ? "https" : "http";
  const domain = process.env.DFX_NETWORK === "ic" ? "raw.icp0.io" : "localhost:4943";
  console.log(votersList);
  
  // console.log("voters", proposal?.approved_votes_list + proposal?.rejected_votes_list); 

  
  useEffect(() => {
    async function fetchUserProfile() {
      try {
        const userProfile = await backendActor.get_profile_by_id(Principal.fromUint8Array(proposal?.created_by?._arr));
        setUserProfile(userProfile.Ok);
        const profileImg = userProfile.Ok.profile_img
          ? `${protocol}://${process.env.CANISTER_ID_IC_ASSET_HANDLER}.${domain}/f/${userProfile.Ok.profile_img}`
          : userImage;
        setProfileImg(profileImg);
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setIsLoading(false); // Set loading to false after fetching data
      }
    }

    fetchUserProfile();
  }, [proposal]);

  const approvedVotersList = useMemo(() => proposal?.approved_votes_list || [], [proposal])
  const rejectedVotersList = useMemo(() => proposal?.rejected_votes_list || [], [proposal])


  // console.log(proposal.dao_canister_id);
  const proposalId = proposal.proposal_id
  const daoId = proposal.dao_canister_id || proposal.associated_dao_canister_id || daoCanisterId;
    
  console.log(daoCanisterId);
  

  useEffect(() => {
    const fetchDaoName = async() => {
      daoCan = Principal.fromUint8Array(daoId)
      const daoActor = await createDaoActor(daoCan.toText());
      console.log(daoActor);
      
      const daoDetails = await daoActor.get_dao_detail();
      console.log("daodetails", daoDetails);

      console.log(daoDetails.dao_name);
      
      setDaoName(daoDetails.dao_name)
      
    }

    fetchDaoName();
  }, [ daoCanisterId, createDaoActor, proposal.associated_dao_canister_id, daoId])

  const copyToClipboard = () => {
    console.log("daoCaniste", daoCanisterId);
    
    const proposalUrl = `${window.location.origin}/social-feed/proposal/${proposal.proposal_id}/dao/${daoId}`;
    navigator.clipboard.writeText(proposalUrl).then(
      () => {
        setCopySuccess("Copied!");
        toast.success("URL copied to clipboard!");
      },
      (err) => {
        setCopySuccess("Failed to copy");
        toast.error("Failed to copy URL");
      }
    );
  };

  const toggleShareModal = () => {
    setIsShareModalOpen(!isShareModalOpen);
  };
  

  const [isModalOpen,setIsModalOpen]=useState(false)
  const navigate = useNavigate()

  const a = proposal?.proposal_description;
  const principalOfAction = proposal.principal_of_action?.toText() || proposal?.action_principal?.toText()
  const approvedProposals = Number(BigInt(proposal?.proposal_approved_votes || 0));
  const rejectedvoters = Number(BigInt(proposal?.proposal_rejected_votes || 0));
  const status = proposal?.proposal_status
  ? Object.keys(proposal.proposal_status)[0] || "No Status"
  : "No Status";

  const requiredVotes = Number(BigInt(proposal?.required_votes || 0))
  useEffect(() => {
    setApprovedVotes(proposal?.approved_votes_list?.length || 0);
    setRejectedVotes(proposal?.rejected_votes_list?.length || 0);
    setVoteCount((proposal?.approved_votes_list?.length || 0) + (proposal?.rejected_votes_list?.length || 0));
  }, [proposal]);
  // console.log(proposal);
  

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
    navigate(`/social-feed/proposal/${proposalId}/dao/${daoId}`)
  }

  useEffect(() => {
    const hasVoted = localStorage.getItem(`voted_${proposal.proposal_id}`);
    if (hasVoted) {
      // setIsDisabled(true);
    }
  }, [proposal.proposal_id]);

  const handleVoteSubmit = async (e) => {
    e.preventDefault();
    if (!voteStatus) return;
  
    try {
      setIsVoteLoading(true);
      const voteParam = voteStatus === "In Favor" ? { Yes: null } : { No: null };
      const result = await voteApi.vote(proposal.proposal_id, voteParam);
  
      if (result?.Ok) {
        toast.success("Vote submitted successfully");
  
        // Update vote counts based on user's vote
        if (voteStatus === "In Favor") {
          setApprovedVotes((prev) => prev + 1);
        } else {
          setRejectedVotes((prev) => prev + 1);
        }
        setVoteCount((prev) => prev + 1);
  
        // Fetch the updated voter lists
        const updatedProposal = await voteApi.get_proposal_by_id(proposal.proposal_id);
        setVotersList({
          approvedVotes: updatedProposal?.approved_votes_list || [],
          rejectedVotes: updatedProposal?.rejected_votes_list || [],
        });
  
      } else {
        console.error("Error voting:", result.Err);
        toast.error(result.Err);
      }
    } catch (error) {
      console.error("Error submitting vote:", error);
      toast.error("Error submitting vote:", error);
    } finally {
      setIsVoteLoading(false);
    }
  };
  

  
  
  const handleVotesClick = () => {
    setIsModalOpen(true); // Open modal
    setVotersList({
      approvedVotes: approvedVotersList,
      rejectedVotes: rejectedVotersList,
    });
  };
  


  const handleCommentToggle = () => {
    setIsComment(!isComment);
 };

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
      <div className={`bg-white  font-mulish ${isProposalDetails ? "rounded-t-xl tablet:mx-16": "rounded-xl desktop:mx-20" } shadow-md ${isSubmittedProposals ? "flex" : "flex flex-col md:flex-col"}`}>
        {/* Top Section */}
        <div className={` bg-[#0E3746] ${isSubmittedProposals ? "w-2/6 flex flex-col justify-center items-center py-2 space-y-6 rounded-l-lg" : "w-full flex justify-between items-center bg-[#0E3746] px-[20px] md:px-12 py-6  rounded-t-lg rounded-b-none"}`}>
          <div className={`${isSubmittedProposals ? "flex justify-between items-start space-x-4" : "flex gap-[12px] md:gap-8 justify-center items-center"}`}>
            {isLoading ? (
              <div className="w-8 h-8 md:w-16 md:h-16 rounded-full bg-gray-300 animate-pulse"></div>
            ) : (
              <img src={profileImg || avatar} alt="user avatar" className="w-8 h-8 md:w-16 md:h-16 rounded-full" />
            )}
            {isLoading ? (
              <div className="w-24 h-6 md:w-36 md:h-8 bg-gray-400"></div>
            ) : (
              <h4 className="text-white text-sm md:text-xl font-semibold self-center">{userProfile.username || "Username"}</h4>
            )}
          </div>

          <div className={`${isSubmittedProposals ? "flex justify-center items-center gap-6" : "flex gap-4"}`}>
            <div className={`${isSubmittedProposals ? "flex flex-col items-center gap-2" : "flex flex-col md:flex-row items-center gap-2 md:gap-4"}`}>
              <CircularProgressBar percentage={Math.floor(approvedVotes / requiredVotes * 100)} color="#4CAF50" />
              <span className="text-white mt-2 text-center">{approvedVotes} votes</span>
            </div>
            <div className={`${isSubmittedProposals ? "flex flex-col items-center gap-2" : "flex flex-col md:flex-row items-center gap-2 md:gap-4"}`}>
              <CircularProgressBar percentage={Math.floor(rejectedVotes / requiredVotes * 100)} color="red" />
              <span className="text-white mt-2 text-center">{rejectedVotes} votes</span>
            </div>
          </div>
        </div>


        {/* Bottom Section */}
        <div className={`${isSubmittedProposals ? "w-4/6 px-12 py-8 flex-col space-y-4" : "w-full px-4 lg:px-12 py-4 md:py-8"}`}>
          <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center mb-4 gap-4">
            <div className="max-w-full lg:max-w-full">
              <h4 className={`text-xl font-bold text-[#0E3746] ${isSubmittedProposals ? "overflow-hidden truncate w-64 " : "overflow-hidden text-ellipsis whitespace-normal"}`}>
                {proposal.proposal_title || proposal.propsal_title} | <span className={`md:text-[1rem] text-[1rem] block `}> Proposal ID: #{proposal?.proposal_id}</span>
              </h4>
            </div>
    



            <div className="flex gap-4">
              <span className="md:py-1 px-2 md:px-4 md:w-[190px] rounded-full bg-[#4993B0] text-white font-semibold text-sm small_phone:text-base">
                {timeRemaining}
              </span>
              <span
                className={`px-4 md:py-1 rounded-full text-white font-semibold text-sm small_phone:text-base ${
                  status === "Approved" ? "bg-[#4CAF50]" : status === "Rejected" ? "bg-red-500" : "bg-[#4993B0]"
                } ${isSubmittedProposals ? "hidden": "flex"}`}
              >
                {status}
              </span>
            </div>
          </div>
          <p className={`${isSubmittedProposals ? "hidden" : "text-gray-900 text-sm mobile:text-xl mb-4 "}`}>{proposal?.proposal_description}</p>
          {isSubmittedProposals && (
            <div>
              <span
                className={`px-4 md:py-1 rounded-full text-white font-semibold text-sm small_phone:text-base ${
                  status === "Approved" ? "bg-[#4CAF50]" : status === "Rejected" ? "bg-red-500" : "bg-[#4993B0]"
                }`}
              >
                {status}
              </span>
              <span className="px-8 py-2 bg-[#4993B0] text-white rounded-full text-lg ">
            {daoName || "DaoName"}
          </span>
            </div>
          )}
          <div className={`flex flex-wrap gap-4 flex-col md:flex-row md:justify-between items-start md:items-center space-y-4 md:space-y-0 xl:space-x-8`}>
            <div className="flex flex-col gap-4 items-start justify-start">
                {!isSubmittedProposals && (
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
                )}

                <div className="flex flex-wrap justify-start md:justify-start md:mt-0 space-x-2 small_phone:space-x-4">
                  {showActions || isSubmittedProposals && (              
                    <button className={`flex items-center justify-center gap-1 mobile:gap-2 ${
                      isComment ? 'bg-gray-200 text-black rounded-lg p-2' : 'text-gray-600 bg-none'
                    }`} onClick={handleCommentToggle}>
                      <svg className="mb-1" width="16" height="15" viewBox="0 0 16 15">
                        <path d="M3.11111 9.22293H12.8889V8.34456H3.11111V9.22293ZM3.11111 6.58781H12.8889V5.70943H3.11111V6.58781ZM3.11111 3.95269H12.8889V3.07431H3.11111V3.95269ZM16 15L13.2649 12.2972H1.43556C1.02667 12.2972 0.685333 12.162 0.411556 11.8914C0.137778 11.6209 0.000592593 11.2833 0 10.8787V1.41857C0 1.01452 0.137185 0.677227 0.411556 0.406687C0.685926 0.136148 1.02726 0.000585583 1.43556 0H14.5644C14.9733 0 15.3147 0.135562 15.5884 0.406687C15.8622 0.677812 15.9994 1.01511 16 1.41857V15ZM1.43556 11.4189H13.6444L15.1111 12.8629V1.41857C15.1111 1.28389 15.0542 1.16004 14.9404 1.04702C14.8267 0.934005 14.7013 0.877789 14.5644 0.878374H1.43556C1.29926 0.878374 1.17393 0.93459 1.05956 1.04702C0.945185 1.15945 0.888296 1.2833 0.888889 1.41857V10.8787C0.888889 11.0134 0.945778 11.1372 1.05956 11.2502C1.17333 11.3632 1.29867 11.4195 1.43556 11.4189Z" fill="black" />
                      </svg>
                      <span className="md:ml-2 text-sm mobile:text-base">{commentCount || 0} Comments</span>
                    </button>
                  )}

                  <button className="flex items-center justify-center mobile:gap-2 text-gray-600" onClick={handleVotesClick}>
                    <svg className="mb-1" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4z"/>
                      <path d="M19.07 18.93C17.66 17.52 15.48 16.5 12 16.5s-5.66 1.02-7.07 2.43A2 2 0 0 0 6.34 22h11.32a2 2 0 0 0 1.41-3.07z"/>
                    </svg>
                    <span className="md:ml-2 text-sm mobile:text-base">{voteCount} Voters</span>
                  </button>
                  <button className="flex items-center justify-center mobile:gap-2 text-gray-600" onClick={toggleShareModal}>
                    <svg className="mb-1" width="17" height="17" viewBox="0 0 17 17">
                      <path d="M16 1L1 5.85294L6.73529 8.5L12.9118 4.08824L8.5 10.2647L11.1471 16L16 1Z" stroke="black" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span className="md:ml-2 text-sm mobile:text-base">Share</span>
                  </button>
                  {isSubmittedProposals && (
                    <div className="mt-4 bg-[#CDEFFE] w-32 rounded-xl cursor-pointer">
                    <button className=" px-6 py-2 font-semibold" onClick={handleViewMore}>View More</button>
                  </div>
                  )}

                <ShareModal
                  isOpen={isShareModalOpen}
                  proposalId={proposal.proposal_id}
                  daoCanisterId={daoId}
                  toggleModal={toggleShareModal}
                  copyToClipboard={copyToClipboard}
                />
                
             
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
                        className={`bg-[#0E3746] w-[100px] h-[30px] flex justify-center items-center text-white rounded-2xl p-2 mobile:text-base text-sm transition hover:bg-[#123b50]"}`}
                        // disabled={isDisabled}
                      >
                        {isVoteLoading ? (
                          <div className="w-4 h-4 border-2 border-t-transparent border-white rounded-full animate-spin"></div>
                        ) : (
                          "Submit"
                        )}
                      </button>
                </form>
              </div>
              )}
            </div>
            {!showActions &&  !isSubmittedProposals && (
            <div className="mt-4 xl:mt-8 bg-[#CDEFFE] w-32 rounded-xl cursor-pointer">
            <button className=" px-6 py-2 font-semibold" onClick={handleViewMore}>View More</button>
          </div>
          )}

        
      <ViewModal open={isModalOpen } onClose={handleOnClose} approvedVotesList={votersList?.approvedVotes} rejectedVotesList={votersList?.rejectedVotes} showVotes={true} />
          </div>
        </div>
    );
  }
}