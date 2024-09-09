import React from "react";
import bmw from "../../../assets/bmw.png";
import starbucks from "../../../assets/starbucks.png";
import panda from "../../../assets/panda.png";
import image5 from "../../../assets/image5.png";
import pandg from "../../../assets/pandg.png";
import Widget from "./Widget";

const SupportingPartners = () => {
  return (
    <div className="bg-gray-200 mobile:py-[5rem] py-20  bottom-0">
      <div className="justify-center mt-[-130px] items-center flex">
        <Widget />
      </div>
      {/* <div className="container mx-auto text-center pt-4 mb-8 mt-8">
        <h2 className="text-2xl mobile:text-4xl font-medium mobile:mb-12 mb-4">
          Supporting Partners
        </h2>
      </div>
      <div className="container flex justify-between items-center mobile:px-20 px-8">
        <div className="flex gap-6">
          <img
            src={bmw}
            alt="BMW"
            className="tablet:w-36 mobile:w-28 w-20 h-auto rounded-full"
          />
        </div>
        <div className="flex gap-4">
        <img
            src={starbucks}
            alt="Starbucks"
            className="tablet:w-36 mobile:w-28 w-20 h-auto rounded-full"
          />
        </div>
        <img
          src={panda}
          alt="Panda"
          className="tablet:w-40 mobile:w-32 w-24 h-auto rounded-full"
        />
        <div className="flex gap-6">
          <img
            src={image5}
            alt="Image5"
            className="tablet:w-36 mobile:w-28 w-20 h-auto rounded-full"
          />
          </div>
          <div className="6">
          <img
            src={pandg}
            alt="P&G"
            className="tablet:w-36 mobile:w-28 w-20 h-auto rounded-full"
          />
        </div>
      </div> */}
    </div>
  );
};

export default SupportingPartners;
