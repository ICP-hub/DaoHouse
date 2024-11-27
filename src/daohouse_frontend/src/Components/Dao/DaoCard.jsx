import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Principal } from "@dfinity/principal";
import { useAuth } from "../utils/useAuthClient";
import toast, { Toaster } from 'react-hot-toast';
import { CircularProgress } from "@mui/material";
import messagesound from "../../Sound/messagesound.mp3";
import daoImage from "../../../assets/daoImage.png"

const DaoCard = ({ name, members, groups, proposals, image_id, daoCanisterId, isJoinedDAO }) => {

  const navigate = useNavigate();
  const { backendActor, stringPrincipal, createDaoActor } = useAuth();
  const canisterId = process.env.CANISTER_ID_IC_ASSET_HANDLER;
  const [isFollowing, setIsFollowing] = useState(false);
  const [daoActor, setDaoActor] = useState({})
  const [followersCount, setFollowersCount] = useState(0);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [joinStatus, setJoinStatus] = useState("Join Dao");
  const [isMember, setIsMember] = useState(false);
  const [isRequested, setIsRequested] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false); 
  const protocol = process.env.DFX_NETWORK === "ic" ? "https" : "http";
  const domain = process.env.DFX_NETWORK === "ic" ? "raw.icp0.io" : "localhost:4943";
  const imageUrl = `${protocol}://${canisterId}.${domain}/f/${image_id}`;
  const backendCanisterId = Principal.fromText(process.env.CANISTER_ID_DAOHOUSE_BACKEND)  

  useEffect(() => {
    const fetchDaoDetails = async () => {
      if (daoCanisterId) {
        setLoading(true);
        try {
          // Fetch user profile
          const profileResponse = await backendActor.get_user_profile();
          if (profileResponse.Ok) {
            setUserProfile(profileResponse.Ok);
            const currentUserId = Principal.fromText(profileResponse.Ok.user_id.toString());
    
            // Create DAO actor
            const daoActor = await createDaoActor(daoCanisterId);
            setDaoActor(daoActor);
    
            // Fetch followers and determine if the user is following
            const daoFollowers = await daoActor.get_dao_followers();
            setFollowersCount(daoFollowers.length);
            const isUserFollowing = daoFollowers.some(
              (follower) => follower.toString() === currentUserId.toString()
            );
            setIsFollowing(isUserFollowing);
    
            // Fetch DAO details
            const daoDetails = await daoActor.get_dao_detail();
            console.log("daoD", daoDetails);
    
            // Check membership and request status
            const daoMembers = daoDetails.all_dao_user;
            const requestedToJoin = daoDetails.requested_dao_user;
    
            const isCurrentUserMember = daoMembers.some(
              (member) => member.toString() === currentUserId.toString()
            );
            setIsMember(isCurrentUserMember);
    
            const isUserRequested = requestedToJoin.some(
              (member) => member.toString() === currentUserId.toString()
            );
            setIsRequested(isUserRequested);
    
            // Set join status based on user state
            if (isCurrentUserMember) {
              setJoinStatus("Joined");
            } else if (isUserRequested) {
              setJoinStatus("Requested");
            } else {
              setIsRequested(false);
              setIsMember(false);
              setJoinStatus("Join DAO");
            }
          }
        } catch (error) {
          console.error("Error fetching DAO details:", error);
        } finally {
          setLoading(false);
        }
      }
    };
    

    fetchDaoDetails();
  }, [daoCanisterId, backendActor]);


  const toggleFollow = async () => {
    
    try {
      if (!userProfile) return;
      setIsFollowing(!isFollowing);
      const response = isFollowing
        ? await daoActor.unfollow_dao()
        : await daoActor.follow_dao();

      if (response?.Ok) {
        const updatedFollowers = await daoActor.get_dao_followers();
        setFollowersCount(updatedFollowers.length);
        console.log(followersCount);
        
        toast.success(isFollowing ? "Successfully unfollowed" : "Successfully followed");
      } else if (response?.Err) {
        setIsFollowing(!isFollowing);
        toast.error(response.Err);
      }
    } catch (error) {
      console.error('Error following/unfollowing DAO:', error);
      toast.error(error);
    }
  };

  const handleJoinDao = async () => {
    if (joinStatus === 'Joined') {
      toast.error(`You are already member of this dao`);
      return;
    }else if (joinStatus === 'Requested') {
      toast.error(`Your have already sent a request to join this dao`);
      return;
    }
  }
    
  const confirmJoinDao = async () => {
    setLoading(true);
    try {
     
      const canisterIdString = process.env.CANISTER_ID_DAOHOUSE_BACKEND;
  
      if (!canisterIdString) {
        throw new Error("CANISTER_ID_DAOHOUSE_BACKEND is not defined");
      }
  
      const daohouseBackendId = Principal.fromText(canisterIdString);
      const place_to_join = "General Members";
  
      const joinDaoPayload = {
        place_to_join: place_to_join,
      };
  
      const response = await daoActor.ask_to_join_dao(joinDaoPayload);
      console.log("response of ask to join dao api",response);
      const sound = new Audio(messagesound);
      if (response.Ok) {
        setJoinStatus("Requested");
        sound.play();
        toast.success(response.Ok);
      } else {
        console.error(response.Err );
        toast.error(response.Err);
      }
    } catch (error) {
      console.error('Error sending join request:', error);
      toast.error(error);
    } finally {
      setShowConfirmModal(false);
      setLoading(false);
    }
  };

  const goToDaoProfile = () => {
    navigate(`/dao/profile/${daoCanisterId}`);
  };

  const preventScroll = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  useEffect(() => {
    if (showConfirmModal) {
  
      document.body.style.overflow = 'hidden';
      document.body.style.height = '100vh';
      document.addEventListener('wheel', preventScroll, { passive: false });
      document.addEventListener('touchmove', preventScroll, { passive: false });
    } else {
  
      document.body.style.overflow = '';
      document.body.style.height = '';
      document.removeEventListener('wheel', preventScroll);
      document.removeEventListener('touchmove', preventScroll);
    }

    return () => {
      document.body.style.overflow = '';
      document.body.style.height = '';
      document.removeEventListener('wheel', preventScroll);
      document.removeEventListener('touchmove', preventScroll);
    };
  }, [showConfirmModal, preventScroll]);

  return (
    <div className="bg-[#F4F2EC] shadow-lg tablet:p-6 big_phone:p-3 small_phone:p-5 p-3 rounded-lg md:mx-8 tablet:mx-16">
  <div className="flex flex-col items-center big_phone:flex-row small_phone:flex-col justify-center mb-4 gap-2">
    {/* Image Container */}
    <div className="w-full big_phone:w-40 lg:w-60 mobile:h-40 border border-black rounded">
      <img
        src={image_id ? imageUrl : daoImage}
        alt="DAO Image"
        className="w-full h-40 object-cover rounded"
      />
    </div>
       

    <div className="flex flex-col items-center justify-center mt-4 big_phone:mt-0">

      <h2 className="text-lg font-semibold truncate w-24 big_phone:w-36 text-center">{name}</h2>

 
      <button
        onClick={toggleFollow}
        className="mt-2 text-blue-400 p-1 sm:text-sm md:text-lg text-center"
      >
        {isFollowing ? 'Unfollow' : '+ Follow'}
      </button>
    </div>
      </div>

      {/* Adjusted flexbox for larger screens */}
<div className="big_phone:flex hidden justify-between text-center mb-4 bg-white tablet:p-4 pb-4 p-2 rounded-lg gap-0">
  <div className="flex-1 ml-5">
    <p className="font-bold text-dark-green">{members}</p>
    <p className="text-sm text-dark-green">Members</p>
  </div>
  <div className="flex-1 text-center">
    <p className="font-bold text-dark-green">{groups || '0'}</p>
    <p className="text-sm text-dark-green">Groups</p>
  </div>
  <div className="flex-1 mr-5">
    <p className="font-bold text-dark-green">{proposals}</p>
    <p className="text-sm text-dark-green"> Proposals</p>
  </div>
</div>

{/* Adjusted grid layout for smaller screens */}
<div className="big_phone:hidden grid grid-cols-1 text-center my-5 mx-5 gap-1">
  <div className="bg-white rounded-lg py-4 flex justify-between">
    <div className="flex-1">
      <p className="font-bold text-dark-green">{members}</p>
      <p className="text-sm text-dark-green">Members</p>
    </div>
    <div className="flex-1">
      <p className="font-bold text-dark-green">{groups || '0'}</p>
      <p className="text-sm text-dark-green">Groups</p>
    </div>
  </div>
  <div className="bg-white rounded-lg py-4">
    <p className="font-bold text-dark-green">{proposals}</p>
    <p className="text-sm text-dark-green">Active Proposals</p>
  </div>
</div>

      <div className="flex justify-between gap-2">
        <button
          onClick={goToDaoProfile}
          className="flex-1 bg-transparent border-2 border-dark-green text-dark-green p-2 rounded-[3rem] small_phone:text-base text-sm"
        >
          View Profile
        </button>
        <button
          onClick={!isJoinedDAO ? handleJoinDao : null}
          className="flex-1 bg-dark-green border-2 border-dark-green text-white p-2 rounded-[3rem] small_phone:text-base text-sm"
        >
          {isJoinedDAO ? "Joined" : joinStatus }
        </button>
      </div>
      {/* Confirmation Modal */}
      {showConfirmModal && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center backdrop-blur-md">
    <div className="bg-white p-6 rounded-lg shadow-lg md:w-[800px] text-center mx-4">
      <h3 className="text-xl font-mulish font-semibold text-[#234A5A]">Ready to join this DAO?</h3>
      <p className="mt-4 text-[16px] md:px-24 font-mulish">
        You’re about to join a DAO! A proposal will be created to welcome you, and DAO members will vote on your request. 
        You'll be notified once the results are in. Approval happens when members vote in your favor—good luck!
      </p>
      <div className="flex justify-center gap-4 mt-4">
        <button
          onClick={() => setShowConfirmModal(false)}
          className="px-8 py-3 text-[12px] lg:text-[16px] text-black font-normal rounded-full shadow-md hover:bg-gray-200 hover:text-[#0d2933]"
        >
          Cancel
        </button>
        <button
          onClick={confirmJoinDao}
          className="px-6 md:px-8 py-3 text-center text-[12px] lg:text-[16px] bg-[#0E3746] text-white rounded-full shadow-xl hover:bg-[#0d2933] hover:text-white"
        >
          {loading ? (
              <CircularProgress size={24} />
            ) : (
              "Join DAO"
            )}
        </button>
      </div>
    </div>
  </div>
)}

    </div>
  );
};

export default DaoCard;
