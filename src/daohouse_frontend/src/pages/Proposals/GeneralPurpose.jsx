import React, { useEffect } from "react";

const GeneralPurpose = ({ generalPurp, handleInputGeneralPurp, setGeneralPurp }) => {
  // Get today's date in the format YYYY-MM-DD
  // const getTodayDate = () => {
  //   const today = new Date();
  //   return today.toISOString().split("T")[0]; // Format as YYYY-MM-DD
  // };

  // useEffect(() => {
  //   // Set today's date for "Created At" when the component loads
  //   setGeneralPurp((prevGeneralPurp) => ({
  //     ...prevGeneralPurp,
  //     proposalCreatedAt: getTodayDate(),
  //   }));
  // }, [setGeneralPurp]);

  return (
    <>
      <div className="mb-4">
        <label className="mb-2 font-semibold text-xl">Proposal Title</label>
        <input
          type="text"
          name="proposalTitle"
          value={generalPurp.proposalTitle}
          onChange={handleInputGeneralPurp}
          className="w-full px-4 py-3 border-opacity-30 border border-[#aba9a5] rounded-xl bg-transparent"
          placeholder="Enter purpose title"
        />
      </div>
      <div className="mb-4">
        <label className="mb-2 font-semibold text-xl">Description</label>
        <input
          type="text"
          name="description"
          value={generalPurp.description}
          onChange={handleInputGeneralPurp}
          className="w-full px-4 py-3 border-opacity-30 border border-[#aba9a5] rounded-xl bg-transparent"
          placeholder="Enter description"
        />
      </div>
      {/* <div className="mb-4">
        <label className="mb-2 font-semibold text-xl">Action Member (Principal)</label>
        <input
          type="text"
          name="actionMember"
          value={generalPurp.actionMember}
          onChange={handleInputGeneralPurp}
          className="w-full px-4 py-3 border-opacity-30 border border-[#aba9a5] rounded-xl bg-transparent"
          placeholder="Enter action member principal"
        />
      </div>
      <div className="mb-4">
        <label className="mb-2 font-semibold text-xl">Created At</label>
        <input
          type="date"
          name="proposalCreatedAt"
          value={generalPurp.proposalCreatedAt}
          onChange={handleInputGeneralPurp}
          className="w-full px-4 py-3 border-opacity-30 border border-[#aba9a5] rounded-xl bg-transparent"
          disabled // Disable so the user can't change the date
        />
      </div>
      <div className="mb-4">
        <label className="mb-2 font-semibold text-xl">Expires At</label>
        <input
          type="date"
          name="proposalExpiredAt"
          value={generalPurp.proposalExpiredAt}
          onChange={handleInputGeneralPurp}
          min={getTodayDate()}
          className="w-full px-4 py-3 border-opacity-30 border border-[#aba9a5] rounded-xl bg-transparent"
        />
      </div> */}
    </>
  );
};

export default GeneralPurpose;
