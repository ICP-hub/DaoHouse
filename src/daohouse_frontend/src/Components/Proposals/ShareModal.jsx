import React from 'react';

const ShareModal = ({ isOpen, proposalId, daoCanisterId, toggleModal, copyToClipboard }) => {
  if (!isOpen) return null; // Do not render if modal is not open

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-4 rounded-lg shadow-lg max-w-sm w-full">
        <h4 className="text-lg font-semibold mb-2">Share Proposal</h4>
        <div className="flex items-center justify-between mb-4">
          <input
            type="text"
            readOnly
            className="border p-2 w-full"
            value={`${window.location.origin}/social-feed/proposal/${proposalId}/dao/${daoCanisterId}`}
          />
          <button
            className="bg-blue-500 text-white px-4 py-2 ml-2 rounded-md"
            onClick={copyToClipboard}
          >
            Copy
          </button>
        </div>
        <button
          className="bg-red-500 text-white px-4 py-2 rounded-md"
          onClick={toggleModal}
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default ShareModal;
