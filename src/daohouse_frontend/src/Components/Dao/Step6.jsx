import React, { useEffect, useState } from "react";
import { FaArrowLeftLong } from "react-icons/fa6";
import { FiUpload } from "react-icons/fi";
import defaultImage from "../../../assets/defaultImage.png";
import CircularProgress from '@mui/material/CircularProgress';
import { toast } from 'react-toastify';
import Container from "../Container/Container";

const Step6 = ({ data, setData, setActiveStep, handleDaoClick }) => {
  const [file, setFile] = useState(null);
  const [fileURL, setFileURL] = useState(defaultImage);
  const [shouldCreateDAO, setShouldCreateDAO] = useState(false);
  const [loadingNext, setLoadingNext] = useState(false);
  const className = "DAO__Step6";

  const handleFileInput = async (event) => {
    const selectedFile = event.target.files[0];

    if (selectedFile) {
      if (selectedFile.size > 2 * 1024 * 1024) {
        toast.error("File size must be less than 2 MB");
        return;
      }

      setFile(selectedFile);
      const url = URL.createObjectURL(selectedFile);
      setFileURL(url);
    } else {
      setFile(null);
      setFileURL(defaultImage);
    }
  };

  const createDAO = async () => {
    if (!file) {
      toast.error("Please insert an image");
      return;
    }

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
    <Container>
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
      
      <div className={
        className +
        "__submitButton w-full flex flex-col md:flex-row items-start mt-3"
      }
    >
      <div className="w-full md:w-[70%] flex-none">
        <div className="h-auto max-w-full m-4 rounded-lg  border border-black">
        <div className="p-3 md:p-7">
        <p className="text-base flex items-center space-x-2 font-semibold">
          <span>Create a new DAO costs 6 ICP</span>
          <div className="pl-10 md:pl-20 lg:pl-40 xl:pl-80">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M10 15C10.2833 15 10.5208 14.9042 10.7125 14.7125C10.9042 14.5208 11 14.2833 11 14C11 13.7167 10.9042 13.4792 10.7125 13.2875C10.5208 13.0958 10.2833 13 10 13C9.71667 13 9.47917 13.0958 9.2875 13.2875C9.09583 13.4792 9 13.7167 9 14C9 14.2833 9.09583 14.5208 9.2875 14.7125C9.47917 14.9042 9.71667 15 10 15ZM9 11H11V5H9V11ZM10 20C8.61667 20 7.31667 19.7375 6.1 19.2125C4.88333 18.6875 3.825 17.975 2.925 17.075C2.025 16.175 1.3125 15.1167 0.7875 13.9C0.2625 12.6833 0 11.3833 0 10C0 8.61667 0.2625 7.31667 0.7875 6.1C1.3125 4.88333 2.025 3.825 2.925 2.925C3.825 2.025 4.88333 1.3125 6.1 0.7875C7.31667 0.2625 8.61667 0 10 0C11.3833 0 12.6833 0.2625 13.9 0.7875C15.1167 1.3125 16.175 2.025 17.075 2.925C17.975 3.825 18.6875 4.88333 19.2125 6.1C19.7375 7.31667 20 8.61667 20 10C20 11.3833 19.7375 12.6833 19.2125 13.9C18.6875 15.1167 17.975 16.175 17.075 17.075C16.175 17.975 15.1167 18.6875 13.9 19.2125C12.6833 19.7375 11.3833 20 10 20Z" fill="#0E3746"/>
            </svg>
          </div>
        </p>
        <p className="mt-3 text-base">
          The 6 ICP will be used to pay for the contract deployment and storage.
        </p>
      </div>
      
        </div>
      </div>

      <div className="w-full md:w-[40%] flex flex-col lg:mt-10 md:flex-row items-center md:items-end justify-center md:justify-end">
        <button
          onClick={() => setActiveStep(4)}
          className="flex mobile:m-4 my-4 flex-row items-center gap-2 border border-[#0E3746] hover:bg-[#0E3746] text-[#3d6979] hover:text-white mobile:text-base text-sm transition px-4 py-2 rounded-[2rem]"
        >
          <FaArrowLeftLong /> Back
        </button>

        {loadingNext ? (
          <CircularProgress className="m-4 my-4" />
        ) : (
          <button
            type="submit"
            onClick={createDAO}
            className="flex mobile:m-4 my-4 flex-row items-center gap-2 bg-[#0E3746] px-4 py-2 rounded-[2rem] text-white mobile:text-base text-sm whitespace-nowrap"
          >
            {loadingNext ? (
              <CircularProgress size={24} />
            ) : (
              "Create DAO"
            )}
          </button>
        )}
      </div>
    </div>
    </Container>
    </React.Fragment>
  );
};

export default Step6;
