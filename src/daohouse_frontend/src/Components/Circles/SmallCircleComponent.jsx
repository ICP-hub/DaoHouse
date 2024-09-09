import React from "react";

const SmallCircleComponent = ({ imgSrc }) => {
  return (
    <img
      src={imgSrc}
      alt="Small Circle"
      className="absolute md:w-[43px] md:h-[43px] w-[26px] h-[26px] md:right-[25rem] right-[8.5rem] -translate-y-full md:top-[30%] top-[24%]"
    />
  );
};

export default SmallCircleComponent;
