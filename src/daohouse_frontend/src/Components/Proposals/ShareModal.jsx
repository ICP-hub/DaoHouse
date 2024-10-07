import React from 'react';
import { FaLink } from 'react-icons/fa'; // Import a link icon for the input
import { FaClipboard } from 'react-icons/fa'; // Import a clipboard icon for the copy button

const ShareModal = ({ isOpen, proposalId, daoCanisterId, toggleModal, copyToClipboard }) => {
  if (!isOpen) return null; // Do not render if modal is not open

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-[#F2EEE3] p-4 rounded-lg shadow-lg max-w-sm w-full relative"> 
        <h4 className="text-lg font-semibold mb-2 text-center">Share your proposal</h4>
        <button className="absolute top-2 right-2" onClick={toggleModal}> 
          <span className="text-lg font-semibold">&times;</span> 
        </button>
        
        <div className="flex items-center mb-4 border p-2 rounded-md bg-white"> {/* Input container */}
          <FaLink className="mr-2 text-gray-500" /> {/* Icon for the link */}
          <input
            type="text"
            readOnly
            className="w-full bg-transparent outline-none text-gray-500"
            value={`${window.location.origin}/social-feed/proposal/${proposalId}/dao/${daoCanisterId}`}
          />
          <button
            className="ml-2 p-2 bg-transparent text-gray-600 hover:opacity-70"
            onClick={copyToClipboard}
          >
            <FaClipboard className="w-5 h-5" /> {/* Clipboard icon */}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShareModal;
