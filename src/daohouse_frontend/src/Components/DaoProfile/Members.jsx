import React, { useState, useEffect } from "react";
import "./Members.scss";
import { useMediaQuery } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../utils/useAuthClient";
import { Principal } from "@dfinity/principal";
import { MdAddBox } from "react-icons/md";
import { IoIosArrowUp, IoIosArrowDown } from "react-icons/io";
import { LuSearch } from "react-icons/lu";
import { IoFilterSharp } from "react-icons/io5";
import userImage from "../../../assets/commentUser.jpg";

const Members = ({ daoGroups, daoMembers }) => {
  const { backendActor } = useAuth();
  const [gridView, setGridView] = useState(true);
  const [councilMembers, setCouncilMembers] = useState([]);
  const [groupMembers, setGroupMembers] = useState({});
  const [openedGroupIndex, setOpenedGroupIndex] = useState(null);
  const [isCouncilOpen, setIsCouncilOpen] = useState(false); // State for council toggle
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
        const profiles = await Promise.all(
          daoMembers.map((member) =>
            backendActor.get_profile_by_id(Principal.fromUint8Array(member._arr))
          )
        );
        setCouncilMembers(profiles);
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
        <button
          onClick={() => navigate("/create-proposal")}
          className="big_phone:flex hidden justify-center items-center text-[16px] relative w-[220px] h-[50px] bg-white rounded-full hover:shadow-lg hover:bg-[#ECECEC] transition"
        >
          <span className="absolute text-[35px] font-thin left-5 bottom-[1px] ">+</span>
          <span className="ml-6">Create Proposals</span>
        </button>
      </div>

      {/* Members Section */}
      <div className="bg-[#F4F2EC] rounded-[10px] mt-4">
        {/* Council Members */}
        <div className="mobile:p-4 p-2 bg-[#F4F2EC] rounded-lg flex flex-col gap-4">
          <header
            onClick={toggleCouncil}
            className="cursor-pointer flex flex-row items-center justify-between bg-[#AAC8D6] p-3 rounded-lg"
          >
            <p className="font-semibold text-lg">Council</p>
            <p className="font-semibold big_phone:text-base text-sm">
              {councilMembers.length} {councilMembers.length === 1 ? "Member" : "Members"}
            </p>
            {isCouncilOpen ? <IoIosArrowDown /> : <IoIosArrowUp />}
          </header>

          {isCouncilOpen && (
            <div className="bg-white rounded-lg">
              <div style={gridView ? gridContainerStyle : listContainerStyle}>
                {councilMembers.map((member, index) => (
                  <React.Fragment key={index}>
                    {gridView ? <GridView member={member} /> : <ListView member={member} />}
                  </React.Fragment>
                ))}
              </div>
            </div>
          )}

          {/* Groups Section */}
          {daoGroups?.map((group, index) => (
            <div key={index} className="flex flex-col bg-white rounded-lg">
              <header
                onClick={() => toggleOpenGroup(index)}
                className="cursor-pointer flex flex-row items-center justify-between bg-[#AAC8D6] p-3 rounded-lg"
              >
                <p className="font-semibold big_phone:text-lg text-sm">{group.group_name}</p>
                <p className="font-semibold big_phone:text-base text-sm">{group.group_members.length} {group.group_members.length === 1 ? "Member": "Members"}</p>
                {openedGroupIndex === index ? (
                  <IoIosArrowDown className="font-bold big_phone:text-base text-sm" />
                ) : (
                  <IoIosArrowUp className="font-bold big_phone:text-base text-sm" />
                )}
              </header>

              {openedGroupIndex === index && (
                <div
                  className="mobile:px-8 px-2 gap-2 big_phone:py-8 pb-4"
                  style={gridView ? gridContainerStyle : listContainerStyle}
                >
                  {(groupMembers[group.group_name] || []).map((member, index) => (
                    <React.Fragment key={index}>
                      {gridView ? <GridView member={member} /> : <ListView member={member} />}
                    </React.Fragment>
                  ))}
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
  const [imageSrc, setImageSrc] = useState(userImage);
  const profileImgSrc = member.Ok.profile_img
    ? `${protocol}://${process.env.CANISTER_ID_IC_ASSET_HANDLER}.${domain}/f/${member.Ok.profile_img}`
    : userImage;

  return (
    <div className="big_phone:flex hidden flex-col px-4 py-2 border border-[#97C3D3] rounded-lg">
    <div className="top flex flex-row items-start justify-between">
      <section className="relative w-16 h-16">
        <img src={profileImgSrc || userImage} alt="Image" className="rounded-[50%] w-full h-full object-cover" />
      </section>
      <MdAddBox className="mx-2 text-[#97C3D3] text-2xl" />
    </div>
    <div className="middle flex flex-row gap-x-4 item-center justify-between">
      <section className="details flex flex-col items-start">
        <p className="font-semibold text-lg">{member.Ok.username}</p>
        <p className="text-sm">{member.Ok.email_id}</p>
      </section>
      <section>
        <button className="bg-[#FFEDED] text-sm text-red-500 rounded-2xl shadow-lg px-4 py-2">Propose to Remove</button>
      </section>
    </div>
  </div>
  )
};

// ListView Component for both council and group members
const ListView = ({ member }) => {
  const protocol = process.env.DFX_NETWORK === "ic" ? "https" : "http";
  const domain = process.env.DFX_NETWORK === "ic" ? "raw.icp0.io" : "localhost:4943";
  const [imageSrc, setImageSrc] = useState(userImage);
  const profileImgSrc = member.Ok.profile_img
    ? `${protocol}://${process.env.CANISTER_ID_IC_ASSET_HANDLER}.${domain}/f/${member.Ok.profile_img}`
    : userImage;

  return (<div className="big_phone:hidden flex flex-col big_phone:p-2 px-1 py-2 gap-y-4 border border-[#97C3D3] rounded-lg">
    <section className="top flex flex-row items-start justify-between">
      <img src={profileImgSrc || userImage} alt="Image" className="w-12 h-12 rounded-[50%] object-cover" />
      <MdAddBox className="mx-1 text-[#97C3D3] text-2xl" />
    </section>
    <section>
      <p className="text-center font-semibold mobile:text-1xl">{member.Ok.username}</p>
      <p className="text-center text-xs">{member.Ok.email_id}</p>
    </section>
    <section className="flex flex-row justify-center p-2">
      <button className="bg-[#FFEDED] text-xs text-red-500 rounded-2xl shadow-lg px-4 py-2">Propose to Remove</button>
    </section>
  </div>
);
}
  
