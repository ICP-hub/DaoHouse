import React from "react";
import { FaHeart } from "react-icons/fa";
import { FaTelegramPlane } from "react-icons/fa";
import { BiSolidCommentDetail } from "react-icons/bi";
import MyProfileImage from "../../../assets/MyProfile-img.png";

const commentsList = [
  {
    userName: "lamcool_1122",
    userImage: MyProfileImage,
    commentText: "Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam",
    likes: 50,
    comments: 10,
    shares: 20,
    date: "2 days ago",
  },
  {
    userName: "lamcool_1122",
    userImage: MyProfileImage,
    commentText: "Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam",
    likes: 25,
    comments: 1,
    shares: 2,
    date: "2 days ago",
  },
  {
    userName: "lamcool_112",
    userImage: MyProfileImage,
    commentText: "Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam",
    likes: 24,
    comments: 17,
    shares: 9,
    date: "2 days ago",
  },
];

const Comments = () => {
  const className = "Post__Comments";

  return (
    <div className={className + " p-4"}>
      {commentsList.map(
        ({
          userImage,
          userName,
          commentText,
          comments,
          likes,
          shares,
          date,
        }, index) => (
          <div key={index} className="flex flex-col gap-4 border-l border-dark-green relative mt-7">
            <div
              className={`absolute -left-4 tablet:-left-5 top-0 w-8 h-8 tablet:w-10 tablet:h-10 flex justify-center rounded`}
            >
              <img
                className="block h-full w-full object-cover rounded-[50%]"
                src={userImage}
                alt="userImage"
              />
            </div>
            <div className="flex items-center gap-x-8 ml-10">
              <h1 className="font-semibold text-dark-green">{userName}hi</h1>
              <div className="text-xs text-slate-400">{date}</div>
            </div>

            <div className="text-slate-600 tablet:text-base text-sm ml-10">
              {commentText}
            </div>

            <div className="ml-10 flex tablet:text-lg text-xs items-center text-[#000] text-opacity-50 gap-x-8">
              <span className="flex flex-row gap-x-2 items-center text-sm text-slate-500">
                <FaHeart />
                {likes}
              </span>
              <span className="flex flex-row gap-x-2 items-center text-sm text-slate-500">
                <FaTelegramPlane />
                {shares}
              </span>
              <span className="flex flex-row gap-x-2 items-center text-sm text-slate-500">
                <BiSolidCommentDetail />
                {comments}
              </span>
            </div>

            <div className="-mb-[10px] flex items-center mt-2">
              <div className="w-14 h-[1px] bg-[#000]"> </div>
              <button className="text-sm ml-1 text-dark-green font-semibold">
                View replies
              </button>
            </div>
          </div>
        )
      )}
    </div>
  );
};

export default Comments;
