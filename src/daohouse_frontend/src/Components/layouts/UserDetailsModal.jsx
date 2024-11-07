import React, { useState, useRef, useEffect } from "react";
import defaultImage from "../../../assets/Avatar.png";
import { useAuth } from "../utils/useAuthClient";
import { useAuthClient } from "../../connect/useClient";


const UserDetailsModal = ({ isOpen, onClose, onSubmit }) => {

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  const [fileURL, setFileURL] = useState(defaultImage);
  const [errors, setErrors] = useState({});
  const fileInputRef = useRef(null);
  const { backendActor } = useAuthClient();
  const [isLoading, setIsLoading] = useState(false);


  useEffect(() => {
    if (isOpen) {
      document.body.style.position = 'fixed';
      document.body.style.top = `-${window.scrollY}px`;
      document.body.style.width = '100%';
    } else {
      const scrollY = document.body.style.top;
      document.body.style.position = '';
      document.body.style.top = '';
      window.scrollTo(0, parseInt(scrollY || '0') * -1);
    }

    return () => {
      document.body.style.position = '';
      document.body.style.top = '';
    };
  }, [isOpen]);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateInputs = () => {
    const newErrors = {};
    if (!name.trim()) {
      newErrors.name = "Name is required";
    }
    if (!email.trim() || !validateEmail(email)) {
      newErrors.email = "A valid email is required";
    }
    if (!profileImage) {
      newErrors.profileImage = "Profile image is required";
    }
    return newErrors;
  };

  const handleFileInput = () => {
    fileInputRef.current.click();
  };


  const handleSubmit = async () => {
    const inputErrors = validateInputs();
    if (Object.keys(inputErrors).length > 0) {
      setErrors(inputErrors);
      return;
    }

    setIsLoading(true);

    const reader = new FileReader();
    reader.readAsArrayBuffer(profileImage);
    reader.onloadend = async () => {
      try {
        const fileContent = Array.from(new Uint8Array(reader.result));
        const MinimalProfileinput = {
          email_id: email,
          name: name,
          image_content: fileContent,
          image_title: profileImage.name,
          image_content_type: profileImage.type,
        };
        const response = await backendActor.create_profile(MinimalProfileinput);
        console.log("response", response);
        onClose();
        onSubmit();
      } catch (error) {
        console.log("error", error);
        alert("An error occurred while creating the profile");
      } finally {
        setIsLoading(false);
      }
    };
  };
  const handleNameChange = (e) => {
    setName(e.target.value);
    setErrors((prevErrors) => ({ ...prevErrors, name: null })); // Clear name error
  };
  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    setErrors((prevErrors) => ({ ...prevErrors, email: null })); // Clear email error
  };
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("File size must be less than 5 MB");
        return;
      }
      setProfileImage(file);
      setFileURL(URL.createObjectURL(file));
      setErrors((prevErrors) => ({ ...prevErrors, profileImage: null })); // Clear profile image error
    }
  };
  if (!isOpen) return null;

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 flex justify-center items-center z-[10000] overflow-hidden border border-black">
          <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex justify-center items-center z-[15000]">
            <div className="bg-[#F4F2EC] mobile:p-4 small_phone:p-3 p-2 rounded-lg shadow-lg w-full max-w-md max-h-[85vh] overflow-y-auto z-[20000] mx-6">
              <div className="flex flex-col border-white relative">
                <h2 className="font-lg mobile:text-lg text-lg text-center font-mulish mb-4 mt-0 ">
                  Add Details
                </h2>


                <label htmlFor="name" className="mobile:text-base text-sm mb-1">
                  Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={handleNameChange}
                  placeholder="Enter your Name"
                  className="rounded-lg mobile:p-3 p-2 mobile:text-base text-sm mb-1"
                />
                {errors.name && <p className="text-red-500 text-sm mb-4">{errors.name}</p>}

                {/* Email Input */}
                <label htmlFor="email" className="mobile:text-base text-sm mb-1">
                  Email<span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={handleEmailChange}
                  placeholder="Enter your Email"
                  className="rounded-lg mobile:p-3 p-2 mobile:text-base text-sm mb-1"
                />
                {errors.email && <p className="text-red-500 text-sm mb-4">{errors.email}</p>}

                {/* Profile Image Upload */}
                <label htmlFor="profile" className="mobile:text-base text-sm mb-1">
                  Upload Image<span className="text-red-500">*</span>
                </label>
                <div className="relative mb-4 bg-white rounded-lg flex justify-center items-center h-24">
                  <div className="flex flex-col">
                    <button
                      type="button"
                      onClick={handleFileInput}
                      className="text-black text-sm border border-black py-2 px-2 rounded-lg flex justify-center items-center"
                    >
                      Upload Image
                    </button>
                    <input
                      type="file"
                      ref={fileInputRef}
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <p className="text-sm text-gray-600">PNG, JPG, Max 5 MB</p>
                  </div>
                  <div className="ml-4">
                    <img
                      src={fileURL}
                      alt="Profile Preview"
                      className="h-14 w-14 object-cover rounded-lg"
                    />
                  </div>
                </div>
                {errors.profileImage && (
                  <p className="text-red-500 text-sm">{errors.profileImage}</p>
                )}

                {/* Submit Button */}
                <div className="flex justify-center">
                  <button
                    onClick={handleSubmit}
                    className="bg-[#0E3746] w-[100px] h-[30px] flex justify-center items-center text-white rounded-2xl p-2 mobile:text-base text-sm transition hover:bg-[#123b50]"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="w-4 h-4 border-2 border-t-transparent border-white rounded-full animate-spin"></div>
                    ) : (
                      "Submit"
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default UserDetailsModal;
