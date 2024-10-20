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
    ChangeDAOConfig: groupName === "Council" ? true : false,
    ChangeDAOPolicy: groupName === "Council" ? true : false,
    Transfer: groupName === "Council" ? true : false,
    Polls: groupName === "Council" ? true : false,
    AddMemberToGroup: groupName === "Council" ? true : false,
    BountyDone: groupName === "Council" ? true : false,
    BountyRaised: groupName === "Council" ? true : false,
    GeneralPurpose: groupName === "Council" ? true : false,
    RemoveMemberToGroup: groupName === "Council" ? true : false,
    RemoveDaoMember: groupName === "Council" ? true : false,
  });

  const permissionList = [
    "ChangeDAOConfig",
    "ChangeDAOPolicy",
    "Transfer",
    "Polls",
    "AddMemberToGroup",
    "BountyDone",
    "BountyRaised",
    "GeneralPurpose",
    "RemoveMemberToGroup",
    "RemoveDaoMember",
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

    const daoGroups = data.step3.groups.map((group) => ({
      group_members: group.members.map((member) =>
        Principal.fromText(member)
      ),
      quorem: 5,
      group_name: group.name,
      group_permissions: filteredPermissions.proposal[group.name] || [],
    }));

    const membersPermissions = new Set();

    Object.values(filteredPermissions.proposal).forEach((permissions) =>
      permissions.forEach((permission) => membersPermissions.add(permission))
    );

    setData((prev) => ({
      ...prev,
      step4: filteredPermissions,
      dao_groups: daoGroups,
      members_permissions: Array.from(membersPermissions),
    }));

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
              className={`list-disc mobile:text-lg text-sm font-semibold ${
                activeStage === 0 ? "" : "opacity-50"
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
