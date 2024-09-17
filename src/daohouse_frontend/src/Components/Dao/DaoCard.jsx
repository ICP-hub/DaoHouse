import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Principal } from "@dfinity/principal";
import { useAuth } from "../utils/useAuthClient";
import { toast } from 'react-toastify';

const DaoCard = ({ name, members, groups, proposals, image_id, daoCanister, daoCanisterId }) => {
  const navigate = useNavigate();
  const { backendActor } = useAuth();
  const canisterId = process.env.CANISTER_ID_IC_ASSET_HANDLER;
  const [isFollowing, setIsFollowing] = useState(false);
  const [followersCount, setFollowersCount] = useState(0);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [joinStatus, setJoinStatus] = useState("Join DAO"); // 'Join DAO', 'Requested', 'Joined'
  const [isMember, setIsMember] = useState(false);
  const protocol = process.env.DFX_NETWORK === "ic" ? "https" : "http";
  const domain = process.env.DFX_NETWORK === "ic" ? "raw.icp0.io" : "localhost:4943";
  const imageUrl = `${protocol}://${canisterId}.${domain}/f/${image_id}`;

  useEffect(() => {
    const fetchDaoDetails = async () => {
      if (daoCanisterId) {
        setLoading(true);
        try {
          const profileResponse = await backendActor.get_user_profile();
          if (profileResponse.Ok) {
            setUserProfile(profileResponse.Ok);
            const currentUserId = Principal.fromText(profileResponse.Ok.user_id.toString());

            const daoFollowers = await daoCanister.get_dao_followers();
            setFollowersCount(daoFollowers.length);
            setIsFollowing(daoFollowers.some(follower => follower.toString() === currentUserId.toString()));

            const daoMembers = await daoCanister.get_dao_members();
            const isCurrentUserMember = daoMembers.some(member => member.toString() === currentUserId.toString());
            setIsMember(isCurrentUserMember);

            if (isCurrentUserMember) {
              setJoinStatus('Joined');
            } else {
              setJoinStatus('Join DAO');
            }
          }
        } catch (error) {
          console.error('Error fetching DAO details:', error);
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
        ? await daoCanister.unfollow_dao()
        : await daoCanister.follow_dao();

      if (response?.Ok) {
        const updatedFollowers = await daoCanister.get_dao_followers();
        setFollowersCount(updatedFollowers.length);
        toast.success(isFollowing ? "Successfully unfollowed" : "Successfully followed");
      } else if (response?.Err) {
        setIsFollowing(!isFollowing);
        toast.error(response.Err);
      }
    } catch (error) {
      console.error('Error following/unfollowing DAO:', error);
      toast.error("An error occurred");
    }
  };

  const handleJoinDao = async () => {
    if (joinStatus === 'Joined') {
      toast.error(`You are already member of this dao`);
      return;
    };
    
    try {
      const response = await daoCanister.ask_to_join_dao(daoCanisterId);
      if (response.Ok) {
        setJoinStatus("Requested");
        toast.success("Join request sent successfully");
      } else {
        console.error("Failed to send join request:", response.Err || "Unknown error");
        toast.error(`Failed to send join request: ${response.Err || "Unknown error"}`);
      }
    } catch (error) {
      console.error('Error sending join request:', error);
      toast.error('Error sending join request');
    }
  };

  const goToDaoProfile = () => {
    navigate(`/dao/profile/${daoCanisterId}`);
  };

  return (
    <div className="bg-[#F4F2EC] rounded-lg shadow-lg tablet:p-6 big_phone:p-3 small_phone:p-5 p-3 rounded-lg mr-12 ml-8">
      <div className="flex big_phone:flex-row small_phone:flex-col justify-start items-start mb-4 gap-2">
        {/* Image Container */}
        <div className="w-full big_phone:w-40 lg:w-60 mobile:h-[120px] border border-black rounded">
          <img
            src={imageUrl}
            alt="DAO Image"
            className="w-full h-32 big_phone:h-full object-cover rounded"
          />
        </div>
        <div className="flex flex-col items-start big_phone:ml-4 small_phone:ml-0 small_phone:mt-4">
          {/* Name for larger screens */}
          <h2 className="text-lg font-semibold truncate big_phone:w-36 hidden big_phone:block">{name}</h2>

          {/* Follow button for larger screens (hidden on mobile) */}
          <button
            onClick={toggleFollow}
            className="flex-1 mt-2 text-blue-400 p-1 sm:text-sm md:text-lg hidden big_phone:block"
          >
            {isFollowing ? 'Unfollow' : '+ Follow'}
          </button>
        </div>
      </div>

      {/* Follow button and username for mobile view (hidden on larger screens) */}
      {/* <div className="block big_phone:hidden mt-2 flex flex-col items-center">
        <h2 className="text-center mobile:text-2xl text-lg font-semibold truncate w-full">{name}</h2>
        <button
          onClick={toggleFollow}
          className="text-blue-400 p-1 mt-2 text-left sm:text-sm md:text-lg"
        >
          {isFollowing ? 'Unfollow' : '+ Follow'}
        </button>
      </div> */}

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
          <p className="text-sm text-dark-green">Active Proposals</p>
        </div>
      </div>

      {/* Adjusted grid layout for smaller screens */}
      <div className="big_phone:hidden grid grid-cols-1 text-center my-5 mx-5 gap-1">
        <div className="bg-white rounded-lg py-4">
          <p className="font-bold text-dark-green">{members}</p>
          <p className="text-sm text-dark-green">Members</p>
        </div>
        <div className="bg-white rounded-lg py-4">
          <p className="font-bold text-dark-green">{groups || '0'}</p>
          <p className="text-sm text-dark-green">Groups</p>
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
          onClick={handleJoinDao}
          className="flex-1 bg-dark-green border-2 border-dark-green text-white p-2 rounded-[3rem] small_phone:text-base text-sm"
        >
          {joinStatus}
        </button>
      </div>
    </div>
  );
};

export default DaoCard;
