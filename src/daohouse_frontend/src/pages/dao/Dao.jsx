import React, { useEffect, useState } from "react";
import { HiPlus } from "react-icons/hi";
import { Link } from "react-router-dom";
import DaoCard from "../../Components/Dao/DaoCard";
import NoDataComponent from "../../Components/Dao/NoDataComponent";
import TopComponent from "../../Components/Dao/TopComponent";
import Container from "../../Components/Container/Container";
import { useAuth } from "../../Components/utils/useAuthClient";
import MuiSkeleton from "../../Components/Skeleton/MuiSkeleton";
const Dao = () => {
  const [showAll, setShowAll] = useState(true);
  const [joinedDAO, setJoinedDAO] = useState(false);
  const className = "DAO";
  const { backendActor, createDaoActor } = useAuth();
  const [dao, setDao] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [fetchedDAOs, setFetchedDAOs] = useState([]); 

  const fetchDaoDetails = async (daoList) => {
    let allDaoDetails = [];
    await Promise.all(daoList.map(async (data) => {
      const daoCanister = createDaoActor(data.dao_canister_id);
      const dao_details = await daoCanister.get_dao_detail();
      allDaoDetails.push({ ...dao_details, daoCanister, dao_canister_id: data.dao_canister_id });
    }));
    return allDaoDetails;
  };

  const getDaos = async () => {
    const pagination = {
      start: 0,
      end: 10,
    };
    try {
      setLoading(true);
      let response = await backendActor.get_all_dao(pagination);
      const combinedDaoDetails = await fetchDaoDetails(response);
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
    getDaos();
  }, [backendActor]);

  useEffect(() => {
    getsearchdao(); // Fetch DAOs based on search term
  }, [searchTerm]);
  
  const noDaoFound = searchTerm && fetchedDAOs.length === 0;

  return (
    <div className="bg-zinc-200">
      <TopComponent showAll={showAll} setShowAll={setShowAll} showButtons={true} />
      <div className={"bg-[#c8ced3]"}>
        <Container classes={`__label small_phone:py-8 py-5 mobile:px-10 px-5 flex flex-row w-full justify-between items-center ${className}`}>
          <div onClick={() => getDaos()} className="small_phone:text-4xl text-3xl big_phone:px-8 flex flex-row items-center gap-4">
            {showAll ? "All" : "Joined"}
            <div className="flex flex-col items-start">
              <div className="mobile:w-32 w-12 border-t-2 border-black"></div>
              <div className="mobile:w-14 w-8 small_phone:mt-2 mt-1 border-t-2 border-black"></div>
            </div>
          </div>
          <div className="flex-grow lg:flex justify-center px-6 mx-2 hidden">
            <SearchProposals
              width="100%"
              bgColor="transparent"
              placeholder="Search here"
              className="border-2 border-[#AAC8D6] w-full max-w-lg"
              onChange={(e) => setSearchTerm(e.target.value)} // Handle input changes
            />
          </div>
          <Link to="/dao/create-dao">
            <button className="bg-white small_phone:gap-2 gap-1 mobile:px-5 p-2 small_phone:text-base text-sm shadow-xl flex items-center rounded-full hover:bg-[#ececec] hover:scale-105 transition">
              <HiPlus />
              Create DAO
            </button>
          </Link>
          <style>
            {`
          .placeholder-custom::placeholder {
            color: black;
            font-weight: bold;
            borderText:black;
          }`}
          </style>
        </Container>
      </div>
      {showAll ? (
        loading ? (
          <div className="flex justify-center items-center h-full">
            <MuiSkeleton />
          </div>
        ) : noDaoFound ? (
          <div className="flex justify-center items-center h-full">
            <p className="text-lg font-bold">No DAO found</p>
          </div>
        ) : (searchTerm && fetchedDAOs.length > 0 ? (
          <div className={"bg-[#c8ced3]"}>
            <Container classes={`__cards tablet:px-10 px-4 pb-10 grid grid-cols-1 big_phone:grid-cols-2 tablet:gap-6 gap-4 ${className}`}>
            {
                fetchedDAOs.map((daos, index) => {
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
                })
              }
            </Container>
          </div>
        ) : dao && dao.length > 0 ? (
          <div className={"bg-[#c8ced3]"}>
            <Container classes={`__cards tablet:px-10 px-4 pb-10 grid grid-cols-1 big_phone:grid-cols-2 tablet:gap-6 gap-4 ${className}`}>
            {
                dao.map((daos, index) => {
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
                })
              }
            </Container>
          </div>
        ) : (
          <NoDataComponent />
        ))
      ) : joinedDAO && joinedDAO.length > 0 ? (
        <div className={"bg-[#c8ced3]"}>
          <Container classes={`__cards tablet:px-10 px-4 pb-10 grid grid-cols-1 big_phone:grid-cols-2 tablet:gap-6 gap-4 ${className}`}>
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




export const SearchProposals = ({
  width,
  bgColor,
  placeholder,
  className,
  onChange,
  ...inputProps
}) => {
  return (
    <div
      className={`${className} flex items-center p-2 bg-${bgColor} rounded-full max-w-md mx-auto`}
      style={{ minWidth: width }}
    >
      <div className="mx-3">
        <svg
          width="26"
          height="26"
          viewBox="0 0 26 26"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M25 25L19.2094 19.2094M19.2094 19.2094C20.1999 18.218"
            stroke="black"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </div>
    


      <input
        onChange={onChange} // Use onChange to handle input changes
        type="text"
        placeholder={placeholder}
        className="pl-4 pr-10 py-2 w-full bg-transparent focus:outline-none placeholder-zinc-400 text-zinc-700 placeholder-custom"
        {...inputProps}
      />
    </div>
  );
};