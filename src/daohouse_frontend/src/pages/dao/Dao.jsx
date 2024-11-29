import React, { useEffect, useState } from "react";
import { HiPlus } from "react-icons/hi";
import { Link, useNavigate } from "react-router-dom";
import DaoCard from "../../Components/Dao/DaoCard";
import nodata from "../../../assets/gif/nodata.svg";
import TopComponent from "../../Components/Dao/TopComponent";
import Container from "../../Components/Container/Container";
import { useAuth } from "../../Components/utils/useAuthClient";
import LoginModal from "../../Components/Auth/LoginModal";
import SearchProposals from "../../Components/Proposals/SearchProposals";
import { Principal } from "@dfinity/principal";
import DaoCardLoaderSkeleton from "../../Components/SkeletonLoaders/DaoCardLoaderSkeleton/DaoCardLoaderSkeleton";
import Pagination from "../../Components/pagination/Pagination";

const Dao = () => {
  const [showAll, setShowAll] = useState(true);
  const [joinedDAO, setJoinedDAO] = useState([]);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [dao, setDao] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingJoinedDAO, setLoaadingJoinedDao] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [fetchedDAOs, setFetchedDAOs] = useState([]);
  const [hasMore, setHasMore] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  const { isAuthenticated, backendActor, createDaoActor, login, signInNFID, stringPrincipal } = useAuth();
  const navigate = useNavigate();


  const handleJoinDaoClick = () => {
    setShowAll(true);
  };

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
      const response = await backendActor.get_all_dao_pagination({
        start: pagination.start,
        end: pagination.end + 1
      });

      const hasMoreData = response.length > itemsPerPage;

      const daoToDisplay = response.slice(0, itemsPerPage);

      const combinedDaoDetails = await fetchDaoDetails(daoToDisplay);
      setHasMore(hasMoreData);
      setDao(combinedDaoDetails);
    } catch (error) {
      console.error("Error fetching DAOs:", error);
    } finally {
      setLoading(false);
    }
  };


  const getSearchDao = async () => {
    if (!searchTerm.trim()) return setFetchedDAOs([]);

    setLoading(true);
    try {
      const response = await backendActor.search_dao(searchTerm);
  
      const hasMoreData = response.length > itemsPerPage;

      const daoToDisplay = response.slice(0, itemsPerPage);

      const combinedSearchDaoDetails = await fetchDaoDetails(daoToDisplay);
      setHasMore(hasMoreData);
      setFetchedDAOs(combinedSearchDaoDetails);
    } catch (error) {
      console.error("Error searching DAOs:", error);
    } finally {
      setLoading(false);
    }
  };


  const getJoinedDaos = async () => {
    try {
      setLoaadingJoinedDao(true);
      const profile = await backendActor.get_profile_by_id(Principal.fromText(stringPrincipal));
      const joinedDaoPrincipals = profile?.Ok?.join_dao || [];

      const joinedDaoDetails = await Promise.all(
        joinedDaoPrincipals.map(async (daoPrincipal) => {
          try {
            const daoCanisterPrincipal = Principal.fromUint8Array(daoPrincipal._arr);
            const daoCanister = await createDaoActor(daoCanisterPrincipal);
            const daoDetails = await daoCanister.get_dao_detail();
            return { ...daoDetails, dao_canister_id: daoCanisterPrincipal.toText() };
          } catch (error) {
            console.error(`Error fetching details for DAO: ${daoPrincipal._arr}`, error);
            return null;
          }
        })
      );
      setJoinedDAO(joinedDaoDetails.filter((dao) => dao !== null));
    } catch (error) {
      console.error("Error fetching joined DAOs:", error);
    } finally {
      setLoaadingJoinedDao(false);
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

  const noDaoFound = searchTerm && fetchedDAOs.length === 0;

  return (
    <div className="bg-zinc-200">

      <TopComponent showAll={showAll} setShowAll={setShowAll} showButtons />

      <div className="bg-gray">
        <Container classes="__label small_phone:py-8 py-5 px-4 mobile:px-10 small_phone:px-8  flex justify-between items-center">
          <div
            onClick={() => (showAll ? getDaos() : getJoinedDaos())}
            className="small_phone:text-4xl text-3xl tablet:ml-16  flex items-center gap-4"
          >
            {showAll ? "All" : "Joined"}
          </div>

          <div className="flex-grow lg:flex justify-center hidden">
            <SearchProposals
              width="70%"
              bgColor="transparent"
              placeholder="Search here"
              className="border-2 border-[#AAC8D6] w-full max-w-lg"
              onChange={(e) => setSearchTerm(e.target.value)}
            />

          </div>


          {showAll && (
            <Link to="/dao/create-dao">
              <button className="bg-white small_phone:gap-2 gap-1 tablet:mr-12 mobile:px-5 p-2 small_phone:text-base text-sm shadow-xl flex items-center rounded-full hover:bg-[#ececec] hover:scale-105 transition">
                <HiPlus />
                Create DAO
              </button>
            </Link>
          )}
        </Container>
      </div>

      {showLoginModal && (
        <LoginModal
          isOpen={showLoginModal}
          onClose={() => navigate("/")}
          onLogin={handleLogin}
          onNFIDLogin={handleNFIDLogin}
        />
      )}

      {loading ? (
        <div className="mx-4">
          <DaoCardLoaderSkeleton />
        </div>
      ) : showAll ? (
        noDaoFound || dao.length === 0 ? (
          <div className="flex justify-center items-center h-full mb-10 mt-10 ">
            <Container className="w-full flex flex-col items-center justify-center   ">
              <img src={nodata} alt="No Data" className="mb-1  ml-[42px]  " />
              <p className="text-center mt-4  text-gray-700 text-base">
                You have not created any DAO
              </p>

            </Container>
          </div>
        ) : (
          <div className="bg-gray">
            <Container classes="__cards tablet:px-10 px-4 small_phone:px-8 md:px-0 pb-10 grid grid-cols-1 md:grid-cols-2 tablet:gap-2 gap-4">
              {(searchTerm ? fetchedDAOs : dao).map((daos, index) => (
                <DaoCard
                  key={index}
                  {...{
                    name: daos.dao_name || "No Name",
                    members: daos.members_count ? Number(BigInt(daos.members_count)) : "0",
                    groups: daos.groups_count ? Number(BigInt(daos.groups_count)) : "0",
                    proposals: daos.proposals_count || "0",
                    image_id: daos.image_id || "No Image",
                    daoCanisterId: daos.dao_canister_id || "No ID",
                  }}
                />
              ))}
            </Container>
            {!loading && (
              <Pagination currentPage={currentPage} setCurrentPage={setCurrentPage} hasMore={hasMore} />
            )}
          </div>
        )
      ) : loadingJoinedDAO ? (
        <DaoCardLoaderSkeleton />
      ) : (searchTerm ? fetchedDAOs : joinedDAO).length ? (
        <div className="bg-gray">
          <Container classes="__cards tablet:px-10 px-4 pb-10 grid grid-cols-1 big_phone:grid-cols-2 tablet:gap-6 gap-4">
            {(searchTerm ? fetchedDAOs : joinedDAO).map((daos, index) => (
              <DaoCard
                key={index}
                {...{
                  name: daos.dao_name || "No Name",
                  members: daos.members_count ? Number(BigInt(daos.members_count)) : "0",
                  groups: daos.groups_count ? Number(BigInt(daos.groups_count)) : "0",
                  proposals: daos.proposals_count || "0",
                  image_id: daos.image_id || "No Image",
                  daoCanisterId: daos.dao_canister_id || "No ID",
                }}
                isJoinedDAO={true}
              />
            ))}
          </Container>
          {!loadingJoinedDAO && (
            <Pagination currentPage={currentPage} setCurrentPage={setCurrentPage} hasMore={hasMore} />
          )}
        </div>
      ) : (
        <div className="flex justify-center items-center h-full mb-10 mt-10 ">
          <Container className="w-full flex flex-col items-center justify-center    ">
            <img src={nodata} alt="No Data" className="mb-1  ml-[42px]  " />
            <p className="text-center  mt-4 text-gray-700 text-base">
              You have not joined any DAO
            </p>
            <button
              onClick={handleJoinDaoClick}
              className="px-16 py-3 ml-[30px]  mt-4 bg-black text-center text-white font-normal rounded-full shadow-md hover:bg-gray-200 hover:text-blue-900 transition-colors duration-300">
              Join DAO
            </button>
          </Container>
        </div>
      )}
    </div>
  );
};


export default Dao;
