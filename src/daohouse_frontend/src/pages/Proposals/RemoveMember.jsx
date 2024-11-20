import React, { useState } from "react";
import { Principal } from "@dfinity/principal";

const RemoveMember = ({ removeMember, handleInputRemoveMember, groupNames }) => {
  const [principalError, setPrincipalError] = useState("");
  

//     const { name, value } = e.target;

//     // Trim input value to remove extra spaces
//     const trimmedValue = value.trim();

   

//     // Handle Principal Validation
//     if (name === "action_member") {
//       if (trimmedValue === "") {
//         setPrincipalError("Member (Principal) cannot be empty or whitespace.");
//       } else {
//         setPrincipalError("");
//       }

//       try {
//         Principal.fromText(trimmedValue);
//         setPrincipalError(""); // Clear error if valid Principal ID
//       } catch (error) {
//         setPrincipalError("Please enter a valid Principal ID.");
//       }
//     }

//     // Proceed with input handling after validation
//     handleInputRemoveMember({
//       target: {
//         name,
//         value: trimmedValue, // Set the trimmed value
//       },
//     });
//   };
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
        <label className="block mb-2 font-semibold text-xl">Group Name</label>
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
          placeholder="Enter new member principal"
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
