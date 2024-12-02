import React, { useState, useEffect } from "react";
import "./Members.scss";
import { useAuth } from "../utils/useAuthClient";
import { Principal } from "@dfinity/principal";
import { IoIosArrowUp, IoIosArrowDown } from "react-icons/io";
import userImage from "../../../assets/Avatar.png";
import MemberSkeleton from "../SkeletonLoaders/MemberSkeleton";

const Members = ({ daoGroups, daoCouncil }) => {
  const { backendActor } = useAuth();
  const [councilMembers, setCouncilMembers] = useState([]);
  const [groupMembers, setGroupMembers] = useState({});
  const [openedGroupIndex, setOpenedGroupIndex] = useState(null);
  const [isCouncilOpen, setIsCouncilOpen] = useState(false);
  const [loadingCouncil, setLoadingCouncil] = useState(true);
  const [loadingGroups, setLoadingGroups] = useState(true);

  useEffect(() => {
    async function fetchCouncilProfiles() {
      if (daoCouncil) {
        setLoadingCouncil(true);
        const profiles = await Promise.all(
          daoCouncil.map((member) =>
            backendActor.get_profile_by_id(
              Principal.fromUint8Array(member._arr)
            )
          )
        );
        setCouncilMembers(profiles);
        setLoadingCouncil(false);
      }
    }

    fetchCouncilProfiles();
  }, [daoCouncil, backendActor]);

  useEffect(() => {
    async function fetchAllGroupMembers() {
      setLoadingGroups(true);
      const groupProfiles = {};
      for (const group of daoGroups) {
        const profiles = await Promise.all(
          group.group_members.map((member) =>
            backendActor.get_profile_by_id(
              Principal.fromUint8Array(member._arr)
            )
          )
        );
        groupProfiles[group.group_name] = profiles;
      }
      setGroupMembers(groupProfiles);
      setLoadingGroups(false);
    }

    if (daoGroups) {
      fetchAllGroupMembers();
    }
  }, [daoGroups, backendActor]);

  function toggleOpenGroup(index) {
    if (openedGroupIndex === index) {
      setOpenedGroupIndex(null);
    } else {
      setOpenedGroupIndex(index);
    }
  }

  function toggleCouncil() {
    setIsCouncilOpen((prevState) => !prevState);
  }

  return (
    <div className="Member_and_policy mt-6">
      <div className="flex items-center justify-between">
        <h1 className="mobile:text-2xl text-lg font-bold py-1">Members</h1>
      </div>

      <div className="bg-[#F4F2EC] rounded-[10px] mt-4">
        <div className="mobile:p-4 p-2 bg-[#F4F2EC] rounded-lg flex flex-col gap-4">
          {/* Council Members Section */}
          <div className="bg-white">
            <header
              onClick={toggleCouncil}
              className="cursor-pointer flex flex-row items-center justify-between bg-[#AAC8D6] p-3 rounded-lg"
            >
              <p className="font-semibold big_phone:text-lg text-sm truncate flex-1 text-left">
                Council
              </p>
              <p className="font-semibold big_phone:text-base text-sm text-center flex-1">
                {loadingCouncil
                  ? "Loading..."
                  : `${councilMembers.length} ${
                      councilMembers.length === 1 ? "Member" : "Members"
                    }`}
              </p>
              <div className="flex flex-1 justify-end">
                {isCouncilOpen ? (
                  <IoIosArrowDown className="text-lg" />
                ) : (
                  <IoIosArrowUp className="text-lg" />
                )}
              </div>
            </header>

            {isCouncilOpen && (
              <div className="bg-white rounded-lg p-8">
                {loadingCouncil ? (
                  <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-4">
                    {Array(1)
                      .fill(0)
                      .map((_, idx) => (
                        <MemberSkeleton key={idx} />
                      ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 mobile:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {councilMembers.map((member, index) => (
                      <ListView member={member} key={index} />
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Groups Section */}
          {daoGroups?.map((group, index) => (
            <div key={index} className="flex flex-col bg-white rounded-lg">
              <header
                onClick={() => toggleOpenGroup(index)}
                className="cursor-pointer flex flex-row items-center justify-between bg-[#AAC8D6] p-3 rounded-lg"
              >
                <p className="font-semibold big_phone:text-lg text-sm truncate flex-1 text-left">
                  {group.group_name}
                </p>
                <p className="font-semibold big_phone:text-base text-sm text-center flex-1">
                  {loadingGroups
                    ? "Loading..."
                    : `${group.group_members.length} ${
                        group.group_members.length === 1 ? "Member" : "Members"
                      }`}
                </p>
                <div className="flex flex-1 justify-end">
                  {openedGroupIndex === index ? (
                    <IoIosArrowDown className="text-lg" />
                  ) : (
                    <IoIosArrowUp className="text-lg" />
                  )}
                </div>
              </header>
              {openedGroupIndex === index && (
                <div className="bg-white rounded-lg p-8">
                  {loadingGroups ? (
                    <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-4">
                      {Array(1)
                        .fill(0)
                        .map((_, idx) => (
                          <MemberSkeleton key={idx} />
                        ))}
                    </div>
                  ) : groupMembers[group.group_name]?.length > 0 ? (
                    <div className="grid grid-cols-1 mobile:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {groupMembers[group.group_name].map(
                        (member, memberIndex) => (
                          <ListView member={member} key={memberIndex} />
                        )
                      )}
                    </div>
                  ) : (
                    <p className="text-center text-gray-500">No members yet</p>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Members;

const ListView = ({ member }) => {
  const protocol = process.env.DFX_NETWORK === "ic" ? "https" : "http";
  const domain =
    process.env.DFX_NETWORK === "ic" ? "raw.icp0.io" : "localhost:4943";
  const profileImgSrc = member?.Ok?.profile_img
    ? `${protocol}://${process.env.CANISTER_ID_IC_ASSET_HANDLER}.${domain}/f/${member?.Ok?.profile_img}`
    : userImage;

  return (
    <div className="flex flex-col big_phone:p-2 px-1 py-2 gap-y-2 border border-[#97C3D3] rounded-lg overflow-x-hidden">
      <section className="top flex flex-row items-start gap-3">
        <img
          src={profileImgSrc}
          alt="Profile"
          className="w-12 h-12 rounded-full object-cover shadow-lg"
        />
        <section className="details flex flex-col  items-center mt-2 ml-2">
          <p className="font-semibold text-base">{member?.Ok?.username}</p>
          
        </section>
      </section>
    </div>
  );
};
