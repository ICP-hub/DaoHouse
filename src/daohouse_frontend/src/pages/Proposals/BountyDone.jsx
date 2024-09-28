import React from "react";

const BountyDone = ({ bountyDone, handleInputBountyDone }) => (
  <>
    <div className="mb-4">
      <label htmlFor="from">From</label>
      <input
        id="from"
        type="text"
        name="from"
        value={bountyDone.from}
        onChange={handleInputBountyDone}
        className="w-full px-4 py-3 border-opacity-30 border border-[#aba9a5] rounded-xl bg-transparent"
        placeholder="Enter description"
      />
    </div>
    <div className="mb-4">
      <label htmlFor="description">Description</label>
      <input
        id="description"
        type="text"
        name="description"
        value={bountyDone.description}
        onChange={handleInputBountyDone}
        className="w-full px-4 py-3 border-opacity-30 border border-[#aba9a5] rounded-xl bg-transparent"
        placeholder="Enter description"
      />
    </div>
    <div className="mb-4">
      <label htmlFor="bountyTask">Bounty Task</label>
      <input
        id="bountyTask"
        type="text"
        name="bountyTask"
        value={bountyDone.bountyTask} // Corrected name attribute
        onChange={handleInputBountyDone}
        className="w-full px-4 py-3 border-opacity-30 border border-[#aba9a5] rounded-xl bg-transparent"
        placeholder="Enter bounty task"
      />
    </div>
    <div className="mb-4">
      <label htmlFor="tokens">Tokens</label>
      <input
        id="tokens"
        type="number"
        name="tokens"
        value={bountyDone.tokens}
        onChange={handleInputBountyDone}
        className="w-full px-4 py-3 border-opacity-30 border border-[#aba9a5] rounded-xl bg-transparent"
        placeholder="Enter tokens"
      />
    </div>
    <div className="mb-4">
      <label htmlFor="actionMember">Action Member (Principal)</label>
      <input
        id="actionMember"
        type="text"
        name="actionMember"
        value={bountyDone.actionMember}
        onChange={handleInputBountyDone}
        className="w-full px-4 py-3 border-opacity-30 border border-[#aba9a5] rounded-xl bg-transparent"
        placeholder="Enter action member principal"
      />
    </div>
    <div className="mb-4">
      <label htmlFor="proposalExpiredAt">Proposal Expired At</label>
      <input
        id="proposalExpiredAt"
        type="date"
        name="proposalExpiredAt"
        value={bountyDone.proposalExpiredAt}
        onChange={handleInputBountyDone}
        className="w-full px-4 py-3 border-opacity-30 border border-[#aba9a5] rounded-xl bg-transparent"
      />
    </div>
    <div className="mb-4">
      <label htmlFor="proposalCreatedAt">Proposal Created At</label>
      <input
        id="proposalCreatedAt"
        type="date"
        name="proposalCreatedAt"
        value={bountyDone.proposalCreatedAt}
        onChange={handleInputBountyDone}
        className="w-full px-4 py-3 border-opacity-30 border border-[#aba9a5] rounded-xl bg-transparent"
      />
    </div>
  </>
);

export default BountyDone;
