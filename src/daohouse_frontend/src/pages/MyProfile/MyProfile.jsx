import React, { useEffect, useMemo, useState } from "react";
import Lottie from "react-lottie";
import { Link, useNavigate } from "react-router-dom";
import { FaArrowRightLong } from "react-icons/fa6";

import EditPen from "../../../assets/edit_pen.png";
import MyProfileImage from "../../../assets/Avatar.png";
import BigCircle from "../../../assets/BigCircle.png";
import MediumCircle from "../../../assets/MediumCircle.png";
import SmallestCircle from "../../../assets/SmallestCircle.png";
import MyProfileRectangle from "../../../assets/MyProfileRectangle.png";
import BigCircleAnimation from "../../Components/Ellipse-Animation/BigCircle/BigCircleAnimation.json";
import SmallCircleAnimation from "../../Components/Ellipse-Animation/SmallCircle/SmallCircleAnimation.json";
import BigCircleComponent from "../../Components/Ellipse-Animation/BigCircle/BigCircleComponent";
import MediumCircleComponent from "../../Components/Ellipse-Animation/MediumCircle/MediumCircleComponent";
import SmallCircleComponent from "../../Components/Ellipse-Animation/SmallCircle/SmallCircleComponent";
import ProfileTitleDivider from "../../Components/ProfileTitleDivider/ProfileTitleDivider";
import { useUserProfile } from "../../context/UserProfileContext";
import Container from "../../Components/Container/Container";
import { useAuth } from "../../Components/utils/useAuthClient";
import NoFollowers from "./NoFollowers";
import NoFollowing from "./NoFollowing";

const MyProfile = ({ childComponent }) => {
  const { backendActor, identity } = useAuth();
  const { userProfile } = useUserProfile() || {};

  const protocol = process.env.DFX_NETWORK === "ic" ? "https" : "http";
  const domain = process.env.DFX_NETWORK === "ic" ? "raw.icp0.io" : "localhost:4943";
  const [imageSrc, setImageSrc] = useState(MyProfileImage);

  useEffect(() => {
    console.log("User Profile Image:", userProfile?.profile_img);
    if (userProfile?.profile_img) {
      const profileImageUrl = `${protocol}://${process.env.CANISTER_ID_IC_ASSET_HANDLER}.${domain}/f/${userProfile.profile_img}`;
      console.log("Profile Image URL:", profileImageUrl);
      setImageSrc(profileImageUrl);
    } else {
      console.log("No profile image found. Using default.");
      setImageSrc(MyProfileImage);
    }
  }, [userProfile]);
  

  const handleImageError = () => {
    setImageSrc(MyProfileImage); // Fallback to default image if there's an error loading the profile image
  };

  const [activeTab, setActiveTab] = useState(0);
  const [showNoFollowers, setShowNoFollowers] = useState(false);
  const [showNoFollowing, setShowNoFollowing] = useState(false); // New state for NoFollowing component
  const navigate = useNavigate();
  const className = "MyProfile";
  const tabButtonsStyle = "my-1 big_phone:text-base mobile:text-md text-sm flex flex-row items-center gap-2 hover:text-white";

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

  const [data, setData] = useState({});
  const followers = data?.followers_count ? Number(data.followers_count) : 0;
  const post = data?.post_count ? Number(data.post_count) : 0;
  const following = data?.followings_count ? Number(data.followings_count) : 0;
  const email = data?.email_id;
  const name = data?.username;

  const getData = async () => {
    try {
      const response = await backendActor.get_user_profile();
      console.log("api response", response);
      setData(response.Ok || {});
    } catch (error) {
      console.error("Error :", error);
    }
  };

  useEffect(() => {
    getData();
  }, [backendActor]);

  useEffect(() => {
    if (activeTab === 2 && followers === 0) {
      setShowNoFollowers(true);
    } else {
      setShowNoFollowers(false);
    }
  }, [activeTab, followers]);

  useEffect(() => {
    if (activeTab === 3 && following === 0) {
      setShowNoFollowing(true);
    } else {
      setShowNoFollowing(false);
    }
  }, [activeTab, following]); // Updated to include following

  return (
    <div className={`${className} bg-zinc-200 w-full  relative`}>
      <div
        style={{
          backgroundImage: `url("${MyProfileRectangle}")`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <Container classes={` ${className} __topComponent w-full lg:h-[25vh] h-[18vh] md:p-20 pt-6 pl-2 flex flex-col items-start md:justify-center relative`}>
          <div className="absolute z-22 top-0 left-0 w-full h-full overflow-x-hidden">
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
            <div className="absolute right-[45%] -translate-y-full top-[95%]">
              <div className="relative tablet:w-[52px] tablet:h-[52px] md:w-[43.25px] md:h-[43.25px] w-[29.28px] h-[29.28px]">
                <MediumCircleComponent imgSrc={MediumCircle} />
              </div>
              <div className="absolute inset-0 flex items-center justify-center z-20">
                <div className="tablet:w-[60px] tablet:h-[60px] md:w-[47.25px] md:h-[47.25px] w-[33.28px] h-[33.28px]">
                  <Lottie options={defaultOptions3} style={{ width: "100%", height: "100%" }} />
                </div>
              </div>
            </div>
          </div>
          <ProfileTitleDivider title="My Profile" />
        </Container>
      </div>
      <div className={`bg-[#c8ced3]`}>
        <Container classes={`__mainComponent big_phone:py-8 big_phone:pb-20 py-7  md:px-8 flex md:flex-row gap-2 flex-col w-full user-container`}>
          <div className={`${className}__mainComponent__leftSide md:mx-0 mx-5  lg:px-20 flex flex-col tablet:items-start justify-center md:h-[580px] lg:w-[280px]  translate-y-[-30px] lg:h-[870px] md:px-14 rounded-[10px] bg-[#0E3746] text-white text-opacity-50 font-normal md:mt-[-65px] mt-[-45px] z-20`}>
            <div className="flex md:flex-col flex-row items-start md:justify-center justify-around gap-y-6 translate-y-[-33px]  py-50 md:py-90 lg:text-base md:text-sm text-nowrap">
              <Link to="/my-profile" onClick={() => setActiveTab(0)}>
                <p className={`${tabButtonsStyle} ${activeTab === 0 ? "text-white" : ""}`}>My Profile{activeTab === 0 ? <FaArrowRightLong className="md:inline hidden" /> : ""}</p>
              </Link>
              <Link to="/my-profile/posts" onClick={() => setActiveTab(1)}>
                <p className={`${tabButtonsStyle} ${activeTab === 1 ? "text-white" : ""}`}>Posts {activeTab === 1 ? <FaArrowRightLong className="md:inline hidden" /> : ""}</p>
              </Link>
              <Link to="/my-profile/followers" onClick={() => setActiveTab(2)}>
                <p className={`${tabButtonsStyle} ${activeTab === 2 ? "text-white" : ""}`}>Followers {activeTab === 2 ? <FaArrowRightLong className="md:inline hidden" /> : ""}</p>
              </Link>
              <Link to="/my-profile/following" onClick={() => setActiveTab(3)}>
                <p className={`${tabButtonsStyle} ${activeTab === 3 ? "text-white" : ""}`}>Following {activeTab === 3 ? <FaArrowRightLong className="md:inline hidden" /> : ""}</p>
              </Link>
            </div>
          </div>
          <div className={`${className}__rightSide w-full`}>
            <div className="flex md:justify-between justify-around w-full gap-2 relative">
              <div className="flex items-start md:-ml-[10%] tablet:ml-[-90px] relative">
              <div
  className="fixed-image-container w-[175px] h-[165px] rounded-md overflow-hidden z-50"
  style={{
    boxShadow: "0px 0.26px 1.22px 0px #0000000A, 0px 1.14px 2.53px 0px #00000010, 0px 2.8px 5.04px 0px #00000014, 0px 5.39px 9.87px 0px #00000019, 0px 9.07px 18.16px 0px #0000001F, 0px 14px 31px 0px #00000029",
    transform: "translateY(-75px) translateX(-136px)" // Adjust values as needed
  }}
>
  <img
    className="w-full h-full object-cover"
    src={imageSrc} // Dynamically set to user's profile image or default
    alt="profile-pic"
    onError={handleImageError} // Handle image loading errors
  />
</div>

                <div className="mr-20 translate-x-[-37px] ">
                  <h2 className="   tablet:text-[32px] md:text-[24px] text-[16px] tablet:font-normal font-medium text-left text-[#05212C]">
                    {name || "Username.user"}{" "}
                  </h2>
                  <p className="md:text-[14px] text-[10px] tablet:text-[16px] font-normal text-left text-[#646464]">
                    {email || "gmail@gmail.xyz"}{" "}
                  </p>
                  <div className="md:flex hidden justify-between mt-3">
                    <span className="md:mr-5 tablet:text-[32px] text-[24px] font-normal text-[#05212C] user-acc-info">
                      {post}
                      <span className="tablet:text-[16px] text-[14px] mx-1">
                        Posts
                      </span>
                    </span>
                    <span className="md:mx-5 tablet:text-[32px] text-[24px] font-normal text-[#05212C] user-acc-info">
                      {followers}
                      <span className="tablet:text-[16px] text-[14px] mx-1">
                        Followers
                      </span>
                    </span>
                    <span className="md:mx-5 tablet:text-[32px] text-[24px] font-normal text-[#05212C] user-acc-info">
                      {following}
                      <span className="tablet:text-[16px] text-[14px] mx-1">
                        Following
                      </span>
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-4 tablet:mt-4 tablet:mr-4">
                {activeTab === 0 && (
                  <button
                    onClick={() => navigate("/edit-profile")}
                    className="bg-white text-[16px] text-[#05212C] gap-1 shadow-xl md:px-3 rounded-[27px] tablet:w-[181px] tablet:h-[40px] md:w-[151px] md:h-[35px] w-[2.5rem] h-[2.5rem] flex items-center justify-center space-x-4 rounded-2xl"
                  >
                    <img
                      src={EditPen}
                      alt="edit"
                      className="tablet:mr-2 h-4 w-4 edit-pen"
                    />
                    <span className="md:inline hidden whitespace-nowrap">
                      {userProfile === null ? "Complete Profile" : "Edit Profile"}
                    </span>
                  </button>
                )}
              </div>

            </div>
            <div className="flex justify-start gap-8 p-4 mx-6 md:hidden text-center text-[#05212C]">
              <div className="text-[22px] font-semibold ">
                {userProfile?.post_count}{" "}
                <div className="text-[15px] font-medium">Posts</div>
              </div>
              <div className="text-[22px] font-semibold ">
                {userProfile?.followers_count}{" "}
                <div className="text-[15px] font-medium">Followers</div>
              </div>
              <div className="text-[22px] font-semibold ">
                {userProfile?.followings_count}{" "}
                <div className="text-[15px] font-medium">Following</div>
              </div>
            </div>
            {childComponent}
            {activeTab === 2 && showNoFollowers && <NoFollowers setFollowers={setShowNoFollowers} />}
            {activeTab === 3 && showNoFollowing && <NoFollowing />} {/* Render NoFollowing component */}
          </div>
        </Container>
      </div>
    </div>
  );
};

export default MyProfile;
