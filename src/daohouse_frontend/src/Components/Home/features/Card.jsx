
import React from 'react';

const Card = ({ imageSrc, title, subtitle }) => {
  return (
    <div className="big_phone:w-80 w-[90%] overflow-hidden bg-white rounded-xl shadow-lg">
      <div className="overflow-hidden pl-2   bg-[#0F3746]">
        <img src={imageSrc} alt="Card Image" className="w-14 h-14 object-cover rounded-2xl p-2 " />
      </div>
      <div className="p-4 pt-2 rounded-b-lg bg-[#0F3746]">
        <h3 className="mobile:text-2xl text-xs font-normal  text-white mobiel:mb-4 mb-2 truncate">{title}</h3>
        <p className="text-white min-h-18 mobile:text-base text-sm font-normal overflow-hidden overflow-ellipsis h-35 mb-2">{subtitle}</p>
      </div>
    </div>
  );
};

export default Card;
