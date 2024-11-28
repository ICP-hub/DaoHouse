import React, { useEffect } from "react";

function DaoConfig({ daoConfig, handleInputDaoConfig, dao, setDaoConfig, errorMessage, errors, setDescriptionError, setDaoNameError, setDaoPurposeError }) {
    useEffect(() => {
        // Set initial daoConfig values if they're not already set
        setDaoConfig((prevConfig) => ({
            ...prevConfig,
            new_dao_name: prevConfig.new_dao_name || dao.dao_name || "",
            purpose: prevConfig.purpose || dao.purpose || "",
        }));
    }, [dao, setDaoConfig]);

    const handleDescriptionChange = (e) => {
        const value = e.target.value; 
        if (value.trim() === "") { 
            setDescriptionError("Description cannot be empty or just spaces."); 
            e.target.value = ""; 
        } else {
            setDescriptionError(""); 
        }
        handleInputDaoConfig(e); 
    };

    const handleDaoNameChange = (e) => {
        const value = e.target.value; 
        if (value.trim() === "") { 
            setDaoNameError("DAO Name cannot be empty or just spaces."); 
            e.target.value = ""; 
        } else {
            setDaoNameError("");
        }
        handleInputDaoConfig(e); 
    };

    const handlePurposeChange = (e) => {
        const value = e.target.value; // Get the input value
        if (value.trim() === "") { // Check if the trimmed value is empty
            setDaoPurposeError("DAO Purpose cannot be empty or just spaces."); // Set error if empty
            e.target.value = ""; // Clear the input field
        } else {
            setDaoPurposeError(""); // Clear the error message
        }
        handleInputDaoConfig(e); // Update the state
    };

    return (
        <form className="space-y-4">
            <div className="mb-4">
                <label htmlFor="description" className="mb-2 font-semibold text-xl">Description</label>
                <textarea
                    id="description"
                    name="description"
                    value={daoConfig?.description || ""}
                    onChange={handleDescriptionChange} 
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
                <label htmlFor="daoName" className="mb-2 font-semibold text-xl">Update DAO Name</label>
                <input
                    id="NewdaoName"
                    type="text"
                    name="new_dao_name"
                    value={daoConfig?.new_dao_name}
                    onChange={handleDaoNameChange} 
                    className="w-full px-4 py-3 border-opacity-30 border border-[#aba9a5] rounded-xl bg-transparent"
                    placeholder="Enter DAO Name"
                    required
                />
                {errors?.new_dao_name && (
                    <p className="text-red-500 text-sm mt-1">{errors?.new_dao_name}</p>
                )}
            </div>

            <div className="mb-4">
                <label htmlFor="purpose" className="mb-2 font-semibold text-xl">Update DAO Purpose</label>
                <input
                    id="purpose"
                    type="text"
                    name="purpose"
                    value={daoConfig?.purpose}
                    onChange={handlePurposeChange} 
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