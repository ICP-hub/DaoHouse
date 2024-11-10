import FavoriteIcon from '@mui/icons-material/Favorite';
import React, { useState, useEffect } from "react";
import MyProfileImage from "../../../assets/Avatar.png"; // Default profile image
import { IoLink } from "react-icons/io5";
import { FaRegHeart } from "react-icons/fa";
import { PiTelegramLogoBold } from "react-icons/pi";
import { MdOutlineInsertComment } from "react-icons/md";
import { Principal } from "@dfinity/principal";
import { useAuth } from "../../Components/utils/useAuthClient";
import Post1 from "../../../assets/post1.png";
import toast from 'react-hot-toast';

// Convert timestamp to formatted date string
const convertTimestampToDateString = (timestamp) => {
  const milliseconds = Number(timestamp / BigInt(1e6));
  const date = new Date(milliseconds);
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  const month = monthNames[date.getMonth()];
  const day = date.getDate();
  return `${month} ${day}`;
};

const PostCard = ({ posts, handleGetLikePost }) => {
  const [formattedDate, setFormattedDate] = useState('');
  const { backendActor } = useAuth();
  const [isFollowing, setIsFollowing] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [localLikeStatus, setLocalLikeStatus] = useState(posts.is_liked);
  const [localLikeCount, setLocalLikeCount] = useState(posts.like_count);
  const [isLiking, setIsLiking] = useState(false);
  const protocol = process.env.DFX_NETWORK === "ic" ? "https" : "http";
  const domain = process.env.DFX_NETWORK === "ic" ? "raw.icp0.io" : "localhost:4943";
  const ImageUrl = posts?.post_img
    ? `${protocol}://${process.env.CANISTER_ID_IC_ASSET_HANDLER}.${domain}/f/${posts.post_img}`
    : Post1;
  const [imageSrc, setImageSrc] = useState(MyProfileImage);

  useEffect(() => {
    const userImage = posts?.user_image_id
      ? `${protocol}://${process.env.CANISTER_ID_IC_ASSET_HANDLER}.${domain}/f/${posts.user_image_id}`
      : MyProfileImage;
    setImageSrc(userImage);
  }, [posts.user_image_id]);

  // Error handler function for image loading
  const handleImageError = () => {
    setImageSrc(MyProfileImage); // Fallback to default image if there's an error loading the profile image
  };

  const handleLike = async () => {
    if (isLiking) return;

    setIsLiking(true);
    const newLikeStatus = localLikeStatus === 1 ? 0 : 1;
    const newLikeCount = newLikeStatus === 1 ? localLikeCount + 1 : localLikeCount - 1;

    // Optimistically update UI
    setLocalLikeStatus(newLikeStatus);
    setLocalLikeCount(newLikeCount);

    try {
      const response = await backendActor.like_post(posts.post_id);
      if (response?.Ok) {
        toast.success("Post liked successfully");
      } else if (response?.Err) {
        toast.warning('You already liked this post');
        // Revert the UI update if backend response is an error
        setLocalLikeStatus(localLikeStatus);
        setLocalLikeCount(localLikeCount);
      }
    } catch (error) {
      console.error("Error liking post:", error);
      toast.error("An error occurred while liking the post");
      // Revert the UI update if there's an error
      setLocalLikeStatus(localLikeStatus);
      setLocalLikeCount(localLikeCount);
    } finally {
      setIsLiking(false);
    }
    handleGetLikePost({ ...posts, is_liked: newLikeStatus, like_count: newLikeCount });
  };

  const toggleFollow = async () => {
    try {
      if (!userProfile) return;
      const principal = Principal.fromText(posts.principal_id.toString());
      const currentlyFollowing = userProfile.followings_list.some(following => following.toString() === principal.toString());
      setIsFollowing(!currentlyFollowing);

      const response = currentlyFollowing
        ? await backendActor.unfollow_user(principal)
        : await backendActor.follow_user(principal);

      if (response?.Ok) {
        const updatedProfile = { ...userProfile };
        if (currentlyFollowing) {
          updatedProfile.followings_list = updatedProfile.followings_list.filter(following => following.toString() !== principal.toString());
          updatedProfile.followings_count--;
        } else {
          updatedProfile.followings_list.push(principal);
          updatedProfile.followings_count++;
        }
        setUserProfile(updatedProfile);
        toast.success(currentlyFollowing ? "Successfully unfollowed" : "Successfully followed");
      } else if (response?.Err) {
        setIsFollowing(!currentlyFollowing);
        toast.error(response.Err);
      }
    } catch (error) {
      console.error("Error following/unfollowing user:", error);
      toast.error("An error occurred");
    }
  };

  useEffect(() => {
    const fetchProfileAndSetFollowingStatus = async () => {
      try {
        if (posts && posts.post_created_at) {
          const formatted = convertTimestampToDateString(BigInt(posts.post_created_at));
          setFormattedDate(formatted);
        }

        const profileResponse = await backendActor.get_user_profile();
        if (profileResponse.Ok) {
          const userId = profileResponse.Ok.user_id;
          setUserProfile(profileResponse.Ok);
          const principal = Principal.fromText(posts.principal_id.toString());
          const isFollowingList = profileResponse.Ok.followings_list;
          setIsFollowing(isFollowingList.some(following => following.toString() === principal.toString()));
        }
      } catch (error) {
        console.error("Error fetching profile data:", error);
      }
    };

    fetchProfileAndSetFollowingStatus();
  }, [posts, backendActor]);

  return (
    <div
      className="postCard w-full parent-row flex big_phone:flex-row flex-col items-start big_phone:gap-12 gap-4 bg-white big_phone:p-8 p-6 rounded-lg justify-between mobile:mt-0 mt-4 my-9"
    >
      <section className="postCard__rightSide h-full w-[100%] md:w-[45%] lg:w-[50%] flex flex-col gap-y-4 justify-between">
        <div className="flex flex-row items-center justify-between">
          <section className="postCard__userData flex flex-row items-center gap-2">
            <img
              src={imageSrc}
              alt="userImage"
              className="rounded-[50%] w-10 h-10"
              onError={handleImageError}
            />
            <div>
              <p className="font-semibold ml-2 truncate w-36"> {posts.username || posts.principal_id.toString()}</p>
              {userProfile && userProfile.user_id.toString() !== posts.principal_id.toString() && (
                <button
                  onClick={toggleFollow}
                  className={`flex-1 mt-0 text-blue-400 p-1 sm:text-sm md:text-lg`}
                >
                  {isFollowing ? 'Unfollow' : '+ Follow'}
                </button>
              )}
            </div>
          </section>

          <section className="postCard__time text-slate-500 mobile:text-base text-sm">
            {formattedDate}
          </section>
        </div>
        <div>
          <p className="h-full mobile:text-base text-sm w-full break-words">{posts.post_description}</p>
        </div>

        <div className="postCard__buttons mobile:flex hidden flex-row items-center tablet:justify-between tablet:gap-x-2 gap-x-2 big_phone:mt-24 mt-24 desktop-button">
          <button
            className="flex flex-row tablet:gap-2 gap-1 items-center bg-[#0E3746] text-white tablet:text-base text-sm tablet:py-3 py-2 tablet:px-8 px-4 rounded-[2rem]"
            onClick={handleLike}
            disabled={isLiking}
          >
            {localLikeStatus === 1 ? (
              <FavoriteIcon className="w-5 h-5" />
            ) : (
              <FaRegHeart className="w-5 h-5" />
            )}
            {localLikeCount}
          </button>
          <button
            className="flex flex-row tablet:gap-2 gap-1 items-center bg-[#0E3746] text-white tablet:text-base text-sm tablet:py-3 py-2 tablet:px-8 px-4 rounded-[2rem]"
          >
            <MdOutlineInsertComment />
            {posts.comment_count}
          </button>
          <button className="flex flex-row tablet:gap-2 gap-1 items-center bg-[#0E3746] text-white tablet:text-base text-sm tablet:py-3 py-2 tablet:px-8 px-4 rounded-[2rem]">
            <PiTelegramLogoBold />
            Share
          </button>
          <button className="m-4">
            <IoLink className="text-2xl" />
          </button>
        </div>
      </section>

      <section className="postCard__leftSide w-[100%] md:w-[45%] h-full flex justify-end item-end image-section">
        {posts.post_img && (
          <section className="relative w-full h-64">
            <img
              src={ImageUrl}
              alt="PostMedia"
              className="w-full h-full object-cover rounded-md"
            />
          </section>
        )}
      </section>

      <section className="postCard__buttons w-full flex flex-row items-center justify-between mobile-buttons">
        <div className="flex flex-row items-center justify-between gap-x-2">
          <button onClick={handleLike} disabled={isLiking}>
            <div className="flex gap-2">
              {localLikeStatus === 1 ? (
                <FavoriteIcon className="w-5 h-5" />
              ) : (
                <FaRegHeart className="text-[#0E3746] text-lg mt-1" />
              )}
              <div className="text-lg">
                {localLikeCount}
              </div>
            </div>
          </button>
          <button>
            <div className="flex gap-2">
              <MdOutlineInsertComment className="text-[#0E3746] text-lg mt-1" />
              <div className="text-lg">
                {posts.comment_count}
              </div>
            </div>
          </button>
          <button>
            <div className="flex gap-2">
              <PiTelegramLogoBold className="text-[#0E3746] text-lg mt-1" />
            </div>
          </button>
          <button className="m-0">
            <IoLink className="text-lg" />
          </button>
        </div>
      </section>
    </div>
  );
};

export default PostCard;
