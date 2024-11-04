import React, { useEffect, useState } from "react";
import "./DaoProfile.scss";
import { useNavigate, useParams } from "react-router-dom";
import Lottie from "react-lottie";
import BigCircleComponent from "../../Components/Ellipse-Animation/BigCircle/BigCircleComponent";
import SmallCircleComponent from "../../Components/Ellipse-Animation/SmallCircle/SmallCircleComponent";
import MediumCircleComponent from "../../Components/Ellipse-Animation/MediumCircle/MediumCircleComponent";
import BigCircleAnimation from "../../Components/Ellipse-Animation/BigCircle/BigCircleAnimation.json";
import SmallCircleAnimation from "../../Components/Ellipse-Animation/SmallCircle/SmallCircleAnimation.json";
import BigCircle from "../../../assets/BigCircle.png";
import MediumCircle from "../../../assets/MediumCircle.png";
import SmallestCircle from "../../../assets/SmallestCircle.png";
import MyProfileRectangle from "../../../assets/MyProfileRectangle.png";
import ProposalsContent from "../../Components/DaoProfile/ProposalsContent";
import FeedsContent from "../../Components/DaoProfile/FeedsContent";
import Members from "../../Components/DaoProfile/Members";
import FollowersContent from "../../Components/DaoProfile/FollowersContent";
import FundsContent from "../../Components/DaoProfile/FundsContent";
import Container from "../../Components/Container/Container";
import { Principal } from '@dfinity/principal';
import { useAuth, useAuthClient } from "../../Components/utils/useAuthClient";
import { toast } from "react-toastify";
import ProposalLoaderSkeleton from "../../Components/SkeletonLoaders/ProposalLoaderSkeleton/ProposalLoaderSkeleton";
import DaoProfileLoaderSkeleton from "../../Components/SkeletonLoaders/DaoProfileLoaderSkeleton/DaoProfileLoaderSkeleton";
import NoDataComponent from "../../Components/Dao/NoDataComponent";
import { CircularProgress } from "@mui/material";
import messagesound from "../../Sound/messagesound.mp3";
import daoImage from "../../../assets/daoImage.png"


const DaoProfile = () => {

  const className = "DaoProfile";
  const [activeLink, setActiveLink] = useState("proposals");
  const { backendActor, createDaoActor } = useAuth();
  const [dao, setDao] = useState(null);
  const [proposals, setProposals] = useState([]);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [loadingProposals, setLoadingProposals] = useState(true);
  const canisterId = process.env.CANISTER_ID_IC_ASSET_HANDLER;
  const protocol = process.env.DFX_NETWORK === "ic" ? "https" : "http";
  const domain = process.env.DFX_NETWORK === "ic" ? "raw.icp0.io" : "localhost:4943";
  const { daoCanisterId } = useParams();
  const [joinStatus, setJoinStatus] = useState("Join DAO"); 
  const [isMember, setIsMember] = useState(false);
  const [voteApi, setVoteApi] = useState({})
  const [daoFollowers, setDaoFollowers] = useState([])
  const [daoMembers, setDaoMembers] = useState([])
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [daoActor, setDaoActor] = useState({})
  const [loading, setLoading] = useState(false); 
  const [daoGroups, setDaoGroups] = useState([])
  const [isExpanded, setIsExpanded] = useState(false);
  const maxWords = 250;
  const backendCanisterId = Principal.fromText(process.env.CANISTER_ID_DAOHOUSE_BACKEND)
  
  const toggleExpanded = () => setIsExpanded(!isExpanded);
  const navigate = useNavigate();

  const [isFollowing, setIsFollowing] = useState(false);
  const [followersCount, setFollowersCount] = useState(0);
  const [userProfile, setUserProfile] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 40;
  const totalPages = Math.ceil((dao?.proposals_count || 0) / itemsPerPage);

// Function to handle page change
const handlePageChange = (newPage) => {
  if (newPage >= 1 && newPage <= totalPages) {
    setCurrentPage(newPage);
  }
};


  const truncateText = (text, wordLimit) => {
    const words = text.split('');
    console.log('Word count:', words.length);
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
      setLoadingProfile(true);
      if (daoCanisterId) {
        try {
          const daoActor = createDaoActor(daoCanisterId);
          setDaoActor(daoActor)
          setVoteApi(daoActor);

          const daoDetails = await daoActor.get_dao_detail();
          setDao(daoDetails);

          // Fetch user profile
          const profileResponse = await backendActor.get_user_profile();
          if (profileResponse.Ok) {
            setUserProfile(profileResponse.Ok);
            const currentUserId = Principal.fromText(profileResponse.Ok.user_id.toString());
            const daoFollowers = await daoActor.get_dao_followers();
          setDaoFollowers(daoFollowers);
          setFollowersCount(daoFollowers.length);
          setIsFollowing(daoFollowers.some(follower => follower.toString() === currentUserId.toString()));
          const daoGroups = await daoActor.get_dao_groups();
          setDaoGroups(daoGroups);
          console.log(daoGroups);
          
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
          setLoadingProfile(false)
        } catch (error) {
          console.error('Error fetching DAO details:', error);
        } 
      }
    };

    const fetchProposals = async () => {
      setLoadingProposals(true);
      if (daoCanisterId) {
        try {
          const daoActor = createDaoActor(daoCanisterId);
          const start = (currentPage - 1) * itemsPerPage;
          const end = start + itemsPerPage;
    
          const proposals = await daoActor.get_all_proposals({ start, end });
          setProposals(proposals);
        } catch (error) {
          console.error("Error fetching proposals:", error);
        } finally {
          setLoadingProposals(false);
        }
      }
    };
    

    fetchDaoDetails();
    fetchProposals();
  }, [daoCanisterId, backendActor, createDaoActor, currentPage]);

  const handleJoinDao = async () => {

    if (joinStatus === 'Joined') {
      toast.error(res.Err);

      return;
    };

    setShowConfirmModal(true);
    
  };

  const confirmJoinDao = async () => {
    setLoading(true)
    try {
      const daohouseBackendId = Principal.fromText(process.env.CANISTER_ID_DAOHOUSE_BACKEND);
      const place_to_join = "Council";
  
      const joinDaoPayload = {
        place_to_join: place_to_join,
        daohouse_backend_id: daohouseBackendId,
      };
  
      const response = await daoActor.ask_to_join_dao(joinDaoPayload);
      console.log(response);
      const sound  = new Audio(messagesound);
    
      if (response.Ok) {
        setJoinStatus("Requested");
        toast.success(res.Ok);
        sound.play();
      } else {
        console.error(response.Err );
        toast.error(response.Err );
      }
    } catch (error) {
      setLoading(false)
      console.error('Error sending join request:', error);
      toast.error('Error sending join request');
    } finally {
      setShowConfirmModal(false);
      setLoading(false)
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


  const getImageUrl = (imageId) => {
    return `${protocol}://${canisterId}.${domain}/f/${imageId}`;
  };

  const handleClick = (linkName) => {
    setActiveLink(linkName);
    // navigate(`/dao/profile/${daoCanisterId}/${linkName}`);
  };



  if (!dao && !loadingProfile) {
    return <div className="flex mt-20"><NoDataComponent /></div>;
  }



  // Animation options for the big circle
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: BigCircleAnimation,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
      id: "lottie-bigCircle",
    },
  };

  // Animation options for the small circle
  const defaultOptions2 = {
    loop: true,
    autoplay: true,
    animationData: SmallCircleAnimation,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
      id: "lottie-smallCircle",
    },
  };

  // Animation options for the medium circle
  const defaultOptions3 = {
    loop: true,
    autoplay: true,
    animationData: SmallCircleAnimation,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
      id: "lottie-mediumCircle",
    },
  };


  return (
    <div className={className + " bg-zinc-200 w-full relative"}>
      <div
  className={
    className +
    "__topComponent w-full desktop:h-[220px] h-[168px] md:p-20 pt-6 pl-2 flex flex-col items-start md:justify-center relative"
  }
  style={{
    backgroundImage: `url("${MyProfileRectangle}")`,
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
    backgroundPosition: "center",
  }}
>
  <div className="absolute z-22 top-0 left-0 w-full h-full overflow-x-hidden">
    {/* Big circle image */}
    <div className="absolute md:right-[3.7%] -right-[3.7%] top-1/2 -translate-y-1/2">
      <div className="relative tablet:w-[96px] tablet:h-[96px] md:w-[88.19px] md:h-[88.19px] w-[65px] h-[65px]">
        <BigCircleComponent imgSrc={BigCircle} />
      </div>
      {/* Big circle animation */}
      <div className="absolute inset-0 flex items-center justify-center z-20">
        <div className="tablet:w-[112px] tablet:h-[112px] md:w-[104px] md:h-[104px] w-[75px] h-[75px]">
          <Lottie
            options={defaultOptions}
            style={{ width: "100%", height: "100%" }}
          />
        </div>
      </div>
    </div>

    {/* Smallest circle */}
    <div className="absolute right-[25%] -translate-y-full top-[30%]">
      <div className="relative tablet:w-[43px] tablet:h-[43px] md:w-[33.3px] md:h-[33.3px] w-[21.19px] h-[21.19px]">
        <SmallCircleComponent imgSrc={SmallestCircle} />
      </div>
      <div className="absolute inset-0 flex items-center justify-center z-20">
        <div className="tablet:w-[47px] tablet:h-[47px] md:w-[37.3px] md:h-[37.3px] w-[23.19px] h-[23.19px]">
          <Lottie
            options={defaultOptions2}
            style={{ width: "100%", height: "100%" }}
          />
        </div>
      </div>
    </div>

    {/* Medium circle */}
    <div className="absolute right-[45%] -translate-y-full top-[95%]">
      <div className="relative tablet:w-[52px] tablet:h-[52px] md:w-[43.25px] md:h-[43.25px] w-[29.28px] h-[29.28px]">
        <MediumCircleComponent imgSrc={MediumCircle} />
      </div>
      <div className="absolute inset-0 flex items-center justify-center z-20">
        <div className="tablet:w-[60px] tablet:h-[60px] md:w-[47.25px] md:h-[47.25px] w-[33.28px] h-[33.28px]">
          <Lottie
            options={defaultOptions3}
            style={{ width: "100%", height: "100%" }}
          />
        </div>
      </div>
    </div>
  </div>
</div>

{/* Loader Below */}

{loadingProfile ? (
  <div className="flex justify-center items-center py-8">
    <DaoProfileLoaderSkeleton />
  </div>
) : (

      <div className={"bg-[#c8ced3]"}>
        <Container classes={`${className} __mainComponent lg:py-8 lg:pb-20 py-6 tablet:px-28 px-6 tablet:flex-row gap-2 flex-col w-full`}>
        <div className="flex md:justify-between w-full md:gap-2 gap-10 z-20 relative flex-wrap">
          <div className="flex items-start">
            <div
              className="w-[85px] h-[49px] lg:w-[207px] lg:h-[120px] bg-[#C2C2C2] md:w-[145px] md:h-[84px] rounded overflow-hidden flex-shrink-0"
              style={{
                boxShadow:
                  "0px 0.26px 1.22px 0px #0000000A, 0px 1.14px 2.53px 0px #00000010, 0px 2.8px 5.04px 0px #00000014, 0px 5.39px 9.87px 0px #00000019, 0px 9.07px 18.16px 0px #0000001F, 0px 14px 31px 0px #00000029",
              }}
            >
              <img
                className="w-full h-full object-cover"
                src={dao?.image_id ? getImageUrl(dao?.image_id) : daoImage}
                alt="profile-pic"
              />
            </div>

            <div className="lg:ml-10 ml-4 flex flex-col items-start">
              <h2 className="lg:text-[40px] md:text-[24px] text-[16px] tablet:font-normal font-medium text-left text-[#05212C] truncate ... w-[200px] mini_phone:w-[215px] iphone_SE:w-[225px] small_phone:w-[250px] md:w-[350px] lg:w-[550px] xl:w-[500px] ">
                  {dao?.dao_name || 'Dao Name'}
              </h2>
              <div className="relative w-[200px] mini_phone:w-[215px] iphone_SE:w-[225px] small_phone:w-[250px] md:w-[550px] lg:w-[550px] xl:w-[500px] desktop:w-[600px] md:text-[24px] lg:text-[32px] font-normal text-[#05212C] user-acc-info]">
                <p className="text-[12px] tablet:text-[16px] font-normal text-start text-[#646464] break-words">
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

              <div className="flex justify-start mt-2 gap-4 ">
                <span className=" md:text-[24px] lg:text-[32px] font-normal text-[#05212C] user-acc-info">


                {dao?.proposals_count || 0}&nbsp;<span className=" md:text-[16px] mx-1">Proposals</span>

                </span>
                <span className="md:text-[24px] lg:text-[32px] font-normal text-[#05212C] user-acc-info">
                  {followersCount}&nbsp;<span className=" md:text-[16px] mx-1">Followers</span>
                </span>


              </div>
            </div>
          </div>
          {/* <div className="flex justify-between mt-[-20px] md:hidden">
            <span className="flex flex-col items-center justify-center font-normal">
              <span className="text-[22px] text-[#05212C]">{dao?.proposals_count || 0}</span>
              <span className=" text-[14px] mx-1">Proposals</span>
            </span>
            <span className="flex flex-col items-center justify-center font-normal ml-8">
              <span className="text-[22px] text-[#05212C]">{dao?.followers.length}</span>
              <span className=" text-[14px] mx-1">Followers</span>
            </span>
          </div> */}
          <div className="flex md:justify-end gap-4">
            <button
              onClick={toggleFollow}
              className="bg-[#0E3746] text-[16px] text-white shadow-xl lg:py-4 lg:px-3 rounded-[27px] lg:w-[131px] lg:h-[40px] md:w-[112px] md:h-[38px] w-[98px] h-[35px] lg:flex items-center justify-center rounded-2xl"
              style={{
                boxShadow:
                  "0px 0.26px 1.22px 0px #0000000A, 0px 1.14px 2.53px 0px #00000010, 0px 2.8px 5.04px 0px #00000014, 0px 5.39px 9.87px 0px #00000019, 0px 9.07px 18.16px 0px #0000001F, 0px 14px 31px 0px #00000029",
              }}
            >
              {isFollowing ? "Unfollow" : "Follow"}
            </button>
            <button
              onClick={handleJoinDao}
              className="bg-white text-[16px] text-[#05212C] shadow-xl lg:py-4 lg:px-3 rounded-[27px] lg:w-[131px] lg:h-[40px] md:w-[112px] md:h-[38px] w-[98px] h-[35px] lg:flex items-center justify-center rounded-2xl"
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
                      {loading ? (
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
        
        <div
          className={
            className +
            "__navs w-full overflow-auto flex flex-row justify-between mt-8 gap-12 lg:text-[16px] text-[14px] pb-2"
          }
        >
          <button
            onClick={(e) => {
              e.preventDefault();
              handleClick("proposals");
            }}
            className={`cursor-pointer text-nowrap ${
              activeLink === "proposals"
                ? "underline text-[#0E3746]"
                : "text-[#0E37464D]"
            }`}
          >
            Proposals
          </button>
          <button
            onClick={(e) => {
              e.preventDefault();
              handleClick("member_policy");
            }}
            className={`cursor-pointer text-nowrap ${
              activeLink === "member_policy"
                ? "underline text-[#0E3746]"
                : "text-[#0E37464D]"
            }`}
          >
            Members
          </button>
          <button
            onClick={(e) => {
              e.preventDefault();
              handleClick("followers");
            }}
            className={`cursor-pointer text-nowrap ${
              activeLink === "followers"
                ? "underline text-[#0E3746]"
                : "text-[#0E37464D]"
            }`}
          >
            Followers
          </button>
          {/* <button
            onClick={(e) => {
              e.preventDefault();
              handleClick("settings");
            }}
            className={`cursor-pointer text-nowrap ${
              activeLink === "settings"
                ? "underline text-[#0E3746]"
                : "text-[#0E37464D]"
            }`}
          >
            Settings
          </button> */}
        </div>
        {activeLink === "proposals" && ( <div>{ loadingProposals ? ( <ProposalLoaderSkeleton />) : (<ProposalsContent proposals={proposals} isMember={isMember} voteApi={voteApi} daoCanisterId={daoCanisterId} />)}</div> ) }
        {activeLink === "feeds" && <FeedsContent  />}
        {activeLink === "member_policy" && <Members daoGroups={daoGroups} daoMembers={daoMembers} />}
        {activeLink === "followers" && <FollowersContent daoFollowers={daoFollowers} daoCanisterId={daoCanisterId}/>}
        {activeLink === "funds" && <FundsContent />}
        {/* {activeLink === "settings" && <DaoSettings />} */}

        </Container>
      </div>
)}
    </div>
  );
};

export default DaoProfile;
