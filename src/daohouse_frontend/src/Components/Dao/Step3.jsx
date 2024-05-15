import React, { useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa6";
import { FaSquarePlus } from "react-icons/fa6";
import { MdOutlineDeleteOutline } from "react-icons/md";
import { FaArrowLeftLong, FaArrowRightLong } from "react-icons/fa6";

const Step3 = ({ setData, setActiveStep }) => {
  const [count, setCount] = useState(1);
  const [showMemberNameInput, setShowMemberNameInput] = useState(false);
  const [showCouncilNameInput, setShowCouncilNameInput] = useState(false);
  const [groupNameInputIndex, setGropuNameInputIndex] = useState(null);
  const [addMemberIndex, setAddMemberIndex] = useState(null);

  const [list, setList] = useState([
    { name: "Council", members: ["nzbdchsvvksckshcbkjscb kc"] },
    { name: "All", index: 0 },
  ]);

  const className = "DAO__Step3";

  function handleSaveAndNext() {
    setData((prev) => ({
      ...prev,
      step3: [...list],
    }));

    setActiveStep(3);
  }

  const handleGroupAdding = () => {
    const updateGroups = [
      ...list,
      { name: `Group ${count}`, index: count, members: [] },
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

  const handleMemberAdding = () => {
    setShowMemberNameInput(true);
  };

  const openMemberNames = (index) => {
    setAddMemberIndex(index);
  };

  const handleNameEnter = (name, event) => {
    if ((event.key === "Enter") & (name !== "")) {
      const updatedList = list.map((item) => {
        if (item.index === addMemberIndex) {
          return { ...item, members: [...item.members, name] };
        }
        return item;
      });
      setList(updatedList);
      setShowMemberNameInput(false);
    }
  };

  const handleCouncilMemAdding = () => {
    setShowCouncilNameInput(true);
  };

  const handleCouncilMemberName = (name, event) => {
    if (event.key === "Enter") {
      const updatedList = [...list]; // Create a copy of the list
      const councilIndex = updatedList.findIndex(
        (item) => item.name === "Council"
      );

      if (councilIndex !== -1) {
        // If "Council" object exists in the list
        updatedList[councilIndex].members = [
          ...updatedList[councilIndex].members,
          name,
        ];
        setList(updatedList);
        setShowCouncilNameInput(false);
      } else {
        Alert.alert("Error", "Council group not found in the list");
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

  const handleShowGroupNameInput = (index) => {
    setGropuNameInputIndex(index);
  };

  const handleGroupNameInput = (groupName, event) => {
    if (event.key === "Enter") {
      const updatedList = list.map((item) => {
        if (item.index === groupNameInputIndex) {
          return {
            ...item,
            name: groupName,
          };
        }
        // Return the item
        return item;
      });

      setList(updatedList);
      setGropuNameInputIndex(null);
    }
  };

  return (
    <React.Fragment>
      <div
        className={
          className +
          "__form bg-[#F4F2EC] p-10 mx-4 rounded-lg flex flex-col gap-4"
        }
      >
        {/**Texts */}
        <div className="flex flex-row items-start justify-between">
          <section className="w-11/12">
            <h2 className="font-semibold">Add Groups & Members</h2>
            <p>
              You can add members and assign them various roles as per your
              decisions and also Add members to your DAO for providing them
              specific roles in future
            </p>
          </section>

          {/**Button to add Groups */}
          <button
            onClick={handleGroupAdding}
            className="bg-white w-10 h-10 text-lg flex items-center justify-center rounded-[50%]"
          >
            <FaPlus />
          </button>
        </div>

        {/**Council */}
        <div className="bg-[#E9EAEA] rounded-lg">
          {
            <React.Fragment>
              <section className="w-full py-2 px-8 flex flex-row items-center justify-between border-b-2 border-[#b4b4b4]">
                <h2 className="font-semibold">Council</h2>

                {/**Council Add Member button */}
                <button
                  onClick={handleCouncilMemAdding}
                  className="flex flex-row items-center gap-1 text-[#229ED9] bg-white p-2 rounded-md"
                >
                  <AddMemberButton />
                </button>
              </section>

              {/**Show Council members or take input */}
              <section className="py-4 px-8 transition">
                {showCouncilNameInput ? (
                  <input
                    type="text"
                    name="memberName"
                    className="p-2 rounded-md border border-slate-500"
                    placeholder="Enter Member Name"
                    onKeyDown={(e) =>
                      handleCouncilMemberName(e.target.value, e)
                    }
                    onBlur={(e) => {
                      if (!e.target.value) setShowCouncilNameInput(false);
                    }}
                  />
                ) : (
                  list
                    .find((item) => item.name === "Council")
                    .members.map((name, userIndex) => (
                      <p key={userIndex}>{name}</p>
                    ))
                )}
              </section>
            </React.Fragment>
          }
        </div>

        {/**List of all Groups */}
        <div className={className + "__container w-full"}>
          {/**Removing the Council group and considering rest */}
          {list.slice(1).map((item, index) => (
            <div
              key={index}
              className={`flex flex-col my-2 bg-white rounded-lg ${addMemberIndex === item.index || item.name == "All"
                ? ""
                : "cursor-pointer transition"
                }`}
              onClick={() => item.name !== "All" && openMemberNames(item.index)}
            >
              {/**The section that appears */}
              <section
                key={index}
                className={`w-full py-2 px-8 flex ${addMemberIndex === item.index
                  ? "border-b-2 border-[#b4b4b4]"
                  : "rounded-lg"
                  } items-center justify-between`}
              >
                {/**Group Name */}
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
                    className="font-semibold py-1 cursor-pointer"
                    onDoubleClick={() => handleShowGroupNameInput(item.index)}
                  >
                    {item.name}
                  </p>
                )}

                <div className={className + "__buttons flex flex-row gap-4"}>
                  {/**Add member button...All group can't add members in it */}
                  {item.name !== "All" && (
                    <button
                      onClick={() => handleMemberAdding(item.index)}
                      className={`flex flex-row items-center gap-1 text-[#229ED9] bg-slate-200
                          p-2 rounded-md`}
                    >
                      <AddMemberButton />
                    </button>
                  )}

                  {/**Delete the Group */}
                  <button onClick={() => deleteGroup(item.index)}>
                    <MdOutlineDeleteOutline className="text-red-500 text-2xl" />
                  </button>
                </div>
              </section>

              {/**The section that is hidden and open-ups with members names */}
              {addMemberIndex === item.index && (
                <section className="py-4 px-8 gap-2 flex flex-col items-start">
                  {showMemberNameInput ? (
                    <input
                      type="text"
                      name="memberName"
                      className="p-2 rounded-md border border-slate-500"
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
                        className="oneUser flex flex-row gap-8 w-full items-center"
                      >
                        {/**MemberName */}
                        <p className="text-slate-500 text-base w-[25%] whitespace-nowrap text-ellipsis overflow-hidden">
                          {memberName}
                        </p>

                        <button
                          onClick={() =>
                            handleRemoveMember(item.index, memberName)
                          }
                          className="border border-cyan-800 px-4 text-sm rounded-md text-cyan-800"
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
          "__submitButton w-full flex flex-row items-center justify-end"
        }
      >
        <button
          onClick={() => setActiveStep(1)}
          className="flex m-4 flex-row items-center gap-2 border border-[#0E3746] hover:bg-[#0E3746] text-[#0E3746] hover:text-white transition px-4 py-2 rounded-[2rem]"
        >
          <FaArrowLeftLong /> Back
        </button>
        <button
          type="submit"
          onClick={handleSaveAndNext}
          className="flex m-4 flex-row items-center gap-2 bg-[#0E3746] px-4 py-2 rounded-[2rem] text-white"
        >
          Save & Next <FaArrowRightLong />
        </button>
      </div>
    </React.Fragment>
  );
};

export default Step3;

const AddMemberButton = () => {
  return (
    <React.Fragment>
      <FaSquarePlus className="text-[#229ED9] text-lg" />
      <p className="text-sm font-semibold">Add Members</p>
    </React.Fragment>
  );
};
