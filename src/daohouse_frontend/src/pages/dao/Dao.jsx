import React, { useEffect, useState } from "react";
import { HiPlus } from "react-icons/hi";
import { Link, useNavigate } from "react-router-dom";
import DaoCard from "../../Components/Dao/DaoCard";
import NoDataComponent from "../../Components/Dao/NoDataComponent";
import TopComponent from "../../Components/Dao/TopComponent";
import Container from "../../Components/Container/Container";
import { useAuth } from "../../Components/utils/useAuthClient";
import MuiSkeleton from "../../Components/Skeleton/MuiSkeleton";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import LoginModal from "../../Components/Auth/LoginModal";
import nodata1 from "../../../assets/nodata.png";
import SearchProposals from "../../Components/Proposals/SearchProposals";



const Dao = () => {
  const [showAll, setShowAll] = useState(true);
  const [joinedDAO, setJoinedDAO] = useState([]);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [dao, setDao] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [fetchedDAOs, setFetchedDAOs] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  console.log("current page",currentPage)
  // const [totalItems, setTotalItems] = useState(0);
  // console.log("totalitems",totalItems)
  const itemsPerPage = 4;

  const { backendActor, createDaoActor, login, signInNFID } = useAuth();

  const fetchDaoDetails = async (daoList) => {
    let allDaoDetails = [];
    await Promise.all(daoList.map(async (data) => {
      try {
        const daoCanister = await createDaoActor(data.dao_canister_id);
        const dao_details = await daoCanister.get_dao_detail();
        // console.log("dao_details", dao_details);

        allDaoDetails.push({ ...dao_details, daoCanister, dao_canister_id: data.dao_canister_id });
      } catch (err) {
        console.error(`Error fetching details for DAO ${data.dao_canister_id}:`, err);
      }
    }));
    return allDaoDetails;
  };

  useEffect(() => {
    if (!isAuthenticated) {
      setShowLoginModal(true); // Show login modal if not authenticated
      return;
    }
    setShowLoginModal(false)
    getDaos(currentPage);
  }, [ isAuthenticated, backendActor, currentPage]);

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

  const handleModalClose = () => {
    setShowLoginModal(false);
    if (!isAuthenticated) {
      navigate("/"); // Redirect to home page if not authenticated
    }
  };

  const getDaos = async () => {
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage + 1;
    const pagination = {
      start,
      end,
    };
    try {
      setLoading(true);
      let response = await backendActor.get_all_dao(pagination);
      console.log("response",response)
      // setTotalItems(response.totalItems);
      const combinedDaoDetails = await fetchDaoDetails(response.slice(0, itemsPerPage)); // Get only the current page items
      setHasMore(response.length > itemsPerPage);
      setDao(combinedDaoDetails);
    } catch (error) {
      console.error('Error fetching DAOs:', error);
    } finally {
      setLoading(false);
    }
  };

  const getsearchdao = async () => {
    try {
      if (searchTerm.trim() === "") {
        setFetchedDAOs([]);
        return;
      }

      const response = await backendActor.search_dao(searchTerm);
      const combinedSearchDaoDetails = await fetchDaoDetails(response);
      setFetchedDAOs(combinedSearchDaoDetails);
    } catch (error) {
      console.error("Error fetching DAOs:", error);
    }
  };

  useEffect(() => {
    getsearchdao();
  }, [searchTerm]);

  const noDaoFound = searchTerm && fetchedDAOs.length === 0;

  return (
    <div className="bg-zinc-200  mt-[-90px] ">
      <TopComponent showAll={showAll} setShowAll={setShowAll} showButtons={true} />
      <div className={"bg-gray"}>
        <Container classes={`__label small_phone:py-8 py-5 mobile:px-10 px-5 flex flex-row w-full justify-between items-center`}>
          <div onClick={() => getDaos()} className="small_phone:text-4xl text-3xl big_phone:px-8 flex flex-row items-center gap-4">
            {showAll ? "All" : "Joined"}
            {/* <div className="flex flex-col items-start">
              <div className="mobile:w-32 w-12 border-t-2 border-black"></div>
              <div className="mobile:w-14 w-8 small_phone:mt-2 mt-1 border-t-2 border-black"></div>
            </div> */}
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
            <button className="bg-white small_phone:gap-2 gap-1 mr-12 small_phone:mr-12 mr-6 mobile:px-5 p-2 small_phone:text-base text-sm shadow-xl flex items-center rounded-full hover:bg-[#ececec] hover:scale-105 transition">
              <HiPlus />
              Create DAO
            </button>
          </Link>
        </Container>
      </div>
      {showLoginModal && <LoginModal isOpen={showLoginModal} onClose={handleModalClose} onLogin={handleLogin} onNFIDLogin={handleNFIDLogin} />}
      {showAll ? (
        loading ? (
          <div className="flex justify-center items-center h-full">
            <MuiSkeleton />
          </div>
        ) : noDaoFound ? (
          <div className="flex justify-center items-center h-full">
            <p className="text-lg font-bold">
              {/* No DAOsss found */}
              <img src={nodata1} alt="No Data" className=" mb-1 mx-auto block" />

            </p>
          </div>
        ) : (searchTerm && fetchedDAOs.length > 0 ? (
          <div className={"bg-gray"}>
            <Container classes={`__cards tablet:px-10 px-4 pb-10 grid grid-cols-1 big_phone:grid-cols-1 tablet:gap-6 gap-4`}>
              {fetchedDAOs.map((daos, index) => {
                const daoCanisterId = daos.dao_canister_id ? daos.dao_canister_id : 'No ID';
                return (
                  <DaoCard
                    key={index}
                    name={daos.dao_name || 'No Name'}
                    followers={daos.followers_count || '0'}
                    members={daos.members_count ? Number(BigInt(daos.members_count)) : '0'}
                    groups={daos.groups_count ? Number(BigInt(daos.groups_count)) : '0'}
                    proposals={daos.proposals_count || '0'}
                    image_id={daos.image_id || 'No Image'}
                    daoCanister={daos.daoCanister}
                    handleFollow={() => handleFollowUser(daos.daoCanister, userId)}
                    daoCanisterId={daoCanisterId}
                  />
                );
              })}
            </Container>
            <Pagignation currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              hasMore={hasMore}/>
          </div>
        ) : dao && dao.length > 0 ? (
          <div className={"bg-gray"}>
            <Container classes={`__cards tablet:px-10 px-4 pb-10 grid grid-cols-1 big_phone:grid-cols-2 tablet:gap-6 gap-4`}>
              {dao.map((daos, index) => {
                const daoCanisterId = daos.dao_canister_id ? daos.dao_canister_id : 'No ID';
                return (
                  <DaoCard
                    key={index}
                    name={daos.dao_name || 'No Name'}
                    followers={daos.followers_count || '0'}
                    members={daos.members_count ? Number(BigInt(daos.members_count)) : '0'}
                    groups={daos.groups_count ? Number(BigInt(daos.groups_count)) : 'No Groups'}
                    proposals={daos.proposals_count || '0'}
                    image_id={daos.image_id || 'No Image'}
                    daoCanister={daos.daoCanister}
                    handleFollow={() => handleFollowUser(daos.daoCanister, userId)}
                    daoCanisterId={daoCanisterId}
                  />
                );
              })}
            </Container>

            <Pagignation currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              hasMore={hasMore} />
          </div>
        ) : (
          <NoDataComponent />
        ))
      ) : joinedDAO && joinedDAO.length > 0 ? (
        <div className={"bg-gray"}>
          <Container classes={`__cards tablet:px-10 px-4 pb-10 grid grid-cols-1 big_phone:grid-cols-2 tablet:gap-6 gap-4`}>
            {joinedDAO.map((a, index) => {
              const daoCanisterId = a.dao_canister_id ? a.dao_canister_id : 'No ID';
              return (
                <DaoCard
                  key={index}
                  name={a.name}
                  funds={a.funds}
                  members={a.members}
                  groups={a.groups}
                  proposals={a.proposals}
                  daoCanister={a.daoCanister}
                  daoCanisterId={daoCanisterId}
                />
              );
            })}
          </Container>
        </div>
      ) : (
        <NoDataComponent />
      )}
    </div>
  );
};

export default Dao;



//   width,
//   bgColor,
//   placeholder,
//   className,
//   onChange,
//   ...inputProps
// }) => {
//   return (
//     <div
//       className={`${className} flex items-center p-2 bg-${bgColor} rounded-full max-w-md mx-auto`}
//       style={{ minWidth: width }}
//     >
      // <div className="mx-3">
      //   <svg
      //     width="26"
      //     height="26"
      //     viewBox="0 0 26 26"
      //     fill="none"
      //     xmlns="http://www.w3.org/2000/svg"
      //   >
      //     <path
      //       d="M25 25L19.2094 19.2094M19.2094 19.2094C20.1999 18.2189 20.9856 17.043 21.5217 15.7488C22.0577 14.4547 22.3336 13.0676 22.3336 11.6668C22.3336 10.266 22.0577 8.87896 21.5217 7.5848C20.9856 6.29065 20.1999 5.11475 19.2094 4.12424C18.2189 3.13373 17.043 2.34802 15.7488 1.81196C14.4547 1.27591 13.0676 1 11.6668 1C10.266 1 8.87896 1.27591 7.5848 1.81196C6.29065 2.34802 5.11474 3.13373 4.12424 4.12424C2.12382 6.12466 1 8.8378 1 11.6668C1 14.4958 2.12382 17.209 4.12424 19.2094C6.12466 21.2098 8.8378 22.3336 11.6668 22.3336C14.4958 22.3336 17.209 21.2098 19.2094 19.2094Z"
      //       stroke="#646464"
      //       strokeLinecap="round"
      //       strokeLinejoin="round"
      //     />
      //   </svg>
      // </div>

//       <input
//         onChange={onChange}
//         type="text"
//         placeholder={placeholder}
//         className="pl-4 pr-10 py-2 w-full bg-transparent focus:outline-none placeholder-zinc-400 text-zinc-700 placeholder-custom"
//         {...inputProps}
//       />
//     </div>
//   );
// };
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
