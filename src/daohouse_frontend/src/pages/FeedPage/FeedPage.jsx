import React, { useState, useEffect } from "react";
import { HiPlus } from "react-icons/hi";

import PostCard from "../../Components/FeedPage/PostCard";

import bg_image1 from "../../../assets/bg_image1.png";

import CreatePostPopup from "../../Components/FeedPage/CreatePostPopup";
import { useAuth } from "../../Components/utils/useAuthClient";
import Container from "../../Components/Container/Container";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import NoPostProfile from "../../Components/Dao/NoPostProfile";
import nodata from "../../../assets/gif/nodata.svg";
import MuiSkeleton from "../../Components/SkeletonLoaders/MuiSkeleton";
import LoginModal from "../../Components/Auth/LoginModal";
import { useNavigate } from "react-router-dom";
import Proposals from "../Proposals/Proposals";
import ProposalsContent from "../../Components/DaoProfile/ProposalsContent";
import SearchProposals from "../../Components/Proposals/SearchProposals";
import ProposalLoaderSkeleton from "../../Components/SkeletonLoaders/ProposalLoaderSkeleton/ProposalLoaderSkeleton";
import Pagination from "../../Components/pagination/Pagination";


const FeedPage = () => {
  const [active, setActive] = useState({ all: false, latest: true });
  const [showPopup, setShowPopup] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const { isAuthenticated, login, signInNFID, backendActor, createDaoActor } = useAuth();
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");
  const [hasMore, setHasMore] = useState(true);
  const [proposals, setProposals] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [fetchedProposals, setFetchedProposals] = useState([]);

  const itemsPerPage = 4;

  const className = "FeedPage";

  // Function to set active tabs
  const setAllActive = () => {
    setActive({ all: true, latest: false });
    setCurrentPage(1); // Reset to first page when switching
  };

  const setLatestActive = () => {
    setActive({ all: false, latest: true });
    setCurrentPage(1); // Reset to first page when switching
  };

  // Handle Create Post Popup
  const handleCreatePostClick = () => {
    setShowPopup(!showPopup);
  };

  // Handle Login Functions
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

  // Handle Search Input Change with Debounce (Optional)
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1); // Reset to first page on new search
  };

  // Fetch All Proposals Across All DAOs
  const fetchAllProposals = async () => {
    setLoading(true);
    const daoPagination = {
      start: 0,
      end: 1000, // Adjust as needed to cover all DAOs
    };

    try {
      // Fetch all DAOs
      const allDaos = await backendActor.get_all_dao(daoPagination);
      let allProposals = [];

      for (const dao of allDaos) {
        const proposalPagination = {
          start: 0,
          end: 1000, // Adjust as needed to cover all proposals in each DAO
        };

        try {
          const daoActor = await createDaoActor(dao.dao_canister_id);
          const daoProposals = await daoActor.get_all_proposals(proposalPagination);
          console.log(`Proposals from DAO ${dao.dao_canister_id}:`, daoProposals);
          const proposalsWithDaoId = daoProposals.map((proposal) => ({
            ...proposal,
            dao_canister_id: dao.dao_canister_id,
          }));
          allProposals = allProposals.concat(proposalsWithDaoId);
        } catch (error) {
          console.error(`Error fetching proposals from DAO ${dao.dao_canister_id}:`, error);
        }
      }

      // If there's a search term, filter proposals
      if (searchTerm.trim() !== "") {
        allProposals = allProposals.filter((proposal) =>
          proposal.proposal_id.toLowerCase().includes(searchTerm.trim().toLowerCase())
        );
      }

      setTotalItems(allProposals.length);
      setFetchedProposals(allProposals);

      // Client-side pagination
      const start = (currentPage - 1) * itemsPerPage;
      const end = start + itemsPerPage;
      const currentProposals = allProposals.slice(start, end);

      setProposals(currentProposals);
      setHasMore(end < allProposals.length);

    } catch (error) {
      console.error("Error fetching DAOs and proposals:", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle Search and Pagination
  useEffect(() => {
    if (!isAuthenticated) {
      setShowLoginModal(true);
      return;
    }
    setShowLoginModal(false);
    fetchAllProposals();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, backendActor, createDaoActor, currentPage, searchTerm]);

  // Handle Modal Close
  const handleModalClose = () => {
    setShowLoginModal(false);
    if (!isAuthenticated) {
      navigate("/");
    }
  };

  return (
    <div className={`${className} w-full`}>
      {showPopup && (
        <div className="fixed inset-0 bg-black opacity-40 z-40"></div>
      )}

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
          classes={`__filter w-100 mobile:h-[25vh] h-[17vh] top-[70px] big_phone:p-20 small_phone:p-10 p-4 flex flex-col items-start justify-center ${className}`}
        >
          <h1 className="mobile:text-5xl text-3xl p-3 text-white">Social Feed</h1>
        </Container>
      </div>

      {/* Filter Section */}
      <div className="bg-[#c8ced3]">
        <Container
          classes={`__label small_phone:py-8 py-5 mobile:px-10 px-5 flex flex-col-reverse gap-4 lg:flex-row w-full justify-between items-start lg:items-center ${className}`}
        >
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

      {/* Post Section */}
      <div
        className={`${className}__postCards mobile:px-10 px-6 pb-10 bg-[#c8ced3] gap-8 flex flex-col`}
      >
        {loading ? (
          <ProposalLoaderSkeleton />
        ) : proposals.length === 0 ? (
          <Container className="w-full flex flex-col items-center justify-center ">
            <img src={nodata} alt="No Data" className="mb-1  ml-[100px] " />
            <p className="text-center text-gray-700 text-base mt-6 ml-[80px]">
              There are no proposals available yet!
            </p>
          </Container>
        ) : (
          <Container className="w-full">
            <ProposalsContent
              proposals={proposals}
              isMember={true}
              showActions={false}
            />
          </Container>
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

      {/* Pagination Controls */}
      {!loading && proposals.length > 0 && (
        <div className={`${className}__pagination mobile:px-10 px-6 pb-10 bg-[#c8ced3] gap-8 flex flex-col`}>
          <Pagination
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            hasMore={hasMore}
          />
        </div>
      )}
    </div>
  );
};


export default FeedPage;
