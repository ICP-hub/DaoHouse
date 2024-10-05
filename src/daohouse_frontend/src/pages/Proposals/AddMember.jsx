import React from "react";

const AddMember = ({ addMember, handleInputAddMember, groupNames }) => (
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
            <input
                type="text"
                name="description"
                value={addMember.description}
                onChange={handleInputAddMember}
                className="w-full px-4 py-3 border border-opacity-30 border-[#aba9a5] rounded-xl bg-transparent"
                placeholder="Enter description"
                required
            />
        </div>
        <div className="mb-4">
            <label className="block mb-2 font-semibold text-xl">New Member (Principal)</label>
            <input
                type="text"
                name="new_member"
                value={addMember.new_member}
                onChange={handleInputAddMember}
                className="w-full px-4 py-3 border border-opacity-30 border-[#aba9a5] rounded-xl bg-transparent"
                placeholder="Enter new member principal"
                required
            />
        </div>
    </>
);

export default AddMember;
