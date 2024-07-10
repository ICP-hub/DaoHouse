import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../utils/useAuthClient";
import { LuChevronDown } from "react-icons/lu";
import LoginModal from "../Auth/LoginModal";
import { FaUser, FaCog, FaSignOutAlt } from "react-icons/fa";
import avatarprofile from "../../../assets/avatarprofile.png";
import logo from "../../../assets/ColorLogo.png";
import aboutImg from "../../../assets/avatar.png";
import { useUserProfile } from "../../context/UserProfileContext";
import { toast } from "react-toastify";

const Navbar = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { profile } = useUserProfile()

  const {
    login,
    isAuthenticated,
    signInPlug,
    logout,
    principal,
    backendActor,
  } = useAuth();

  const location = useLocation();
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const { userProfile, fetchUserProfile } = useUserProfile();


  const menuItems = [
    { label: "Home", route: "/" },
    { label: "Social Feed", route: "/social-feed" },
    { label: "DAOs", route: "/dao" },
    { label: "Proposals", route: "/proposals" },
  ];

  // Function to handle login
  const handleLogin = async () => {
    setIsLoading(true);
    await login().then(() => window.location.reload());
  };

  // Function to handle login
  const handleLogout = async () => {
    setIsLoading(true);
    await logout()
      .then(() => {
        window.location.reload();
      })
      .catch(() => {
        toast.error(t("dashboard.errorText"));
      });
  };

  const handleLoginPlug = async () => {
    setIsLoading(true);
    await signInPlug().then(() => {
      console.log("logined");
      setIsModalOpen(false);
    });
  };
  const handleLoginModalOpen = async () => {
    setIsLoading(true);
    setIsModalOpen(true);
  };

  const [username, setUsername] = useState("");

  useEffect(() => {

    if (backendActor === null) {
      return
    }

    const createAndFetchUserProfile = async () => {
      try {

        // Fetch image data and convert to Uint8Array
        const response = await fetch(aboutImg);
        const blob = await response.blob();
        console.log("blob", blob);
        const arrayBuffer = await blob.arrayBuffer();
        const uint8Array = new Uint8Array(arrayBuffer);
        console.log("uint8Array", uint8Array);

        // Create profile payload with default values
        const profilePayload = {
          username: "",
          email_id: "",
          profile_img: "",
          description: "",
          contact_number: "",
          twitter_id: "",
          telegram: "",
          website: "",
          tag_defines: [],
          image_content: [10],
          image_title: "testing.jpg", // image title, image content type and image content is mandatory  
          image_content_type: "image.jpg",
        };


        const canisterId = process.env.CANISTER_ID_IC_ASSET_HANDLER;

        if (!canisterId) {
          throw new Error("Canister ID is not defined");
        }

        try {
          console.log("canister id of asset", canisterId);

          const a = await backendActor.check_user_existance();
          console.log(a);

          if (a["Ok"]) {
            await fetchUserProfile();
            toast.success("Login created successfully");
            console.log("user exist krta hai");
            setUsername(userProfile.username);


          } else {

            const response = await backendActor.create_profile(canisterId, profilePayload);
            console.log({ response });

            if (response) {
              console.log('Profile created successfully:', response);
              setUsername(profilePayload.username);
            } else {
              console.log('Failed to create profile.');
            }
            await fetchUserProfile();
            toast.error("user does not exist")
            setUsername(userProfile.username);
            console.log("user exist nhi krta")
          }


        } catch (error) {
          console.error("Error creating user profile:", error);
        }
        // >>>>>>> main
      } catch (error) {
        console.error("Error in createAndFetchUserProfile:", error);
      }
    };
    createAndFetchUserProfile();
  }, [backendActor, principal]);

  const dropdownItems = [
    {
      label: "Profile",
      route: "/my-profile",
      icon: <FaUser className="mr-2" />,
    },
    {
      label: "My Proposals",
      route: "/my-proposals",
      icon: <FaUser className="mr-2" />,
    },
    // { label: "My Dao", route: "/my-dao", icon: <FaUser className="mr-2" /> },
    // { label: "Settings", route: "/settings", icon: <FaCog className="mr-2" /> },
    {
      label: "Logout",
      onClick: handleLogout,
      icon: <FaSignOutAlt className="mr-2" />,
    },
  ];

  console.log({ backendActor })
  return (
    <nav>
      <div className="bg-bg-color shadow-lg shadow-slate-900/20 shadow-b-2 sticky w-full z-50">
        <div className="tablet:px-20 small_phone:px-8 px-4 small_phone:py-5 py-3 flex justify-between items-center w-full">
          <div className="big_phone:flex items-center tablet:space-x-8 space-x-4 hidden ">
            {menuItems.map((item, index) => (
              <div
                key={index}
                className="text-lg font-normal font-inter leading-[19.36px] text-[#829095]"
              >
                <Link
                  to={item.route}
                  className={`hover:text-[#05212C] hover:font-medium cursor-pointer text-[16px] text-[#829095] ${location.pathname === item.route
                    ? "font-semibold border-b-2 border-[#05212C] text-black"
                    : "border-transparent border-b-0.5"
                    }`}
                >
                  {item.label}
                </Link>
              </div>
            ))}
          </div>
          <Link to="/">
            <div className="flex items-center">
              <img
                src={logo}
                alt="DAO House"
                className="mobile:h-10 small_phone:w-30 w-25 h-8 object-contain"
              />
            </div>
          </Link>

          {!isAuthenticated ? (
            <div className="flex items-center tablet:space-x-4 space-x-2">
              {/* <button
                onClick={handleLoginModalOpen}
                className="mobile:px-8 px-4 py-2 rounded-[27.5px] bg-[#0E3746] text-white whitespace-nowrap big_phone:text-base small_phone:text-sm text-xs"
              >
                {isLoading ? "Connecting" : "Sign In"}
              </button> */}
              <button
                onClick={handleLoginModalOpen}
                className="mobile:px-8 px-4 py-2 rounded-[27.5px] bg-[#FFFFFF] big_phone:text-base small_phone:text-sm text-xs"
              >
                {isLoading ? "Connecting" : "Connect"}
              </button>
            </div>
          ) : (
            <div className="relative">
              <div
                className="flex items-center space-x-4 relative bg-white rounded-full px-4 cursor-pointer shadow-lg"
                onClick={() => setDropdownVisible(!dropdownVisible)}
              >
                <div className="w-10 h-10 flex items-center rounded-full overflow-hidden my-auto">
                  <img
                    src={avatarprofile}
                    alt="User Avatar"
                    className="w-8 h-8 object-cover rounded-full"
                  />
                </div>
                <p className="text-black font-medium">{username}</p>
                <LuChevronDown />
                {dropdownVisible && (
                  <div className="absolute top-full right-0 bg-white rounded-md border border-gray-300 shadow-md py-2 w-40">
                    {dropdownItems.map((item, index) => (
                      <Link
                        key={index}
                        to={item.route || "#"}
                        onClick={item.onClick}
                        className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                      >
                        {item.icon}
                        <span>{item.label}</span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
      <LoginModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onLogin={handleLogin}
        onLoginPlug={handleLoginPlug}
      />
    </nav>
  );
};

export default Navbar;
