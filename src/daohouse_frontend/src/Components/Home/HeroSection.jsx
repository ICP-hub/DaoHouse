import React from "react";
import bgLine from "../../../assets/bgLine.png";
import HeroGif from "../../../assets/gif/hero.gif";
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
    <Container className="w-full">
      <div className="flex justify-center  ">
        <img
          src={HeroGif}
          alt="hero section gradient"
          className="absolute translate-y-[-80px] mobile:translate-y-[-70px] md:translate-y-[-620px] tablet:translate-y-[-510px] h-[450px] md:h-[1080px] opacity-5 w-[650px]  sm:w-[600px]  md:w-[1100px] "
        />
      </div>

      {/* Desktop View */}
      <div className="relative hidden md:flex flex-col md:flex-row justify-center items-center md:translate-y-[-205px] md:translate-x-[-35] overflow-hidden">
        <div className="md:w-[600px] w-full px-2 py-8 flex flex-col items-center text-center md:items-start md:text-left mt-5 gap-4 md:gap-6 z-10">
          <img
            src={bgLine}
            alt="hero section gradient"
            className="absolute left-[77px] top-[44px] iphone12_pro:left-[100px] mini_phone:left-[85px] iphone_SE:left-[93px] small_phone:mb-12 small_phone:ml-[94px] small_phone:left-[18px] iphone14_pro_max:left-[26px] mt-[42px] w-[74px] mobile:left-[81px] md:top-[50px] md:mb-0 md:mt-[106px] md:left-[-25px] md:w-[182px] tablet:mt-[192px] tablet:left-[-3px] tablet:ml-[10px] tablet:w-[220px] z-[-1]"
          />
          <img
            src={bgLine}
            alt="hero section gradient"
            className="absolute right-[86px] top-[53px] w-[70px] mini_phone:right-[94px] iphone_SE:right-[103px] iphone12_pro:right-[109px] iphone14_pro_max:right-[129px] small_phone:w-[70px] small_phone:right-[121px] mobile:left-[286px] md:top-[50px] md:mb-0 md:mt-[36px] md:left-[345px] md:w-[174px] tablet:top-[126px] tablet:mb-0 tablet:mt-8 tablet:left-[338px] tablet:w-[210px] z-[-1]"
          />
          <div className="md:ml-[60px] lg:ml-[0px] mt-[-16px] md:mt-0 lg:mt-16 flex flex-col gap-0 md:gap-2 justify-center">
            <p className="text-[#0E3746] font-mulish font-bold text-center text-2xl md:text-6xl lg:text-[72px] justify-center">
              Building Better
            </p>
            <p className="text-[#0E3746] font-mulish font-bold text-center text-2xl md:text-6xl lg:text-[72px]">
              Future, Together
            </p>
          </div>
          <div className="text-[#525252] mt-[-10px] mobile:px-20 md:px-0 md:ml-15 text-center text-[10px] md:text-[16px] lg:text-[18px] font-inter mx-[84px] small_phone:mx-[100px] md:mx-[60px] lg:mx-[8px]">
            Efficiently Manage Resources and Proposals with Our DAO Tools
          </div>
          <div className="flex items-center text-center md:ml-40 lg:ml-28 md:items-center md:justify-center gap-2 mt-2 md:mt-4 md:translate-x-[10px]">
            <button
              onClick={handlemov}
              className="px-6 md:px-8 py-3 text-center text-[10px] md:text-sm lg:text-lg bg-[#0E3746] text-white rounded-full shadow-md hover:bg-blue-800 hover:text-white"
            >
              Create DAO
            </button>
            <button
              onClick={handleJoinDaoClick}
              className="px-8 py-3 text-[10px] md:text-sm lg:text-lg bg-white text-black font-normal rounded-full shadow-md hover:bg-gray-200 hover:text-blue-900"
            >
              Join DAO
            </button>
          </div>
        </div>
      </div>

      {/* Mobile View */}
      <div className="relative md:hidden flex flex-col justify-center items-center translate-y-[-180px]  overflow-hidden mt-[100px]">
      <div className="md:w-[600px] w-full px-2 py-8 flex flex-col items-center text-center md:items-start md:text-left mt-5 gap-4 md:gap-6 z-10 mobile-margin-heading">
          <img
            src={bgLine}
            alt="hero section gradient"
            className="sm:top-[210px] top-[185px] right-[62%] sm:right-[65%] w-[90px]  z-[-1] sticky highlight-heading"
          />
          <img
            src={bgLine}
            alt="hero section gradient"
            className="top-[125px] sm:top-[130px] left-[59%] sm:left-[60%]  w-[90px]  z-[-1] sticky highlight-heading"
          />
          <div className="md:ml-[60px] lg:ml-[0px] mt-[-16px] md:mt-0 lg:mt-16 flex flex-col gap-0 md:gap-2 justify-center">
            <p className="text-[#0E3746] font-mulish font-bold text-center text-[40px] sm:text-[50px] md:text-6xl lg:text-[72px] justify-center home-mobile-text">
              Building Better
            </p>
            <p className="text-[#0E3746] font-mulish font-bold text-center text-[40px] sm:text-[50px] md:text-6xl lg:text-[72px] home-mobile-text">
              Future, Together
            </p>
          </div>
          <div className="text-[#525252] mt-[-10px] mobile:px-20 md:px-0 md:ml-15 text-center text-[15px] md:text-[16px] lg:text-[18px] font-inter mx-[84px] small_phone:mx-[100px] md:mx-[60px] lg:mx-[8px]">
            Efficiently Manage Resources and Proposals with Our DAO Tools
          </div>
          <div className="flex flex-col sm:flex-row items-center text-center md:ml-40 lg:ml-28 md:items-center md:justify-center gap-3 mt-2 md:mt-4">
            <button
              onClick={handlemov}
              className="px-6 md:px-8 py-3 text-center text-[10px] md:text-sm lg:text-lg bg-[#0E3746] text-white rounded-full shadow-md hover:bg-blue-800 hover:text-white"
            >
              Create DAO
            </button>
            <button
              onClick={handleJoinDaoClick}
              className="px-8 py-3 text-[10px] md:text-sm lg:text-lg bg-white text-black font-normal rounded-full shadow-md hover:bg-gray-200 hover:text-blue-900"
            >
              Join DAO
            </button>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default HeroSection;