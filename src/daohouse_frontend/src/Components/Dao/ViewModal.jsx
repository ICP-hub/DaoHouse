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
    // console.log(approvedVotesList);
    
    const { backendActor } = useAuth();
    const [profiles, setProfiles] = useState([]);
    const [loading, setLoading] = useState(false);
    const [voteProfiles, setVoteProfiles] = useState({ approved: [], rejected: [] });

    const protocol = process.env.DFX_NETWORK === "ic" ? "https" : "http";
    const domain = process.env.DFX_NETWORK === "ic" ? "raw.icp0.io" : "localhost:4943";

    useEffect(() => {
        if (users.length === 0) return;
    
        async function fetchUserProfiles() {
            setLoading(true);
            const fetchedProfiles = await Promise.all(users.map(async (user) => {
                try {
                    console.log("I'm in");
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
    }, [users, backendActor]); // Dependencies specific to user profiles
    
    
    useEffect(() => {
        if (approvedVotesList.length === 0 && rejectedVotesList.length === 0) return;
    
        async function fetchVoteProfiles(votes, type) {
            const fetchedVoteProfiles = await Promise.all(votes.map(async (vote) => {
                try {
                    const principalId = Principal.fromUint8Array(vote._arr);
                    const profileDetail = await backendActor.get_profile_by_id(principalId);
                    console.log(profileDetail);
    
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
                }
            }));
            setVoteProfiles((prev) => ({
                ...prev,
                [type]: fetchedVoteProfiles,
            }));
        }
    
        setLoading(true);
        if (approvedVotesList.length > 0) fetchVoteProfiles(approvedVotesList, 'approved');
        if (rejectedVotesList.length > 0) fetchVoteProfiles(rejectedVotesList, 'rejected');
        setLoading(false);
    }, [approvedVotesList, rejectedVotesList, backendActor]); // Dependencies specific to vote profiles
    


    


    return (
        <Modal
            open={open}
            onClose={onClose}
            aria-labelledby="user-modal-title"
            className="flex items-center justify-center backdrop-blur-md bg-black/50"
            closeAfterTransition
        >
            <Box className="relative p-4 bg-white rounded-lg shadow-4xl max-w-2xl w-full md:w-3/4 sm:w-full mx-4">
                <div className="absolute md:top-2 right-2">
                    <IconButton onClick={onClose} className="text-gray-500 hover:text-black z-10">
                        <CloseIcon />
                    </IconButton>
                </div>
                <div className="mt-6 sm:mt-0 sm:flex sm:flex-col sm:w-30">
                    {loading ? (
                        <MemberSkeletonLoader />
                    ) : showVotes ? (
                        <div className="text-center">
                            <h2 className="font-bold text-lg mb-4">Votes</h2>
                            <div className="mb-4">
                                <h3 className="font-bold text-green-600">Approved Votes:</h3>
                                {voteProfiles.approved.length > 0 ? (
                                    voteProfiles.approved.map((vote, index) => (
                                        <div key={index} className="flex items-center justify-center mb-2">
                                            <img
                                                src={vote.profileImage || avatar}
                                                alt={`${vote.profileData?.username}'s profile`}
                                                className="w-8 h-8 mr-2 rounded-full"
                                            />
                                            <p className="text-gray-800">{vote.profileData?.username || vote.vote.user}</p>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-gray-600">No approved votes yet.</p>
                                )}
                            </div>
                            <div>
                                <h3 className="font-bold text-red-600">Rejected Votes:</h3>
                                {voteProfiles.rejected.length > 0 ? (
                                    voteProfiles.rejected.map((vote, index) => (
                                        <div key={index} className="flex items-center justify-center mb-2">
                                            <img
                                                src={vote.profileImage || avatar}
                                                alt={`${vote.profileData?.username}'s profile`}
                                                className="w-8 h-8 mr-2 rounded-full"
                                            />
                                            <p className="text-gray-800">{vote.profileData?.username || vote.vote.user}</p>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-gray-600">No rejected votes yet.</p>
                                )}
                            </div>
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
                                        <div className="flex flex-col items-start">
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
