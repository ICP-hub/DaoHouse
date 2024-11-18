import React, { useEffect } from "react";

const GeneralPurpose = ({ generalPurp, handleInputGeneralPurp, setGeneralPurp }) => {
  const handleValidatedInput = (e) => {
    const { name, value } = e.target;

    if (/\S/.test(value) || value === "") {
      handleInputGeneralPurp(e);
    }
  };
  return (
    <>
      <div className="mb-4">
        <label className="mb-2 font-semibold text-xl">Proposal Title</label>
        <input
          type="text"
          name="proposalTitle"
          value={generalPurp.proposalTitle}
          onChange={handleValidatedInput}
          className="w-full px-4 py-3 border-opacity-30 border border-[#aba9a5] rounded-xl bg-transparent"
          placeholder="Enter purpose title"
          required
        />
      </div>
      <div className="mb-4">
        <label className="mb-2 font-semibold text-xl">Description</label>
        <textarea
          type="text"
          name="description"
          value={generalPurp.description}
          onChange={handleValidatedInput}
          className="w-full px-4 py-3 border-opacity-30 border border-[#aba9a5] rounded-xl bg-transparent"
          placeholder="Enter description"
          rows={4}
          required
        />
      </div>

    </>
  );
};

export default GeneralPurpose;
