import React from "react";
import Xtag from "../../../assets/Xtag.png";

const EditTags = ({ editTags }) => {
  return (
    <div className="bg-[#FFFFFF] md:text-[16px] text-[12px] font-normal text-[#646464] md:py-3 md:px-5 p-3 my-2 rounded-lg">
      <div className="flex flex-wrap">
        {editTags.map((editTag, index) => (
          <span
            key={index}
            className="md:mr-3 mr-2 my-2 py-2 md:pl-12 pl-6 rounded-full bg-[#DFE9EE] font-normal text-[#05212C] flex items-center justify-between"
            style={{
              boxShadow:
                "0px 0.46px 2.56px 0px #00000003, 0px 2.04px 5.3px 0px #00000005, 0px 5px 10.56px 0px #00000006, 0px 9.63px 20.7px 0px #00000008, 0px 16.2px 38.07px 0px #0000000A, 0px 25px 65px 0px #0000000D",
            }}
          >
            {editTag}
            <img
              src={Xtag}
              alt="cross-icon"
              className="ml-8 mr-4 w-[10px] cursor-pointer"
            />
          </span>
        ))}
      </div>
    </div>
  );
};

export default EditTags;
