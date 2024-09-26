import React, { useEffect, useState } from 'react';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import avatar from "../../../assets/avatar.png";
import { useAuth } from '../utils/useAuthClient';
import { Principal } from '@dfinity/principal';
import MemberSkeletonLoader from '../SkeletonLoaders/MemberSkeletonLoader/MemberSkeletonLoader';

function ViewModal({ open, onClose, users = [] }) {
    const { backendActor } = useAuth();
    const [profiles, setProfiles] = useState([]);
    const [loading, setLoading] = useState(false);
    // console.log(profiles);
    

    const protocol = process.env.DFX_NETWORK === "ic" ? "https" : "http";
    const domain = process.env.DFX_NETWORK === "ic" ? "raw.icp0.io" : "localhost:4943";

    useEffect(() => {
        async function fetchUserProfiles() {
            setLoading(true);
            const fetchedProfiles = await Promise.all(users.map(async (user) => {
                try {
                    const userDetail = await backendActor.get_profile_by_id(Principal.fromText(user));
                    console.log("usernnnnnnnn",userDetail);
                    
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

        if (users.length > 0) {
            fetchUserProfiles();
        }
    }, [users, backendActor, protocol, domain]);

    return (
        <Modal
            open={open}
            onClose={onClose}
            aria-labelledby="user-modal-title"
            className="flex items-center justify-center backdrop-blur-md bg-black/50"
            closeAfterTransition
        >
            <Box
                className="relative p-4 bg-white rounded-lg shadow-2xl max-w-3xl w-full md:w-3/4 sm:w-full mx-4"
            >
                <div className="absolute top-0 right-2">
                    <IconButton
                        onClick={onClose}
                        className="text-gray-500 hover:text-black z-10"
                    >
                        <CloseIcon />
                    </IconButton>
                </div>
                <div className="mt-6 sm:mt-0 sm:flex sm:flex-col sm:w-30">
                {loading ? (
                        // Show skeleton loader when loading
                        <MemberSkeletonLoader />
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
                                        className="w-12 h-12 mr-4 rounded-full"
                                    />
                                    <div>
                                        <div className="flex flex-col items-start">
                                            <p className="m-0 font-bold text-left">{member.profileData?.username || member.name}</p>
                                            <span className="block m-0 text-xs text-gray-600">{member.user}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-center text-gray-700">No voters have registered for this DAO yet. Be the first to participate and make your voice heard!</p>
                    )}
                </div>
            </Box>
        </Modal>
    );
}

export default ViewModal;
