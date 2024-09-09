import React, { useState, useEffect } from "react";
import { HiPlus } from "react-icons/hi";
import PostCard from "../../Components/FeedPage/PostCard";
import image from "../../../assets/bg_image.png";
import CreatePostPopup from "../../Components/FeedPage/CreatePostPopup";
import { useAuth } from "../../Components/utils/useAuthClient";
import Container from "../../Components/Container/Container";
import Pagignation from "../../Components/pagignation/Pagignation";
import NoPostProfile from "../../Components/Dao/NoPostProfile";
import nodata from "../../../assets/nodata.png";
import MuiSkeleton from "../../Components/Skeleton/MuiSkeleton";
import LoginModal from "../../Components/Auth/LoginModal";
import { useNavigate } from "react-router-dom";


const FeedPage = () => {
  const [active, setActive] = useState({ all: true, latest: false });
  const [showPopup, setShowPopup] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const { isAuthenticated, login, signInNFID } = useAuth();
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [uplodedPost, setUplodedPost] = useState('')
  const [getLike, setGetLike] = useState(null)
  const [isLiked, setIsLiked] = useState(false)
  const { backendActor } = useAuth();
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const className = "FeedPage";
  const [loading, setLoading] = useState(false)
  console.log("--posts", posts)

  
  const setAllActive = () => {
    setActive({ all: true, latest: false });
  };

  const setLatestActive = () => {
    setActive({ all: false, latest: true });
  };

  const handleCreatePostClick = () => {
    setShowPopup(!showPopup);
  };

  const handleLogin = async () => {
    setLoading(true);
    try {
      await login("Icp");
      window.location.reload(); // Reload after successful login
    } catch (error) {
      console.error('Login failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleNFIDLogin = async () => {
    setLoading(true);
    try {
      await signInNFID();
      window.location.reload(); // Reload after successful NFID login
    } catch (error) {
      console.error('NFID login failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const getDetails = async () => {
    try {
      setLoading(true)
      let response;
      const itemsPerPage = 4;
      const start = (currentPage - 1) * itemsPerPage;
      const end = start + itemsPerPage;
      const paginationPayload = {
        start,
        end,
      }

      if (active.all) {
        response = await backendActor.get_all_posts(paginationPayload);
        const dataLength = response?.size || 0;
        setTotalItems(Math.ceil(dataLength / 4));
        setPosts(response?.posts);
      }
      else if (active.latest) {
        response = await backendActor.get_latest_post(paginationPayload);
        const dataLength = response?.size || 0;
        setTotalItems(Math.ceil(dataLength / 4));
        setPosts(response?.posts);
      }
    } catch (error) {
      console.log("Error fetching posts:", error);
    }
    finally {
      setLoading(false)
    }
  };

  const handleGetResponse = (res) => {
    setUplodedPost(res);
  }

  const handleGetLikePost = (response) => {
    setGetLike(response)
  }

  useEffect(() => {
    if (!isAuthenticated) {
      setShowLoginModal(true); // Show login modal if not authenticated
      return;
    }
    setShowLoginModal(false)
    getDetails();
  }, [isAuthenticated, backendActor, uplodedPost, getLike, active.all, active.latest, currentPage]);

  const handleModalClose = () => {
    setShowLoginModal(false);
    if (!isAuthenticated) {
      navigate("/"); // Redirect to home page if not authenticated
    }
  };

  return (
    <div className={className + " " + "w-full"}>
      {showPopup && (
        <div className="fixed inset-0 bg-black opacity-40 z-40"></div>
      )}

      <div style={{
        backgroundImage: `url("${image}")`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundPosition: "center",

      }}>
        <Container classes={`__filter w-100 mobile:h-[25vh] h-[17vh] big_phone:p-20 small_phone:p-10 p-4 flex flex-col items-start justify-center ${className}`}>
          <h1 className="mobile:text-5xl text-3xl p-3 text-white">Social Feed</h1>

          <div
            className={
              className + "__buttons flex flex-row border-t-2 border-white"
            }
          >
            <button
              className={`px-6 py-2 mobile:text-lg text-sm text-white ${!active.all ? "" : "shadow-lg font-semibold"
                }`}
              onClick={setAllActive}
            >
              All
            </button>
            <button
              className={`px-6 py-2 mobile:text-lg text-sm text-white ${!active.latest ? "" : "shadow-lg font-semibold"
                }`}
              onClick={setLatestActive}
            >
              Latest
            </button>
          </div>
        </Container>
      </div>

      <div className={"bg-[#c8ced3]"}>
        <Container classes={`__label  small_phone:py-8 py-5 mobile:px-10 px-5 flex flex-row w-full justify-between items-center ${className}`}>
          <p className="small_phone:text-4xl text-3xl big_phone:px-8 flex flex-row items-center gap-4">
            {active.all ? "All" : "Latest"}
            <div className="flex flex-col items-start">
              <div className="mobile:w-32 w-12 border-t-2 border-black"></div>
              <div className="mobile:w-14 w-8 small_phone:mt-2 mt-1 border-t-2 border-black"></div>
            </div>
          </p>

          <button
            className="bg-white small_phone:gap-2 gap-1 mobile:px-5 p-2 small_phone:text-base text-sm shadow-xl rounded-full shadow-md flex items-center rounded-2xl hover:bg-[#ececec] hover:scale-105 transition"
            onClick={handleCreatePostClick}>
            <HiPlus />
            Create Post
          </button>
        </Container>
      </div>

      <div 
        className={
          className +
          "__postCards mobile:px-10 px-6 pb-10 bg-[#c8ced3] gap-8 flex flex-col"
        }>
        {
          loading ?
            <MuiSkeleton />
            :
            (
              posts.length === 0 ?
                <Container classes="w-full flex flex-col items-center justify-center p-2">
                  <img src={nodata} alt="No Data" className="mb-1 " />
                  <p className="text-center text-gray-700 text-2xl">
                    There are no post availabel yet!
                  </p>
                </Container>
                :
                <Container classes={'w-full'}>
                  {posts?.reverse().map((posts, i) => <PostCard handleGetLikePost={handleGetLikePost} posts={posts} key={i} />)}
                </Container>
            )
        }
      </div>

      {showPopup && <CreatePostPopup handleGetResponse={handleGetResponse} onClose={() => setShowPopup(false)} />}
      {showLoginModal && <LoginModal isOpen={showLoginModal} onClose={handleModalClose} onLogin={handleLogin} 
          onNFIDLogin={handleNFIDLogin} />}
      <div
        className={
          className +
          "__postCards mobile:px-10 px-6 pb-10 bg-[#c8ced3] gap-8 flex flex-col"
        }>
        <Pagignation totalItems={totalItems} currentPage={currentPage}
          setCurrentPage={setCurrentPage} />
      </div>

    </div>
  );
};

export default FeedPage;