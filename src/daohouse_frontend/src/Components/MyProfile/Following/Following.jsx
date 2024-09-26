import React, { useState, useEffect } from "react";
import { useAuth } from "../../utils/useAuthClient";
import MuiSkeleton from "../../SkeletonLoaders/MuiSkeleton";
import NoDataComponent from "../../Dao/NoDataComponent";
import { Principal } from "@dfinity/principal";
import Container from "../../Container/Container";

const Following = () => {
  const className = "Following";
  const { backendActor, createDaoActor, stringPrincipal } = useAuth();
  const [joinedDAO, setJoinedDAO] = useState([]);
  const [loading, setLoading] = useState(false);
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

  const getImageUrl = (imageId) => {
    return `${protocol}://${canisterId}.${domain}/f/${imageId}`;
  };

  useEffect(() => {
    getJoinedDaos();
  }, [backendActor]);

  const handleViewProfile = (daoCanisterId) => {
    window.location.href = `dao/profile/${daoCanisterId}`;
  };

  return (
    <div className={`${className} w-full`}>
      <div className="lg:ml-10 tablet:mt-12 mt-5 md:px-0 px-3">
        <h3 className="text-[#05212C] tablet:text-[24px] text-[18px] translate-x-[12px] translate-y-[-90px] tablet:font-bold font-mulish mb-4">
          DAOs Joined
        </h3>
        {loading ? (
          <MuiSkeleton />
        ) : joinedDAO.length === 0 ? (
          <NoDataComponent text="No DAOs joined yet!" />
        ) : (
          <div className="bg-gray ">
            <Container classes="__cards w-[1000px] p-[20px] px-[24px] pb-[20px] translate-y-[-90px] translate-x-[-18px]  rounded-tl-[12px] rounded-tr-none rounded-br-none rounded-bl-none max-h-[350px] overflow-y-auto">
              <div className="flex-col space-y-4">
                {joinedDAO.map((dao, index) => (
                  <div
                    key={index}
                    className="bg-white shadow-md rounded-md flex items-center p-4 space-x-4"
                  >
                    <img
                      src={getImageUrl(dao?.image_id)}
                      alt={dao.dao_name}
                      className="w-16 h-16 rounded-full"
                    />
                    <div className="flex-1">
                      <h4 className="text-lg font-semibold">{dao?.dao_name || "No Name"}</h4>
                      <p className="text-gray-500">{dao?.purpose || "No ID"}</p>
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
