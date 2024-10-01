import React from "react";

const BountyDone = ({ bountyDone, handleInputBountyDone }) => (
  <>
    <div className="mb-4">
      <label htmlFor="to">To</label>
      <input
        id="to"
        type="to"
        name="to"
        value={bountyDone.to}
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
        id="action_member"
        type="text"
        name="action_member"
        value={bountyDone.action_member}
        onChange={handleInputBountyDone}
        className="w-full px-4 py-3 border-opacity-30 border border-[#aba9a5] rounded-xl bg-transparent"
        placeholder="Enter action member principal"
      />
    </div>
    <div className="mb-4">
      <label htmlFor="Bounty Task">Bounty Task</label>
      <input
        id="bounty_task"
        type="text"
        name="bounty_task"
        value={bountyDone.bounty_task}
        onChange={handleInputBountyDone}
        className="w-full px-4 py-3 border-opacity-30 border border-[#aba9a5] rounded-xl bg-transparent"
      />
    </div>

  </>
);

export default BountyDone;
