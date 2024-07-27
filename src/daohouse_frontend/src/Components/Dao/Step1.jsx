import React, { useState } from "react";
import { FaArrowRightLong } from "react-icons/fa6";
import { toast } from "react-toastify";


const Step1 = ({ setData, setActiveStep }) => {
  const [loading, setLoading] = useState(false);
  const [inputData, setInputData] = useState({
    DAOIdentifier: "",
    Purpose: "",
    DAOType: "",
    // exisitingToken: false,
    // tokenName: "",
    // tokenSymbol: "",
    initialTokenSupply: 0,
  });

  const className = "DAO__Step1";

  async function handleSaveAndNext() {
    if (
      inputData.DAOIdentifier === "" ||
      inputData.tokenName === "" ||
      inputData.tokenSymbol === ""
    ) {
      toast.error("Empty fields are not allowed");
      return;
    }

    try {
      setData((prevData) => ({
        ...prevData,
        step1: { ...inputData },
      }));

      // Simulate an async operation like an API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setActiveStep(1);
    } catch (error) {
      console.error("Error saving data:", error);
    }
  }

  function handleChange(e) {
    setInputData({
      ...inputData,
      [e.target.name]: e.target.value,
    });

    console.log(inputData);
  }

  function handlenewTokenFlag(flag) {
    setInputData((prevData) => ({
      ...prevData,
      exisitingToken: flag,
    }));
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
        <label htmlFor="name" className="font-semibold mobile:text-base text-sm">
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
        <label htmlFor="purpose" className="font-semibold mobile:text-base text-sm">
          Purpose of DAO
        </label>
        <textarea
          type="text"
          name="Purpose"
          value={inputData.Purpose}
          placeholder="Specify the primary purpose or objectives the DAO aims to achieve, such as governance, funding, community building,"
          className="rounded-lg mobile:p-3 p-2 mobile:text-base text-sm"
          onChange={handleChange}
        />

        {/** DAO Type */}
        <label htmlFor="type" className="font-semibold mobile:text-base text-sm">
          DAO Type
        </label>
        <input
          onChange={handleChange}
          type="text"
          value={inputData.DAOType}
          name="DAOType"
          className="rounded-lg mobile:p-3 p-2 mobile:text-base text-sm"
        />

        {/** DAO Token 
        <div className="flex mobile:flex-row flex-col mobile:gap-4 gap-2 mobile:items-center items-start">
          <p htmlFor="type" className="font-semibold mobile:text-base text-sm">
            DAO Token*
          </p>

          <div className="flex flex-row gap-2">
            <button
              className={
                `${inputData.exisitingToken
                  ? "bg-[#0E3746] text-white"
                  : "border border-[#0E3746]"
                }` + " mobile:p-2 px-4 py-1 mobile:rounded-lg rounded-md transition mobile:text-base text-sm"
              }
              onClick={() => handlenewTokenFlag(true)}
            >
              New Token
            </button>
            <button
              className={
                `${!inputData.exisitingToken
                  ? "bg-[#0E3746] text-white"
                  : "border border-[#0E3746]"
                }` + " mobile:p-2 px-4 py-1 border border-[#0E3746] mobile:rounded-lg rounded-md transition mobile:text-base text-sm"
              }
              onClick={() => handlenewTokenFlag(false)}
            >
              Existing Token
            </button>
          </div>
        </div>

        <div className="flex mobile:flex-row flex-col mobile:gap-4 gap-2">
          <div className="flex flex-col mobile:w-1/2 mobile:gap-4 gap-2">
            <label htmlFor="tokenName" className="font-semibold mobile:text-base text-xs">Token Name</label>
            <input
              required
              type="text"
              name="tokenName"
              value={inputData.tokenName}
              onChange={handleChange}
              className="rounded-lg mobile:p-3 p-2 mobile:text-base text-sm"
            />
          </div>
          <div className="flex flex-col mobile:w-1/2 mobile:gap-4 gap-2">
            <label htmlFor="tokenSymbol" className="font-semibold mobile:text-base text-xs">Token Symbol</label>
            <input
              required
              type="text"
              name="tokenSymbol"
              value={inputData.tokenSymbol}
              onChange={handleChange}
              className="rounded-lg mobile:p-3 p-2 mobile:text-base text-sm"
            />
          </div>
        </div>*/}

        {/** Initial Token Supply */}
       {/** <label htmlFor="initialTokenSupply" className="font-semibold mobile:text-base text-sm">
          Initial Token Supply
        </label>
        <input
          type="text"
          onChange={handleChange}
          value={inputData.initialTokenSupply}
          name="initialTokenSupply"
          placeholder="Enter number of tokens to be minted"
          className="rounded-lg mobile:p-3 p-2 mobile:text-base text-sm"
        />*/} 
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
            Save & Next <FaArrowRightLong />
          </button>
        
      </div>
    </React.Fragment>
  );
};

export default Step1;
