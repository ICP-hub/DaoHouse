import React from "react";

const MintNewTokens = ({ mintTokenData, handleInputMintToken }) => (
  <>
    <div className="mb-4">
      <label className="mb-2 font-semibold text-xl">Total Amount</label>
      <input
        type="number"
        name="amount"  // Changed to match the state property
        value={mintTokenData.total_amount || 0}
        onChange={handleInputMintToken}
        className="w-full px-4 py-3 border-opacity-30 border border-[#aba9a5] rounded-xl bg-transparent"
        placeholder="Enter total amount"
        required
        min={0}
      />
    </div>
    <div className="mb-4">
      <label className="mb-2 font-semibold text-xl">Description</label>
      <textarea
        name="description"
        value={mintTokenData.description}
        onChange={handleInputMintToken}
        className="w-full px-4 py-3 border-opacity-30 border border-[#aba9a5] rounded-xl bg-transparent"
        placeholder="Enter description"
        rows={4}
        required
      />
    </div>
    {/* <div className="mb-4">
      <label className="mb-2 font-semibold text-xl">Proposal Entry</label>
      <input
        type="text"
        name="proposal_entry"
        value={mintTokenData.proposal_entry}
        onChange={handleInputMintToken}
        className="w-full px-4 py-3 border-opacity-30 border border-[#aba9a5] rounded-xl bg-transparent"
        placeholder="Enter proposal entry"
        required
      />
    </div> */}
  </>
);

export default MintNewTokens;
