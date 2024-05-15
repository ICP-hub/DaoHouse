import React, { useState } from "react";
import "./Step4.scss";
import { FaArrowLeftLong, FaArrowRightLong } from "react-icons/fa6";

const Step4 = ({ data, setData, setActiveStep }) => {
  const [activeStage, setActiveStage] = useState(0);
  const [inputData, setInputData] = useState({
    proposal: theList(),
    voting: theList(),
  });
  const groups = data.step3.map((grp) => grp.name);
  const className = "DAO__Step4";

  {
    /**Mind blowing */
  }
  function theList() {
    const list = groups.reduce((acc, group) => {
      acc[group] = {
        ChangeDAOConfig: false,
        ChangeDAOPolicy: false,
        Bounty: false,
        BountyDone: false,
        Transfer: false,
        Polls: false,
        AddMembers: false,
        FunctionCalls: false,
        UpgradeSelf: false,
        UpgradeRemote: false,
        setVoteToken: false,
      };
      return acc;
    }, {});

    return list;
  }

  const permissionList = [
    "ChangeDAOConfig",
    "ChangeDAOPolicy",
    "Bounty",
    "BountyDone",
    "Transfer",
    "Polls",
    "AddMembers",
    "FunctionCalls",
    "UpgradeSelf",
    "UpgradeRemote",
    "setVoteToken",
  ];

  function handleSaveAndNext() {
    setData((prev) => ({
      ...prev,
      step4: { ...inputData },
    }));

    setActiveStep(4);
  }

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

    // Update the state
    setInputData(updatedInputData);
  }

  return (
    <React.Fragment>
      <div
        className={
          className +
          "__form w-full bg-[#F4F2EC] p-10 rounded-lg flex flex-col gap-4"
        }
      >
        <ul className={className + "__steps flex flex-row gap-8 px-4"}>
          <li
            className={`list-disc text-lg font-semibold ${
              activeStage == 0 ? "" : "opacity-50"
            }`}
          >
            Proposal Creation
          </li>
          <li
            className={`list-disc text-lg font-semibold ${
              activeStage == 1 ? "" : "opacity-50"
            }`}
          >
            Voting Permission
          </li>
        </ul>

        <section>
          <p className="font-semibold">Select Rights</p>
          <p className="text-slate-700">
            Decide what permissions you want to give to DAO groups for creating
            things. You can adjust this later in settings.
          </p>
        </section>

        {activeStage === 0 && (
          <React.Fragment>
            <table className={className + "__table w-full overflow-x-auto"}>
              <thead>
                <tr>
                  <th className="font-semibold w-2/5 p-4 flex justify-left">
                    Actions
                  </th>
                  {Object.keys(inputData.proposal).map((groupName) => (
                    <th className="font-semibold p-4">{groupName}</th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {permissionList.map((permissionName, permissionIndex) => (
                  <tr key={permissionIndex}>
                    <td className="w-2/5 font-semibold list-disc p-4">
                      {permissionName}
                    </td>

                    {Object.keys(inputData.proposal).map(
                      (groupName, groupIndex) => (
                        <td>
                          <div className="flex justify-center">
                            <input
                              key={groupIndex}
                              type="checkbox"
                              checked={
                                inputData["proposal"][groupName][permissionName]
                              }
                              onChange={() =>
                                toggleCheckbox(
                                  "proposal",
                                  groupName,
                                  permissionName
                                )
                              }
                            />
                          </div>
                        </td>
                      )
                    )}
                  </tr>
                ))}
              </tbody>
            </table>

            <section className="flex w-full justify-end items-center">
              <button
                type="submit"
                onClick={() => setActiveStage(1)}
                className="flex m-4 flex-row items-center gap-2 bg-[#0E3746] px-4 py-2 rounded-[2rem] text-white"
              >
                Next
              </button>
            </section>
          </React.Fragment>
        )}

        {activeStage === 1 && (
          <React.Fragment>
            <table class="table-auto">
              <thead>
                <tr>
                  <th className="font-semibold w-2/5 p-4 flex justify-left">
                    Actions
                  </th>
                  {Object.keys(inputData.voting).map((groupName) => (
                    <th className="font-semibold p-4">{groupName}</th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {permissionList.map((permissionName, permissionIndex) => (
                  <tr key={permissionIndex}>
                    <td className="w-2/5 font-semibold list-disc p-4">
                      {permissionName}
                    </td>

                    {Object.keys(inputData.voting).map(
                      (groupName, groupIndex) => (
                        <td>
                          <div className="flex justify-center">
                            <input
                              key={groupIndex}
                              type="checkbox"
                              checked={
                                inputData["voting"][groupName][permissionName]
                              }
                              onChange={() =>
                                toggleCheckbox(
                                  "voting",
                                  groupName,
                                  permissionName
                                )
                              }
                            />
                          </div>
                        </td>
                      )
                    )}
                  </tr>
                ))}
              </tbody>
            </table>

            <section className="flex w-full justify-end items-center">
              <button
                type="submit"
                onClick={() => setActiveStage(0)}
                className="flex m-4 flex-row items-center gap-2 bg-[#0E3746] px-4 py-2 rounded-[2rem] text-white"
              >
                Back
              </button>
            </section>
          </React.Fragment>
        )}
      </div>

      <div
        className={
          className +
          "__submitButton w-full flex flex-row items-center justify-end"
        }
      >
        <button
          onClick={() => setActiveStep(2)}
          className="flex m-4 flex-row items-center gap-2 border border-[#0E3746] hover:bg-[#0E3746] text-[#0E3746] hover:text-white transition px-4 py-2 rounded-[2rem]"
        >
          <FaArrowLeftLong /> Back
        </button>
        <button
          type="submit"
          onClick={handleSaveAndNext}
          disabled={activeStage == 0 ? true : false}
          className={`flex m-4 flex-row items-center gap-2 bg-[#0E3746] px-4 py-2 rounded-[2rem] text-white ${
            activeStage == 0 ? "opacity-50" : "opacity-100"
          }`}
        >
          Save & Next <FaArrowRightLong />
        </button>
      </div>
    </React.Fragment>
  );
};

export default Step4;
