import React, { useState, useEffect } from "react";
import { RxArrowTopRight } from "react-icons/rx";
import MuiSkeleton from "../../Skeleton/MuiSkeleton";
import { useAuth } from "../../utils/useAuthClient";
import Avatar from "../../../../assets/Avatar.png";
import { Principal } from "@dfinity/principal";
import Container from "../../Container/Container";
import NoDataComponent from "../../Dao/NoDataComponent";
import DaoCard from "../../Dao/DaoCard";

const Followers = () => {
  const className = "Followers";
  const { backendActor, createDaoActor, stringPrincipal } = useAuth();
  const [followedDAO, setFollowedDAO] = useState([]);
  const [loading, setLoading] = useState(false);

  const getFollowedDaos = async () => {
    try {
      setLoading(true); // Set loading to true when fetching begins
      console.log("Fetching followed DAOs...");

      const profile = await backendActor.get_profile_by_id(
        Principal.fromText(stringPrincipal)
      );
      console.log("Profile:", profile);

      const followedDaoPrincipals = profile?.Ok?.follow_dao || [];
      console.log("Followed DAO Principals:", followedDaoPrincipals);

      const followedDaoDetails = await Promise.all(
        followedDaoPrincipals.map(async (daoPrincipal) => {
          try {
            const daoCanisterPrincipal = Principal.fromUint8Array(
              daoPrincipal._arr
            );

            console.log(
              "DAO Canister Principal:",
              daoCanisterPrincipal.toText()
            );

            const daoCanister = await createDaoActor(daoCanisterPrincipal);

            const daoDetails = await daoCanister.get_dao_detail();

            console.log(daoDetails);

            return {
              ...daoDetails,
              dao_canister_id: daoCanisterPrincipal.toText(),
            };
          } catch (error) {
            console.error(
              `Error fetching details for DAO: ${daoPrincipal._arr}`,
              error
            );
            return null;
          }
        })
      );

      const validDaoDetails = followedDaoDetails.filter(
        (dao) => dao !== null
      );

      setFollowedDAO(validDaoDetails);
    } catch (error) {
      console.error("Error fetching followed DAOs:", error);
    } finally {
      setLoading(false); // Set loading to false when fetching is done
    }
  };

  useEffect(() => {
    getFollowedDaos();
  }, [backendActor]);

  return (
    <div className={className + " " + "w-full"}>
      <div className="lg:ml-10 tablet:mt-12 mt-5 md:px-0 px-3">
        <h3 className="text-[#05212C] tablet:text-[24px] text-[18px] translate-x-[12px] translate-y-[-90px] tablet:font-bold font-semibold mb-4">
          DAOs Followed
        </h3>
        {loading ? (
          <MuiSkeleton />
        ) : followedDAO.length === 0 ? (
          <NoDataComponent />
        ) : (
          <div className="bg-gray">
            <Container classes="__cards tablet:px-10 px-4 pb-10 grid grid-cols-1 big_phone:grid-cols-2 tablet:gap-6 gap-4">
              {followedDAO.map((daos, index) => (
                <DaoCard
                  key={index}
                  {...{
                    name: daos.dao_name || "No Name",
                    followers: daos.followers_count || "0",
                    members: daos.members_count
                      ? Number(BigInt(daos.members_count))
                      : "0",
                    groups: daos.groups_count
                      ? Number(BigInt(daos.groups_count))
                      : "No Groups",
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

export default Followers;
