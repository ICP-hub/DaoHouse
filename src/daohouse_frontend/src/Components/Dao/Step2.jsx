import React, { useState, useEffect } from "react";
import { FaArrowLeftLong, FaArrowRightLong } from "react-icons/fa6";
import CircularProgress from '@mui/material/CircularProgress';
import Container from "../Container/Container";

const Step2 = ({ setData, setActiveStep, data }) => {

  const [localData, setLocalData] = useState(data);


  useEffect(() => {
    setLocalData(data);
  }, [data]);
  const [inputData, setInputData] = useState({
    TokenName: data.Tokenname || " ",
    TokenSymbol: data.Tokensymbol || " ",
    TokenSupply: data.TokenSupply || " ",
    VotesRequired: data.VotesRequired || " ",
  });

  console.log("inputData", inputData)
  const [loadingNext, setLoadingNext] = useState(false);
  const [loadingBack, setLoadingBack] = useState(false);
  const className = "DAO__Step2";
  // useEffect(() => {
  //   if (data?.setUpPeriod !== undefined) {
  //     setInputData({ setUpPeriod: data.setUpPeriod });
  //   }
  // }, [data]);


  useEffect(() => {
    const savedData = localStorage.getItem('step2Data');
    if (savedData) {
      setInputData(JSON.parse(savedData));
    } else if (data) {
      setInputData({
        // setUpPeriod: data.setUpPeriod,
        TokenName: data.TokenName,
        TokenSymbol: data.TokenSymbol,
        TokenSupply: data.TokenSupply,
        VotesRequired: data.VotesRequired,
      });

    }
  }, [data]);

  // Save data to local storage whenever inputData changes
  useEffect(() => {
    localStorage.setItem('step2Data', JSON.stringify(inputData));
  }, [inputData]);

  function handleSaveAndNext() {
    setData((prev) => ({
      ...prev,
      step2: { ...inputData },
    }));
    setActiveStep(2);
  }

  function handleBack() {
    setActiveStep(0);
  }
  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };


  function changePeriod(value) {
    // Convert the value to a number, ensure it's non-negative, and append "days"
    const numberValue = Math.max(parseInt(value, 10) || 1, 0);
    setInputData({
      TokenSupply: numberValue,
    });
  }

  return (
    <React.Fragment>
      <Container>
        <div
          className={
            className +
            "__form bg-[#F4F2EC] mobile:p-10 small_phone:p-6 p-4 big_phone:mx-4 mx-0 rounded-lg flex flex-col mobile:gap-4 gap-2"
          }
        >
          {/* dao token */}
          <div className="flex mobile:flex-row flex-col mobile:gap-4 gap-2 mobile:items-center items-start">
            <p
              htmlFor="type"
              className="font-semibold mobile:text-base text-sm"
            >
              DAO Token*
            </p>

          </div>

          <div className="flex flex-wrap  gap-4">

            {/* token name */}
            <div className="w-full lg:w-1/5 flex flex-col gap-4 ">
              <label
                htmlFor="tokenName"
                className="font-semibold mobile:text-base text-xs"
              >
                Token Name
              </label>

              <input
                required
                type="text"
                name="TokenName"
                value={inputData.TokenName}
                onChange={handleChange}
                className="rounded-lg mobile:p-3 p-2 mobile:text-base text-sm"
              />
            </div>

            {/* token symbol */}
            <div className="w-full lg:w-1/5 flex flex-col gap-4">
              <label
                htmlFor="tokenSymbol"
                className="font-semibold mobile:text-base text-xs"
              >
                Token Symbol
              </label>

              <input
                required
                type="text"
                name="TokenSymbol"
                value={inputData.TokenSymbol}
                onChange={handleChange}
                className="rounded-lg mobile:p-3 p-2 mobile:text-base text-sm"
              />



            </div>

            {/* TokenSupply */}
            <div className="w-full lg:w-1/5 flex flex-col gap-4 ">

              <label
                htmlFor="tokenSymbol"
                className="font-semibold mobile:text-base text-xs"
              >
                Token Supply
              </label>

              <input
                required
                type="number"
                name="TokenSupply"
                value={inputData.TokenSupply || 1000}
                onChange={handleChange}
                className="rounded-lg mobile:p-3 p-2 mobile:text-base text-sm"
              />
            </div>

            {/* Votes Required */}
            <div className="w-full lg:w-1/5 flex flex-col gap-4 ">

              <label
                htmlFor="tokenSymbol"
                className="font-semibold mobile:text-base text-xs"
              >
                Votes Required
              </label>

              <input
                required
                type="text"
                name="VotesRequired"
                value={inputData.VotesRequired}
                 onChange={handleChange}
               // onChange={(e) => changePeriod(e.target.value)}
                className="rounded-lg mobile:p-3 p-2 mobile:text-base text-sm"
              />
            </div>
          </div>
          {/* <label htmlFor="purpose" className="font-semibold mobile:text-base text-sm">
          Setup Period (in days)
        </label> 
           <p className="text-slate-500 mobile:text-base text-xs">
          Setup the period between when a proposal is approved and is executed.
        </p> 
           <input
          type="number"
          name="purpose"
          value={inputData.setUpPeriod}
          onChange={(e) => changePeriod(e.target.value)}
          placeholder="Setup the period between when a proposal is approved and is executed."
          className="rounded-lg mobile:p-3 p-2 mobile:text-base text-sm"
        /> */}
        </div>



        <div
          className={
            className +
            "__submitButton w-full flex flex-row items-center mobile:justify-end justify-between"
          }
        >
          {loadingBack ? (
            <CircularProgress className="m-4 my-4" />
          ) : (
            <button
              onClick={handleBack}
              className="flex mobile:m-4 my-4 flex-row items-center gap-2 border border-[#0E3746] hover:bg-[#0E3746] text-[#0E3746] hover:text-white mobile:text-base text-sm transition px-4 py-2 rounded-[2rem]"
            >
              <FaArrowLeftLong /> Back
            </button>
          )}
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
      </Container>
    </React.Fragment>
  );
};

export default Step2;