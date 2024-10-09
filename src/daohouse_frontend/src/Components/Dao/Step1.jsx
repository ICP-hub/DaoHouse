// import React, { useState, useEffect } from "react";
// import { FaArrowRightLong } from "react-icons/fa6";
// import { toast } from "react-toastify";
// import Container from "../Container/Container";

// const Step1 = ({ setData, setActiveStep, data }) => {
//   const [inputData, setInputData] = useState({
//     DAOIdentifier: "",
//     Purpose: "",
//     DAOType: "",
//     SetUpPeriod: data?.step1?.setUpPeriod || 3,
//     Tokensupply: "",
//     // tokenName: "",
//     // tokenSymbol: "",
//     // tokenissuer: '',
//     // tokens_required_to_vote: 1,
//   });

//   const className = "DAO__Step1";


//   useEffect(() => {
//     const savedData = localStorage.getItem("step1Data");
//     if (savedData) {
//       setInputData(JSON.parse(savedData));
//     } else if (data) {
//       setInputData({
//         DAOIdentifier: data.DAOIdentifier || "",
//         Purpose: data.Purpose || "",
//         DAOType: data.DAOType || "",
//         SetUpPeriod: data?.step1?.setUpPeriod || 3,
//         // Tokensupply: data.Tokensupply || "", 
//         // tokenName: data.tokenName || "",
//         // tokenSymbol: data.tokenSymbol || "",
//         // tokenissuer: '',
//         // tokens_required_to_vote: data.tokens_required_to_vote || 1,
//       });
//     }
//   }, [data]);

//   useEffect(() => {
//     localStorage.setItem("step1Data", JSON.stringify(inputData));
//   }, [inputData]);

//   async function handleSaveAndNext() {
//     if (
//       inputData.DAOIdentifier === ""
//       // inputData.tokenName === "" ||
//       // inputData.tokenSymbol === ""
//     ) {
//       toast.error("Empty fields are not allowed");
//       return;
//     }

//     try {
//       setData((prevData) => ({
//         ...prevData,
//         step1: { ...inputData },
//       }));

//       await new Promise((resolve) => setTimeout(resolve, 1000));

//       setActiveStep(1);
//     } catch (error) {
//       console.error("Error saving data:", error);
//     }
//   }

//   function handleChange(e) {
//     setInputData({
//       ...inputData,
//       [e.target.name]: e.target.value,
//     });

//     console.log(inputData);
//   }
//   function changePeriod(value) {
//     // Convert the value to a number, ensure it's non-negative, and append "days"
//     const numberValue = Math.max(parseInt(value, 10) || 1, 0);
//     setInputData({
//       setUpPeriod: numberValue,
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
//           {/* DAO Identifier */}
//           <label
//             htmlFor="name"
//             className="font-semibold mobile:text-base text-sm"
//           >
//             DAO Identifier
//             {/* <span className="text-red-500">*</span> */}
//           </label>
//           <input
//             type="text"
//             name="DAOIdentifier"
//             required
//             value={inputData.DAOIdentifier}
//             placeholder="Enter DAO Name"
//             className="rounded-lg mobile:p-3 p-2 mobile:text-base text-sm"
//             onChange={handleChange}
//           />

//           {/** Purpose of DAO */}
//           <label
//             htmlFor="purpose"
//             className="font-semibold mobile:text-base text-sm"
//           >
//             Purpose of DAO
//             {/* <span className="text-red-500">*</span> */}
//           </label>
//           <textarea
//             type="text"
//             name="Purpose"
//             value={inputData.Purpose}
//             placeholder="Specify the primary purpose or objectives the DAO aims to achieve, such as governance, funding, community building,"
//             className="rounded-lg mobile:p-3 p-2 mobile:text-base text-sm"
//             onChange={handleChange}
//           />

//           {/** DAO Type */}
//           {/* <label
//             htmlFor="type"
//             className="font-semibold mobile:text-base text-sm"
//           >
//             DAO Type
           
//           </label>
//           <input
//             onChange={handleChange}
//             type="text"
//             value={inputData.DAOType}
//             name="DAOType"
//             className="rounded-lg mobile:p-3 p-2 mobile:text-base text-sm"
//           /> */}

//           {/* setUp Period */}
//           <label
//             htmlFor="type"
//             className="font-semibold mobile:text-base text-sm"
//           >
           
//             Setup Period(in days)
//             {/* <span className="text-red-500">*</span> */}
//           </label>
//           <input
//             type="number"
//             value={inputData.SetUpPeriod}
//             onChange={(e) => changePeriod(e.target.value)}
//             name="SetUpPeriod"
//             className="rounded-lg mobile:p-3 p-2 mobile:text-base text-sm"
//           />



//           {/** DAO Token */}
//           {/* <div className="flex mobile:flex-row flex-col mobile:gap-4 gap-2 mobile:items-center items-start">
//             <p
//               htmlFor="type"
//               className="font-semibold mobile:text-base text-sm"
//             >
//               DAO Token*
//             </p>
            
//             <div className="flex flex-row gap-2">
//               <button
//                 className={
//                   "bg-[#0E3746] text-white mobile:p-2 px-4 py-1 mobile:rounded-lg rounded-md transition mobile:text-base text-sm"
//                 }
//                 // onClick={() => handlenewTokenFlag(true)}
//               >
//                 New Token
//               </button>
//             </div>
//           </div> */}

//           {/* <div className="flex mobile:flex-row flex-col mobile:gap-4 gap-2">
//             <div className="flex flex-col mobile:w-1/2 mobile:gap-4 gap-2">
//               <label
//                 htmlFor="tokenName"
//                 className="font-semibold mobile:text-base text-xs"
//               >
//                 Token Name<span className="text-red-500">*</span>
//               </label>

//               <input
//                 required
//                 type="text"
//                 name="tokenName"
//                 value={inputData.tokenName}
//                 onChange={handleChange}
//                 className="rounded-lg mobile:p-3 p-2 mobile:text-base text-sm"
//               />
//             </div>
//             <div className="flex flex-col mobile:w-1/2 mobile:gap-4 gap-2">
//               <label
//                 htmlFor="tokenSymbol"
//                 className="font-semibold mobile:text-base text-xs"
//               >
//                 Token Symbol<span className="text-red-500">*</span>
//               </label>

//               <input
//                 required
//                 type="text"
//                 name="tokenSymbol"
//                 value={inputData.tokenSymbol}
//                 onChange={handleChange}
//                 className="rounded-lg mobile:p-3 p-2 mobile:text-base text-sm"
//               />
//             </div>
//           </div> */}

//           {/* <label className="font-semibold" htmlFor="tokens_required_to_vote">Tokens Required to Vote:
//           <span className="text-red-500">*</span>
//           </label>
//           <input
//             type="number"
//             id="tokens_required_to_vote"
//             name="tokens_required_to_vote"
//             value={inputData.tokens_required_to_vote}
//             onChange={handleChange}
//             required
//             className="rounded-lg mobile:p-3 p-2 mobile:text-base text-sm"
//           /> */}
//         </div>

//         <div
//           className={
//             className +
//             "__submitButton w-full flex flex-row items-center justify-end"
//           }
//         >
//           <button
//             type="submit"
//             onClick={handleSaveAndNext}
//             className="flex mobile:m-4 my-4 flex-row items-center gap-2 bg-[#0E3746] px-4 py-2 rounded-[2rem] text-white mobile:text-base text-sm"
//           >
//             Save & Next <FaArrowRightLong />
//           </button>
//         </div>
//       </Container>
//     </React.Fragment>
//   );
// };

// export default Step1;


import React, { useState, useEffect } from "react";
import { FaArrowRightLong } from "react-icons/fa6";
import { toast } from "react-toastify";
import Container from "../Container/Container";

const Step1 = ({ setData, setActiveStep, data }) => {
  const [inputData, setInputData] = useState({
    DAOIdentifier: "",
    Purpose: "",
    SetUpPeriod: data?.step1?.SetUpPeriod || 3,
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const className = "DAO__Step1";

  // Load saved data from localStorage or props
  useEffect(() => {
    const savedData = localStorage.getItem("step1Data");
    if (savedData) {
      setInputData(JSON.parse(savedData));
    } else if (data) {
      setInputData({
        DAOIdentifier: data.DAOIdentifier || "",
        Purpose: data.Purpose || "",
        SetUpPeriod: data?.step1?.SetUpPeriod || 3,
      });
    }
  }, [data]);

  // Save data to localStorage whenever inputData changes
  useEffect(() => {
    localStorage.setItem("step1Data", JSON.stringify(inputData));
  }, [inputData]);

  // Validation functions
  const validate = () => {
    const newErrors = {};

    // DAO Identifier Validation
    if (!inputData.DAOIdentifier.trim()) {
      newErrors.DAOIdentifier = "DAO Identifier is required.";
    } else if (!/^[a-zA-Z0-9_]+$/.test(inputData.DAOIdentifier)) {
      newErrors.DAOIdentifier =
        "DAO Identifier can only contain letters, numbers, and underscores.";
    } else if (inputData.DAOIdentifier.length < 3) {
      newErrors.DAOIdentifier =
        "DAO Identifier must be at least 3 characters long.";
    }

    // Purpose Validation
    if (!inputData.Purpose.trim()) {
      newErrors.Purpose = "Purpose of DAO is required.";
    } else if (inputData.Purpose.length < 10) {
      newErrors.Purpose =
        "Purpose should be at least 10 characters to provide sufficient detail.";
    }

    // Setup Period Validation
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

    // Return true if no errors
    return Object.keys(newErrors).length === 0;
  };

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    // Update input data
    setInputData({
      ...inputData,
      [name]: value,
    });

    // Remove error message for the field being edited
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null,
      });
    }
  };

  // Handle Setup Period separately to ensure it's a number
  const changePeriod = (value) => {
    const numberValue = Math.max(parseInt(value, 10) || 1, 1);
    setInputData({
      ...inputData,
      SetUpPeriod: numberValue,
    });

    // Remove error if any
    if (errors.SetUpPeriod) {
      setErrors({
        ...errors,
        SetUpPeriod: null,
      });
    }
  };

  // Handle form submission
  async function handleSaveAndNext(e) {
    e.preventDefault();

    if (validate()) {
      setIsSubmitting(true);
      try {
        setData((prevData) => ({
          ...prevData,
          step1: { ...inputData },
        }));

        // Simulate async operation
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Clear localStorage upon successful submission
        localStorage.removeItem("step1Data");

        setActiveStep(1);
        toast.success("Step 1 completed successfully!");
      } catch (error) {
        console.error("Error saving data:", error);
        toast.error("An error occurred while saving. Please try again.");
      } finally {
        setIsSubmitting(false);
      }
    } else {
      toast.error("Please fix the highlighted errors before proceeding.");
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
              className={`rounded-lg mobile:p-3 p-2 mobile:text-base text-sm ${
                errors.DAOIdentifier
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
              className={`rounded-lg mobile:p-3 p-2 mobile:text-base text-sm h-32 resize-none ${
                errors.Purpose ? "border border-red-500" : "border border-gray-300"
              }`}
              onChange={handleChange}
            />
            {errors.Purpose && (
              <p className="text-red-500 text-sm mt-1">{errors.Purpose}</p>
            )}
          </div>

          {/* Setup Period */}
          <div className="flex flex-col">
            <label
              htmlFor="SetUpPeriod"
              className="font-semibold mobile:text-base text-sm"
            >
              Setup Period (in days) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              id="SetUpPeriod"
              name="SetUpPeriod"
              value={inputData.SetUpPeriod}
              placeholder="Enter setup period in days"
              className={`rounded-lg mobile:p-3 p-2 mobile:text-base text-sm ${
                errors.SetUpPeriod
                  ? "border border-red-500"
                  : "border border-gray-300"
              }`}
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
