import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Lottie from "react-lottie";
import BigCircleComponent from "../../../Components/Ellipse-Animation/BigCircle/BigCircleComponent";
import SmallCircleComponent from "../../../Components/Ellipse-Animation/SmallCircle/SmallCircleComponent";
import MediumCircleComponent from "../../../Components/Ellipse-Animation/MediumCircle/MediumCircleComponent";
import BigCircleAnimation from "../../../Components/Ellipse-Animation/BigCircle/BigCircleAnimation.json";
import SmallCircleAnimation from "../../../Components/Ellipse-Animation/SmallCircle/SmallCircleAnimation.json";
import BigCircle from "../../../../assets/BigCircle.png";
import MediumCircle from "../../../../assets/MediumCircle.png";
import SmallestCircle from "../../../../assets/SmallestCircle.png";
import MyProfileRectangle from "../../../../assets/MyProfileRectangle.png";
import { BsPlusLg } from "react-icons/bs";
import TableComponent from "../../../Components/Proposals/MyProposals/TableComponent";
import Container from "../../../Components/Container/Container";



const MyProposals = () => {
  const className = "DaoProfile";
  const [activeLink, setActiveLink] = useState("proposals");
  const navigate = useNavigate();

  const handleClick = (linkName) => {
    setActiveLink(linkName);
    navigate(`/dao/profile/${linkName}`);
  };

  // Animation options for the big circle
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: BigCircleAnimation,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
      id: "lottie-bigCircle",
    },
  };

  // Animation options for the small circle
  const defaultOptions2 = {
    loop: true,
    autoplay: true,
    animationData: SmallCircleAnimation,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
      id: "lottie-smallCircle",
    },
  };

  // Animation options for the medium circle
  const defaultOptions3 = {
    loop: true,
    autoplay: true,
    animationData: SmallCircleAnimation,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
      id: "lottie-mediumCircle",
    },
  };
  const data = [
    { id: '#125', description: 'Lorem ipsum dolor sit amet, consectetur...more', submitExpire: '01-01-24 / 07-01-24', favourAgainst: '7/3', status: 'In Progress' },
    { id: '#126', description: 'Lorem ipsum dolor sit amet, consectetur...more', submitExpire: '01-01-24 / 07-01-24', favourAgainst: '7/8', status: 'Rejected' },
    { id: '#127', description: 'Lorem ipsum dolor sit amet, consectetur...more', submitExpire: '01-01-24 / 07-01-24', favourAgainst: '7/3', status: 'Approved' },
    { id: '#128', description: 'Lorem ipsum dolor sit amet, consectetur...more', submitExpire: '01-01-24 / 07-01-24', favourAgainst: '7/3', status: 'Approved' },
    { id: '#129', description: 'Lorem ipsum dolor sit amet, consectetur...more', submitExpire: '01-01-24 / 07-01-24', favourAgainst: '7/3', status: 'Expired' },
    { id: '#130', description: 'Lorem ipsum dolor sit amet, consectetur...more', submitExpire: '01-01-24 / 07-01-24', favourAgainst: '7/3', status: 'In Progress' },
  ];

  return (
    <div className={className + " bg-zinc-200 w-full relative"}>
      <div style={{
          backgroundImage: `url("${MyProfileRectangle}")`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          backgroundPosition: "center",
          maxHeight :"200px"
        }}>
        <Container classes={`__topComponent w-full lg:h-[25vh] h-[20vh] p-20 flex flex-col items-start justify-center relative hero-container`}>
        <div className="absolute z-22 top-0 left-0 w-full h-full overflow-x-hidden">
          {/* Big circle image */}
          <div className="absolute md:right-[3.7%] -right-[3.7%] top-1/2 -translate-y-1/2">
            <div className="relative tablet:w-[96px] tablet:h-[96px] md:w-[88.19px] md:h-[88.19px] w-[65px] h-[65px]">
              <BigCircleComponent imgSrc={BigCircle} />
            </div>

            {/* Big circle animation */}
            <div className="absolute inset-0 flex items-center justify-center z-20">
              <div className="tablet:w-[112px] tablet:h-[112px] md:w-[104px] md:h-[104px] w-[75px] h-[75px]">
                <Lottie
                  options={defaultOptions}
                  style={{ width: "100%", height: "100%" }}
                />
              </div>
            </div>
          </div>

          <div className="absolute right-[25%] -translate-y-full top-[30%]">
            <div className="relative tablet:w-[43px] tablet:h-[43px] md:w-[33.3px] md:h-[33.3px] w-[21.19px] h-[21.19px]">
              {/* Smallest circle image */}

              <SmallCircleComponent imgSrc={SmallestCircle} />
            </div>

            {/* Small circle animation */}
            <div className="absolute inset-0 flex items-center justify-center z-20">
              <div className="tablet:w-[47px] tablet:h-[47px] md:w-[37.3px] md:h-[37.3px] w-[23.19px] h-[23.19px]">
                <Lottie
                  options={defaultOptions2}
                  style={{ width: "100%", height: "100%" }}
                />
              </div>
            </div>
          </div>

          {/* Medium circle image */}
          <div className="absolute right-[45%] -translate-y-full top-[95%]">
            <div className="relative tablet:w-[52px] tablet:h-[52px] md:w-[43.25px] md:h-[43.25px] w-[29.28px] h-[29.28px] ">
              <MediumCircleComponent imgSrc={MediumCircle} />
            </div>

            {/* Medium circle animation */}
            <div className="absolute inset-0 flex items-center justify-center z-20">
              <div className="tablet:w-[60px] tablet:h-[60px] md:w-[47.25px] md:h-[47.25px] w-[33.28px] h-[33.28px]">
                <Lottie
                  options={defaultOptions3}
                  style={{ width: "100%", height: "100%" }}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="absolute flex justify-start top-0 left-9 p-8 z-30 ">
          <div className="text-white text-[40px] font-normal">
            My Proposals
          </div>
          <div className="flex justify-center items-baseline mt-2 items-center mx-4 left-[18%] z-30 flex space-x-2 flex-col gap-2">
            <span className="border-b border-white w-20" />
            <span className="border-b border-white w-10" />
          </div>
        </div>
        </Container>
      </div>

      <Container>
      <div className="flex-1 h-screen">
        <div className="flex items-center justify-between px-9">
          <h1 className="text-[#05212C] text-[30px] px-4">Proposal Dashboard</h1>


          <button onClick={() => {
            navigate("/create-proposal");
          }} className="ml-auto my-4 mx-4 bg-white text-[16px] text-[#05212C] gap-1 px-7 shadow-xl py-4 px-4 rounded-full shadow-md flex items-center space-x-4 rounded-2xl">
            <BsPlusLg className='mx-1' size={19} />
            Create New Proposals
          </button>
        </div>



        <TableComponent data={data} />

      </div>
      </Container>

    </div>
  );
};

export default MyProposals;

