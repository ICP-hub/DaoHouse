import React from "react";

const TokenTransfer = ({ tokenTransfer, handleInputTransferToken, dao }) => (
 
  
  <>
    <div className="mb-4">
      <label className="mb-2 font-semibold text-xl">To</label>
      <input
        type="text"
        name="to"
        value={tokenTransfer.to}
        onChange={handleInputTransferToken}
        className="w-full px-4 py-3 border-opacity-30 border border-[#aba9a5] rounded-xl bg-transparent"
        placeholder="Enter sender's principal"
        required
      />
    </div>
    <div className="mb-4">
      <label className="mb-2 font-semibold text-xl">Description</label>
      <textarea
        type="text"
        name="description"
        value={tokenTransfer.description}
        onChange={handleInputTransferToken}
        className="w-full px-4 py-3 border-opacity-30 border border-[#aba9a5] rounded-xl bg-transparent"
        placeholder="Enter description"
        rows={4}
        required
      />
    </div>
    <div className="mb-4">
      <label className="mb-2 font-semibold text-xl">Tokens</label>
      <input
        type="number"
        name="tokens"
        value={tokenTransfer.tokens || dao.total_tokens}
        onChange={handleInputTransferToken}
        className="w-full px-4 py-3 border-opacity-30 border border-[#aba9a5] rounded-xl bg-transparent"
        placeholder="Enter tokens"
        required
        min={1}
      />
    </div>
    {/* <div className="mb-4">
      <label className="mb-2 font-semibold text-xl">Action Member</label>
      <input
        type="text"
        name="actionMember"
        value={tokenTransfer.action_member}
        onChange={handleInputTransferToken}
        className="w-full px-4 py-3 border-opacity-30 border border-[#aba9a5] rounded-xl bg-transparent"
        placeholder="Enter action member principal"
      />
    </div> */}
  </>
);

export default TokenTransfer;


// import React, { useEffect } from "react";

// const TokenTransfer = ({ tokenTransfer, handleInputTransferToken, dao }) => {
//   useEffect(() => {
//     console.log("dao total tokens:", dao.total_tokens);
//   }, [dao.total_tokens]); // Logs only when dao.total_tokens changes

//   return (
//     <>
//       <div className="mb-4">
//         <label className="mb-2 font-semibold text-xl">To</label>
//         <input
//           type="text"
//           name="to"
//           value={tokenTransfer.to}
//           onChange={handleInputTransferToken}
//           className="w-full px-4 py-3 border-opacity-30 border border-[#aba9a5] rounded-xl bg-transparent"
//           placeholder="Enter sender's principal"
//           required
//         />
//       </div>
//       <div className="mb-4">
//         <label className="mb-2 font-semibold text-xl">Description</label>
//         <textarea
//           type="text"
//           name="description"
//           value={tokenTransfer.description}
//           onChange={handleInputTransferToken}
//           className="w-full px-4 py-3 border-opacity-30 border border-[#aba9a5] rounded-xl bg-transparent"
//           placeholder="Enter description"
//           rows={4}
//           required
//         />
//       </div>
//       <div className="mb-4">
//         <label className="mb-2 font-semibold text-xl">Tokens</label>
//         <input
//           type="number"
//           name="tokens"
//           value={tokenTransfer.tokens || dao.total_tokens}
//           onChange={handleInputTransferToken}
//           className="w-full px-4 py-3 border-opacity-30 border border-[#aba9a5] rounded-xl bg-transparent"
//           placeholder="Enter tokens"
//           required
//           min={1}
//         />
//       </div>
//       {/* <div className="mb-4">
//         <label className="mb-2 font-semibold text-xl">Action Member</label>
//         <input
//           type="text"
//           name="actionMember"
//           value={tokenTransfer.action_member}
//           onChange={handleInputTransferToken}
//           className="w-full px-4 py-3 border-opacity-30 border border-[#aba9a5] rounded-xl bg-transparent"
//           placeholder="Enter action member principal"
//         />
//       </div> */}
//     </>
//   );
// };

// export default TokenTransfer;
