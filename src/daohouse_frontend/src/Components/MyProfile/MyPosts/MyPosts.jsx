import React, { useEffect, useState } from "react";
import { FaHeart } from "react-icons/fa";
import { Link } from "react-router-dom";
import { FaTelegramPlane } from "react-icons/fa";
import { BiSolidCommentDetail } from "react-icons/bi";
import { usePostContext } from "../../../PostProvider";
import NoPostProfile from "../../Dao/NoPostProfile";
import { useAuth } from "../../utils/useAuthClient";
import Pagination from "../../pagignation/Pagignation";
import MuiSkeleton from "../../Skeleton/MuiSkeleton";

const MyPosts = () => {
  const { backendActor } = useAuth();
  const [hoverIndex, setHoverIndex] = useState(null);
  const [readMoreIndex, setReadMoreIndex] = useState(null);
  const { setSelectedPost } = usePostContext();
  const [myPost, setMyPost] = useState([])
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const className = "MyPosts";
  const canisterId = process.env.CANISTER_ID_IC_ASSET_HANDLER;
  const [loading, setLoading] = useState(false)
  const getpost = async () => {
    const itemsPerPage = 4;
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const paginationPayload = {
      start,
      end,
    }
    try {
      setLoading(true)
      const res = await backendActor.get_my_post(paginationPayload);
      console.log("---res--", res?.Ok?.posts);
      const dataLength = res?.Ok?.size || 0;
      setTotalItems(Math.ceil(dataLength / 4));
      setMyPost(res?.Ok?.posts);
    } catch (error) {
      console.log("error fetching post", error)
    }
    finally{
      setLoading(false)
    }
  }

  useEffect(() => {
    getpost();
  }, [currentPage])

  return (
    <div className={className}>
      <div className="md:ml-10 mx-5 mt-5">
        <h3 className="text-[#05212C] md:text-[24px] text-[18px] md:font-bold font-semibold ml-4" onClick={getpost}>
          Post
        </h3>
        {
          loading ?
          <MuiSkeleton/>
          :
          (
            myPost?.length === 0 ? (
              <NoPostProfile />
            ) : (
              <div className="grid grid-cols-2 md:mt-4 mt-2 mb-6 bg-[#F4F2EC] p-2 rounded-lg gap-2">
                {myPost?.map((post, index) => (
                  <div
                    key={index}
                    className="post relative w-full"
                    onMouseEnter={() => setHoverIndex(index)}
                    onMouseLeave={() => {
                      setHoverIndex(null);
                      setReadMoreIndex(null);
                    }}
                  >
                    <Link to={`/post/${post.post_id}`} onClick={() => setSelectedPost(post)}>
                    <img
                        src={`http://${canisterId}.localhost:4943/f/${post.post_img}`}
                        alt="Post"
                        className="postImage w-full rounded-md object-cover"
                      />
                    </Link>
    
                    <div
                      style={{ opacity: hoverIndex === index ? 1 : 0 }}
                      className="postContant w-full max-h-full flex flex-col gap-4 p-2 overflow-y-auto bg-[#05212C80] backdrop-blur absolute bottom-0 text-white rounded-b-lg transition-opacity duration-500"
                    >
                      <p className="laptop:text-base text-sm">
                        {readMoreIndex === index
                          ? post?.post_description
                          : post?.post_description?.slice(0, 50)}
    
                        {post.post_description?.length > 120 && readMoreIndex !== index && (
                          <span
                            id="readMore"
                            className="text-blue-500 cursor-pointer"
                            onClick={() => setReadMoreIndex(index)}
                          >
                            ..more
                          </span>
                        )}
                        {post.post_description?.length > 120 && readMoreIndex === index && (
                          <span
                            id="readMore"
                            className="text-blue-500 cursor-pointer"
                            onClick={() => setReadMoreIndex(null)}
                          >
                            ..close
                          </span>
                        )}
                      </p>
    
                      <div className="w-full flex flex-row items-center justify-evenly">
                        <span className="flex flex-row gap-2 items-center text-lg">
                          <FaHeart />
                          {post.like_count}
                        </span>
                        <span className="flex flex-row gap-2 items-center text-lg">
                          <FaTelegramPlane />
                          {post.comment_count}
                        </span>
                        <span className="flex flex-row gap-2 items-center text-lg">
                          <BiSolidCommentDetail />
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )
          )
        }
        <Pagination costomClass={"mt-10"} totalItems={totalItems} currentPage={currentPage}
          setCurrentPage={setCurrentPage}/>
      </div>
    </div>
  );
};

export default MyPosts;