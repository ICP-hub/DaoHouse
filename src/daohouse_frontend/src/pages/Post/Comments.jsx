import React, { useState, useEffect } from 'react';
import { useAuth } from '../../Components/utils/useAuthClient';

// Comment component
const Comment = ({ comment, proposalId, daoId }) => {
  const {createDaoActor} = useAuth()
  const [showReplies, setShowReplies] = useState(false);
  const [replyText, setReplyText] = useState("");

  const handleReplyChange = (e) => {
    setReplyText(e.target.value);
  };

  const submitReply = async () => {
    if (!replyText.trim()) return;
    try {
      const replyArgs = {
        comment: replyText,
        proposal_id: proposalId,
        comment_id: comment.comment_id,
      };

      const daoActor = await createDaoActor(daoId)
      const response = await daoActor.reply_comment(replyArgs);

      if (response.Ok) {
        // Add reply to the comment's replies array
        comment.replies.push(replyText);
        setReplyText("");
        setShowReplies(true);
      } else {
        console.error("Failed to add reply:", response.Err);
      }
    } catch (error) {
      console.error("Error adding reply:", error);
    }
  };

  return (
    <div className="flex mb-6 font-mulish">
      <div className="bg-gray-100 p-4 rounded-lg w-full">
        <h4 className="font-semibold">{comment.author_principal.toText()}</h4>
        <p className="mt-2">{comment.comment_text}</p>
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
        <div className="mt-4">
          <textarea
            className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:border-gray-500"
            placeholder="Write a reply..."
            value={replyText}
            onChange={handleReplyChange}
          />
          <button
            className="mt-2 bg-blue-500 text-white py-2 px-4 rounded-full hover:bg-blue-600"
            onClick={submitReply}
          >
            Submit Reply
          </button>
        </div>
      </div>
    </div>
  );
};

// Reply component
const Reply = ({ reply }) => {
  return (
    <div className="flex mb-4 font-mulish">
      <div className="bg-gray-200 p-3 rounded-lg w-full">
        <p className="mt-2">{reply}</p>
      </div>
    </div>
  );
};

// Comments list component
const Comments = ({ daoId, proposalId }) => {
  const [comments, setComments] = useState([]);
  const [visibleComments, setVisibleComments] = useState(3);
  const [showMore, setShowMore] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [daoActor, setDaoActor] = useState({});
  const {createDaoActor} = useAuth()

  useEffect(() => {
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
      }
    };

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
        setComments([...comments, {
          author_principal: response.Ok.author_principal,
          comment_text: newComment,
          created_at: Date.now(),
          likes: 0,
          replies: [],
          comment_id: response.Ok.comment_id,
        }]);
        setNewComment("");
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
    <div className='bg-white mt-1 rounded-t-sm rounded-b-lg px-12 py-12 font-mulish'>
      <h3 className="text-lg font-bold mb-6 text-[234A5A]">Comments</h3>
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
  );
};

export default Comments;
