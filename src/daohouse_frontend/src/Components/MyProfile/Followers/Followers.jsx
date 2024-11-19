import React, { useState, useEffect } from "react";
import MyProfileSkelton from "../../SkeletonLoaders/MyProfileSkelton";

import { Principal } from "@dfinity/principal";
import Container from "../../Container/Container";
import NoDataComponent from "../../Dao/NoDataComponent";
import SearchProposals from "../../../Components/Proposals/SearchProposals";
import { useAuth } from "../../../connect/useClient";

const Followers = () => {
  const className = "Followers";
  const { backendActor, createDaoActor, stringPrincipal, principal} = useAuth();
  console.log("stringPrincipal",principal);
  
  const [joinedDAO, setJoinedDAO] = useState([]);
  const [fetchedDAOs, setFetchedDAOs] = useState([]); 
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchLoading, setSearchLoading] = useState(false); 
  const canisterId = process.env.CANISTER_ID_IC_ASSET_HANDLER;
  const protocol = process.env.DFX_NETWORK === "ic" ? "https" : "http";
  const domain = process.env.DFX_NETWORK === "ic" ? "raw.icp0.io" : "localhost:4943";

  const getJoinedDaos = async () => {
    setLoading(true);
    try {
      const profile = await backendActor.get_profile_by_id(Principal.fromText(stringPrincipal));
      const joinedDaoPrincipals = profile?.Ok?.follow_dao || [];
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
      const validDaoDetails = joinedDaoDetails.filter((dao) => dao !== null);
      setJoinedDAO(validDaoDetails);
    } catch (error) {
      console.error("Error fetching joined DAOs:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchDaoDetails = async (daoList) => {
    const allDaoDetails = await Promise.all(
      daoList.map(async (data) => {
        try {
          const daoCanister = await createDaoActor(data.dao_canister_id);
          const dao_details = await daoCanister.get_dao_detail();
          return { ...dao_details, dao_canister_id: data.dao_canister_id };
        } catch (err) {
          console.error(`Error fetching details for DAO ${data.dao_canister_id}:`, err);
          return null;
        }
      })
    );
    return allDaoDetails.filter(Boolean);
  };

  const getImageUrl = (imageId) => {
    return `${protocol}://${canisterId}.${domain}/f/${imageId}`;
  };

  const handleViewProfile = (daoCanisterId) => {
    window.location.href = `dao/profile/${daoCanisterId}`;
  };

  const getSearchDao = async () => {
    if (!searchTerm.trim()) return setFetchedDAOs([]); 

    setSearchLoading(true);
    try {
      const response = await backendActor.search_dao(searchTerm); 
      const combinedSearchDaoDetails = await fetchDaoDetails(response);
      setFetchedDAOs(combinedSearchDaoDetails); 
    } catch (error) {
      console.error("Error searching DAOs:", error);
    } finally {
      setSearchLoading(false); 
    }
  };

  useEffect(() => {
    getJoinedDaos();
  }, [backendActor]);

  useEffect(() => {
    if (searchTerm) getSearchDao();
  }, [searchTerm]);

  const displayDAOs = searchTerm
  ? joinedDAO.filter((dao) =>
      dao.dao_name.toLowerCase().includes(searchTerm.toLowerCase())
    )
  : joinedDAO;


  return (
    <div className={`${className} w-full`}>
      <div className=" tablet:mt-12 mt-5 md:px-0">
        <div className="flex flex-col md:flex-row justify-between space-y-4 md:space-y-0">
          <h3 className="text-[#05212C] tablet:text-[24px] text-[18px] text-start tablet:font-bold  font-mulish">
            {searchTerm ? "Search Results" : "Followed DAO List"}
          </h3>
          <div className="w-full md:w-auto flex-grow lg:flex justify-end hidden">
            <SearchProposals
              width="80%"
              bgColor="transparent"
              placeholder="Search here"
              className="border-2 border-[#AAC8D6] w-full max-w-lg"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {searchTerm && searchLoading ? (
          <div className="md:mt-8">
          <MyProfileSkelton />
        </div>
        ) : loading ? (
          <div className="md:mt-8 mt-4">
            <MyProfileSkelton />
          </div>
        ) : displayDAOs.length === 0 ? (
          <div className="mt-4 md:mt-8">
            <NoDataComponent text={searchTerm ? "No DAOs found!" : "No DAOs joined yet!"} />
          </div>
        ) : (
          <div
            className={`bg-[#F4F2EC] w-full p-2 rounded-lg md:mt-4 mt-2 mb-6 ${
              displayDAOs.length === 1 ? "min-h-[200px]" : "min-h-[328px]"
            }`}
          >
            <Container classes="__cards p-[20px] rounded-lg overflow-hidden">
              <div className="grid grid-cols-1 tablet:grid-cols-2 gap-4 max-h-[350px] overflow-y-auto px-2 custom-scrollbar">
                {displayDAOs.map((dao, index) => (
                  <div
                    key={index}
                    className="bg-white shadow-lg rounded-lg flex items-center p-4 space-x-4 transition-transform"
                  >
                    <img
                      src={getImageUrl(dao?.image_id)}
                      alt={dao.dao_name}
                      className="w-16 h-16 rounded-full border-2 border-black object-cover shadow-lg"
                    />
                    <div className="flex-1 overflow-hidden">
                      <h4 className="text-lg font-mulish truncate">
                        {dao?.dao_name || "No Name"}
                      </h4>
                      <p className="text-gray-500 truncate max-w-[200px] whitespace-nowrap">
                        {dao?.purpose || "No Purpose"}
                      </p>
                    </div>
                    <button
                      onClick={() => handleViewProfile(dao?.dao_canister_id)}
                      className="border-2 border-[#0E3746] text-[#0E3746] rounded-full px-2 py-1 md:px-4 md:py-2 text-sm md:text-base hover:bg-[#0E3746] hover:text-white transition duration-300 whitespace-nowrap"
                    >
                      View
                    </button>
                  </div>
                ))}
              </div>
            </Container>
          </div>
        )}
      </div>
    </div>
  );
};

export default Followers;
