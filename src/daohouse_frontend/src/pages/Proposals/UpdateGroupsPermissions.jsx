import React, { useState } from "react";
import { FaInfoCircle } from "react-icons/fa";

const UpdateGroupsPermissions = ({
    updateGroupsPermissions, 
    handleInputUpdateGroupsPermissions, 
    groupNames, 
    dao, 
    selectedPermissions,
    setSelectedPermissions,
}) => {
  const [principalError, setPrincipalError] = useState("");
  const permissionList = [
    "RemoveMemberToDaoProposal",
    "ChangeDaoConfig",
    "BountyDone",
    "Polls",
    "ChangeDaoPolicy",
    "TokenTransfer",
    "AddMemberToDaoProposal",
    "RemoveMemberToGroupProposal",
    "BountyRaised",
    "AddMemberToGroupProposal",
    "GeneralPurpose",
    "MintNewTokens",
    "ChangeGroupPermissions",
  ];

  const handleValidatedInput = (e) => {
    const { name, value } = e.target;
    if (/\S/.test(value) || value === "") {
      handleInputUpdateGroupsPermissions(e);
    }
  };

  const handleTogglePermission = (groupName, permission) => {
    setSelectedPermissions((prev) => ({
      ...prev,
      [groupName]: prev[groupName]?.includes(permission)
        ? prev[groupName].filter((perm) => perm !== permission)
        : [...(prev[groupName] || []), permission],
    }));
  };  
  
  return (
    <>
      <div className="mb-4">
        <div className="flex items-center space-x-2">
          <label className="block mb-2 font-semibold text-xl">Group Name</label>
          <div className="relative group">
            <FaInfoCircle className="text-gray-500 cursor-pointer mb-1" />
            <div className="absolute left-full top-1/2 transform -translate-y-1/2 ml-2 opacity-0 group-hover:opacity-100 bg-gray-700 text-white text-sm rounded-lg py-2 px-4 w-max">
              <div className="absolute left-[-6px] top-1/2 transform -translate-y-1/2 w-0 h-0 border-l-[6px] border-r-[6px] border-t-[6px] border-t-gray-700 border-l-transparent border-r-transparent"></div>
              Select a group to update permissions
            </div>
          </div>
        </div>
        <select
          name="group_name"
          required
          value={updateGroupsPermissions.group_name}
          className="rounded-lg mobile:p-3 p-2 mobile:text-base text-sm w-full border border-[#aba9a5] bg-transparent"
          onChange={handleInputUpdateGroupsPermissions}
        >
          <option value="" disabled>
            Select Group Name
          </option>
          {groupNames.map((name, index) => (
            <option key={index} value={name}>
              {name}
            </option>
          ))}
        </select>
      </div>
      <div className="mb-4">
        <label className="block mb-2 font-semibold text-xl">Description</label>
        <textarea
          type="text"
          name="description"
          value={updateGroupsPermissions.description}
          onChange={handleValidatedInput}
          className="w-full px-4 py-3 border border-opacity-30 border-[#aba9a5] rounded-xl bg-transparent"
          placeholder="Enter description"
          rows={4}
          required
        />
      </div>

      {updateGroupsPermissions.group_name && (
        <div className="mb-4">
          <label className="block mb-2 font-semibold text-xl">
            Update Permissions
          </label>
          <div className="border p-4 rounded-lg">
            <h3 className="font-semibold text-lg mb-4">Permissions</h3>
            <div className="grid gap-4">
              {permissionList.map((permission, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center text-sm"
                >
                  <span className="text-gray-700">{permission}</span>
                  <input
                    type="checkbox"
                    checked={
                      selectedPermissions[updateGroupsPermissions.group_name]?.includes(permission)
                    }
                    onChange={() =>
                      handleTogglePermission(updateGroupsPermissions.group_name, permission)
                    }
                    className="form-checkbox h-5 w-5 text-blue-600 ml-4"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

    </>
  );
};

export default UpdateGroupsPermissions;
