import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "../Components/utils/useAuthClient";


const UserProfileContext = createContext();

export const UserProfileProvider = ({ children }) => {
  const [userProfile, setUserProfile] = useState(null);
  const { backendActor } = useAuth();


  const fetchUserProfile = async () => {
    try {
      const userProfileResponse = await backendActor.get_user_profile();
      const userProfile = userProfileResponse.Ok;
      console.log({userProfileResponse,userProfile})
      if (userProfile) {
        setUserProfile(userProfile);
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }
  };


  useEffect(() => {
    if (backendActor === null) {
      return 
    } 
      fetchUserProfile();
  }, [backendActor]);

  return (
    <UserProfileContext.Provider value={{ userProfile, setUserProfile, fetchUserProfile }}>
      {children}
    </UserProfileContext.Provider>
  );
};

export const useUserProfile = () => useContext(UserProfileContext);
