import React from "react";
import nodata1 from "../../../assets/nodata1.png";

const NoDataComponent = ({ setJoinedDAO  }) => {
  return (
    <div className="w-full flex flex-col items-center justify-center p-20">
      <img src={nodata1} alt="No Data" className="mb-4" />
      <p className="text-center text-gray-700 mb-4 text-[16px]">
        You have not created any DAO
      </p>
      {/* <button
        onClick={() => setJoinedDAO(true)}
        className="flex-1 bg-[#0E3746] border-2 border-[#0E3746] text-white px-8 py-2 rounded-[3rem]"
      >
        Join DAO
      </button> */}
    </div>
  );
};

export default NoDataComponent;
