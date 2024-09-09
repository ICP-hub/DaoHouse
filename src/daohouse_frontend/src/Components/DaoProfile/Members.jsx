import React, { useState } from "react";
import "./Members.scss";
import { MdAddBox } from "react-icons/md";
import { LuSearch } from "react-icons/lu";
import { FaListUl } from "react-icons/fa";
import { BsThreeDots } from "react-icons/bs";
import { IoIosArrowUp, IoIosArrowDown } from "react-icons/io";
import { IoFilterSharp, IoGridOutline } from "react-icons/io5";
import userImage from "../../../assets/commentUser.jpg";
import { useMediaQuery } from "@mui/material";
import { useNavigate } from "react-router-dom";

const Members = () => {
  const [openedGroupIndex, setOpenedGroupIndex] = useState();
  const [gridView, setGridView] = useState(true);
  const navigate = useNavigate()
  const className = "Member_and_policy";
  const minWidth = useMediaQuery("(min-width: 800px)");
  const gridTemplateColumns = `repeat(auto-fill, minmax(${
    minWidth ? 370 : 165
  }px, 1fr))`;
  const gridContainerStyle = {
    display: "grid",
    gridTemplateColumns: gridTemplateColumns,
  };
  const listTemplateColumns = `repeat(auto-fill, minmax(${
    minWidth ? 300 : 220
  }px, 1fr))`;
  const listContainerStyle = {
    display: "grid",
    gridTemplateColumns: listTemplateColumns,
  };

  function toggleOpenGroup(index) {
    if (openedGroupIndex == index) {
      setOpenedGroupIndex(null);
    } else setOpenedGroupIndex(index);
  }

  return (
    <div className={className + " mt-6"}>
      <div className="flex items-center justify-between">
        <h1 className="mobile:text-2xl text-lg font-bold py-1">
          Members
        </h1>
        <button
          onClick={() => {
            navigate("/create-proposal");
          }}
          className="big_phone:flex hidden justify-center items-center text-[16px] relative w-[220px] h-[50px] bg-white rounded-full hover:shadow-lg hover:bg-[#ECECEC] transition"
        >
          <span className="absolute text-[35px] font-thin left-5 bottom-[1px] ">
            +
          </span>
          <span className="ml-6">Create Proposals</span>
        </button>
      </div>

      <div className="bg-[#F4F2EC] rounded-[10px] mt-4">
        {/**Header in desktop, tablet */}
        <header className="mobile:flex hidden flex-row items-center justify-between p-4 border-b border-slate-400">
          <h1 className="font-semibold text-lg">Groups</h1>

          <div className="flex flex-row items-center gap-x-2">
            <div className="realtive flex flex-row items-center">
              <input
                type="search"
                name="groups"
                className="big_phone:w-[400px] w-full rounded-[2rem] py-2 pl-10 bg-[#F4F2EC] border border-[#AAC8D6]"
                placeholder="Search by Name"
              />
              <LuSearch className="ml-4 absolute text-slate-400" />
            </div>

            <button className="flex flex-row items-center gap-2 px-4 py-2 bg-white rounded-[2rem]">
              <IoFilterSharp />
              Filter
            </button>
          </div>
        </header>

        {/**Header in mobile */}
        <header className="mobile:hidden">
          <div className="flex flex-row px-4 py-2 items-center justify-between border-b border-slate-400">
            <h1 className="font-semibold text-lg">Groups</h1>
            <button className="flex flex-row items-center gap-2 px-4 py-2 bg-white rounded-[2rem]">
              <IoFilterSharp />
            </button>
          </div>

          <div className="realtive flex flex-row items-center m-2">
            <input
              type="search"
              name="groups"
              className="w-full rounded-[2rem] py-2 pl-8 bg-[#F4F2EC] border border-[#AAC8D6] text-sm"
              placeholder="Search by Name"
            />
            <LuSearch className="ml-2 absolute text-slate-400" />
          </div>
        </header>

        <div
          className={
            className +
            "__body mobile:p-4 p-2 bg-[#F4F2EC] rounded-lg mobile:gap-y-6 gap-y-2 flex flex-col"
          }
        >
          {/**List of groups */}
          {groups.map((item, index) => (
            <div
              key={index}
              className={
                className + "__body__group flex flex-col bg-white rounded-lg"
              }
            >
              <header
                onClick={() => toggleOpenGroup(index)}
                className="cursor-pointer flex flex-row items-center justify-between bg-[#AAC8D6] p-3 rounded-lg"
              >
                <p className="font-semibold big_phone:text-base text-sm">
                  {item.groupName}
                </p>

                <p className="font-semibold big_phone:text-base text-sm">
                  {item.membersList.length} Members
                </p>

                {/**Icons to open and close the list of members in group */}
                {openedGroupIndex === index ? (
                  <IoIosArrowDown
                    onClick={(e) => {
                      e.stopPropagation();
                      setOpenedGroupIndex(null);
                    }}
                    className="font-bold big_phone:text-base text-sm hover:text-black text-slate-600"
                  />
                ) : (
                  <IoIosArrowUp
                    onClick={(e) => {
                      e.stopPropagation();
                      setOpenedGroupIndex(index);
                    }}
                    className="font-bold big_phone:text-base text-sm hover:text-black text-slate-600"
                  />
                )}
              </header>

              {/**List of the members in group */}
              {openedGroupIndex === index && (
                <React.Fragment>
                  <div className="big_phone:hidden flex flex-row item-scenter justify-between mobile:px-8 px-4 mobile:py-6 py-4">
                    <h1 className="font-semibold">
                      {gridView ? "Grid View" : "List View"}
                    </h1>

                    <div className="__viewButtons flex flex-row gap-4">
                      <button onClick={() => setGridView(true)}>
                        <IoGridOutline />
                      </button>
                      <button onClick={() => setGridView(false)}>
                        <FaListUl />
                      </button>
                    </div>
                  </div>
                  <div
                    className={
                      className +
                      "__body__group__members mobile:px-8 px-2 gap-2 big_phone:py-8 pb-4"
                    }
                    style={gridView ? gridContainerStyle : listContainerStyle}
                  >
                    {item.membersList.map((member) => (
                      <React.Fragment>
                        {gridView ? (
                          <GridView member={member} />
                        ) : (
                          <ListView member={member} />
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                </React.Fragment>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Members;

const GridView = ({ member }) => {
  return (
    <React.Fragment>
      <div className="big_phone:flex hidden flex-col px-4 py-2 border border-[#97C3D3] rounded-lg">
        <div className="top flex flex-row items-start justify-between ">
          <section className="relative w-16 h-16">
            <img
              src={member.userImage}
              alt="Image"
              className="rounded-[50%] w-full h-full object-cover bottom-5 absolute"
            />
          </section>

          <MdAddBox className="mx-2 text-[#97C3D3] text-2xl" />
        </div>

        <div className="middle flex flex-row gap-x-4 item-center justify-between">
          <section className="details flex flex-col items-start">
            <p className="font-semibold text-lg">{member.userName}</p>

            <p className="text-sm">{member.userEmail}</p>
          </section>

          <section>
            <button className="bg-[#FFEDED] text-sm text-red-500 rounded-2xl shadow-lg px-4 py-2">
              Propose to Remove
            </button>
          </section>
        </div>

        <div className="last flex flex-row align-start justify-evenly my-4">
          <section className="flex flex-col items-center px-2">
            <p className="text-sm">Total Votes</p>

            <h1 className="font-semibold text-2xl">{member.totalVotes}</h1>
          </section>

          <div className="h-7 w-0.5 bg-slate-400"></div>

          <section className="flex flex-col items-center">
            <p className="text-sm">In Favour</p>

            <h1 className="font-semibold text-2xl">{member.inFavour}</h1>
          </section>

          <div className="h-7 w-0.5 bg-slate-400"></div>

          <section className="flex flex-col items-center">
            <p className="text-sm">In Against</p>
            <h1 className="font-semibold text-2xl">{member.inAgainst}</h1>
          </section>
        </div>
      </div>

      {/**Mobile View */}
      <div className="big_phone:hidden flex flex-col big_phone:p-2 px-1 py-2 gap-y-4 border border-[#97C3D3] rounded-lg">
        <section className="top flex flex-row items-start justify-between">
          <BsThreeDots className="mx-1 text-2xl" />

          <img
            src={member.userImage}
            alt="Image"
            className="w-12 h-12 rounded-[50%] object-cover"
          />

          <MdAddBox className="mx-1 text-[#97C3D3] text-2xl" />
        </section>

        <section>
          <p className="text-center font-semibold mobile:text-1xl">
            {member.userName}
          </p>
          <p className="text-center text-xs">{member.userEmail}</p>
        </section>

        <section className="flex flex-row justify-center p-2">
          <button className="bg-[#FFEDED] text-xs text-red-500 rounded-2xl shadow-lg px-3 py-2">
            Propose to Remove
          </button>
        </section>
      </div>
    </React.Fragment>
  );
};

const ListView = ({ member }) => {
  return (
    <React.Fragment>
      <div className="flex w-full flex-row items-center justify-between border border-[#97C3D3] rounded-lg big_phone:p-4 p-2">
        <section className="flex flex-row items-center gap-2">
          <img
            src={member.userImage}
            alt="Image"
            className="big_phone:w-12 w-9 big_phone:h-12 h-9 rounded-[50%] object-cover"
          />

          <div className="flex flex-col items-start">
            <p className="text-center font-semibold big_phone:text-1xl text-sm">
              {member.userName}
            </p>
            <p className="text-center text-xs">{member.userEmail}</p>
          </div>
        </section>

        <section>
          <MdAddBox className="mx-1 text-[#97C3D3] big_phone:text-2xl text-lg" />
        </section>
      </div>
    </React.Fragment>
  );
};

const groups = [
  {
    groupName: "Council",
    membersList: [
      {
        userKey: 1,
        userImage: userImage,
        userName: "Username.user",
        userEmail: "gmail@gmail.com",
        totalVotes: 25,
        inFavour: 19,
        inAgainst: 6,
      },
      {
        userKey: 2,
        userImage: userImage,
        userName: "Username.user",
        userEmail: "gmail@gmail.com",
        totalVotes: 25,
        inFavour: 19,
        inAgainst: 6,
      },
      {
        userKey: 3,
        userImage: userImage,
        userName: "Username.user",
        userEmail: "gmail@gmail.com",
        totalVotes: 25,
        inFavour: 19,
        inAgainst: 6,
      },
      {
        userKey: 4,
        userImage: userImage,
        userName: "Username.user",
        userEmail: "gmail@gmail.com",
        totalVotes: 25,
        inFavour: 19,
        inAgainst: 6,
      },
    ],
  },
  {
    groupName: "Group 1",
    membersList: [
      {
        userKey: 1,
        userImage: userImage,
        userName: "Username.user",
        userEmail: "gmail@gmail.com",
        totalVotes: 25,
        inFavour: 19,
        inAgainst: 6,
      },
      {
        userKey: 2,
        userImage: userImage,
        userName: "Username.user",
        userEmail: "gmail@gmail.com",
        totalVotes: 25,
        inFavour: 19,
        inAgainst: 6,
      },
    ],
  },
];
