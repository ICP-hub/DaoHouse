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
import { Principal } from "@dfinity/principal";

const FeedPage = () => {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const { isAuthenticated, login, signInNFID, backendActor, createDaoActor } =
    useAuth();
  const navigate = useNavigate();
  const [sortOrder, setSortOrder] = useState("newest");
  const [searchTerm, setSearchTerm] = useState("");
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isMember, setIsMember] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
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

  const fetchAllProposals = async (pagination = {}, searchTerm = "") => {
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
          const profileResponse = await backendActor.get_user_profile();
          if (profileResponse.Ok) {
            const currentUserId = Principal.fromText(
              profileResponse.Ok.user_id.toString()
            );
          const daoDetails = await daoActor.get_dao_detail();
          const daoMembers = daoDetails?.all_dao_user || [];
          const isCurrentUserMember =
              Array.isArray(daoMembers) &&
              daoMembers.some(
                (member) => member.toString() === currentUserId.toString()
              );
            if (isCurrentUserMember) {
              setIsMember(true);
            }
          }

          if (searchTerm) {
            const filteredProposals = proposalsWithDaoId.filter((proposal) =>
              proposal.proposal_id.toLowerCase().includes(searchTerm.toLowerCase())
            );
            allProposals = [...allProposals, ...filteredProposals];
          } else {
            allProposals = [...allProposals, ...proposalsWithDaoId];
          }
          
          const hasMoreData = searchTerm ? allProposals.length > itemsPerPage : daoProposals.length > itemsPerPage;
          setHasMore(hasMoreData);
          const proposalsToDisplay = searchTerm ? allProposals.slice(0, itemsPerPage) : proposalsWithDaoId.slice(0, itemsPerPage);
          setProposals(proposalsToDisplay);
        } catch (error) {
          console.error(
            `Error fetching proposals from DAO ${dao.dao_canister_id}:`,
            error
          );
        }
      }
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
    },
    searchTerm);
  }, [isAuthenticated, backendActor, createDaoActor, currentPage, searchTerm]);

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
          classes={`__label small_phone:py-8 py-5 px-4 small_phone:px-8 desktop:px-20 lg:pr-24 desktop:pr-24 flex justify-between items-center`}
        >
          <p className="small_phone:text-4xl text-3xl big_phone:px-2 tablet:px-6 lg:px-[70px] desktop:px-6 flex flex-row items-center gap-4">
            Most Recent
          </p>
          <div className="hidden md:flex flex-grow justify-center mx-2">
            <SearchProposals
              onChange={handleSearchChange}
              value={searchTerm}
              width="70%"
              bgColor="transparent"
              placeholder="Search by proposal ID"
              className="border-2 border-[#AAC8D6] w-full max-w-lg"
            />
          </div>
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
                  d="M10.1251 17.55H16.8751C17.0437 17.5497 17.2064 17.6125 17.3311 17.7262C17.4557 17.8398 17.5333 17.996 17.5486 18.164C17.5638 18.332 17.5156 18.4996 17.4134 18.6338C17.3113 18.768 17.1626 18.8591 16.9966 18.8892L16.8751 18.9H10.1251C9.9564 18.9003 9.79372 18.8375 9.66907 18.7238C9.54442 18.6102 9.46683 18.454 9.45159 18.286C9.43635 18.118 9.48456 17.9504 9.58672 17.8162C9.68888 17.682 9.83759 17.5909 10.0036 17.5608L10.1251 17.55ZM7.42507 12.15H19.5751C19.7438 12.1497 19.9064 12.2125 20.0311 12.3262C20.1557 12.4398 20.2333 12.596 20.2486 12.764C20.2638 12.932 20.2156 13.0996 20.1134 13.2338C20.0113 13.368 19.8626 13.4591 19.6966 13.4892L19.5751 13.5H7.42507C7.2564 13.5003 7.09371 13.4375 6.96907 13.3238C6.84442 13.2102 6.76683 13.054 6.75159 12.886C6.73635 12.718 6.78456 12.5504 6.88672 12.4162C6.98888 12.282 7.13759 12.1909 7.30357 12.1608L7.42507 12.15ZM4.72507 6.75H22.2751C22.4438 6.74969 22.6064 6.81255 22.7311 6.92619C22.8557 7.03983 22.9333 7.19602 22.9486 7.36401C22.9638 7.532 22.9156 7.6996 22.8134 7.83382C22.7113 7.96804 22.5626 8.05915 22.3966 8.0892L22.2751 8.1H4.72507C4.5564 8.10031 4.39371 8.03746 4.26907 7.92381C4.14442 7.81017 4.06683 7.65398 4.05159 7.48599C4.03635 7.318 4.08456 7.1504 4.18672 7.01618C4.28888 6.88196 4.43759 6.79085 4.60357 6.7608L4.72507 6.75Z"
                  fill="black"
                />
              </svg>
            </div>
            <span className="text-[16px] ml-2 hidden mobile:flex">Filter</span>

            {showFilter && (
              <div className="absolute font-mulish bg-white border border-[#AAC8D6] rounded-lg shadow-lg w-40 z-10 top-full right-0">
                <div
                  className="cursor-pointer p-2 text-sm hover:bg-[#f0f4f7] rounded-t-lg"
                  onClick={() => setSortOrder("newest")}
                >
                  Newest to Oldest
                </div>
                <div
                  className="cursor-pointer p-2 text-sm hover:bg-[#f0f4f7] rounded-b-lg"
                  onClick={() => setSortOrder("oldest")}
                >
                  Oldest to Newest
                </div>
              </div>
            )}
          </button>
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
                  isMember={isMember}
                  showActions={false}
                  sortOrder={sortOrder}
                  setSortOrder={setSortOrder}
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