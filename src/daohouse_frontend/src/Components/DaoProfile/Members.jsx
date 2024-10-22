import React, { useState, useEffect } from "react";
import "./Members.scss";
import { useMediaQuery } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../utils/useAuthClient";
import { Principal } from "@dfinity/principal";
import { MdAddBox } from "react-icons/md";
import { IoIosArrowUp, IoIosArrowDown } from "react-icons/io";
import userImage from "../../../assets/commentUser.jpg";
import MemberSkeleton from "../SkeletonLoaders/MemberSkeleton";

const Members = ({ daoGroups, daoMembers }) => {
  const { backendActor } = useAuth();
  const [gridView, setGridView] = useState(true);
  const [councilMembers, setCouncilMembers] = useState([]);
  const [groupMembers, setGroupMembers] = useState({});
  const [openedGroupIndex, setOpenedGroupIndex] = useState(null);
  const [isCouncilOpen, setIsCouncilOpen] = useState(false); // State for council toggle
  const [loading, setLoading] = useState(true); // Loading state
  const navigate = useNavigate();
  const minWidth = useMediaQuery("(min-width: 800px)");
  const gridTemplateColumns = `repeat(auto-fill, minmax(${minWidth ? 370 : 165}px, 1fr))`;
  const listTemplateColumns = `repeat(auto-fill, minmax(${minWidth ? 300 : 220}px, 1fr))`;
  const gridContainerStyle = { display: "grid", gridTemplateColumns: gridTemplateColumns };
  const listContainerStyle = { display: "grid", gridTemplateColumns: listTemplateColumns };

  // Fetch council members when the component mounts
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
        setLoading(false); // Stop loading after fetching
      }
    }

    fetchCouncilProfiles();
  }, [daoMembers, backendActor]);

  // Fetch group members when the component mounts
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
                {loading ? ( // Show skeleton loader while loading
                  <MemberSkeleton gridView={gridView} />
                ) : (
                  <div style={gridView ? gridContainerStyle : listContainerStyle}>
                    {councilMembers.map((member, index) => (
                      <React.Fragment key={index}>
                        {gridView ? <GridView member={member} /> : <ListView member={member} />}
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
                    <MemberSkeleton gridView={gridView} /> // Show skeleton loader for group members
                  ) : (
                    <div style={gridView ? gridContainerStyle : listContainerStyle}>
                      {groupMembers[group.group_name]?.map((member, memberIndex) => (
                        <React.Fragment key={memberIndex}>
                          {gridView ? <GridView member={member} /> : <ListView member={member} />}
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

// GridView Component for both council and group members
const GridView = ({ member }) => {
  const protocol = process.env.DFX_NETWORK === "ic" ? "https" : "http";
  const domain = process.env.DFX_NETWORK === "ic" ? "raw.icp0.io" : "localhost:4943";
  const profileImgSrc = member.Ok.profile_img
    ? `${protocol}://${process.env.CANISTER_ID_IC_ASSET_HANDLER}.${domain}/f/${member.Ok.profile_img}`
    : userImage;

  return (
    <div className="big_phone:flex flex-col px-4 py-2 border border-[#97C3D3] rounded-lg">
      <div className="top flex flex-row items-start justify-between">
        <section className="relative w-12 h-12 sm:w-16 sm:h-16">
          <img
            src={profileImgSrc}
            alt="Image"
            className="rounded-full w-full h-full object-cover" // Ensure circular shape
          />
        </section>
        <section className="details flex flex-col items-start ml-2"> {/* Added margin-left */}
          <p className="font-semibold text-lg">{member.Ok.username}</p>
          <p className="text-sm">{member.Ok.email_id}</p>
        </section>
        <MdAddBox className="mx-2 text-[#97C3D3] text-2xl" />
      </div>
    </div>
  );
};

// ListView Component for both council and group members
const ListView = ({ member }) => {
  const protocol = process.env.DFX_NETWORK === "ic" ? "https" : "http";
  const domain = process.env.DFX_NETWORK === "ic" ? "raw.icp0.io" : "localhost:4943";
  const profileImgSrc = member.Ok.profile_img
    ? `${protocol}://${process.env.CANISTER_ID_IC_ASSET_HANDLER}.${domain}/f/${member.Ok.profile_img}`
    : userImage;

  return (
    <div className="flex flex-col big_phone:p-2 px-1 py-2 gap-y-2 border border-[#97C3D3] rounded-lg">
      <section className="top flex flex-row items-start justify-between">
        <img
          src={profileImgSrc}
          alt="Image"
          className="w-12 h-12 rounded-full object-cover" // Ensure circular shape
        />
        <section className="details flex flex-col items-start ml-2"> {/* Added margin-left */}
          <p className="font-semibold text-base">{member.Ok.username}</p>
          <p className="text-sm">{member.Ok.email_id}</p>
        </section>
        <MdAddBox className="mx-1 text-[#97C3D3] text-2xl" />
      </section>
    </div>
  );
};