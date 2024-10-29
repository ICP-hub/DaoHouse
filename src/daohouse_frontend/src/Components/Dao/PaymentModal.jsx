import React from 'react';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import { CircularProgress } from '@mui/material';
import defaultImage from "../../../assets/defaultImage.png"; // Import your default image

const PaymentModal = ({ open, onClose, onPay, loading, data,fileURL }) => {
  return (
    <Modal

      open={open}
      onClose={onClose}
      BackdropProps={{
        style: {
          backdropFilter: 'blur(8px)', // Apply blur effect to background
          backgroundColor: 'rgba(0, 0, 0, 0.5)', // Add semi-transparent dark overlay
        },
      }}
    >
      <div className="fixed inset-0 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-lg w-full max-w-sm sm:max-w-md lg:max-w-lg">
          <h2 className="text-lg font-bold mb-4">Verify your order details</h2>
          <div className="flex items-center mb-4">
            <img
              src={fileURL || defaultImage} // Show default image if imageUrl is not provided
              alt="Product"
              className="w-16 h-16 rounded mr-4"
            />
            <div>
              <p className="font-bold truncate w-96 ...">{data?.step1?.DAOIdentifier || "Product Name"}</p> {/* Show "Product Name" if DAOIdentifier is not available */}
              <p className='lg:truncate lg:w-96 ... truncate w-48 ... small_phone:truncate small_phone:w-64 ...'>{data?.step1?.Purpose || "Purpose not specified"}</p> {/* Default text if Purpose is not available */}
            </div>
          </div>
          <div className="border-t border-gray-300 mb-4"></div>
          <div className="flex justify-between mb-4">
            <span>Total</span>
            <span>ICP 0.1</span>
          </div>
          <p className="text-gray-600 mb-6">Click “Confirm” to complete your payment</p>
          <div className="flex justify-between">
            <button
              onClick={onClose}
              variant="outlined"
              className="text-black bg-white hover:bg-gray-100 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-full text-sm px-6 py-2.5 sm:px-6 lg:px-12 sm:py-2.5 sm:me-2 mb-2 border border-gray-500 dark:bg-white dark:hover:bg-gray-200 dark:focus:ring-gray-300 dark:text-black w-full sm:w-auto"
            >
              Nah, Cancel
            </button>
            <button
              onClick={onPay}
              variant="contained"
              className="text-white bg-black hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-full text-sm px-6 py-2.5 sm:px-6 lg:px-16 sm:py-2.5 sm:me-2 mb-2 border border-gray-500 dark:bg-black dark:hover:bg-gray-800 dark:focus:ring-gray-700 dark:text-white w-full sm:w-auto"
              disabled={loading}
            >
              {loading ? <CircularProgress size={30} color="inherit" /> : "Confirm"}
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default PaymentModal;
