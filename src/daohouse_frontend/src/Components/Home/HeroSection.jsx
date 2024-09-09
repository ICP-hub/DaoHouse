import React from "react";
import herosectionleftbottomimg from "../../../assets/herosection.png";
import herosectiongradient from "../../../assets/herosectiongradient.png";
import circle from "../../../assets/circle.png";
import { useNavigate } from "react-router-dom";
import Container from "../Container/Container";

const HeroSection = () => {
  const navigate = useNavigate();

  const handlemov = () => {
    navigate("/dao/create-dao");
  };

  const handleJoinDaoClick = () => {
    navigate("/dao");
  };

  return (
    <Container>
  <div className="relative flex flex-col md:flex-row justify-center items-center  overflow-hidden">
    <div className="md:w-1/2 w-full px-20 py-8 flex flex-col items-center text-center items-center md:items-start text-center md:text-left mt-5  gap-4 md:gap-6 z-10">
    <p className="text-[#0E3746] font-mulish font-semibold text-4xl sm:text-5xl md:text-6xl">
    Building Better Future, Together
  </p>
  <div className="text-black font-inter text-sm md:text-base ">
    Efficiently Manage Resources and Proposals with Our DAO Tools
  </div>
  <div className="flex flex-col   md:items-start items-center text-center  flex-col md:flex-row gap-4 md:gap-6 mt-5">
    <button
      onClick={handlemov}
      className="px-6 py-3 text-base bg-[#0E3746] text-white font-semibold rounded-full shadow-md hover:bg-blue-800 hover:text-white"
    >
      Create DAO
    </button>
    <button
      onClick={handleJoinDaoClick}
      className="px-6 py-3 text-base bg-white text-black font-normal rounded-full shadow-md hover:bg-gray-200 hover:text-blue-900"
    >
      Join DAO
    </button>
  </div>
    </div>
    {/* Gradient and Bottom Left Image */}
    <div>
  <img
    src={herosectiongradient}
    alt="hero section gradient"
    className="absolute pointer-events-none select-none bottom-0 left-0 mb-24 md:mb-0 md:left-0 md:ml-4 animate-gradient"
  />
  <img
    src={herosectionleftbottomimg}
    alt="Bottom Left Image"
    className="absolute pointer-events-none select-none bottom-0 left-0" 
  />
</div>

{/* Right Side */}
<div className="md:w-1/2 w-full flex items-center justify-center  py-20">
  <div className="relative w-[60%] md:w-[71%] lg:w-[80%] xl:w-[70%] 2xl:w-[70%] h-auto">
    <img
      src={circle}
      alt="Placeholder"
      className="w-full h-full object-cover animate-spin-slow"
    />
  </div>
</div>
</div>
</Container>

  );
};

export default HeroSection;
