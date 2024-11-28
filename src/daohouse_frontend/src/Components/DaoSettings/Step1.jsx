import React, { useState } from "react";

const Step1 = ({ setData, setActiveStep }) => {
  const [inputData, setInputData] = useState({
    DAOIdentifier: "",
    Purpose: "",
    DAOType: "",
  });

  const className = "DAO__Step1";

  function handleSaveAndNext() {
    if (inputData.DAOIdentifier == "") {
      return;
    }

    setData((prevData) => ({
      ...prevData,
      step1: { ...inputData },
    }));

    setActiveStep(1);
  }

  function handleChange(e) {
    setInputData({
      ...inputData,
      [e.target.name]: e.target.value,
    });
  }

  return (
    <React.Fragment>
      <div
        className={
          className +
          "__form bg-[#F4F2EC] mobile:p-10 small_phone:p-6 p-4 big_phone:mx-4 mx-0 rounded-lg flex flex-col mobile:gap-4 gap-2"
        }
      >
        {/** DAO Identifier */}
        <label
          htmlFor="name"
          className="font-semibold mobile:text-base text-sm"
        >
          DAO Identifier*
        </label>
        <input
          type="text"
          name="DAOIdentifier"
          required
          value={inputData.DAOIdentifier}
          placeholder="Enter DAO Name"
          className="rounded-lg mobile:p-3 p-2 mobile:text-base text-sm"
          onChange={handleChange}
        />

        {/** Purpose of DAO */}
        <label
          htmlFor="purpose"
          className="font-semibold mobile:text-base text-sm"
        >
          Purpose of DAO
        </label>
        <textarea
          type="text"
          name="Purpose"
          value={inputData.Purpose}
          placeholder="Specify the primary purpose or objectives the DAO aims to achieve, such as governance, funding, community building,"
          className="rounded-lg mobile:p-3 p-2 mobile:text-base text-sm mobile:min-h-full min-h-[90px]"
          onChange={handleChange}
        />

        {/** DAO Type */}
        <label
          htmlFor="type"
          className="font-semibold mobile:text-base text-sm"
        >
          DAO Type
        </label>
        <input
          onChange={handleChange}
          type="text"
          value={inputData.DAOType}
          name="DAOType"
          className="rounded-lg mobile:p-3 p-2 mobile:text-base text-sm"
        />
      </div>

      <div
        className={
          className +
          "__submitButton w-full flex flex-row items-center justify-end"
        }
      >
        <button
          type="submit"
          onClick={handleSaveAndNext}
          className="flex mobile:m-4 my-4 flex-row items-center gap-2 bg-[#0E3746] px-4 py-2 rounded-[2rem] text-white mobile:text-base text-sm"
        >
          Propose Change
        </button>
      </div>
    </React.Fragment>
  );
};

export default Step1;
