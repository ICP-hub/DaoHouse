import { useEffect } from 'react';
import { CircularProgress } from '@mui/material';
import Container from "../../Components/Container/Container"

const TokenPaymentModal = ({ tokenTransfer, isOpen, onClose, onConfirm, loadingPayment }) => {
  useEffect(() => {
    const handleOverflow = () => {
      if (isOpen) {
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
  }, [isOpen]);

  if (!isOpen) return null;

  return (
<Container>
<div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg w-11/12 max-w-md md:w-1/3 p-6 sm:p-8">
        <h2 className="text-xl sm:text-2xl font-bold mb-4 text-center">
          Confirm Payment
        </h2>
        <p className="text-sm sm:text-base text-gray-700 mb-6 text-center">
          Are you sure you want to proceed with the payment of 
          <strong> {tokenTransfer.tokens} Tokens</strong>?
        </p>
        <div className="flex justify-between gap-4">
          <button
            onClick={onClose}
            className="text-black bg-white hover:bg-gray-100 font-medium rounded-full text-sm px-6 py-2 border border-gray-500 w-full sm:w-auto"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="text-white bg-black hover:bg-gray-900 font-medium rounded-full text-sm px-6 py-2 border border-gray-500 w-full sm:w-auto"
          >
            {loadingPayment ? <CircularProgress size={20} color="inherit" /> : "Confirm"}
          </button>
        </div>
      </div>
    </div>
</Container>
  );
};

export default TokenPaymentModal;
