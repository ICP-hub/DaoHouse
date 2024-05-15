import React, { useEffect, useState } from "react";
import './Step5.scss'
import { RiGroupLine } from "react-icons/ri";
import { LuAlertCircle } from "react-icons/lu";
import { IoPersonOutline } from "react-icons/io5";
import { MdOutlineVerifiedUser } from "react-icons/md";
import { FaArrowLeftLong, FaArrowRightLong } from "react-icons/fa6";

const Step5 = ({ setData, setActiveStep }) => {
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
      step5: { ...quorum },
    }))

    setActiveStep(5)
  }

  return (
    <React.Fragment>
      <div
        className={
          className +
          "__form w-full bg-[#F4F2EC] p-10 rounded-lg flex flex-col gap-4"
        }
      >
        <section className="heading flex items-center w-full">
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

        <section className="bg-white rounded-2xl w-full p-4 gap-4 flex flex-col">
          {quorum.map(({ name, index, vote }) => (
            <div className="border border-slate-200 p-3 flex items-center w-full rounded-lg">
              <p className="w-1/3">{name}</p>

              <p className="w-1/3 flex flex-row gap-4">
                <span>{index}</span>
                <button className="text-cyan-800 bg-slate-200 px-5 py-1 rounded-md">View</button>
              </p>

              <div className="w-1/3 gap-2 flex items-center">
                <RangeInput index={index} handleVoteChange={handleVoteChange} />
                <span className="text-nowrap">{vote} %</span>
              </div>
            </div>
          ))}
        </section>
      </div>

      <div
        className={
          className +
          "__submitButton w-full flex flex-row items-center justify-end"
        }
      >
        <button
          onClick={() => setActiveStep(3)}
          className="flex m-4 flex-row items-center gap-2 border border-[#0E3746] hover:bg-[#0E3746] text-[#0E3746] hover:text-white transition px-4 py-2 rounded-[2rem]"
        >
          <FaArrowLeftLong /> Back
        </button>
        <button
          type="submit"
          onClick={handleSaveAndNext}
          className="flex m-4 flex-row items-center gap-2 bg-[#0E3746] px-4 py-2 rounded-[2rem] text-white"
        >
          Save & Next <FaArrowRightLong />
        </button>
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

  const gradient = `linear-gradient(to right, #0e3746 ${value}%, #ddd ${value}%)`;

  return (
    <input
      type="range"
      min={0}
      max={100}
      className="w-10/12 custom-range"
      step={1}
      value={value}
      onChange={handleChange}
      style={{
        background: gradient,
      }}
    />
  );
};
