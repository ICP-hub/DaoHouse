import React, { useEffect, useState } from "react";
import { HiPlus } from "react-icons/hi";
import { Link, useNavigate } from "react-router-dom";
import DaoCard from "../../Components/Dao/DaoCard";
import NoDataComponent from "../../Components/Dao/NoDataComponent";
import TopComponent from "../../Components/Dao/TopComponent";
import Container from "../../Components/Container/Container";
import { useAuth } from "../../Components/utils/useAuthClient";
import MuiSkeleton from "../../Components/SkeletonLoaders/MuiSkeleton";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import LoginModal from "../../Components/Auth/LoginModal";
import nodata1 from "../../../assets/nodata.png";
import SearchProposals from "../../Components/Proposals/SearchProposals";
import { Principal } from "@dfinity/principal";
import DaoCardLoaderSkeleton from "../../Components/SkeletonLoaders/DaoCardLoaderSkeleton/DaoCardLoaderSkeleton";

const Dao = () => {
  const [showAll, setShowAll] = useState(true);
  const [joinedDAO, setJoinedDAO] = useState([]);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [dao, setDao] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingJoinedDAO, setLoaadingJoinedDao] = useState(false)
  const [searchTerm, setSearchTerm] = useState("");
  const [fetchedDAOs, setFetchedDAOs] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  const { isAuthenticated, backendActor, createDaoActor, login, signInNFID, stringPrincipal } = useAuth();
  const navigate = useNavigate();

  const fetchDaoDetails = async (daoList) => {
    const allDaoDetails = await Promise.all(
      daoList.map(async (data) => {
        try {
          const daoCanister = await createDaoActor(data.dao_canister_id);
          const dao_details = await daoCanister.get_dao_detail();
          return { ...dao_details, daoCanister, dao_canister_id: data.dao_canister_id };
        } catch (err) {
          console.error(`Error fetching details for DAO ${data.dao_canister_id}:`, err);
          return null;
        }
      })
    );
    return allDaoDetails.filter(Boolean); 
  };

  const getDaos = async (pagination = {}) => {
    setLoading(true);
    try {
      const response = await backendActor.get_all_dao(pagination);
      const combinedDaoDetails = await fetchDaoDetails(response.slice(0, itemsPerPage));
      setHasMore(response.length > itemsPerPage);
      setDao(combinedDaoDetails);
    } catch (error) {
      console.error("Error fetching DAOs:", error);
    } finally {
      setLoading(false);
    }
  };

  const getSearchDao = async () => {
    if (!searchTerm.trim()) return setFetchedDAOs([]);

    try {
      const response = await backendActor.search_dao(searchTerm);
      const combinedSearchDaoDetails = await fetchDaoDetails(response);
      setFetchedDAOs(combinedSearchDaoDetails);
    } catch (error) {
      console.error("Error searching DAOs:", error);
    }
  };

  const getJoinedDaos = async () => {
    try {
      setLoaadingJoinedDao(true)
      console.log("Fetching joined DAOs...");
      
      const profile = await backendActor.get_profile_by_id(Principal.fromText(stringPrincipal));
      console.log("Profile:", profile);
      
      const joinedDaoPrincipals = profile?.Ok?.join_dao || [];
      console.log("Joined DAO Principals:", joinedDaoPrincipals);
      
      const joinedDaoDetails = await Promise.all(
        joinedDaoPrincipals.map(async (daoPrincipal) => {
          try {

            const daoCanisterPrincipal = Principal.fromUint8Array(daoPrincipal._arr);
            
            console.log("DAO Canister Principal:", daoCanisterPrincipal.toText());
  
            const daoCanister = await createDaoActor(daoCanisterPrincipal);
  
            const daoDetails = await daoCanister.get_dao_detail();
            
            return { ...daoDetails, dao_canister_id: daoCanisterPrincipal.toText() };
          } catch (error) {
            console.error(`Error fetching details for DAO: ${daoPrincipal._arr}`, error);
            return null; 
          } 
        })
      );
      
      const validDaoDetails = joinedDaoDetails.filter(dao => dao !== null);
      
      setJoinedDAO(validDaoDetails);
      
    } catch (error) {
      console.error("Error fetching joined DAOs:", error);
    } finally {
      setLoaadingJoinedDao(false)
    }
  };
  

  useEffect(() => {
    if (!isAuthenticated) {
      setShowLoginModal(true);
      return;
    }
    setShowLoginModal(false);
    getDaos({ start: (currentPage - 1) * itemsPerPage, end: currentPage * itemsPerPage });
  }, [isAuthenticated, backendActor, currentPage]);

  useEffect(() => {
    if (searchTerm) getSearchDao();
  }, [searchTerm]);

  useEffect(() => {
    if (!showAll) getJoinedDaos();
  }, [showAll]);

  const handleLogin = async (loginMethod) => {
    setLoading(true);
    try {
      await loginMethod();
      window.location.reload();
    } catch (error) {
      console.error("Login failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const noDaoFound = searchTerm && fetchedDAOs.length === 0;

  if(!dao) {
    return (
      <div>
        <NoDataComponent />
      </div>
    )
  }

  return (
    <div className="bg-zinc-200 ">
      <TopComponent showAll={showAll} setShowAll={setShowAll} showButtons />
      <div className="bg-gray">
        <Container classes="__label small_phone:py-8 py-5 mobile:px-10 px-5 flex justify-between items-center">
          <div
            onClick={() => (showAll ? getDaos() : getJoinedDaos())}
            className="small_phone:text-4xl text-3xl big_phone:px-8 flex items-center gap-4"
          >
            {showAll ? "All" : "Joined"}
          </div>
          <div className="flex-grow lg:flex justify-center px-6 mx-2 hidden">
            <SearchProposals
              width="100%"
              bgColor="transparent"
              placeholder="Search here"
              className="border-2 border-[#AAC8D6] w-full max-w-lg"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Link to="/dao/create-dao">
            <button className="bg-white small_phone:gap-2 gap-1 mr-12 mobile:px-5 p-2 small_phone:text-base text-sm shadow-xl flex items-center rounded-full hover:bg-[#ececec] hover:scale-105 transition">
              <HiPlus />
              Create DAO
            </button>
          </Link>
        </Container>
      </div>

      {showLoginModal && (
        <LoginModal
          isOpen={showLoginModal}
          onClose={() => navigate("/")}
          onLogin={() => handleLogin(login)}
          onNFIDLogin={() => handleLogin(signInNFID)}
        />
      )}

      {showAll ? (
        loading ? (
          <DaoCardLoaderSkeleton />
        ) : noDaoFound || dao.length === 0 ? (
          <div className="flex justify-center items-center h-full mb-10 md:mt-40 mx-10">
            <NoDataComponent />
          </div>
        ) : (
          <div className="bg-gray">
            <Container classes="__cards tablet:px-10 px-4 pb-10 grid grid-cols-1 big_phone:grid-cols-2 tablet:gap-6 gap-4">
              {(searchTerm ? fetchedDAOs : dao).map((daos, index) => (
                <DaoCard
                  key={index}
                  {...{
                    name: daos.dao_name || "No Name",
                    followers: daos.followers_count || "0",
                    members: daos.members_count ? Number(BigInt(daos.members_count)) : "0",
                    groups: daos.groups_count ? Number(BigInt(daos.groups_count)) : "0",
                    proposals: daos.proposals_count || "0",
                    image_id: daos.image_id || "No Image",
                    daoCanister: daos.daoCanister,
                    daoCanisterId: daos.dao_canister_id || "No ID",
                  }}
                />
              ))}
            </Container>
            <Pagignation currentPage={currentPage} setCurrentPage={setCurrentPage} hasMore={hasMore} />
          </div>
        )
      ) : loadingJoinedDAO ? (
        <DaoCardLoaderSkeleton />
      ) : joinedDAO.length ? (
        <div className="bg-gray">
          <Container classes="__cards tablet:px-10 px-4 pb-10 grid grid-cols-1 big_phone:grid-cols-2 tablet:gap-6 gap-4">
            {joinedDAO.map((daos, index) => (
              <DaoCard
                key={index}
                {...{
                  name: daos.dao_name || "No Name",
                  followers: daos.followers_count || "0",
                  members: daos.members_count ? Number(BigInt(daos.members_count)) : "0",
                  groups: daos.groups_count ? Number(BigInt(daos.groups_count)) : "0",
                  proposals: daos.proposals_count || "0",
                  image_id: daos.image_id || "No Image",
                  daoCanister: daos.daoCanister,
                  daoCanisterId: daos.dao_canister_id || "No ID",
                }}
              />
            ))}
          </Container>
        </div>
      ) : (
        <div className="mt-10 mb-10 md:mt-40 mobile:mx-10">
          <NoDataComponent />
        </div>
      )}
    </div>
  );
};

export default Dao;



export const Pagignation = ({ currentPage, setCurrentPage, hasMore }) => {
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="pagination">
      <div className="flex items-center gap-12 justify-center mt-3">
        <button
          className={`text-xl flex items-center ml-1 ${currentPage === 1
            ? "text-gray-400 cursor-not-allowed"
            : "text-black hover:text-gray-500 cursor-pointer"
            }`}
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <FaArrowLeft /> Prev
        </button>
        <button
          className={`text-xl flex items-center px-3 py-1 transition duration-300 ease-in-out ${!hasMore
            ? "text-gray-400 cursor-not-allowed"
            : "text-black hover:text-gray-500 cursor-pointer"
            }`}
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={!hasMore}
        >
          Next <FaArrowRight />
        </button>
      </div>
    </div>

  );
};
