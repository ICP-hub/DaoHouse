import React from "react";
import nodata1 from "../../../assets/nodata1.png";

const NoDataComponent = ({ setJoinedDAO  }) => {
  return (
    <>
     <div className="hidden md:flex w-full max-w-[950px] h-[367px]  mx-auto flex-col items-center justify-center p-4 bg-slate-100 rounded-md">
        <img src={nodata1} alt="No Data" className="mb-1" />
        <p className="text-center text-gray-700 text-[16px]">
          No Data Available !
        </p>
      </div>

      {/* Mobile View (visible only on small screens) */}
      <div className="flex md:hidden w-full max-w-[320px] h-[248px] mx-auto flex-col items-center justify-center p-2 bg-slate-100 rounded-md gap-0">
        <img src={nodata1} alt="No Data" className="mb-1" />
        <p className="text-center text-gray-700 text-[14px]">
        No Data Available !
        </p>
      </div></>
  );
};

export default NoDataComponent;
