import React from "react";

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

const Post = () => {
  const { selectedPost } = usePostContext();
  const className = "Post";
  const canisterId = process.env.CANISTER_ID_IC_ASSET_HANDLER;

  console.log(selectedPost);

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
    <div className={className}>
      <div
        className={
          className +
          "__topComponent w-full h-[25vh] p-20 flex flex-col items-start justify-center relative hero-container"
        }
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
          <div className="absolute z-20  big_phone:right-[68px] big_phone:top-1/2 top-[59%] -translate-y-1/2 right-[-50px]">
            <Lottie
              options={defaultOptions}
              style={{ height: "112px", width: "112px" }}
              className="absolute z-50 "
            />
          </div>
          {/* Smallest circle image */}
          <SmallCircleComponent imgSrc={SmallestCircle} />

          {/* Small circle animation */}
          <div className="absolute big_phone:right-[24.75rem] right-[7.1rem] big_phone:top-[30%] top-[33%] -translate-y-[93%]">
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
          <div className="absolute big_phone:right-[39.71rem] right-[11.6rem] big_phone:top-[95%] top-[97.6%] -translate-y-[93%]">
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

      <div className="__mainComponent px-20 bg-bg-color mb-20">
        <div className="py-5 text-2xl">
          <Link to="/my-profile/my-post">
            <FaArrowLeftLong />
          </Link>
        </div>

        <div className="bg-[#F4F2EC] rounded-2xl p-6 flex flex-col gap-y-6">
          {selectedPost ? (
            <React.Fragment>
              <div className={className + "__post flex flex-row gap-x-6"}>
                <section
                  className={
                    className + "__details w-1/2 flex flex-col justify-between"
                  }
                >
                  {/**Top */}
                  <div className="flex flex-col gap-y-4">
                    <section className="w-full flex flex-row items-center justify-between">
                      <div className="flex flex-row items-center gap-x-4">
                        <img
                          src={`http://${canisterId}.localhost:4943/f/${selectedPost.user_image_id}`}
                          alt="ProfileImage"
                          className="w-10 h-10 rounded-full"
                        />

                        <p className="font-semibold text-lg">
                          {selectedPost.username}
                        </p>
                      </div>

                      <p className="text-slate-500">{selectedPost?.post_created_at }</p>
                    </section>

                    <section className="content w-full">
                      {selectedPost.post_description}
                    </section>
                  </div>

                  {/**Bottom */}
                  <section className="w-full flex flex-row items-center justify-evenly mt-5">
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
                </section>

                <section className="w-1/2">
                  <img
                    src={`http://${canisterId}.localhost:4943/f/${selectedPost.post_img}`}
                    alt="selectedPost"
                    className="w-full h-100 object-cover"
                  />
                </section>
              </div>

              <hr />

              <div className={className + "__comments"}>
                <h1 className="text-dark-green font-semibold text-2xl">
                  Comments
                </h1>
                {
                 selectedPost?.comment_list.length >0 &&
                 <Comments />
                }
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
