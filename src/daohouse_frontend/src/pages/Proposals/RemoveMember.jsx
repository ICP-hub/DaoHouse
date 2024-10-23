import React from "react";

const RemoveMember = ({ removeMember, handleInputRemoveMember, groupNames }) => (
    <>
        <div className="mb-4">
            <label className="block mb-2 font-semibold text-xl">Group Name</label>
            {/* <input
            type="text"
            name="group_name"
            value={addMember.group_name}
            onChange={handleInputAddMember}
            className="w-full px-4 py-3 border border-opacity-30 border-[#aba9a5] rounded-xl bg-transparent"
            placeholder="Enter group name"
            required
          /> */}
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
                type="text"
                name="description"
                value={removeMember.description}
                onChange={handleInputRemoveMember}
                className="w-full px-4 py-3 border border-opacity-30 border-[#aba9a5] rounded-xl bg-transparent"
                placeholder="Enter description"
                rows={4}
                required
            />
        </div>
        <div className="mb-4">
            <label className="block mb-2 font-semibold text-xl">Member (Principal)</label>
            <input
                type="text"
                name="action_member"
                value={removeMember.action_member}
                onChange={handleInputRemoveMember}
                className="w-full px-4 py-3 border border-opacity-30 border-[#aba9a5] rounded-xl bg-transparent"
                placeholder="Enter new member principal"
                required
            />
        </div>
    </>
);

export default RemoveMember;
