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
  const [followersCount, setFollowersCount] = useState(0);
  const [userProfile, setUserProfile] = useState(null);
  const [isComment, setIsComment] = useState(true);
  const [commentCount, setCommentCount] = useState(0);  // State for comment count

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
      if (!daoActor) return;

      setLoading(true);
      try {
        const proposalDetails = await daoActor.get_proposal_by_id(proposalId);
        setProposal(proposalDetails);
        console.log("propos",proposalDetails);

        setCommentCount(Number(BigInt(proposalDetails?.comments || 0)))
        

        const daoDetails = await daoActor.get_dao_detail();
        setDao(daoDetails);

        const profileResponse = await backendActor.get_user_profile();
        if (profileResponse.Ok) {
          setUserProfile(profileResponse.Ok);
          const currentUserId = Principal.fromText(profileResponse.Ok.user_id.toString());

          const daoFollowers = await daoActor.get_dao_followers();
          setDaoFollowers(daoFollowers);
          setFollowersCount(daoFollowers.length);
          setIsFollowing(daoFollowers.some(follower => follower.toString() === currentUserId.toString()));

          const daoMembers = await daoActor.get_dao_members();
          setDaoMembers(daoMembers);
          const isCurrentUserMember = daoMembers.some(member => member.toString() === currentUserId.toString());
          setIsMember(isCurrentUserMember);
          setJoinStatus(isCurrentUserMember ? 'Joined' : 'Join DAO');
        }
      } catch (error) {
        console.error('Error fetching DAO details:', error);
      } finally {
        setTimeout(() => {
          setLoading(false);
        }, 1000);
      }
    };

    fetchDaoDetails();
  }, [daoActor, backendActor, proposalId]);

  const handleJoinDao = async () => {
    if (joinStatus === 'Joined') return;

    try {
      const daoActor = createDaoActor(daoCanisterId);
      const response = await daoActor.ask_to_join_dao(daoCanisterId);
      if (response.Ok) {
        setJoinStatus("Requested");
        toast.success("Join request sent successfully");
      } else {
        toast.error(`Failed to send join request: ${response.Err || "Unknown error"}`);
      }
    } catch (error) {
      toast.error('Error sending join request');
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
        ? await daoActor.unfollow_dao(backendActor)
        : await daoActor.follow_dao(backendActor);

      if (response?.Ok) {
        toast.success(newIsFollowing ? "Successfully followed" : "Successfully unfollowed");
      } else {
        setIsFollowing(!newIsFollowing);
        setFollowersCount(prevCount => newIsFollowing ? prevCount - 1 : prevCount + 1);
        toast.error(response.Err);
      }
    } catch (error) {
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
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <ProposalDetailsLoaderSkeleton isProposalDetails={true} showActions={true} />
      </div>
    );
  }

  if (!dao) {
    return <div className="m-auto"><NoDataComponent /></div>;
  }

  return (
    <div className={`${className} bg-zinc-200 w-full relative`}>
  <Container classes="${className} __mainComponent lg:py-8 lg:pb-20 py-6 big_phone:px-8 px-6 tablet:flex-row gap-2 flex-col w-full">
    <div className="w-full md:gap-2 gap-10 z-50 relative">
      <div className="flex flex-col md:flex-row md:justify-between items-start">
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
            <h2 className="lg:text-[40px] md:text-[24px] text-[16px] tablet:font-normal font-medium md:text-left text-[#05212C] truncate md:w-[50%] w-full text-center">
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

            <p className="mt-2 text-gray-500 text-xs md:text-sm text-center md:text-start">
              Creation Date: March 1, 2023
            </p>
          </div>
        </div>

        {/* Right Side: Follow & Join Buttons */}
        <div className="flex justify-center gap-4 mt-4 md:mt-0 md:ml-4 tablet:mr-4 w-64 self-center">
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
        </div>
      </div>
    </div>

    {/* Comments and Proposal Details */}
    <div className="mt-12">
      <Card
        proposal={proposal}
        showActions={true}
        isProposalDetails={true}
        voteApi={daoActor}
        isComment={isComment}
        setIsComment={setIsComment}
        commentCount={commentCount}
      />
      {isComment && (
        <div className="mx-20">
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
