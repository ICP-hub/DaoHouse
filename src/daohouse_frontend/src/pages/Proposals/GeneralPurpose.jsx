import React from "react";

const GeneralPurpose = ({ generalPurp, handleInputGeneralPurp }) => (
  <>
    <div className="mb-4">
      <label>Purpose Title</label>
      <input
        type="text"
        name="purposeTitle"
        value={generalPurp.purposeTitle}
        onChange={handleInputGeneralPurp}
        className="w-full px-4 py-3 border-opacity-30 border border-[#aba9a5] rounded-xl bg-transparent"
        placeholder="Enter purpose title"
      />
    </div>
    <div className="mb-4">
      <label>Description</label>
      <input
        type="text"
        name="description"
        value={generalPurp.description}
        onChange={handleInputGeneralPurp}
        className="w-full px-4 py-3 border-opacity-30 border border-[#aba9a5] rounded-xl bg-transparent"
        placeholder="Enter description"
      />
    </div>
    <div className="mb-4">
      <label>Action Member (Principal)</label>
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
      <label>Proposal Expired At</label>
      <input
        type="date"
        name="proposalExpiredAt"
        value={generalPurp.proposalExpiredAt}
        onChange={handleInputGeneralPurp}
        className="w-full px-4 py-3 border-opacity-30 border border-[#aba9a5] rounded-xl bg-transparent"
      />
    </div>
    <div className="mb-4">
      <label>Proposal Created At</label>
      <input
        type="date"
        name="proposalCreatedAt"
        value={generalPurp.proposalCreatedAt}
        onChange={handleInputGeneralPurp}
        className="w-full px-4 py-3 border-opacity-30 border border-[#aba9a5] rounded-xl bg-transparent"
      />
    </div>
  </>
);

export default GeneralPurpose;
