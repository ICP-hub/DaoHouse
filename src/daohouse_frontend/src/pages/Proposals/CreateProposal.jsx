import React, { useState ,useEffect } from 'react';
import proposals from "../../../assets/proposals.png";
import createProposalNew from "../../../assets/createProposalNew.png";
import ReactQuill from 'react-quill';
import { quillFormats, quillModules } from '../../utils/quilConfig';
import Container from '../../Components/Container/Container';
import { useAuth } from '../../Components/utils/useAuthClient';
import { toast } from 'react-toastify';
import { CircularProgress } from '@mui/material';
import { useNavigate, useParams } from "react-router-dom";
import { Principal } from "@dfinity/principal";

function CreateProposal() {
    const navigate = useNavigate();
    const [proposalTitle, setProposalTitle] = useState('');
    const [proposalDescription, setProposalDescription] = useState('');
    const [requiredVotes, setRequiredVotes] = useState('');
    const [proposalType, setProposalType] = useState(''); 
 
    const [loading, setLoading] = useState(false);
   const { createDaoActor, backendActor ,stringPrincipal  } = useAuth();
  console.log("dfjsdljflksdf",stringPrincipal);
  
    
   const { daoCanisterId } = useParams();
    useEffect(() => {
        console.log("DAO Canister ID:", daoCanisterId);
    }, [daoCanisterId]);
    const className = "CreateProposals";

    const handleProposalTitleChange = (event) => {
        setProposalTitle(event.target.value);
    };

    const handleProposalDescriptionChange = (value) => {
        setProposalDescription(value);
    };

    const handleProposalTypeChange = (event) => {
        setProposalType(event.target.value);
    };
    const stripHtmlTags = (html) => {
        const doc = new DOMParser().parseFromString(html, 'text/html');
        return doc.body.textContent || "";
    };
    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
    
        try {
            // Validate proposal data before sending
            // const votes = parseInt(requiredVotes, 10);
            if (!proposalTitle || !proposalDescription  || !proposalType ) {
                throw new Error("Please fill all the fields with valid data and choose a proposal type.");
            }
            
            const strippedDescription = stripHtmlTags(proposalDescription);
            const proposalData = {
                // principal_of_action : Principal.fromText(stringPrincipal).toText(),
                principal_of_action : stringPrincipal ? [Principal.fromText(stringPrincipal)] : [],
                proposal_title: proposalTitle,
                new_dao_name: [],
                proposal_description: strippedDescription,
                // required_votes: parseInt(requiredVotes, 10),
                proposal_type: { [proposalType]: null },
                group_to_join : [],
            };
    
            console.log("Proposal Data:", proposalData);    
            const pagination = { start: 0, end: 10 };
            const response = await backendActor.get_all_dao(pagination);
    
            await Promise.all(response.map(async (data) => {
                console.log("data",data);
                
                const daoCanister = createDaoActor(data.dao_canister_id);
                console.log("DAO Canister ID:", data.dao_canister_id);
                const backendPrincipal = Principal.fromText(process.env.CANISTER_ID_DAOHOUSE_BACKEND)
                await daoCanister.create_proposal_controller(backendPrincipal, proposalData);
            }));
                        
            // Display success message and clear form fields
            toast.success("Proposal created successfully!");
            setProposalTitle('');
            setProposalDescription('');
            // setRequiredVotes('');
            setProposalType('');
           
        } catch (error) {
            console.error("Error creating proposal:", error);
            toast.error(error.message || "Error creating proposal. Please try again.");
        } finally {
            setLoading(false);
        }
    };
    

    // const handleSubmit = async (event) => {
    //     event.preventDefault();
    //     setLoading(true);
    
    //     try {
    //         // Validate proposal data before sending
    //         if (!proposalTitle || !proposalDescription || !proposalType) {
    //             throw new Error("Please fill all the fields with valid data and choose a proposal type.");
    //         }
    
          
    //         const proposalData = {
    //             principal_of_action :aaaaa-aa,
    //             proposal_title: proposalTitle,
    //             proposal_description: strippedDescription,
    //             proposal_type: { [proposalType]: null },
    //         };
    
    //         console.log("Proposal Data:", proposalData);
    //         console.log("Backend ID:", process.env.CANISTER_ID_DAOHOUSE_BACKEND);
    
    //         // Fetch all DAOs and get the DAO Canister
    //         const pagination = { start: 0, end: 10 };
    //         const response = await backendActor.get_all_dao(pagination);
    
    //         await Promise.all(response.map(async (data) => {
    //             console.log("data", data);
    
    //             const daoCanister = createDaoActor(data.dao_canister_id);
    //             console.log("DAO Canister ID:", data.dao_canister_id);
    
    //             // Convert the string canister ID to a valid Principal object
    //             const backendPrincipal = Principal.fromText(process.env.CANISTER_ID_DAOHOUSE_BACKEND);
                
    //             // Pass the Principal object instead of the string
    //             await daoCanister.create_proposal_controller(backendPrincipal, proposalData);
    //         }));
    
    //         console.log("Proposal created successfully");
    
    //         // Display success message and clear form fields
    //         toast.success("Proposal created successfully!");
    //         setProposalTitle('');
    //         setProposalDescription('');
    //         setProposalType('');
    
    //     } catch (error) {
    //         console.error("Error creating proposal:", error);
    //         toast.error(error.message || "Error creating proposal. Please try again.");
    //     } finally {
    //         setLoading(false);
    //     }
    // };
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

            <div className='bg-[#F5F5F5]'>
                <Container classes={`${className}__label relative py-8 px-10 flex gap-2 flex-col w-full justify-between items-center`}>
                    <p className="md:text-[40px] text-[30px] text-black px-8 mr-auto flex flex-row justify-start items-center gap-4 ">
                        Create Proposal  
                        <div className="flex flex-col items-start">
                            <div className="w-32 border-t-2 border-black"></div>
                            <div className="w-14 mt-2 border-t-2 border-black"></div>
                        </div>
                    </p>
                    <div className=" bg-[#F4F2EC] p-6 m-6 rounded-lg shadow w-full ">
                        <div className='flex justify-start gap-6 rounded-md p-4'>
                            <div className='flex flex-col w-[800px]'>
                                <div className="max-w-6xl relative">
                                    <label className="block mb-2 font-semibold text-xl">Proposal Title</label>
                                    <input
                                        type="text"
                                        value={proposalTitle}
                                        onChange={handleProposalTitleChange}
                                        placeholder="Enter proposal title"
                                        className=" w-full max-w-[800px] px-4 py-3 mb-4 border-opacity-30 border border-[#aba9a5] rounded-xl bg-transparent"
                                    />
                                </div>

                                <div className='max-w-6xl'>
                                    <h1 className="text-xl font-semibold mb-4">Proposal Description</h1>
                                    <div className="mb-6 max-w-6xl mt-4 relative">
                                        <textarea
                                            value={proposalDescription}
                                            onChange={e => setProposalDescription(e.target.value)} // Update handler to set state
                                            placeholder='Write here...'
                                            className='w-full max-w-[800px] px-4 py-3 mb-4 border-opacity-30 border border-[#aba9a5] rounded-xl bg-transparent'
                                            rows="10" // You can adjust the number of rows
                                        />
                                    </div>
                                </div>


                                {/* <div className="mb-6 max-w-6xl relative">
                                    <label className="block mb-2 font-semibold text-xl">Required Votes</label>
                                    <input
                                        type="number"
                                        value={requiredVotes}
                                        onChange={handleRequiredVotesChange}
                                        placeholder="Enter required votes"
                                        className="w-full max-w-[800px] px-4 py-3 mb-4 border-opacity-30 border border-[#aba9a5] rounded-xl bg-transparent"
                                    />
                                </div> */}

                                <div className="mb-6 max-w-6xl relative">
                                    <label className="block mb-2 font-semibold text-xl">Proposal Type</label>
                                    <select
                                        value={proposalType}
                                        onChange={handleProposalTypeChange}
                                        className="w-full max-w-[800px] px-4 py-3 mb-4 border-opacity-30 border border-[#aba9a5] rounded-xl bg-transparent"
                                    >
                                        <option value="">Select Proposal Type</option>
                                        <option value="VotingProposal">Voting Proposal</option>
                                        <option value="RemoveMemberProposal">Remove Member Proposal</option>
                                        <option value="AddMemberProposal">Add Member Proposal</option>
                                    </select>
                                </div>

                                <div className="flex justify-center my-8">
                                {
                                    loading ? <CircularProgress /> :
                                    <button
                                        className="bg-[#0E3746] hover:bg-[#819499] text-white font-normal text-center rounded-full text-[16px] py-2 px-6 rounded focus:outline-none focus:shadow-outline"
                                        type="submit"
                                        onClick={handleSubmit}
                                        disabled={loading}
                                    >
                                        Submit
                                    </button>
                                }
                                </div>
                            </div>
                            
                            <div className="md:flex self-start hidden">
                                <img src={createProposalNew} alt="Illustration" className="w-[350px] h-[350px]" />
                            </div>
                        </div>
                    </div>
                </Container>
            </div>
        </div>
    );
}

export default CreateProposal;
