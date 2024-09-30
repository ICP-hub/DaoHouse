import React from "react";

const DaoConfig = ({ daoConfig, handleInputDaoConfig }) => (
    <form className="space-y-4">
        <div className="mb-4">
            <label htmlFor="daoType">DAO Type</label>
            <input
                id="daoType"
                type="text"
                name="daotype"
                value={daoConfig.daotype}
                onChange={handleInputDaoConfig}
                className="w-full px-4 py-3 border-opacity-30 border border-[#aba9a5] rounded-xl bg-transparent"
                placeholder="Enter DAO Type"
            />
        </div>

        <div className="mb-4">
            <label htmlFor="description">Description</label>
            <input
                id="description"
                type="text"
                name="description"
                value={daoConfig.description}
                onChange={handleInputDaoConfig}
                className="w-full px-4 py-3 border-opacity-30 border border-[#aba9a5] rounded-xl bg-transparent"
                placeholder="Enter Description"
            />
        </div>

        <div className="mb-4">
            <label htmlFor="daoName">DAO Name</label>
            <input
                id="daoName"
                type="text"
                name="dao_name"
                value={daoConfig.dao_name}
                onChange={handleInputDaoConfig}
                className="w-full px-4 py-3 border-opacity-30 border border-[#aba9a5] rounded-xl bg-transparent"
                placeholder="Enter DAO Name"
            />
        </div>

        <div className="mb-4">
            <label htmlFor="actionMember">Action Member (Principal)</label>
            <input
                id="actionMember"
                type="text"
                name="action_member"
                value={daoConfig.action_member}
                onChange={handleInputDaoConfig}
                className="w-full px-4 py-3 border-opacity-30 border border-[#aba9a5] rounded-xl bg-transparent"
                placeholder="Enter Action Member Principal"
            />
        </div>

        <div className="mb-4">
            <label htmlFor="purpose">Purpose</label>
            <input
                id="purpose"
                type="text"
                name="purpose"
                value={daoConfig.purpose}
                onChange={handleInputDaoConfig}
                className="w-full px-4 py-3 border-opacity-30 border border-[#aba9a5] rounded-xl bg-transparent"
                placeholder="Enter Purpose"
            />
        </div>
    </form>
);

export default DaoConfig;
