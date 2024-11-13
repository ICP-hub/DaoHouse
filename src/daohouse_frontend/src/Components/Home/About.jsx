import React from "react";
import Container from "../Container/Container";
import { useNavigate } from "react-router-dom";

const About = () => {
  const navigate = useNavigate();

  const handleJoinDaoClick = () => {
    navigate("/dao");
  };

  return (
    <div className="flex justify-center items-center p-4">
      {/* Mobile and Tablet view */}
      <div className="block lg:hidden bg-[#0F3746] rounded-2xl w-full max-w-md shadow-lg p-6 md:p-8 lg:p-10 mx-4 opacity-100">
        <Container>
          <div className="text-white flex flex-col items-center text-center">
            <div className="mb-4">
              <h2 className="font-mulish text-xs font-bold tracking-wider mb-2">
                ABOUT PLATFORM
              </h2>
              <p className="font-mulish font-bold text-lg md:text-xl leading-tight">
                Unlocking Collective Intelligence
              </p>
            </div>
            <div className="flex flex-col gap-4 text-xs md:text-sm leading-normal font-mulish">
              <p>
                At our platform, decentralized autonomous organization meets cutting-edge technology to revolutionize the way communities govern themselves.
              </p>
              <p>
                We believe in the power of collective intelligence and the potential for blockchain technology to democratize decision-making processes. Our platform provides a seamless and transparent framework for organizations of all sizes to manage resources, vote on proposals, and drive impactful change.
              </p>
            </div>
            <div className="mt-6">
              <button
                onClick={handleJoinDaoClick}
                className="px-6 py-2 bg-white text-black font-normal rounded-full shadow-md hover:bg-gray-200 hover:text-blue-900 transition-colors duration-300"
              >
                Join DAO
              </button>
            </div>
          </div>
        </Container>
      </div>

      {/* Desktop view */}
      <div className="hidden lg:flex justify-center items-center w-full">
        <Container>
          <div className="bg-[#0F3746] rounded-2xl w-full max-w-4xl shadow-lg p-12">
            <div className="text-white flex flex-col items-center text-center">
              <div className="mb-4">
                <h2 className="font-mulish text-sm md:text-base font-normal tracking-wide mb-2">
                  ABOUT PLATFORM
                </h2>
                <p className="font-mulish font-bold text-2xl md:text-3xl leading-snug">
                  Unlocking Collective Intelligence
                </p>
              </div>
              <div className="flex flex-col gap-4 font-mulish text-sm md:text-base leading-relaxed text-center">
                <p>
                  At our platform, decentralized autonomous organization meets cutting-edge technology to revolutionize the way communities govern themselves.
                </p>
                <p>
                  We believe in the power of collective intelligence and the potential for blockchain technology to democratize decision-making processes. Our platform provides a seamless and transparent framework for organizations of all sizes to manage resources, vote on proposals, and drive impactful change.
                </p>
              </div>

              <div className="mt-6">
                <button
                  onClick={handleJoinDaoClick}
                  className="px-8 py-3 bg-white text-black font-normal rounded-full shadow-md hover:bg-gray-200 hover:text-blue-900 transition-colors duration-300"
                >
                  Join DAO
                </button>
              </div>
            </div>
          </div>
        </Container>
      </div>
    </div>
  );
};

export default About;
