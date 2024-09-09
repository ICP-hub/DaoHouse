import React, { useState } from "react";

const Step2 = ({ setData, setActiveStep }) => {
  const [inputData, setInputData] = useState({ setUpPeriod: 0 });
  const className = "DAO__Step2";

  function handleSaveAndNext() {
    setData((prev) => ({
      ...prev,
      step2: { ...inputData },
    }));

    setActiveStep(2);
  }

  function changePeriod(value) {
    setInputData({
      setUpPeriod: value,
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
        <label
          htmlFor="purpose"
          className="font-semibold mobile:text-base text-sm"
        >
          Setup Peroid (in days)
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

export default Step2;
