import React, { useEffect, useState } from "react";
import { FaArrowLeftLong } from "react-icons/fa6";
import { FiUpload } from "react-icons/fi";
import defaultImage from "../../../assets/defaultImage.png";

const Step6 = ({ data, setData, setActiveStep }) => {
  const [fileURL, setFileURL] = useState(defaultImage);
  const className = "DAO__Step6";

  const handleFileInput = async (event) => {
    const file = event.target.files[0];

    if (file) {
      const url = URL.createObjectURL(file);
      setFileURL(url);
    } else {
      setFileURL(defaultImage);
    }
  };

  useEffect(() => {
    console.log(data);
  }, [data])

  function createDAO() {
    setData((prevData) => ({
      ...prevData,
      step6: { imageURI: fileURL },
    }))
  }

  return (
    <React.Fragment>
      <div
        className={
          className +
          "__form w-full bg-[#F4F2EC] p-10 rounded-lg flex flex-col gap-4"
        }
      >
        <p>Set Profile Picture</p>

        <div className="uploadImage flex flex-row items-center justify-start gap-4">
          <img
            src={fileURL}
            alt="Image"
            className="rounded-lg w-[350px] h-[200px] object-cover"
          />

          <label
            htmlFor="profile"
            className="flex cursor-pointer m-4 flex-row items-center gap-2 bg-white px-4 py-2 rounded-[2rem] text-black shadow-xl"
            onClick={handleFileInput}
          >
            <FiUpload /> Upload New Photo
          </label>
          <input
            type="file"
            name="Change"
            id="profile"
            className="hidden"
            accept="image/*"
            onChange={handleFileInput}
          />
        </div>
      </div>

      <div
        className={
          className +
          "__submitButton w-full flex flex-row items-center justify-end"
        }
      >
        <button
          onClick={() => setActiveStep(3)}
          className="flex m-4 flex-row items-center gap-2 border border-[#0E3746] hover:bg-[#0E3746] text-[#0E3746] hover:text-white transition px-4 py-2 rounded-[2rem]"
        >
          <FaArrowLeftLong /> Back
        </button>
        <button
          type="submit"
          onClick={createDAO}
          className="flex m-4 flex-row items-center gap-2 bg-[#0E3746] px-4 py-2 rounded-[2rem] text-white"
        >
          Create DAO
        </button>
      </div>
    </React.Fragment>
  );
};

export default Step6;
