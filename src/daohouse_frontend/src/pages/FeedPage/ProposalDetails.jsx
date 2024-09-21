import React, { useEffect, useState } from "react";
import "../DaoProfile/DaoProfile.scss";
import { useNavigate, useParams } from "react-router-dom";
import Container from "../../Components/Container/Container";
import { Principal } from '@dfinity/principal';
import { useAuth } from "../../Components/utils/useAuthClient";
import { useUserProfile } from "../../context/UserProfileContext";
import { toast } from "react-toastify";
import MuiSkeleton from "../../Components/Skeleton/MuiSkeleton";
import { CircularProgressBar } from "../../Components/Proposals/CircularProgressBar";
import Card from "../../Components/Proposals/Card";
import avatar from "../../../assets/avatar.png";
import Comments from "../Post/Comments";

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

  const maxWords = 250;

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

  useEffect(() => {
    const fetchDaoDetails = async () => {
      if (daoCanisterId) {
        setLoading(true);
        try {
          const daoActor = createDaoActor(daoCanisterId);
          setVoteApi(daoActor)
          const proposalDetails = await daoActor.get_proposal_by_id(proposalId);
          setProposal(proposalDetails);

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
          setLoading(false);
        }
      }
    };
    fetchDaoDetails();
  }, [daoCanisterId, backendActor, createDaoActor]);

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
        ? await daoActor.unfollow_dao()
        : await daoActor.follow_dao();

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

  const getImageUrl = (imageId) => {
    return `${process.env.DFX_NETWORK === "ic" ? "https" : "http"}://${process.env.CANISTER_ID_IC_ASSET_HANDLER}.${process.env.DFX_NETWORK === "ic" ? "raw.icp0.io" : "localhost:4943"}/f/${imageId}`;
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <MuiSkeleton variant="rectangular" width={210} height={118} />
      </div>
    );
  }

  if (!dao) {
    return <div>No DAO details available</div>;
  }

  return (
    <div className={`${className} bg-zinc-200 w-full relative`}>
      {/* <div className=""> */}
        <Container classes="__mainComponent mt-4 lg:mt-[54px] lg:pb-20 py-6 big_phone:px-16 px-6 tablet:flex-row flex-col w-full">
          <div className="flex md:flex-row flex-col md:justify-between w-full items-center mb-12">
          <div className="flex flex-col md:flex-row items-center">
              <div className="w-[320px] h-[160px] lg:w-[240px] lg:h-[136px] bg-[#C2C2C2] md:w-[150px] md:h-[100px] rounded overflow-hidden">
                <img className="w-full h-full object-cover" src={getImageUrl(dao.image_id)} alt="profile-pic" />
              </div>
              <div className="lg:ml-10 ml-4 py-4 md:mt-0 w-full md:w-72 xl:w-96 text-center md:text-left font-mulish font-semibold big_phone:text-lg">
                <h2 className="lg:text-xl big_phone:text-2xl text-[16px] tablet:font-normal font-medium truncate">
                  {dao.dao_name || 'Dao Name'}
                </h2>
                <div className="relative w-full md:w-[40vw] lg:w-[50vw]">
                  <p className="text-[12px] md:text-lg desktop:text-xl font-normal break-words">
                    {isExpanded ? dao?.purpose : truncated}
                    {isTruncated && (
                      <button onClick={toggleExpanded} className="text-[#0E3746] text-[12px] tablet:text-[16px] underline">
                        {isExpanded ? 'See less' : 'See more'}
                      </button>
                    )}
                  </p>
                </div>
                <p className="text-gray-500 text-xs md:text-sm">Creation Date: March 1, 2023</p>
              </div>
            </div>

            <div className="flex flex-row-reverse md:flex-row justify-center md:justify-end md:items-center gap-4 w-full md:w-auto font-inter">
              <button
                onClick={toggleFollow}
                className="bg-[#0E3746] text-[16px] text-white shadow-xl lg:py-4 lg:px-3 rounded-[27px] lg:w-[131px] lg:h-[40px] md:w-[112px] md:h-[38px] w-[98px] h-[35px] flex items-center justify-center"
                style={{
                  boxShadow:
                    "0px 0.26px 1.22px 0px #0000000A, 0px 0.68px 2.21px 0px #00000014, 0px 1.51px 3.63px 0px #0000001D",
                }}
              >
                {isFollowing ? "Unfollow" : "Follow"}
              </button>
              <button
                onClick={handleJoinDao}
                className="bg-white text-[#0E3746] shadow-xl lg:py-4 lg:px-3 rounded-[27px] lg:w-[131px] lg:h-[40px] md:w-[112px] md:h-[38px] w-[98px] h-[35px] flex items-center justify-center"
                style={{
                  boxShadow:
                    "0px 0.26px 1.22px 0px #0000000A, 0px 0.68px 2.21px 0px #00000014, 0px 1.51px 3.63px 0px #0000001D",
                }}
              >
                {joinStatus}
              </button>
            </div>
          </div>
        {/* </Container> */}
      {/* </div> */}

      {/* <Container classes="__mainComponent lg:pt-0 lg:pb-20 py-6 big_phone:px-8 px-6 tablet:flex-row gap-2 flex-col w-full bg-zinc-200"> */}

        
                <div>
                  <Card proposal={proposal} showActions={true} isProposalDetails={true} voteApi={voteApi} />
                  <Comments />
                </div>
        
      </Container>
    </div>
  );
};

export default ProposalsDetails;
