import React from 'react';
import toast from 'react-hot-toast';
import { FaLink, FaClipboard, FaTimes } from 'react-icons/fa';

const ShareModal = ({ isOpen, proposalId, daoCanisterId, toggleModal }) => {
  if (!isOpen) return null;

  // Function to copy the link to the clipboard
  const copyToClipboard = () => {
    const shareLink = `${window.location.origin}/social-feed/proposal/${proposalId}/dao/${daoCanisterId}`;
    navigator.clipboard.writeText(shareLink)
      .then(() => {
        toast.success('Link copied succesfully!');
      })
      .catch(() => {
        toast.error('Failed to copy the link.');
      });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-md p-4">
      <div className="bg-[#F2EEE3] p-4 sm:p-6 rounded-lg shadow-lg w-full max-w-[90%] sm:max-w-md relative">
        <h4 className="text-lg sm:text-xl font-semibold mb-4 text-center">Share your proposal</h4>
        <button 
          className="absolute top-2 right-2 p-2 text-gray-600 hover:text-gray-800" 
          onClick={toggleModal}
        >
          <FaTimes className="w-5 h-5" />
        </button>
        
        <div className="flex items-center mb-4 border p-2 rounded-md bg-white">
          <FaLink className="mr-2 text-gray-500 flex-shrink-0" />
          <input
            type="text"
            readOnly
            className="w-full bg-transparent outline-none text-gray-500 text-sm sm:text-base truncate"
            value={`${window.location.origin}/social-feed/proposal/${proposalId}/dao/${daoCanisterId}`}
          />
          <button
            className="ml-2 p-2 bg-transparent text-gray-600 hover:opacity-70"
            onClick={copyToClipboard}
          >
            <FaClipboard className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShareModal;
