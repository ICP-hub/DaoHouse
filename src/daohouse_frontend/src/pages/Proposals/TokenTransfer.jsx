import React from "react";

const TokenTransfer = ({ tokenTransfer, handleInputTransferToken }) => (
  <>
    <div className="mb-4">
      <label>To</label>
      <input
        type="text"
        name="to"
        value={tokenTransfer.to}
        onChange={handleInputTransferToken}
        className="w-full px-4 py-3 border-opacity-30 border border-[#aba9a5] rounded-xl bg-transparent"
        placeholder="Enter sender's principal"
      />
    </div>
    <div className="mb-4">
      <label>Description</label>
      <input
        type="text"
        name="description"
        value={tokenTransfer.description}
        onChange={handleInputTransferToken}
        className="w-full px-4 py-3 border-opacity-30 border border-[#aba9a5] rounded-xl bg-transparent"
        placeholder="Enter description"
      />
    </div>
    <div className="mb-4">
      <label>Tokens</label>
      <input
        type="number"
        name="tokens"
        value={tokenTransfer.tokens}
        onChange={handleInputTransferToken}
        className="w-full px-4 py-3 border-opacity-30 border border-[#aba9a5] rounded-xl bg-transparent"
        placeholder="Enter tokens"
      />
    </div>
    <div className="mb-4">
      <label>Action Member</label>
      <input
        type="text"
        name="actionMember"
        value={tokenTransfer.actionMember}
        onChange={handleInputTransferToken}
        className="w-full px-4 py-3 border-opacity-30 border border-[#aba9a5] rounded-xl bg-transparent"
        placeholder="Enter action member principal"
      />
    </div>
  </>
);

export default TokenTransfer;