import React, { useEffect, useState } from "react";
// import { FaPlus } from "react-icons/fa6";
import { HiPlus } from "react-icons/hi";
import { MdOutlineDeleteOutline } from "react-icons/md";
import { FaArrowLeftLong, FaArrowRightLong } from "react-icons/fa6";
import { Principal } from "@dfinity/principal";
import { toast } from "react-toastify";
import { useAuth } from "../../Components/utils/useAuthClient";
import Container from "../Container/Container";
import EditPen from "../../../assets/edit_pen.png";
import { RiGroupFill } from "react-icons/ri";
import { CircularProgress } from "@mui/material";

const Step3 = ({ setData, setActiveStep, Step4Ref, Step1Ref, data }) => {
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
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false)

  const [list, setList] = useState([
    { name: "Council", index:0, members: [] },
  ]);

  const className = "DAO__Step3";

  useEffect(() => {
    // Retrieve data from local storage
    const savedData = localStorage.getItem('step3Data');
    if (savedData) {
      setList(JSON.parse(savedData));
    }
  }, []);

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

    console.log(Array.from(allMembers));
    // Convert Set to array
    return Array.from(allMembers);
  };

  const handleSaveAndNext = () => {
    // Validation: Ensure at least one member in Council
    const council = list.find(group => group.name === "Council");
    if (!council || council.members.length === 0) {
      toast.error("Please add at least one member to the Council.");
      return;
    }
    // Validation: Ensure all groups have at least one member
    const invalidGroup = list.slice(1).find(group => group.members.length === 0);
    if (invalidGroup) {
      toast.error(`Please add at least one member to ${invalidGroup.name}.`);
      return;
    }

    // Save data to local storage
    localStorage.setItem('step3Data', JSON.stringify(list));

    // Set data and move to the next step
    const uniqueMembers = getUniqueMembers();
    console.log("Council--", council.members);

    setData(prev => ({
      ...prev,
      step3: {
        groups: list.slice(1) || [],  // Default to empty array if list is undefined
        council: council.members || [],
        members: getUniqueMembers || []  // Default to empty array if uniqueMembers is undefined
      },
    }));
    setActiveStep(3);
  };

  function handleBack() {
    setActiveStep(1);
  }
  
  const handleGroupAdding = () => {
    let newGroupIndex = count;
  
    // Get the current list to check the existing indices
    setList(prevList => {
      const existingIndices = prevList.map(group => group.index);
  
      // Find the first missing index in the range from 1 to the current count
      for (let i = 1; i <= count; i++) {
        if (!existingIndices.includes(i)) {
          newGroupIndex = i;
          break;
        }
      }
  
      // If no missing index was found, set the new index to the current count
      if (!newGroupIndex) {
        newGroupIndex = count;
      }
  
      // Return the updated list with the new group
      return [
        ...prevList,
        { name: `Group ${newGroupIndex}`, index: newGroupIndex, members: [] },
      ];
    });
  
    // Automatically open the member input field for the new group
    setAddMemberIndex(newGroupIndex);
    setShowMemberNameInput(true);
  
    // Only increment count if no missing index was found
    setCount(prevCount => (newGroupIndex === count ? prevCount + 1 : prevCount));
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
          const username = response.Ok.username; // Get username from the response
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
      let updated = false; // Track if we need to update state
      const newUsernames = { ...memberUsernames };
  
      // Iterate through each group and its members
      for (const group of groups) {
        for (const member of group.members) {
          if (!newUsernames[member]) { // Only fetch if not already fetched
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
    setList(prevList => 
      prevList.map(item => {
        if (
          (item.index === groupIndex || (groupIndex === 'council' && item.name === "Council")) &&
          item.members.includes(memberPrincipalId)
        ) {
          const updatedMembers = item.members.filter(user => user !== memberPrincipalId);
          
          // Update the councilUsernames state
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
    // if (event.key === "Enter") {
      setList(prevList =>
        prevList.map(item => {
          if (item.index === groupNameInputIndex) {
            return { ...item, name: groupName };
          }
          return item;
        })
      );
      setGroupNameInputIndex(null);
    // }
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
    setUpdatedGroupName(""); // Clear the input state
  };
        
      const getUsernameByPrincipalId = async (principalId) => {
        console.log("3", principalId);
        
        try {
            const response = await backendActor.get_profile_by_id(Principal.fromText(principalId));
            console.log("4", response);
            
            setUsername(response.Ok.username)
            // return response.Ok ? response.Ok.username : "Unknown User"; // Fallback in case user not found
        } catch {
            return "Error fetching username"; // Handle errors accordingly
        }

      }


  const councilMembers = list.find(group => group.name === "Council")?.members || [];
  useEffect(() => {
    const fetchCouncilUsernames = async () => {
      const fetchedUsernames = [];
      for (const member of councilMembers) {
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
        }
      }
      setCouncilUsernames(fetchedUsernames);
      setIsLoading(false);
    };
    
    // Only fetch if councilMembers are present
    if (councilMembers.length > 0) {
      fetchCouncilUsernames();
    }
  }, [councilMembers, backendActor]);
  

  // useEffect(() => {
  //   console.log("Current council members:", councilMembers);
  // }, [councilMembers]);
  useEffect(() => {
    // Retrieve saved list from localStorage if available
    const savedList = localStorage.getItem('step3Data');
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
  
      // Save the updated list to localStorage
      localStorage.setItem('step3Data', JSON.stringify(updatedList));
    } else {
      // If no update was needed, ensure the list state is still set
      setList(initialList);
    }
  
    console.log("Current council members:", council?.members || []);
  }, [stringPrincipal]);  // Only rerun if stringPrincipal changes
  
  const handleEditGroup = (index) => {
    setGroupNameInputIndex(index);
    const groupName = list.find(item => item.index === index)?.name || "";
    setUpdatedGroupName(groupName); // Set the current name to the input state
  };

  const skeletonLoader = () => {
    return (
      <div className="w-full flex bg-gray-100 py-4 px-8 flex-col mobile:items-start md:flex-row md:items-center justify-between mb-2 animate-pulse">
        {/* Simulated Username */}
        <p className="font-semibold mobile:text-base text-sm bg-gray-300 h-6 w-1/6 rounded-md"></p>
        {/* Simulated Principal ID */}
        <p className="text-sm bg-gray-300 h-6 w-1/3 rounded-md"></p>
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
            {/* <button
              onClick={handleGroupAdding}
              className="bg-white w-10 h-10 m-2 text-lg flex items-center justify-center rounded-[50%]"
            >
              <FaPlus />
            </button> */}

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
              skeletonLoader() // Show skeleton loader while data is being fetched
            ) : (councilUsernames.map((fullName, index) => {
              const [username, principalId] = fullName.split(" ("); // Split the string to separate username and principal ID
              const formattedPrincipalId = principalId.slice(0, -1); // Remove the closing parenthesis

              return (
                <section key={index} className="w-full bg-white py-2 p-2 md:px-8 flex flex-col items-center justify-between  mb-4">
                  <div className="w-full flex flex-col mobile:items-start md:flex-row md:items-center justify-between mb-2">
                    <p className="font-semibold mobile:text-base text-sm border-black">{username}</p>
                    <p className="text-sm">{formattedPrincipalId}</p> {/* Display Principal ID on the right */}
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
                    // <p
                    //   className="font-semibold py-1 cursor-pointer mobile:text-base text-sm"
                    //   onDoubleClick={() => handleShowGroupNameInput(item.index)}
                    // >
                    //   {item.name}
                    // </p>
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
                          // className="mobile:p-2 p-1 mobile:text-base text-sm rounded-md border border-slate-500"
                          className="w-full sm:w-auto md:w-[1500px] h-[48px] sm:h-[40px] md:h-[48px] p-2 text-sm sm:text-base rounded-md border border-slate-500"
                          placeholder="Enter Member Principal Id"
                          onChange={(e) => setMemberName(e.target.value)}
                        // onKeyDown={(e) => handleNameEnter(e.target.value, e)}
                        />
                        <button
                          onClick={handleAddMember}
                          // className="bg-[#229ED9] text-white p-2 rounded-md"
                          className="w-full flex justify-center items-center sm:w-auto md:w-[100px] lg:w-[155px] h-[48px] sm:h-[40px] md:h-[48px]  bg-black text-white p-2 rounded-md"
                        >
                          {isAdding ? <div className="w-6 h-6 border-2 border-t-transparent border-white rounded-full animate-spin"></div> : "Add"}
                        </button>
                      </div>
                    ) : null}
                    {item.members.map((member, idx) => {
                      const username = memberUsernames[member] || "Loading..."; // Fallback to Principal ID if username not available
                      return (
                        <div key={idx} className="w-full bg-white py-2 p-2 md:px-8 flex flex-col items-center justify-between mb-4">
                          <div className="w-full flex flex-col mobile:items-start md:flex-row md:items-center justify-between mb-2">
                            <p className="font-semibold mobile:text-base text-sm">{username}</p>
                            <p className="text-sm mobile:mt-1 md:mt-0">{member}</p>
                            <button onClick={() => handleRemoveMember(item.index, member)}>
                              <MdOutlineDeleteOutline className="text-red-500 mobile:text-2xl text-lg" />
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