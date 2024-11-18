// import React from "react";
// import { Principal } from "@dfinity/principal";

// const RemoveDaoMember = ({ removeDaoMember, handleInputRemoveDaoMember ,descriptionError,principalError}) => {
//     const handleValidatedInput = (e) => {
//         const [principalError, setPrincipalError] = useState("");
//         const { name, value } = e.target;
    
//         if (/\S/.test(value) || value === "") {
//             handleInputRemoveDaoMember(e);
//         }
//         if (name === "action_member") {
//             try {
//                 Principal.fromText(value);
//                 setPrincipalError("");
//             } catch (error) {
//                 setPrincipalError("Please enter a valid Principal ID.");
//             }
//         }
//     };
    
//     return(


//     <form className="space-y-4">
//         <div className="mb-4">
//             <label htmlFor="description" className="mb-2 font-semibold text-xl">Description</label>
//             <input
//                 id="description"
//                 type="text"
//                 name="description"
//                 value={removeDaoMember.description}
//                 onChange={handleValidatedInput}
//                 className="w-full px-4 py-3 border-opacity-30 border border-[#aba9a5] rounded-xl bg-transparent"
//                 placeholder="Enter Description"
//                 required
//             />
//             {descriptionError && (
//                     <p className="text-red-500 text-sm">{descriptionError}</p>
//                 )}
//         </div>

//         <div className="mb-4">
//             <label htmlFor="actionMember" className="mb-2 font-semibold text-xl">Member (Principal)</label>
//             <input
//                 id="actionMember"
//                 type="text"
//                 name="action_member"
//                 value={removeDaoMember.action_member}
//                 onChange={handleValidatedInput}
//                 className="w-full px-4 py-3 border-opacity-30 border border-[#aba9a5] rounded-xl bg-transparent"
//                 placeholder="Enter Action Member Principal"
//                 required
//             />
//              {principalError && (
//                     <p className="text-red-500 text-sm">{principalError}</p>
//                 )}
//         </div>


//     </form>
// );
// };
// export default RemoveDaoMember;


import React, { useState } from "react";
import { Principal } from "@dfinity/principal";

const RemoveDaoMember = ({ removeDaoMember, handleInputRemoveDaoMember, descriptionError, principalError,setDescriptionError,setPrincipalError }) => {
   

    const handleValidatedInput = (e) => {
        const { name, value } = e.target;
        if (/\S/.test(value) || value === "") {
            handleInputRemoveDaoMember(e);
        }
        if (name === "description" && value) {
            setDescriptionError(""); // Clear description error
        }

        if (name === "action_member" && value) {
            setPrincipalError(""); // Clear principal error
        }
        if (name === "action_member" && value) {
            try {
                Principal.fromText(value);
                setPrincipalError(""); // Clear error if valid Principal ID
            } catch (error) {
                setPrincipalError("Please enter a valid Principal ID.");
            }
        }
    };
    
    return (
        <form className="space-y-4">
            <div className="mb-4">
                <label htmlFor="description" className="mb-2 font-semibold text-xl">Description</label>
                <input
                    id="description"
                    type="text"
                    name="description"
                    value={removeDaoMember.description}
                    onChange={handleValidatedInput}
                    className="w-full px-4 py-3 border-opacity-30 border border-[#aba9a5] rounded-xl bg-transparent"
                    placeholder="Enter Description"
                    required
                />
                {descriptionError && (
                    <p className="text-red-500 text-sm">{descriptionError}</p>
                )}
            </div>

            <div className="mb-4">
                <label htmlFor="actionMember" className="mb-2 font-semibold text-xl">Member (Principal)</label>
                <input
                    id="actionMember"
                    type="text"
                    name="action_member"
                    value={removeDaoMember.action_member}
                    onChange={handleValidatedInput}
                    className="w-full px-4 py-3 border-opacity-30 border border-[#aba9a5] rounded-xl bg-transparent"
                    placeholder="Enter Action Member Principal"
                    required
                />
                {principalError && (
                    <p className="text-red-500 text-sm">{principalError}</p>
                )}
            </div>
        </form>
    );
};

export default RemoveDaoMember;
