// import React from "react";
// import { FaHeart } from "react-icons/fa";
// import { FaTelegramPlane } from "react-icons/fa";
// import { BiSolidCommentDetail } from "react-icons/bi";
// import MyProfileImage from "../../../assets/MyProfile-img.png";

// const commentsList = [
//   {
//     userName: "lamcool_1122",
//     userImage: MyProfileImage,
//     commentText: "Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam",
//     likes: 50,
//     comments: 10,
//     shares: 20,
//     date: "2 days ago",
//   },
//   {
//     userName: "lamcool_1122",
//     userImage: MyProfileImage,
//     commentText: "Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam",
//     likes: 25,
//     comments: 1,
//     shares: 2,
//     date: "2 days ago",
//   },
//   {
//     userName: "lamcool_112",
//     userImage: MyProfileImage,
//     commentText: "Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam",
//     likes: 24,
//     comments: 17,
//     shares: 9,
//     date: "2 days ago",
//   },
// ];

// const Comments = () => {
//   const className = "Post__Comments";

//   return (
//     <div className={className + " p-4"}>
//       {commentsList.map(
//         ({
//           userImage,
//           userName,
//           commentText,
//           comments,
//           likes,
//           shares,
//           date,
//         }, index) => (
//           <div key={index} className="flex flex-col gap-4 border-l border-dark-green relative mt-7">
//             <div
//               className={`absolute -left-4 tablet:-left-5 top-0 w-8 h-8 tablet:w-10 tablet:h-10 flex justify-center rounded`}
//             >
//               <img
//                 className="block h-full w-full object-cover rounded-[50%]"
//                 src={userImage}
//                 alt="userImage"
//               />
//             </div>
//             <div className="flex items-center gap-x-8 ml-10">
//               <h1 className="font-semibold text-dark-green">{userName}hi</h1>
//               <div className="text-xs text-slate-400">{date}</div>
//             </div>

//             <div className="text-slate-600 tablet:text-base text-sm ml-10">
//               {commentText}
//             </div>

//             <div className="ml-10 flex tablet:text-lg text-xs items-center text-[#000] text-opacity-50 gap-x-8">
//               <span className="flex flex-row gap-x-2 items-center text-sm text-slate-500">
//                 <FaHeart />
//                 {likes}
//               </span>
//               <span className="flex flex-row gap-x-2 items-center text-sm text-slate-500">
//                 <FaTelegramPlane />
//                 {shares}
//               </span>
//               <span className="flex flex-row gap-x-2 items-center text-sm text-slate-500">
//                 <BiSolidCommentDetail />
//                 {comments}
//               </span>
//             </div>

//             <div className="-mb-[10px] flex items-center mt-2">
//               <div className="w-14 h-[1px] bg-[#000]"> </div>
//               <button className="text-sm ml-1 text-dark-green font-semibold">
//                 View replies
//               </button>
//             </div>
//           </div>
//         )
//       )}
//     </div>
//   );
// };

// export default Comments;

import React, { useState } from 'react';

// Sample comments data
const commentsData = [
  {
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    name: "Name",
    username: "username",
    text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor.",
    replies: [
      {
        avatar: "https://randomuser.me/api/portraits/women/44.jpg",
        name: "Name",
        username: "username",
        text: "Lorem ipsum dolor sit amet.",
      },
    ],
  },
  {
    avatar: "https://randomuser.me/api/portraits/men/12.jpg",
    name: "Name",
    username: "username",
    text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor.",
    replies: [],
  },
  {
    avatar: "https://randomuser.me/api/portraits/men/12.jpg",
    name: "Name",
    username: "username",
    text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor.",
    replies: [],
  },
  {
    avatar: "https://randomuser.me/api/portraits/men/12.jpg",
    name: "Name",
    username: "username",
    text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor.",
    replies: [],
  },
];

// Comment component
const Comment = ({ comment }) => {
  const [showReplies, setShowReplies] = useState(false);

  return (
    <div className="flex mb-6 font-mulish">
      <img src={comment.avatar} alt="avatar" className="w-12 h-12 rounded-full mr-4" />
      <div className="bg-gray-100 p-4 rounded-lg w-full">
        <h4 className="font-semibold">{comment.name}</h4>
        <p className="text-sm text-gray-500">@{comment.username}</p>
        <p className="mt-2">{comment.text}</p>
        {comment.replies.length > 0 && (
          <p
            className="text-black cursor-pointer mt-2 underline text-sm"
            onClick={() => setShowReplies(!showReplies)}
          >
            {showReplies ? 'Hide Replies' : 'View Replies'}
          </p>
        )}
        {showReplies && (
          <div className="mt-4 pl-8">
            {comment.replies.map((reply, index) => (
              <Reply key={index} reply={reply} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Reply component
const Reply = ({ reply }) => {
  return (
    <div className="flex mb-4 font-mulish">
      <img src={reply.avatar} alt="avatar" className="w-10 h-10 rounded-full mr-4" />
      <div className="bg-gray-200 p-3 rounded-lg w-full">
        <h4 className="font-semibold">{reply.name}</h4>
        <p className="text-sm text-gray-500">@{reply.username}</p>
        <p className="mt-2">{reply.text}</p>
      </div>
    </div>
  );
};

// Comments list component
const Comments = () => {
  const [visibleComments, setVisibleComments] = useState(3);
  const [showMore, setShowMore] = useState(false);

  const toggleShowMore = () => {
    if (showMore) {
      setVisibleComments(3); 
    } else {
      setVisibleComments(commentsData.length);
    }
    setShowMore(!showMore);
  };


  return (
    <div className='bg-white mt-1 rounded-t-sm rounded-b-lg px-12 py-12 font-mulish'>
      <h3 className="text-lg font-bold mb-6 text-[234A5A]">Comments</h3>
      {commentsData.slice(0, visibleComments).map((comment, index) => (
        <Comment key={index} comment={comment} />
      ))}
      {commentsData.length > 3 && (
        <p
        className="text-[0F3746] underline cursor-pointer mt-4"
        onClick={toggleShowMore}
      >
        {showMore ? 'View less comments' : 'View more comments'}
      </p>
    )}
      <div className="mt-8">
        <textarea
          className="w-full border border-[#0E3746] rounded-lg p-3 focus:outline-none focus:border-[#0E3746]"
          placeholder="Write reply..."
        />
        <div className='flex justify-end'>
        <button className="mt-4 bg-[#0E3746] text-white py-4 px-16 text-[16px] rounded-full hover:bg-[#0E3746] transition">
          Submit reply
        </button>
        </div>
      </div>
    </div>
  );
};

export default Comments;