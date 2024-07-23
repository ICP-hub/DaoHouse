import React from "react";
import { Link } from "react-router-dom";
import logo from "../../../assets/WhiteLogo.png";
import tw from "../../../assets/tw.png";
import telegram from "../../../assets/telegram.png";
import linkedin from "../../../assets/linkedin.png";
import discord from "../../../assets/discord.png";

const Footer = () => {
  return (
    <React.Fragment>
      <footer className="bg-[#05212C] small_phone:py-12 py-8 text-center">
        <div className="w-full small_phone:mb-8 mb-4">
          <Link to="/">
            <img
              src={logo}
              alt="DAO HOuse"
              className="small_phone:w-32 w-20 mx-auto small_phone:mb-10 mb-6"
            />
               
          </Link>
          <div className="flex justify-center mb-4 gap-x-3">
            <Link
              to="/"
              className="text-[#728288] small_phone:text-base text-sm font-inter font-normal hover:underline"
            >
              Home
            </Link>
            <Link
              to="/social-feed"
              className="text-[#728288] small_phone:text-base text-sm font-inter font-norma  hover:underline"
            >
              Social Feed
            </Link>
            <Link
              to="/dao"
              className="text-[#728288] small_phone:text-base text-sm font-inter font-norma  hover:underline"
            >
              DAOs
            </Link>
            <Link
              to="/proposals"
              className="text-[#728288] small_phone:text-base tex-sm font-inter font-norma r:underline"
            >
              Proposals
            </Link>
          </div>
          <div className="flex justify-center mb-4 gap-4">
            <img
              src={tw}
              alt="Twitter"
              className="small_phone:w-8 w-6 small_phone:h-8 h-6 object-contain"
            />
            <img
              src={telegram}
              alt="Telegram"
              className="small_phone:w-8 w-6 small_phone:h-8 h-6 object-contain"
            />
            <img
              src={linkedin}
              alt="LinkedIn"
              className="small_phone:w-8 w-6 small_phone:h-8 h-6 object-contain"
            />
            <img
              src={discord}
              alt="Discord"
              className="small_phone:w-8 w-6 small_phone:h-8 h-6 object-contain"
            />
          </div>
        </div>
      </footer>
      <div className="bg-[#0E3746] py-4 flex justify-center items-center">
        <p className="text-white font-inter font-normal  text-[10px] md:text-base ">
          &copy; {new Date().getFullYear()}, DAO House. All rights reserved.
        </p>
      </div>
    </React.Fragment>
  );
};

export default Footer;
