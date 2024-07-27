import FavoriteIcon from '@mui/icons-material/Favorite';
import React, { useState, useEffect } from "react";
import { IoLink } from "react-icons/io5";
import { FaRegHeart } from "react-icons/fa6";
import { PiTelegramLogoBold } from "react-icons/pi";
import { MdOutlineInsertComment } from "react-icons/md";
import { useAuth } from "../../Components/utils/useAuthClient";
const convertTimestampToDateString = (timestamp) => {
  // Convert the BigInt timestamp to milliseconds
  const milliseconds = Number(timestamp / BigInt(1e6));

  // Create a new Date object using the milliseconds
  const date = new Date(milliseconds);

  // Define an array of month names
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  // Get the month and day
  const month = monthNames[date.getMonth()];
  const day = date.getDate();

  // Return the formatted date string
  return `${month} ${day}`;
};
import { toast } from "react-toastify";

const PostCard = ({ posts, handleGetLikePost }) => {
  const [formattedDate, setFormattedDate] = useState('');
  const className = "postCard";
  const { backendActor } = useAuth();
  const canisterId = process.env.CANISTER_ID_IC_ASSET_HANDLER;

  const ImageUrl = 'https://${process.env.CANISTER_ID_IC_ASSET_HANDLER}.${process.env.DFX_NETWORK == "ic" ? "raw.icp0.io" : "localhost:4943"}/f/${posts?.post_img}`';

  const userImage = `https://${process.env.CANISTER_ID_IC_ASSET_HANDLER}.${process.env.DFX_NETWORK == "ic" ? "raw.icp0.io" : "localhost:4943"}/f/${posts?.user_image_id}`;

  const getlike = async () => {
    try {
      const response = await backendActor.like_post(posts.post_id);
      handleGetLikePost(response);
      console.log(response)
      if (response?.Ok) {
        toast.success("post like successfully")
      } else if (response?.Err) {
        toast.warning('you already like this post')
      }
    } catch (error) {
      console.error("Error fetching like:", error);
    }
  };

  useEffect(() => {
    if (posts && posts.post_created_at) {
      const formatted = convertTimestampToDateString(BigInt(posts.post_created_at));
      setFormattedDate(formatted);
    }

  }, [posts]);
  return (
    <div
      className={
        className +
        " " +
        "w-full parent-row flex big_phone:flex-row flex-col items-start big_phone:gap-12 gap-4 bg-white big_phone:p-8 p-6 rounded-lg justify-between mobile:mt-0 mt-4 my-9"
      }
    >
      <section className={className + "__rightSide h-full w-[100%] md:w-[45%] lg:w-[50%]  flex flex-col gap-y-4 justify-between"}>
        <div className="flex flex-row items-center justify-between">
          <section className={className + "__userData flex flex-row items-center gap-2"}>
            <img
              src={userImage}
              alt="userImage"
              className="rounded-[50%] w-10 h-10"
            />
            <p className="font-semibold">{posts.username}</p>
          </section>

          <section className={className + "__time text-slate-500 mobile:text-base text-sm"}>
            {formattedDate}
          </section>

        </div>
        <div>
          <p className="h-full mobile:text-base text-sm w-full break-words">{posts.post_description}</p>
        </div>

        <div className={className + "__buttons mobile:flex hidden flex-row items-center tablet:justify-between tablet:gap-x-4 gap-x-2 big_phone:mt-8 mt-4 desktop-button"}>
          <button
            className="flex flex-row tablet:gap-2 gap-1 items-center bg-[#0E3746] text-white tablet:text-base text-sm tablet:py-3 py-2 tablet:px-8 px-4 rounded-[2rem]">
            {
              posts?.is_liked == 1 ?
                <FavoriteIcon onClick={getlike} className="w-5 h-5" />
                :
                <FaRegHeart onClick={getlike} className="w-5 h-5" />
            }
            {posts.like_count}
          </button>
          <button
            className="flex flex-row tablet:gap-2 gap-1 items-center bg-[#0E3746] text-white tablet:text-base text-sm tablet:py-3 py-2 tablet:px-8 px-4 rounded-[2rem]">
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

      <section className={className + "__leftSide w-[100%] md:w-[50%] h-full flex justify-end item-end image-section"}>
        {posts.post_img && (
          <section className="relative w-full h-64 ">
          <img
            src={`http://${canisterId}.localhost:4943/f/${posts.post_img}`}
            alt="PostMedia"
            className="w-full h-full object-cover rounded-md"
          />
        
      </section>
        )}
      </section>

      <section className={className + "__buttons w-full flex flex-row items-center justify-between mobile-buttons"}>
        <div className="flex flex-row items-center justify-between gap-x-4">
          <button>
            <div className="flex gap-2">
              {
                posts?.is_liked == 1 ?
                  <FavoriteIcon onClick={getlike} className="w-5 h-5" />
                  :
                  <FaRegHeart onClick={getlike} className="text-[#0E3746] text-lg mt-1" />
              }
              <div className="text-lg">
                {posts.like_count}
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

