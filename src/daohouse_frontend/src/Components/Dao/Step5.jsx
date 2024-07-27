import React, { useEffect, useState } from "react";
import "./Step5.scss";
import { RiGroupLine } from "react-icons/ri";
import { LuAlertCircle } from "react-icons/lu";
import { IoPersonOutline } from "react-icons/io5";
import { MdOutlineVerifiedUser } from "react-icons/md";
import { FaArrowLeftLong, FaArrowRightLong } from "react-icons/fa6";


const Step5 = ({ setData, setActiveStep }) => {
  const [loadingNext, setLoadingNext] = useState(false);

  const [quorum, setQuorum] = useState([
    { name: "Council", index: 0, vote: 0 },
    { name: "Group 1", index: 1, vote: 0 },
    { name: "Group 2", index: 2, vote: 0 },
  ]);
  const className = "DAO_Step5";

  const handleVoteChange = (index, newValue) => {
    setQuorum((prevQuorum) =>
      prevQuorum.map((item, i) =>
        i === index ? { ...item, vote: newValue } : item
      )
    );
  };

  function handleSaveAndNext() {
    setData((prevData) => ({
      ...prevData,
      step5: quorum,
    }));
    setActiveStep(5);
  }

  return (
    <React.Fragment>
      <div
        className={
          className +
          "__form w-full bg-[#F4F2EC] big_phone:p-10 mobile:p-6 p-3 big_phone:mx-4 mx-0 rounded-lg flex flex-col gap-4"
        }
      >
        {/**On the Desktop till 800px */}
        <section className="heading big_phone:flex hidden items-center w-full">
          <p className="flex items-center gap-2 w-1/3 font-semibold">
            <RiGroupLine /> Groups
          </p>

          <p className="flex items-center gap-2 w-1/3 font-semibold">
            <IoPersonOutline /> Members
          </p>

          <p className="flex items-center gap-2 w-1/3 font-semibold">
            <MdOutlineVerifiedUser /> Voting Policy <LuAlertCircle />
          </p>
        </section>

        {/**On the Desktop till 800px */}
        <section className="bg-white rounded-2xl w-full p-4 gap-4 big_phone:flex hidden flex-col">
          {quorum.map(({ name, index, vote }) => (
            <div
              key={index}
              className="border border-slate-200 p-3 flex items-center w-full rounded-lg"
            >
              <p className="w-1/3">{name}</p>

              <p className="w-1/3 flex flex-row gap-4">
                <span>{index}</span>
                <button className="text-cyan-800 bg-slate-200 px-5 py-1 rounded-md">
                  View
                </button>
              </p>

              <div className="w-1/3 gap-2 flex items-center">
                <RangeInput index={index} handleVoteChange={handleVoteChange} />
                <span className="text-nowrap">{vote} %</span>
              </div>
            </div>
          ))}
        </section>

        {/**On the Phone after 800px */}
        <div className="bg-white mobile:p-5 p-3 rounded-lg flex flex-col gap-y-4">
          {quorum.map(({ name, index, vote }) => (
            <div
              key={index}
              className="bg-[#C6DDE6] p-2 rounded-md border-2 border-[#97C3D3]"
            >
              <section className="flex flex-row items-center justify-between border-b border-cyan-600 p-2">
                <p className="flex flex-row items-center gap-2">
                  <RiGroupLine /> {name}
                </p>
                <p>Council</p>
              </section>
              <section className="flex flex-row items-center justify-between border-b border-cyan-600 p-2">
                <p className="flex flex-row items-center gap-2">
                  <IoPersonOutline /> Members
                </p>
                <p>1</p>
              </section>
              <section className="flex flex-row items-center justify-between p-2 mobile:gap-x-10 gap-x-6">
                <p className="flex flex-row items-center gap-2 text-nowrap">
                  <MdOutlineVerifiedUser /> Voting Policy
                </p>
                <div className="flex flex-col items-end gap-y-2">
                  <span className="text-nowrap text-sm">{vote} %</span>
                  <RangeInput
                    index={index}
                    handleVoteChange={handleVoteChange}
                  />
                </div>
              </section>
            </div>
          ))}
        </div>

        <div
          className={
            className +
            "__submitButton w-full flex flex-row items-center mobile:justify-end justify-between"
          }
        >
          <button
            onClick={() => setActiveStep(3)}
            className="flex mobile:m-4 my-4 flex-row items-center gap-2 border border-[#0E3746] hover:bg-[#0E3746] text-[#0E3746] hover:text-white mobile:text-base text-sm transition px-4 py-2 rounded-[2rem]"
          >
            <FaArrowLeftLong /> Back
          </button>

          {loadingNext ? (
            <CircularProgress className="m-4 my-4" />
          ) : (
            <button
              type="submit"
              onClick={handleSaveAndNext}
              className="flex mobile:m-4 my-4 flex-row items-center gap-2 bg-[#0E3746] px-4 py-2 rounded-[2rem] text-white mobile:text-base text-sm"
            >
              Save & Next <FaArrowRightLong />
            </button>
          )}
        </div>
      </div>
    </React.Fragment>
  );
};

export default Step5;

const RangeInput = ({ index, handleVoteChange }) => {
  const [value, setValue] = useState(0);

  const handleChange = (e) => {
    const newValue = parseInt(e.target.value);
    setValue(newValue);
    handleVoteChange(index, newValue);
  };

  const gradient = `linear-gradient(to right, #0e3746 ${value}%, #fff ${value}%)`;

  return (
    <input
      type="range"
      min={0}
      max={100}
      className="mobile:w-10/12 mobile:h-[8px] h-[5px] custom-range"
      step={1}
      value={value}
      onChange={handleChange}
      style={{
        background: gradient,
      }}
    />
  );
};
