import React, { useState, useEffect } from "react";
import { useAuth } from "../../utils/useAuthClient";
import MyProfileSkelton from "../../SkeletonLoaders/MyProfileSkelton";
import NoDataComponent from "../../Dao/NoDataComponent";
import { Principal } from "@dfinity/principal";
import Container from "../../Container/Container";
import SearchProposals from "../../../Components/Proposals/SearchProposals"; // Import search component
import "./Following.scss"; // Custom scrollbar styling

const Following = () => {
  const className = "Following";
  const { backendActor, createDaoActor, stringPrincipal } = useAuth();
  const [joinedDAO, setJoinedDAO] = useState([]);
  const [fetchedDAOs, setFetchedDAOs] = useState([]); // State for search results
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState(""); // State for search term
  const canisterId = process.env.CANISTER_ID_IC_ASSET_HANDLER;
  const protocol = process.env.DFX_NETWORK === "ic" ? "https" : "http";
  const domain = process.env.DFX_NETWORK === "ic" ? "raw.icp0.io" : "localhost:4943";

  const getJoinedDaos = async () => {
    setLoading(true);
    try {
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

  // Search DAO function
  const getSearchDao = async () => {
    if (!searchTerm.trim()) return setFetchedDAOs([]); // Clear the search results if input is empty

    try {
      const response = await backendActor.search_dao(searchTerm); // Fetch the searched DAOs
      const combinedSearchDaoDetails = await fetchDaoDetails(response);
      setFetchedDAOs(combinedSearchDaoDetails); // Update state with search results
    } catch (error) {
      console.error("Error searching DAOs:", error);
    }
  };

  useEffect(() => {
    getJoinedDaos();
  }, [backendActor]);

  // Fetch search results when searchTerm changes
  useEffect(() => {
    if (searchTerm) getSearchDao();
  }, [searchTerm]);

  const displayDAOs = searchTerm ? fetchedDAOs : joinedDAO; // Show search results if searchTerm is present, otherwise show joined DAOs

  return (
    <div className={`${className} w-full`}>
      <div className="lg:ml-10 tablet:mt-12 mt-5 md:px-0 px-3">
        <div className="flex justify-between items-center translate-y-[-90px]">
          <h3 className="text-[#05212C] tablet:text-[24px] text-[18px] tablet:font-bold font-mulish mb-4">
            {searchTerm ? "Search Results" : "DAOs Joined"}
          </h3>
          <div className="flex-grow lg:flex justify-end hidden">
            <SearchProposals
              width="90%"
              bgColor="transparent"
              placeholder="Search here"
              className="border-2 border-[#AAC8D6] w-full max-w-lg"
              onChange={(e) => setSearchTerm(e.target.value)} // Update search term on input
            />
          </div>
        </div>

        {loading ? (
          <MyProfileSkelton />
        ) : displayDAOs.length === 0 ? (
          <NoDataComponent text={searchTerm ? "No DAOs found!" : "No DAOs joined yet!"} />
        ) : (
          <div className="bg-[#F4F2EC] flex justify-center shadow-lg">
            <Container classes="__cards w-[1000px] p-[20px] translate-x-[-18px] rounded-lg overflow-hidden">
              <div className="grid grid-cols-1 tablet:grid-cols-2 gap-4 max-h-[350px] overflow-y-auto px-4 custom-scrollbar">
                {displayDAOs.map((dao, index) => (
                  <div
                    key={index}
                    className="bg-white shadow-lg rounded-lg flex items-center p-4 space-x-4 transition-transform "
                  >
                    <img
                      src={getImageUrl(dao?.image_id)}
                      alt={dao?.dao_name}
                      className="w-16 h-16 rounded-full border-2 border-black"
                    />
                    <div className="flex-1">
                      <h4 className="text-lg font-mulish">{dao?.dao_name || "No Name"}</h4>
                      <p className="text-gray-500">{dao?.purpose || "No Purpose"}</p>
                    </div>
                    <button
                      onClick={() => handleViewProfile(dao?.dao_canister_id)}
                      className="border-2 border-[#0E3746] text-[#0E3746] rounded-full px-4 py-2 hover:bg-[#0E3746] hover:text-white transition duration-300"
                    >
                      View Profile
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

export default Following;
