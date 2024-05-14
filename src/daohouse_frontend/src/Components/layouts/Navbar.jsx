import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../utils/useAuthClient';
import { LuChevronDown } from "react-icons/lu";
import LoginModal from '../Auth/LoginModal';
import { FaUser, FaCog, FaSignOutAlt } from 'react-icons/fa';
import avatarprofile from "../../../assets/avatarprofile.png"


const Navbar = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);


  const { login, isAuthenticated, signInPlug, logout, principal, backendActor } = useAuth();

  const location = useLocation();
  const [dropdownVisible, setDropdownVisible] = useState(false);


  const menuItems = [
    { label: 'Home', route: '/' },
    { label: 'Social Feed', route: '/social-feed' },
    { label: 'DAOs', route: '/dao' },
    { label: 'Proposals', route: '/proposals' },
  ];

  // Function to handle login
  const handleLogin = async () => {
    setIsLoading(true);
    await login().then(() => window.location.reload());
  };

  // Function to handle login
  const handleLogout = async () => {
    setIsLoading(true);
    await logout().then(() => {
      window.location.reload();
    }).catch(() => {
      toast.error(t("dashboard.errorText"));
    });
  };

  const handleLoginPlug = async () => {
    setIsLoading(true);
    await signInPlug().then(() => {
      console.log("logined");
      setIsModalOpen(false)
    });
  };
  const handleLoginModalOpen = async () => {
    setIsLoading(true);
    setIsModalOpen(true);
  };


  
  // useEffect(() => {
  //   const fetchUserProfile = async () => {
  //     try {
  //       const userProfileData = await backendActor.get_user_profile();
  //       console.log("User profile data after creation:", userProfileData);
  //       setUserProfile(userProfileData);
  //     } catch (error) {
  //       console.error("Error fetching user profile:", error);
  //     }
  //   };
  
  //   const createAndFetchUserProfile = async () => {
  //     try {
  //       await backendActor.create_profile({
  //         username: "YourUsername",
  //         email_id: "YourEmail@example.com",
  //         profile_img: [/* Array of integers representing image data */]
  //       });
  //       // After profile creation, fetch user profile
  //       await fetchUserProfile();
  //     } catch (error) {
  //       console.error("Error creating user profile:", error);
  //     }
  //   };
  
  //   createAndFetchUserProfile();
  // }, [backendActor, principal]);


  return (
    <nav>
      <div className="flex flex-col h-20 justify-center bg-[#DADEE4] border-b shadow-lg shadow-slate-900/20 shadow-b-2 sticky w-full z-50">
        <div className="px-4 flex justify-around items-center w-full">
          <div className="md:flex items-center space-x-8 hidden ">
            {menuItems.map((item, index) => (
              <div key={index} className="text-lg font-normal font-inter leading-[19.36px] text-[#829095]">
                <Link to={item.route} className={`hover:text-[#05212C] hover:font-medium cursor-pointer text-[16px] text-[#829095] ${location.pathname === item.route ? 'font-semibold border-b-2 border-[#05212C] text-black' : 'border-transparent border-b-0.5'}`}>{item.label}</Link>
              </div>
            ))}
          </div>
          <div className="flex items-center">
            <p className='text-black font-semibold'>LOGO</p>
          </div>
          {!isAuthenticated ? <div className="flex items-center space-x-4">
            <button onClick={handleLoginModalOpen}
              className="px-8 py-2 rounded-[27.5px] bg-[#0E3746] text-white whitespace-nowrap">{isLoading? "Connecting":"Sign In"}</button>
            <button onClick={handleLoginModalOpen} className="px-8 py-2 rounded-[27.5px] bg-[#FFFFFF]">Connect</button>
          </div> : (
            <div className="relative">

              <div className="flex items-center space-x-4 relative bg-white rounded-full px-4 cursor-pointer shadow-lg" onClick={() => setDropdownVisible(!dropdownVisible)}>
                <div className="w-10 h-10 flex items-center rounded-full overflow-hidden my-auto">
                  <img src={avatarprofile} alt="User Avatar" className="w-8 h-8 object-cover rounded-full" />
                </div>
                <p className="text-black font-medium">asdsssaddsfad</p>
                <LuChevronDown />
                {dropdownVisible && (
                  <div className="absolute top-full right-0 bg-white rounded-md border border-gray-300 shadow-md py-2 w-40">
                    <button className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center">
                      <FaUser className="mr-2" />
                      <span>Profile</span>
                    </button>
                    <button className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center">
                      <FaCog className="mr-2" />
                      <span>Settings</span>
                    </button>
                    <button onClick={handleLogout} className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center">
                      <FaSignOutAlt className="mr-2" />
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
      <LoginModal
        isOpen={isModalOpen}
        onClose={() =>{
          setIsModalOpen(false)
          setIsLoading(false)
        }}
        onLogin={handleLogin}
        onLoginPlug={handleLoginPlug}
      />
    </nav>
  );
};

export default Navbar;
