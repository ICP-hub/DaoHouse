import React, { useState, useEffect } from "react";
import "./Members.scss";
import { useMediaQuery } from "@mui/material";
<<<<<<< HEAD
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../connect/useClient";
=======
import { useAuth } from "../utils/useAuthClient";
>>>>>>> main
import { Principal } from "@dfinity/principal";
import { IoIosArrowUp, IoIosArrowDown } from "react-icons/io";
import userImage from "../../../assets/Avatar.png";
import MemberSkeleton from "../SkeletonLoaders/MemberSkeleton";

const Members = ({ daoGroups, daoMembers }) => {
  const { backendActor } = useAuth();
  const [councilMembers, setCouncilMembers] = useState([]);
  const [groupMembers, setGroupMembers] = useState({});
  const [openedGroupIndex, setOpenedGroupIndex] = useState(null);
  const [isCouncilOpen, setIsCouncilOpen] = useState(false); 
  const [loading, setLoading] = useState(true); 

  useEffect(() => {
    async function fetchCouncilProfiles() {
      if (daoMembers) {
        setLoading(true);
        const profiles = await Promise.all(
          daoMembers.map((member) =>
            backendActor.get_profile_by_id(Principal.fromUint8Array(member._arr))
          )
        );
        setCouncilMembers(profiles);
        setLoading(false); 
      }
    }

    fetchCouncilProfiles();
  }, [daoMembers, backendActor]);


  useEffect(() => {
    async function fetchAllGroupMembers() {
      const groupProfiles = {};
      for (const group of daoGroups) {
        const profiles = await Promise.all(
          group.group_members.map((member) =>
            backendActor.get_profile_by_id(Principal.fromUint8Array(member._arr))
          )
        );
        groupProfiles[group.group_name] = profiles;
      }
      setGroupMembers(groupProfiles);
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
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="mobile:text-2xl text-lg font-bold py-1">Members</h1>
      </div>

      {/* Members Section */}
      <div className="bg-[#F4F2EC] rounded-[10px] mt-4">
        {/* Council Members */}
        <div className="mobile:p-4 p-2 bg-[#F4F2EC] rounded-lg flex flex-col gap-4">
          <div className="bg-white">
            <header
              onClick={toggleCouncil}
              className="cursor-pointer flex flex-row items-center justify-between bg-[#AAC8D6] p-3 rounded-lg"
            >
              <p className="font-semibold big_phone:text-lg text-sm">Council</p>
              <p className="font-semibold big_phone:text-base text-sm">
                {councilMembers.length ? councilMembers.length : "Loading..."}{" "}
                {councilMembers.length
                  ? councilMembers.length === 1
                    ? "Member"
                    : "Members"
                  : ""}
              </p>
              {isCouncilOpen ? <IoIosArrowDown /> : <IoIosArrowUp />}
            </header>

            {isCouncilOpen && (
              <div className="bg-white rounded-lg p-8">
                {loading ? ( 
                  <MemberSkeleton/>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {councilMembers.map((member, index) => (
                      <React.Fragment key={index}>
                          <ListView member={member} />
                      </React.Fragment>
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
                <p className="font-semibold big_phone:text-lg text-sm">
                  {group.group_name}
                </p>
                <p className="font-semibold big_phone:text-base text-sm">
                  {group.group_members.length}{" "}
                  {group.group_members.length === 1 ? "Member" : "Members"}
                </p>
                {openedGroupIndex === index ? (
                  <IoIosArrowDown className="font-bold big_phone:text-base text-sm" />
                ) : (
                  <IoIosArrowUp className="font-bold big_phone:text-base text-sm" />
                )}
              </header>

              {openedGroupIndex === index && (
                <div className="bg-white rounded-lg p-8">
                  {loading ? (
                    <MemberSkeleton /> 
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {groupMembers[group.group_name]?.map((member, memberIndex) => (
                        <React.Fragment key={memberIndex}>
                     <ListView member={member} />
                        </React.Fragment>
                      ))}
                    </div>
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
  const domain = process.env.DFX_NETWORK === "ic" ? "raw.icp0.io" : "localhost:4943";
  const profileImgSrc = member?.Ok?.profile_img
    ? `${protocol}://${process.env.CANISTER_ID_IC_ASSET_HANDLER}.${domain}/f/${member?.Ok?.profile_img}`
    : userImage;

  return (
    <div className="flex flex-col big_phone:p-2 px-1 py-2 gap-y-2 border border-[#97C3D3] rounded-lg overflow-x-hidden">
      <section className="top flex flex-row items-start gap-3">
        <img
          src={profileImgSrc}
          alt="Image"
          className="w-12 h-12 rounded-full object-cover shadow-lg" 
        />
        <section className="details flex flex-col items-start ml-2">
          <p className="font-semibold text-base">{member?.Ok?.username}</p>
          <p className="text-sm">{member?.Ok?.email_id}</p>
        </section>
     
      </section>
    </div>
  );
};