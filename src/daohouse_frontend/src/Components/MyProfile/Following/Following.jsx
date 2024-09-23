import React, { useState, useEffect } from "react";
import { RxArrowTopRight } from "react-icons/rx";
import MuiSkeleton from "../../SkeletonLoaders/MuiSkeleton";
import { useAuth } from "../../utils/useAuthClient";
import Avatar from "../../../../assets/Avatar.png"
import { Principal } from "@dfinity/principal";
import Container from "../../Container/Container";
import NoDataComponent from "../../Dao/NoDataComponent";
import DaoCard from "../../Dao/DaoCard";

const Following = () => {
  const className = "Following";
  const { backendActor, createDaoActor, stringPrincipal } = useAuth();
  const [joinedDAO, setJoinedDAO] = useState([])
  const [loading, setLoading] = useState(false);

  const getJoinedDaos = async () => {
    try {
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

            console.log(daoDetails);
            
            
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
    }
  };

  useEffect(() => {
    getJoinedDaos();

  }, [backendActor]);

  return (
    <div className={className + " " + "w-full"}>
      <div className="lg:ml-10 tablet:mt-12 mt-5 md:px-0 px-3">
        <h3 className="text-[#05212C] tablet:text-[24px] text-[18px] translate-x-[12px] translate-y-[-90px] tablet:font-bold font-semibold mb-4">
          Dao Joined
        </h3>
        {loading ? (
          <MuiSkeleton />
        ) :
        joinedDAO.length === 0 ? (
          <p className=" text-black mt-10 "></p>
        ) :
          (
          
          <div className="bg-gray">
            <Container classes="__cards tablet:px-10 px-4 pb-10 grid grid-cols-1 big_phone:grid-cols-2 tablet:gap-6 gap-4">
              {joinedDAO.map((daos, index) => (
                <DaoCard
                  key={index}
                  {...{
                    name: daos.dao_name || "No Name",
                    followers: daos.followers_count || "0",
                    members: daos.members_count ? Number(BigInt(daos.members_count)) : "0",
                    groups: daos.groups_count ? Number(BigInt(daos.groups_count)) : "No Groups",
                    proposals: daos.proposals_count || "0",
                    image_id: daos.image_id || "No Image",
                    daoCanister: daos.daoCanister,
                    daoCanisterId: daos.dao_canister_id || "No ID",
                  }}
                />
              ))}
            </Container>
          </div>
          )}
      </div>
    </div>

  );
};

export default Following;