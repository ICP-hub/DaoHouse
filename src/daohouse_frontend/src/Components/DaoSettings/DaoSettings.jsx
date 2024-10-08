import React, { useRef, useState } from "react";
import "./DaoSettings.scss";
import { FaCircleCheck } from "react-icons/fa6";
import Step1 from "./Step1";
import Step2 from "./Step2";
import Step3 from "./Step3";
import Step4 from "./Step4";
import Step5 from "./Step5";
import Step6 from "./Step6";
import DaoConfig from "./DaoConfig";
import AddMember from "./AddMember";


const DaoSettings = ({setActiveLink}) => {
  const className = "DaoSettings";
  const [activeStep, setActiveStep] = React.useState(0);

  const [data, setData] = useState({
    DaoConfig: {},
    step2: {},
    step3: {},
    step4: {},
    step5: {},
    step6: {
      imageURI: "",
    },
  });

  const Step1Ref = useRef(null);
  const Step4Ref = useRef(null);

  const Form = () => {
    switch (activeStep) {
      case 0:
        return <DaoConfig setData={setData} setActiveStep={setActiveStep}  setActiveLink={setActiveLink}/>;
      case 1:
        return <AddMember setData={setData} setActiveStep={setActiveStep} setActiveLink={setActiveLink} />;
      case 2:
        return (
          <Step3
            setData={setData}
            setActiveStep={setActiveStep}
            Step1Ref={Step1Ref}
            Step4Ref={Step4Ref}
          />
        );
      case 3:
        return (
          <Step4 data={data} setData={setData} setActiveStep={setActiveStep} />
        );
      case 4:
        return <Step5 setData={setData} setActiveStep={setActiveStep} />;
      case 5:
        return (
          <Step6 data={data} setData={setData} />
        );
      default:
        return null;
    }
  };

  return (
    <React.Fragment>
      {/** Heading */}
      <div className={className + " mt-6 bg-[#c8ced3]"}>
        <h1 className="mobile:text-2xl text-lg font-bold py-1">
          Members and Policy
        </h1>

        {/** Steps */}
        <div
          className={
            className +
            "__steps overflow-x-scroll mobile:py-4 py-2 mobile:gap-20 gap-6 flex flex-row w-full mobile:items-center justify-between"
          }
        >
          {steps.map(({ step, name }, index) => (
            <div
              key={index}
              ref={index >= 3 ? Step4Ref : Step1Ref}
              className={
                "flex mobile:flex-row flex-col py-4 items-center gap-2 cursor-pointer " +
                `${activeStep >= index ? "opacity-100" : "opacity-50"}`
              }
              onClick={() => {
                if (index === 3) {
                  setActiveStep(2)
                  return
                }
                else setActiveStep(index)
              }}
            >
              {index >= activeStep ? (
                <div
                  className={
                    "border border-[#007a7b] " +
                    (activeStep === index
                      ? "bg-[#007a7b] text-white font-semibold"
                      : "bg-white text-[#007a7b]") +
                    " rounded-[2rem] mobile:min-w-7 min-w-5 mobile:h-7 h-5 flex items-center justify-center"
                  }
                >
                  <p className="text-center mobile:text-base text-xs">{step}</p>
                </div>
              ) : (
                <FaCircleCheck className="mobile:text-2xl text-[1.2rem] text-[#0E3746]" />
              )}
              <span className="text-nowrap mobile:text-base text-xs">
                {name}
              </span>
            </div>
          ))}
        </div>

        {/** Form */}
        {Form()}
      </div>
    </React.Fragment>
  );
};

export default DaoSettings;

const steps = [
  {
    step: 1,
    name: "ChangeDaoConfig",
  },
  {
    step: 2,
    name: "Add Member Proposal",
  },
  {
    step: 3,
    name: "Upgrade Remote",
  },
  {
    step: 4,
    name: "Pools",
  },
  {
    step: 5,
    name: "Change Dao Policy",
  },
  {
    step: 6,
    name: "Bounty Raised",
  },
  {
    step: 7,
    name: "Remove Member Proposal",
  },
  {
    step: 8,
    name: "Function Call",
  },
  {
    step: 9,
    name: "Upgrade Self",
  },
];
