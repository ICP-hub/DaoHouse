import React, { useEffect, useMemo, useState } from "react";
import avatar from "../../../assets/avatar.png";
import { CircularProgressBar } from "./CircularProgressBar";
import ProgressAnimation from "./MyProposals/proposal-cards-animations/progress-animation.json";
import { Principal } from "@dfinity/principal";
import ViewModal from "../Dao/ViewModal";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../utils/useAuthClient";
import userImage from "../../../assets/avatar.png";
import ShareModal from "./ShareModal";
import coin from "../../../assets/coin.jpg";
import Avatar from "../../../assets/Avatar.png";
import { FaCheckCircle } from "react-icons/fa";
import { RxCross2 } from "react-icons/rx";
import { GoBlocked } from "react-icons/go";
import { SiTicktick } from "react-icons/si";
import { MdOutlineTimerOff } from "react-icons/md";
import { ImCross } from "react-icons/im";
export default function Card({
  proposal,
  voteApi,
  showActions,
  isProposalDetails,
  isComment,
  setIsComment,
  commentCount,
  isSubmittedProposals,
  showComments,
  isMember,
}) {
  const { backendActor, createDaoActor, stringPrincipal } = useAuth();
  const [voteStatus, setVoteStatus] = useState("");
  const [approvedVotes, setApprovedVotes] = useState(
    Number(proposal?.proposal_approved_votes || 0n)
  );
  const [rejectedVotes, setRejectedVotes] = useState(
    Number(proposal?.proposal_rejected_votes || 0n)
  );
  const [status, setStatus] = useState(proposal?.proposal_status
    ? Object.keys(proposal?.proposal_status)[0] || "No Status"
    : "No Status")
  const [voteCount, setVoteCount] = useState(approvedVotes + rejectedVotes);
  const [votersList, setVotersList] = useState(null);
  const [userProfile, setUserProfile] = useState({});
  const [profileImg, setProfileImg] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isVoteLoading, setIsVoteLoading] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [daoName, setDaoName] = useState("");
  const { daoCanisterId } = useParams();
  const protocol = process.env.DFX_NETWORK === "ic" ? "https" : "http";
  const domain =
    process.env.DFX_NETWORK === "ic" ? "raw.icp0.io" : "localhost:4943";
  const maxWords = 150;
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isPollVoteLoading, setIsPollVoteLoading] = useState(false);
  const [loadingOptionId, setLoadingOptionId] = useState(null);
  const [pollOptions, setPollOptions] = useState(
    proposal?.poll_options ? proposal.poll_options[0] : []
  );
  



  const toggleExpanded = () => setIsExpanded(!isExpanded);

  const truncateUsername = (text, maxLength) => {
    if (!text) return "Username.user";
    return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
  };

  const truncateText = (text, wordLimit) => {
    const words = text.split("");
    if (words.length > wordLimit) {
      return {
        truncated: words.slice(0, wordLimit).join("") + "...",
        isTruncated: true,
      };
    }
    return {
      truncated: text,
      isTruncated: false,
    };
  };

  const { truncated, isTruncated } = truncateText(
    proposal?.proposal_description || "Proposal Description",
    maxWords
  );

  useEffect(() => {
    if (proposal?.poll_options) {
      setPollOptions(proposal.poll_options[0]);
    }
  }, [proposal]);


  useEffect(() => {
    async function fetchUserProfile() {
      try {
        const userProfile = await backendActor.get_profile_by_id(
          Principal.fromUint8Array(proposal?.created_by._arr)
        );
        setUserProfile(userProfile?.Ok);
        const profileImg = userProfile?.Ok.profile_img
          ? `${protocol}://${process.env.CANISTER_ID_IC_ASSET_HANDLER}.${domain}/f/${userProfile?.Ok.profile_img}`
          : userImage;
        setProfileImg(profileImg);
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchUserProfile();
  }, [proposal]);

  const approvedVotersList = useMemo(
    () => proposal?.approved_votes_list || [],
    [proposal]
  );
  const rejectedVotersList = useMemo(
    () => proposal?.rejected_votes_list || [],
    [proposal]
  );
  const proposalId = proposal.proposal_id;
  const daoId =
    proposal.dao_canister_id ||
    proposal.associated_dao_canister_id ||
    daoCanisterId;

  useEffect(() => {
    if (isShareModalOpen) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }

    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, [isShareModalOpen]);

  useEffect(() => {
    const fetchDaoName = async () => {
      if (!daoId || !daoId._arr) {
        console.error("Invalid daoId:", daoId);
        return;
      }

      try {
        const daoPrincipal = Principal.fromUint8Array(
          new Uint8Array(daoId._arr)
        );
        const daoPrincipalText = daoPrincipal.toText();

        const daoActor = await createDaoActor(daoPrincipalText);

        if (!daoActor) {
          throw new Error("Failed to create DAO actor.");
        }

        const daoDetails = await daoActor?.get_dao_detail();

        if (!daoDetails || !daoDetails.dao_name) {
          throw new Error("DAO details are missing or incomplete.");
        }

        setDaoName(daoDetails.dao_name);
      } catch (error) {
        console.error("Error fetching DAO details:", error);
      }
    };

    fetchDaoName();
  }, [createDaoActor, proposal?.associated_dao_canister_id, daoId]);

  const copyToClipboard = () => {
    const proposalUrl = `${window.location.origin}/social-feed/proposal/${proposal?.proposal_id}/dao/${daoId}`;
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

  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  // const status = proposal?.proposal_status
  //   ? Object.keys(proposal?.proposal_status)[0] || "No Status"
  //   : "No Status";

  const requiredVotes = Number(BigInt(proposal?.required_votes || 0));
  useEffect(() => {
    setApprovedVotes(proposal?.approved_votes_list?.length || 0);
    setRejectedVotes(proposal?.rejected_votes_list?.length || 0);
    setVoteCount(
      (proposal?.approved_votes_list?.length || 0) +
      (proposal?.rejected_votes_list?.length || 0)
    );
  }, [proposal]);

  const submittedOn = new Date(
    Number(proposal?.proposal_submitted_at) / 1_000_000
  );
  const expiresOn = new Date(Number(proposal?.proposal_expired_at) / 1_000_000);

  const now = new Date();
  const daysAgo = Math.floor((now - submittedOn) / (1000 * 60 * 60 * 24));

  const formattedSubmittedOn = submittedOn.toLocaleString();
  const formattedExpiresOn = expiresOn.toLocaleString();

  const splitDateTime = (dateTimeString) => {
    const [date, time] = dateTimeString.split(", ");
    return { date, time };
  };

  const { date: submittedDate, time: submittedTime } =
    splitDateTime(formattedSubmittedOn);
  const { date: expiresDate, time: expiresTime } =
    splitDateTime(formattedExpiresOn);

  const formatDate = (date) => {
    return new Intl.DateTimeFormat("en-US", {
      year: "2-digit",
      month: "2-digit",
      day: "2-digit",
    }).format(date);
  };

  const formatTime = (date) => {
    return new Intl.DateTimeFormat("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    }).format(date);
  };

  const submittedOnDate = formatDate(submittedOn);
  const submittedOnTime = formatTime(submittedOn);
  const expiresOnDate = formatDate(expiresOn);
  const expiresOnTime = formatTime(expiresOn);

  const principalString = proposal?.created_by
    ? Principal.fromUint8Array(new Uint8Array(proposal?.created_by)).toText()
    : "Unknown";

  const getTimeRemaining = (expiryDate) => {
    const now = new Date();
    const timeDiff = expiryDate - now;

    if (timeDiff <= 0 || status !== "Open") return "00d 00h 00m 00s left";

    const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);

    return `${days}d ${hours}h ${minutes}m ${seconds}s left`;
  };

  const [timeRemaining, setTimeRemaining] = useState(
    getTimeRemaining(expiresOn)
  );

  useEffect(() => {
    const intervalId = setInterval(() => {
      setTimeRemaining(getTimeRemaining(expiresOn));
    }, 1000);

    return () => clearInterval(intervalId);
  }, [expiresOn]);

  function handleOnClose() {
    setIsModalOpen(false);
  }

  const handleViewMore = () => {
    navigate(`/social-feed/proposal/${proposalId}/dao/${daoId}`);
  };

  useEffect(() => {
    const hasVoted = localStorage.getItem(`voted_${proposal?.proposal_id}`);
    if (hasVoted) {
      // setIsDisabled(true);
    }
  }, [proposal?.proposal_id]);

  const handleVoteSubmit = async (voteStatus) => {
    if (!voteStatus || !isMember) return;

    setVoteStatus(voteStatus)

    try {
      setIsVoteLoading(true);

      const voteParam = voteStatus === "In Favor" ? { Yes: null } : { No: null };

      const result = await voteApi?.vote(proposal?.proposal_id, voteParam);

      if (result?.Ok) {
        toast.success("Vote submitted successfully");

        if (voteStatus === "In Favor") {
          setApprovedVotes((prev) => prev + 1);
        } else {
          setRejectedVotes((prev) => prev + 1);
        }
        setVoteCount((prev) => prev + 1);

        const updatedProposal = await voteApi?.get_proposal_by_id(
          proposal?.proposal_id
        );
        setVotersList({
          approvedVotes: updatedProposal?.approved_votes_list || [],
          rejectedVotes: updatedProposal?.rejected_votes_list || [],
        });
        setStatus(Object.keys(updatedProposal?.proposal_status)[0])
        
      } else {
        console.error("Error voting:", result.Err);
        toast.error(result.Err);
      }
    } catch (error) {
      const rejectTextMatch = error.message.match(/Reject text: (.+)/);
      const rejectText = rejectTextMatch
        ? rejectTextMatch[1]
        : "An error occurred";
      console.error("Error submitting vote:", error);
      toast.error(rejectText);
    } finally {
      setIsVoteLoading(false);
    }
  };

  const handlePollVoteSubmit = async (selectedOption) => {
    if (!selectedOption || !isMember) return;

    // Check if the proposal is reachable
    if (proposal.proposal_expired_at <= Date.now() * 1_000_000) {
      toast.error("This proposal has expired and cannot be voted on.");
      return;
    }

    try {
      setIsPollVoteLoading(true);
      setLoadingOptionId(selectedOption);
      const result = await voteApi?.vote_on_poll_options(
        proposal.proposal_id,
        selectedOption
      );
      if (result?.Ok) {
        toast.success("Vote submitted successfully");

        // Update vote count and approved users for the selected option
        setPollOptions((prevOptions) =>
          prevOptions.map((option) =>
            option.id === selectedOption
              ? {
                ...option,
                poll_approved_votes: option.poll_approved_votes + 1n,
                approved_users: [...option.approved_users, stringPrincipal], // Add current user to approved users list
              }
              : option
          )
        );

        const updatedProposal = await voteApi?.get_proposal_by_id(
          proposal?.proposal_id
        );
        setStatus(Object.keys(updatedProposal?.proposal_status)[0])
        setVoteCount((prev) => prev + 1);
        setVotersList({
          approvedVotes: updatedProposal?.approved_votes_list || [],
          rejectedVotes: updatedProposal?.rejected_votes_list || [],
        });

        // Reset selected option after voting
        setSelectedOption(null);
      } else {
        console.error("Error voting:", result.Err);
        toast.error(result?.Err);
      }
    } catch (error) {
      console.error("Error submitting vote:", error);
      const rejectTextMatch = error.message.match(/Reject text: (.+)/);
      const rejectText = rejectTextMatch ? rejectTextMatch[1] : "An error occurred"
      toast.error(rejectText);
    } finally {
      setIsPollVoteLoading(false);
      setLoadingOptionId(null);
    }
  };

  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = `
      body.overflow-hidden {
        overflow: hidden;
        position: fixed;
        width: 100%;
        height: 100%;
      }
    `;
    document.head.append(style);
    return () => style.remove();
  }, []);

  const handleVotesClick = () => {
    setIsModalOpen(true);
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

  useEffect(() => {
    if (isShareModalOpen) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }

    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, [isShareModalOpen]);

  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = `
      body.overflow-hidden {
        overflow: hidden;
        position: fixed;
        width: 100%;
        height: 100%;
      }
    `;
    document.head.append(style);
    return () => style.remove();
  }, []);

  {
    return (
      <div
        className={`bg-white font-mulish ${isProposalDetails
            ? "rounded-t-xl tablet:mx-16"
            : `rounded-xl ${isSubmittedProposals ? "" : "desktop:mx-20"}`
          } shadow-md ${isSubmittedProposals
            ? "flex flex-col  big_phone:flex-row desktop:mx-0"
            : "flex flex-col md:flex-col"
          }`}
      >
        <>
          {/* Top Section */}
          <div
            className={`${isSubmittedProposals
                ? "big_phone:rounded-l-lg big_phone:rounded-r-none rounded-t-lg rounded-b-none flex justify-between big_phone:flex-col big_phone:space-y-8 bg-[#0E3746] px-4 sm:px-6 lg:px-12 py-6"
                : "w-full flex justify-between items-center bg-[#0E3746] px-4 sm:px-6 lg:px-12 py-6 rounded-t-lg rounded-b-none"
              }`}
          >
            {/* User Info Section */}
            <div className="flex gap-2 lg:gap-4 justify-center items-center">
              {isLoading ? (
                <div className="w-8 h-8 md:w-16 md:h-16 rounded-full bg-gray-300 animate-pulse"></div>
              ) : (
                <img
                  src={profileImg || avatar}
                  alt="user avatar"
                  className="w-8 h-8 md:w-16 md:h-16 rounded-full"
                />
              )}
              {isLoading ? (
                <div className="w-24 h-6 md:w-36 md:h-8 bg-gray-400"></div>
              ) : (

                <h2 className="tablet:text-[32px] md:text-[24px] text-[14px] tablet:font-normal font-medium text-left text-white"
                  title={userProfile?.username || "Username.user"} >
                  {truncateUsername(userProfile?.username, 15)}

                </h2>)}
            </div>

            {/* Dates Section */}
            {!isSubmittedProposals && (
              <div className="hidden lg:flex flex-row gap-3">
                <div className="flex flex-col items-start ">
                  <span className="font-bold text-xs sm:text-sm lg:text-lg text-white">
                    • Submitted On
                  </span>
                  <span className="text-[10px] small_phone:text-xs sm:text-sm md:text-base text-white ml-2">
                    {submittedOnDate}{" "}
                    <span className="text-[8px] small_phone:text-[8px] md:text-xs text-gray-400">
                      {submittedOnTime}
                    </span>
                  </span>
                </div>

                <div className="flex flex-col items-start">
                  <span className="font-bold text-xs sm:text-sm lg:text-lg text-white">
                    • Expires On
                  </span>
                  <span className="text-[10px] small_phone:text-xs sm:text-sm md:text-base text-white ml-2">
                    {expiresOnDate}{" "}
                    <span className="text-[8px] small_phone:text-[8px] md:text-xs text-gray-400">
                      {expiresOnTime}
                    </span>
                  </span>
                </div>
              </div>
            )}

            {/* Votes Section */}
            <div className="flex justify-center gap-4 md:gap-8 mt-4 md:mt-0">
              {/* Approved Votes */}
              <div className="flex flex-col items-center">
                <CircularProgressBar
                  percentage={
                    proposal?.proposal_type.Polls !== undefined
                      ? Math.floor(
                        (pollOptions?.reduce(
                          (acc, curr) =>
                            acc + Number(curr.poll_approved_votes),
                          0
                        ) /
                          requiredVotes) *
                        100
                      )
                      : Math.floor((approvedVotes / requiredVotes) * 100)
                  }
                  color="#4CAF50"
                />
                <span className="text-white mt-2 text-center text-xs sm:text-sm md:text-base">
                  {proposal?.proposal_type.Polls !== undefined
                    ? pollOptions?.reduce(
                      (acc, curr) => acc + Number(curr.poll_approved_votes),
                      0
                    )
                    : approvedVotes}{" "}
                  votes
                </span>
              </div>

              {/* Rejected Votes */}
              {proposal.proposal_title !== "poll" && (
                <div className="flex flex-col items-center">
                  <CircularProgressBar
                    percentage={Math.floor(
                      (rejectedVotes / requiredVotes) * 100
                    )}
                    color="red"
                  />
                  <span className="text-white mt-2 text-center text-xs sm:text-sm md:text-base">
                    {rejectedVotes} votes
                  </span>
                </div>
              )}
            </div>
          </div>
          {!isMember && (
                <div className="text-center w-full bg-red-200 rounded-full mt-4 py-1">
                You are not allowed to vote on this proposal
              </div>
              )}

          {/* Bottom Section */}
          <div
            className={`${isSubmittedProposals
                ? "w-full px-4 desktop:px-12 py-4 md:py-8"
                : "w-full px-4 lg:px-12 py-4 md:py-8"
              }`}
          >
            
            <div
              className={`${isSubmittedProposals
                  ? "flex flex-wrap lg:gap-4 justify-between"
                  : "flex flex-col xl:flex-row justify-between items-start xl:items-center mb-4 gap-0"
                }`}
            >
              <div className="max-w-full lg:max-w-full">
                <h4 className="text-xl font-bold text-[#0E3746] overflow-hidden break-words whitespace-normal">
                  {proposal.proposal_title || proposal.propsal_title} |{" "}
                  <span
                    className={`md:text-[1rem] text-[1rem] block ${isSubmittedProposals ? " truncate w-60" : ""
                      }`}
                  >
                    {" "}
                    Proposal ID: #{proposal?.proposal_id}
                  </span>
                </h4>
              </div>

              <div className="flex col-span-4 gap-1  small_phone:gap-2 self-start">
                <span
                  className={` px-1 mini_phone:px-2 big_phone:px-2 big_phone:w-[185px] self-center py-1 rounded-full bg-[#4993B0] text-white font-semibold text-sm text-center big_phone:text-base`}
                >
                  {timeRemaining}
                </span>

                {!isSubmittedProposals && (
                  <>
                    {status === "Accepted" && (
                      <span className="flex items-center px-4 py-1 bg-green-500 text-white rounded-full font-semibold text-sm big_phone:text-base">
                        <FaCheckCircle style={{ marginRight: "5px", fontSize: "16px" }} />
                        Accepted
                      </span>
                    )}
                    {status === "Executing" && (
                      <span className="flex items-center px-4 py-1 bg-yellow-300 text-black rounded-full font-semibold text-sm big_phone:text-base">
                        <svg
                          className="animate-spin h-5 w-5 mr-2"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-55"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                            strokeDasharray="50"
                          ></circle>
                        </svg>
                        In Progress
                      </span>
                    )}
                    {status === "Rejected" && (
                      <span className="flex items-center px-4 py-1 bg-red-700 text-white rounded-full font-semibold text-sm big_phone:text-base">
                        <RxCross2 style={{ marginRight: "5px", fontSize: "16px" }} />
                        Rejected
                      </span>
                    )}
                    {status === "Open" && (
                      <span className="flex items-center px-4 py-1 bg-yellow-300 text-black rounded-full font-semibold text-sm big_phone:text-base">
                        <svg
                          className="animate-spin h-5 w-5 mr-2"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-55"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                            strokeDasharray="50"
                          ></circle>
                        </svg>
                        Open
                      </span>
                    )}
                    {status === "Unreachable" && (
                      <span className="flex items-center px-4 py-1 bg-slate-700 text-white rounded-full font-semibold text-sm big_phone:text-base">
                        <GoBlocked style={{ marginRight: "5px", fontSize: "16px" }} />
                        Unreachable
                      </span>
                    )}
                    {status === "Succeeded" && (
                      <span className="flex items-center px-4 py-1 bg-green-700 text-white rounded-full font-semibold text-sm big_phone:text-base">
                        <SiTicktick style={{ marginRight: "5px", fontSize: "16px" }} />
                        Succeeded
                      </span>
                    )}
                    {status === "Expired" && (
                      <span className="flex items-center px-4 py-1 bg-black text-white rounded-full font-semibold text-sm big_phone:text-base">
                        <MdOutlineTimerOff style={{ marginRight: "5px", fontSize: "16px" }} />
                        Expired
                      </span>
                    )}
                  </>
                )}





              </div>
            </div>

            {isSubmittedProposals && (
              <div className="flex flex-wrap gap-2 my-2">
                <span className="px-2 py-1 text-xs sm:text-sm bg-[#4993B0] text-white rounded-full">
                  {daoName || "DaoName"}
                </span>
              </div>
            )}
            {!isSubmittedProposals && (
              <p className="text-gray-900 text-sm mobile:text-xl mb-4 break-words">
                {isExpanded ? proposal?.proposal_description : truncated}
                {isTruncated && (
                  <button
                    onClick={toggleExpanded}
                    className="text-[#0E3746] text-[12px] tablet:text-[16px] underline"
                  >
                    {isExpanded ? "See less" : "See more"}
                  </button>
                )}
              </p>
            )}
            <div className="flex flex-col gap-4 items-start mb-2 justify-start">
              {!isSubmittedProposals && (
                <div className="flex">
                  {/* // <div className="flex "> */}
                  <div className="lg:hidden flex flex-col items-start">
                    <span className="font-bold text-xs mobile:text-sm lg:text-lg text-gray-900">
                      • Submitted On{" "}
                    </span>
                    <span className="text-[10px] small_phone:text-xs md:text-sm lg:text-lg ml-2 md:ml-3">
                      {submittedOnDate}{" "}
                      <span className="text-[8px] small_phone:text-[8px] md:text-xs font-normal text-gray-400">
                        {submittedOnTime}
                      </span>
                    </span>
                  </div>
                  <div className="lg:hidden flex flex-col items-start">
                    <span className="font-bold text-xs mobile:text-sm lg:text-lg text-gray-900">
                      • Expires On{" "}
                    </span>
                    <span className="text-[10px] small_phone:text-xs md:text-sm lg:text-lg ml-2 md:ml-3">
                      {expiresOnDate}{" "}
                      <span className="text-[8px] small_phone:text-[8px] md:text-xs font-normal text-gray-400">
                        {expiresOnTime}
                      </span>
                    </span>
                  </div>
                  <div className="flex lg:flex-row flex-col    items-start iphone_SE:ml-2 lg:ml-0">
                    <span className="font-bold text-xs mobile:text-sm lg:text-lg text-gray-900 flex">
                      Votes Required <span className="hidden lg:flex">:</span>
                    </span>
                    <span className=" lg:ml-3 text-start text-[10px] small_phone:text-xs md:text-sm lg:text-lg">
                      {requiredVotes}
                    </span>
                  </div>
                </div>
              )}
            </div>

            <div className="flex gap-4 flex-col items-start ">
              {!isSubmittedProposals &&
                proposal.proposal_type.ChangeDaoConfig !== undefined && (
                  <div className="w-full">
                    <div className="flex flex-wrap">
                      <span className="font-bold">Dao Name</span>:{" "}
                      {proposal?.new_dao_name}
                    </div>
                    <div className="whitespace-normal break-words mt-2">
                      <span className="font-bold">Dao Purpose</span>:{" "}
                      {proposal?.new_dao_purpose}
                    </div>
                  </div>
                )}
              {!isSubmittedProposals &&
                proposal.proposal_type.ChangeDaoPolicy !== undefined && (
                  <div className="w-full">
                    <div className="flex justify-start">
                      <span className="font-bold  ">Cool Down Period</span>:{" "}
                      {proposal.cool_down_period}
                    </div>
                    <div className="flex flex-wrap justify-between">
                      <div className="whitespace-normal break-words">
                        <span className="font-bold">
                          Required Votes to Approve DAO Policy Change
                        </span>
                        : {proposal.new_required_votes}
                      </div>

                      <div className="flex items-center mt-2 sm:mt-0">
                        <span className="font-bold">Dao Type</span>:{" "}
                        {proposal?.ask_to_join_dao?.[0] ? "Private" : "Public"}
                      </div>
                    </div>
                  </div>
                )}

              {!isSubmittedProposals &&
                proposal.proposal_type.Polls !== undefined && (
                  <div className="w-full">
                    {/* Display poll question */}
                    <div className="flex mb-4">
                      <span className="font-bold text-lg">
                        {proposal.poll_query[0]}
                      </span>
                    </div>

                    {/* Calculate total votes once, outside the loop */}
                    {(() => {
                      const totalVotes = pollOptions?.reduce(
                        (acc, curr) => acc + Number(curr.poll_approved_votes),
                        0
                      );

                      return (
                        <form className="whitespace-normal break-words mt-2">
                          {pollOptions?.map((option) => {
                            const votePercentage =
                              totalVotes > 0
                                ? (Number(option.poll_approved_votes) /
                                  totalVotes) *
                                100
                                : 0;

                            return (
                              <div
                                key={option.id}
                                className={`relative mt-4 bg-gray-100 rounded-xl ${!isMember ? "cursor-not-allowed" : "cursor-pointer"}`}
                                onClick={() => handlePollVoteSubmit(option.id)}
                                disabled={!isMember}
                              >
                                {/* Option container with less rounded corners */}
                                <div
                                  className={`relative  rounded-lg h-10 flex items-center ${loadingOptionId === option.id &&
                                      isPollVoteLoading
                                      ? "sliding-lines"
                                      : ""
                                    }`}
                                >
                                  <div
                                    className="absolute top-0 left-0 h-10 bg-gray-200  rounded-lg transition-all"
                                    style={{ width: `${votePercentage}%` }}
                                  ></div>
                                  {/* Option text */}
                                  <span className="relative z-10 px-4 text-gray-800 font-semibold">
                                    {option.option}
                                  </span>
                                  {/* Percentage display */}
                                  <span className="relative z-10 ml-auto pr-4 text-gray-700 font-semibold">
                                    {votePercentage.toFixed(0)}%
                                  </span>
                                </div>
                              </div>
                            );
                          })}
                        </form>
                      );
                    })()}
                    {/* Total votes and time since posted */}
                    <div className="mt-2 text-sm text-gray-500">
                      {pollOptions?.reduce(
                        (acc, curr) => acc + Number(curr.poll_approved_votes),
                        0
                      )}{" "}
                      votes • {daysAgo} {daysAgo === 1 ? "day ago" : "days ago"}
                    </div>
                  </div>
                )}

              {!isSubmittedProposals &&
                proposal.proposal_type.TokenTransfer !== undefined && (
                  <div className="w-full flex  flex-col md:justify-between mt-2 md:flex-row">
                    {/* Left Side: Tokens and Logos */}
                    <div className="flex flex-col">
                      <span className="font-bold">Tokens:</span>
                      <div className="flex items-center mt-1">
                        {/* Map over tokens to display each token with its logo */}
                        {proposal.tokens.map((token, index) => (
                          <div key={index} className="flex items-center">
                            <img
                              src={coin}
                              alt={`${token.name} logo`}
                              className="w-6 h-6 mr-1"
                            />
                            <span className="font-bold">
                              {token.toString()}
                            </span>
                          </div>
                        ))}
                      </div>
                      <hr className="my-2 border-gray-300 md:hidden" />
                    </div>
                    {/* Right Side: To and User Image */}
                    <div className="flex flex-col ">
                      <span className="font-bold">To:</span>
                      {proposal.token_to.map((principal, index) => (
                        <div key={index} className="flex items-center mt-1">
                          <img
                            src={Avatar}
                            alt={`User image`}
                            className="w-6 h-6 mr-1 rounded-full"
                          />
                          <span className="font-bold">
                            {principal.toText
                              ? principal.toText()
                              : Array.from(principal._arr).join("")}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              {!isSubmittedProposals &&  
                proposal.proposal_type.ChangeGroupPermissions !== undefined && 
                proposal.updated_group_permissions &&
                proposal.updated_group_permissions.length > 0 &&
                proposal.updated_group_permissions.map((group, index) => (
                  <div key={index} className="w-full">
                    <div className="flex">
                      <span className="font-bold">Group Name</span>: {group.group_name}
                    </div>
                    <div className="flex flex-col md:flex-row mt-2 break-words gap-2">
                      <span className="font-bold">Updated Permissions:</span>
                      <div className="">
                        {group.updated_permissions
                          .map((permission, idx) => {
                            const permissionName = Object.keys(permission)[0];
                            return permissionName;
                          })
                          .join(", ")}
                      </div>
                    </div>
                  </div>
                ))}


              {!isSubmittedProposals &&
                proposal.proposal_type.RemoveMemberToGroupProposal !==
                undefined && (
                  <div className="w-full">
                    <div className="flex">
                      <span className="font-bold">Group Name</span>:{" "}
                      {proposal.group_to_remove}
                    </div>
                    <div className="whitespace-normal break-words mt-2">
                      <span className="font-bold">Remove Member</span>:{" "}
                      {Principal.fromUint8Array(
                        new Uint8Array(proposal.principal_of_action._arr)
                      ).toText()}
                    </div>
                  </div>
                )}
              {!isSubmittedProposals &&
                proposal.proposal_type.BountyRaised !== undefined && (
                  <div className="w-full">
                    <div className="flex">
                      <span className="font-bold">Bounty Task</span>:{" "}
                      {proposal.bounty_task}
                    </div>
                    <div className="whitespace-normal break-words mt-2">
                      <span className="font-bold">Tokens</span>:{" "}
                      {proposal.tokens.length > 0
                        ? proposal.tokens[0].toString()
                        : "0"}{" "}
                      {/* Handle array case */}
                    </div>
                  </div>
                )}

              {!isSubmittedProposals &&
                proposal.proposal_type.RemoveMemberToDaoProposal !==
                undefined && (
                  <div className="w-full">
                    <div className="whitespace-normal break-words mt-2">
                      <span className="font-bold">Principal ID</span>:{" "}
                      {Principal.fromUint8Array(
                        new Uint8Array(proposal.principal_of_action._arr)
                      ).toText()}
                    </div>
                  </div>
                )}

              {!isSubmittedProposals &&
                proposal.proposal_type.AddMemberToDaoProposal !== undefined && (
                  <div className="w-full">
                    <div className="whitespace-normal break-words mt-2">
                      <span className="font-bold">Principal ID</span>:{" "}
                      {Principal.fromUint8Array(
                        new Uint8Array(proposal.principal_of_action._arr)
                      ).toText()}
                    </div>
                  </div>
                )}
              {!isSubmittedProposals &&
                proposal.proposal_type.BountyDone !== undefined && (
                  <div className="w-full">
                    <div className="whitespace-normal break-words mt-2">
                      <span className="font-bold ">
                        {" "}
                        Associated Proposal ID
                      </span>
                      : {proposal.associated_proposal_id}
                    </div>

                    <div className="whitespace-normal break-words mt-2">
                      <div>
                        <span className="font-bold">From</span>:
                        {proposal.token_from.map((principal, index) => (
                          <span key={index}>
                            {principal.toText
                              ? principal.toText()
                              : Array.from(principal._arr).join("")}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

              {/* Mint New Tokens Section */}

              {!isSubmittedProposals &&
                proposal.proposal_type.MintNewTokens !== undefined && (
                  <div className="w-full">
                    <div className="flex flex-wrap">
                      <span className="font-bold">Total Amount:&nbsp;</span>{" "}
                      {proposal.tokens.length > 0
                        ? proposal.tokens[0].toString()
                        : "0"}
                    </div>
                  </div>
                )}

              <div className="w-full flex justify-between flex-wrap">
                <div className="flex flex-wrap justify-start md:justify-start md:mt-0 gap-2 small_phone:gap-4 md:gap-2">
                  {showActions && (
                    <button
                      className={`flex items-center justify-center gap-1 mobile:gap-1'
                          }`}
                      onClick={handleCommentToggle}
                    >
                      <svg
                        className="mb-1"
                        width="16"
                        height="15"
                        viewBox="0 0 16 15"
                      >
                        <path
                          d="M3.11111 9.22293H12.8889V8.34456H3.11111V9.22293ZM3.11111 6.58781H12.8889V5.70943H3.11111V6.58781ZM3.11111 3.95269H12.8889V3.07431H3.11111V3.95269ZM16 15L13.2649 12.2972H1.43556C1.02667 12.2972 0.685333 12.162 0.411556 11.8914C0.137778 11.6209 0.000592593 11.2833 0 10.8787V1.41857C0 1.01452 0.137185 0.677227 0.411556 0.406687C0.685926 0.136148 1.02726 0.000585583 1.43556 0H14.5644C14.9733 0 15.3147 0.135562 15.5884 0.406687C15.8622 0.677812 15.9994 1.01511 16 1.41857V15ZM1.43556 11.4189H13.6444L15.1111 12.8629V1.41857C15.1111 1.28389 15.0542 1.16004 14.9404 1.04702C14.8267 0.934005 14.7013 0.877789 14.5644 0.878374H1.43556C1.29926 0.878374 1.17393 0.93459 1.05956 1.04702C0
                            .945185 1.15945 0.888296 1.2833 0.888889 1.41857V10.8787C0.888889 11.0134 0.945778 11.1372 1.05956 11.2502C1.17333 11.3632 1.29867 11.4195 1.43556 11.4189Z"
                          fill="black"
                        />
                      </svg>
                      <span
                        className={`text-sm mobile:text-base ${isComment
                            ? "bg-gray-200 text-black rounded-lg p-2"
                            : "text-gray-600 bg-none"
                          }`}
                      >
                        {commentCount || 0} Comments
                      </span>
                    </button>
                  )}

                  <button
                    className="flex items-center justify-between mobile:gap-1 text-gray-600"
                    onClick={handleVotesClick}
                  >
                    <svg
                      className="mb-1"
                      width="17"
                      height="17"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="black"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4z" />
                      <path d="M19.07 18.93C17.66 17.52 15.48 16.5 12 16.5s-5.66 1.02-7.07 2.43A2 2 0 0 0 6.34 22h11.32a2 2 0 0 0 1.41-3.07z" />
                    </svg>
                    <span className=" text-sm mobile:text-base">
                      {voteCount} Voters
                    </span>
                  </button>
                  <button
                    className="flex items-center justify-center mobile:gap-1 text-gray-600"
                    onClick={toggleShareModal}
                  >
                    <svg
                      className="mb-1"
                      width="17"
                      height="17"
                      viewBox="0 0 17 17"
                    >
                      <path
                        d="M16 1L1 5.85294L6.73529 8.5L12.9118 4.08824L8.5 10.2647L11.1471 16L16 1Z"
                        stroke="black"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <span className=" text-sm mobile:text-base">Share</span>
                  </button>
                </div>

                {!isProposalDetails && (
                  <div className="bg-[#CDEFFE] rounded-xl cursor-pointer flex">
                    <button
                      className="px-4 py-1 font-mulish"
                      onClick={handleViewMore}
                    >
                      View More
                    </button>
                  </div>
                )}
              </div>

              {/* Cast Vote Section  */}
              {showActions && proposal?.proposal_title !== "poll" && (
                <div className="w-full p-4 rounded-md mt-6 border border-black">
                  <h1 className="text-lg font-semibold mb-2">Cast Vote</h1>
                  <div className="mt-4">

                    {(() => {
                      const totalVotes = approvedVotes + rejectedVotes;

                      const inFavorPercentage =
                        totalVotes > 0 ? (approvedVotes / totalVotes) * 100 : 0;
                      const againstPercentage =
                        totalVotes > 0 ? (rejectedVotes / totalVotes) * 100 : 0;

                      return (
                        <form className="whitespace-normal break-words mt-2">
                          {/* In Favor */}
                          <div
                            className={`relative mt-4 ${!isMember ? "cursor-not-allowed" : "cursor-pointer"}`}
                            onClick={() => handleVoteSubmit("In Favor")}
                            disabled={!isMember}
                          >
                            <div

                              className={`relative rounded-lg h-10 flex items-center bg-gray-100 ${!isMember ? "cursor-not-allowed" : "cursor-pointer"} ${
                                isVoteLoading && voteStatus === "In Favor"

                                  ? "sliding-lines"
                                  : ""
                                }`}
                            >
                              <div
                                className="absolute top-0 left-0 h-10 bg-gray-300 rounded-lg transition-all"
                                style={{ width: `${inFavorPercentage}%` }}
                              ></div>
                              <span className="relative z-10 px-4 text-gray-800 font-semibold">
                                In Favor
                              </span>
                              <span className="relative z-10 ml-auto pr-4 text-gray-700 font-semibold">
                                {inFavorPercentage.toFixed(0)}%
                              </span>
                            </div>
                          </div>

                          {/* Against */}
                          <div
                            className={`relative mt-4 ${!isMember ? "cursor-not-allowed" : "cursor-pointer"}`}
                            onClick={() => handleVoteSubmit("Against")}
                            disabled={!isMember}
                          >
                            <div

                              className={`relative rounded-lg h-10 flex items-center bg-gray-100  ${
                                isVoteLoading && voteStatus === "Against"

                                  ? "sliding-lines"
                                  : ""
                                }`}
                            >
                              <div
                                className="absolute top-0 left-0 h-10 bg-gray-300 rounded-lg transition-all"
                                style={{ width: `${againstPercentage}%` }}
                              ></div>
                              <span className="relative z-10 px-4 text-gray-800 font-semibold">
                                Against
                              </span>
                              <span className="relative z-10 ml-auto pr-4 text-gray-700 font-semibold">
                                {againstPercentage.toFixed(0)}%
                              </span>
                            </div>
                          </div>
                        </form>
                      );
                    })()}
                    <div className="flex gap-4 ">
                      <div className="mt-2 text-lg text-gray-800">
                        {approvedVotes + rejectedVotes} votes
                      </div>
                      <span className="flex self-center">•</span>
                      <div className="mt-2 text-lg text-gray-500">
                        {daysAgo} {daysAgo === 1 ? "day ago" : "days ago"}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            {!showActions && (
              <div className="flex gap-2">
                {(proposal?.proposal_title === "Bounty claim" ||
                  proposal.propsal_title === "Bounty claim") && (
                    <div className="mt-4 xl:mt-8 bg-[#CDEFFE] w-32 rounded-xl cursor-pointer ">
                      <button
                        className="px-2 py-2 font-mulish"
                        onClick={() => {
                          if (proposal.link_of_task) {
                            window.location.href = proposal.link_of_task;
                          } else {
                            console.error("Invalid task link");
                          }
                        }}
                      >
                        {" "}
                        Task Link claim
                      </button>
                    </div>
                  )}
              </div>
            )}
          </div>
        </>

        <ShareModal
          isOpen={isShareModalOpen}
          proposalId={proposal?.proposal_id}
          daoCanisterId={daoId}
          toggleModal={toggleShareModal}
          copyToClipboard={copyToClipboard}
          className="fixed inset-0 z-50 overflow-auto bg-black bg-opacity-50 flex items-center justify-center"
        />

        <ViewModal
          open={isModalOpen}
          onClose={handleOnClose}
          approvedVotesList={votersList?.approvedVotes}
          rejectedVotesList={votersList?.rejectedVotes}
          showVotes={true}
        />
      </div>
    );
  }
}
