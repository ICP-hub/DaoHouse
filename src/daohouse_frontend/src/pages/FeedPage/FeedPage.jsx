// import React, { useState, useEffect } from "react";
// import { HiPlus } from "react-icons/hi";
// import PostCard from "../../Components/FeedPage/PostCard";
// import image from "../../../assets/bg_image.png";
// import CreatePostPopup from "../../Components/FeedPage/CreatePostPopup";
// import { useAuth } from "../../Components/utils/useAuthClient";
// import Container from "../../Components/Container/Container";
// import Pagignation from "../../Components/pagignation/Pagignation";
// import NoPostProfile from "../../Components/Dao/NoPostProfile";
// import nodata from "../../../assets/nodata.png";
// import MuiSkeleton from "../../Components/Skeleton/MuiSkeleton";
// import LoginModal from "../../Components/Auth/LoginModal";
// import { useNavigate } from "react-router-dom";

// const FeedPage = () => {
//   const [active, setActive] = useState({ all: false, latest: true });
//   const [showPopup, setShowPopup] = useState(false);
//   const [showLoginModal, setShowLoginModal] = useState(false);
//   const { isAuthenticated, login, signInNFID } = useAuth();
//   const navigate = useNavigate();
//   const [posts, setPosts] = useState([]);
//   const [uplodedPost, setUplodedPost] = useState('');
//   const [getLike, setGetLike] = useState(null);
//   const [isLiked, setIsLiked] = useState(false);
//   const { backendActor } = useAuth();
  // const [totalItems, setTotalItems] = useState(0);
//   const [currentPage, setCurrentPage] = useState(1);
//   const className = "FeedPage";
//   const [loading, setLoading] = useState(false);
//   console.log("--posts", posts);

//   const setAllActive = () => {
//     setActive({ all: true, latest: false });
//   };

//   const setLatestActive = () => {
//     setActive({ all: false, latest: true });
//   };

//   const handleCreatePostClick = () => {
//     setShowPopup(!showPopup);
//   };

//   const handleLogin = async () => {
//     setLoading(true);
//     try {
//       await login("Icp");
//       window.location.reload(); // Reload after successful login
//     } catch (error) {
//       console.error('Login failed:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleNFIDLogin = async () => {
//     setLoading(true);
//     try {
//       await signInNFID();
//       window.location.reload(); // Reload after successful NFID login
//     } catch (error) {
//       console.error('NFID login failed:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const getDetails = async () => {
//     try {
//       setLoading(true);
//       let response;
//       const itemsPerPage = 4;
//       const start = (currentPage - 1) * itemsPerPage;
//       const end = start + itemsPerPage;
//       const paginationPayload = { start, end };

//       if (active.all) {
//         response = await backendActor.get_all_posts(paginationPayload);

//         console.log("res",response);
//         const dataLength = response?.size || 0;
//         setTotalItems(Math.ceil(dataLength / 4));
//         setPosts(response?.posts);
//       }
//     else if (active.latest) {

//         response = await backendActor.get_latest_post(paginationPayload);
//       }

//       if (response?.posts) {
//         const cleanedPosts = response.posts.filter(post => {
//           const timestamp = Number(post.post_created_at);
//           return !isNaN(timestamp) && timestamp > 0; // Ensure valid timestamps
//         });

//         const sortedPosts = cleanedPosts.sort((a, b) => {
//           const timestampA = Number(a.post_created_at);
//           const timestampB = Number(b.post_created_at);

//           // Convert nanoseconds to milliseconds
//           const dateA = new Date(timestampA / 1_000_000);
//           const dateB = new Date(timestampB / 1_000_000);

//           // Log dates for debugging
//           console.log("Date A:", dateA, "Date B:", dateB);

//           return dateB - dateA;
//         });

//         // Log sorted posts for debugging
//         console.log("Sorted posts:", sortedPosts);

//         setPosts(sortedPosts);
//         const dataLength = response.size || 0;
//         setTotalItems(Math.ceil(dataLength / 4));
//       }
//     } catch (error) {
//       console.log("Error fetching posts:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleGetResponse = (res) => {
//     setUplodedPost(res);
//   }

//   const handleGetLikePost = (response) => {
//     setGetLike(response)
//   }

//   useEffect(() => {
//     if (!isAuthenticated) {
//       setShowLoginModal(true); // Show login modal if not authenticated
//       return;
//     }
//     setShowLoginModal(false)
//     getDetails();
//   }, [isAuthenticated, backendActor, uplodedPost, getLike, active.all, active.latest, currentPage]);

//   const handleModalClose = () => {
//     setShowLoginModal(false);
//     if (!isAuthenticated) {
//       navigate("/"); // Redirect to home page if not authenticated
//     }
//   };

//   return (
//     <div className={className + " " + "w-full"}>
//       {showPopup && (
//         <div className="fixed inset-0 bg-black opacity-40 z-40"></div>
//       )}

//       <div style={{
//         backgroundImage: `url("${image}")`,
//         backgroundRepeat: "no-repeat",
//         backgroundSize: "cover",
//         backgroundPosition: "center",
//       }}>
//         <Container classes={`__filter w-100 mobile:h-[25vh] h-[17vh] big_phone:p-20 small_phone:p-10 p-4 flex flex-col items-start justify-center ${className}`}>
//           <h1 className="mobile:text-5xl text-3xl p-3 text-white">Social Feed</h1>

//           <div
//             className={
//               className + "__buttons flex flex-row border-t-2 border-white"
//             }
//           >
//             <button
//               className={`px-6 py-2 mobile:text-lg text-sm text-white ${!active.all ? "" : "shadow-lg font-semibold"
//                 }`}
//               onClick={setAllActive}
//             >
//               All
//             </button>
//             <button
//               className={`px-6 py-2 mobile:text-lg text-sm text-white ${!active.latest ? "" : "shadow-lg font-semibold"
//                 }`}
//               onClick={setLatestActive}
//             >
//               Latest
//             </button>
//           </div>
//         </Container>
//       </div>

//       <div className={"bg-[#c8ced3]"}>
//         <Container classes={`__label  small_phone:py-8 py-5 mobile:px-10 px-5 flex flex-row w-full justify-between items-center ${className}`}>
//           <p className="small_phone:text-4xl text-3xl big_phone:px-8 flex flex-row items-center gap-4">
//             {active.all ? "All" : "Latest"}
//             <div className="flex flex-col items-start">
//               <div className="mobile:w-32 w-12 border-t-2 border-black"></div>
//               <div className="mobile:w-14 w-8 small_phone:mt-2 mt-1 border-t-2 border-black"></div>
//             </div>
//           </p>

//           <button
//             className="bg-white small_phone:gap-2 gap-1 mr-12  small_phone:mr-12 mr-6  mobile:px-5 p-2 small_phone:text-base text-sm shadow-xl rounded-full shadow-md flex items-center rounded-2xl hover:bg-[#ececec] hover:scale-105 transition"
//             onClick={handleCreatePostClick}>
//             <HiPlus />
//             Create Post
//           </button>
//         </Container>
//       </div>

//       {/* Post section  */}
//        <div 
//         className={
//           className +
//           "__postCards mobile:px-10 px-6 pb-10 bg-[#c8ced3] gap-8 flex flex-col "
//         }>
//         {
//           loading ?
//             <MuiSkeleton />
//             :
//             (
//               posts.length === 0 ?
//                 <Container classes="w-full flex flex-col items-center justify-center p-2 ">
//                   <img src={nodata} alt="No Data" className="mb-1 " />
//                   <p className="text-center text-gray-700 text-2xl">
//                   There are no post availabel yet!
//                   </p>
//                 </Container>
//                 :
//                 <Container classes={'w-full '}>
//                   {posts?.map((posts, i) => <PostCard handleGetLikePost={handleGetLikePost} posts={posts} key={i} />)}
//                 </Container>
//             )
//         }
//       </div> 

//       {showPopup && <CreatePostPopup handleGetResponse={handleGetResponse} onClose={() => setShowPopup(false)} />}
//       {showLoginModal && <LoginModal isOpen={showLoginModal} onClose={handleModalClose} onLogin={handleLogin} 
//           onNFIDLogin={handleNFIDLogin} />}
//       <div
//         className={
//           className +
//           "__postCards mobile:px-10 px-6 pb-10 bg-[#c8ced3] gap-8 flex flex-col"
//         }>
      //   <Pagignation  totalItems={totalItems} currentPage={currentPage}
      //     setCurrentPage={setCurrentPage} />
      // </div>

//     </div>
//   );
// };

// export default FeedPage;



import React, { useState, useEffect } from "react";
import { HiPlus } from "react-icons/hi";

import PostCard from "../../Components/FeedPage/PostCard";

import bg_image1 from "../../../assets/bg_image1.png";

import CreatePostPopup from "../../Components/FeedPage/CreatePostPopup";
import { useAuth } from "../../Components/utils/useAuthClient";
import Container from "../../Components/Container/Container";
import Pagignation from "../../Components/pagignation/Pagignation";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import NoPostProfile from "../../Components/Dao/NoPostProfile";
import nodata from "../../../assets/nodata.png";
import MuiSkeleton from "../../Components/SkeletonLoaders/MuiSkeleton";
import LoginModal from "../../Components/Auth/LoginModal";
import { useNavigate } from "react-router-dom";
import Proposals from "../Proposals/Proposals";
import ProposalsContent from "../../Components/DaoProfile/ProposalsContent";
import SearchProposals from "../../Components/Proposals/SearchProposals";
import ProposalLoaderSkeleton from "../../Components/SkeletonLoaders/ProposalLoaderSkeleton/ProposalLoaderSkeleton";

const FeedPage = () => {
  const [active, setActive] = useState({ all: false, latest: true });
  const [showPopup, setShowPopup] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const { isAuthenticated, login, signInNFID, backendActor, createDaoActor } = useAuth();
  const navigate = useNavigate();
  const [searchedProposal, setSearchedProposal] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [hasMore, setHasMore] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [proposals, setProposals] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [fetchedProposals, setFetchedProposals] = useState([])
  const className = "FeedPage";
  console.log(proposals);
  

  const itemsPerPage = 15;

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
      window.location.reload();
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
      window.location.reload();
    } catch (error) {
      console.error('NFID login failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1);
  };

  const getAllProposalsFromAllDaos = async () => {
    setLoading(true);
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage + 1;
    const pagination = {
      start,
      end,
    };
  
    try {
      const allDaos = await backendActor.get_all_dao(pagination);
      let allProposals = [];
  
      if (searchTerm.trim() === "") {
        for (const dao of allDaos) {
          const daoActor = await createDaoActor(dao.dao_canister_id);
          const daoProposals = await daoActor.get_all_proposals(pagination);
          console.log(daoProposals);
          const proposalsWithDaoId = daoProposals.map((proposal) => ({
            ...proposal,
            dao_canister_id: dao.dao_canister_id,
          }));
          allProposals = allProposals.concat(proposalsWithDaoId);
        }
        setProposals(allProposals.slice(0, itemsPerPage));
        setHasMore(allProposals.length > itemsPerPage);
        setTotalItems(allProposals.length);
      } else {
        // Search logic
        let searchResults = [];
        for (const dao of allDaos) {
          const daoActor = await createDaoActor(dao.dao_canister_id);
          try {
            const response = await daoActor.search_proposal(searchTerm.trim());
            if (response.length) {
              const searchResultsWithDaoId = response.map((proposal) => ({
                ...proposal,
                dao_canister_id: dao.dao_canister_id, // Attach dao_canister_id to each proposal
              }));
              searchResults = searchResults.concat(searchResultsWithDaoId);
            }
          } catch (error) {
            console.error(`Error searching proposals in DAO ${dao.dao_canister_id}:`, error);
          }
        }
        // Update the state after all proposals are gathered
        setProposals(searchResults.slice(0, itemsPerPage));
        setHasMore(searchResults.length > itemsPerPage);
        setTotalItems(searchResults.length);
      }
    } catch (error) {
      console.error("Error fetching proposals:", error);
    } finally {
      setLoading(false);
    }
  };
  

  useEffect(() => {
    if (!isAuthenticated) {
      setShowLoginModal(true);
      return;
    }
    setShowLoginModal(false);
    getAllProposalsFromAllDaos();
  }, [isAuthenticated, backendActor, currentPage, searchTerm]);

  

  const handleModalClose = () => {
    setShowLoginModal(false);
    if (!isAuthenticated) {
      navigate("/");
    }
  };

  return (
    <div className={className + " " + "w-full "}>
      {showPopup && (
        <div className="fixed inset-0 bg-black opacity-40 z-40"></div>
      )}

      <div style={{
        backgroundImage: `url("${bg_image1}")`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}>
        <Container classes={`__filter w-100 mobile:h-[25vh] h-[17vh] top-[70px] big_phone:p-20 small_phone:p-10 p-4 flex flex-col items-start justify-center ${className}`}>
          <h1 className="mobile:text-5xl text-3xl p-3 text-white">Social Feed</h1>

          
        </Container>
      </div> 

      <div className={"bg-[#c8ced3]"}>
        <Container classes={`__label  small_phone:py-8 py-5 mobile:px-10 px-5 flex flex-col-reverse gap-4 lg:flex-row w-full justify-between items-start lg:items-center ${className}`}>
          <p className="small_phone:text-4xl text-3xl big_phone:px-8 flex flex-row items-center translate-x-[20px] gap-4">
            Most Recent
            <div className="flex flex-col items-start">
              <div className="mobile:w-32 w-12 border-t-2 border-black"></div>
              <div className="mobile:w-14 w-8 small_phone:mt-2 mt-1 border-t-2 border-black"></div>
            </div>
          </p>
          <div className="flex flex-grow justify-center px-6 mx-2">
              <SearchProposals
                onChange={handleSearchChange} 
                value={searchTerm}
                width="100%"
                bgColor="transparent"
                placeholder="Search by proposal ID"
                className="border-2 border-[#AAC8D6] w-full max-w-lg"
              />
            </div>

        </Container>
      </div>
         
      {/* Post section */}
      <div
        className={
          className +
          "__postCards mobile:px-10 px-6 pb-10 bg-[#c8ced3] gap-8 flex flex-col "
        }>
        {
          loading ?
            <ProposalLoaderSkeleton />
            :
            ( proposals).length === 0 ?
              <Container classes="w-full flex flex-col items-center justify-center ">
                <img src={nodata} alt="No Data" className="mb-1 " />
                <p className="text-center text-gray-700 text-2xl">
                  There are no proposals available yet!
                </p>
              </Container>
              :
                <Container classes={'w-full'} key={proposals.proposal_id}>
                  <ProposalsContent proposals={ proposals} isMember={true} showActions={false} />
                </Container>
        }
      </div>

      {/* {showPopup && <CreatePostPopup handleGetResponse={setUplodedPost} onClose={() => setShowPopup(false)} />} */}
      {showLoginModal && <LoginModal isOpen={showLoginModal} onClose={handleModalClose} onLogin={handleLogin} 
          onNFIDLogin={handleNFIDLogin} />}
      <div
        className={
          className +
          "__postCards mobile:px-10 px-6 pb-10 bg-[#c8ced3] gap-8 flex flex-col"
        }>
        {/* <Pagignation totalItems={proposals.length} currentPage={1} itemsPerPage={itemsPerPage} setCurrentPage={() => {}} /> */}
        <Pagignation 
            totalItems={totalItems} 
            currentPage={currentPage} 
            itemsPerPage={itemsPerPage}
            setCurrentPage={setCurrentPage} 
            hasMore={hasMore} 
        />
      
      </div>
    </div>
  );
};

export default FeedPage;


// export const Pagignation = ({ currentPage, setCurrentPage, hasMore }) => {
//   const handlePageChange = (page) => {
//     setCurrentPage(page);
//   };

//   return (
//     <div className="pagination">
//       <div className="flex items-center gap-12 justify-center mt-3">
//         <button
//           className={`text-xl flex items-center ml-1 ${currentPage === 1
//             ? "text-gray-400 cursor-not-allowed"
//             : "text-black hover:text-gray-500 cursor-pointer"
//             }`}
//           onClick={() => handlePageChange(currentPage - 1)}
//           disabled={currentPage === 1}
//         >
//           <FaArrowLeft /> Prev
//         </button>
//         <button
//           className={`text-xl flex items-center px-3 py-1 transition duration-300 ease-in-out ${!hasMore
//             ? "text-gray-400 cursor-not-allowed"
//             : "text-black hover:text-gray-500 cursor-pointer"
//             }`}
//           onClick={() => handlePageChange(currentPage + 1)}
//           disabled={!hasMore}
//         >
//           Next <FaArrowRight />
//         </button>
//       </div>
//     </div>

//   );
// };


