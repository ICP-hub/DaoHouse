import React, { useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa6";
import { MdOutlineDeleteOutline } from "react-icons/md";
import { FaArrowLeftLong, FaArrowRightLong } from "react-icons/fa6";
import { Principal } from "@dfinity/principal";
import { toast } from "react-toastify";
import { useAuth } from "../../Components/utils/useAuthClient";
import Container from "../Container/Container";

const Step3 = ({ setData, setActiveStep, Step4Ref, Step1Ref, data }) => {
  const [count, setCount] = useState(1);
  const [showMemberNameInput, setShowMemberNameInput] = useState(false);
  const [addMemberIndex, setAddMemberIndex] = useState(null);
  const [groupNameInputIndex, setGroupNameInputIndex] = useState(null);
  const [memberName, setMemberName] = useState("");
  const { backendActor } = useAuth();

  const [list, setList] = useState([
    { name: "Council", members: [] },
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
        setData(prev => ({
            ...prev,
            step3: {
                groups: list.slice(1) || [],  // Default to empty array if list is undefined
                council: council.members || [],
                members: uniqueMembers || []  // Default to empty array if uniqueMembers is undefined
            },
        }));
        setActiveStep(3);
    };
    


  function handleBack() {
    setActiveStep(1);
  }


  const handleGroupAdding = () => {
    setList(prevList => [
      ...prevList,
      { name: `Group ${count}`, index: count, members: [] },
    ]);
    setCount(prevCount => prevCount + 1);
  };

  const deleteGroup = (index) => {
    setList(prevList => prevList.filter(item => item.index !== index));
  };

  // const handleMemberAdding = (index) => {
  //   setAddMemberIndex(index);
  //   setShowMemberNameInput(true);
  // };

  // const handleNameEnter = async (name, event) => {
  //   if (event.key === "Enter" && name.trim() !== "") {
  //     try {
  //       const principal = Principal.fromText(name.trim());
  //       const response = await backendActor.get_profile_by_id(principal);

  //       if (response.Ok) {
  //         setList(prevList =>
  //           prevList.map(item => {
  //             if (item.index === addMemberIndex) {
  //               const principalId = principal.toText();
  //               if (!item.members.includes(principalId)) {
  //                 return { ...item, members: [...item.members, principalId] };
  //               } else {
  //                 toast.error("Principal ID already exists");
  //               }
  //             }
  //             return item;
  //           })
  //         );
  //         setShowMemberNameInput(false);
  //       } else {
  //         toast.error("User does not exist");
  //       }
  //     } catch (error) {
  //       toast.error("Invalid Principal ID or error fetching profile");
  //     }
  //   }
  // };

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
      try {
        const principal = Principal.fromText(memberName.trim());
        const response = await backendActor.get_profile_by_id(principal);

        if (response.Ok) {
          setList((prevList) =>
            prevList.map((item) => {
              if (item.index === addMemberIndex || (addMemberIndex === "council" && item.name === "Council")) {
                const principalId = principal.toText();
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
      }
    }
  };
  

  // const handleRemoveMember = (groupIndex, memberName) => {
  //   setList(prevList =>
  //     prevList.map(item => {
  //       if (item.index === groupIndex && item.members.includes(memberName)) {
  //         return {
  //           ...item,
  //           members: item.members.filter(user => user !== memberName),
  //         };
  //       }
  //       return item;
  //     })
  //   );
  // };

  const handleRemoveMember = (groupIndex, memberName) => {
    setList(prevList =>
      prevList.map(item => {
        if (
          (item.index === groupIndex || (groupIndex === 'council' && item.name === "Council")) &&
          item.members.includes(memberName)
        ) {
          return {
            ...item,
            members: item.members.filter(user => user !== memberName),
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
    if (event.key === "Enter") {
      setList(prevList =>
        prevList.map(item => {
          if (item.index === groupNameInputIndex) {
            return { ...item, name: groupName };
          }
          return item;
        })
      );
      setGroupNameInputIndex(null);
    }
  };

  const councilMembers = list.find(group => group.name === "Council")?.members || [];

  // useEffect(() => {
  //   console.log("Current council members:", councilMembers);
  // }, [councilMembers]);
  useEffect(() => {
 

    // const savedData = localStorage.getItem('step3Data');
    // if (savedData) {
    //   setList(JSON.parse(savedData));
    // }


    console.log("Current council members:", councilMembers);
  }, [councilMembers]);


  return (
    <React.Fragment>
      <Container>
        <div className="DAO__Step3__form bg-[#F4F2EC] big_phone:p-10 small_phone:p-6 p-4 big_phone:mx-4 mx-0 rounded-lg flex flex-col gap-4">
          <div className="flex flex-row items-start justify-between">
            <section className="w-11/12 flex flex-col gap-y-2">
              <h2 className="font-semibold">Add Members</h2>
              <p className="big_phone:text-base mobile:text-sm text-xs">
                You can add members and assign them various roles as per your decisions and also add members to your DAO for providing them specific roles in the future.
              </p>
            </section>
            <button
              onClick={handleGroupAdding}
              className="bg-white w-10 h-10 m-2 text-lg flex items-center justify-center rounded-[50%]"
            >
              <FaPlus />
            </button>
          </div>

          {/* Council */}
          {/* <div className="bg-[#E9EAEA] rounded-lg">
            <section className="w-full py-2 mobile:px-8 p-2 pl-4 flex flex-row items-center justify-between border-b-2 border-[#b4b4b4]">
              <h2 className="font-semibold mobile:text-base text-sm">Council</h2>
              <button
                onClick={() => handleMemberAdding(null)}
                className="flex flex-row items-center gap-1 text-[#229ED9] bg-white mobile:p-2 p-1 rounded-md"
              >
                Add Member
              </button>
            </section>
            <section className="py-4 mobile:px-8 p-2 pl-4 transition">
              {showMemberNameInput && addMemberIndex === null ? (
                <input
                  type="text"
                  className="mobile:p-2 p-1 mobile:text-base text-sm rounded-md border border-slate-500"
                  placeholder="Enter Member Name"
                  onKeyDown={(e) => handleNameEnter(e.target.value, e)}
                />
              ) : null}
            </section>
            {councilMembers.map((name, index) => (
              <section key={index} className="w-full py-2 p-2 pl-4 flex flex-col items-center justify-between bg-white mb-4">
                <div className="w-full flex flex-row items-center justify-between mb-2">
                  <p className="font-semibold mobile:text-base text-sm pl-4 bg-white border-black">{name}</p>
                  <button onClick={() => handleRemoveMember(null, name)}>
                    <MdOutlineDeleteOutline className="text-red-500 mobile:text-2xl text-lg" />
                  </button>
                </div>
              </section>
            ))}
          </div> */}

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
  <section className="py-4 mobile:px-8 p-2 pl-4 transition">
    {showMemberNameInput && addMemberIndex === 'council' ? (
      <div className="flex flex-row gap-2 items-center">
      <input
        type="text"
        className="mobile:p-2 p-1 mobile:text-base text-sm rounded-md border border-slate-500"
        placeholder="Enter Member Principal Id"
        value={memberName}
        onChange={(e) => setMemberName(e.target.value)}
      />
      <button
        onClick={handleAddMember}
        className="bg-[#229ED9] text-white p-2 rounded-md"
      >
        Add
      </button>
    </div>
    ) : null}
  </section>
  {councilMembers.map((name, index) => (
    <section key={index} className="w-full py-2 p-2 pl-4 flex flex-col items-center justify-between bg-white mb-4">
      <div className="w-full flex flex-row items-center justify-between mb-2">
        <p className="font-semibold mobile:text-base text-sm pl-4 bg-white border-black">{name}</p>
        <button onClick={() => handleRemoveMember('council', name)}>
          <MdOutlineDeleteOutline className="text-red-500 mobile:text-2xl text-lg" />
        </button>
      </div>
    </section>
  ))}
</div>


            {/* Groups */}
          <div className="DAO__Step3__container w-full flex flex-col gap-2">
            {list.slice(1).map((item, index) => (
              <div
                key={index}
                className={`flex flex-col bg-white rounded-lg ${addMemberIndex === item.index ? "" : "cursor-pointer transition"}`}
                onClick={() => openMemberNames(item.index)}
              >
                <section className={`w-full py-2 p-2 pl-4 flex ${addMemberIndex === item.index ? "border-b-2 border-[#b4b4b4]" : "rounded-lg"} items-center justify-between`}>
                  {groupNameInputIndex === item.index ? (
                    <input
                      type="text"
                      className="p-1 rounded-md border border-slate-500 text-sm"
                      placeholder="Group Name"
                      onKeyDown={(e) => handleGroupNameInput(e.target.value, e)}
                    />
                  ) : (
                    <p
                      className="font-semibold py-1 cursor-pointer mobile:text-base text-sm"
                      onDoubleClick={() => handleShowGroupNameInput(item.index)}
                    >
                      {item.name}
                    </p>
                  )}
                  <div className="flex flex-row small_phone:gap-4 gap-2">
                    <button
                      onClick={() => handleMemberAdding(item.index)}
                      className="flex flex-row items-center gap-1 text-[#229ED9] bg-slate-200 mobile:p-2 p-1 rounded-md"
                    >
                      Add Member
                    </button>
                    <button onClick={() => deleteGroup(item.index)}>
                      <MdOutlineDeleteOutline className="text-red-500 mobile:text-2xl text-lg" />
                    </button>
                  </div>
                </section>
                {addMemberIndex === item.index && (
                  <section className="p-4 gap-2 flex flex-col items-start">
                    {showMemberNameInput ? (
                      <div className="flex flex-row gap-2 items-center">
                        <input
                          type="text"
                          className="mobile:p-2 p-1 mobile:text-base text-sm rounded-md border border-slate-500"
                          placeholder="Enter Member Principal Id"
                          onChange={(e) => setMemberName(e.target.value)}
                          // onKeyDown={(e) => handleNameEnter(e.target.value, e)}
                        />
                        <button
                          onClick={handleAddMember}
                          className="bg-[#229ED9] text-white p-2 rounded-md"
                        >
                          Add
                        </button>
                      </div>
                    ) : null}
                    {item.members.map((memberName, memberIndex) => (
                      <div key={memberIndex} className="w-full flex flex-row items-center justify-between">
                        <p className="font-semibold text-sm">{memberName}</p>
                        <button onClick={() => handleRemoveMember(item.index, memberName)}>
                          <MdOutlineDeleteOutline className="text-red-500 mobile:text-2xl text-lg" />
                        </button>
                      </div>
                    ))}
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





