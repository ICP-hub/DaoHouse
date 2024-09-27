import React, { useEffect, useMemo, useState } from "react";
import "./Step5.scss";
import { RiGroupLine } from "react-icons/ri";
import { LuAlertCircle } from "react-icons/lu";
import { IoPersonOutline } from "react-icons/io5";
import { MdOutlineVerifiedUser } from "react-icons/md";
import { FaArrowLeftLong, FaArrowRightLong } from "react-icons/fa6";
import Container from "../Container/Container";
import ViewModal from "./ViewModal";

const Step5 = ({ setData, setActiveStep, data }) => {
  console.log("data", data);
  
  const [loadingNext, setLoadingNext] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMembers, setSelectedMembers] = useState([]);
  const { council, groups, members } = data.step3;
  const users = useMemo(() => data.step3, [data.step3]);
  console.log("user", users);
  

  const [quorum, setQuorum] = useState(() => [
    { name: "Council", index: council.length, vote: 51, members: council },
    ...groups.map((group, i) => ({
      name: group.name,
      index: group.members.length,
      vote: 51,
      members: group.members,
    })),
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

  useEffect(() => {
    localStorage.setItem("step5Quorum", JSON.stringify(quorum));
  }, [quorum]);

  function handleViewClickModal(members) {
    setSelectedMembers(members); 
    setIsModalOpen(true); 
  }

  function handleOnClose() {
    setIsModalOpen(false);
  }

  return (
    <React.Fragment>
      <Container>
        <div
          className={`${className}__form w-full bg-[#F5F5F5] big_phone:p-10 mobile:p-6 p-3 big_phone:mx-4 mx-0 rounded-lg flex flex-col gap-4`}
        >
          {/* Desktop View */}
          <section className="heading big_phone:flex hidden items-center bg-[#F5F5F5] w-full">
            <p className="flex items-center gap-2 w-1/3 font-semibold ">
              <RiGroupLine /> Groups
            </p>

            <p className="flex items-center gap-2 w-1/3 font-semibold">
              <IoPersonOutline /> Members
            </p>

            <p className="flex items-center gap-2 w-1/3 font-semibold">
              <MdOutlineVerifiedUser /> Voting Policy <LuAlertCircle />
            </p>
          </section>

          <section className="bg-white rounded-2xl w-full p-4 gap-4 big_phone:flex hidden flex-col">
            {quorum.map(({ name, index, vote, members }) => (
              <div
                key={index}
                className="border border-slate-200 p-3 flex items-center w-full rounded-lg"
              >
                <p className="w-1/3">{name}</p>

                <p className="w-1/3 flex flex-row gap-4">
                  <span>{index}</span>
                  <button
                    onClick={() => handleViewClickModal(members)}
                    className="text-cyan-800 bg-slate-200 px-5 py-1 rounded-md"
                  >
                    View
                  </button>
                </p>

                <div className="w-1/3 gap-2 flex items-center">
                  <RangeInput index={index} handleVoteChange={handleVoteChange} />
                  <span className="text-nowrap hidden sm:block ">{vote} %</span>
                </div>
              </div>
            ))}
          </section>

          {/* Mobile View */}
          <section className="bg-[#EBEBEB] rounded-lg w-full p-4 gap-4 sm:hidden mt-2 big_phone:hidden flex flex-col gap-10">
            <section className="flex justify-between items-center border-b pb-2">
              <p className="flex items-center gap-2 font-semibold font-mulish">
                Groups
              </p>
              <p className="flex items-center gap-2 translate-x-[34px] sm:translate-x-0 font-semibold font-mulish">
                Voting Policy
              </p>
              <LuAlertCircle className="text-blue-300" />
            </section>
            <hr className="border-t-2 border-gray-400 sm:hidden mt-2" />

            {quorum.map(({ name, index, vote, members }) => (
              <div
                key={index}
                className="bg-[#EBEBEB] border border-slate-300 p-4 rounded-lg flex flex-col gap-4"
              >
                {/* Council, Members, and View button with gradient slider */}
                <section className="flex justify-between items-center pt-2">
                  <div className="flex flex-col gap-2">
                    <p className="text-sm text-gray-500">{name}</p>
                    <p className="text-sm text-gray-500">
                      {users[index]?.length || 0} members
                    </p>
                    <button
                      onClick={() => handleViewClickModal(members)}
                      className="text-[#229ED9] font-mulish text-sm bg-white border px-5 py-1 rounded-md"
                    >
                      View
                    </button>
                  </div>

                  <div className="flex flex-col items-end gap-6">
                    <h2 className="text-sm hidden sm:block">{vote} %</h2>
                    <RangeInput index={index} handleVoteChange={handleVoteChange} />
                  </div>
                </section>
              </div>
            ))}
          </section>

          <div
            className={`${className}__submitButton w-full flex flex-row items-center mobile:justify-end justify-between`}
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
      </Container>
      <ViewModal open={isModalOpen} onClose={handleOnClose} users={selectedMembers} />
    </React.Fragment>
  );
};

export default Step5;

const RangeInput = ({ index, handleVoteChange }) => {
  const [value, setValue] = useState(50);

  const handleChange = (e) => {
    const newValue = parseInt(e.target.value);
    setValue(newValue);
    handleVoteChange(index, newValue);
  };

  useEffect(() => {
    setValue(value);
  }, [value]);

  const gradient = `linear-gradient(to right, #0e3746 ${value}%, #D0D0D0 ${value}%)`;

  return (
    <div className="flex items-center w-full gap-2">
      <input
        type="range"
        min={0}
        max={100}
        className="w-[50%] h-[8px] border-3 bg-[#D0D0D0] sm:w-full sm:h-[8px] custom-range translate-x-[42px] sm:translate-x-0"
        step={1}
        value={value}
        onChange={handleChange}
        style={{
          background: gradient,
        }}
      />
      <span className="text-xs translate-x-[40px] font-semibold block sm:hidden">
        {value} %
      </span>
    </div>
  );
};
