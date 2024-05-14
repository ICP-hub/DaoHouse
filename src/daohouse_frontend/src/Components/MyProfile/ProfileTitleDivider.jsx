import React from "react";

const ProfileTitleDivider = ({ title }) => {
  return (
    <div className="flex justify-between items-center md:gap-4 gap-0 my-profile">
      <h1 className="md:text-[40px] text-[24px] p-2 text-white">{title}</h1>
      <div className="flex flex-col items-start">
        <div className="md:w-32 w-[60px] md:border-t-2 border-t-[1px] border-white BigLine"></div>
        <div className="md:w-14 w-[40px] md:mt-2 mt-1 md:border-t-2 border-t-[1px] border-white SmallLine"></div>
      </div>
    </div>
  );
};

export default ProfileTitleDivider;
