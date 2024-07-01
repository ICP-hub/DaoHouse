import React, { useEffect, useState } from "react";
import addImageLogo from "../../../assets/addImageLogo.png";
import addImageHero from "../../../assets/addImageHero.png";
import closeIcon from "../../../assets/close-icon.png";
import TrashIcon from "../../../assets/Trash.png";
import avtarProfileIcon from "../../../assets/avatarprofile.png";
import { FaArrowRightLong } from "react-icons/fa6";
import { useAuth } from "../utils/useAuthClient";
import { constant } from "../utils/constants";
import { toast } from "react-toastify";


const CreatePostPopup = ({ onClose }) => {
  const [showDescription, setShowDescription] = useState(false);
  const [description, setDescription] = useState("");
  const [showConfirmation, setShowConfirmation] = useState(false);
  // const [selectedImages, setSelectedImages] = useState([]);

  const [imageData, setImageData] = useState({
    base64: "",
    image_content: [],
    image_title: "",
    image_content_type: "",
  });

  const { handleFileUpload } = constant();
  // const userData = userProfile();
  const { backendActor } = useAuth();

  async function handleCreatePost(button) {
    disableBtn(button);
    const canisterId = process.env.CANISTER_ID_IC_ASSET_HANDLER;

    console.log(canisterId);

    const postPayload = {
      username: "User",
      post_img: "This is Post image",
      post_description: "This is a sample post description.",
      image_content: imageData.image_content || "",
      image_title: imageData.image_title || "",
      image_content_type: imageData.image_content_type || "",
    };
    console.log(postPayload);

    try {
      console.log("Inside try");
      const ans = await backendActor.create_new_post(canisterId, postPayload);

      toast.success("Post created successfully");
      console.log("Post created successfully", ans);
      onClose();
      enableBtn(button);
    } catch (error) {
      setTimeout(() => {
        enableBtn(button);
      }, 1000);
      console.error("Error creating post:", error);
    }
  }

  const handleFileUploading = async (event) => {
    // const files = Array.from(event.target.files);
    // setSelectedImages(files);
    const file = event.target.files[0];
    const arrayBuffer = await file.arrayBuffer();
    const content = new Uint8Array(arrayBuffer);

    try {
      const { base64 } = await handleFileUpload(event);

      setImageData((prevData) => ({
        ...prevData,
        base64,
        image_content: Array.from(content),
        image_title: file.name,
        image_content_type: file.type,
      }));
    } catch (error) {
      if (typeof error === "string") {
        toast.error(error);
        console.error("Error:", error);
      } else {
        console.error("Error:", error);
      }
    }
  };

  const handleClose = () => {
    if (imageData.base64 !== "") {
      setShowConfirmation(true);
    } else {
      onClose();
    }
  };

  const handleDiscard = () => {
    setImageData(null);
    setShowConfirmation(false);
    setImageData({ base64: "" });
    onClose();
  };

  const handleDeleteImage = () => {
    setImageData(null);
    setImageData({ base64: "" });
    // const newImages = [...selectedImages];
    // newImages.splice(index, 1);
  };

  function disableBtn(button) {
    button.setAttribute("disabled", "true");
    button.style.opacity = "0.5";
  }
  function enableBtn(button) {
    button.removeAttribute("disabled");
    button.style.opacity = "1";
  }

  // React.useEffect(() => {
  //   const postButton = document.getElementById("postButton");

  //   if (postButton) {
  //     postButton.addEventListener("click", handleCreatePost(postButton));
  //   }
  // }, []);

  useEffect(() => {
    async function callMe() {
      
      const data = await backendActor.get_all_posts();
      const lol = await backendActor.get_user_profile()
      console.log("user data is: ", lol)
      console.log("data: ", data);
    }
    callMe();
  }, []);

  // useEffect(() => {
  //   console.log("function calleddddd")
  //   async function callMe() {
  //     const data = await backendActor.get_user_profile();
  //     console.log("user profile is : ", data);
  //   }

  //   callMe();
  // }, []);

  return (
    <div
      className="create-post-popup fixed z-50 inset-0 overflow-y-auto"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      <div className="absolute flex flex-col items-center lg:left-[26%] lg:top-[30%] md:left-[15%] md:top-[15%] popup-content lg:w-[50%] md:w-[70%] w-[90vw] top-[30%] left-[5%] bg-[#E6E6E6] text-[#05212C] rounded-[10px] p-4">
        <h3 className="md:text-[24px] text-[20px] font-semibold">
          Create a new post
        </h3>

        <div className="bg-black w-full h-[1px] my-2"></div>

        <input
          type="file"
          accept="image/*"
          onChange={handleFileUploading}
          style={{ display: "none" }}
        />

        <div className="w-[80%] my-[5%] flex flex-col items-center gap-8">
          {imageData.base64 !== "" ? (
            <div className="w-full relative">
              <img
                src={imageData.base64}
                alt="POST IMAGE"
                className="object-fit w-full h-48 object-contain md:mb-4"
              />

              {showDescription ? (
                <div className="flex flex-col gap-4">
                  <div className="flex justify-between items-center">
                    <span className="flex items-center md:gap-3 gap-2">
                      <img
                        src={avtarProfileIcon}
                        alt="avtarProfileIcon"
                        className="md:w-full w-7 "
                      />

                      <p className="md:text-[14px] text-[10px] text-[#05212C] font-medium">
                        nzbdchsvvksckshcbkjscb kc
                      </p>
                    </span>

                    <button
                      className="flex items-center justify-center md:w-24 w-18 md:gap-4 gap-2 mt-2 bg-[#0E3746] text-white md:text-[16px] text-[14px] md:px-4 px-3 py-2 font-semibold rounded-[10px]"
                      style={{ boxShadow: "0px 3px 6px 0px #00000026" }}
                      onClick={() => {
                        const postButton =
                          document.getElementById("postButton");
                        if (postButton) {
                          postButton.addEventListener(
                            "click",
                            handleCreatePost(postButton)
                          );
                        }
                      }}
                      id="postButton"
                    >
                      <span>Post</span>
                      <span>
                        <FaArrowRightLong />
                      </span>
                    </button>
                  </div>

                  <textarea
                    placeholder="Write Description here..."
                    className="w-full md:h-32 h-28 bg-[#E6E6E6] rounded-[10px] p-2 border-2 border-[#BDBFF1] md:text-[16px] text-[14px]"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>
              ) : (
                <div className="flex justify-between">
                  <button
                    className="bg-white px-2 rounded-[10px] ml-1"
                    onClick={handleDeleteImage}
                  >
                    <img src={TrashIcon} alt="delete-icon" className="w-full" />
                  </button>

                  <button
                    className="flex items-center justify-center gap-4 mt-2 bg-white text-[#0E3746] px-4 py-2 font-semibold rounded-[10px]"
                    style={{ boxShadow: "0px 3px 6px 0px #00000026" }}
                    onClick={() => setShowDescription(true)}
                  >
                    <span>Next</span>

                    <span>
                      <FaArrowRightLong />
                    </span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <React.Fragment>
              <span className="flex items-end gap-[2px] mt-6">
                <img src={addImageHero} className="w-[45px] h-[39px]" />
                <img
                  src={addImageHero}
                  className="w-[25px] h-[22px] -my-[4px]"
                />
              </span>

              <button
                className="flex items-center justify-center bg-white cursor-pointer w-[150px] h-[35px] rounded-[10px] gap-1 text-[16px] font-semibold"
                onClick={() =>
                  document.querySelector('input[type="file"]').click()
                }
              >
                <span>
                  <img src={addImageLogo} alt="Add Image" />
                </span>
                Add Images
              </button>
            </React.Fragment>
          )}
        </div>

        <button className="absolute top-[4%] right-[2%]" onClick={handleClose}>
          <img
            src={closeIcon}
            alt="close-icon"
            className="w-6 cursor-pointer"
          />
        </button>
        {showConfirmation && (
          <div className="absolute z-60 inset-0 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center">
            <div className="flex flex-col items-center py-16 gap-2 px-24 bg-[#AAC8D6] p-4 rounded">
              <h2 className="text-[20px] text-black font-medium">
                Discard Post?
              </h2>
              <p className="text-[16px] text-[#000000B2] font-medium">
                Your Post will be lost if you leave
              </p>
              <div className="flex justify-end gap-4 mt-6">
                <button
                  className="bg-white text-[#0E3746] font-normal py-3 px-8 rounded-[10px]"
                  onClick={() => setShowConfirmation(false)}
                >
                  Cancel
                </button>
                <button
                  className="bg-[#F3C8C8] text-[#FC1313] font-normal py-3 px-8 rounded-[10px]"
                  onClick={handleDiscard}
                >
                  Discard
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreatePostPopup;