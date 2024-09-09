import React from "react";

const BigCircleComponent = ({ imgSrc }) => {
  return (
    <img
      src={imgSrc}
      alt="Big Circle"
      className="absolute md:w-[96px] md:h-[96px] w-[65px] h-[65px] md:right-[76px] right-[-10px] top-1/2 -translate-y-1/2"
    />
  );
};

export default BigCircleComponent;
