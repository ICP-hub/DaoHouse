import React from "react";

const RemoveDaoMember = ({ removeDaoMember, handleInputRemoveDaoMember }) => (
    <form className="space-y-4">
        <div className="mb-4">
            <label htmlFor="description" className="mb-2 font-semibold text-xl">Description</label>
            <input
                id="description"
                type="text"
                name="description"
                value={removeDaoMember.description}
                onChange={handleInputRemoveDaoMember}
                className="w-full px-4 py-3 border-opacity-30 border border-[#aba9a5] rounded-xl bg-transparent"
                placeholder="Enter Description"
            />
        </div>

        <div className="mb-4">
            <label htmlFor="actionMember" className="mb-2 font-semibold text-xl">Action Member (Principal)</label>
            <input
                id="actionMember"
                type="text"
                name="action_member"
                value={removeDaoMember.action_member}
                onChange={handleInputRemoveDaoMember}
                className="w-full px-4 py-3 border-opacity-30 border border-[#aba9a5] rounded-xl bg-transparent"
                placeholder="Enter Action Member Principal"
            />
        </div>


    </form>
);

export default RemoveDaoMember;
