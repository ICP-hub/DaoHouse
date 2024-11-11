import React, { useEffect } from "react";


function DaoConfig({ daoConfig, handleInputDaoConfig, dao, setDaoConfig, setLoading }) {
    console.log("dao in dao config", dao);
    console.log("dao name in dao config", daoConfig.new_dao_name);
    useEffect(() => {
        // Set initial daoConfig values if they're not already set
        setDaoConfig((prevConfig) => ({
            ...prevConfig,
            new_dao_name: prevConfig.new_dao_name || dao.dao_name || "",
            purpose: prevConfig.purpose || dao.purpose || "",
        }));
    }, [dao, setDaoConfig]);

    return (
        <form className="space-y-4">
            <div className="mb-4">
                <label htmlFor="description" className="mb-2 font-semibold text-xl">Description</label>
                <textarea
                    id="description"
                    name="description"
                    value={daoConfig.description}
                    onChange={handleInputDaoConfig}
                    className="w-full px-4 py-3 border-opacity-30 border border-[#aba9a5] rounded-xl bg-transparent"
                    placeholder="Enter Description"
                    rows={4}
                    required
                />
            </div>

            <div className="mb-4">
                <label htmlFor="daoName" className="mb-2 font-semibold text-xl">DAO Name</label>
                <input
                    id="NewdaoName"
                    type="text"
                    name="new_dao_name"
                    value={daoConfig.new_dao_name}
                    onChange={handleInputDaoConfig}
                    className="w-full px-4 py-3 border-opacity-30 border border-[#aba9a5] rounded-xl bg-transparent"
                    placeholder="Enter DAO Name"
                    required
                />
            </div>

            {/* Uncomment if needed for additional fields
            <div className="mb-4">
                <label htmlFor="actionMember" className="mb-2 font-semibold text-xl">Action Member (Principal)</label>
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
            */}

            <div className="mb-4">
                <label htmlFor="purpose" className="mb-2 font-semibold text-xl">DAO Purpose</label>
                <input
                    id="purpose"
                    type="text"
                    name="purpose"
                    value={daoConfig.purpose}
                    onChange={handleInputDaoConfig}
                    className="w-full px-4 py-3 border-opacity-30 border border-[#aba9a5] rounded-xl bg-transparent"
                    placeholder="Enter Purpose"
                    required
                />
            </div>
        </form>
    );
}

export default DaoConfig;

