import React, { useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa6";
import { FaSquarePlus } from "react-icons/fa6";
import { MdOutlineDeleteOutline } from "react-icons/md";
import { FaArrowLeftLong, FaArrowRightLong } from "react-icons/fa6";
import { Principal } from "@dfinity/principal";
import CircularProgress from '@mui/material/CircularProgress';
import { toast } from "react-toastify";
import { useAuth} from "../../Components/utils/useAuthClient";
import Container from "../Container/Container";

const Step3 = ({ setData, setActiveStep, Step4Ref, Step1Ref }) => {

  const [count, setCount] = useState(1);
  const [showMemberNameInput, setShowMemberNameInput] = useState(true);
  const { backendActor, frontendCanisterId, identity, principal } = useAuth();
  const [loadingNext, setLoadingNext] = useState(false);
  // const [showCouncilNameInput, setShowCouncilNameInput] = useState(false);
  const [groupNameInputIndex, setGropuNameInputIndex] = useState(null);
  const [addMemberIndex, setAddMemberIndex] = useState(null);
  const [loadingBack, setLoadingBack] = useState(false);


  const [list, setList] = useState([
    { name: "Council", members: [] },
    // { name: "All", index: 0 },
  ]);


  console.log("delete council", list);
  const className = "DAO__Step3";
  function handleSaveAndNext() {
    setData((prev) => ({
      ...prev,
      step3: [...list],
    }));
    setActiveStep(3);




    // try {
    //   document.querySelector('.CreateDAO__steps').scrollTo({
    //     left: Step4Ref.current.offsetLeft - 50,
    //     behavior: "smooth",
    //   });
    // } catch (err) {
    //   console.log("The Scroll Error says: ", err.message);
    // }
    // setLoadingNext(false);
  }



  function handleBack() {
    setActiveStep(1);
  }
  // function handleBack() {
  //   setActiveStep(1);

  //   try {
  //     document.querySelector('.CreateDAO__steps').scrollTo({
  //       left: 0,
  //       behavior: "smooth",
  //     });
  //   } catch (err) {
  //     console.log("The Scroll Error says: ", err.message);
  //   }
  // }

  const handleGroupAdding = () => {
    const updateGroups = [
      ...list,
      { name: `Group ${count}`, index: count, members: [] },
      // { name: 'mem' },
    ];
    setCount(count + 1);
    setList(updateGroups);
  };
  const deleteGroup = (index) => {
    const updatedGroups = list.filter((item) => {
      return item.index !== index;
    });

    setList(updatedGroups);
    console.log(updatedGroups);
  };


  const handleMemberAdding1 = (name, event) => {
    const a = setShowCouncilNameInput(true);
    const updateGroups = [
      ...list,
      { name: `Group ${count}`, index: count, members: { a } },
    ];
    setCount(count + 1);
    setList(updateGroups);
    if (event.key === "Enter") {
      
      const updatedList = [...list]; // Create a copy of the list
      console.log("--upp--", updatedList)
      const councilIndex = updatedList.findIndex(
        (item) => item.name === "Council"
      );
      console.log("--index--", councilIndex)
      if (councilIndex !== -1) {
        // If "Council" object exists in the list
        updatedList[councilIndex].members = [
          ...updatedList[councilIndex].members,
          name,
        ];
        setList(updatedList);
        setShowCouncilNameInput(false);
      } else {
        toast.alert("Error", "Council group not found in the list");
      }
    }
  };
  const openMemberNames = (index) => {
    setAddMemberIndex(index);
  };

  

  const handleNameEnter = async (name, event) => {
    if ((event.key === "Enter") && (name.trim() !== "")) {
      console.log("sdfjksdhfkjsdhf")
      try {
        const principal = Principal.fromText(name.trim()); 
        console.log("qqqq",principal)
        const response = await backendActor.get_profile_by_id(principal); // Fetch profile by ID
        
        console.log("Profile Response:", response); // Log the response
        
        const updatedList = list.map((item) => {
          console.log("inside map member")
          
          if (item.index === addMemberIndex) {
            const principalId = principal.toText(); // Get the string representation of the Principal
  
            // Check if the Principal ID already exists in the members list
            if (!item.members.includes(principalId)) {
              return { ...item, members: [...item.members, principalId] };
            } else {
              toast.error("Principal ID already exists");
            }
          }
          return item;
        });
  
        setList(updatedList);
        setShowMemberNameInput(false);
        event.target.value = ''; // Clear the input field
  
      } catch (error) {
        toast.error("Invalid Principal ID or error fetching profile");
      }
    }
  };
  

  const handleCouncilMemAdding = () => {
    setShowCouncilNameInput(true);
  };


  // Function to add a new member to the Council group
  
  
  const handleCouncilMemberName = async (name, event) => {
    if (event.key === "Enter" && name.trim()) {
      try {
        const principal = Principal.fromText(name.trim());
        console.log("principal object", principal);
        const response = await backendActor.get_profile_by_id(principal);
        console.log("response", response);
  
        // Check if the user does not exist based on the response structure
        if (response.Err && response.Err === 'User does not exist') {
          toast.error("No user found");
        } else if (response.Ok) {
          toast.success("user exist")
          setList(prevList =>
            prevList.map(group => {
              if (group.name === "Council") {
                // Check if the name already exists in the members array
                if (!group.members.includes(name.trim())) {
                  return { ...group, members: [...group.members, name.trim()] };
                } else {
                  toast.error("Principal Id already exists");
                }
              }
              return group;
            })
          );
          setShowCouncilNameInput(false);
          event.target.value = '';
        } else {
          toast.error("Unexpected API response");
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
        toast.error("Failed to fetch profile");
      }
    }
  };
  
  

  const handleRemoveMember = (objIndex, memberName) => {
    const updatedList = list.map((item) => {
      if (item.index == objIndex && item.members.includes(memberName)) {
        return {
          ...item,
          members: item.members.filter((user) => user !== memberName),
        };
      }
      return item;
    });

    setList(updatedList);
  };

  // const handleShowGroupNameInput = (index) => {
  //   setGropuNameInputIndex(index);

  // };

  // const handleGroupNameInput = (groupName, event) => {
  //   if (event.key === "Enter") {
  //     const updatedList = list.map((item) => {
  //       if (item.index === groupNameInputIndex) {
  //         return {
  //           ...item,
  //           name: groupName,
  //         };
  //       }
  //       // Return the item
  //       return item;
  //     });

  //     setList(updatedList);
  //     setGropuNameInputIndex(null);
  //   }

  // };


  const [showCouncilNameInput, setShowCouncilNameInput] = useState(false);
  // const [memberName, setMemberName] = useState('');

  // const handleCouncilMemAdding = () => {
  //   setShowCouncilNameInput(true);
  // };

  // const handleCouncilMemberName = (name, e) => {
  //   if (e.key === 'Enter') {
  //     // Add member name logic here
  //     setShowCouncilNameInput(false);
  //   }
  // };


  // const councilMembers = list.find(item => item.name === "Council")?.members || [];


  // const [councilMembers, setCouncilMembers] = useState([]);

  // useEffect(() => {
  //   const members = list.find(item => item.name === "Council")?.members || [];

  //   try {
  //     // Convert members to Principal objects
  //     const principalsArray = members.map(member => Principal.fromText(member));
  //     setCouncilMembers(principalsArray);
  //     console.log("for backend array", principalsArray);
  //   } catch (error) {
  //     console.error("Error converting to Principal:", error);
  //   }
  // }, [list]);

  // const handleDeleteMember = (index) => {
  //   setCouncilMembers((prevMembers) => {
  //     const updatedMembers = prevMembers.filter((_, i) => i !== index);
  //     console.log("delete council", updatedMembers); 
  //     return updatedMembers;
  //   });
  // };
  // Function to delete a member from the Council group

 
  const handleDeleteMember = (indexToDelete) => {
    setList(prevList =>
      prevList.map(group =>
        group.name === "Council"
          ? {
            ...group,
            members: group.members.filter((_, index) => index !== indexToDelete)
          }
          : group
      )
    );
  };


  

    // console.log("council object",councilObject1)
   
  //   const councilMembers = list.find(group => group.name === "Council")?.members || [];
  //   councilMembers.forEach(function (element) {
  //     console.log(element,"sadhsa")
  //     Principal.fromText(element);
  //   });
       

  const councilMembers = list.find(group => group.name === "Council")?.members || [];
    

  useEffect(() => {
  console.log("Current council members:", councilMembers);
  }, [councilMembers]);

 
 


  return (
    <React.Fragment>
    <Container>
      <div
        className={
          className +
          "__form bg-[#F4F2EC] big_phone:p-10 small_phone:p-6 p-4 big_phone:mx-4 mx-0 rounded-lg flex flex-col gap-4"
        }
      >
        {/**Texts */}
        <div className="flex flex-row items-start justify-between">
          <section className="w-11/12 flex flex-col gap-y-2">
            <h2 className="font-semibold">Add Members</h2>
            <p className="big_phone:text-base mobile:text-sm text-xs">
              You can add members and assign them various roles as per your
              decisions and also Add members to your DAO for providing them
              specific roles in future
            </p>
          </section>

          {/**Button to add Groups 
          <button
            onClick={handleGroupAdding}
            className="bg-white w-10 h-10 m-2 text-lg flex items-center justify-center rounded-[50%]"
          >
            <FaPlus />
          </button>*/}
        </div>

        {/**Council */}
        <div className="bg-[#E9EAEA] rounded-lg">
          {
            <React.Fragment>
              <section className="w-full py-2 mobile:px-8 p-2 pl-4 flex flex-row items-center justify-between border-b-2 border-[#b4b4b4]">
                <h2 className="font-semibold mobile:text-base text-sm">Council</h2>

                {/** Council Add Member button */}
                <button
                  onClick={handleCouncilMemAdding}
                  className="flex flex-row items-center gap-1 text-[#229ED9] bg-white mobile:p-2 p-1 rounded-md"
                >
                  <AddMemberButton />
                </button>
              </section>

              {/** updateShow Council members or take input */}
              <section className="py-4 mobile:px-8 p-2 pl-4 transition">
                {showCouncilNameInput ? (
                  <input
                    type="text"
                    name="memberName"
                    className="mobile:p-2 p-1 mobile:text-base text-sm rounded-md border border-slate-500"
                    placeholder="Enter Member Name"
                    onKeyDown={(e) => handleCouncilMemberName(e.target.value, e)}
                    onBlur={(e) => {
                      if (!e.target.value) setShowCouncilNameInput(false);
                    }}
                  />
                ) : null}
              </section>
              {councilMembers.map((name, userIndex) => (
                <section key={userIndex} className="w-full py-2 p-2 pl-4 flex flex-col items-center justify-between bg-white mb-4">
                  <div className="w-full flex flex-row items-center justify-between mb-2">
                    <p className="font-semibold mobile:text-base text-sm pl-4 bg-white border-black">{name}</p>
                    <div className="flex flex-row small_phone:gap-4 gap-2">
                      <button onClick={() => handleDeleteMember(userIndex)}>
                        <MdOutlineDeleteOutline className="text-red-500 mobile:text-2xl text-lg" />
                      </button>
                    </div>
                  </div>
                </section>
              ))}

            </React.Fragment>

          }
        </div>

        {/**List of all Groups */}
        <div className={className + "__container w-full flex flex-col gap-2"}>
          {/**Removing the Council group and considering rest */}
          {list.slice(1).map((item, index) => (
            <div
              key={index}
              className={`flex flex-col bg-white rounded-lg ${addMemberIndex === item.index || item.name == "Allsss"
                ? ""
                : "cursor-pointer transition"
                }`}
              onClick={() => item.name !== "All" && openMemberNames(item.index)}
            >
              {/**The section that appears 
              <section
                key={index}
                className={`w-full py-2 p-2 pl-4 flex ${addMemberIndex === item.index
                  ? "border-b-2 border-[#b4b4b4]"
                  : "rounded-lg"
                  } items-center justify-between`}
              >
             
                {groupNameInputIndex == item.index ? (
                  <input
                    type="text"
                    name="groupNameEdit"
                    className="p-1 rounded-md border border-slate-500 text-sm"
                    placeholder="Group Name"
                    onKeyDown={(e) => handleGroupNameInput(e.target.value, e)}
                    onBlur={(e) => {
                      if (!e.target.value) setGropuNameInputIndex(null);
                    }}
                  />
                ) : (
                  <p
                    className="font-semibold py-1 cursor-pointer mobile:text-base text-sm"
                    onDoubleClick={() => handleShowGroupNameInput(item.index)}
                  >
                    {item.name}
                  </p>
                )}

                <div className={className + "__buttons flex flex-row small_phone:gap-4 gap-2"}>
            
                  {item.name !== "All" && (
                    <button
                      onClick={() => handleMemberAdding(item.index)}
                      className={`flex flex-row items-center gap-1 text-[#229ED9] bg-slate-200 mobile:p-2 p-1 rounded-md`}
                    >
                      <AddMemberButton />
                    </button>
                  )}

              
                  <button onClick={() => deleteGroup(item.index)}>
                    <MdOutlineDeleteOutline className="text-red-500 mobile:text-2xl text-lg" />
                  </button>
                </div>
              </section> */}

              {/**   The section that is hidden and open-ups with members names*/}
              {addMemberIndex === item.index && (
                <section className="p-4 gap-2 flex flex-col items-start">
                  {showMemberNameInput ? (
                    <input
                      type="text"
                      name="memberName"
                      className="mobile:p-2 p-1 mobile:text-base text-sm rounded-md border border-slate-500"
                      placeholder="Enter Member Name"
                      onKeyDown={(e) => handleNameEnter(e.target.value, e)}
                      onBlur={(e) => {
                        if (!e.target.value) setShowMemberNameInput(false);
                      }}
                    />
                  ) : item.members.length === 0 ? (
                    <p className="text-slate-500">No members added</p>
                  ) : (
                    item.members.map((memberName, userIndex) => (
                      <div
                        key={userIndex}
                        className="oneUser flex flex-row mobile:gap-8 gap-4 w-full items-center"
                      >
                        MemberName
                        <p className="text-slate-500 mobile:text-base text-sm mobile:w-[25%] w-[40%] whitespace-nowrap text-ellipsis overflow-hidden">
                          {memberName}
                        </p>

                        <button
                          onClick={() =>
                            handleRemoveMember(item.index, memberName)
                          }
                          className="border border-cyan-800 mobile:px-4 px-2 mobile:text-sm text-xs rounded-md text-cyan-800"
                        >
                          Remove
                        </button>
                      </div>
                    ))
                  )}
                </section>
              )}
            </div>
          ))}
        </div>
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

      </Container>
    </React.Fragment>
  );
};

export default Step3;

const AddMemberButton = () => {
  return (
    <React.Fragment>
      <FaSquarePlus className="text-[#229ED9] text-lg" />
      <p className="mobile:text-sm text-xs font-semibold">Add Members</p>
    </React.Fragment>
  );
};
