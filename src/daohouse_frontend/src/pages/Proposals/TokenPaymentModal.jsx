import { useEffect } from 'react';
import { CircularProgress } from '@mui/material';

const TokenPaymentModal = ({ tokenTransfer, isOpen, onClose, onConfirm, loadingPayment }) => {

  if (!isOpen) return null;


  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('overflow-hidden');
    } else {
      document.body.classList.remove('overflow-hidden');
    }

    return () => {
      document.body.classList.remove('overflow-hidden');
    };
  }, [isOpen]);


  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      body.overflow-hidden {
        overflow: hidden;
        position: fixed;
        width: 100%;
        height: 100%;
      }
    `;
    document.head.append(style);
    return () => style.remove();
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg w-11/12 md:w-1/3 p-6">
        <h2 className="text-2xl mb-4">Confirm Payment</h2>
        <p className="mb-4">
          Are you sure you want to proceed with the payment of <strong>{tokenTransfer.tokens} Tokens</strong>?
        </p>
        {/* Add more payment details if necessary */}
        <div className="flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="text-black bg-white hover:bg-gray-100 font-medium rounded-full text-sm px-6 py-2.5 sm:px-6 lg:px-12 sm:py-2.5 sm:me-2 mb-2 border border-gray-500 dark:bg-white dark:hover:bg-gray-200 dark:text-black w-full sm:w-auto"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="text-white bg-black hover:bg-gray-900 font-medium rounded-full text-sm px-6 py-2.5 sm:px-6 lg:px-16 sm:py-2.5 sm:me-2 mb-2 border border-gray-500 dark:bg-black dark:hover:bg-gray-800 dark:text-white w-full sm:w-auto"
          >
            {loadingPayment ? <CircularProgress size={30} color="inherit" /> : "Confirm"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TokenPaymentModal;
