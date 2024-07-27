import React from "react";
import { useNavigate } from "react-router-dom";

const DaoCard = ({ name, funds, members, groups, proposals, image_id }) => {
  const navigate = useNavigate();
  const canisterId = process.env.CANISTER_ID_IC_ASSET_HANDLER;
  const ImageUrl = `http://${canisterId}.localhost:4943/f/${image_id}`;
  const goToDaoProfile = () => {
    navigate("/dao/profile");
  };

  return (
    <div className="bg-[#F4F2EC] rounded-lg shadow-lg tablet:p-6 big_phone:p-3 small_phone:p-5 p-3 rounded-lg">
      <div className="flex justify-start items-start mb-4 gap-4">
        <div className="mobile:w-[207px] mobile:h-[120px] w-[150px] h-[70px] border border-black rounded">
          <img
            src={ImageUrl}
            alt="DAO Image"
            className="w-full h-full object-cover rounded"
          />
        </div>
        <h2 className="mobile:text-2xl text-lg font-semibold">{name}</h2>
      </div>

      <div className="big_phone:grid hidden grid-cols-4 text-center mb-4 bg-white tablet:p-4 pb-4 p-2 rounded-lg">
        <div>
          <p className="font-bold text-dark-green">{funds}</p>
          <p className="text-sm text-dark-green">DAO Funds</p>
        </div>
        <div>
          <p className="font-bold text-dark-green">{members}</p>
          <p className="text-sm text-dark-green">Members</p>
        </div>
        <div>
          <p className="font-bold text-dark-green">{groups}</p>
          <p className="text-sm text-dark-green">Groups</p>
        </div>
        <div>
          <p className="font-bold text-dark-green">{proposals}</p>
          <p className="text-sm text-dark-green">Active Proposals</p>
        </div>
      </div>

      <div className="big_phone:hidden grid grid-cols-2 text-center my-4 small_phone:gap-4 gap-2">
        <div className="bg-white rounded-lg py-4">
          <p className="font-bold text-dark-green">{funds}</p>
          <p className="text-sm text-dark-green">DAO Funds</p>
        </div>
        <div className="bg-white rounded-lg py-4">
          <p className="font-bold text-dark-green">{members}</p>
          <p className="text-sm text-dark-green">Members</p>
        </div>
        <div className="bg-white rounded-lg py-4">
          <p className="font-bold text-dark-green">{groups}</p>
          <p className="text-sm text-dark-green">Groups</p>
        </div>
        <div className="bg-white rounded-lg py-4">
          <p className="font-bold text-dark-green">{proposals}</p>
          <p className="text-sm text-dark-green">Active Proposals</p>
        </div>
      </div>
      <div className="flex justify-between gap-2">
        <button
          onClick={goToDaoProfile}
          className="flex-1 bg-transparent border-2 border-dark-green text-dark-green p-2 rounded-[3rem] small_phone:text-base text-sm"
        >
          View Profile
        </button>
        <button className="flex-1 bg-dark-green border-2 border-dark-green text-white p-2 rounded-[3rem] small_phone:text-base text-sm">
          Join DAO
        </button>
      </div>
    </div>
  );
};

export default DaoCard;
