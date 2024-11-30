import React, { useState, useEffect } from "react";
import { FaArrowRightLong } from "react-icons/fa6";
import toast from 'react-hot-toast';
import Container from "../Container/Container";
import { FaInfoCircle } from "react-icons/fa";

const Step1 = ({ setData, setActiveStep, data }) => {
  const [inputData, setInputData] = useState({
    DAOIdentifier: "",
    Purpose: "",
    SetUpPeriod: 1, 
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const className = "DAO__Step1";

 
  useEffect(() => {
    const savedData = localStorage.getItem("step1Data");
    if (savedData) {
      setInputData(JSON.parse(savedData));
    } else if (data && data.step1) {
      setInputData({
        DAOIdentifier: data.DAOIdentifier || "",
        Purpose: data.Purpose || "",
        SetUpPeriod: data.step1?.SetUpPeriod || 1, 
      });
    }
  }, [data]);

  useEffect(() => {

    localStorage.setItem("step1Data", JSON.stringify(inputData));
  }, [inputData]);

  const validate = () => {
    const newErrors = {};

    if (!inputData.DAOIdentifier.trim()) {
      newErrors.DAOIdentifier = "DAO Identifier is required.";
    } else if (inputData.DAOIdentifier.length < 3) {
      newErrors.DAOIdentifier =
        "DAO Identifier must be at least 3 characters long.";
    }

    if (!inputData.Purpose.trim()) {
      newErrors.Purpose = "Purpose of DAO is required.";
    } else if (inputData.Purpose.length < 10) {
      newErrors.Purpose =
        "Purpose should be at least 10 characters to provide sufficient detail.";
    }

    if (inputData.SetUpPeriod === "" || inputData.SetUpPeriod === null) {
      newErrors.SetUpPeriod = "Setup Period is required.";
    } else if (
      isNaN(inputData.SetUpPeriod) ||
      Number(inputData.SetUpPeriod) < 1
    ) {
      newErrors.SetUpPeriod =
        "Setup Period must be a positive number (minimum 1 day).";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setInputData({
      ...inputData,
      [name]: value,
    });

    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null,
      });
    }
  };

  const changePeriod = (value) => {
    const numberValue = Math.max(parseInt(value, 10) || 1, 1);
    setInputData({
      ...inputData,
      SetUpPeriod: numberValue,
    });

    if (errors.SetUpPeriod) {
      setErrors({
        ...errors,
        SetUpPeriod: null,
      });
    }
  };

  async function handleSaveAndNext(e) {
    e.preventDefault();

    if (validate()) {
      setIsSubmitting(true);
      try {
        setData((prevData) => ({
          ...prevData,
          step1: { ...inputData },
        }));

        await new Promise((resolve) => setTimeout(resolve, 1000));

  
        setActiveStep(1);
     
      } catch (error) {
        console.error("Error saving data:", error);
        toast.error("An error occurred while saving. Please try again.");
      } finally {
        setIsSubmitting(false);
      }
    } 
  }

  return (
    <React.Fragment>
      <Container>
        <form
          onSubmit={handleSaveAndNext}
          className={
            className +
            "__form bg-[#F4F2EC] mobile:p-10 small_phone:p-6 p-4 big_phone:mx-4 mx-0 rounded-lg flex flex-col mobile:gap-4 gap-2"
          }
          noValidate
        >
          {/* DAO Identifier */}
          <div className="flex flex-col">
            <label
              htmlFor="DAOIdentifier"
              className="font-semibold mobile:text-base text-sm"
            >
              DAO Identifier <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="DAOIdentifier"
              name="DAOIdentifier"
              value={inputData.DAOIdentifier}
              placeholder="Enter DAO Identifier"
              className={`rounded-lg mobile:p-3 p-2 mobile:text-base text-sm ${errors.DAOIdentifier
                ? "border border-red-500"
                : "border border-gray-300"
                }`}
              onChange={handleChange}
            />
            {errors.DAOIdentifier && (
              <p className="text-red-500 text-sm mt-1">
                {errors.DAOIdentifier}
              </p>
            )}
          </div>

          {/* Purpose of DAO */}
          <div className="flex flex-col">
            <label
              htmlFor="Purpose"
              className="font-semibold mobile:text-base text-sm"
            >
              Purpose of DAO <span className="text-red-500">*</span>
            </label>
            <textarea
              id="Purpose"
              name="Purpose"
              value={inputData.Purpose}
              placeholder="Specify the primary purpose or objectives the DAO aims to achieve, such as governance, funding, community building, etc."
              className={`rounded-lg mobile:p-3 p-2 mobile:text-base text-sm h-32 resize-none ${errors.Purpose ? "border border-red-500" : "border border-gray-300"
                }`}
              onChange={handleChange}
            />
            {errors.Purpose && (
              <p className="text-red-500 text-sm mt-1">{errors.Purpose}</p>
            )}
          </div>

          {/* Setup Period */}
          <div className="flex flex-col">
            <div className="flex items-center space-x-2">
              <label
                htmlFor="SetUpPeriod"
                className="font-semibold mobile:text-base text-sm"
              >
                Setup Period (in days) <span className="text-red-500">*</span>
              </label>
              <div className="relative group">
                <FaInfoCircle className="text-gray-500 cursor-pointer" />

                <div className="absolute left-1/2 transform -translate-x-1/2 bottom-full mb-2 opacity-0 group-hover:opacity-100 bg-gray-700 text-white text-sm rounded-lg py-2 px-6 w-[250px]">
                  <div className="absolute left-1/2 transform -translate-x-1/2 bottom-[-6px] w-0 h-0 border-l-[6px] border-r-[6px] border-t-[6px] border-t-gray-700 border-l-transparent border-r-transparent"></div>
                    Please enter how many days a proposal should remain for your dao
                  </div>
                </div>
            </div>
            
              <input
                type="number"
                id="SetUpPeriod"
                name="SetUpPeriod"
                value={inputData.SetUpPeriod}
                placeholder="Enter setup period in days"
                className={`rounded-lg mobile:p-3 p-2 mobile:text-base text-sm ${errors.SetUpPeriod ? "border border-red-500" : "border border-gray-300"}`}
                onChange={(e) => changePeriod(e.target.value)}
                min="1"
              />

            {errors.SetUpPeriod && (
              <p className="text-red-500 text-sm mt-1">
                {errors.SetUpPeriod}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <div
            className={
              className +
              "__submitButton w-full flex flex-row items-center justify-end"
            }
          >
       
            <button
              type="submit"
              className="flex mobile:m-4 my-4 flex-row items-center gap-2 bg-[#0E3746] px-4 py-2 rounded-[2rem] text-white mobile:text-base text-sm disabled:opacity-50"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Saving..." : "Save & Next"}{" "}
              <FaArrowRightLong />
            </button>
          </div>
        </form>
      </Container>
    </React.Fragment>
  );
};

export default Step1;
