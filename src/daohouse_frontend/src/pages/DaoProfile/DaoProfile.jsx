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

  // Animation options
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: BigCircleAnimation,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
      id: "lottie-bigCircle",
    },
  };

  const defaultOptions2 = {
    loop: true,
    autoplay: true,
    animationData: SmallCircleAnimation,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
      id: "lottie-smallCircle",
    },
  };

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
      <div className={"bg-[#F7F7F7] " + className + "__bottomComponent py-10 flex flex-col"}>
        <Container>
          <div className={className + "__content md:flex justify-between mb-6"}>
            <div className="md:w-[40%]">
              <div className="text-center md:text-start">
                <img
                  className="md:w-40 w-32 h-32 md:h-40 rounded-full object-cover border-2 border-[#005DA6]"
                  src={MyProfileImage}
                  alt="Profile"
                />
              </div>
            </div>
            <div className="md:w-[60%] md:px-6 md:pt-4">
              <h1 className="text-3xl font-bold text-blue-700">{dao.name}</h1>
              <p className="mt-2 text-gray-600">{dao.description}</p>
              <div className="flex gap-2 mt-4">
                <button
                  onClick={toggleFollow}
                  className={`py-2 px-4 rounded ${
                    isFollowing
                      ? "bg-red-500 text-white"
                      : "bg-blue-500 text-white"
                  }`}
                >
                  {isFollowing ? "Unfollow" : "Follow"}
                </button>
                <button className="py-2 px-4 bg-gray-300 rounded">Join</button>
              </div>
            </div>
          </div>

          <div className={className + "__navigation flex justify-around bg-white py-4"}>
            <button
              className={`px-4 py-2 ${activeLink === "proposals" ? "border-b-2 border-blue-700" : ""}`}
              onClick={() => handleClick("proposals")}
            >
              Proposals
            </button>
            <button
              className={`px-4 py-2 ${activeLink === "feeds" ? "border-b-2 border-blue-700" : ""}`}
              onClick={() => handleClick("feeds")}
            >
              Feeds
            </button>
            <button
              className={`px-4 py-2 ${activeLink === "members" ? "border-b-2 border-blue-700" : ""}`}
              onClick={() => handleClick("members")}
            >
              Members
            </button>
            <button
              className={`px-4 py-2 ${activeLink === "followers" ? "border-b-2 border-blue-700" : ""}`}
              onClick={() => handleClick("followers")}
            >
              Followers
            </button>
            <button
              className={`px-4 py-2 ${activeLink === "funds" ? "border-b-2 border-blue-700" : ""}`}
              onClick={() => handleClick("funds")}
            >
              Funds
            </button>
          </div>

          {activeLink === "proposals" && <ProposalsContent proposals={proposals} />}
          {activeLink === "feeds" && <FeedsContent />}
          {activeLink === "members" && <Members />}
          {activeLink === "followers" && <FollowersContent followersCount={followersCount} />}
          {activeLink === "funds" && <FundsContent />}
        </Container>
      </div>
      <DaoSettings />
    </div>
  );
};

export default DaoProfile;
