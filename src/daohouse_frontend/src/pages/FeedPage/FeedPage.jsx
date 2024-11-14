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

const FeedPage = () => {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const { isAuthenticated, login, signInNFID, backendActor, createDaoActor } = useAuth();
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");
  const [hasMore, setHasMore] = useState(true);
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(false);
  const pageGroupSize = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;
  const [totalPages, setTotalPages] = useState(1);

  const className = "FeedPage";



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
    setCurrentPage(1);
  };

  // Fetch All Proposals Across All DAOs
  const fetchAllProposals = async () => {
    setLoading(true);
    const daoPagination = {
      start: 0,
      end: 1000,
    };

    try {
      // Fetch all DAOs
      const allDaos = await backendActor.get_all_dao(daoPagination);
      let allProposals = [];

      for (const dao of allDaos) {
        const proposalPagination = {
          start: 0,
          end: 1000,
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

      if (searchTerm.trim() !== "") {
        allProposals = allProposals.filter((proposal) =>
          proposal.proposal_id.toLowerCase().includes(searchTerm.trim().toLowerCase())
        );
      }

      const start = (currentPage - 1) * itemsPerPage;
      const end = start + itemsPerPage;
      const currentProposals = allProposals.slice(start, end);

      setProposals(currentProposals);
      setTotalPages(Math.ceil(allProposals.length / itemsPerPage));
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
    fetchAllProposals();

  }, [isAuthenticated, backendActor, createDaoActor, currentPage, searchTerm]);


  const handleModalClose = () => {
    setShowLoginModal(false);
    if (!isAuthenticated) {
      navigate("/");
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePageClick = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const currentGroupStart = Math.max(currentPage - 1, 0) + 1;
  const currentGroupEnd = Math.min(currentGroupStart + pageGroupSize - 1, totalPages);  


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
          <h1 className="mobile:text-5xl text-3xl p-4 small_phone:mx-[-24px] big_phone:mx-[-60px] lg:mx-2 text-white">Social Feed</h1>
        </Container>
      </div>

      {/* Filter Section */}
      <div className="bg-[#c8ced3]">
        <Container
          classes={`__label small_phone:py-8 py-5 px-4 small_phone:px-8 desktop:px-20 flex justify-between items-center`}
        >
          <p className="small_phone:text-4xl text-3xl big_phone:px-2 tablet:px-6 lg:px-[70px] desktop:px-6 flex flex-row items-center gap-4">
            Most Recent
            <div className="flex flex-col items-start">
              <div className="xl:w-32 md:w-20 w-12 border-t-2 border-black"></div>
              <div className="mobile:w-14 w-8 small_phone:mt-2 mt-1 border-t-2 border-black"></div>
            </div>
          </p>
          <div className="hidden md:flex flex-grow justify-center px-6 mx-2">
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
      <div className={`${className}__postCards mobile:px-10 px-6 pb-10 bg-[#c8ced3] gap-8 flex flex-col`}>
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
          <div className="flex justify-center mt-4 mb-4">
            <button
              onClick={handlePreviousPage}
              disabled={currentPage === 1}
              className="mr-2 p-2 border"
            >
              Previous
            </button>

            {/* Page buttons based on the current group */}
            {[...Array(currentGroupEnd - currentGroupStart + 1)].map((_, idx) => {
              const pageNumber = currentGroupStart + idx;
              return (
                <button
                  key={pageNumber}
                  onClick={() => handlePageClick(pageNumber)}
                  className={`p-2 border ${currentPage === pageNumber ? "bg-black text-white" : ""}`}
                >
                  {pageNumber}
                </button>
              );
            })}

            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className="ml-2 p-2 border"
            >
              Next
            </button>
          </div>
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
