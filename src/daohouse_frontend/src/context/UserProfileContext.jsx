import React, { createContext, useContext, useState, useEffect } from "react";
// import { useAuth } from "../Components/utils/useAuthClient";
import { useAuthClient } from "../connect/useClient";

const UserProfileContext = createContext();

export const UserProfileProvider = ({ children }) => {
  const [userProfile, setUserProfile] = useState(null);
  const { backendActor } = useAuthClient();

  useEffect(() => {
    if (backendActor) {
      fetchUserProfile();
    }
  }, [backendActor]);

  const fetchUserProfile = async () => {
    try {
      const userProfileResponse = await backendActor.get_user_profile();
      const userProfile = userProfileResponse.Ok;
      // console.log("userProfile",userProfile);
      
      if (userProfile) {
        setUserProfile(userProfile);
        localStorage.setItem('username', userProfile.username);
        localStorage.setItem('userImageId', userProfile.profile_img);
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }
  };

  return (
    <UserProfileContext.Provider value={{ userProfile, fetchUserProfile }}>
      {children}
    </UserProfileContext.Provider>
  );
};

export const useUserProfile = () => useContext(UserProfileContext);

