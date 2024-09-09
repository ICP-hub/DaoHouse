import React from "react";
import nodata from "../../../assets/nodata.png";
const NoFollowers = () => {
  return (
    <div className="w-full max-w-[93%] mx-auto flex flex-col items-center justify-center p-4 bg-slate-100 rounded-md">
      <img src={nodata} alt="No Data" className="mb-1" />
      <p className="text-center text-gray-700 text-[16px]">
        You have not  any followers yet!
      </p>
    </div>
  );
};

export default NoFollowers;
