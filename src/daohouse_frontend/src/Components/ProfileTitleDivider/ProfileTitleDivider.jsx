import React from "react";

const ProfileTitleDivider = ({ title }) => {
  const className = "ProfileTitleDivider";

  return (
    <div
      className={
        className +
        " flex justify-between items-center md:gap-4 gap-0 my-profile p-3"
      }
    >
      <h1 className="lg:text-[40px] md:text-[32px] text-[24px] font-mulish p-2 text-white transform translate-y-[-20px]">
        Profile
      </h1>
      <div className="flex flex-col items-start">
       {/* <div className="lg:w-32 md:w-24 w-[60px] md:border-t-2 border-t-[1px] border-white BigLine translate-y-[-35px]"></div>
        <div className="lg:w-14 md:w-12 w-[40px] md:mt-2 mt-1 md:border-t-2 border-t-[1px] border-white SmallLine translate-y-[-35px]"></div> */}
      </div>
    </div>
  );
};

export default ProfileTitleDivider;
