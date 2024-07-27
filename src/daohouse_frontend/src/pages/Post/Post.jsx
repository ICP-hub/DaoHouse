import React, { useEffect, useState } from "react";
import Lottie from "react-lottie";
import { Link } from "react-router-dom";
import { FaTelegramPlane } from "react-icons/fa";
import { FaHeart, FaArrowLeftLong } from "react-icons/fa6";
import { BiSolidCommentDetail } from "react-icons/bi";
import { usePostContext } from "../../PostProvider";
import Comments from "./Comments";
import MyProfileImage from "../../../assets/MyProfile-img.png";
import BigCircle from "../../../assets/BigCircle.png";
import SmallestCircle from "../../../assets/SmallestCircle.png";
import MediumCircle from "../../../assets/MediumCircle.png";
import MyProfileRectangle from "../../../assets/MyProfileRectangle.png";
import BigCircleAnimation from "../../Components/Ellipse-Animation/BigCircle/BigCircleAnimation.json";
import SmallCircleAnimation from "../../Components/Ellipse-Animation/SmallCircle/SmallCircleAnimation.json";
import BigCircleComponent from "../../Components/Circles/BigCircleComponent";
import MediumCircleComponent from "../../Components/Circles/MediumCircleComponent";
import SmallCircleComponent from "../../Components/Circles/SmallCircleComponent";
import ProfileTitleDivider from "../../Components/ProfileTitleDivider/ProfileTitleDivider";
import { useAuth } from "../../Components/utils/useAuthClient";
import { useUserProfile } from "../../context/UserProfileContext";

const Post = () => {
  const { selectedPost } = usePostContext();
  const className = "Post";
  const canisterId = process.env.CANISTER_ID_IC_ASSET_HANDLER;
  const { backendActor, frontendCanisterId, identity } = useAuth();
  const { userProfile, fetchUserProfile } = useUserProfile();
  const protocol = process.env.DFX_NETWORK === "ic" ? "https" : "http";
  const domain = process.env.DFX_NETWORK === "ic" ? "raw.icp0.io" : "localhost:4943";
  const [imageSrc, setImageSrc] = useState(
    userProfile?.profile_img
      ? `${protocol}://${process.env.CANISTER_ID_IC_ASSET_HANDLER}.${domain}/f/${userProfile.profile_img}`
      : MyProfileImage
  );

  const [data, setdata] = useState({});
  const name = data?.username;

  console.log("selected post", selectedPost);

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

  const getdata = async () => {
    try {
      const response = await backendActor.get_user_profile();
      setdata(response.Ok || {});
    } catch (error) {
      console.error("Error :", error);
    }
  };

  useEffect(() => {
    getdata();
  }, [backendActor]);

  useEffect(() => {
    setImageSrc(
      userProfile?.profile_img
        ? `${protocol}://${process.env.CANISTER_ID_IC_ASSET_HANDLER}.${domain}/f/${userProfile.profile_img}`
        : MyProfileImage
    );
  }, [userProfile?.profile_img]);

  return (
    <div className={className}>
      <div
        className={`${className}__topComponent w-full h-[25vh] p-4 md:p-20 flex flex-col items-start justify-center relative hero-container`}
        style={{
          backgroundImage: `url("${MyProfileRectangle}")`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute z-20 top-0 left-0 w-full h-full overflow-x-hidden">
          {/* Big circle image */}
          <BigCircleComponent imgSrc={BigCircle} />

          {/* Big circle animation */}
          <div className="absolute z-20 right-[10px] md:right-[-50px] top-[59%] -translate-y-1/2">
            <Lottie
              options={defaultOptions}
              style={{ height: "112px", width: "112px" }}
              className="absolute z-50 "
            />
          </div>

          {/* Smallest circle image */}
          <SmallCircleComponent imgSrc={SmallestCircle} />

          {/* Small circle animation */}
          <div className="absolute right-[1.75rem] md:right-[24.75rem] top-[33%] -translate-y-[93%]">
            <Lottie
              options={defaultOptions2}
              height={50}
              width={50}
              className="absolute z-20"
            />
          </div>

          {/* Medium circle image */}
          <MediumCircleComponent imgSrc={MediumCircle} />

          {/* Medium circle animation */}
          <div className="absolute right-[4.6rem] md:right-[39.71rem] top-[97.6%] -translate-y-[93%]">
            <Lottie
              options={defaultOptions3}
              height={61}
              width={61}
              className="absolute z-20"
            />
          </div>
        </div>

        <ProfileTitleDivider title="My Posts" />
      </div>

      <div className="__mainComponent px-4 md:px-20 bg-bg-color mb-20">
        <div className="py-5 text-2xl">
          <Link to="/my-profile/my-post">
            <FaArrowLeftLong />
          </Link>
        </div>

        <div className="bg-[#F4F2EC] rounded-2xl p-6 flex flex-col gap-y-6">

  {selectedPost ? (
    <React.Fragment>
      
      {/* Mobile Layout */}
      <div className="block md:hidden">
        {/* Username and Profile Pic */}
        <div className="flex flex-col gap-y-4">
          <section className="w-full flex flex-row items-center justify-between">
            <div className="flex flex-row items-center gap-x-4">
              <img
                src={imageSrc}
                alt="ProfileImage"
                className="w-10 h-10 rounded-full"
              />
              <p className="font-semibold text-lg">{name}</p>
            </div>
            <p className="text-slate-500">{selectedPost?.post_created_at}</p>
          </section>

          {/* Description */}
          <section className="content w-full break-words">
            {selectedPost.post_description}
          </section>

          {/* Post Image */}
          <section className="relative w-full h-64">
            <img
              src={`http://${canisterId}.localhost:4943/f/${selectedPost.post_img}`}
              alt="selectedPost"
              className="w-full h-full object-cover rounded-md"
            />
          </section>

          {/* Like, Share, and Comment Buttons */}
          <section className="w-full flex flex-row items-center justify-evenly mt-5 flex-wrap gap-y-4">
            <span className="flex flex-row gap-x-2 items-center text-lg text-dark-green">
              <FaHeart />
              {selectedPost.like_count} Likes
            </span>
            <span className="flex flex-row gap-x-2 items-center text-lg text-dark-green">
              <FaTelegramPlane />
              {selectedPost.shares} Shares
            </span>
            <span className="flex flex-row gap-x-2 items-center text-lg text-dark-green">
              <BiSolidCommentDetail />
              {selectedPost.comment_count} Comments
            </span>
          </section>
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden md:flex">
        <div className={`${className}__post flex flex-col md:flex-row gap-6`}>
          {/* Details Section */}
          <section className={`${className}__details w-full md:w-[30%] lg:w-[50%] flex flex-col justify-between`}>
            {/* Top: Username and Profile Pic */}
            <div className="flex flex-col gap-y-4">
              <section className="w-full flex flex-row items-center justify-between">
                <div className="flex flex-row items-center gap-x-4">
                  <img
                    src={imageSrc}
                    alt="ProfileImage"
                    className="w-10 h-10 rounded-full"
                  />
                  <p className="font-semibold text-lg">{name}</p>
                </div>
                <p className="text-slate-500">{selectedPost?.post_created_at}</p>
              </section>

              {/* Description */}
              <section className="content w-full break-words">
                {selectedPost.post_description}
              </section>
            </div>

            {/* Bottom: Like, Share, and Comment Buttons */}
            <section className="w-full flex flex-row items-center justify-evenly mt-5 flex-wrap gap-y-4 md:gap-y-0">
              <span className="flex flex-row gap-x-1 items-center text-lg text-dark-green">
                <FaHeart />
                {selectedPost.like_count} Likes
              </span>
              <span className="flex flex-row gap-x-1 items-center text-lg text-dark-green">
                <FaTelegramPlane />
                {selectedPost.shares} Shares
              </span>
              <span className="flex flex-row gap-x-1 items-center text-lg text-dark-green">
                <BiSolidCommentDetail />
                {selectedPost.comment_count} Comments
              </span>
            </section>
          </section>

          {/* Image Section */}
          <section className="relative w-full md:w-[40%] lg:[50%] h-64">
            <img
              src={`http://${canisterId}.localhost:4943/f/${selectedPost.post_img}`}
              alt="selectedPost"
              className="w-full h-full object-cover rounded-md"
            />
          </section>
        </div>
      </div>

      <hr />

      <div className={`${className}__comments`}>
        <h1 className="text-dark-green font-semibold text-2xl">Comments</h1>
        {selectedPost?.comment_list.length > 0 && <Comments />}
      </div>

    </React.Fragment>
  ) : (
    <p>No post data available</p>
  )}
</div>

      </div>
    </div>
  );
};

export default Post;

