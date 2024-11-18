import React, { useEffect } from "react";

function DaoConfig({ daoConfig, handleInputDaoConfig, dao, setDaoConfig, errorMessage, errors, setDescriptionError, setDaoNameError, setDaoPurposeError }) {
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

    const handleDescriptionChange = (e) => {
        handleInputDaoConfig(e); // Call the original handler
        if (errorMessage) {
            setDescriptionError(""); // Clear the error message when user starts typing
        }
    };

    const handleDaoNameChange = (e) => {
        handleInputDaoConfig(e); // Call the original handler
        if (errors?.new_dao_name) {
            setDaoNameError(""); // Clear the error message when user starts typing
        }
    };

    const handlePurposeChange = (e) => {
        handleInputDaoConfig(e); // Call the original handler
        if (errors?.purpose) {
            setDaoPurposeError(""); // Clear the error message when user starts typing
        }
    };

    return (
        <form className="space-y-4">
            <div className="mb-4">
                <label htmlFor="description" className="mb-2 font-semibold text-xl">Description</label>
                <textarea
                    id="description"
                    name="description"
                    value={daoConfig?.description || ""}
                    onChange={handleDescriptionChange} // Use the new handler
                    className="w-full px-4 py-3 border-opacity-30 border border-[#aba9a5] rounded-xl bg-transparent"
                    placeholder="Enter Description"
                    rows={4}
                    required
                />

                {errorMessage && (
                    <p className="text-red-500 text-sm">{errorMessage}</p>
                )}
            </div>

            <div className="mb-4">
                <label htmlFor="daoName" className="mb-2 font-semibold text-xl">DAO Name</label>
                <input
                    id="NewdaoName"
                    type="text"
                    name="new_dao_name"
                    value={daoConfig?.new_dao_name}
                    onChange={handleDaoNameChange} // Use the new handler
                    className="w-full px-4 py-3 border-opacity-30 border border-[#aba9a5] rounded-xl bg-transparent"
                    placeholder="Enter DAO Name"
                    required
                />

                {errors?.new_dao_name && (
                    <p className="text-red-500 text-sm mt-1">{errors?.new_dao_name}</p>
                )}
            </div>

            <div className="mb-4">
                <label htmlFor="purpose" className="mb-2 font-semibold text-xl">DAO Purpose</label>
                <input
                    id="purpose"
                    type="text"
                    name="purpose"
                    value={daoConfig?.purpose}
                    onChange={handlePurposeChange} // Use the new handler
                    className="w-full px-4 py-3 border-opacity-30 border border-[#aba9a5] rounded-xl bg-transparent"
                    placeholder="Enter Purpose"
                    required
                />

                {errors?.purpose && (
                    <p className="text-red-500 text-sm mt-1">{errors?.purpose}</p>
                )}
            </div>
        </form>
    );
}

export default DaoConfig;