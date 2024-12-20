import React, { useState, useEffect } from "react";
import "./Step4.scss";
import { FaArrowLeftLong, FaArrowRightLong } from "react-icons/fa6";
import { getTruePermissions } from "./Getpermission";
import Container from "../Container/Container";
import { Principal } from "@dfinity/principal";
import { FaInfoCircle } from "react-icons/fa";

const Step4 = ({ data, setData, setActiveStep }) => {
  const [activeStage, setActiveStage] = useState(0);
  const [groups, setGroups] = useState(() => {
    const groupsList = data.step3.groups.map((group) => group.name);
    if (data.step3.council && !groupsList.includes("Council")) {
      groupsList.unshift("Council");
    }
    return groupsList;
  });

  const [isPrivate, setIsPrivate] = useState(() => {
    const savedToggleState = localStorage.getItem("isPrivate");
    return savedToggleState !== null ? JSON.parse(savedToggleState) : true;
  });
  const [showModal, setShowModal] = useState(false);


  const className = "DAO__Step4";

  const modalMessage = isPrivate
    ? "This action will make the DAO public, allowing anyone to join without creating a proposal. Are you sure you want to make it public?"
    : "This action will make the DAO private. A proposal will be created for users to join.";


  useEffect(() => {
    const updatedGroups = data.step3.groups.map((group) => group.name);
    if (data.step3.council && !updatedGroups.includes("Council")) {
      updatedGroups.unshift("Council");
    }
    setGroups(updatedGroups);

    setInputData((prevData) => {
      const updatedInputData = { ...prevData };

      updatedGroups.forEach((group) => {
        if (!updatedInputData.proposal[group]) {
          updatedInputData.proposal[group] = defaultPermissions(group);
        }
        if (!updatedInputData.voting[group]) {
          updatedInputData.voting[group] = defaultPermissions(group);
        }
      });

      Object.keys(updatedInputData.proposal).forEach((group) => {
        if (!updatedGroups.includes(group)) {
          delete updatedInputData.proposal[group];
          delete updatedInputData.voting[group];
        }
      });

      return updatedInputData;
    });
  }, [data.step3.groups, data.step3.council]);

  const defaultPermissions = (groupName) => ({
    RemoveMemberToDaoProposal: groupName === "Council" ? true : false,
    ChangeDaoConfig: groupName === "Council" ? true : false,
    BountyDone: groupName === "Council" ? true : false,
    Polls: groupName === "Council" ? true : false,
    ChangeDaoPolicy: groupName === "Council" ? true : false,
    TokenTransfer: groupName === "Council" ? true : false,
    AddMemberToDaoProposal: groupName === "Council" ? true : false,
    RemoveMemberToGroupProposal: groupName === "Council" ? true : false,
    ChangeGroupPermissions: groupName === "Council" ? true : false,
    BountyRaised: groupName === "Council" ? true : false,
    AddMemberToGroupProposal: groupName === "Council" ? true : false,
    GeneralPurpose: groupName === "Council" ? true : false,
    MintNewTokens: groupName === "Council" ? true : false,

  });

  const permissionList = [
    "RemoveMemberToDaoProposal",
    "ChangeDaoConfig",
    "BountyDone",
    "Polls",
    "ChangeDaoPolicy",
    "TokenTransfer",
    "AddMemberToDaoProposal",
    "RemoveMemberToGroupProposal",
    "ChangeGroupPermissions",
    "BountyRaised",
    "AddMemberToGroupProposal",
    "GeneralPurpose",
    "MintNewTokens",
  ];

  const initializePermissions = () => {
    const permissions = {};
    groups.forEach((group) => {
      permissions[group] = defaultPermissions(group);
    });
    return permissions;
  };

  const [inputData, setInputData] = useState(() => {
    const savedData = localStorage.getItem("inputData");
    return savedData
      ? JSON.parse(savedData)
      : {
        proposal: initializePermissions(),
        voting: initializePermissions(),
      };
  });

  function toggleCheckbox(step, groupName, permissionName) {
    const updatedInputData = {
      ...inputData,
      [step]: {
        ...inputData[step],
        [groupName]: {
          ...inputData[step][groupName],
          [permissionName]: !inputData[step][groupName][permissionName],
        },
      },
    };

    if (groupName === "Council") {
      const otherStep = step === "proposal" ? "voting" : "proposal";
      updatedInputData[otherStep][groupName][permissionName] =
        updatedInputData[step][groupName][permissionName];
    }

    setInputData(updatedInputData);
  }

  function filterPermissions(data) {
    const result = { proposal: {}, voting: {} };

    for (const step of ["proposal", "voting"]) {
      for (const groupName of Object.keys(data[step])) {
        const filteredPermissions = Object.keys(data[step][groupName]).filter(
          (key) => data[step][groupName][key]
        );
        result[step][groupName] = filteredPermissions;
      }
    }

    return result;
  }

  function handleSaveAndNext() {
    const filteredPermissions = filterPermissions(inputData);


    const formatPermission = (permission) => ({ [permission]: null });

    const daoGroups = data.step3.groups.map((group) => ({
      group_members: group.members.map((member) =>
        Principal.fromText(member)
      ),
      quorem: 5,
      group_name: group.name,
      group_permissions: (filteredPermissions.proposal[group.name] || []).map(formatPermission),
    }));

    const membersPermissions = new Set();


    Object.values(filteredPermissions.proposal).forEach((permissions) =>
      permissions.forEach((permission) => membersPermissions.add(formatPermission(permission)))
    );


    const membersPermissionsArray = Array.from(membersPermissions);


    setData((prev) => ({
      ...prev,
      step4: filteredPermissions,
      dao_groups: daoGroups,
      members_permissions: membersPermissionsArray,
      ask_to_join_dao: isPrivate,
    }));


    setActiveStep(4);
  }

  const confirmMakePrivate = () => {
    setIsPrivate(!isPrivate);
    setShowModal(false);

    window.scrollTo({
      top: document.body.scrollHeight,
      behavior: 'smooth',
    });
  };

  const cancelMakePrivate = () => {
    setShowModal(false);


    window.scrollTo({
      top: document.body.scrollHeight,
      behavior: 'smooth',
    });
  };

  function handleBack() {
    setActiveStep(2);
  }

  useEffect(() => {
    if (showModal) {
      document.body.classList.add('overflow-hidden');
    } else {
      document.body.classList.remove('overflow-hidden');
    }

    return () => {
      document.body.classList.remove('overflow-hidden');
    };
  }, [showModal]);

  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      body.overflow-hidden {
        overflow: hidden;
        position: fixed;
        width: 100%;
        height: 100%;
      }
    `;
    document.head.append(style);
    return () => style.remove();
  }, []);


  useEffect(() => {
    localStorage.setItem("activeStage", JSON.stringify(activeStage));
  }, [activeStage]);

  useEffect(() => {
    localStorage.setItem("inputData", JSON.stringify(inputData));
  }, [inputData]);

  useEffect(() => {
    localStorage.setItem("isPrivate", JSON.stringify(isPrivate));
  }, [isPrivate]);

  const truePermissions = getTruePermissions(inputData);



  return (
    <React.Fragment>
      <Container>
        <div
          className={`${className}__form w-full bg-[#F4F2EC] big_phone:p-10 small_phone:p-4 p-2 big_phone:mx-4 mx-0 rounded-lg flex flex-col gap-4`}
        >



          {/* Modal for Confirmation */}
          {showModal && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 px-4">
              <div className="w-full max-w-lg bg-white  rounded-lg shadow-lg w-11/12 md:w-1/3 p-6  border border-gray-300 p-4 rounded shadow flex flex-col justify-between h-auto sm:w-[400px] md:w-[45%] lg:w-[30%]">
                <div>
                  <h2 className="font-bold text-center  font-mulish text-[18px] mb-2">Privacy Confirmation</h2>
                </div>
                <p className="text-center mb-4 ">
                  {modalMessage}
                </p>
                <div className="flex flex-col sm:flex-row gap-3 mt-4 sm:justify-between">
                  <button
                    onClick={cancelMakePrivate}
                    className="text-black bg-white hover:bg-gray-100 font-medium font-mulish rounded-full text-sm px-4 py-2 sm:px-5 lg:px-8 border border-gray-500 w-full sm:w-auto"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmMakePrivate}
                    className="text-white bg-black hover:bg-gray-900 font-medium font-mulish rounded-full text-sm px-4 py-2 sm:px-5 lg:px-8 border border-gray-500 w-full sm:w-auto"
                  >
                    Confirm
                  </button>
                </div>
              </div>
            </div>
          )}




          <ul className={`${className}__steps flex flex-row mobile:gap-8 gap-6 px-4`}>
            <li
              className={`list-disc mobile:text-lg text-sm font-semibold ${activeStage === 0 ? "" : "opacity-50"
                }`}
            >
              Proposal Creation
            </li>
          </ul>

          <section>
            <p className="font-semibold mobile:text-base text-sm">Select Rights</p>
            <p className="text-slate-500 mobile:text-base text-xs">
              Decide what permissions you want to give to DAO groups for creating
              things. You can adjust this later in settings.
            </p>
          </section>

          {activeStage === 0 && (
            <React.Fragment>
              <div className="overflow-x-auto">
                <table className="table-auto w-full">
                  <thead>
                    <tr>
                      <th className="font-semibold big_phone:w-2/5 big_phone:p-4 p-2 pb-4 flex justify-left mobile:text-base text-sm">
                        Actions
                      </th>
                      {Object.keys(truePermissions.proposal).map((groupName, index) => (
                        <th
                          key={index}
                          className="font-semibold big_phone:p-4 p-2 pb-4 big_phone:text-base text-sm"
                        >
                          {groupName}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {permissionList.map((permissionName, permissionIndex) => (
                      <tr key={permissionIndex} className="border-b border-slate-200">
                        <td className="big_phone:w-2/5 font-semibold list-disc big_phone:p-4 py-4 p-2 big_phone:text-base text-sm">
                          {permissionName}
                        </td>
                        {Object.keys(truePermissions.proposal).map((groupName, groupIndex) => (
                          <td key={groupIndex}>
                            <div className="flex justify-center">
                              <input
                                type="checkbox"
                                className="cursor-pointer"
                                checked={inputData.proposal[groupName][permissionName] || false}
                                onChange={() =>
                                  toggleCheckbox("proposal", groupName, permissionName)
                                }
                              />
                            </div>
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </React.Fragment>
          )}



          <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow-md">
            <span className="flex flex-row text-gray-800 gap-3">
              Make DAO Private
              <span className="relative group">
                <FaInfoCircle className="text-gray-500 cursor-pointer mt-1" />
                {/* Tooltip */}
                <div className="absolute left-1/2 transform -translate-x-1/2 bottom-full mb-2 opacity-0 group-hover:opacity-100 bg-gray-700 text-white text-sm rounded-lg py-2 px-6 w-[250px]">
                  <div className="absolute left-1/2 transform -translate-x-1/2 bottom-[-6px] w-0 h-0 border-l-[6px] border-r-[6px] border-t-[6px] border-t-gray-700 border-l-transparent border-r-transparent"></div>
                  This action will make your DAO Public or Private. 
                </div>
              </span>
            </span>

            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={isPrivate}
                onChange={() => { setShowModal(true) }}
                className="hidden toggle-checkbox"
              />
              <div
                className={`w-10 h-5 flex items-center rounded-full p-1 duration-300 ease-in-out ${isPrivate ? 'bg-blue-500' : 'bg-gray-300'}`}
              >
                <div
                  className={`bg-white w-4 h-4 rounded-full shadow-md transform duration-300 ease-in-out ${isPrivate ? 'translate-x-5' : ''}`}
                ></div>
              </div>
            </label>
          </div>



          <div className={`${className}__submitButton w-full flex flex-row items-center mobile:justify-end justify-between`}>

            <button
              onClick={handleBack}
              className="flex mobile:m-4 my-4 flex-row items-center gap-2 border border-[#0E3746] hover:bg-[#0E3746] text-[#0E3746] hover:text-white mobile:text-base text-sm transition px-4 py-2 rounded-[2rem]"
            >


              <FaArrowLeftLong /> Back
            </button>
            <button
              type="submit"
              onClick={handleSaveAndNext}
              className={`flex mobile:m-4 my-4 flex-row items-center gap-2 cursor-pointer bg-[#0E3746] px-4 py-2 rounded-[2rem] text-white mobile:text-base text-sm`}
            >
              Save & Next <FaArrowRightLong />
            </button>
          </div>


        </div>

      </Container>

    </React.Fragment>
  );
};

export default Step4;