import React, { useState, useEffect } from "react";
import bg_image1 from "../../../assets/bg_image1.png";
import { useAuth } from "../../Components/utils/useAuthClient";
import Container from "../../Components/Container/Container";
import nodata from "../../../assets/gif/nodata.svg";
import LoginModal from "../../Components/Auth/LoginModal";
import { useNavigate } from "react-router-dom";
import ProposalsContent from "../../Components/DaoProfile/ProposalsContent";
import SearchProposals from "../../Components/Proposals/SearchProposals";
import ProposalLoaderSkeleton from "../../Components/SkeletonLoaders/ProposalLoaderSkeleton/ProposalLoaderSkeleton";
import Pagination from "../../Components/pagination/Pagination";

const FeedPage = () => {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const { isAuthenticated, login, signInNFID, backendActor, createDaoActor } =
    useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [showFilter, setShowFilter] = useState(false); // State for the filter dropdown
  const [sortOrder, setSortOrder] = useState("newest"); // State for sorting option
  let itemsPerPage = 4;
  const className = "FeedPage";

  const handleLogin = async () => {
    setLoading(true);
    try {
      await login("Icp");
      window.location.reload();
    } catch (error) {
      console.error("Login failed:", error);
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
      console.error("NFID login failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const fetchAllProposals = async (pagination = {}) => {
    try {
      setLoading(true);
      const allDaos = await backendActor.get_all_dao();
      let allProposals = [];
      for (const dao of allDaos) {
        const proposalPagination = {
          start: pagination.start,
          end: pagination.end + 1,
        };
        try {
          const daoActor = await createDaoActor(dao.dao_canister_id);
          const daoProposals = await daoActor.get_all_proposals(
            proposalPagination
          );
          const proposalsWithDaoId = daoProposals.map((proposal) => ({
            ...proposal,
            dao_canister_id: dao.dao_canister_id,
          }));
          allProposals = [...allProposals, ...proposalsWithDaoId];
        } catch (error) {
          console.error(
            `Error fetching proposals from DAO ${dao.dao_canister_id}:`,
            error
          );
        }
      }
      if (sortOrder === "newest") {
        allProposals.sort((a, b) => {
          const dateA = Number(a.proposal_submitted_at);
          const dateB = Number(b.proposal_submitted_at);
          return dateB - dateA; 
        });
      } else if (sortOrder === "oldest") {
        allProposals.sort((a, b) => {
          const dateA = Number(a.proposal_submitted_at);
          const dateB = Number(b.proposal_submitted_at);
          return dateA - dateB; 
        });
      }
      setHasMore(allProposals.length > itemsPerPage);
      setProposals(allProposals.slice(0, itemsPerPage));
    } catch (error) {
      console.error("Error fetching DAOs and proposals:", error);
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
    fetchAllProposals({
      start: (currentPage - 1) * itemsPerPage,
      end: currentPage * itemsPerPage,
    });
  }, [
    isAuthenticated,
    backendActor,
    createDaoActor,
    currentPage,
    searchTerm,
    sortOrder,
  ]); // Include sortOrder in dependency array

  const handleModalClose = () => {
    setShowLoginModal(false);
    if (!isAuthenticated) {
      navigate("/");
    }
  };

  return (
    <div className={`${className} w-full`}>
      {/* Header Section with Background Image */}
      <div
        style={{
          backgroundImage: `url("${bg_image1}")`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <Container
          classes={`__filter w-100 desktop:h-[220px] h-[168px] top-[70px] big_phone:p-20 small_phone:p-10 py-4 flex flex-col items-start justify-center ${className}`}
        >
          <h1 className="mobile:text-5xl text-3xl p-4 small_phone:mx-[-24px] big_phone:mx-[-60px] lg:mx-2 text-white">
            Social Feed
          </h1>
        </Container>
      </div>

      {/* Filter Section */}
      <div className="bg-[#c8ced3]">
        <Container
          classes={`__label small_phone:py-8 py-5 px-4 small_phone:px-8 desktop:px-20 flex flex-col gap-4`}
        >
          <div className="flex justify-between items-center lg:mx-[70px] desktop:mx-6">
            <p className="small_phone:text-4xl text-3xl  flex flex-row items-center gap-4">
              Most Recent
              <div className="hidden md:flex flex-col items-start">
                <div className="xl:w-32 md:w-20 w-12 border-t-2 border-black"></div>
                <div className="mobile:w-14 w-8 small_phone:mt-2 mt-1 border-t-2 border-black"></div>
              </div>
            </p>
            <button
              className="bg-white text-[#05212C] flex items-center justify-between gap-3 lg:px-6 md:px-5 shadow-xl lg:py-3 py-2 px-4 rounded-full hover:bg-[#f0f4f7] transition-all duration-300 relative"
              onClick={() => setShowFilter((prev) => !prev)}
            >
              <div className="flex items-center">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 27 27"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M10.1251 17.55H16.8751C17.0437 17.5497 17.2064 17.6125 17.3311 17.7262C17.4557 17.8398 17.5333 17.996 17.5486 18.164C17.5638 18.332 17.5156 18.4996 17.4134 18.6338C17.3113 18.768 17.1626 18.8591 16.9966 18.8892L16.8751 18.9H10.1251C9.9564 18.9003 9.79372 18.8375 9.66907 18.7238C9.54442 18.6102 9.46683 18.454 9.45159 18.286C9.43635 18.118 9.48456 17.9504 9.58672 17.8162C9.68888 17.682 9.83759 17.5909 10.0036 17.5608L10.1251 17.55ZM7.42507 12.15H19.5751C19.7438 12.1497 19.9064 12.2125 20.0311 12.3262C20.1557 12.4398 20.2333 12.596 20.2486 12.764C20.2638 12.932 20.2156 13.0996 20.1134 13.2338C20.0113 13.368 19.8626 13.4591 19.6966 13.4892L19.5751 13.5H7.42507C7.2564 13.5003 7.09372 13.4375 6.96907 13.3238C6.84442 13.2102 6.76683 13.054 6.75159 12.886C6.73635 12.718 6.78456 12.5504 6.88672 12.4162C6.98888 12.282 7.13759 12.1909 7.3036 12.1608L7.42507 12.15ZM5.22507 6.75H21.8251C21.9938 6.7497 22.1564 6.8125 22.2811 6.9262C22.4057 7.0398 22.4833 7.196 22.4986 7.364C22.5138 7.532 22.4656 7.6996 22.3634 7.8338C22.2613 7.968 22.1126 8.0591 21.9466 8.0892L21.8251 8.1H5.22507C5.0564 8.1003 4.89372 8.0375 4.76907 7.9238C4.64442 7.8102 4.56683 7.654 4.55159 7.486C4.53635 7.318 4.58456 7.1504 4.68672 7.0162C4.78888 6.882 4.93759 6.7909 5.1036 6.7608L5.22507 6.75Z"
                    fill="#05212C"
                  ></path>
                </svg>
              </div>
              <span className="hidden iphone_SE:flex">Filter</span>
              {showFilter && (
                <div className="absolute top-11 left-[-48px] small_phone:left-0 bg-white shadow-lg rounded-md mt-2 w-28 z-10 border">
                  <ul className="text-sm">
                    <li
                      onClick={() => {
                        setSortOrder("newest");
                        setShowFilter(false);
                      }}
                      className="cursor-pointer py-2 hover:bg-gray-100"
                    >
                      Newest to Oldest
                    </li>
                    <li
                      onClick={() => {
                        setSortOrder("oldest");
                        setShowFilter(false);
                      }}
                      className="cursor-pointer py-2 hover:bg-gray-100"
                    >
                      Oldest to Newest
                    </li>
                  </ul>
                </div>
              )}
            </button>
          </div>
          <div className="flex justify-center mt-2">
            <SearchProposals
              onChange={handleSearchChange}
              value={searchTerm}
              width="70%"
              bgColor="transparent"
              placeholder="Search by proposal ID"
              className="border-2 border-[#AAC8D6] w-full max-w-lg"
            />
          </div>
        </Container>
      </div>

      {/* Post Section */}
      <div
        className={`${className}__postCards mobile:px-10 px-6 pb-10 bg-[#c8ced3] gap-8 flex flex-col`}
      >
        {loading ? (
          <ProposalLoaderSkeleton />
        ) : proposals.length === 0 ? (
          <div className="flex justify-center items-center h-full mb-10 mt-10">
            <Container className="w-full flex flex-col items-center justify-center">
              <img src={nodata} alt="No Data" className="mb-1 ml-[42px]" />
              <p className="text-center mt-4 text-gray-700 text-base">
                You have not created any DAO
              </p>
            </Container>
          </div>
        ) : (
          <div className="mx-2 small_phone:mx-4 mobile:mx-1 lg:mx-16 desktop:mx-20">
            <Container>
              <div className="desktop:mx-12">
                <ProposalsContent
                  proposals={proposals}
                  isMember={true}
                  showActions={false}
                />
              </div>
              <Pagination
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                hasMore={hasMore}
              />
            </Container>
          </div>
        )}
      </div>

      {/* Login Modal */}
      {showLoginModal && (
        <LoginModal
          isOpen={showLoginModal}
          onClose={handleModalClose}
          onLogin={handleLogin}
          onNFIDLogin={handleNFIDLogin}
        />
      )}
    </div>
  );
};

export default FeedPage;
