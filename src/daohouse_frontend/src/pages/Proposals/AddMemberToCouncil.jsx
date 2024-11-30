import React, { useState } from "react";
import { Principal } from "@dfinity/principal";
import { FaInfoCircle } from "react-icons/fa";

const AddMemberToCouncil = ({ addMemberToCouncil, handleInputAddMemberToCouncil }) => {
    const [principalError, setPrincipalError] = useState("");

    const handleValidatedInput = (e) => {
        const { name, value } = e.target;

        if (/\S/.test(value) || value === "") {
            handleInputAddMemberToCouncil(e);
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
                <label className="block mb-2 font-semibold text-xl">Description</label>
                <textarea
                    type="text"
                    name="description"
                    value={addMemberToCouncil?.description}
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
                    value={addMemberToCouncil?.new_member}
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

export default AddMemberToCouncil;
