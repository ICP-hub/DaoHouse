import React, { useState } from "react";
import { Principal } from "@dfinity/principal";
import { FaInfoCircle } from "react-icons/fa";



const RemoveMember = ({ removeMember, handleInputRemoveMember, groupNames }) => {
  const [principalError, setPrincipalError] = useState("");
  
const handleValidatedInput = (e) => {
    const { name, value } = e.target;

    if (/\S/.test(value) || value === "") {
        handleInputRemoveMember(e);
    }
    if (name === "action_member") {
        try {
            Principal.fromText(value);
            setPrincipalError("");
        } catch (error) {
            setPrincipalError("Please enter a valid Principal ID.");
        }
    }
};

  return (
    <>
      <div className="mb-4">
      <div className="flex items-center space-x-2  ">
        <label className="block mb-2 font-semibold text-xl">Group Name</label>
        <div className="relative group">
                    <FaInfoCircle className="text-gray-500 cursor-pointer mb-1" />

                    <div className="absolute left-full top-1/2 transform -translate-y-1/2 ml-2 opacity-0 group-hover:opacity-100 bg-gray-700 text-white text-sm rounded-lg py-2 px-4 w-max">
    <div className="absolute left-[-6px] top-1/2 transform -translate-y-1/2 w-0 h-0 border-l-[6px] border-r-[6px] border-t-[6px] border-t-gray-700 border-l-transparent border-r-transparent"></div>
  Select a group to Remove Member
  </div>
  </div>
  </div>
        <select
          name="group_name"
          required
          value={removeMember.group_name}
          className="rounded-lg mobile:p-3 p-2 mobile:text-base text-sm w-full border border-[#aba9a5] bg-transparent"
          onChange={handleInputRemoveMember}
        >
          <option value="" disabled>Select Group Name</option>
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
          name="description"
          value={removeMember.description}
          onChange={handleValidatedInput}  
          className="w-full px-4 py-3 border border-opacity-30 border-[#aba9a5] rounded-xl bg-transparent"
          placeholder="Enter description"
          required
          rows={4}
        />
       
        
      </div>

      <div className="mb-4">
        <label className="block mb-2 font-semibold text-xl">Member (Principal)</label>
        <input
          type="text"
          name="action_member"
          value={removeMember.action_member}
          onChange={handleValidatedInput} 
          className="w-full px-4 py-3 border border-opacity-30 border-[#aba9a5] rounded-xl bg-transparent"
          placeholder="Enter existing member's principal"
          required
        />
        
        {principalError && (
          <p className="text-red-500 text-sm mt-2">{principalError}</p>
        )}
      </div>
    </>
  );
};

export default RemoveMember;
