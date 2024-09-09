import React from "react";
import about from "../../../assets/gif/about.gif";
import smallelipse from "../../../assets/smallElipse.png";
import bigellipse from "../../../assets/bigEllipse.png";
import SmallCircleAnimation from "../../Components/Ellipse-Animation/SmallCircle/SmallCircleAnimation.json";
import Lottie from "react-lottie";
import Container from "../Container/Container";
import { useNavigate } from "react-router-dom";

const About = () => {
  const navigate = useNavigate();
  const defaultOptions2 = {
    loop: true,
    autoplay: true,
    animationData: SmallCircleAnimation,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
      id: "lottie-smallCircle",
    },
  };

  const handleJoinDaoClick = () => {
    navigate("/dao");
  };

  return (
    <div className="bg-[#05212C] ">
      <Container classes={'relative flex justify-center items-center py-8'}>
        <div className="absolute pointer-events-none select-none xl:left-[40%] 2xl:left-[40%] lg:left-[35%] md:left-[35%] left-0 md:top-0 top-[18%] mt-8">
          <div>
            <img
              src={smallelipse}
              alt="Small Ellipse"
              className="relative lg:w-[66px] lg:h-[61px] md:w-[59px] md:h-[59px]"
            />
          </div>
          <div className="absolute inset-0 flex items-center justify-center z-20">
            <div className="lg:w-[76px] lg:h-[76px] md:w-[69px] md:h-[69px] w-[75px] h-[75px]">
              <Lottie
                options={defaultOptions2}
                style={{ width: "100%", height: "100%" }}
              />
            </div>
          </div>
        </div>

        <div className="w-[100vw] hidden md:block my-8">
          <img
            src={about}
            alt="Image"
            className="w-full h-auto rounded-r-full pointer-events-none select-none"
          />
        </div>

        <div className="md:w-60% w-full lg:p-8 text-white lg:mx-16 md:mx-4 mx-10 flex flex-col items-center relative z-10">
          <div className="lg:px-8 md:px-8 md:ml-0 relative z-50 md:z-0 mb-2">
            <h2 className="text-about-heading font-mulish font-normal text-[16px] md:text-[16px] lg:text-[16px] leading-tight mt-4 mb-1">
              About Platform
            </h2>
            <p className="text-about-subheading font-mulish font-medium text-[32px] lg:text-[40px] leading-tight mt-1">
              Unlocking Collective Intelligence
            </p>
          </div>

          <div className="w-[50vw] md:hidden my-4 relative z-10">
            <img
              src={about}
              alt="Image"
              className="w-full h-auto rounded-3xl pointer-events-none select-none"
            />
          </div>

          <div className="flex flex-col items-start gap-4 md:w-[480px] lg:w-[620px] font-mulish font-normal text-[12px] md:text-[14px] lg:text-[16px] md:px-8 md:pb-8 md:mx-0 md:my-4 lg:mr-6 relative z-10">
            <p className="pr-4">
              At our platform, decentralized autonomous organization meets
              cutting-edge technology to revolutionize the way communities govern
              themselves.
            </p>
            <p className="pr-4">
              We believe in the power of collective intelligence and the potential
              for blockchain technology to democratize decision-making processes.
              Our platform provides a seamless and transparent framework for
              organizations of all sizes to manage resources, vote on proposals,
              and drive impactful change.
            </p>
            
            <button
              onClick={handleJoinDaoClick}
              className="px-8 py-3 bg-white text-black font-normal rounded-[27.5px] shadow-md hover:bg-gray-200 hover:text-blue-900">
              Join DAO
            </button>
          </div>
        </div>

        <div className="absolute lg:bottom-0 md:-bottom-5 -bottom-2 md:right-0 -right-6 mr-8 mb-8 pointer-events-none select-none z-0 md:z-20">
          <div>
            <img
              src={bigellipse}
              alt="Big Ellipse"
              className="relative lg:w-[122px] lg:h-[122px] md:w-[104px] h-[104px]"
            />
          </div>
          <div className="absolute inset-0 flex items-center justify-center z-20">
            <div className="lg:w-[142px] lg:h-[142px] md:w-[124px] h-[124px]">
              <Lottie
                options={defaultOptions2}
                style={{ width: "100%", height: "100%" }}
              />
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default About;
