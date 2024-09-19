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
import MyProfileImage from "../../../assets/MyProfile-img.png";
import ProposalsContent from "../../Components/DaoProfile/ProposalsContent";
import FeedsContent from "../../Components/DaoProfile/FeedsContent";
import Members from "../../Components/DaoProfile/Members";
import FollowersContent from "../../Components/DaoProfile/FollowersContent";
import FundsContent from "../../Components/DaoProfile/FundsContent";
import DaoSettings from "../../Components/DaoSettings/DaoSettings";
import Container from "../../Components/Container/Container";
import { Principal } from '@dfinity/principal';
import { useAuth, useAuthClient } from "../../Components/utils/useAuthClient";
import { useUserProfile } from "../../context/UserProfileContext";
import { toast } from "react-toastify";
import MuiSkeleton from "../../Components/Skeleton/MuiSkeleton";


const DaoProfile = () => {

  const className = "DaoProfile";
  const [activeLink, setActiveLink] = useState("proposals");
  const { backendActor, createDaoActor } = useAuth();
  const [dao, setDao] = useState(null);
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(false);
  const canisterId = process.env.CANISTER_ID_IC_ASSET_HANDLER;
  const protocol = process.env.DFX_NETWORK === "ic" ? "https" : "http";
  const domain = process.env.DFX_NETWORK === "ic" ? "raw.icp0.io" : "localhost:4943";
  const { daoCanisterId } = useParams();
  const [joinStatus, setJoinStatus] = useState("Join DAO"); // 'Join DAO', 'Requested', 'Joined'
  const [isMember, setIsMember] = useState(false);
  const [voteApi, setVoteApi] = useState({})
  const [daoFollowers, setDaoFollowers] = useState([])
  const [daoMembers, setDaoMembers] = useState([])
  const [isExpanded, setIsExpanded] = useState(false);
  const maxWords = 250;
  
  const toggleExpanded = () => setIsExpanded(!isExpanded);
  const navigate = useNavigate();

  const [isFollowing, setIsFollowing] = useState(false);
  const [followersCount, setFollowersCount] = useState(0);
  const [userProfile, setUserProfile] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

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
      if (daoCanisterId) {
        setLoading(true);
        try {
          const itemsPerPage = 8;
          const start = (currentPage - 1) * itemsPerPage;
          const end = start + itemsPerPage;
          const paginationPayload = {
            start,
            end,
          }
          const daoActor = createDaoActor(daoCanisterId);
          setVoteApi(daoActor)
          console.log("daoActor",{daoActor});
          
          const daoDetails = await daoActor.get_dao_detail();
          console.log(daoDetails);
          
          const proposals = await daoActor.get_all_proposals(paginationPayload)
          console.log(proposals, " proposals aa rhe")
          console.log(proposals.map(proposal => proposal.proposal_description), " proposals descriptions");
          setDao(daoDetails);
          setProposals(proposals)

          const profileResponse = await backendActor.get_user_profile();
          if (profileResponse.Ok) {
            setUserProfile(profileResponse.Ok);
            const currentUserId = Principal.fromText(profileResponse.Ok.user_id.toString());

            const daoFollowers = await daoActor.get_dao_followers();
            setDaoFollowers(daoFollowers);
            console.log(daoFollowers);
            
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
      console.log({daoActor});
      
      const response = await daoActor.ask_to_join_dao(daoCanisterId);
      if (response.Ok) {
        setJoinStatus("Requested");
        toast.success("Join request sent successfully");
      } else {
        console.error("Failed to send join request:", response.Err || "Unknown error");
        toast.error(`Failed to send join request: ${response.Err || "Unknown error"}`);
      }
    } catch (error) {
      console.error('Error sending join request:', error);
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


  // if (loading) {
  //   // return <Loader />;
  //   // return <MuiSkeleton/>
  
  // }

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
    <div className={className + " bg-zinc-200 w-full relative mt-[90px]"}>
      <div
        className={
          className +
          "__topComponent w-full lg:h-[25vh] h-[20vh] md:p-20 pt-6 pl-2 flex flex-col items-start md:justify-center relative"
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
          <div className="absolute right-[25%] -translate-y-full top-[30%]">
            <div className="relative tablet:w-[43px] tablet:h-[43px] md:w-[33.3px] md:h-[33.3px] w-[21.19px] h-[21.19px]">
              {/* Smallest circle image */}
              <SmallCircleComponent imgSrc={SmallestCircle} />
            </div>
            {/* Small circle animation */}
            <div className="absolute inset-0 flex items-center justify-center z-20">
              <div className="tablet:w-[47px] tablet:h-[47px] md:w-[37.3px] md:h-[37.3px] w-[23.19px] h-[23.19px]">
                <Lottie
                  options={defaultOptions2}
                  style={{ width: "100%", height: "100%" }}
                />
              </div>
            </div>
          </div>
          {/* Medium circle image */}
          <div className="absolute right-[45%] -translate-y-full top-[95%]">
            <div className="relative tablet:w-[52px] tablet:h-[52px] md:w-[43.25px] md:h-[43.25px] w-[29.28px] h-[29.28px] ">
              <MediumCircleComponent imgSrc={MediumCircle} />
            </div>
            {/* Medium circle animation */}
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
      <div className={"bg-[#c8ced3]"}>
        <Container classes={`${className} __mainComponent lg:py-8 lg:pb-20 py-6 big_phone:px-8 px-6 tablet:flex-row gap-2 flex-col w-full`}>

  {/**           <div className="flex md:justify-between w-full md:gap-2 gap-10 z-50 relative flex-wrap">
//             <div className="flex items-center">
//               <div
//                 className="w-[85px] h-[49px] lg:w-[207px] lg:h-[120px] bg-[#C2C2C2] md:w-[145px] md:h-[84px] rounded overflow-hidden"
//                 style={{
//                   boxShadow:
//                     "0px 0.26px 1.22px 0px #0000000A, 0px 1.14px 2.53px 0px #00000010, 0px 2.8px 5.04px 0px #00000014, 0px 5.39px 9.87px 0px #00000019, 0px 9.07px 18.16px 0px #0000001F, 0px 14px 31px 0px #00000029",
//                 }}
//               >
//                 <img
//                   className="w-full h-full object-cover"
//                   src={getImageUrl(dao.image_id)}
//                   alt="profile-pic"
//                 />
//               </div>

//             </div>

// =======  */}
        <div className="flex md:justify-between w-full md:gap-2 gap-10 z-50 relative flex-wrap">
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
                src={getImageUrl(dao.image_id)}
                alt="profile-pic"
              />
            </div>

            <div className="lg:ml-10 ml-4">
              <h2 className="lg:text-[40px] md:text-[24px] text-[16px] tablet:font-normal font-medium text-left text-[#05212C] truncate ... w-[30vw] md:w-[50vw]">
                  {dao.dao_name || 'Dao Name'}
              </h2>
              <div className="relative w-[60vw] md:w-[65vw] lg:w-[50vw]">
                <p className="text-[12px] tablet:text-[16px] font-normal text-left text-[#646464] break-words">
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

              <div className="md:flex justify-start mt-2 hidden">
                <span className="tablet:mr-5 md:text-[24px] lg:text-[32px] font-normal text-[#05212C] user-acc-info">


                {dao.proposals_count || 0} <span className=" md:text-[16px] mx-1">Proposals</span>

                </span>
                <span className="md:mx-5 md:text-[24px] lg:text-[32px] font-normal text-[#05212C] user-acc-info">
                  {followersCount}<span className=" md:text-[16px] mx-1">Followers</span>
                </span>


              </div>
            </div>
          </div>
          <div className="flex justify-between mt-[-20px] md:hidden">
            <span className="flex flex-col items-center justify-center font-normal">
              <span className="text-[22px] text-[#05212C]">{dao.proposals_count || 0}</span>
              <span className=" text-[14px] mx-1">Proposals</span>
            </span>
            <span className="flex flex-col items-center justify-center font-normal ml-8">
              <span className="text-[22px] text-[#05212C]">{dao.followers.length}</span>
              <span className=" text-[14px] mx-1">Followers</span>
            </span>
          </div>
          <div className="flex md:justify-end gap-4 md:mt-4 tablet:mr-4">
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
          </div>
        </div>
        <div
          className={
            className +
            "__navs w-full overflow-auto flex flex-row justify-between mt-8 md:w-[90%] lg:w-[70%] xl:w-[60%] gap-12 lg:text-[16px] text-[14px] pb-2"
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
      {/** <button
            onClick={(e) => {
              e.preventDefault();
              handleClick("feeds");
            }}
            className={`cursor-pointer text-nowrap ${
              activeLink === "feeds"
                ? "underline text-[#0E3746]"
                : "text-[#0E37464D]"
            }`}
          >
            Feeds
          </button> 
          <button
            onClick={(e) => {
              e.preventDefault();
              handleClick("funds");
            }}
            className={`cursor-pointer text-nowrap ${
              activeLink === "funds"
                ? "underline text-[#0E3746]"
                : "text-[#0E37464D]"
            }`}
          >
            Funds
          </button>
// <<<<<<< pratap
//             <button
//               onClick={(e) => {
//                 e.preventDefault();
//                 handleClick("member_policy");
//               }}
//               className={`cursor-pointer text-nowrap ${activeLink === "member_policy"
//                 ? "underline text-[#0E3746]"
//                 : "text-[#0E37464D]"
//                 }`}
//             >
//               Members
//             </button>
//             <button
//               onClick={(e) => {
//                 e.preventDefault();
//                 handleClick("followers");
//               }}
//               className={`cursor-pointer text-nowrap ${activeLink === "followers"
//                 ? "underline text-[#0E3746]"
//                 : "text-[#0E37464D]"
//                 }`}
//             >
//               Followers
//             </button>
//             <button
//               onClick={(e) => {
//                 e.preventDefault();
//                 handleClick("settings");
//               }}
//               className={`cursor-pointer text-nowrap ${activeLink === "settings"
//                 ? "underline text-[#0E3746]"
//                 : "text-[#0E37464D]"
//                 }`}
//             >
//               Settings
//             </button>
//           </div>
//           {activeLink === "proposals" && <ProposalsContent proposals={proposals} />}
//           {activeLink === "feeds" && <FeedsContent />}
//           {activeLink === "member_policy" && <Members />}
//           {activeLink === "followers" && <FollowersContent />}
//           {activeLink === "funds" && <FundsContent />}
//           {activeLink === "settings" && <DaoSettings />}
// ======= */}
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
          <button
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
          </button>
        </div>
        {activeLink === "proposals" && <ProposalsContent proposals={proposals} isMember={isMember} voteApi={voteApi} />}
        {activeLink === "feeds" && <FeedsContent  />}
        {activeLink === "member_policy" && <Members  />}
        {activeLink === "followers" && <FollowersContent daoFollowers={daoFollowers}/>}
        {activeLink === "funds" && <FundsContent />}
        {activeLink === "settings" && <DaoSettings />}

        </Container>
      </div>
    </div>
  );
};

export default DaoProfile;
