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
          value={bountyDone.tokens}
          onChange={handleInputBountyDone}
          className="w-full px-4 py-3 border-opacity-30 border border-[#aba9a5] rounded-xl bg-transparent"
          placeholder="Enter Tokens"
          required
          min={1}
        />
      </div>
  </>
);

export default BountyDone;
