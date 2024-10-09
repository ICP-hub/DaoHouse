// import React, { useState, useEffect } from "react";
// import { FaArrowLeftLong, FaArrowRightLong } from "react-icons/fa6";
// import CircularProgress from '@mui/material/CircularProgress';
// import Container from "../Container/Container";

// const Step2 = ({ setData, setActiveStep, data }) => {

//   const [localData, setLocalData] = useState(data);
//   const [tokenNameError, setTokenNameError] = useState("");
//   const [tokenSymbolError, setTokenSymbolError] = useState("");
//   const [tokenSupplyError, setTokenSupplyError] = useState("");
//   const [votesRequiredError, setVotesRequiredError] = useState("");
//   const [loadingNext, setLoadingNext] = useState(false);
//   const [loadingBack, setLoadingBack] = useState(false);
//   const className = "DAO__Step2";

//   const [inputData, setInputData] = useState({
//     TokenName: data.TokenName || "",
//     TokenSymbol: data.TokenSymbol || "",
//     TokenSupply: data.TokenSupply || 0,
//     VotesRequired: data.VotesRequired || 3,
//   });


//   useEffect(() => {
//     setLocalData(data);
//   }, [data]);

//   console.log("inputData", inputData)
//   // useEffect(() => {
//   //   if (data?.setUpPeriod !== undefined) {
//   //     setInputData({ setUpPeriod: data.setUpPeriod });
//   //   }
//   // }, [data]);


//   useEffect(() => {
//     const savedData = localStorage.getItem('step2Data');
//     if (savedData) {
//       setInputData(JSON.parse(savedData));
//     } else if (data) {
//       setInputData({
//         // setUpPeriod: data.setUpPeriod,
//         TokenName: data.TokenName,
//         TokenSymbol: data.TokenSymbol,
//         TokenSupply: data.TokenSupply,
//         VotesRequired: data.VotesRequired || 3,
//       });

//     }
//   }, [data]);

//   // Save data to local storage whenever inputData changes
//   useEffect(() => {
//     localStorage.setItem('step2Data', JSON.stringify(inputData));
//   }, [inputData]);

//   const handleSaveAndNext = () => {
//     // Reset error messages
//     setTokenNameError("");
//     setTokenSymbolError("");
//     setTokenSupplyError("");
//     setVotesRequiredError("");

//     let isValid = true;

//     if (inputData.TokenName.trim() === "") {
//       setTokenNameError("Token Name cannot be empty.");
//       isValid = false;
//     }

//     if (inputData.TokenSymbol.trim() === "") {
//       setTokenSymbolError("Token Symbol cannot be empty or contain only spaces.");
//       isValid = false;
//     }

//     if (inputData.TokenSupply <= 0) {
//       setTokenSupplyError("Token Supply must be a positive number.");
//       isValid = false;
//     }

//     if (inputData.VotesRequired < 3) {
//       setVotesRequiredError("Votes Required must be at least 3.");
//       isValid = false;
//     }

//     if (isValid) {
//       setData((prev) => ({
//         ...prev,
//         step2: { ...inputData },
//       }));
//       setActiveStep(2);
//     }
//   };

//   function handleBack() {
//     setActiveStep(0);
//   }
//   // const handleChange = (e) => {
//   //   const { name, value } = e.target;
//   //   const trimmedValue = name === "TokenSymbol" ? value.trim() : value; // Trim spaces only for TokenSymbol
//   //   setInputData((prevData) => ({
//   //     ...prevData,
//   //     [name]: trimmedValue,
//   //   }));
//   // };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setInputData((prevData) => ({
//       ...prevData,
//       [name]: name === "TokenSupply" || name === "VotesRequired" ? Math.max(0, value) : name === "TokenSymbol" ? value.trim() : value,
//     }));
//   };


//   function changePeriod(value) {
//     // Convert the value to a number, ensure it's non-negative, and append "days"
//     const numberValue = Math.max(parseInt(value, 10) || 1, 0);
//     setInputData({
//       TokenSupply: numberValue,
//     });
//   }

//   return (
//     <React.Fragment>
//       <Container>
//         <div
//           className={
//             className +
//             "__form bg-[#F4F2EC] mobile:p-10 small_phone:p-6 p-4 big_phone:mx-4 mx-0 rounded-lg flex flex-col mobile:gap-4 gap-2"
//           }
//         >
//           {/* dao token */}
//           <div className="flex mobile:flex-row flex-col mobile:gap-4 gap-2 mobile:items-center items-start">
//             <p
//               htmlFor="type"
//               className="font-semibold mobile:text-base text-sm"
//             >
//               DAO Token*
//             </p>

//           </div>

//           <div className="flex flex-wrap  gap-4">

//             {/* token name */}
//             <div className="w-full lg:w-1/5 flex flex-col gap-4">
//               <label htmlFor="tokenName" className="font-semibold mobile:text-base text-xs">
//                 Token Name
//               </label>
//               <input
//                 required
//                 type="text"
//                 name="TokenName"
//                 value={inputData.TokenName}
//                 onChange={handleChange}
//                 className="rounded-lg mobile:p-3 p-2 mobile:text-base text-sm"
//               />
//               {tokenNameError && <p className="text-red-500 text-xs">{tokenNameError}</p>}
//             </div>

//             {/* token symbol */}
//             <div className="w-full lg:w-1/5 flex flex-col gap-4">
//               <label htmlFor="tokenSymbol" className="font-semibold mobile:text-base text-xs">
//                 Token Symbol
//               </label>
//               <input
//                 required
//                 type="text"
//                 name="TokenSymbol"
//                 value={inputData.TokenSymbol}
//                 onChange={handleChange}
//                 className="rounded-lg mobile:p-3 p-2 mobile:text-base text-sm"
//               />
//               {tokenSymbolError && <p className="text-red-500 text-xs">{tokenSymbolError}</p>}
//             </div>

//             {/* TokenSupply */}
//             <div className="w-full lg:w-1/5 flex flex-col gap-4">
//               <label htmlFor="tokenSupply" className="font-semibold mobile:text-base text-xs">
//                 Token Supply
//               </label>
//               <input
//                 required
//                 type="number"
//                 name="TokenSupply"
//                 value={inputData.TokenSupply || 0}
//                 onChange={handleChange}
//                 className="rounded-lg mobile:p-3 p-2 mobile:text-base text-sm"
//               />
//               {tokenSupplyError && <p className="text-red-500 text-xs">{tokenSupplyError}</p>}
//             </div>

//             {/* Votes Required */}
//             <div className="w-full lg:w-1/5 flex flex-col gap-4">
//               <label htmlFor="votesRequired" className="font-semibold mobile:text-base text-xs">
//                 Votes Required
//               </label>
//               <input
//                 required
//                 type="number"
//                 name="VotesRequired"
//                 value={inputData.VotesRequired}
//                 onChange={handleChange}
//                 className="rounded-lg mobile:p-3 p-2 mobile:text-base text-sm"
//               />
//               {votesRequiredError && <p className="text-red-500 text-xs">{votesRequiredError}</p>}
//             </div>
//           </div>
//           {/* <label htmlFor="purpose" className="font-semibold mobile:text-base text-sm">
//           Setup Period (in days)
//         </label> 
//            <p className="text-slate-500 mobile:text-base text-xs">
//           Setup the period between when a proposal is approved and is executed.
//         </p> 
//            <input
//           type="number"
//           name="purpose"
//           value={inputData.setUpPeriod}
//           onChange={(e) => changePeriod(e.target.value)}
//           placeholder="Setup the period between when a proposal is approved and is executed."
//           className="rounded-lg mobile:p-3 p-2 mobile:text-base text-sm"
//         /> */}
//         </div>



//         <div
//           className={
//             className +
//             "__submitButton w-full flex flex-row items-center mobile:justify-end justify-between"
//           }
//         >
//           {loadingBack ? (
//             <CircularProgress className="m-4 my-4" />
//           ) : (
//             <button
//               onClick={handleBack}
//               className="flex mobile:m-4 my-4 flex-row items-center gap-2 border border-[#0E3746] hover:bg-[#0E3746] text-[#0E3746] hover:text-white mobile:text-base text-sm transition px-4 py-2 rounded-[2rem]"
//             >
//               <FaArrowLeftLong /> Back
//             </button>
//           )}
//           {loadingNext ? (
//             <CircularProgress className="m-4 my-4" />
//           ) : (
//             <button
//               type="submit"
//               onClick={handleSaveAndNext}
//               className="flex mobile:m-4 my-4 flex-row items-center gap-2 bg-[#0E3746] px-4 py-2 rounded-[2rem] text-white mobile:text-base text-sm"
//             >
//               Save & Next <FaArrowRightLong />
//             </button>
//           )}
//         </div>
//       </Container>
//     </React.Fragment>
//   );
// };

// export default Step2;



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
    VotesRequired: 3,
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
        VotesRequired: data.VotesRequired || 3,
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
    } else if (!Number.isInteger(Number(inputData.TokenSupply)) || Number(inputData.TokenSupply) <= 0) {
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
                min="1"
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
