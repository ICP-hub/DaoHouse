import React, { useState } from "react";
import { Principal } from "@dfinity/principal";

const AddMember = ({ addMember, handleInputAddMember, groupNames }) => {
    const [principalError, setPrincipalError] = useState("");

    const handleValidatedInput = (e) => {
        const { name, value } = e.target;

        if (/\S/.test(value) || value === "") {
            handleInputAddMember(e);
        }
        if (name === "new_member") {
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
                    value={addMember.group_name}
                    className="rounded-lg mobile:p-3 p-2 mobile:text-base text-sm w-full border border-[#aba9a5] bg-transparent"
                    onChange={handleInputAddMember}
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
                    type="text"
                    name="description"
                    value={addMember.description}
                    onChange={handleValidatedInput}
                    className="w-full px-4 py-3 border border-opacity-30 border-[#aba9a5] rounded-xl bg-transparent"
                    placeholder="Enter description"
                    rows={4}
                    required
                />
            </div>
            <div className="mb-4">
                <label className="block mb-2 font-semibold text-xl">New Member (Principal)</label>
                <input
                    type="text"
                    name="new_member"
                    value={addMember.new_member}
                    onChange={handleValidatedInput}
                    className="w-full px-4 py-3 border border-opacity-30 border-[#aba9a5] rounded-xl bg-transparent"
                    placeholder="Enter new member principal"
                    required
                />
                {principalError && (
                    <p className="text-red-500 text-sm mt-1">{principalError}</p>
                )}
            </div>
        </>
    );
};

export default AddMember;
