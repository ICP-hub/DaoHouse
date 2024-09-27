import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from '../../Components/utils/useAuthClient';
import { toast } from 'react-toastify';

// const BountyDone = () => {
//     const [bountyDone, setBountyDone] = useState({
//         proposalExpiredAt: '',
//         from: '',
//         description: '',
//         tokens: '',
//         actionMember: '',
//         proposalCreatedAt: '',
//         bountTask: '',
//     });
//     const [loading, setLoading] = useState(false);
//     const navigate = useNavigate();
//     const { createDaoActor } = useAuth();
//     const { daoCanisterId } = useParams();

//     useEffect(() => {
//         console.log("DAO Canister ID:", daoCanisterId);
//     }, [daoCanisterId]);

//     const handleInputBountyDone = (e) => {
//         const { name, value } = e.target;
//         setBountyDone((prev) => ({
//             ...prev,
//             [name]: value,
//         }));
//     };

//     const submitBountyDone = async (e) => {
//         e.preventDefault();
//         setLoading(true); // Start loading
//    console.log("sajkdasd",bountyDone);
   
//         try {
//             const daoCanister = await createDaoActor(daoCanisterId);
//             const response = await daoCanister.proposal_to_bounty_done(bountyDone);
//             console.log("Response of add ", response);
//             toast.success("Bounty proposal created successfully");
//             movetodao();
//         } catch (error) {
//             console.error("Error of add", error);
//             toast.error("Failed to create bounty proposal.");
//         } finally {
//             setLoading(false); // End loading
//         }
//     };

//     const movetodao = () => {
//         navigate(`/dao/profile/${daoCanisterId}`);
//     };
const BountyDone = ({ bountyData, onInputChange }) => {
    const navigate = useNavigate();
    const { daoCanisterId } = useParams();
  
    const submitBountyDone = async (e) => {
      e.preventDefault();
      console.log("sjdnalskds",bountyData);
      
      try {
        const daoCanister = await createDaoActor(daoCanisterId);
        const response = await daoCanister.proposal_to_bounty_done(bountyData);
        toast.success("Bounty proposal created successfully");
        navigate(`/dao/profile/${daoCanisterId}`);
      } catch (error) {
        console.error("Error creating bounty proposal:", error);
        toast.error("Failed to create bounty proposal.");
      }
    };
    return (
        <div className="BountyDone">
            <h2>Bounty Done Proposal</h2>
            <form onSubmit={submitBountyDone}>
            <div className="mb-4">
                <label>To (Principal)</label>
                <input
                    type="text"
                    name="to"
                    value={bountyData.to}
                    onChange={onInputChange}
                    className="w-full px-4 py-3 border-opacity-30 border border-[#aba9a5] rounded-xl bg-transparent"
                    placeholder="Enter 'To' Principal"
                    required
                />
            </div>
            <div className="mb-4">
                <label>Description</label>
                <input
                    type="text"
                    name="description"
                    value={bountyData.description}
                    onChange={onInputChange}
                    className="w-full px-4 py-3 border-opacity-30 border border-[#aba9a5] rounded-xl bg-transparent"
                    placeholder="Enter description"
                    required
                />
            </div>
            <div className="mb-4">
                <label>Bounty Task</label>
                <input
                    type="text"
                    name="bountyTask" // Fixed typo from bountTask to bountyTask
                    value={bountyData.bountyTask}
                    onChange={onInputChange}
                    className="w-full px-4 py-3 border-opacity-30 border border-[#aba9a5] rounded-xl bg-transparent"
                    placeholder="Enter bounty task"
                    required
                />
                </div>
                <div className="mb-4">
                    <label>Tokens</label>
                    <input
                        type="number"
                        name="tokens"
                        value={bountyData.tokens}
                        onChange={onInputChange}
                        className="w-full px-4 py-3 border-opacity-30 border border-[#aba9a5] rounded-xl bg-transparent"
                        placeholder="Enter tokens"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label>Action Member (Principal)</label>
                    <input
                        type="text"
                        name="actionMember"
                        value={bountyData.actionMember}
                        onChange={onInputChange}
                        className="w-full px-4 py-3 border-opacity-30 border border-[#aba9a5] rounded-xl bg-transparent"
                        placeholder="Enter action member principal"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label>Proposal Expired At</label>
                    <input
                        type="date"
                        name="proposalExpiredAt"
                        value={bountyData.proposalExpiredAt}
                        onChange={onInputChange}
                        className="w-full px-4 py-3 border-opacity-30 border border-[#aba9a5] rounded-xl bg-transparent"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label>Proposal Created At</label>
                    <input
                        type="date"
                        name="proposalCreatedAt"
                        value={bountyData.proposalCreatedAt}
                        onChange={onInputChange}
                        className="w-full px-4 py-3 border-opacity-30 border border-[#aba9a5] rounded-xl bg-transparent"
                        required
                    />
                </div>
                {/* <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? <CircularProgress size={24} /> : 'Submit Bounty Done Proposal'}
                </button> */}
            </form>
        </div>
    );
};

export default BountyDone;
