import React from "react";
import closeIcon from "../../../assets/close-icon.png";
import Container from "../Container/Container";

const SuccessModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <Container  classes="fixed inset-0 flex items-center justify-center z-50">
      <div className="bg-[#0E3746] md:w-[60%] w-[90%] md:h-[42%] h-[25%] rounded-lg p-6 text-white flex flex-col justify-center items-center relative">
        <h1 className="md:text-3xl text-xl font-semibold mb-4">
          Profile Updated
        </h1>
        <p className="md:text-base text-sm font-semibold">
          The Changes You made are applied Successfully
        </p>
        <button className="absolute top-[4%] right-[2%]" onClick={onClose}>
          <img
            src={closeIcon}
            alt="close-icon"
            className="w-6 cursor-pointer"
          />
        </button>
      </div>
    </Container>
  );
};

export default SuccessModal;
