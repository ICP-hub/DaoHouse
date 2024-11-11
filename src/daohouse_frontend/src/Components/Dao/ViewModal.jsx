import React, { useEffect, useState } from 'react';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import avatar from "../../../assets/avatar.png";
import { useAuth } from '../utils/useAuthClient';
import { Principal } from '@dfinity/principal';
import MemberSkeletonLoader from '../SkeletonLoaders/MemberSkeletonLoader/MemberSkeletonLoader';

function ViewModal({ open, onClose, users = [], approvedVotesList = [], rejectedVotesList = [], showVotes = false }) {
  const { backendActor } = useAuth();
  const [profiles, setProfiles] = useState([])
  const [voteProfiles, setVoteProfiles] = useState({ approved: [], rejected: [] });
  const [loading, setLoading] = useState(false);
  const [principal, setPrincipal] = useState("");
  const [activeTab, setActiveTab] = useState("approved"); // State for active tab
  const protocol = process.env.DFX_NETWORK === "ic" ? "https" : "http";
  const domain = process.env.DFX_NETWORK === "ic" ? "raw.icp0.io" : "localhost:4943";

  useEffect(() => {
    if (users.length === 0) return;

    async function fetchUserProfiles() {
        setLoading(true);
        const fetchedProfiles = await Promise.all(users.map(async (user) => {
            try {
                
                const userDetail = await backendActor.get_profile_by_id(Principal.fromText(user));
                return {
                    user,
                    profileData: userDetail.Ok,
                    profileImage: userDetail.Ok?.profile_img
                        ? `${protocol}://${process.env.CANISTER_ID_IC_ASSET_HANDLER}.${domain}/f/${userDetail.Ok.profile_img}`
                        : avatar
                };
            } catch (error) {
                console.error("Error fetching user profile:", error);
                return { ...user, profileData: null, profileImage: avatar };
            }
        }));
        setProfiles(fetchedProfiles);
        setLoading(false);
    }

    fetchUserProfiles();
}, [users, backendActor]);

useEffect(() => {
  if (open) {
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
}, [open]);

  useEffect(() => {
    if (approvedVotesList.length === 0 && rejectedVotesList.length === 0) return;

    async function fetchVoteProfiles(votes, type) {
        setLoading(true)
      const fetchedVoteProfiles = await Promise.all(
        votes.map(async (vote) => {
          try {
            const principalId = Principal.fromUint8Array(vote._arr);
            const principal = principalId.toText();
            setPrincipal(principal);

            const profileDetail = await backendActor.get_profile_by_id(principalId);
            return {
              vote,
              profileData: profileDetail.Ok,
              profileImage: profileDetail.Ok?.profile_img
                ? `${protocol}://${process.env.CANISTER_ID_IC_ASSET_HANDLER}.${domain}/f/${profileDetail.Ok.profile_img}`
                : avatar,
            };
          } catch (error) {
            console.error("Error fetching vote profile:", error);
            return { ...vote, profileData: null, profileImage: avatar };
          } finally{
            setLoading(false)
          }
        })
      );

      // Set profiles for the respective vote type
      setVoteProfiles((prev) => ({
        ...prev,
        [type]: fetchedVoteProfiles,
      }));
    }

    async function fetchData() {
    //   setLoading(true); // Start loading when fetching begins
      if (approvedVotesList.length > 0) await fetchVoteProfiles(approvedVotesList, "approved");
      if (rejectedVotesList.length > 0) await fetchVoteProfiles(rejectedVotesList, "rejected");
    //   setLoading(false); // End loading after all data is fetched
    }

    fetchData();
  }, [approvedVotesList, rejectedVotesList, backendActor]);

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="user-modal-title"
      className="flex items-center justify-center backdrop-blur-md bg-black/50"
      closeAfterTransition
    >
    <Box className="relative p-4 bg-white rounded-lg shadow-4xl  max-w-2xl h- w-full mx-4 font-mulish">
        {/* Close button positioned in the top-right corner */}
        <div style={{
          position: 'absolute',
          top: '8px',
          right: '8px',
          zIndex: 10,
        }}>
          <IconButton 
            onClick={onClose}
            style={{
              backgroundColor: 'black',
              color: 'white',
              width: '25px',
              height: '25px',
              borderRadius: '50%',
              padding: '5px',
              boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
               transform: 'translateY(-7px) translateX(5px)',
            }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </div>
        <div className="mt-4 sm:mt-0 sm:w-full">
          {showVotes && (
            <div>
              <h2 className="text-center font-bold text-lg mb-4">Votes</h2>

            
              <div className="flex justify-around border-b border-gray-300">
                <button
                  className={`w-full py-2 ${activeTab === "approved" ? "border-b-2 border-black font-bold" : "text-gray-500"}`}
                  onClick={() => setActiveTab("approved")}
                >
                  In Favour votes
                </button>
                <button
                  className={`w-full py-2 ${activeTab === "rejected" ? "border-b-2 border-black font-bold" : "text-gray-500"}`}
                  onClick={() => setActiveTab("rejected")}
                >
                  Against votes
                </button>
              </div>
            </div>
          )}

          {/* Show loader while data is being fetched */}
          {loading ? (
            <div className='p-4'>
                <MemberSkeletonLoader />
            </div>
          ) : showVotes ? (
            <div className="mt-4 overflow-y-auto  max-h-96">
              {/* Display the approved or rejected votes based on the active tab */}
              {activeTab === "approved" ? (
                voteProfiles.approved.length > 0 ? (
                  voteProfiles.approved.map((vote, index) => (
                    <div key={index} className="flex items-center p-4 mb-2 hover:bg-gray-100">
                      <img
                        src={vote.profileImage || avatar}
                        alt={`${vote.profileData?.username}'s profile`}
                        className="w-8 h-8 mr-8 rounded-full border-2 border-gray-600 shadow-md"
                      />
                      <div>
                        <p className="font-bold text-gray-800">{vote.profileData?.username || vote.vote.user}</p>
                        <p className="text-sm text-gray-800">{Principal.fromUint8Array(vote.profileData?.user_id._arr).toText() || "aaaaa-aa"}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-gray-600">No approved votes yet.</p>
                )
              ) : (
                voteProfiles.rejected.length > 0 ? (
                  voteProfiles.rejected.map((vote, index) => (
                    <div key={index} className="flex items-center p-2 mb-2 hover:bg-gray-100">
                      <img src={vote.profileImage || avatar} alt={`${vote.profileData?.username}'s profile`} className="w-14 h-14 mr-6 rounded-full" />
                      <div>
                        <p className="font-bold text-gray-800">{vote.profileData?.username || "Username"}</p>
                        <p className="text-sm text-gray-800">{principal || "aaaaa-aa"}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-gray-600">No rejected votes yet.</p>
                )
              )}
            </div>
          ) : profiles.length > 0 ? (
            profiles.map((member) => (
              <div
                  key={member.user}
                  className="flex items-center mb-4 justify-between cursor-pointer p-2 rounded-md bg-gray-100"
                  onClick={() => onClose(member)}
              >
                  <div className="flex items-center">
                      <img
                          src={member.profileImage || avatar}
                          alt={`${member.profileData?.username || member.name}'s profile`}
                          className="w-16 h-16 mr-6 rounded-full"
                      />
                      <div>
                          <div className="flex flex-col trnaslate-y-[10px] items-start">
                              <p className="m-0 font-bold  text-[25px] font-mulish text-left">{member.profileData?.username || member.name}</p>
                              <span className="block m-0 text-xs text-gray-600">{member.user}</span>
                          </div>
                      </div>
                  </div>
              </div>
          ))
          ) : (
          <p className="text-center text-gray-700">No profiles available yet. Be the first to participate!</p>
          )}
        </div>
      </Box>
    </Modal>
  );
}

export default ViewModal;

