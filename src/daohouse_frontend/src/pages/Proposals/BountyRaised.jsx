import React from "react";

const BountyRaised = ({ bountyRaised, handleInputBountyRaised }) => (
  <>
    <div className="mb-4">
      <label htmlFor="description">Description</label>
      <input
        id="description"
        type="text"
        name="description"
        value={bountyRaised.description}
        onChange={handleInputBountyRaised}
        className="w-full px-4 py-3 border-opacity-30 border border-[#aba9a5] rounded-xl bg-transparent"
        placeholder="Enter description"
        required
      />
    </div>
    <div className="mb-4">
      <label htmlFor="actionMember">Action Member (Principal)</label>
      <input
        id="actionMember"
        type="text"
        name="action_member"
        value={bountyRaised.action_member}
        onChange={handleInputBountyRaised}
        className="w-full px-4 py-3 border-opacity-30 border border-[#aba9a5] rounded-xl bg-transparent"
        placeholder="Enter action member principal"
        required
      />
    </div>
    <div className="mb-4">
      <label htmlFor="proposalCreatedAt">Proposal Created At</label>
      <input
        id="proposalCreatedAt"
        type="date"
        name="proposal_created_at"
        value={bountyRaised.proposal_created_at}
        onChange={handleInputBountyRaised}
        className="w-full px-4 py-3 border-opacity-30 border border-[#aba9a5] rounded-xl bg-transparent"
        required
      />
    </div>
    <div className="mb-4">
      <label htmlFor="proposalExpiredAt">Proposal Expired At</label>
      <input
        id="proposalExpiredAt"
        type="date"
        name="proposal_expired_at"
        value={bountyRaised.proposal_expired_at}
        onChange={handleInputBountyRaised}
        className="w-full px-4 py-3 border-opacity-30 border border-[#aba9a5] rounded-xl bg-transparent"
        required
      />
    </div>
    <div className="mb-4">
      <label htmlFor="bountyTask">Bounty Task</label>
      <input
        id="bountyTask"
        type="text"
        name="bounty_task"
        value={bountyRaised.bounty_task}
        onChange={handleInputBountyRaised}
        className="w-full px-4 py-3 border-opacity-30 border border-[#aba9a5] rounded-xl bg-transparent"
        placeholder="Enter bounty task"
        required
      />
    </div>
    <div className="mb-4">
      <label htmlFor="bountyTokens">Tokens</label>
      <input
        id="bountyTokens"
        type="number"
        name="tokens"
        value={bountyRaised.tokens}
        onChange={handleInputBountyRaised}
        className="w-full px-4 py-3 border-opacity-30 border border-[#aba9a5] rounded-xl bg-transparent"
        placeholder="Enter Tokens"
        required
      />
    </div>
  </>
);

export default BountyRaised;
