import React, { Fragment, useEffect, useState } from "react";
import "./CreateDao.scss";
import { FaCircleCheck } from "react-icons/fa6";
import Step1 from "../../Components/Dao/Step1";
import Step2 from "../../Components/Dao/Step2";
import Step3 from "../../Components/Dao/Step3";
import Step4 from "../../Components/Dao/Step4";
import Step5 from "../../Components/Dao/Step5";
import Step6 from "../../Components/Dao/Step6";
import TopComponent from "../../Components/Dao/TopComponent";

const CreateDao = () => {
  const className = "CreateDAO";
  const [activeStep, setActiveStep] = React.useState(0);

  const [data, setData] = useState({
    step1: {},
    step2: {},
    step3: {},
    step6: {
      imageURI: "",
    },
  });

  const Form = () => {
    switch (activeStep) {
      case 0:
        return (
          <Step1 setData={setData} setActiveStep={setActiveStep} />
        );
      case 1:
        return (
          <Step2 setData={setData} setActiveStep={setActiveStep} />
        );
      case 2:
        return (
          <Step3 setData={setData} setActiveStep={setActiveStep} />
        );
      case 3:
        return (
          <Step4 data={data} setData={setData} setActiveStep={setActiveStep} />
        );
      case 4:
        return (
          <Step5 data={data} setData={setData} setActiveStep={setActiveStep} />
        );
      case 5:
        return (
          <Step6 data={data} setData={setData} setActiveStep={setActiveStep} />
        );
      default:
        return null;
    }
  };

  return (
    <Fragment>
      <TopComponent showButtons={false} />

      {/** Heading */}
      <div className={className + " bg-[#c8ced3] py-8 px-10"}>
        <div className={className + "__label py-2 px-4 w-full"}>
          <div className="text-4xl flex flex-row items-center gap-4">
            Create DAO
            <div className="flex flex-col items-start">
              <div className="w-32 border-t-2 border-black"></div>
              <div className="w-14 mt-2 border-t-2 border-black"></div>
            </div>
          </div>
        </div>

        {/** Steps */}
        <div
          className={
            className +
            "__steps overflow-x-scroll py-4 gap-20 flex flex-row w-full items-center justify-between"
          }
        >
          {steps.map(({ step, name }, index) => (
            <div
              key={index}
              className={
                "flex flex-row py-4 items-center gap-2 " +
                `${activeStep >= index ? "opacity-100" : "opacity-50"}`
              }
            >
              {index >= activeStep ? (
                <div
                  className={
                    "border border-[#007a7b] " +
                    (activeStep === index
                      ? "bg-[#007a7b] text-white font-semibold"
                      : "bg-white text-black") +
                    " rounded-[2rem] min-w-7 h-7 flex items-center justify-center"
                  }
                >
                  <p className="text-center">{step}</p>
                </div>
              ) : (
                <FaCircleCheck className="text-2xl text-[#0E3746]" />
              )}
              <span className="text-nowrap">{name}</span>
            </div>
          ))}
        </div>

        {/** Form */}
        {Form()}
      </div>
    </Fragment>
  );
};

export default CreateDao;

const steps = [
  {
    step: 1,
    name: "Basic Info",
  },
  {
    step: 2,
    name: "Settle Down Period",
  },
  {
    step: 3,
    name: "Add members & Groups",
  },
  {
    step: 4,
    name: "Permissions",
  },
  {
    step: 5,
    name: "Quorum",
  },
  {
    step: 6,
    name: "DAO Asset",
  },
];
