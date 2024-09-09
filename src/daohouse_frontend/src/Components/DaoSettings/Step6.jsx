import React, { useEffect, useState } from "react";
import { FiUpload } from "react-icons/fi";
import defaultImage from "../../../assets/defaultImage.png";

const Step6 = ({ data, setData }) => {
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
  }, [data]);

  function createDAO() {
    setData((prevData) => ({
      ...prevData,
      step6: { imageURI: fileURL },
    }));
  }

  return (
    <React.Fragment>
      <div
        className={
          className +
          "__form w-full bg-[#F4F2EC] big_phone:p-10 mobile:p-6 p-3 big_phone:mx-4 mx-0 rounded-lg flex flex-col gap-4"
        }
      >
        <p className="mobile:text-base text-sm font-semibold">
          Set Profile Picture
        </p>

        <div className="uploadImage flex big_phone:flex-row flex-col items-center justify-start gap-4">
          <img
            src={fileURL}
            alt="Image"
            className="rounded-lg w-[350px] h-[200px] object-cover"
          />

          <label
            htmlFor="profile"
            className="flex mobile:text-base text-xs font-semibold cursor-pointer mobile:m-4 m-2 flex-row items-center gap-2 bg-white px-4 py-2 rounded-[2rem] text-black shadow-xl"
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
          type="submit"
          onClick={createDAO}
          className="flex mobile:m-4 my-4 flex-row items-center gap-2 bg-[#0E3746] px-4 py-2 rounded-[2rem] text-white mobile:text-base text-sm"
        >
          Propose Change
        </button>
      </div>
    </React.Fragment>
  );
};

export default Step6;
