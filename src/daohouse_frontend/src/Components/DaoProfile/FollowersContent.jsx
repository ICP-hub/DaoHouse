import React, { useEffect, useState } from "react";
import SearchProposals from "../Proposals/SearchProposals";
import { IoFilterSharp } from "react-icons/io5";
import { LuSearch } from "react-icons/lu";
import { useAuth } from "../utils/useAuthClient";
import Avatar from "../../../assets/Avatar.png";
import nodata from "../../../assets/nodata.png";
import FollowersSkeleton from "../../Components/SkeletonLoaders/ProposalLoaderSkeleton/FollowersSkeleton";
import { Principal } from "@dfinity/principal";

const FollowersContent = ({ daoFollowers, daoCanisterId }) => {
  const { backendActor, createDaoActor } = useAuth();
  const [followerProfiles, setFollowerProfiles] = useState([]);
  const protocol = process.env.DFX_NETWORK === "ic" ? "https" : "http";
  const domain = process.env.DFX_NETWORK === "ic" ? "raw.icp0.io" : "localhost:4943";
  const noDataContainerStyle = { display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%" };

  const [fetchFollower, setFetchFollower] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);

  const searchChange = async (event) => {
    const value = event.target.value.trim();
    setSearchTerm(value);

    if (value === "") {
      setFetchFollower([]);
      setLoading(false);
      return;
    }
    setLoading(true);

    try {
      const daoActor = createDaoActor(daoCanisterId);

      const response = await daoActor.search_follower(value);

      if (Array.isArray(response) && response.length > 0) {
        const principalIds = response.map((user) => Principal.fromUint8Array(user._arr));

        const userProfiles = await Promise.all(
          principalIds.map(async (principalId) => {
            const userProfile = await backendActor.get_profile_by_id(principalId);
            return userProfile?.Ok || null;
          })
        );

        const validProfiles = userProfiles.filter((profile) => profile !== null);
        setFetchFollower(validProfiles);
      } else {
        setFetchFollower([]);
      }
    } catch (error) {
      console.log("error is : ", error);
      setFetchFollower([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    async function fetchFollowerProfiles() {
      setLoading(true);

      try {
        if (Array.isArray(daoFollowers) && daoFollowers.length > 0) {
          const principalArray = daoFollowers.flat();
          const profiles = await Promise.all(
            principalArray.map((principal) => backendActor.get_profile_by_id(principal))
          );
          setFollowerProfiles(profiles);
        } else {
          setFollowerProfiles([]);
        }
      } catch (error) {
        console.error("Error fetching follower profiles:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchFollowerProfiles();
  }, [daoFollowers, backendActor]);

  return (
    <div className="mt-6">
      <div className="flex items-center justify-between">
        <h1 className="lg:text-[24px] md:text-[18px] text-[16px] font-bold">Followers</h1>
      </div>
      <div className="bg-[#F4F2EC] md:pt-3 pt-2 md:pb-8 pb-4 mt-4 md:mb-8 mb-4 rounded-[10px]">
        <div className="flex justify-between items-center px-6 md:mb-3 mb-2">
          <span className="lg:text-[20px] text-[#05212C] font-semibold">
            {daoFollowers.length} Followers
          </span>
          <span className="flex">
            <div className="flex-grow md:flex justify-center px-6 mx-2 hidden md:h-12">
              <SearchProposals
                onChange={searchChange}
                width="100%"
                bgColor="transparent"
                placeholder="Search by principal id"
                className="border-2 border-[#AAC8D6] w-full max-w-lg"
              />
            </div>
            <button className="bg-white text-[16px] text-[#05212C] gap-1 md:px-7 shadow-xl py-3 px-3 flex items-center space-x-4 rounded-2xl">
              <IoFilterSharp />
              <span className="hidden md:block">Filter</span>
            </button>
          </span>
        </div>
        <div className="w-full border-t border-[#0000004D] md:my-4 mb-3"></div>
        <div className="flex-grow flex justify-center m-2 md:hidden relative">
          <input
            type="search"
            name="groups"
            className="big_phone:w-[400px] w-full rounded-[2rem] py-2 pl-10 bg-[#F4F2EC] border border-[#AAC8D6]"
            placeholder="Search by principal id"
            onChange={searchChange}
          />
          <LuSearch className="ml-4 absolute left-0 bottom-3 text-slate-400" />
        </div>
        <div className="px-3">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {loading ? (
              <FollowersSkeleton count={daoFollowers.length || 3} />
            ) : searchTerm.trim() === "" ? (
              followerProfiles.map((follower, index) => {
                const profile = follower?.Ok;
                return (
                  <div key={index} className="flex flex-row items-center  border border-[#97C3D3] rounded-lg big_phone:p-4 p-2 overflow-x-hidden">
                    <section className="flex flex-row items-center gap-6">
                      <img
                        src={profile?.profile_img ? `${protocol}://${process.env.CANISTER_ID_IC_ASSET_HANDLER}.${domain}/f/${profile.profile_img}` : Avatar}
                        alt="User"
                        className="big_phone:w-12 w-9 big_phone:h-12 h-9 rounded-full object-cover shadow-lg"
                      />
                      <div className="flex flex-col items-start">
                        <p className="text-start font-semibold big_phone:text-1xl text-sm truncate w-40 lg:w-60">
                          {profile?.username || "Unknown User"}
                        </p>
                        <p className="text-center text-xs">{profile?.email_id || ""}</p>
                      </div>
                    </section>  
                  </div>
                );
              })
            ) : fetchFollower.length > 0 ? (
              fetchFollower.map((profile, index) => {
                return (
                  <div key={index} className="flex w-full flex-row items-center justify-between border border-[#97C3D3] rounded-lg big_phone:p-4 p-2">
                    <section className="flex flex-row items-center gap-2">
                      <img
                        src={profile?.profile_img ? `${protocol}://${process.env.CANISTER_ID_IC_ASSET_HANDLER}.${domain}/f/${profile.profile_img}` : Avatar}
                        alt="User"
                        className="big_phone:w-12 w-9 big_phone:h-12 h-9 rounded-full object-cover"
                      />
                      <div className="flex flex-col  items-start">
                        <p className="text-start font-semibold big_phone:text-1xl text-sm truncate w-40 lg:w-60">
                          {profile?.username || "Unknown User"}
                        </p>
                        <p className="text-center text-xs">{profile?.email_id || ""}</p>
                      </div>
                    </section>
                    <section>
                      {/* <MdAddBox className="mx-1  text-[#97C3D3] big_phone:text-2xl text-lg" /> */}
                    </section>
                  </div>
                );
              })
            ) : (
              <div style={noDataContainerStyle} className="col-span-5">
                <img src={nodata} alt="nodata" />
                <p className="text-xl mt-5">No Follower</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FollowersContent;
