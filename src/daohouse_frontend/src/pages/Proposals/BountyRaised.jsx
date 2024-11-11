import React, { useEffect } from "react";

const BountyRaised = ({ bountyRaised, handleInputBountyRaised, setBountyRaised, dao }) => {

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
          value={bountyRaised.tokens || dao.total_tokens}
          onChange={handleInputBountyRaised}
          className="w-full px-4 py-3 border-opacity-30 border border-[#aba9a5] rounded-xl bg-transparent"
          placeholder="Enter Tokens"
          required
          min={1}
        />
      </div>

    </>
  );
};

export default BountyRaised;
