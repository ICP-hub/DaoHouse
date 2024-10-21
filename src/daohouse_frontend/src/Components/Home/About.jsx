import React from "react";
import Container from "../Container/Container";
import { useNavigate } from "react-router-dom";

const About = () => {
  const navigate = useNavigate();

  const handleJoinDaoClick = () => {
    navigate("/dao");
  };

  return (
    <div className="flex justify-center  items-center  ">
      {/* Mobile view */}
      <div className="block lg:hidden bg-[#0F3746] rounded-[8px] w-[324px] h-[315px] shadow-lg p-[20px_32px] gap-[16px]  translate-y-[50px] opacity-100">
        <Container>
          <div className="w-full text-white flex flex-col items-center relative text-center">
            <div className="mb-4">
              <h2 className="font-mulish text-[8px] font-bold leading-[12px] tracking-[0.04em] text-center mb-2">
                ABOUT PLATFORM
              </h2>
              <p className="font-mulish font-bold text-[16px] leading-[20px] text-center">
                Unlocking Collective Intelligence
              </p>
            </div>
            <div className="flex flex-col gap-[16px] font-mulish text-[10px] font-normal leading-[14px] text-center">
              <p>
                At our platform, decentralized autonomous
                <p> organization meets cutting-edge technology to</p> revolutionize the way communities govern themselves.
              </p>
              <p>
                We believe in the power of collective intelligence and<p>the potential for blockchain technology to democratize</p>
                <p> decision-making processes. Our platform provides a</p> 
                 seamless and transparent framework for organizations of all sizes to manage resources, vote on proposals, and drive impactful change.
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
        </Container>
      </div>

      {/* Desktop view  add container with in div */}
      <div className="flex justify-center  items-center  ">
        <Container>
        <div className="hidden lg:flex justify-center w-[1142px] bg-[#0F3746] rounded-2xl  translate-y-[-50px] shadow-lg p-10">
          <div className="w-full text-white flex flex-col items-center relative text-center">
            {/* Title */}
            <div className="mb-4">
              <h2 className="font-mulish text-[12px] md:text-[16px] font-normal mb-2">
                ABOUT PLATFORM
              </h2>
              <p className="font-mulish font-bold text-[24px] sm:text-[28px] md:text-[32px] leading-snug">
                Unlocking Collective Intelligence
              </p>
            </div>

            {/* Description */}
            <div className="flex flex-col gap-4 font-mulish text-[12px] sm:text-[14px] md:text-[16px] leading-relaxed text-left lg:text-center">
              <span className="block mb-1">
                At our platform, decentralized autonomous organization meets cutting-edge 
                <span className="block">technology to revolutionize the way communities govern themselves.</span>
              </span>
             
              <span className="block">
                We believe in the power of collective intelligence and the potential for blockchain
                <span className="block"> technology to democratize decision-making processes. Our platform provides a</span>
                <span className='block'>seamless and transparent framework for organizations of all sizes to manage</span> 
                resources, vote on proposals, and drive impactful change.
              </span>
            </div>

            {/* Join DAO Button */}
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
