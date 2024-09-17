import React from 'react';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import avatar from "../../../assets/avatar.png";

const users = [
    {
        name: "Alice",
        principalId: "7co7h-3x54v-ga4dx-4mz4j-lxwvh-ursxl-i3buq-fmno7",
        profileImage: avatar
    },
    {
        name: "Bob",
        principalId: "8co7h-3x54v-ga4dx-4mz4j-lxwvh-ursxl-i3buq-fmno5",
        profileImage: avatar
    },
    {
        name: "Carol",
        principalId: "9co7h-3x54v-ga4dx-4mz4j-lxwvh-ursxl-i3buq-fmno4",
        profileImage: avatar
    }
];

function ViewModal({ open, onClose, users = [] }) {
    // Find the user based on the selectedUserId
   // const user = users.find(user => user.principalId === selectedUserId);

 return (
    <Modal
        open={open}
        onClose={onClose}
        aria-labelledby="user-modal-title"
        className="flex items-center justify-center backdrop-blur-md bg-black/50"
        closeAfterTransition
    >
        <Box
            className="relative p-4 bg-white rounded-lg shadow-2xl max-w-3xl w-full"
        >
            <div className="absolute top-0 right-2">
                    <IconButton
                        onClick={onClose}
                        className="text-gray-500 hover:text-black"
                    >
                        <CloseIcon />
                    </IconButton>
                </div>
            <div className="mb-4">
                {users.length > 0 ? (
                    users.map((principalId) => (
                        <div
                            key={principalId}
                            className={`flex items-center mb-4 justify-between cursor-pointer p-2 rounded-md bg-gray-100`}
                            onClick={() => onClose(principalId)}
                        >
                            <div className="flex items-center">
                                <img
                                    src={ avatar}
                                    alt={`user's profile`}
                                    className="w-12 h-12 mr-4 rounded-full"
                                />
                                <div>
                                    <p className="m-0 font-bold text-left">Username.user</p>
                                </div>
                            </div>
                            <p className="m-0 text-right">{principalId}</p>
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