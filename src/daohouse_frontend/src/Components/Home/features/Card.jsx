
import React from 'react';

const Card = ({ imageSrc, title, subtitle }) => {
  return (
    <div className="big_phone:w-80 w-[90%] overflow-hidden bg-white rounded-xl shadow-lg">
      <div className="overflow-hidden  rounded-xl bg-white mobile:h-52 mobile:h-52 h-40">
        <img src={imageSrc} alt="Card Image" className="w-full h-full object-cover rounded-xl p-2" />
      </div>
      <div className="p-4 pt-2 rounded-b-lg bg-white">
        <h3 className="mobile:text-2xl text-lg font-normal  text-black mobiel:mb-4 mb-2 truncate">{title}</h3>
        <p className="text-black mobile:text-base text-sm font-normal overflow-hidden overflow-ellipsis h-35 mb-2">{subtitle}</p>
      </div>
    </div>
  );
};

export default Card;
