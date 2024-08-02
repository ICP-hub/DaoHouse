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
import DaoSettings from "../../Components/DaoSettings/DaoSettings";
import Container from "../../Components/Container/Container";
import { Principal } from '@dfinity/principal';
import { useAuth, useAuthClient } from "../../Components/utils/useAuthClient";
import { toast } from "react-toastify";
import Loader from "../../Components/utils/Loader";

const DaoProfile = () => {
  const className = "DaoProfile";
  const [activeLink, setActiveLink] = useState("proposals");
  const { backendActor, createDaoActor } = useAuth();
  const [dao, setDao] = useState(null);
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(false);
  const { daoCanisterId } = useParams();
  const navigate = useNavigate();

  const [isFollowing, setIsFollowing] = useState(false);
  const [followersCount, setFollowersCount] = useState(0);
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    const fetchDaoDetails = async () => {
      if (daoCanisterId) {
        setLoading(true);
        try {
          const daoActor = createDaoActor(daoCanisterId);
          const daoDetails = await daoActor.get_dao_detail();
          const proposals = await daoActor.get_all_proposals();

          setDao(daoDetails);
          setProposals(proposals);

          const profileResponse = await backendActor.get_user_profile();
          if (profileResponse.Ok) {
            setUserProfile(profileResponse.Ok);
            const currentUserId = Principal.fromText(profileResponse.Ok.user_id.toString());

            const daoFollowers = await daoActor.get_dao_followers();
            setFollowersCount(daoFollowers.length);
            setIsFollowing(daoFollowers.some(follower => follower.toString() === currentUserId.toString()));
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

  const toggleFollow = async () => {
    if (!userProfile) return;

    const newIsFollowing = !isFollowing;
    setIsFollowing(newIsFollowing);
    setFollowersCount(prevCount => newIsFollowing ? prevCount + 1 : prevCount - 1);

    try {
      const daoActor = createDaoActor(daoCanisterId);
      const response = newIsFollowing
        ? await daoActor.follow_dao()
        : await daoActor.unfollow_dao();

      if (response?.Ok) {
        toast.success(newIsFollowing ? "Successfully followed" : "Successfully unfollowed");
      } else if (response?.Err) {
        setIsFollowing(!newIsFollowing);
        setFollowersCount(prevCount => newIsFollowing ? prevCount - 1 : prevCount + 1);
        toast.error(response.Err);
      }
    } catch (error) {
      console.error('Error following/unfollowing DAO:', error);
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

  if (loading) {
    return <Loader />;
  }

  if (!dao) {
    return <div>No DAO details available</div>;
  }

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: BigCircleAnimation,
    rendererSettings: { preserveAspectRatio: "xMidYMid slice" },
  };

  const defaultOptions2 = {
    loop: true,
    autoplay: true,
    animationData: SmallCircleAnimation,
    rendererSettings: { preserveAspectRatio: "xMidYMid slice" },
  };

  const defaultOptions3 = {
    loop: true,
    autoplay: true,
    animationData: SmallCircleAnimation,
    rendererSettings: { preserveAspectRatio: "xMidYMid slice" },
  };

  return (
    <div className={className + " bg-zinc-200 w-full relative"}>
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
            <div className="absolute inset-0 flex items-center justify-center z-20">
              <div className="tablet:w-[112px] tablet:h-[112px] md:w-[104px] md:h-[104px] w-[75px] h-[75px]">
                <Lottie options={defaultOptions} style={{ width: "100%", height: "100%" }} />
              </div>
            </div>
          </div>
          <div className="absolute right-[25%] -translate-y-full top-[30%]">
            <div className="relative tablet:w-[43px] tablet:h-[43px] md:w-[33.3px] md:h-[33.3px] w-[21.19px] h-[21.19px]">
              <SmallCircleComponent imgSrc={SmallestCircle} />
            </div>
            <div className="absolute inset-0 flex items-center justify-center z-20">
              <div className="tablet:w-[47px] tablet:h-[47px] md:w-[37.3px] md:h-[37.3px] w-[23.19px] h-[23.19px]">
                <Lottie options={defaultOptions2} style={{ width: "100%", height: "100%" }} />
              </div>
            </div>
          </div>
          <div className="absolute right-[0%] top-[30%]">
            <div className="relative tablet:w-[43px] tablet:h-[43px] md:w-[33.3px] md:h-[33.3px] w-[21.19px] h-[21.19px]">
              <MediumCircleComponent imgSrc={MediumCircle} />
            </div>
            <div className="absolute inset-0 flex items-center justify-center z-20">
              <div className="tablet:w-[47px] tablet:h-[47px] md:w-[37.3px] md:h-[37.3px] w-[23.19px] h-[23.19px]">
                <Lottie options={defaultOptions3} style={{ width: "100%", height: "100%" }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Profile and action buttons */}
      <div className="flex flex-col items-center relative z-10">
        <div className="text-2xl font-bold mt-4">{dao?.dao_name}</div>
        <div className="text-xl mt-2">{dao?.dao_description}</div>
        <div className="flex mt-4">
          <button onClick={toggleFollow} className={`py-2 px-4 ${isFollowing ? 'bg-blue-500' : 'bg-gray-500'} text-white`}>
            {isFollowing ? 'Unfollow' : 'Follow'}
          </button>
          <span className="ml-4">{followersCount} Followers</span>
        </div>
      </div>

      {/* Navigation Links */}
      <div className="flex justify-center mt-8">
        <button onClick={() => handleClick('proposals')} className={activeLink === 'proposals' ? 'text-blue-500' : ''}>Proposals</button>
        <button onClick={() => handleClick('feeds')} className={activeLink === 'feeds' ? 'text-blue-500' : ''}>Feeds</button>
        <button onClick={() => handleClick('members')} className={activeLink === 'members' ? 'text-blue-500' : ''}>Members</button>
        <button onClick={() => handleClick('followers')} className={activeLink === 'followers' ? 'text-blue-500' : ''}>Followers</button>
        <button onClick={() => handleClick('funds')} className={activeLink === 'funds' ? 'text-blue-500' : ''}>Funds</button>
        <button onClick={() => handleClick('settings')} className={activeLink === 'settings' ? 'text-blue-500' : ''}>Settings</button>
      </div>

      {/* Content based on active link */}
      <Container>
        {activeLink === 'proposals' && <ProposalsContent proposals={proposals} />}
        {activeLink === 'feeds' && <FeedsContent />}
        {activeLink === 'members' && <Members />}
        {activeLink === 'followers' && <FollowersContent />}
        {activeLink === 'funds' && <FundsContent />}
        {activeLink === 'settings' && <DaoSettings />}
      </Container>
    </div>
  );
};

export default DaoProfile;
