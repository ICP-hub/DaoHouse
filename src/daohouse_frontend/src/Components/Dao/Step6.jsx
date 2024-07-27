import React, { useEffect, useState } from "react";
import { FaArrowLeftLong } from "react-icons/fa6";
import { FiUpload } from "react-icons/fi";
import defaultImage from "../../../assets/defaultImage.png";
import CircularProgress from '@mui/material/CircularProgress';

const Step6 = ({ data, setData, setActiveStep, handleDaoClick }) => {
  const [file, setFile] = useState(null);
  const [fileURL, setFileURL] = useState(defaultImage);
  const [shouldCreateDAO, setShouldCreateDAO] = useState(false);
  const [loadingNext, setLoadingNext] = useState(false);
  const className = "DAO__Step6";

  const handleFileInput = async (event) => {
    const selectedFile = event.target.files[0];

    if (selectedFile) {
      setFile(selectedFile);
      const url = URL.createObjectURL(selectedFile);
      setFileURL(url);
    } else {
      setFile(null);
      setFileURL(defaultImage);
    }
  };

  const createDAO = async () => {
    setLoadingNext(true);
    setTimeout(async () => {
      if (file) {
        const fileContent = await readFileContent(file);
        setData((prevData) => ({
          ...prevData,
          step6: {
            imageURI: fileURL,
            image_content: new Uint8Array(fileContent),
            image_content_type: file.type,
            image_title: file.name,
            image_id: '12',
          },
        }));
      } else {
        setData((prevData) => ({
          ...prevData,
          step6: {
            imageURI: defaultImage,
            image_content: undefined,
            image_content_type: undefined,
            image_title: undefined,
            image_id: '12',
          },
        }));
      }
      setLoadingNext(false);
      setShouldCreateDAO(true);
    }, 2000);


  };

  const readFileContent = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsArrayBuffer(file);
    });
  };

  useEffect(() => {
    if (shouldCreateDAO) {
      handleDaoClick();
      setShouldCreateDAO(false);
    }
  }, [data, shouldCreateDAO, handleDaoClick]);

  console.log("data of all steps: ", data)
  return (
    <React.Fragment>
      <div
        className={
          className +
          "__form w-full bg-[#F4F2EC] big_phone:p-10 mobile:p-6 p-3 big_phone:mx-4 mx-0 rounded-lg flex flex-col gap-4"
        }
      >
        <p className="mobile:text-base text-sm font-semibold">Set Profile Picture</p>

        <div className="uploadImage flex big_phone:flex-row flex-col items-center justify-start gap-4">
          <img
            src={fileURL}
            alt="Image"
            className="rounded-lg w-[350px] h-[200px] object-cover"
          />

          <label
            htmlFor="profile"
            className="flex mobile:text-base text-xs font-semibold cursor-pointer mobile:m-4 m-2 flex-row items-center gap-2 bg-white px-4 py-2 rounded-[2rem] text-black shadow-xl"
          >
            <FiUpload /> Upload New Photo
          </label>
          <input
            type="file"
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
          "__submitButton w-full flex flex-row items-center mobile:justify-end justify-between"
        }
      >


        <button
          onClick={() => setActiveStep(4)}
          className="flex mobile:m-4 my-4 flex-row items-center gap-2 border border-[#0E3746] hover:bg-[#0E3746] text-[#0E3746] hover:text-white mobile:text-base text-sm transition px-4 py-2 rounded-[2rem]"
        >
          <FaArrowLeftLong /> Back
        </button>


        {loadingNext ? (
          <CircularProgress className="m-4 my-4" />
        ) : (
          <button
            type="submit"
            onClick={createDAO}
            className="flex mobile:m-4 my-4 flex-row items-center gap-2 bg-[#0E3746] px-4 py-2 rounded-[2rem] text-white mobile:text-base text-sm"
          >
            Create DAO
          </button>
        )}
      </div>
    </React.Fragment>
  );
};

export default Step6;


