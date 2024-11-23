import React, { useEffect, useState } from "react";
// import { FaPlus } from "react-icons/fa6";
import { HiPlus } from "react-icons/hi";
import { MdOutlineDeleteOutline } from "react-icons/md";
import { FaArrowLeftLong, FaArrowRightLong } from "react-icons/fa6";
import { Principal } from "@dfinity/principal";
import { toast } from "react-hot-toast";
import { useAuth } from "../../Components/utils/useAuthClient";
import Container from "../Container/Container";
import EditPen from "../../../assets/edit_pen.png";
import { RiGroupFill } from "react-icons/ri";
import { CircularProgress } from "@mui/material";

const Step3 = ({ setData, setActiveStep }) => {
  const [count, setCount] = useState(1);
  const [councilUsernames, setCouncilUsernames] = useState([]);
  const [generalMembersUsernames, setGeneralMembersUsernames] = useState([]);
  const [username, setUsername] = useState("");
  const [showMemberNameInput, setShowMemberNameInput] = useState(false);
  const [addMemberIndex, setAddMemberIndex] = useState(null);
  const [groupNameInputIndex, setGroupNameInputIndex] = useState(null);
  const [memberUsernames, setMemberUsernames] = useState({});
  const [updatedGroupName, setUpdatedGroupName] = useState("");
  const [memberName, setMemberName] = useState("");
  const { backendActor, stringPrincipal } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);

  const [list, setList] = useState([
    { name: "Council", index: 0, members: [] },
    { name: "General Members", index: -1, members: [] },
  ]);

  const className = "DAO__Step3";

  useEffect(() => {
    // Retrieve data from local storage
    const savedData = localStorage.getItem("step3Data");
    if (savedData) {
      setList(JSON.parse(savedData));
    }
  }, []);

  const getUniqueMembers = () => {
    const allMembers = new Set();

    // Add council members
    const council = list.find((group) => group.name === "Council");
    if (council) {
      council.members.forEach((member) => allMembers.add(member));
    }
    const generalMembers = list.find(
      (group) => group.name === "General Members"
    );
    if (generalMembers) {
      generalMembers.members.forEach((member) => allMembers.add(member));
    }

    // Add group members
    list
      .filter((group) => group.name !== "Council")
      .forEach((group) => {
        group.members.forEach((member) => allMembers.add(member));
      });

    console.log(Array.from(allMembers));
    return Array.from(allMembers);
  };

  const handleSaveAndNext = () => {
    const council = list.find((group) => group.name === "Council");
    if (!council || council.members.length === 0) {
      toast.error("Please add at least one member to the Council.");
      return;
    }
    const invalidGroup = list
      .slice(1)
      .find((group) => group.name !== "General Members" &&  group.members.length === 0);
    if (invalidGroup) {
      toast.error(`Please add at least one member to ${invalidGroup.name}.`);
      return;
    }

    localStorage.setItem("step3Data", JSON.stringify(list));

    const uniqueMembers = getUniqueMembers();
    console.log("Council--", council.members);

    setData((prev) => ({
      ...prev,
      step3: {
        groups: list.slice(1) || [],
        council: council.members || [],
        members: uniqueMembers || [],
      },
    }));
    setActiveStep(3);
  };

  function handleBack() {
    setActiveStep(1);
  }

  const handleGroupAdding = () => {
    setMemberName("");
    setList((prevList) => {
      const maxIndex = prevList.reduce(
        (max, group) => Math.max(max, group.index),
        0
      );
      const newGroupIndex = maxIndex + 1;

      const newGroup = {
        name: `Group ${newGroupIndex}`,
        index: newGroupIndex,
        members: [],
      };

      setAddMemberIndex(newGroupIndex);
      setShowMemberNameInput(true);

      return [...prevList, newGroup];
    });

    setCount((prevCount) => prevCount + 1);
  };

  const deleteGroup = (index) => {
    setList((prevList) => prevList.filter((item) => item.index !== index));
  };

  const handleMemberAdding = (index) => {
    setMemberName("");
    setAddMemberIndex(index);
    setShowMemberNameInput(true);
  };

  const handleAddMember = async () => {
    if (memberName.trim() !== "") {
      setIsAdding(true);
      try {
        const principal = Principal.fromText(memberName.trim());
        const principalId = principal.toText();

        const targetGroup =
          addMemberIndex === 0
            ? list.find((group) => group.name === "Council")
            : addMemberIndex === -1
            ? list.find((group) => group.name === "General Members")
            : list.find((group) => group.index === addMemberIndex);

        if (!targetGroup) {
          toast.error("Target group not found");
          setIsAdding(false);
          return;
        }

        if (targetGroup.members.includes(principalId)) {
          toast.error("Principal ID already exists");
          setMemberName("");
          setIsAdding(false);
          return;
        }

        const response = await backendActor.get_profile_by_id(principal);

        if (response.Ok) {
          const username = response.Ok.username;
          setList((prevList) =>
            prevList.map((group) => {
              if (
                group.index === addMemberIndex ||
                (addMemberIndex === 0 && group.name === "Council") ||
                (addMemberIndex === -1 && group.name === "General Members")
              ) {
                return {
                  ...group,
                  members: [...group.members, principalId],
                };
              }
              return group;
            })
          );

          if (addMemberIndex === 0) {
            setCouncilUsernames((prevUsernames) => [
              ...prevUsernames,
              `${username} (${principalId})`,
            ]);
          }

          if (addMemberIndex === -1) {
            setGeneralMembersUsernames((prevUsernames) => [
                ...prevUsernames,
                `${username} (${principalId})`,
            ]);
        }
        

          setMemberUsernames((prevUsernames) => ({
            ...prevUsernames,
            [principalId]: username,
          }));

          setMemberName("");
          setShowMemberNameInput(false);
        } else {
          toast.error("User does not exist");
        }
      } catch (error) {
        toast.error("Invalid Principal ID or error fetching profile");
      } finally {
        setIsAdding(false);
      }
    }
  };

  useEffect(() => {
    const fetchGroupUsernames = async () => {
      const groups = list.filter(
        (group) => group.name !== "Council" || group.name !== "General Members"
      );
      let updated = false;
      const newUsernames = { ...memberUsernames };

      for (const group of groups) {
        for (const member of group.members) {
          if (!newUsernames[member]) {
            try {
              const principal = Principal.fromText(member);
              const response = await backendActor.get_profile_by_id(principal);
              if (response.Ok) {
                newUsernames[member] = response.Ok.username;
              } else {
                newUsernames[member] = "Unknown User";
              }
            } catch {
              newUsernames[member] = "Error fetching username";
            }
            updated = true; // Mark that we need to update state
          }
        }
      }

      // Update state only if there are changes
      if (updated) {
        setMemberUsernames(newUsernames);
      }
    };

    if (list.length > 0) {
      fetchGroupUsernames();
    }
  }, [list, backendActor, memberUsernames]);

  const handleRemoveMember = (groupIndex, memberPrincipalId) => {
    setList((prevList) =>
      prevList.map((item) => {
        if (
          (item.index === groupIndex ||
            (groupIndex === 0 && item.name === "Council") || (groupIndex === -1 && item.name === "General Members")) &&
          item.members.includes(memberPrincipalId)
        ) {
          const updatedMembers = item.members.filter(
            (user) => user !== memberPrincipalId
          );

          // Update the councilUsernames state
          if (item.name === "Council") {
            setCouncilUsernames((prevUsernames) =>
              prevUsernames.filter(
                (username) => !username.includes(memberPrincipalId)
              )
            );
          } else if (item.name === "General Members") {
              setGeneralMembersUsernames((prevUsernames) =>
                prevUsernames.filter(
                  (username) => !username.includes(memberPrincipalId)
                )
              );
            }

          return {
            ...item,
            members: updatedMembers,
          };
        }
        return item;
      })
    );
  };

  const handleShowGroupNameInput = (index) => {
    setGroupNameInputIndex(index);
  };

  const handleUpdateGroupName = () => {
    setList((prevList) =>
      prevList.map((item) => {
        if (item.index === groupNameInputIndex) {
          return { ...item, name: updatedGroupName };
        }
        return item;
      })
    );
    setGroupNameInputIndex(-1);
    setUpdatedGroupName(""); // Clear the input state
  };

  const councilMembers =
    list.find((group) => group.name === "Council")?.members || [];
  useEffect(() => {
    const fetchCouncilUsernames = async () => {
      const fetchedUsernames = [];
      for (const member of councilMembers) {
        const principal = Principal.fromText(member);
        try {
          const response = await backendActor.get_profile_by_id(principal);
          if (response.Ok) {
            fetchedUsernames.push(
              `${response.Ok.username} (${principal.toText()})`
            );
          } else {
            fetchedUsernames.push(member);
          }
        } catch (error) {
          fetchedUsernames.push(member);
        }
      }
      setCouncilUsernames(fetchedUsernames);
      localStorage.setItem("councilMembers", JSON.stringify(fetchedUsernames));
      setIsLoading(false);
    };

    // Only fetch if councilMembers are present
    if (councilMembers.length > 0) {
      fetchCouncilUsernames();
    }
  }, [councilMembers, backendActor]);

  const generalMembers =
    list.find((group) => group.name === "General Members")?.members || [];
    useEffect(() => {
      const fetchMissingGeneralUsernames = async () => {
          const fetchedUsernames = [...generalMembersUsernames];
          for (const member of generalMembers) {
              if (!memberUsernames[member]) {
                  try {
                      const response = await backendActor.get_profile_by_id(
                          Principal.fromText(member)
                      );
                      if (response.Ok) {
                          fetchedUsernames.push(
                              `${response.Ok.username} (${member})`
                          );
                      } else {
                          fetchedUsernames.push(member);
                      }
                  } catch {
                      fetchedUsernames.push(member);
                  }
              }
          }
          setGeneralMembersUsernames(fetchedUsernames);
      };
  
      fetchMissingGeneralUsernames();
  }, [generalMembers, backendActor, memberUsernames]);
  

  useEffect(() => {
    // Retrieve saved list from localStorage if available
    const savedList = localStorage.getItem("step3Data");
    const initialList = savedList ? JSON.parse(savedList) : list; // Use saved list or the default list

    // Find the Council group in the list
    const council = initialList.find((group) => group.name === "Council");

    // Check if the current user is already in the council
    if (council && !council.members.includes(stringPrincipal)) {
      const updatedList = initialList.map((group) => {
        if (group.name === "Council") {
          return { ...group, members: [...group.members, stringPrincipal] };
        }
        return group;
      });

      // Update the state with the new list
      setList(updatedList);

      localStorage.setItem("step3Data", JSON.stringify(updatedList));
    } else {
      // If no update was needed, ensure the list state is still set
      setList(initialList);
    }

    console.log("Current council members:", council?.members || []);
  }, [stringPrincipal]); // Only rerun if stringPrincipal changes

  const handleEditGroup = (index) => {
    setGroupNameInputIndex(index);
    const groupName = list.find((item) => item.index === index)?.name || "";
    setUpdatedGroupName(groupName); // Set the current name to the input state
  };

  const closeInputField = () => {
    setShowMemberNameInput(false);
    setMemberName(""); // Clear the input when closed
  };

  const skeletonLoader = () => {
    return (
      <div className="w-full flex bg-gray-100 py-2 px-2 md:px-8 items-center justify-between mb-2 animate-pulse">
        {/* Simulated Username */}
        <div className="flex-col space-y-1">
          <p className="font-semibold mobile:text-base text-sm bg-gray-300 h-6 w-20 rounded-md"></p>
          {/* Simulated Principal ID */}
          <p className="text-sm bg-gray-300 h-6 w-40 md:w-96 rounded-md"></p>
        </div>
        {/* Simulated Delete Button */}
        <button className="w-6 h-6 bg-gray-300 rounded-full"></button>
      </div>
    );
  };

  return (
    <React.Fragment>
      <Container>
        <div className="DAO__Step3__form bg-[#F4F2EC] big_phone:p-10 small_phone:p-6 p-4 big_phone:mx-4 mx-0 rounded-lg flex flex-col gap-4">
          <div className="flex flex-row items-start justify-between">
            <section className="w-11/12 flex flex-col gap-y-2">
              <h2 className="font-semibold">Add Members</h2>
              <p className="big_phone:text-base mobile:text-sm text-xs">
                You can add members and assign them various roles as per your
                decisions and also add members to
                <br />
                your DAO for providing them specific roles in the future.
              </p>
            </section>

            {/* <button
              onClick={handleGroupAdding}
              disabled={isLoading || isAdding}
              className={`bg-white  lg:mr-7 md:w-[200px] md:h-[50px] small_phone:gap-2 gap-1  small_phone:  mobile:px-5 p-2 small_phone:text-base text-sm shadow-xl flex items-center rounded-full hover:bg-[#ececec] hover:scale-105 transition ${
                isLoading || isAdding ? "cursor-not-allowed" : "cursor-pointer"
              }`}
            >
              <span className="flex">
                <HiPlus />
              </span>
              <span className="flex lg:hidden items-center">
                <RiGroupFill />
              </span>
              <span className=" hidden lg:flex">Create</span>
              <span className=""> Group</span>
            </button> */}
            <div className="relative group inline-block">
              <button
                onClick={handleGroupAdding}
                className={`bg-white lg:mr-7 md:w-[200px] md:h-[50px] small_phone:gap-2 gap-1 mobile:px-5 p-2 small_phone:text-base text-sm shadow-xl flex items-center rounded-full hover:bg-[#ececec] hover:scale-105 transition ${isLoading || isAdding ? "cursor-not-allowed" : "cursor-pointer"}`}
                disabled={isLoading || isAdding}
              >
                <span className="flex">
                  <HiPlus />
                </span>
                <span className="flex lg:hidden items-center">
                  <RiGroupFill />
                </span>
                <span className="hidden lg:flex">Create</span>
                <span className=""> Group</span>
              </button>

              {/* Tooltip */}
              <div className="absolute left-1/2 transform -translate-x-1/2 bottom-full mb-2 opacity-0 group-hover:opacity-100 bg-gray-700 text-white text-sm rounded-lg py-2 px-6 w-[250px]">
                <div className="absolute left-1/2 transform -translate-x-1/2 bottom-[-6px] w-0 h-0 border-l-[6px] border-r-[6px] border-t-[6px] border-t-gray-700 border-l-transparent border-r-transparent"></div>
                Members in the same group share similar roles and actions
                within the DAO
              </div>
            </div>

          </div>

          {/* Council */}
          <div className="bg-[#E9EAEA] rounded-lg">
            <section className="w-full py-2 mobile:px-8 p-2 pl-4 flex flex-row items-center justify-between border-b-2 border-[#b4b4b4]">
              <h2 className="font-semibold mobile:text-base text-sm">
                Council
              </h2>
              <button
                onClick={() => handleMemberAdding(0)}
                className={`flex flex-row items-center gap-1 text-[#229ED9] bg-white mobile:p-2 p-1 rounded-md ${
                  isLoading || isAdding
                    ? "cursor-not-allowed"
                    : "cursor-pointer"
                }`}
                disabled={isAdding || isLoading}
              >
                Add Member
              </button>
            </section>
            <section className="py-4 mobile:px-8 p-2 transition">
              {showMemberNameInput && addMemberIndex === 0 ? (
                <div className="flex flex-col sm:flex-row gap-2 items-center w-full">
                  <input
                    type="text"
                    className="w-full sm:w-auto md:w-[1500px] h-[48px] sm:h-[40px] md:h-[48px] p-2 text-sm sm:text-base rounded-md border border-slate-500"
                    placeholder="Enter Member Principal Id"
                    value={memberName}
                    onChange={(e) => setMemberName(e.target.value)}
                  />
                  <div className="flex flex-row gap-2">
                    <button
                      onClick={handleAddMember}
                      className="w-[100px] flex justify-center items-center sm:w-auto lg:w-[155px] h-[48px] sm:h-[40px] md:h-[48px]  bg-black text-white p-2 rounded-md"
                      disabled={isAdding}
                    >
                      {isAdding ? (
                        <div className="w-4 h-4 border-2 border-t-transparent border-white rounded-full animate-spin"></div>
                      ) : (
                        "Add"
                      )}
                    </button>
                    <button
                      onClick={closeInputField}
                      className={`w-[100px] flex justify-center items-center sm:w-auto md:w-[100px] lg:w-[155px] h-[48px] sm:h-[40px] md:h-[48px] text-white p-2 rounded-md ${
                        isLoading || isAdding
                          ? "cursor-not-allowed bg-gray-700"
                          : "cursor-pointer bg-black"
                      }`}
                      disabled={isAdding}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ) : null}
            </section>
            {isLoading
              ? skeletonLoader() // Show skeleton loader while data is being fetched
              : councilUsernames.map((fullName, index) => {
                const [username, principalId] = fullName.split(" ("); // Split the string to separate username and principal ID
                const formattedPrincipalId = principalId.slice(0, -1); // Remove the closing parenthesis

                return (
                  <section
                    key={index}
                    className="w-full bg-white py-2 p-2 md:px-8 flex flex-col items-center justify-between  mb-4"
                  >
                    <div className="w-full flex  items-center justify-between mb-2">
                      <div>
                        <p className="font-semibold mobile:text-base text-sm border-black">
                          {username}
                        </p>
                        <p className="text-sm">{formattedPrincipalId}</p>
                      </div>
                      <button
                        onClick={() =>
                          handleRemoveMember("council", formattedPrincipalId)
                        }
                      >
                        <MdOutlineDeleteOutline className={`text-red-500 mobile:text-2xl text-lg ${isLoading || isAdding ? "cursor-not-allowed" : "cursor-pointer "}`} />
                      </button>
                    </div>
                  </section>
                );
              })}
          </div>
          
          {/*General Members*/}
          <div className="bg-[#E9EAEA] rounded-lg mt-4">
            <section className="w-full py-2 mobile:px-8 p-2 pl-4 flex flex-row items-center justify-between border-b-2 border-[#b4b4b4]">
              <h2 className="font-semibold mobile:text-base text-sm">
                General Members
              </h2>
              <button
                onClick={() => handleMemberAdding(-1)}
                className={`flex flex-row items-center gap-1 text-[#229ED9] bg-white mobile:p-2 p-1 rounded-md ${
                  isLoading || isAdding
                    ? "cursor-not-allowed"
                    : "cursor-pointer"
                }`}
                disabled={isAdding || isLoading}
              >
                Add Member
              </button>
            </section>
            <section className="py-4 mobile:px-8 p-2 transition">
              {showMemberNameInput && addMemberIndex === -1 ? (
                <div className="flex flex-col sm:flex-row gap-2 items-center w-full">
                  <input
                    type="text"
                    className="w-full sm:w-auto md:w-[1500px] h-[48px] sm:h-[40px] md:h-[48px] p-2 text-sm sm:text-base rounded-md border border-slate-500"
                    placeholder="Enter Member Principal Id"
                    value={memberName}
                    onChange={(e) => setMemberName(e.target.value)}
                  />
                  <div className="flex flex-row gap-2">
                    <button
                      onClick={handleAddMember}
                      className="w-[100px] flex justify-center items-center sm:w-auto lg:w-[155px] h-[48px] sm:h-[40px] md:h-[48px]  bg-black text-white p-2 rounded-md"
                      disabled={isAdding}
                    >
                      {isAdding ? (
                        <div className="w-4 h-4 border-2 border-t-transparent border-white rounded-full animate-spin"></div>
                      ) : (
                        "Add"
                      )}
                    </button>
                    <button
                      onClick={closeInputField}
                      className={`w-[100px] flex justify-center items-center sm:w-auto md:w-[100px] lg:w-[155px] h-[48px] sm:h-[40px] md:h-[48px] text-white p-2 rounded-md ${
                        isLoading || isAdding
                          ? "cursor-not-allowed bg-gray-700"
                          : "cursor-pointer bg-black"
                      }`}
                      disabled={isAdding}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ) : null}
            </section>
            {isLoading
              ? skeletonLoader()
              : generalMembersUsernames.length === 0 && (addMemberIndex !== -1) ? (
              <p className="text-center text-lg pb-2 text-gray-500">No members added yet.</p>
            ) : (
              generalMembersUsernames.map((fullName, index) => {
                const [username, principalId] = fullName.split(" (");
                const formattedPrincipalId = principalId.slice(0, -1);
                const displayedUsername = memberUsernames[formattedPrincipalId] || "Loading...";

                return (
                  <section
                    key={index}
                    className="w-full bg-white py-2 p-2 md:px-8 flex flex-col items-center justify-between mb-4"
                  >
                    <div className="w-full flex items-center justify-between mb-2">
                      <div>
                        <p className="font-semibold mobile:text-base text-sm">
                          {displayedUsername}
                        </p>
                        <p className="text-sm">{formattedPrincipalId}</p>
                      </div>
                      <button
                        onClick={() =>
                          handleRemoveMember(-1, formattedPrincipalId)
                        }
                      >
                        <MdOutlineDeleteOutline
                          className={`text-red-500 mobile:text-2xl text-lg ${
                            isLoading || isAdding
                              ? "cursor-not-allowed"
                              : "cursor-pointer"
                          }`}
                        />
                      </button>
                    </div>
                  </section>
                );
              })
            )}
          </div>

          {/* Groups */}
          <div className="DAO__Step3__container w-full flex flex-col gap-2">
            {list
              .filter(
                (group) =>
                  group.name !== "Council" && group.name !== "General Members"
              )
              .map((group, index) => (
                <div
                  key={group.index}
                  className="flex flex-col bg-[#E9EAEA] rounded-lg"
                >
                  <section className="w-full py-2 mobile:px-8 p-2 pl-4 flex flex-row items-center justify-between border-b-2 border-[#b4b4b4]">
                    {groupNameInputIndex === group.index ? (
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          className="p-1 w-24 md:w-60 rounded-md border border-slate-500 text-sm"
                          placeholder="Group Name"
                          value={updatedGroupName}
                          onChange={(e) => setUpdatedGroupName(e.target.value)}
                        />
                        <button
                          onClick={handleUpdateGroupName}
                          className="text-blue-500 truncate ... w-30 bg-slate-200 p-1 rounded-md"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-5 h-5"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M20 6L9 17l-5-5" />
                          </svg>
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 py-1">
                        <p
                          className="font-semibold py-1 cursor-pointer mobile:text-base text-sm"
                          onDoubleClick={() =>
                            handleShowGroupNameInput(group.index)
                          }
                        >
                          {group.name}
                        </p>
                        <button
                          onClick={() => handleEditGroup(group.index)}
                          className="text-blue-500 truncate ... w-30"
                        >
                          <img
                            src={EditPen}
                            alt="edit"
                            className="tablet:mr-2 h-4 w-4 edit-pen"
                          />
                        </button>
                      </div>
                    )}

                    <div className="flex flex-row small_phone:gap-4 gap-2">
                      <button
                        onClick={() => handleMemberAdding(group.index)}
                        className={`flex flex-row items-center gap-1 text-[#229ED9] bg-white mobile:p-1 p-1 rounded-md ${
                          isLoading || isAdding
                            ? "cursor-not-allowed"
                            : "cursor-pointer"
                        }`}
                        disabled={isAdding || isLoading}
                      >
                        Add Member
                      </button>
                      <button onClick={() => deleteGroup(group.index)}>
                        <MdOutlineDeleteOutline
                          className={`text-red-500 mobile:text-2xl text-lg ${
                            isLoading || isAdding
                              ? "cursor-not-allowed"
                              : "cursor-pointer "
                          }`}
                        />
                      </button>
                    </div>
                  </section>

                  <section className="py-4 gap-2 flex flex-col items-start">
                    {addMemberIndex === group.index && showMemberNameInput && (
                      <div className="flex flex-col sm:flex-row gap-2 px-8 items-center w-full">
                        <input
                          type="text"
                          className="w-full sm:w-auto md:w-[1500px] h-[48px] sm:h-[40px] md:h-[48px] p-2 text-sm sm:text-base rounded-md border border-slate-500"
                          placeholder="Enter Member Principal Id"
                          value={memberName}
                          onChange={(e) => setMemberName(e.target.value)}
                        />
                        <div className="flex flex-row gap-2">
                          <button
                            onClick={handleAddMember}
                            className="w-[100px] flex justify-center items-center sm:w-auto md:w-[100px] lg:w-[155px] h-[48px] sm:h-[40px] md:h-[48px]  bg-black text-white p-2 rounded-md"
                            disabled={isAdding}
                          >
                            {isAdding ? (
                              <div className="w-6 h-6 border-2 border-t-transparent border-white rounded-full animate-spin"></div>
                            ) : (
                              "Add"
                            )}
                          </button>
                          <button
                            onClick={closeInputField}
                            className={`w-[100px] flex justify-center items-center sm:w-auto md:w-[100px] lg:w-[155px] h-[48px] sm:h-[40px] md:h-[48px]  text-white p-2 rounded-md ${
                              isLoading || isAdding
                                ? "cursor-not-allowed bg-gray-700"
                                : "cursor-pointer bg-black"
                            }`}
                            disabled={isAdding}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    )}

                    {group.members.map((member, idx) => {
                      const username = memberUsernames[member] || "Loading...";
                      return (
                        <div
                          key={idx}
                          className="w-full bg-white py-2 p-2 md:px-8 flex flex-col items-center justify-between mb-4"
                        >
                          <div className="w-full flex flex-col mobile:items-start md:flex-row md:items-center justify-between mb-2">
                            <div>
                              <p className="font-semibold mobile:text-base text-sm">
                                {username}
                              </p>
                              <p className="text-sm mobile:mt-1 md:mt-0">
                                {member}
                              </p>
                            </div>
                            <button
                              onClick={() =>
                                handleRemoveMember(group.index, member)
                              }
                              className="ml-auto"
                            >
                              <MdOutlineDeleteOutline
                                className={`text-red-500 mobile:text-2xl text-lg ${
                                  isLoading || isAdding
                                    ? "cursor-not-allowed"
                                    : "cursor-pointer "
                                }`}
                              />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </section>
                </div>
              ))}
          </div>

          <div
            className={
              className +
              "__submitButton w-full flex flex-row items-center mobile:justify-end justify-between"
            }
          >
            <button
              onClick={handleBack}
              className="flex mobile:m-4 my-4 flex-row items-center gap-2 border border-[#0E3746] hover:bg-[#0E3746] text-[#0E3746] hover:text-white mobile:text-base text-sm transition px-4 py-2 rounded-[2rem]"
            >
              <FaArrowLeftLong /> Back
            </button>

            <button
              type="submit"
              onClick={handleSaveAndNext}
              className="flex mobile:m-4 my-4 flex-row items-center gap-2 bg-[#0E3746] px-4 py-2 rounded-[2rem] text-white mobile:text-base text-sm"
            >
              Save & Next <FaArrowRightLong />
            </button>
          </div>
        </div>
      </Container>
    </React.Fragment>
  );
};

export default Step3;
