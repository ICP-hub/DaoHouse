import React, { useEffect, useState } from "react";
import { HiPlus } from "react-icons/hi";
import { MdOutlineDeleteOutline } from "react-icons/md";
import { FaArrowLeftLong, FaArrowRightLong } from "react-icons/fa6";
import { Principal } from "@dfinity/principal";
import { toast } from "react-toastify";
import { useAuth } from "../../Components/utils/useAuthClient";
import Container from "../Container/Container";
import EditPen from "../../../assets/edit_pen.png";
import { RiGroupFill } from "react-icons/ri";


const Step3 = ({ setData, setActiveStep, }) => {
  const [count, setCount] = useState(1);
  const [councilUsernames, setCouncilUsernames] = useState([]);
  const [username, setUsername] = useState("")
  const [showMemberNameInput, setShowMemberNameInput] = useState(false);
  const [addMemberIndex, setAddMemberIndex] = useState(null);
  const [groupNameInputIndex, setGroupNameInputIndex] = useState(null);
  const [memberUsernames, setMemberUsernames] = useState({});
  const [updatedGroupName, setUpdatedGroupName] = useState("");
  const [memberName, setMemberName] = useState("");
  const { backendActor, stringPrincipal } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isAdding, setIsAdding] = useState(false)
  const [openGroups, setOpenGroups] = useState([]);


  const [list, setList] = useState([
    { name: "Council", index: 0, members: [] },
  ]);

  const className = "DAO__Step3";

  useEffect(() => {

    const savedData = localStorage.getItem('step3Data');
    if (savedData) {
      setList(JSON.parse(savedData));
    }
  }, []);

  const toggleGroup = (index) => {
    if (openGroups.includes(index)) {

      setOpenGroups(openGroups.filter(i => i !== index));
    } else {

      setOpenGroups([...openGroups, index]);
    }
  };

  const getUniqueMembers = () => {
    const allMembers = new Set();

    // Add council members
    const council = list.find(group => group.name === "Council");
    if (council) {
      council.members.forEach(member => allMembers.add(member));
    }

    // Add group members
    list.filter(group => group.name !== "Council").forEach(group => {
      group.members.forEach(member => allMembers.add(member));
    });

    // console.log(Array.from(allMembers));

    return Array.from(allMembers);
  };

  const handleSaveAndNext = () => {

    const council = list.find(group => group.name === "Council");
    if (!council || council.members.length === 0) {
      toast.error("Please add at least one member to the Council.");
      return;
    }

    const invalidGroup = list.slice(1).find(group => group.members.length === 0);
    if (invalidGroup) {
      toast.error(`Please add at least one member to ${invalidGroup.name}.`);
      return;
    }


    localStorage.setItem('step3Data', JSON.stringify(list));


    const uniqueMembers = getUniqueMembers();
    // console.log("Council--", council.members);

    setData(prev => ({
      ...prev,
      step3: {
        groups: list.slice(1) || [],
        council: council.members || [],
        members: getUniqueMembers || []
      },
    }));
    setActiveStep(3);
  };

  function handleBack() {
    setActiveStep(1);
  }
  const handleGroupAdding = () => {
    setShowMemberNameInput(true);
    setList(prevList => {

      const maxIndex = prevList.reduce((max, group) => Math.max(max, group.index), 0);
      const newGroupIndex = maxIndex + 1;

      return [
        ...prevList,
        { name: `Group ${newGroupIndex}`, index: newGroupIndex, members: [] },
      ];
    });


    setAddMemberIndex(newGroupIndex);


    setCount(prevCount => prevCount + 1);
  };



  const deleteGroup = (index) => {
    setList(prevList => prevList.filter(item => item.index !== index));
  };
  const handleMemberAdding = (index) => {
    if (index === null) {
      // Council case
      setAddMemberIndex('council');
    } else {
      // Group case
      setAddMemberIndex(index);
    }
    setShowMemberNameInput(true);
  };

  const handleAddMember = async () => {
    if (memberName.trim() !== "") {
      setIsAdding(true);
      try {
        const principal = Principal.fromText(memberName.trim());
        const response = await backendActor.get_profile_by_id(principal);

        if (response.Ok) {
          const username = response.Ok.username;
          const principalId = principal.toText();

          setMemberUsernames((prevUsernames) => ({
            ...prevUsernames,
            [principalId]: username,
          }));

          setList((prevList) =>
            prevList.map((item) => {
              if (
                item.index === addMemberIndex ||
                (addMemberIndex === "council" && item.name === "Council")
              ) {
                if (!item.members.includes(principalId)) {
                  return { ...item, members: [...item.members, principalId] };
                } else {
                  toast.error("Principal ID already exists");
                }
              }
              return item;
            })
          );


          if (addMemberIndex === "council") {
            setCouncilUsernames((prevUsernames) => [
              ...prevUsernames,
              `${username} (${principalId})`,
            ]);
          }

          setMemberName("");
          setShowMemberNameInput(false);
        } else {
          toast.error("User does not exist");
        }
      } catch (error) {
        toast.error("Invalid Principal ID or error fetching profile");
      } finally {
        setIsAdding(false)
      }
    }
  };

  useEffect(() => {
    const fetchGroupUsernames = async () => {
      const groups = list.filter(group => group.name !== "Council");
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
            updated = true;
          }
        }
      }


      if (updated) {
        setMemberUsernames(newUsernames);
      }
    };

    if (list.length > 0) {
      fetchGroupUsernames();
    }
  }, [list, backendActor, memberUsernames]);

  const handleRemoveMember = (groupIndex, memberPrincipalId) => {
    setList(prevList =>
      prevList.map(item => {
        if (
          (item.index === groupIndex || (groupIndex === 'council' && item.name === "Council")) &&
          item.members.includes(memberPrincipalId)
        ) {
          const updatedMembers = item.members.filter(user => user !== memberPrincipalId);


          if (item.name === "Council") {
            setCouncilUsernames(prevUsernames => prevUsernames.filter(username => !username.includes(memberPrincipalId)));
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


  const openMemberNames = (index) => {
    setAddMemberIndex(index);
  };

  const handleShowGroupNameInput = (index) => {
    setGroupNameInputIndex(index);
  };

  const handleGroupNameInput = (groupName, event) => {

    setList(prevList =>
      prevList.map(item => {
        if (item.index === groupNameInputIndex) {
          return { ...item, name: groupName };
        }
        return item;
      })
    );
    setGroupNameInputIndex(null);

  };

  const handleUpdateGroupName = () => {
    setList(prevList =>
      prevList.map(item => {
        if (item.index === groupNameInputIndex) {
          return { ...item, name: updatedGroupName };
        }
        return item;
      })
    );
    setGroupNameInputIndex(null);
    setUpdatedGroupName("");
  };

  const getUsernameByPrincipalId = async (principalId) => {
  

    try {
      const response = await backendActor.get_profile_by_id(Principal.fromText(principalId));
     
      setUsername(response.Ok.username)

    } catch {
      return "Error fetching username";
    }

  }


  useEffect(() => {
    const fetchCouncilUsernames = async () => {
      const council = list.find((group) => group.name === "Council");

      const savedCouncilMembers = JSON.parse(localStorage.getItem('councilMembers'));

      if (savedCouncilMembers) {

        setCouncilUsernames(savedCouncilMembers);
      } else if (council && council.members.length > 0) {

        setIsLoading(true)
        const fetchedUsernames = [];
        for (const member of council.members) {
          const principal = Principal.fromText(member);
          try {
            const response = await backendActor.get_profile_by_id(principal);
            if (response.Ok) {
              fetchedUsernames.push(`${response.Ok.username} (${principal.toText()})`);
            } else {
              fetchedUsernames.push(member);
            }
          } catch (error) {
            fetchedUsernames.push(member);
          } finally {
            setIsLoading(false)
          }
        }
        setCouncilUsernames(fetchedUsernames);
        localStorage.setItem('councilMembers', JSON.stringify(fetchedUsernames));
      }
    };

    fetchCouncilUsernames();
  }, [list, backendActor]);




  useEffect(() => {

    const savedList = localStorage.getItem('step3Data');
    const initialList = savedList ? JSON.parse(savedList) : list;

    const council = initialList.find((group) => group.name === "Council");


    if (council && !council.members.includes(stringPrincipal)) {
      const updatedList = initialList.map((group) => {
        if (group.name === "Council") {
          return { ...group, members: [...group.members, stringPrincipal] };
        }
        return group;
      });

      setList(updatedList);


      localStorage.setItem('step3Data', JSON.stringify(updatedList));
    } else {

      setList(initialList);
    }

    
  }, [stringPrincipal]);

  const handleEditGroup = (index) => {
    setGroupNameInputIndex(index);
    const groupName = list.find(item => item.index === index)?.name || "";
    setUpdatedGroupName(groupName);
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
                You can add members and assign them various roles as per your decisions and also add members to<br />
                your DAO for providing them specific roles in the future.
              </p>
            </section>


            <button
              onClick={handleGroupAdding}
              className="bg-white  lg:mr-7 md:w-[200px] md:h-[50px] small_phone:gap-2 gap-1  small_phone:  mobile:px-5 p-2 small_phone:text-base text-sm shadow-xl flex items-center rounded-full hover:bg-[#ececec] hover:scale-105 transition">
              <span className="flex"><HiPlus /></span>
              <span className="flex lg:hidden items-center"><RiGroupFill /></span>
              <span className=" hidden lg:flex">Create</span>
              <span className=""> Group</span>
            </button>
          </div>

          {/* Council */}
          <div className="bg-[#E9EAEA] rounded-lg">
            <section className="w-full py-2 mobile:px-8 p-2 pl-4 flex flex-row items-center justify-between border-b-2 border-[#b4b4b4]">
              <h2 className="font-semibold mobile:text-base text-sm">Council</h2>
              <button
                onClick={() => handleMemberAdding(null)}
                className="flex flex-row items-center gap-1 text-[#229ED9] bg-white mobile:p-2 p-1 rounded-md"
              >
                Add Member
              </button>
            </section>
            <section className="py-4 mobile:px-8 p-2 transition">
              {showMemberNameInput && addMemberIndex === 'council' ? (
                <div className="flex flex-col sm:flex-row gap-2 items-center w-full">
                  <input
                    type="text"
                    className="w-full sm:w-auto md:w-[1500px] h-[48px] sm:h-[40px] md:h-[48px] p-2 text-sm sm:text-base rounded-md border border-slate-500"
                    placeholder="Enter Member Principal Id"
                    value={memberName}
                    onChange={(e) => setMemberName(e.target.value)}
                  />
                  <button
                    onClick={handleAddMember}
                    className="w-full flex justify-center items-center sm:w-auto lg:w-[155px] h-[48px] sm:h-[40px] md:h-[48px]  bg-black text-white p-2 rounded-md"
                  >
                    {isAdding ? <div className="w-6 h-6 border-2 border-t-transparent border-white rounded-full animate-spin"></div> : "Add"}
                  </button>
                </div>
              ) : null}
            </section>
            {isLoading ? (
              skeletonLoader()
            ) : (councilUsernames.map((fullName, index) => {
              const [username, principalId] = fullName.split(" (");
              const formattedPrincipalId = principalId?.slice(0, -1);

              return (
                <section key={index} className="w-full bg-white py-2 p-2 md:px-8 flex flex-col items-center justify-between  mb-4">
                  <div className="w-full flex  items-center justify-between mb-2">
                    <div>
                      <p className="font-semibold mobile:text-base text-sm border-black">{username}</p>
                      <p className="text-sm">{formattedPrincipalId}</p>
                    </div>
                    <button onClick={() => handleRemoveMember('council', formattedPrincipalId)}>
                      <MdOutlineDeleteOutline className="text-red-500 mobile:text-2xl text-lg" />
                    </button>
                  </div>
                </section>
              );
            }))}

          </div>

          {/* Groups */}
          <div className="DAO__Step3__container w-full flex flex-col gap-2">
            {list.filter(group => group.name !== "Council").map((item, index) => (
              <div
                key={index}
                className={`flex flex-col bg-[#E9EAEA] rounded-lg ${addMemberIndex === item.index ? "" : "cursor-pointer transition"}`}
                onLoad={() => openMemberNames(item.index)}
                onClick={() => openMemberNames(item.index)}

              >
                <section className={`w-full py-2 mobile:px-8 p-2 pl-4 flex flex-row items-center justify-between border-b-2 border-[#b4b4b4] ${addMemberIndex === item.index ? "border-b-2 border-[#b4b4b4]" : "rounded-lg"}`}>
                  {groupNameInputIndex === item.index ? (
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
                        onDoubleClick={() => handleShowGroupNameInput(item.index)}
                      >
                        {item.name}
                      </p>
                      <button
                        onClick={() => handleEditGroup(item.index)}
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
                      onClick={() => handleMemberAdding(item.index)}
                      className="flex flex-row items-center gap-1 text-[#229ED9] bg-white mobile:p-1 p-1 rounded-md"
                    >
                      Add Member
                    </button>
                    <button onClick={() => deleteGroup(item.index)}>
                      <MdOutlineDeleteOutline className="text-red-500 mobile:text-2xl text-lg" />
                    </button>
                  </div>
                </section>
                {addMemberIndex === item.index && (
                  <section className="py-4 gap-2 flex flex-col items-start">
                    {showMemberNameInput ? (
                      <div className="flex flex-col sm:flex-row gap-2 px-8 items-center w-full">
                        <input
                          type="text"
                          className="w-full sm:w-auto md:w-[1500px] h-[48px] sm:h-[40px] md:h-[48px] p-2 text-sm sm:text-base rounded-md border border-slate-500"
                          placeholder="Enter Member Principal Id"
                          onChange={(e) => setMemberName(e.target.value)}

                        />
                        <button
                          onClick={handleAddMember}

                          className="w-full flex justify-center items-center sm:w-auto md:w-[100px] lg:w-[155px] h-[48px] sm:h-[40px] md:h-[48px]  bg-black text-white p-2 rounded-md"
                        >
                          {isAdding ? <div className="w-6 h-6 border-2 border-t-transparent border-white rounded-full animate-spin"></div> : "Add"}
                        </button>
                      </div>
                    ) : null}
                    {item.members.map((member, idx) => {
                      const username = memberUsernames[member] || "Loading...";
                      return (
                        <div key={idx} className="w-full bg-white py-2 p-2 md:px-8 flex flex-col items-center justify-between mb-4">
                          <div className="w-full flex flex-col mobile:items-start md:flex-row md:items-center justify-between mb-2">
                            <div>
                              <p className="font-semibold mobile:text-base text-sm">{username}</p>
                              <p className="text-sm mobile:mt-1 md:mt-0">{member}</p>
                            </div>
                            <button
                              onClick={() => handleRemoveMember(item.index, member)}
                              className="ml-auto"
                            >
                              <MdOutlineDeleteOutline className="text-red-500 text-xl sm:text-2xl md:text-2xl lg:text-2xl" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </section>
                )}
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
              className="flex mobile:m-4 my-4 w-[130px] h-[38px] flex-row items-center gap-2 bg-[#0E3746] px-4 py-2 rounded-[2rem] text-white mobile:text-base text-sm"
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