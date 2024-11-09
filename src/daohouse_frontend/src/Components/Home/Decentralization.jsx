import React, { useEffect, useState } from "react";
import "./Decentralization.scss";

import Container from "../Container/Container";
import { useNavigate } from "react-router-dom";
import smallcircle from "../../../assets/smallcircle.png";
import mediumcircle from "../../../assets/mediumcircle.png";
import mobileviewCircleBig from "../../../assets/mobileviewCircleBig.png";
import mobilecircleSmall from "../../../assets/mobilecircleSmall.png";
import { useAuth, useAuthClient } from "../../Components/utils/useAuthClient";


const Decentralization = () => {
  const className = "Decentralization";
  const { backendActor } = useAuth();
  const [analtics, setGetAnaltics] = useState({});
  const navigate = useNavigate();

  const handleJoinDaoClick = () => {
    navigate("/dao");
  };
  const daosdata = analtics?.dao_counts ? Number(analtics.dao_counts) : 0;
  const propsaldata = analtics?.proposals_count ? Number(analtics.proposals_count) : 0;
  const membersdata = analtics?.members_count ? Number(analtics.members_count) : 0;
  const getanaltics = async () => {
  

    try {
      const response = await backendActor?.get_analytics();
      console.log("anltyics_API_response", response);
      setGetAnaltics(response?.Ok || {});
    } catch (error) {
      console.error("Error fetching analytics:", error);
    }
  };

  useEffect(() => {
    getanaltics();
  }, [backendActor]);

  return (
    <div
      className={
        className +
        " w-full bg-[#E0E0E0]  flex items-center justify-center bg-gradient-to-t from-[#0E3746]/100 via-[#0E3746]/80 to-[#F5F5F5]"
      }
    >
      <Container classes={"flex flex-col items-center justify-center relative max-w-full px-4"}>
        {/* Main Section */}
        <div className="relative w-full max-w-[110%] lg:mx-80 sm:max-w-[90%] md:max-w-[190%] px-4 sm:px-6 md:px-8 lg:px-16 tablet:px-8 mobile:px-4 flex flex-col items-center justify-center gap-8 bg-white rounded-xl shadow-lg h-auto mt-8 p-6 sm:p-8 md:p-10 lg:p-12 overflow-hidden main-section">

          {/* Circles as Background (Large screen)*/}
   
          <img
            src={smallcircle}
            alt="small circle"
            className="small-circle hidden md:block"
          />
          <img
            src={mediumcircle}
            alt="medium circle"
            className="medium-circle hidden md:block"
          />

          {/* Mobile screen circles (shown only on mobile screens) */}
          <img
            src={mobileviewCircleBig}
            alt="mobile large circle"
            className="block md:hidden w-[350px] h-[295px] absolute top-[-30px] item-centre  border-t-[11.25px] opacity-100"
          />
          <img
            src={mobilecircleSmall}
            alt="mobile small circle"
            className="block md:hidden w-[230px] h-[240px] absolute top-[-6px] rounded-tl-[60px]  opacity-100"
          />



          {/* Text Section */}
          <div className="w-full text-center flex flex-col items-center gap-2 lg:gap-6 z-10">
            <h1 className=" font-mulish text-xl md:text-xl lg:text-4xl text-[#0F3746] font-bold">
              <span className="block">Bringing Decentralization to Life:</span>
              <span className="block">Empowering Communities through</span>
              <span className="block">Seamless DAO Management</span>
            </h1>

            <p className="text-xs mobile:text-sm sm:text-sm font-mulish md:text-base text-gray-700 mt-2 max-w-[90%] sm:max-w-[80%] md:max-w-[70%]">
              <span className="block">Our platform provides the tools and infrastructure needed to establish</span>
              <span className="block">and manage your own decentralized autonomous organizations.</span>
            </p>

            <button
              onClick={handleJoinDaoClick}
              className="px-8 mobile:px-10 sm:px-8 md:px-10 py-3 mobile:py-3 sm:py-2 md:py-4 text-sm mobile:text-base sm:text-sm md:text-lg bg-white text-black font-normal rounded-[27.5px] shadow-lg border border-gray-300 hover:bg-gray-200"
            >
              Join DAO
            </button>
          </div>
        </div>

       {/* Statistics Section */}
<div className="w-full bg-transparent py-8 z-10 overflow-x-auto translate-y-[10px]">
  <div className="w-full max-w-8xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 px-4 sm:px-4 md:px-8 py-4 text-center text-white">
    <div className="stat-card bg-transparent border border-white rounded-lg py-2 flex justify-center relative overflow-hidden">
      <div className="text-center">
        <h1 className="text-lg md:text-2xl font-mulish mb-2">Members</h1>
        <p className="stat-number text-5xl font-mulish md:text-7xl">{membersdata}</p>
      </div>
    </div>
    {/* Proposals */}
    <div className="stat-card bg-transparent border border-white rounded-lg py-2 flex justify-center relative overflow-hidden">
      <div className="text-center">
        <h1 className="text-lg md:text-2xl font-mulish mb-2">Proposals</h1>
        <p className="stat-number text-5xl font-mulish md:text-7xl">{propsaldata}</p>
      </div>
    </div>
    {/* DAOs */}
    <div className="stat-card bg-transparent border border-white rounded-lg py-2 flex justify-center relative overflow-hidden">
      <div className="text-center">
        <h1 className="text-lg md:text-2xl font-mulish mb-2">DAOs</h1>
        <p className="stat-number text-5xl font-mulish md:text-7xl">{daosdata}</p>
      </div>
    </div>
  </div>
</div>
      </Container>
    </div>
  );
};

export default Decentralization;
