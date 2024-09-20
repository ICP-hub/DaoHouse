import React from "react";
import "./Decentralization.scss";
import decentralize from "../../../assets/gif/cropped.gif";
import Container from "../Container/Container";
import { useNavigate } from "react-router-dom";

const Decentralization = () => {
  const className = "Decentralization";
  const navigate = useNavigate()

  const handleJoinDaoClick = () => {
    navigate("/dao")
  }

  return (
    <div className={className + " w-full bg-image-background pb-28"}>
      <Container classes={'flex flex-col items-center justify-center'}> 
        <div className={className + "__movingTexts pointer-events-none select-none w-full py-6 flex flex-row overflow-auto"}>
          <h1 className="text-white text-6xl  md:text-9xl font-semibold">DECENTRALIZATION.</h1>
          <h1 className="text-white text-6xl md:text-9xl font-semibold">DECENTRALIZATION.</h1>
          <h1 className="text-white text-6xl md:text-9xl font-semibold">DECENTRALIZATION.</h1>
        </div>

        <div className="w-full laptop:px-20 tablet:px-16 mobile:px-20 px-10 flex flex-col big_phone:flex-row justify-between items-center">
          {/* Text Section */}
          <div className="w-full big_phone:w-1/2 md:pr-4 gap-6 flex flex-col items-center big_phone:items-start">
            <h2 className="big_phone:text-[32px] mobile:text-3xl text-2xl font-medium text-white text-center big_phone:text-left">
              Bringing Decentralization to Life: Empowering Communities through
              Seamless DAO Management
            </h2>
            <p className="mobile:text-1xl text-sm text-white text-center big_phone:text-left">
              Our platform provides the tools and infrastructure needed to
              establish and manage your own decentralized autonomous
              organizations.
            </p>

            <button 
              onClick={handleJoinDaoClick}
              className="mobile:px-8 px-6 mobile:py-3 py-2 mobile:text-base text-sm bg-white text-black font-normal rounded-[27.5px] shadow-md hover:bg-gray-200 hover:text-blue-900">
              Join DAO
            </button>
          </div>

          {/* Image Section */}
          <div className="w-full big_phone:w-1/2 big_phone:h-full h-42 flex justify-center items-center rounded-full">
            <img
              src={decentralize}
              alt="Right Image"
              className="big_phone:w-3/4 mobile:w-2/4 w-3/4 rounded-full pointer-events-none select-none"
            />
          </div>
        </div>
      </Container>
    </div>
  );
};

export default Decentralization;
