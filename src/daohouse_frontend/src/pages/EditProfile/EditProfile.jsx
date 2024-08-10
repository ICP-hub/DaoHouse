import React, { useEffect, useState } from "react";
import ProfileTitleDivider from "../../Components/ProfileTitleDivider/ProfileTitleDivider";
import MyProfileRectangle from "../../../assets/MyProfileRectangle.png";
import MyProfileImage from "../../../assets/MyProfile-img.png"; // Default profile image
import UploadIcon from "../../../assets/upload-icon.png";
import BigCircle from "../../../assets/BigCircle.png";
import MediumCircle from "../../../assets/MediumCircle.png";
import SmallestCircle from "../../../assets/SmallestCircle.png";
import EditTags from "../../Components/EditProfile/EditTags";
import EditPersonalLinksAndContactInfo from "./EditPersonalLinksAndContactInfo";
import BigCircleAnimation from "../../Components/Ellipse-Animation/BigCircle/BigCircleAnimation.json";
import SmallCircleAnimation from "../../Components/Ellipse-Animation/SmallCircle/SmallCircleAnimation.json";
import SuccessModal from "../../Components/EditProfile/SuccessModal";
import BigCircleComponent from "../../Components/Ellipse-Animation/BigCircle/BigCircleComponent";
import SmallCircleComponent from "../../Components/Ellipse-Animation/SmallCircle/SmallCircleComponent";
import MediumCircleComponent from "../../Components/Ellipse-Animation/MediumCircle/MediumCircleComponent";
import { useAuth } from "../../Components/utils/useAuthClient";
import { useUserProfile } from "../../context/UserProfileContext";
import Lottie from "react-lottie";
import { AssetManager } from "@dfinity/assets";
import { HttpAgent } from "@dfinity/agent";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Container from "../../Components/Container/Container";
import CircularProgress from '@mui/material/CircularProgress';

const EditProfile = () => {
  const { userProfile, fetchUserProfile } = useUserProfile();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { backendActor, frontendCanisterId, identity, principal } = useAuth();
  const [loading, setLoading] = useState(false);

  const [imageSrc, setImageSrc] = useState(MyProfileImage);
  const [errors, setErrors] = useState({}); // To store validation errors

  const navigate = useNavigate();
  
  const handleDiscardClick = () => {
    navigate("/my-profile");
  };

  const isLocal = !window.location.host.endsWith('ic0.app');
  const agent = new HttpAgent({
    host: isLocal ? `http://127.0.0.1:${window.location.port}` : 'https://ic0.app', identity,
  });
  if (isLocal) {
    agent.fetchRootKey();
  }

  const assetManager = new AssetManager({
    canisterId: frontendCanisterId,
    agent: agent,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const files = await assetManager.list();
        console.log({ files });
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };
    fetchData();
  }, []);

  const [profileData, setProfileData] = useState({
    name: userProfile?.username || "",
    email_id: userProfile?.email_id || "",
    contact_number: userProfile?.contact_number || "",
    twitter_id: userProfile?.twitter_id || "",
    telegram: userProfile?.telegram || "",
    website: userProfile?.website || "",
    description: userProfile?.description || "",
    profile_img: userProfile?.profile_img || "",
    tag_defines: userProfile?.tag_defines || [],
    image_content: [10],
    image_title: "na",
    image_content_type: "image/jpg",
  });

  

  const validateForm = () => {
    const newErrors = {};
    if (!profileData.name.trim()) newErrors.name = "Name is required.";
    if (!profileData.email_id.trim()) newErrors.email_id = "Email is required.";
    if (!/\S+@\S+\.\S+/.test(profileData.email_id)) newErrors.email_id = "Email format is invalid.";
    if (!profileData.contact_number.trim()) newErrors.contact_number = "Contact number is required.";
    if (!/^\d+$/.test(profileData.contact_number)) newErrors.contact_number = "Contact number should be numeric.";
    // Add more validation rules as needed
    setErrors(newErrors);

    // Identify the first error field
    if (Object.keys(newErrors).length > 0) {
      const firstErrorField = Object.keys(newErrors)[0];
      document.querySelector(`[name=${firstErrorField}]`).scrollIntoView({ behavior: "smooth", block: "center" });
    }

    return Object.keys(newErrors).length === 0;
  };

  const handleSaveChangesClick = async () => {
    
    if (!validateForm()) return; // Stop if validation fails

    setLoading(true);
    const profilePayload = {
      username: profileData.name,
      email_id: profileData.email_id,
      profile_img: profileData.profile_img ? profileData.profile_img : MyProfileImage,
      description: profileData.description,
      contact_number: profileData.contact_number,
      twitter_id: profileData.twitter_id,
      telegram: profileData.telegram,
      website: profileData.website,
      tag_defines: profileData.tag_defines,
      image_content: profileData.image_content ? new Uint8Array(profileData.image_content) : [10],
      user_image_id: "1",
      image_title: profileData.image_title || "na",
      image_content_type: profileData.image_content_type || "default content type",
    };

    const canisterId = process.env.CANISTER_ID_IC_ASSET_HANDLER;

    try {
      const response = await backendActor.update_profile(canisterId, profilePayload);
      if (response.Err) {
        toast.error(`${response.Err}`);
      } else {
        toast.success("Profile created successfully");
        setIsModalOpen(true);
        setTimeout(() => {
          navigate('/');
          window.scrollTo(0, 0); // Scrolls to the top of the page
        }, 2000);
      }
    } catch (error) {
      console.error("Error creating profile:", error);
    } finally {
      fetchUserProfile();
      setLoading(false);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    const maxSizeInBytes = 2 * 1024 * 1024; // 2MB

    if (file) {
      if (file.size > maxSizeInBytes) {
        toast.error("File size exceeds 2MB. Please upload a smaller image.");
        return; // Prevent further processing if the file is too large
      }

      setImageSrc(URL.createObjectURL(file)); // Set the image preview source
      const arrayBuffer = await file.arrayBuffer();
      const content = new Uint8Array(arrayBuffer);
      setProfileData((prevData) => ({
        ...prevData,
        image_content: Array.from(content),
        image_title: file.name,
        image_content_type: file.type,
      }));
    }
  };

  const handleRemoveImage = () => {
    setImageSrc(MyProfileImage); // Set to default image
    setProfileData((prevData) => ({
      ...prevData,
      profile_img: "", // Clear the profile image path
      image_content: [], // Optionally clear image content if needed
      image_title: "na",
      image_content_type: "image/jpg",
    }));
  
    toast.success("Photo removed successfully"); // Show success notification
  };

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: BigCircleAnimation,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
      id: "lottie-bigCircle",
    },
  };

  const defaultOptions2 = {
    loop: true,
    autoplay: true,
    animationData: SmallCircleAnimation,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
      id: "lottie-smallCircle",
    },
  };

  const defaultOptions3 = {
    loop: true,
    autoplay: true,
    animationData: SmallCircleAnimation,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
      id: "lottie-mediumCircle",
    },
  };

  const handleTagsChange = (tags) => {
    setProfileData((prevData) => ({ ...prevData, tag_defines: tags }));
  };

  useEffect(() => {
    setProfileData({
      name: userProfile?.username || "",
      email_id: userProfile?.email_id || "",
      contact_number: userProfile?.contact_number || "",
      twitter_id: userProfile?.twitter_id || "",
      telegram: userProfile?.telegram || "",
      website: userProfile?.website || "",
      description: userProfile?.description || "",
      profile_img: userProfile?.profile_img || "",
      tag_defines: userProfile?.tag_defines || [],
      image_content: [10],
      image_title: "na",
      image_content_type: "image/jpg",
    });
    setImageSrc(userProfile?.profile_img
      ? `http://${process.env.CANISTER_ID_IC_ASSET_HANDLER}.localhost:4943/f/${userProfile.profile_img}`
      : MyProfileImage);
  }, [userProfile]);

  return (
    <div className="bg-zinc-200 w-full pb-20 relative">
      <div
        style={{
          backgroundImage: `url("${MyProfileRectangle}")`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <Container classes="w-full lg:h-[25vh] h-[18vh] md:p-20 pt-6 pl-2 flex flex-col items-start md:justify-center relative hero-container">

          <div className="absolute z-22 top-0 left-0 w-full h-full overflow-x-hidden">
            <div className="absolute md:right-[3.7%] -right-[3.7%] top-1/2 -translate-y-1/2">
              <div className="relative tablet:w-[96px] tablet:h-[96px] md:w-[88.19px] md:h-[88.19px] w-[65px] h-[65px]">
                <BigCircleComponent imgSrc={BigCircle} />
              </div>

              <div className="absolute inset-0 flex items-center justify-center z-20">
                <div className="tablet:w-[112px] tablet:h-[112px] md:w-[104px] md:h-[104px] w-[75px] h-[75px]">
                  <Lottie
                    options={defaultOptions}
                    style={{ width: "100%", height: "100%" }}
                  />
                </div>
              </div>
            </div>

            <div className="absolute right-[25%] -translate-y-full top-[30%]">
              <div className="relative tablet:w-[43px] tablet:h-[43px] md:w-[33.3px] md:h-[33.3px] w-[21.19px] h-[21.19px]">
                <SmallCircleComponent imgSrc={SmallestCircle} />
              </div>

              <div className="absolute inset-0 flex items-center justify-center z-20">
                <div className="tablet:w-[47px] tablet:h-[47px] md:w-[37.3px] md:h-[37.3px] w-[23.19px] h-[23.19px]">
                  <Lottie
                    options={defaultOptions2}
                    style={{ width: "100%", height: "100%" }}
                  />
                </div>
              </div>
            </div>

            <div className="absolute right-[45%] -translate-y-full top-[95%]">
              <div className="relative tablet:w-[52px] tablet:h-[52px] md:w-[43.25px] md:h-[43.25px] w-[29.28px] h-[29.28px] ">
                <MediumCircleComponent imgSrc={MediumCircle} />
              </div>

              <div className="absolute inset-0 flex items-center justify-center z-20">
                <div className="tablet:w-[60px] tablet:h-[60px] md:w-[47.25px] md:h-[47.25px] w-[33.28px] h-[33.28px]">
                  <Lottie
                    options={defaultOptions3}
                    style={{ width: "100%", height: "100%" }}
                  />
                </div>
              </div>
            </div>
          </div>
          <ProfileTitleDivider title="Edit Profile" />
        </Container>
      </div>
      <Container>
        <div className={`relative ${isModalOpen ? "blur-sm" : ""}`}>
          <div className="md:mt-12 mt-8 md:mx-24 mx-6 bg-[#F4F2EC] md:p-6 p-4 rounded-lg">
            <div className="flex items-center gap-2">
              <img
                className="rounded-md lg:w-[105px] md:w-[85px] w-[69px] lg:mr-12 md:mr-4 mr-1 "
                src={imageSrc}
                alt="profile-pic"
                onError={(e) => e.target.src = MyProfileImage} // Fallback to default image on error
                style={{
                  boxShadow:
                    "0px 0.26px 1.22px 0px #0000000A, 0px 1.14px 2.53px 0px #00000010, 0px 2.8px 5.04px 0px #00000014, 0px 5.39px 9.87px 0px #00000019, 0px 9.07px 18.16px 0px #0000001F, 0px 14px 31px 0px #00000029",
                }}
              />
              <label className="bg-white md:text-[16px] text-[12px] text-[#05212C] gap-1 shadow-xl md:h-[50px] h-[40px] md:px-6 px-3 rounded-[27px] flex items-center cursor-pointer">
                <img
                  src={UploadIcon}
                  alt="edit"
                  className="md:mr-2 mr-1 md:h-4 md:w-4 w-3 h-3 edit-pen"
                />
               <span className="text-[10px] lg:text-[13px]">
                Upload New Photo (Max 2MB)
                 </span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                />
              </label>
              <button
                onClick={handleRemoveImage}
                className="text-[12px] md:text-[14px] lg:text-[16px] text-black shadow-xl md:h-[50px] h-[40px] md:px-6 px-4 rounded-[27px] bg-red-300 border-solid border border-red-100 hover:bg-red-400 flex items-center transition duration-200 ease-in-out"
              >
                Remove<span className="hidden sm:inline-block ml-1">Photo</span>
              </button>
            </div>

            <div className="lg:ml-40 md:ml-24 lg:mr-5 md:mt-12 mt-5">
              <h3 className="text-[#05212C] text-[16px] md:text-[18px] lg:text-[24px] md:font-semibold font-medium ml-3">
                About Me
              </h3>
              <div className="bg-[#FFFFFF] md:text-[16px] text-[12px] font-normal text-[#646464] py-3 md:px-5 pl-3 my-4 sm:w-[100%] rounded-lg">
                <span className="text-[#05212C] md:mr-32 mr-4">Name</span>
                <input
                  type="text"
                  name="name"
                  value={profileData.name}
                  onChange={handleInputChange}
                  placeholder="Username.user"
                  className={`border-solid border ${errors.name ? 'border-red-500' : 'border-[#DFE9EE]'} py-2 pl-4 md:w-[40%] w-[82%] rounded-[6px]`}
                />
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
              </div>
              <div className="bg-[#FFFFFF] md:text-[16px] text-[12px] font-normal text-[#646464] py-3 md:px-5 pl-3 my-4 sm:w-[100%] rounded-lg">
                <span className="text-[#05212C] md:mr-32 mr-4">Email</span>
                <input
                  type="text"
                  name="email_id"
                  value={profileData.email_id}
                  onChange={handleInputChange}
                  placeholder="Email address"
                  className={`border-solid border ${errors.email_id ? 'border-red-500' : 'border-[#DFE9EE]'} py-2 pl-4 md:w-[40%] w-[82%] rounded-[6px]`}
                />
                {errors.email_id && <p className="text-red-500 text-xs mt-1">{errors.email_id}</p>}
              </div>
              <div className="bg-[#FFFFFF] md:text-[16px] text-[12px] font-normal text-[#646464] py-3 md:px-5 pl-3 my-4 sm:w-[100%] rounded-lg">
                <span className="text-[#05212C] md:mr-32 mr-4">Contact Number</span>
                <input
                  type="text"
                  name="contact_number"
                  value={profileData.contact_number}
                  onChange={handleInputChange}
                  placeholder="Contact number"
                  className={`border-solid border ${errors.contact_number ? 'border-red-500' : 'border-[#DFE9EE]'} py-2 pl-4 md:w-[40%] w-[82%] rounded-[6px]`}
                />
                {errors.contact_number && <p className="text-red-500 text-xs mt-1">{errors.contact_number}</p>}
              </div>
              <p className="lg:text-[20px] md:text-[16px] text-[14px] font-semibold text-[#05212C] md:ml-2 md:mb-3">
                Description
              </p>
              <div className="bg-[#FFFFFF] md:text-[16px] text-[12px] font-normal text-[#646464] py-3 px-5 my-2 rounded-lg">
                <textarea
                  name="description"
                  value={profileData.description}
                  onChange={handleInputChange}
                  className={`w-full h-32 border ${errors.description ? 'border-red-500' : 'border-gray-300'} px-3 py-2 rounded-md`}
                  placeholder="Describe yourself here..."
                />
                {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
              </div>
              <p className="lg:text-[20px] md:text-[16px] text-[14px] font-semibold text-[#05212C] md:ml-2 md:mb-3 mt-6">
                Tags That Defines You
              </p>
              <EditTags
                editTags={profileData.tag_defines}
                handleTagsChange={handleTagsChange}
              />
              <p className="lg:text-[20px] md:text-[16px] text-[14px] font-semibold text-[#05212C] ml-2 mb-3 mt-6">
                Personal Links & Contact Info
              </p>
              <EditPersonalLinksAndContactInfo
                profileData={profileData}
                handleInputChange={handleInputChange}
                handleSaveChangesClick={handleSaveChangesClick}
                closeModal={closeModal}
              />
              <div className="hidden sm:flex justify-center gap-5 mt-8">
                <button
                  onClick={handleDiscardClick}
                  className="py-2 px-9 border border-[#0E3746] hover:bg-[#0E3746] hover:text-white rounded-[27px] transition duration-200 ease-in-out"
                >
                  Discard
                </button>
                {loading ? (
                  <CircularProgress />
                ) : (
                  <button
                    onClick={handleSaveChangesClick}
                    className="py-2 px-10 border border-[#0E3746] bg-[#0E3746] text-white hover:bg-[#0E37464D] hover:border-[#0E37464D] rounded-[27px] transition duration-200 ease-in-out"
                  >
                    Save Changes
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </Container>
      <SuccessModal isOpen={isModalOpen} onClose={closeModal} />
      {isModalOpen && (
        <div className="fixed inset-0 bg-black opacity-40 z-40"></div>
      )}
    </div>
  );
};

export default EditProfile;