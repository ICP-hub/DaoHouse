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
import { useAuth } from "../../Components/utils/useAuthClient";
import { toast } from "react-toastify";

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

    try {
      const daoActor = createDaoActor(daoCanisterId);
      const newIsFollowing = !isFollowing;
      const response = newIsFollowing
        ? await daoActor.follow_dao()
        : await daoActor.unfollow_dao();

      if (response?.Ok) {
        toast.success(newIsFollowing ? "Successfully followed" : "Successfully unfollowed");
        setIsFollowing(newIsFollowing);

        // Update followers count
        const updatedFollowers = await daoActor.get_dao_followers();
        setFollowersCount(updatedFollowers.length);
      } else if (response?.Err) {
        toast.error(response.Err);
      }
    } catch (error) {
      console.error('Error following/unfollowing DAO:', error);
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
    return <div>Loading...</div>;
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
            <div className="relative tablet:w-[52px] tablet:h-[52px] md:w-[43.25px] md:h-[43.25px] w-[29.28px] h-[29.28px]">
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
      <div className={"bg-[#F7F7F7] " + className + "__bottomComponent py-10 flex flex-col md:pl-32 pl-10"}>
        <div className="relative max-w-6xl w-full mx-auto bg-white rounded-md p-6 shadow-lg flex flex-col md:flex-row gap-6">
          <div className="flex flex-col md:w-1/4 gap-6 items-center justify-center">
            <img
              src={MyProfileImage}
              className="md:w-[150px] w-[120px] rounded-full"
              alt="Profile"
            />
            <h2 className="text-2xl font-bold">{dao.name}</h2>
            <p className="text-sm text-gray-500">{dao.description}</p>
            <button
              onClick={toggleFollow}
              className={`py-2 px-4 rounded-full text-white ${
                isFollowing ? "bg-red-500" : "bg-blue-500"
              }`}
            >
              {isFollowing ? "Unfollow" : "Follow"}
            </button>
            <p className="text-sm text-gray-500">{followersCount} Followers</p>
          </div>
          <div className="flex flex-col w-full gap-6">
            <Container>
              <div className="flex justify-around">
                <button
                  onClick={() => handleClick("proposals")}
                  className={`py-2 px-4 rounded-lg ${
                    activeLink === "proposals"
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200"
                  }`}
                >
                  Proposals
                </button>
                <button
                  onClick={() => handleClick("feeds")}
                  className={`py-2 px-4 rounded-lg ${
                    activeLink === "feeds" ? "bg-blue-500 text-white" : "bg-gray-200"
                  }`}
                >
                  Feeds
                </button>
                <button
                  onClick={() => handleClick("members")}
                  className={`py-2 px-4 rounded-lg ${
                    activeLink === "members" ? "bg-blue-500 text-white" : "bg-gray-200"
                  }`}
                >
                  Members
                </button>
                <button
                  onClick={() => handleClick("followers")}
                  className={`py-2 px-4 rounded-lg ${
                    activeLink === "followers" ? "bg-blue-500 text-white" : "bg-gray-200"
                  }`}
                >
                  Followers
                </button>
                <button
                  onClick={() => handleClick("funds")}
                  className={`py-2 px-4 rounded-lg ${
                    activeLink === "funds" ? "bg-blue-500 text-white" : "bg-gray-200"
                  }`}
                >
                  Funds
                </button>
                <button
                  onClick={() => handleClick("settings")}
                  className={`py-2 px-4 rounded-lg ${
                    activeLink === "settings" ? "bg-blue-500 text-white" : "bg-gray-200"
                  }`}
                >
                  Settings
                </button>
              </div>
              <div className="mt-6">
                {activeLink === "proposals" && <ProposalsContent proposals={proposals} />}
                {activeLink === "feeds" && <FeedsContent />}
                {activeLink === "members" && <Members />}
                {activeLink === "followers" && <FollowersContent />}
                {activeLink === "funds" && <FundsContent />}
                {activeLink === "settings" && <DaoSettings />}
              </div>
            </Container>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DaoProfile;
