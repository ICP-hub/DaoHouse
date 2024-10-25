import React, { useState, useEffect } from "react";
import { FaArrowLeftLong, FaArrowRightLong } from "react-icons/fa6";
import CircularProgress from "@mui/material/CircularProgress";
import { toast } from "react-toastify";
import Container from "../Container/Container";

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

  // Load saved data from localStorage or props
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

  // Save data to localStorage whenever inputData changes
  useEffect(() => {
    localStorage.setItem("step2Data", JSON.stringify(inputData));
  }, [inputData]);

  // Validation function
  const validate = () => {
    const newErrors = {};

    // Token Name Validation
    if (!inputData.TokenName.trim()) {
      newErrors.TokenName = "Token Name is required.";
    } else if (!/^[a-zA-Z0-9 ]+$/.test(inputData.TokenName)) {
      newErrors.TokenName =
        "Token Name can only contain letters, numbers, and spaces.";
    } else if (inputData.TokenName.length < 2) {
      newErrors.TokenName = "Token Name must be at least 2 characters long.";
    }

    // Token Symbol Validation
    if (!inputData.TokenSymbol.trim()) {
      newErrors.TokenSymbol = "Token Symbol is required.";
    } else if (!/^[A-Z0-9\-]+$/.test(inputData.TokenSymbol)) {
      newErrors.TokenSymbol =
        "Token Symbol can only contain uppercase letters, numbers, and hyphens.";
    } else if (inputData.TokenSymbol.length < 3 || inputData.TokenSymbol.length > 5) {
      newErrors.TokenSymbol =
        "Token Symbol must be between 3 to 5 characters long.";
    }

    // Token Supply Validation
    if (inputData.TokenSupply === "" || inputData.TokenSupply === null) {
      newErrors.TokenSupply = "Token Supply is required.";
    } else if (!Number.isInteger(Number(inputData.TokenSupply)) || Number(inputData.TokenSupply) <= 1) {
      newErrors.TokenSupply = "Token Supply must be a positive integer.";
    }

    // Votes Required Validation
    if (inputData.VotesRequired === "" || inputData.VotesRequired === null) {
      newErrors.VotesRequired = "Votes Required is required.";
    } else if (!Number.isInteger(Number(inputData.VotesRequired)) || Number(inputData.VotesRequired) < 3) {
      newErrors.VotesRequired = "Votes Required must be an integer of at least 3.";
    }

    setErrors(newErrors);

    // Return true if no errors
    return Object.keys(newErrors).length === 0;
  };

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    // Update input data
    setInputData((prevData) => ({
      ...prevData,
      [name]:
        name === "TokenSupply" || name === "VotesRequired"
          ? Math.max(0, value)
          : name === "TokenSymbol"
          ? value.toUpperCase().trim()
          : value,
    }));

    // Remove error message for the field being edited
    if (errors[name]) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: null,
      }));
    }
  };

  // Handle form submission
  const handleSaveAndNext = async (e) => {
    e.preventDefault();

    if (validate()) {
      setIsSubmitting(true);
      try {
        setData((prevData) => ({
          ...prevData,
          step2: { ...inputData },
        }));

        // Simulate async operation (e.g., API call)
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Clear localStorage upon successful submission
        localStorage.removeItem("step2Data");

        setActiveStep(2);
        toast.success("Step 2 completed successfully!");
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

  // Handle back navigation
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
                className={`rounded-lg mobile:p-3 p-2 mobile:text-base text-sm border ${
                  errors.TokenName ? "border-red-500" : "border-gray-300"
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
                className={`rounded-lg mobile:p-3 p-2 mobile:text-base text-sm border ${
                  errors.TokenSymbol ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.TokenSymbol && (
                <p className="text-red-500 text-xs">{errors.TokenSymbol}</p>
              )}
            </div>

            {/* Token Supply */}
            <div className="w-full lg:w-1/5 flex flex-col gap-1">
              <label
                htmlFor="TokenSupply"
                className="font-semibold mobile:text-base text-xs"
              >
                Token Supply <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                id="TokenSupply"
                name="TokenSupply"
                value={inputData.TokenSupply}
                onChange={handleChange}
                placeholder="Enter Token Supply"
                className={`rounded-lg mobile:p-3 p-2 mobile:text-base text-sm border ${
                  errors.TokenSupply ? "border-red-500" : "border-gray-300"
                }`}
                min="1000"
              />
              {errors.TokenSupply && (
                <p className="text-red-500 text-xs">{errors.TokenSupply}</p>
              )}
            </div>

            {/* Votes Required */}
            <div className="w-full lg:w-1/5 flex flex-col gap-1">
              <label
                htmlFor="VotesRequired"
                className="font-semibold mobile:text-base text-xs"
              >
                Votes Required <span className="text-red-500">*</span>
              </label>
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
                min="3"
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
