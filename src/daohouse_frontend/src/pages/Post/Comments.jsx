import React, { useState, useEffect } from 'react';
import { useAuth } from '../../Components/utils/useAuthClient';


import userImage from "../../../assets/commentUser.jpg";
import { FaReply } from "react-icons/fa6";
import CommentsSkeletonLoader from '../../Components/SkeletonLoaders/CommentsSkeletonLoader/CommentsSkeletonLoader';
import CommentSkeletonLoader from '../../Components/SkeletonLoaders/CommentsSkeletonLoader/CommentSkeletonLoader';

// Comment component
const Comment = ({ comment, proposalId, daoId }) => {
  const { createDaoActor, backendActor } = useAuth();
  const [showReplies, setShowReplies] = useState(false);
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [authorName, setAuthorName] = useState("");
  const [profileImg, setProfileImg] = useState("");
  const protocol = process.env.DFX_NETWORK === "ic" ? "https" : "http";
  const domain = process.env.DFX_NETWORK === "ic" ? "raw.icp0.io" : "localhost:4943";
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fetch user profile when the component mounts
    const fetchProfile = async () => {
      try {
        const response = await backendActor.get_profile_by_id(comment.author_principal);
        
        if (response?.Ok) {
          setAuthorName(response.Ok.username);
          const profileImg = response.Ok.profile_img
            ? `${protocol}://${process.env.CANISTER_ID_IC_ASSET_HANDLER}.${domain}/f/${response.Ok.profile_img}`
            : userImage;
          setProfileImg(profileImg);
        }
        setIsLoading(false)
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

    fetchProfile();
  }, [comment.author_principal]);


  const handleReplyChange = (e) => {
    setReplyText(e.target.value);
  };

  const submitReply = async () => {

    console.log("submitReply called");

    if (!replyText.trim()) return;
    try {
      const replyArgs = {
        comment: replyText,
        proposal_id: proposalId,
        comment_id: comment.comment_id,
      };


      console.log("Commentid", comment);
      

      const daoActor = await createDaoActor(daoId);
      const response = await daoActor.reply_comment(replyArgs);

      if (response.Ok) {
        comment.replies.push(replyText);
        console.log(comment.replies);
        
        setReplyText("");
        setShowReplies(true);
        setShowReplyInput(false);
      } else {
        console.error("Failed to add reply:", response.Err);
      }
    } catch (error) {
      console.error("Error adding reply:", error);
    }
  };

  return (
    <>
    {isLoading ? (
      <CommentSkeletonLoader />
    ) : (
    <div className="flex font-mulish">
      <div className="p-4 rounded-lg w-full gap-[18px]">
        {/* Show the author's profile image and username */}
        <div className="flex items-center mb-2">
          {profileImg ? (
            <img
              src={profileImg}
              alt="Profile"
              className="w-[55px] h-[55px] rounded-full mr-3"
            />
          ) : (
            <div className="w-8 h-8 bg-gray-300 rounded-full mr-3" />
          )}
          <h4 className="font-semibold text-[234A5A] text-[18px]">{authorName || comment?.author_principal?.toText()}</h4>
        </div>

        {/* Comment text with proper text wrapping */}
        <p className="mt-2 break-words text-base">{comment?.comment_text}</p>
        {comment?.replies?.length > 0 && (

          <p
            className="text-black cursor-pointer mt-2 underline text-sm"
            onClick={() => setShowReplies(!showReplies)}
          >
            {showReplies ? "Hide Replies" : "View Replies"}
          </p>
        )}
        {showReplies && (
          <div className="mt-4 pl-8">
            {comment.replies.map((reply, index) => (
              <Reply key={index} reply={reply} />
            ))}
          </div>
        )}


        {/* Toggle button to show/hide reply input */}
        <div className="mt-4">
          <button
            className="rounded-full flex gap-1 items-center underline text-gray-500 text-sm"
            onClick={() => setShowReplyInput(!showReplyInput)}
          >
            {showReplyInput ? "Cancel" : <><FaReply /> Reply</> }
          </button>
        </div>

        {/* Show reply input field and submit button only when showReplyInput is true */}
        {showReplyInput && (
          <div className="mt-4">
            <textarea
              className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:border-gray-500"
              placeholder="Write a reply..."
              value={replyText}
              onChange={handleReplyChange}
            />
            <button
              className="mt-2 bg-[#234A5A] text-white py-1 px-2 text-sm rounded-full hover:bg-[#173a47]"
              onClick={submitReply}
            >
              Submit Reply
            </button>
          </div>
        )}

      </div>
    </div>
    )}
    </>
  );
};

// Reply component
const Reply = ({ reply }) => {
  console.log(reply);
  
  return (

    <div className="flex mb-4 font-mulish pl-3" style={{ borderLeft: '2px solid #E0E0E0' }}>
      <div className="w-full">
        <p className="mt-2 break-words text-base">{reply}</p>

      </div>
    </div>
  );
};


// Comments list component
const Comments = ({ daoId, proposalId, commentCount, setCommentCount }) => {
  const [comments, setComments] = useState([]);
  const [visibleComments, setVisibleComments] = useState(3);
  const [showMore, setShowMore] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [daoActor, setDaoActor] = useState({});
  const {createDaoActor} = useAuth()
  const [isLoading, setIsLoading] = useState(true);

    const fetchComments = async () => {
      try {
        // Fetch proposal details which include comments using get_proposal_by_id
        const daoActor = await createDaoActor(daoId)
        setDaoActor(daoActor)
        const proposalDetails = await daoActor.get_proposal_by_id(proposalId);
        console.log("propDetailz", proposalDetails.proposal_id);

        // Extract and set comments if they exist
        if (proposalDetails && proposalDetails.comments_list) {
          setComments(proposalDetails.comments_list);
        }
      } catch (error) {
        console.error('Error fetching comments:', error);
      } finally {
        setIsLoading(false)
      }
    };

  useEffect(() => {
    fetchComments();
  }, [proposalId, daoId]);

  const toggleShowMore = () => {
    setVisibleComments(showMore ? 3 : comments.length);
    setShowMore(!showMore);
  };

  const handleCommentChange = (e) => {
    setNewComment(e.target.value);
  };

  const submitComment = async () => {
    if (!newComment.trim()) return;
    try {
      const response = await daoActor.comment_on_proposal( newComment,  proposalId);

      if (response.Ok) {
        console.log("OK");
        
        // Add new comment to the list
        setComments(prevComments => [
          ...prevComments,
          {
            author_principal: response.Ok.author_principal,
            comment_text: newComment,
            created_at: Date.now(),
            likes: 0,
            replies: [],
            comment_id: response.Ok.comment_id,
          }
        ]);
        setNewComment("");
        setCommentCount(commentCount+1)
        fetchComments();
      } else {
        console.error("Failed to add comment:", response.Err);
      }
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };
  console.log("daoId:", typeof daoId, daoId);
console.log("proposalId:", typeof proposalId, proposalId);
console.log("newComment:", typeof newComment, newComment);


  return (

    <>
    {isLoading ? (
      <CommentsSkeletonLoader />
    ) : (
    <div className='bg-white mt-1 rounded-t-sm rounded-b-lg px-12 py-12 font-mulish bg'>
      <h3 className="font-bold mb-6 text-[#234A5A] text-xl">Comments</h3>

      {comments.slice(0, visibleComments).map((comment, index) => (
        <Comment key={index} comment={comment} proposalId={proposalId} daoActor={daoActor} daoId={daoId} />
      ))}
      {comments.length > 3 && (
        <p className="text-[0F3746] underline cursor-pointer mt-4" onClick={toggleShowMore}>
          {showMore ? 'View less comments' : 'View more comments'}
        </p>
      )}
      <div className="mt-8">
        <textarea
          className="w-full border border-[#0E3746] rounded-lg p-3 focus:outline-none focus:border-[#0E3746]"
          placeholder="Write a comment..."
          value={newComment}
          onChange={handleCommentChange}
        />
        <div className='flex justify-end'>
          <button className="mt-4 bg-[#0E3746] text-white py-4 px-16 text-[16px] rounded-full hover:bg-[#0E3746] transition" onClick={submitComment}>
            Submit Comment
          </button>
        </div>
      </div>
    </div>
    )}
    </>
  );
};

export default Comments;
