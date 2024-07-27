import React, { useState } from 'react';
import proposals from "../../../assets/proposals.png";
import createProposal from "../../../assets/proposal.gif";
import ReactQuill from 'react-quill';
import { quillFormats, quillModules } from '../../utils/quilConfig';
import Container from '../../Components/Container/Container';
import { useAuth } from '../../Components/utils/useAuthClient';
import { toast } from 'react-toastify';

function CreateProposal() {
    const [proposalTitle, setProposalTitle] = useState('');
    const [proposalDescription, setProposalDescription] = useState('');
    const [requiredVotes, setRequiredVotes] = useState('');
    const [loading, setLoading] = useState(false);
    const { createDaoActor, backendActor } = useAuth();

    const className = "CreateProposals";

    const handleProposalTitleChange = (event) => {
        setProposalTitle(event.target.value);
    };

    const handleProposalDescriptionChange = (value) => {
        setProposalDescription(value);
    };

    const handleRequiredVotesChange = (event) => {
        setRequiredVotes(event.target.value);
    };


    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
    
        try {
            const proposalData = {
                proposal_title: proposalTitle,
                proposal_description: proposalDescription,
                required_votes: parseInt(requiredVotes, 10),
            };
    
            console.log("Proposal Data:", proposalData);
            console.log("Backend ID:", process.env.CANISTER_ID_DAOHOUSE_BACKEND);
    
            // Validate proposal data before sending
            if (!proposalTitle || !proposalDescription || isNaN(requiredVotes)) {
                throw new Error("Invalid proposal data");
            }
    
            // Fetch all DAOs and get the DAO Canister
            const pagination = { start: 0, end: 10 };
            const response = await backendActor.get_all_dao(pagination);
    
            await Promise.all(response.map(async (data) => {
                const daoCanister = createDaoActor(data.dao_canister_id);
                console.log("DAO Canister ID:", data.dao_canister_id);
                await daoCanister.create_proposal(process.env.CANISTER_ID_DAOHOUSE_BACKEND, proposalData);
            }));
            console.log("Proposal created successfully");

            // Display success message and clear form fields
            toast.success("Proposal created successfully!");
            setProposalTitle('');
            setProposalDescription('');
            setRequiredVotes('');
    
        } catch (error) {
            console.error("Error creating proposal:", error);
            toast.error("Error creating proposal: " + error.message);
        } finally {
            setLoading(false);
        }
    };
    

    return (
        <div className="bg-zinc-200 w-full">
            <div style={{
                backgroundImage: `url("${proposals}")`,
                backgroundRepeat: "no-repeat",
                backgroundSize: "cover",
                backgroundPosition: "center",
            }}>
                <Container classes={`${className}__filter w-full h-[25vh] p-20 flex flex-col items-start justify-center`}>
                    <h1 className="text-[40px] p-2 text-white border-b-2 border-white">Proposals</h1>
                </Container>
            </div>

            <div className='bg-[#c8ced3]'>
                <Container classes={`${className}__label relative py-8 px-10 flex gap-2 flex-col w-full justify-between items-center`}>
                    <p className="text-[40px] text-black px-8 mr-auto flex flex-row justify-start items-center gap-4">
                        Create Proposal
                        <div className="flex flex-col items-start">
                            <div className="w-32 border-t-2 border-black"></div>
                            <div className="w-14 mt-2 border-t-2 border-black"></div>
                        </div>
                    </p>

                    <div className="mx-auto bg-[#F4F2EC] p-6 m-6 rounded-lg shadow w-full">
                        <div className="mb-6 max-w-6xl relative">
                            <label className="block mb-2 font-semibold text-xl">Proposal Title</label>
                            <input 
                                type="text" 
                                value={proposalTitle} 
                                onChange={handleProposalTitleChange} 
                                placeholder="Enter proposal title" 
                                className="w-full px-4 py-3 mb-4 border-opacity-30 border border-[#aba9a5] rounded-xl bg-transparent" 
                            />
                        </div>

                        <div className='max-w-6xl'>
                            <h1 className="text-xl font-semibold mb-4">Proposal Description</h1>
                            <div className="mb-6 max-w-6xl mt-4 relative editor-container">
                                <ReactQuill
                                    value={proposalDescription}
                                    onChange={handleProposalDescriptionChange}
                                    modules={quillModules}
                                    formats={quillFormats}
                                    placeholder='Write here...'
                                    className='proposal-editor rounded-xl'
                                />
                            </div>
                        </div>

                        <div className="mb-6 max-w-6xl relative">
                            <label className="block mb-2 font-semibold text-xl">Required Votes</label>
                            <input 
                                type="number" 
                                value={requiredVotes} 
                                onChange={handleRequiredVotesChange} 
                                placeholder="Enter required votes" 
                                className="w-full px-4 py-3 mb-4 border-opacity-30 border border-[#aba9a5] rounded-xl bg-transparent" 
                            />
                        </div>

                        <div className="flex justify-center my-8">
                            <button
                                className="bg-[#0E3746] hover:bg-[#819499] text-white font-normal text-center rounded-full text-[16px] py-2 px-6 rounded focus:outline-none focus:shadow-outline"
                                type="submit"
                                onClick={handleSubmit}
                                disabled={loading}
                            >
                                Submit
                            </button>
                        </div>
                    </div>

                    <div className="absolute right-10 top-10">
                        <img src={createProposal} alt="Illustration" className="w-[350px] h-[350px]" />
                    </div>
                </Container>
            </div>
        </div>
    );
}

export default CreateProposal;
