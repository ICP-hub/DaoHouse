import React from "react";

const BountyClaim = ({ bountyClaim, handleInputBountyClaim }) => (
  <>
    <div className="mb-4">
      <label htmlFor="associated_proposal_id" className="block mb-2 font-semibold text-xl">Associated Proposal ID</label>
      <input
        id="associated_proposal_id"
        type="text"
        name="associated_proposal_id"
        value={bountyClaim.associated_proposal_id}
        onChange={handleInputBountyClaim}
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
        value={bountyClaim.description}
        onChange={handleInputBountyClaim}
        className="w-full px-4 py-3 border-opacity-30 border border-[#aba9a5] rounded-xl bg-transparent"
        placeholder="Enter description"
        rows={4}
        required
      />
    </div>

    <div className="mb-4">
      <label htmlFor="link_of_task" className="block mb-2 font-semibold text-xl">Link of Task</label>
      <input
        id="link_of_task"
        type="text"
        name="link_of_task"
        value={bountyClaim.link_of_task}
        onChange={handleInputBountyClaim}
        className="w-full px-4 py-3 border-opacity-30 border border-[#aba9a5] rounded-xl bg-transparent"
        placeholder="Enter the link of the task"
        required
      />
    </div>
    {/* <div className="mb-4">
      <label htmlFor="actionMember" className="block mb-2 font-semibold text-xl">Action Member (Principal)</label>
      <input
        id="action_member"
        type="text"
        name="action_member"
        value={bountyClaim.action_member}
        onChange={handleInputBountyClaim}
        className="w-full px-4 py-3 border-opacity-30 border border-[#aba9a5] rounded-xl bg-transparent"
        placeholder="Enter action member principal"
      />
    </div> */}
    <div className="mb-4">
      <label htmlFor="Bounty Task" className="block mb-2 font-semibold text-xl">Bounty Task</label>
      <input
        id="bounty_task"
        type="text"
        name="bounty_task"
        value={bountyClaim.bounty_task}
        onChange={handleInputBountyClaim}
        className="w-full px-4 py-3 border-opacity-30 border border-[#aba9a5] rounded-xl bg-transparent"
        required
      />
    </div>

  </>
);

export default BountyClaim;
