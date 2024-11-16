import React from "react";

const BountyDone = ({ bountyDone, handleInputBountyDone, dao }) => (
  <>
    <div className="mb-4">
      <label htmlFor="associated_proposal_id" className="block mb-2 font-semibold text-xl">Associated Proposal ID</label>
      <input
        id="associated_proposal_id"
        type="text"
        name="associated_proposal_id"
        value={bountyDone.associated_proposal_id}
        onChange={handleInputBountyDone}
        className="w-full px-4 py-3 border-opacity-30 border border-[#aba9a5] rounded-xl bg-transparent"
        placeholder="Enter Proposal ID"
        required
      />
    </div>
    <div className="mb-4">
      <label htmlFor="description" className="block mb-2 font-semibold text-xl">Description</label>
      <textarea
        id="description"
        type="text"
        name="description"
        value={bountyDone.description}
        onChange={handleInputBountyDone}
        className="w-full px-4 py-3 border-opacity-30 border border-[#aba9a5] rounded-xl bg-transparent"
        placeholder="Enter description"
        rows={4}
        required
      />
    </div>

    <div className="mb-4">
        <label htmlFor="bountyTokens" className="mb-2 font-semibold text-xl">Tokens</label>
        <input
          id="bountyTokens"
          type="number"
          name="tokens"
          value={dao.total_tokens ? dao.total_tokens : bountyDone.tokens}
          onChange={handleInputBountyDone}
          className="w-full px-4 py-3 border-opacity-30 border border-[#aba9a5] rounded-xl bg-transparent"
          placeholder="Enter Tokens"
          required
          min={1}
        />
      </div>
    {/* <div className="mb-4">
      <label htmlFor="actionMember" className="block mb-2 font-semibold text-xl">Action Member (Principal)</label>
      <input
        id="action_member"
        type="text"
        name="action_member"
        value={bountyDone.action_member}
        onChange={handleInputBountyDone}
        className="w-full px-4 py-3 border-opacity-30 border border-[#aba9a5] rounded-xl bg-transparent"
        placeholder="Enter action member principal"
      />
    </div> */}
    {/* <div className="mb-4">
      <label htmlFor="Bounty Task" className="block mb-2 font-semibold text-xl">Bounty Task</label>
      <input
        id="bounty_task"
        type="text"
        name="bounty_task"
        value={bountyDone.bounty_task}
        onChange={handleInputBountyDone}
        className="w-full px-4 py-3 border-opacity-30 border border-[#aba9a5] rounded-xl bg-transparent"
        required
      />
    </div> */}

  </>
);

export default BountyDone;
