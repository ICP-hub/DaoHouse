import { CircularProgress } from '@mui/material';
import React, { useEffect } from 'react'

function ShowModal( {showConfirmModal,confirmJoinDao,loading,setShowConfirmModal}) { 

    useEffect(() => {
        const handleOverflow = () => {
          if (showConfirmModal) {
            document.body.style.overflow = 'hidden';
            document.body.style.position = 'fixed';
            document.body.style.width = '100%';
          } else {
            document.body.style.overflow = '';
            document.body.style.position = '';
            document.body.style.width = '';
          }
        };
    
        handleOverflow();
    
        return () => {
          document.body.style.overflow = '';
          document.body.style.position = '';
          document.body.style.width = '';
        };
      }, [showConfirmModal]);
    
      if (!showConfirmModal) return null;
    

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center px-4">
    <div className="bg-white p-6 rounded-lg shadow-lg md:w-[800px] mx-auto text-center">
      <h3 className="text-xl font-mulish font-semibold text-[#234A5A]">
        Ready to join this DAO?
      </h3>
      <p className="mt-4 text-[16px] md:px-24 font-mulish">
        You’re about to join a DAO! A proposal will be created
        to welcome you, and DAO members will vote on your
        request. You'll be notified once the results are in.
        Approval happens when members vote in your favor—good
        luck!
      </p>
      <div className="flex justify-center gap-4 mt-4">
        <button
          onClick={() => setShowConfirmModal(false)}
          className="px-8 py-3 text-[12px] lg:text-[16px] text-black font-normal rounded-full shadow-md hover:bg-gray-200 hover:text-[#0d2933]"
        >
          Cancel
        </button>
        <button
          onClick={confirmJoinDao}
          className={`${loading ? " px-10 md:px-12 py-3 " : " px-6 md:px-8 py-3 "} text-center text-[12px] lg:text-[16px] bg-[#0E3746] text-white rounded-full shadow-xl hover:bg-[#0d2933] hover:text-white`}
        >
          {loading ? (
            <CircularProgress size={24} sx={{ color: 'white' }} />
          ) : (
            "Join DAO"
          )}
        </button>
      </div>
    </div>
  </div>
  )
}

export default ShowModal
