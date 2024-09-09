import React from "react";

const MediumCircleComponent = ({ imgSrc }) => {
  return (
    <img
      src={imgSrc}
      alt="Medium Circle"
      className="absolute w-[36px] h-36[px] md:w-[52px] md:h-[52px] md:right-[40rem] right-[13rem] -translate-y-full md:top-[95%] top-[89%]"
    />
  );
};

export default MediumCircleComponent;
