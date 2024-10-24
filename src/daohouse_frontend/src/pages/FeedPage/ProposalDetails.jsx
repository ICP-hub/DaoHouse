import React, { useEffect, useMemo, useState } from "react";
import "../DaoProfile/DaoProfile.scss";
import { useNavigate, useParams } from "react-router-dom";
import Container from "../../Components/Container/Container";
import { Principal } from '@dfinity/principal';
import { useAuth } from "../../Components/utils/useAuthClient";
import { useUserProfile } from "../../context/UserProfileContext";
import { toast } from "react-toastify";
import MuiSkeleton from "../../Components/SkeletonLoaders/MuiSkeleton";
import { CircularProgressBar } from "../../Components/Proposals/CircularProgressBar";
import Card from "../../Components/Proposals/Card";
import avatar from "../../../assets/avatar.png";
import Comments from "../Post/Comments";
import ProposalDetailsLoaderSkeleton from "../../Components/SkeletonLoaders/ProposalLoaderSkeleton/ProposalDetailsLoaderSkeleton";
import NoDataComponent from "../../Components/Dao/NoDataComponent";
import { CircularProgress } from "@mui/material";

const ProposalsDetails = () => {
   const className="DaoProfile"
  const { backendActor, createDaoActor } = useAuth();
  const [dao, setDao] = useState(null);
  const { proposalId, daoCanisterId } = useParams();
  const [voteApi, setVoteApi] = useState({});
  const [proposal, setProposal] = useState([]);
  const [loading, setLoading] = useState(false);
  const [joinStatus, setJoinStatus] = useState("Join DAO");
  const [isMember, setIsMember] = useState(false);
  const [daoFollowers, setDaoFollowers] = useState([]);
  const [daoMembers, setDaoMembers] = useState([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [daoCanister, setDaoCanister] = useState({})
  const [loadingJoinedDAO, setLoadingJoinedDAO] = useState(false); 
  const [followersCount, setFollowersCount] = useState(0);
  const [userProfile, setUserProfile] = useState(null);
  const [isComment, setIsComment] = useState(true);
  const [commentCount, setCommentCount] = useState(0);  // State for comment count
  const backendCanisterId = Principal.fromText(process.env.CANISTER_ID_DAOHOUSE_BACKEND)

  const maxWords = 90;

  const principalString = proposal?.created_by
    ? Principal.fromUint8Array(new Uint8Array(proposal.created_by)).toText()
    : "Unknown";

  const toggleExpanded = () => setIsExpanded(!isExpanded);

  const truncateText = (text, wordLimit) => {
    const words = text.split('');
    if (words.length > wordLimit) {
      return {
        truncated: words.slice(0, wordLimit).join('') + '...',
        isTruncated: true,
      };
    }
    return {
      truncated: text,
      isTruncated: false,
    };
  };

  const { truncated, isTruncated } = truncateText(dao?.purpose || 'Dao Purpose', maxWords);

  const daoActor = useMemo(() => {
    return daoCanisterId ? createDaoActor(daoCanisterId) : null;
  }, [daoCanisterId, createDaoActor]);

  // setVoteApi(daoActor)

  useEffect(() => {
    const fetchDaoDetails = async () => {
      setLoading(true);
      if (daoCanisterId) {
        try {
          setVoteApi(daoActor);
          const proposalDetails = await daoActor.get_proposal_by_id(proposalId);
          setProposal(proposalDetails);
          console.log("propos",proposalDetails);
          

          setCommentCount(Number(BigInt(proposalDetails?.comments || 0)))

          const daoDetails = await daoActor.get_dao_detail();
          setDao(daoDetails);
          console.log("daoDetails", daoDetails);
          

          // Fetch user profile
          const profileResponse = await backendActor.get_user_profile();
          if (profileResponse.Ok) {
            setUserProfile(profileResponse.Ok);
            const currentUserId = Principal.fromText(profileResponse.Ok.user_id.toString());
            const daoFollowers = await daoActor.get_dao_followers();
            setDaoFollowers(daoFollowers);
            setFollowersCount(daoFollowers.length);
            setIsFollowing(daoFollowers.some(follower => follower.toString() === currentUserId.toString()));
          
          const daoMembers = await daoActor.get_dao_members();
          console.log(daoMembers);
          
          setDaoMembers(daoMembers)
          const isCurrentUserMember = daoMembers.some(member => member.toString() === currentUserId.toString());
            if (isCurrentUserMember) {
              setIsMember(true)
              setJoinStatus('Joined');
            } else {
              setIsMember(false)
              setJoinStatus('Join DAO');
            }
          }
          setLoading(false)
        } catch (error) {
          console.error('Error fetching DAO details:', error);
        } 
      }
    };

    fetchDaoDetails();
  }, [daoActor, backendActor, proposalId]);

  const handleJoinDao = async () => {
    if (joinStatus === 'Joined') {
      toast.error(`You are already member of this dao`);
      return;
    };

    setShowConfirmModal(true);
    
  };

  const confirmJoinDao = async () => {
    setLoadingJoinedDAO(true)
    try {
      const daohouseBackendId = Principal.fromText(canisterIdString);
      const place_to_join = "Council";
  
      const joinDaoPayload = {
        place_to_join: place_to_join,
        daohouse_backend_id: daohouseBackendId,
      };
      
      const response = await daoActor.ask_to_join_dao(joinDaoPayload);
      console.log(response);
      
      if (response.Ok) {
        setJoinStatus("Requested");
        toast.success("Join request sent successfully");
      } else {
        console.error("Failed to send join request:", response.Err || "Unknown error");
        toast.error(`Failed to send join request: ${response.Err || "Unknown error"}`);
      }
    } catch (error) {
      setLoadingJoinedDAO(false)
      console.error('Error sending join request:', error);
      toast.error('Error sending join request');
    } finally {
      setShowConfirmModal(false);
      setLoadingJoinedDAO(false)
    }
  };


  const toggleFollow = async () => {
    if (!userProfile) return;

    const newIsFollowing = !isFollowing;
    setIsFollowing(newIsFollowing);
    setFollowersCount(prevCount => newIsFollowing ? prevCount + 1 : prevCount - 1);

    try {
      const daoActor = createDaoActor(daoCanisterId);
      const response = isFollowing
        ? await daoActor.unfollow_dao(backendCanisterId)
        : await daoActor.follow_dao(backendCanisterId);
  
        if (response?.Ok) {
          toast.success(newIsFollowing ? "Successfully followed" : "Successfully unfollowed");
        } else if (response?.Err) {
          // Revert the state if there's an error
          setIsFollowing(!newIsFollowing);
          setFollowersCount(prevCount => newIsFollowing ? prevCount - 1 : prevCount + 1);
          toast.error(response.Err);
        }

    } catch (error) {
      console.error('Error following/unfollowing DAO:', error);
      // Revert the state if there's an error
      setIsFollowing(!newIsFollowing);
      setFollowersCount(prevCount => newIsFollowing ? prevCount - 1 : prevCount + 1);
      toast.error("An error occurred");
    }
  };

  function toggleComment() {
    setIsComment(!isComment);
  }

  const getImageUrl = (imageId) => {
    return `${process.env.DFX_NETWORK === "ic" ? "https" : "http"}://${process.env.CANISTER_ID_IC_ASSET_HANDLER}.${process.env.DFX_NETWORK === "ic" ? "raw.icp0.io" : "localhost:4943"}/f/${imageId}`;
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }} className="mt-12 mb-28">
        <ProposalDetailsLoaderSkeleton isProposalDetails={true} showActions={true} />
      </div>
    );
  }

  if (!dao) {
    return <div className="m-auto mt-20"><NoDataComponent /></div>;
  }

  return (
    <div className={`${className} bg-zinc-200 w-full relative`}>
  <Container classes="${className} __mainComponent lg:py-8 lg:pb-20 py-6 big_phone:px-8 px-6 tablet:flex-row gap-2 flex-col w-full md:pl-2">
    <div className="w-full md:gap-2 gap-10 z-10 relative md:pl-4 tablet:px-12 lg:px-16 mt-10">
      <div className="flex flex-col md:flex-row md:justify-between md:pl-1">
        {/* Left Side: Proposal Details */}
        <div className="flex flex-col md:flex-row items-center flex-grow">
          <div
            className="w-full md:w-[145px] h-[200px] lg:w-[207px] lg:h-[120px] bg-[#C2C2C2] md:h-[84px] rounded overflow-hidden flex-shrink-0"
            style={{
              boxShadow:
                "0px 0.26px 1.22px 0px #0000000A, 0px 1.14px 2.53px 0px #00000010, 0px 2.8px 5.04px 0px #00000014, 0px 5.39px 9.87px 0px #00000019, 0px 9.07px 18.16px 0px #0000001F, 0px 14px 31px 0px #00000029",
            }}
          >
            <img
              className="w-full h-full object-cover"
              src={getImageUrl(dao?.image_id)}
              alt="profile-pic"
            />
          </div>

          <div className="lg:ml-10 ml-4 md:mt-0 mt-4">
            <h2 className="lg:text-[40px] md:text-[24px] text-[16px] tablet:font-normal font-medium md:text-left text-[#05212C] truncate md:w-[100%] w-full text-center">
              {dao?.dao_name || 'Dao Name'}
            </h2>
            <div className="relative w-full md:w-[65%] lg:w-[80%] mt-2">
              <p className="text-[12px] tablet:text-[16px] font-normal md:text-left text-[#646464] break-words text-center">
                {isExpanded ? dao?.purpose : truncated}
                {isTruncated && (
                  <button
                    onClick={toggleExpanded}
                    className="text-[#0E3746] text-[12px] tablet:text-[16px] underline"
                  >
                    {isExpanded ? 'See less' : 'See more'}
                  </button>
                )}
              </p>
            </div>

            {/* <p className="mt-2 text-gray-500 text-xs md:text-sm text-center md:text-start">
              Creation Date: March 1, 2023
            </p> */}
          </div>
        </div>

        {/* Right Side: Follow & Join Buttons */}
        <div className="flex justify-center gap-4 mt-4 md:mt-0 md:ml-8  w-64 self-center">
          <button
            onClick={toggleFollow}
            className="bg-[#0E3746] text-[16px] text-white shadow-xl py-1 px-3 rounded-[27px] lg:w-[131px] lg:h-[40px] md:w-[112px] md:h-[38px] w-full flex items-center justify-center"
            style={{
              boxShadow:
                "0px 0.26px 1.22px 0px #0000000A, 0px 1.14px 2.53px 0px #00000010, 0px 2.8px 5.04px 0px #00000014, 0px 5.39px 9.87px 0px #00000019, 0px 9.07px 18.16px 0px #0000001F, 0px 14px 31px 0px #00000029",
            }}
          >
            {isFollowing ? 'Unfollow' : 'Follow'}
          </button>
          <button
            onClick={handleJoinDao}
            className="bg-white text-[16px] text-[#05212C] shadow-xl px-3 rounded-[27px] lg:w-[131px] lg:h-[40px] md:w-[112px] md:h-[38px] w-full flex items-center justify-center"
            style={{
              boxShadow:
                "0px 0.26px 1.22px 0px #0000000A, 0px 1.14px 2.53px 0px #00000010, 0px 2.8px 5.04px 0px #00000014, 0px 5.39px 9.87px 0px #00000019, 0px 9.07px 18.16px 0px #0000001F, 0px 14px 31px 0px #00000029",
            }}
          >
            {joinStatus}
          </button>
          {showConfirmModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <div className="bg-white p-6 rounded-lg shadow-lg md:w-[800px] mx-auto text-center">
                <h3 className="text-xl font-mulish font-semibold text-[#234A5A]">Ready to join this DAO?</h3>
                <p className="mt-4 text-[16px] md:px-24 font-mulish">
                  You’re about to join a DAO! A proposal will be created to welcome you, and DAO members will vote on your request. 
                  You'll be notified once the results are in. Approval happens when members vote in your favor—good luck!
                </p>
                <div className="flex justify-center gap-4 mt-4">
                  <button
                    onClick={() => setShowConfirmModal(false)}
                    className="px-8 py-3 text-[12px] lg:text-[16px] text-black font-normal rounded-full shadow-md hover:bg-gray-200 hover:text-[#0d2933]"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmJoinDao}
                    className="px-6 md:px-8 py-3 text-center text-[12px] lg:text-[16px] bg-[#0E3746] text-white rounded-full shadow-xl hover:bg-[#0d2933] hover:text-white"
                  >
                    {loadingJoinedDAO ? (
                        <CircularProgress size={24} />
                      ) : (
                        "Join DAO"
                      )}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>

    {/* Comments and Proposal Details */}
    <div className="mt-12">
      <div className="px-0 tablet:px-0">
      <Card
        proposal={proposal}
        showActions={true}
        isProposalDetails={true}
        voteApi={daoActor}
        isComment={isComment}
        setIsComment={setIsComment}
        commentCount={commentCount}
        showComments={true}
      />
      </div>
      {isComment && (
        <div className="tablet:px-12">
          <Comments
          daoId={daoCanisterId}
          proposalId={proposalId}
          commentCount={commentCount}
          setCommentCount={setCommentCount}
        />
        </div>
      )}
    </div>
  </Container>
</div>

  );
};

export default ProposalsDetails;
