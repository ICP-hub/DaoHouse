import React, { useState, useEffect } from "react";
import "./Step4.scss";
import { FaArrowLeftLong, FaArrowRightLong } from "react-icons/fa6";
import { getTruePermissions } from "./Getpermission";
import Container from "../Container/Container";
import { Principal } from "@dfinity/principal";

const Step4 = ({ data, setData, setActiveStep }) => {
  const [activeStage, setActiveStage] = useState(0);
  const [groups, setGroups] = useState(() => {
    const groupsList = data.step3.groups.map((group) => group.name);
    if (data.step3.council && !groupsList.includes("Council")) {
      groupsList.unshift("Council");
    }
    return groupsList;
  });

  const className = "DAO__Step4";

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
    BountyClaim: groupName === "Council" ? true : false,
    BountyRaised: groupName === "Council" ? true : false,
    AddMemberToGroupProposal: groupName === "Council" ? true : false,
    GeneralPurpose: groupName === "Council" ? true : false,
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
    "BountyClaim",
    "BountyRaised",
    "AddMemberToGroupProposal",
    "GeneralPurpose",
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
  
    // Function to format each permission as a variant object
    const formatPermission = (permission) => ({ [permission]: null });
  
    // Format dao_groups with array for group_permissions, ensuring proper variant encoding
    const daoGroups = data.step3.groups.map((group) => ({
      group_members: group.members.map((member) =>
        Principal.fromText(member)
      ),
      quorem: 5, // Adjust the quorum value as needed
      group_name: group.name,
      group_permissions: (filteredPermissions.proposal[group.name] || []).map(formatPermission), // Format each permission as a variant
    }));
  
    // Collect unique permissions for members
    const membersPermissions = new Set();
  
    // Collect permissions from proposal step
    Object.values(filteredPermissions.proposal).forEach((permissions) =>
      permissions.forEach((permission) => membersPermissions.add(formatPermission(permission)))
    );
  
    // Convert Set to Array
    const membersPermissionsArray = Array.from(membersPermissions);
  
    // Update data with formatted permissions
    setData((prev) => ({
      ...prev,
      step4: filteredPermissions,
      dao_groups: daoGroups, // Ensure this is an array of group permissions with proper variant encoding
      members_permissions: membersPermissionsArray, // Ensure this is an array of variants
    }));
  
    // Proceed to the next step
    setActiveStep(4);
  }
  
  
  

  function handleBack() {
    setActiveStep(2);
  }

  useEffect(() => {
    localStorage.setItem("activeStage", JSON.stringify(activeStage));
  }, [activeStage]);

  useEffect(() => {
    localStorage.setItem("inputData", JSON.stringify(inputData));
  }, [inputData]);

  const truePermissions = getTruePermissions(inputData);

  return (
    <React.Fragment>
      <Container>
        <div
          className={`${className}__form w-full bg-[#F4F2EC] big_phone:p-10 small_phone:p-4 p-2 big_phone:mx-4 mx-0 rounded-lg flex flex-col gap-4`}
        >
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
