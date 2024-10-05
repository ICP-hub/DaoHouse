import React from "react";

const BountyClaim = ({ bountyClaim, handleInputBountyClaim }) => (
  <>
    <div className="mb-4">
      <label htmlFor="to" className="block mb-2 font-semibold text-xl">To</label>
      <input
        id="to"
        type="to"
        name="to"
        value={bountyClaim.to}
        onChange={handleInputBountyClaim}
        className="w-full px-4 py-3 border-opacity-30 border border-[#aba9a5] rounded-xl bg-transparent"
        placeholder="Enter description"
      />
    </div>
    <div className="mb-4">
      <label htmlFor="description" className="block mb-2 font-semibold text-xl">Description</label>
      <input
        id="description"
        type="text"
        name="description"
        value={bountyClaim.description}
        onChange={handleInputBountyClaim}
        className="w-full px-4 py-3 border-opacity-30 border border-[#aba9a5] rounded-xl bg-transparent"
        placeholder="Enter description"
      />
    </div>

    <div className="mb-4">
      <label htmlFor="tokens" className="block mb-2 font-semibold text-xl">Tokens</label>
      <input
        id="tokens"
        type="number"
        name="tokens"
        value={bountyClaim.tokens}
        onChange={handleInputBountyClaim}
        className="w-full px-4 py-3 border-opacity-30 border border-[#aba9a5] rounded-xl bg-transparent"
        placeholder="Enter tokens"
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
      />
    </div>

  </>
);

export default BountyClaim;
