import React from "react";
import { Link } from "react-router-dom";
import BlackLogo from "../../../assets/BlackLogo.png";
import tw1 from "../../../assets/tw1.png";
import telegram1 from "../../../assets/telegram1.png";
import likedin from "../../../assets/likedin.png";
import discord1 from "../../../assets/discord1.png";

import Container from "../Container/Container";

const Footer = () => {
  const handleLogoClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <React.Fragment>
      <footer className="bg-[#ffffff]  h-auto small_phone:py-12  py-5 text-center   ">
      <Container>
        {/* Main Content */}
        {/* <div className="w-full flex flex-col md:flex-row items-center justify-between small_phone:mb-8 lg:gap-[270px] md:gap-[200px] gap-8 border border-red-300"> */}
        <div className="w-full flex flex-col md:flex-row  px-20px   items-center justify-between small_phone:mb-8 lg:gap-[200px] md:gap-[80px] gap-8 ">
          {/* Logo Section */}
          <Link to="/" onClick={handleLogoClick}>
            <img
              src={BlackLogo}
              alt="DAO House"
              className="small_phone:w-32 w-20 mx-auto translate-y-0 translate-y-[28px] small_phone:mb-10 mb-6 lg:ml-20 lg:mx-0 md:justify-center md:mx-auto"
            />
          </Link>

          {/* Navigation Links */}
          <div className=" flex lg:flex-row translate-y-[22px] justify-center lg:mt-3 md:ml-14 md:mb-12 my-1 gap-6">
            <Link
              to="/"
              className="text-[#3D3D3D] small_phone:text-base text-sm font-inter font-normal hover:underline"
            >
              Home
            </Link>
            <Link
              to="/social-feed"
              className="text-[#3D3D3D] small_phone:text-base text-sm font-inter font-normal hover:underline"
            >
              Social Feed
            </Link>
            <Link
              to="/dao"
              className="text-[#3D3D3D] small_phone:text-base text-sm font-inter font-normal hover:underline"
            >
              DAOs
            </Link>
          </div>

          {/* Social Icons */}
          <div className="flex  items-center translate-y-0 translate-y-[10px] gap-6 my-4 lg:mr-20">
            <img
              src={telegram1}
              alt="Telegram"
              className="small_phone:w-8 w-6 small_phone:h-8 h-6 object-contain"
            />
            <img
              src={tw1}
              alt="Twitter"
              className="small_phone:w-8 w-6 small_phone:h-8 h-6 object-contain"
            />
            <img
              src={likedin}
              alt="LinkedIn"
              className="small_phone:w-8 w-6 small_phone:h-8 h-6 object-contain"
            />
            <img
              src={discord1}
              alt="Discord"
              className="small_phone:w-8 w-6 small_phone:h-8 h-6 object-contain"
            />
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="bg-[#ffffff] py-4 flex justify-center items-center">
          <p className="text-black font-inter font-normal md:text-base">
            All rights reserved. &copy; {new Date().getFullYear()}, DAO House.
          </p>
        </div>
        </Container>
      </footer>
    </React.Fragment>
  );
};

export default Footer;
