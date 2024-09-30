import React from "react";

const DaoPolicy = ({ changePolicy, handleInputDaoPolicy }) => (
    <form className="space-y-4">
        <div className="mb-4">
            <label htmlFor="description">Description</label>
            <input
                id="description"
                type="text"
                name="description"
                value={changePolicy.description}
                onChange={handleInputDaoPolicy}
                className="w-full px-4 py-3 border-opacity-30 border border-[#aba9a5] rounded-xl bg-transparent"
                placeholder="Enter Description"
            />
        </div>

        <div className="mb-4">
            <label htmlFor="actionMember">Action Member (Principal)</label>
            <input
                id="actionMember"
                type="text"
                name="action_member"
                value={changePolicy.action_member}
                onChange={handleInputDaoPolicy}
                className="w-full px-4 py-3 border-opacity-30 border border-[#aba9a5] rounded-xl bg-transparent"
                placeholder="Enter Action Member Principal"
            />
        </div>

        <div className="mb-4">
            <label htmlFor="coolDownPeriod">Cool Down Period</label>
            <input
                id="coolDownPeriod"
                type="text"
                name="cool_down_period"
                value={changePolicy.cool_down_period}
                onChange={handleInputDaoPolicy}
                className="w-full px-4 py-3 border-opacity-30 border border-[#aba9a5] rounded-xl bg-transparent"
                placeholder="Enter Cool Down Period"
            />
        </div>

        <div className="mb-4">
            <label htmlFor="requiredVotes">Required Votes</label>
            <input
                id="requiredVotes"
                type="text"
                name="required_votes"
                value={changePolicy.required_votes}
                onChange={handleInputDaoPolicy}
                className="w-full px-4 py-3 border-opacity-30 border border-[#aba9a5] rounded-xl bg-transparent"
                placeholder="Enter Required Votes"
            />
        </div>
    </form>
);

export default DaoPolicy;
