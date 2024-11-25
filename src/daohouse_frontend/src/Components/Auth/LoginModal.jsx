import React, { useEffect } from 'react';
import { FaTimes } from 'react-icons/fa';
import plug from '../../../assets/plugicon.png';
import II from '../../../assets/InternetIdentityIcon.png';
import nfidlogo from '../../../assets/nfidlogo.png';
import './global.scss'; // Ensure global styles are imported

const LoginModal = ({ isOpen, onClose, onLogin, onLoginPlug, onLoginNFID}) => {
  // added logic here for stop scrolling
  useEffect(() => {
    const bodyStyle = document.body.style;

    if (isOpen) {
      Object.assign(bodyStyle, {
        position: 'fixed',
        top: '0',
        left: '0',
        width: '100%',
        overflow: 'hidden',
      });
    } else {
      Object.assign(bodyStyle, {
        position: '',
        top: '',
        left: '',
        width: '',
        overflow: '',
      });
    }

    return () => {
      Object.assign(bodyStyle, {
        position: '',
        top: '',
        left: '',
        width: '',
        overflow: '',
      });
    };
  }, [isOpen]);

  const buttons = [
    {
      onClick: onLogin,
      bgColor: 'bg-[#OE3746]',
      hoverColor: 'hover:bg-[#0E3746]',
      textColor: 'text-white',
      icon: II,
      label: 'Internet Identity'
    },
    {
      onClick: onLoginPlug,
      bgColor: 'bg-[#40E0D0]',
      hoverColor: 'hover:bg-[#0E3746]',
      textColor: 'text-white',
      icon: plug,
      label: 'Plug Wallet'
    },
    {
      onClick: onLoginNFID,
      bgColor: 'bg-[#40E0D0]',
      hoverColor: 'hover:bg-[#0E3746]',
      textColor: 'text-white',
      icon: nfidlogo,
      label: 'NFID'
    }
  ];

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 flex justify-center items-center z-[10000]">
          <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex justify-center items-center z-[15000]">
            <div className="bg-[#AAC8D6] p-4 rounded-lg shadow-lg w-80 h-75 max-h-[100vh] overflow-y-auto z-[20000]">
              <div className="flex justify-center items-center mb-3 border-b-2 border-white relative">
                <span className="text-[#0E3746] font-medium">Connect With</span>
                <button onClick={onClose} className="absolute right-0 text-gray-400 hover:text-gray-600">
                  <FaTimes color='#0E3746' />
                </button>
              </div>
              <div className='flex items-center justify-center flex-col mt-4'>
                {buttons.map((button, index) => (
                  <button
                    key={index}
                    onClick={button.onClick}
                    className={`flex items-center justify-start w-full p-2 mb-3 text-black hover:text-white hover:bg-black border-2 border-[#4993B0] rounded-lg`}
                  >
                    <div className='w-fit text-center mx-auto inline-flex'>
                      <img src={button.icon} alt={button.label} className="w-6 h-6 mr-2 bg-white rounded-xl" />
                      <span className='w-[7rem] truncate text-left'>{button.label}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default LoginModal;
