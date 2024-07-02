import React from "react";
import herosectionleftbottomimg from "../../../assets/herosection.png";
import herosectiongradient from "../../../assets/herosectiongradient.png";
import circle from "../../../assets/circle.png";

const HeroSection = () => {
  return (
    <div className="relative flex flex-col md:flex-row justify-center items-center h-[90vh]">
      {/* Left Side */}
      <div className="md:w-1/2 pl-20 w-full px-10 z-10 md:text-left text-center small_phone:mt-0 mt-8 flex flex-col mobile:gap-8 gap-4">
        <p className="text-[#0E3746] font-mulish font-semibold laptop:text-6xl small_phone:text-5xl text-4xl">
          Building Better Future, Together
        </p>
        <div className="text-black font-inter text-sm">
          Efficiently Manage Resources and Proposals with Our DAO Tools
        </div>

        <div className="flex flex-row big_phone:justify-start justify-center space-x-4">
          <button className="px-4 py-2 mobile:text-sm text-sm bg-[#0E3746] text-white font-semibold rounded-[27.5px] shadow-md hover:bg-blue-800 hover:text-white">
            Create DAO
          </button>
          <button className="px-4 py-2 mobile:text-sm text-sm bg-white text-black font-normal rounded-[27.5px] shadow-md hover:bg-gray-200 hover:text-blue-900">
            Join DAO
          </button>
        </div>
      </div>

      <img
        src={herosectiongradient}
        alt="hero section gradient"
        className="absolute pointer-events-none select-none bottom-0 left-0 mb-24 ml-4 animate-gradient"
      />
      <img
        src={herosectionleftbottomimg}
        alt="Bottom Left Image"
        className="absolute pointer-events-none select-none bottom-0 left-0"
      />

      {/* Right Side */}
      <div className="md:w-1/2 flex items-center justify-center md:mt-0 mt-8">
        <div className="relative xl:w-[65%] lg:w-[80%] w-[75%]">
          <img
            src={circle}
            alt="Placeholder"
            className="w-full h-full md:mt-0 mt-8  md:w-[85%] pointer-events-none select-none lg:w-[90%] xl:w-[92%] 2xl:w-full h-full object-cover animate-spin-slow"
          />
        </div>
      </div>
    </div>
  );
};

export default HeroSection;