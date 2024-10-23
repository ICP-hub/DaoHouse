import React, { useEffect } from "react";

const BountyRaised = ({ bountyRaised, handleInputBountyRaised, setBountyRaised }) => {
  // Get today's date in the format YYYY-MM-DD
  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split("T")[0]; // Format as YYYY-MM-DD
  };

  useEffect(() => {
    // Set today's date for "Created At" field when the component loads
    setBountyRaised((prevBountyRaised) => ({
      ...prevBountyRaised,
      proposal_created_at: getTodayDate(),
    }));
  }, [setBountyRaised]);

  return (
    <>
      <div className="mb-4">
        <label htmlFor="description" className="mb-2 font-semibold text-xl">Description</label>
        <textarea
          id="description"
          type="text"
          name="description"
          value={bountyRaised.description}
          onChange={handleInputBountyRaised}
          className="w-full px-4 py-3 border-opacity-30 border border-[#aba9a5] rounded-xl bg-transparent"
          placeholder="Enter description"
          required
          rows={4}
        />
      </div>
      {/* <div className="mb-4">
        <label htmlFor="actionMember" className="mb-2 font-semibold text-xl">Action Member (Principal)</label>
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
      </div> */}
      <div className="mb-4">
        <label htmlFor="bountyTask" className="mb-2 font-semibold text-xl">Bounty Task</label>
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
        <label htmlFor="bountyTokens" className="mb-2 font-semibold text-xl">Tokens</label>
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
      <div className="mb-4">
        <label htmlFor="proposalCreatedAt" className="mb-2 font-semibold text-xl">Created At</label>
        <input
          id="proposalCreatedAt"
          type="date"
          name="proposal_created_at"
          value={bountyRaised.proposal_created_at}
          onChange={handleInputBountyRaised}
          className="w-full px-4 py-3 border-opacity-30 border border-[#aba9a5] rounded-xl bg-transparent"
          required
          disabled // Disabled so the user can't change the created at date
        />
      </div>
      <div className="mb-4">
        <label htmlFor="proposalExpiredAt" className="mb-2 font-semibold text-xl">Expired At</label>
        <input
          id="proposalExpiredAt"
          type="date"
          name="proposal_expired_at"
          value={bountyRaised.proposal_expired_at}
          onChange={handleInputBountyRaised}
          min={getTodayDate()}
          className="w-full px-4 py-3 border-opacity-30 border border-[#aba9a5] rounded-xl bg-transparent"
          required
        />
      </div>
    </>
  );
};

export default BountyRaised;
