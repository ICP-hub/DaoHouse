import React, { useState, useEffect } from "react";
import { FaArrowLeftLong, FaArrowRightLong } from "react-icons/fa6";
import toast, { Toaster } from 'react-hot-toast';
import Container from "../Container/Container";
import { FaInfoCircle } from "react-icons/fa";

const Step2 = ({ setData, setActiveStep, data }) => {
  const [inputData, setInputData] = useState({
    TokenName: "",
    TokenSymbol: "",
    TokenSupply: 1,
    VotesRequired: 1,
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const className = "DAO__Step2";


  useEffect(() => {
    const savedData = localStorage.getItem("step2Data");
    if (savedData) {
      setInputData(JSON.parse(savedData));
    } else if (data) {
      setInputData({
        TokenName: data.TokenName || "",
        TokenSymbol: data.TokenSymbol || "",
        TokenSupply: data.TokenSupply || 1,
        VotesRequired: data.VotesRequired || 1,
      });
    }
  }, [data]);

  useEffect(() => {
    localStorage.setItem("step2Data", JSON.stringify(inputData));
  }, [inputData]);


  const validate = () => {
    const newErrors = {};


    if (!inputData.TokenName.trim()) {
      newErrors.TokenName = "Token Name is required.";
    } else if (!/^[a-zA-Z0-9 ]+$/.test(inputData.TokenName)) {
      newErrors.TokenName =
        "Token Name can only contain letters, numbers, and spaces.";
    } else if (inputData.TokenName.length < 2) {
      newErrors.TokenName = "Token Name must be at least 2 characters long.";
    }


    if (!inputData.TokenSymbol.trim()) {
      newErrors.TokenSymbol = "Token Symbol is required.";
    } else if (!/^[A-Z0-9\-]+$/.test(inputData.TokenSymbol)) {
      newErrors.TokenSymbol =
        "Token Symbol can only contain uppercase letters, numbers, and hyphens.";
    } else if (inputData.TokenSymbol.length < 3 || inputData.TokenSymbol.length > 5) {
      newErrors.TokenSymbol =
        "Token Symbol must be between 3 to 5 characters long.";
    }


    if (inputData.TokenSupply === "" || inputData.TokenSupply === null) {
      newErrors.TokenSupply = "Token Supply is required.";
    } else if (Number(inputData.TokenSupply) < 1) {
      newErrors.TokenSupply = "Token Supply must be a positive integer.";
    }


    if (inputData.VotesRequired === "" || inputData.VotesRequired === null) {
      newErrors.VotesRequired = "Votes Required is required.";
    } else if (!Number.isInteger(Number(inputData.VotesRequired)) || Number(inputData.VotesRequired) < 1) {
      newErrors.VotesRequired = "Votes Required must be an integer of at least 3.";
    }

    setErrors(newErrors);


    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;


    setInputData((prevData) => ({
      ...prevData,
      [name]:
        name === "TokenSupply" || name === "VotesRequired"
          ? Math.max(0, value)
          : name === "TokenSymbol"
            ? value.toUpperCase().trim()
            : value,
    }));


    if (errors[name]) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: null,
      }));
    }
  };

  const handleSaveAndNext = async (e) => {
    e.preventDefault();

    if (validate()) {
      setIsSubmitting(true);
      try {
        setData((prevData) => ({
          ...prevData,
          step2: { ...inputData },
        }));

        await new Promise((resolve) => setTimeout(resolve, 1000));


        localStorage.removeItem("step2Data");

        setActiveStep(2);
        // toast.success("Step 2 completed successfully!");
      } catch (error) {
        console.error("Error saving data:", error);
        toast.error("An error occurred while saving. Please try again.");
      } finally {
        setIsSubmitting(false);
      }
    } else {
      toast.error("Please fix the highlighted errors before proceeding.");
    }
  };

  const handleBack = () => {
    setActiveStep(0);
  };

  return (
    <React.Fragment>
      <Container>
        <form
          onSubmit={handleSaveAndNext}
          className={`${className}__form bg-[#F4F2EC] mobile:p-10 small_phone:p-6 p-4 big_phone:mx-4 mx-0 rounded-lg flex flex-col mobile:gap-4 gap-2`}
          noValidate
        >
          {/* DAO Token Header */}
          <div className="flex mobile:flex-row flex-col mobile:gap-4 gap-2 mobile:items-center items-start">
            <p
              className="font-semibold mobile:text-base text-sm"
              aria-label="DAO Token"
            >
              DAO Token <span className="text-red-500">*</span>
            </p>
          </div>

          <div className="flex flex-wrap gap-4">
            {/* Token Name */}
            <div className="w-full lg:w-1/5 flex flex-col gap-1">
              <label
                htmlFor="TokenName"
                className="font-semibold mobile:text-base text-xs"
              >
                Token Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="TokenName"
                name="TokenName"
                value={inputData.TokenName}
                onChange={handleChange}
                placeholder="Enter Token Name"
                className={`rounded-lg mobile:p-3 p-2 mobile:text-base text-sm border ${errors.TokenName ? "border-red-500" : "border-gray-300"
                  }`}
              />
              {errors.TokenName && (
                <p className="text-red-500 text-xs">{errors.TokenName}</p>
              )}
            </div>

            {/* Token Symbol */}
            <div className="w-full lg:w-1/5 flex flex-col gap-1">
              <label
                htmlFor="TokenSymbol"
                className="font-semibold mobile:text-base text-xs"
              >
                Token Symbol <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="TokenSymbol"
                name="TokenSymbol"
                value={inputData.TokenSymbol}
                onChange={handleChange}
                placeholder="Enter Token Symbol"
                className={`rounded-lg mobile:p-3 p-2 mobile:text-base text-sm border ${errors.TokenSymbol ? "border-red-500" : "border-gray-300"
                  }`}
              />
              {errors.TokenSymbol && (
                <p className="text-red-500 text-xs">{errors.TokenSymbol}</p>
              )}
            </div>

            {/* Token Supply */}
            <div className="w-full lg:w-1/5 flex flex-col gap-1">
              <div className="flex items-center space-x-1">
                <label
                  htmlFor="TokenSupply"
                  className="font-semibold mobile:text-base text-xs"
                >
                  Token Supply <span className="text-red-500">*</span>
                </label>
                <div className="relative group">
                  <FaInfoCircle className="text-gray-500 cursor-pointer" />

                <div className="absolute left-1/2 transform -translate-x-1/2 bottom-full mb-2 opacity-0 group-hover:opacity-100 bg-gray-700 text-white text-sm rounded-lg py-2 px-6 w-[250px]">
                  <div className="absolute left-1/2 transform -translate-x-1/2 bottom-[-6px] w-0 h-0 border-l-[6px] border-r-[6px] border-t-[6px] border-t-gray-700 border-l-transparent border-r-transparent"></div>
                  Enter the number of tokens to add to this DAO.
                  </div>
                </div>
                </div>
                
              <input
                type="number"
                id="TokenSupply"
                name="TokenSupply"
                value={inputData.TokenSupply}
                onChange={handleChange}
                placeholder="Enter Token Supply"
                className={`rounded-lg mobile:p-3 p-2 mobile:text-base text-sm border ${errors.TokenSupply ? "border-red-500" : "border-gray-300"
                  }`}
                min="1"
              />
              {errors.TokenSupply && (
                <p className="text-red-500 text-xs">{errors.TokenSupply}</p>
              )}
            </div>

            {/* Votes Required */}
            <div className="w-full lg:w-1/5 flex flex-col gap-1">
              <div className="flex items-center space-x-1">
                <label
                  htmlFor="VotesRequired"
                  className="font-semibold mobile:text-base text-xs"
                >
                  Votes Required <span className="text-red-500">*</span>
                </label>
                <div className="relative group">
                <FaInfoCircle className="text-gray-500 cursor-pointer" />

                <div className="absolute left-1/2 transform -translate-x-1/2 bottom-full mb-2 opacity-0 group-hover:opacity-100 bg-gray-700 text-white text-sm rounded-lg py-2 px-6 w-[250px]">
                  <div className="absolute left-1/2 transform -translate-x-1/2 bottom-[-6px] w-0 h-0 border-l-[6px] border-r-[6px] border-t-[6px] border-t-gray-700 border-l-transparent border-r-transparent"></div>
                  Enter the votes needed to approve a proposal for this DAOs
                  </div>
                </div>
              </div>
            
              <input
                type="number"
                id="VotesRequired"
                name="VotesRequired"
                value={inputData.VotesRequired}
                onChange={handleChange}
                placeholder="Enter Votes Required"
                className={`rounded-lg mobile:p-3 p-2 mobile:text-base text-sm border ${
                  errors.VotesRequired ? "border-red-500" : "border-gray-300"
                }`}
                min="1"
              />
              {errors.VotesRequired && (
                <p className="text-red-500 text-xs">{errors.VotesRequired}</p>
              )}
            </div>
          </div>

          {/* Submit Buttons */}
          <div
            className={`${className}__submitButton w-full flex flex-row items-center mobile:justify-end justify-between`}
          >
            <button
              type="button"
              onClick={handleBack}
              className="flex mobile:m-4 my-4 flex-row items-center gap-2 border border-[#0E3746] hover:bg-[#0E3746] text-[#0E3746] hover:text-white mobile:text-base text-sm transition px-4 py-2 rounded-[2rem]"
            >
              <FaArrowLeftLong /> Back
            </button>

            <button
              type="submit"
              className="flex mobile:m-4 my-4 flex-row items-center gap-2 bg-[#0E3746] px-4 py-2 rounded-[2rem] text-white mobile:text-base text-sm disabled:opacity-50"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                "Saving..."
              ) : (
                <>
                  Save & Next <FaArrowRightLong />
                </>
              )}
            </button>
          </div>
        </form>
      </Container>
    </React.Fragment>
  );
};

export default Step2;
