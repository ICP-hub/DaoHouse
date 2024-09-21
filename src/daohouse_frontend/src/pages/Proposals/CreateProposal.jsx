
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
    const[addMember,setAddMemeber] = useState({
        description : '',
        groupName : '',
        newMember : '',
    })
    const[bountyDone,setBountyDone] = useState({
        proposalExpiredAt : '',
        from : '',
        description : '',
        tokens : '',
        actionMember : '',
        proposalCreatedAt : '',
        bountTask : '',
    })
 
    const [formData,setFormData] = useState({
        description: '',
        groupName: '',
        newMember: '',
       
    }
        )
 
    const [loading, setLoading] = useState(false);
   const { createDaoActor, backendActor ,stringPrincipal  } = useAuth();


  
    
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
        // setFormData({
        //     description: '',
        //     groupName: '',
        //     newMember: '',
        //     // proposalExpiredAt: '',
        //     // from: '',
        //     // tokens: '',
        //     // actionMember: '',
        //     // proposalCreatedAt: '',
        //     // bountyTask: '',
        //     // daoPurpose: '',
        //     // newDaoName: '',
        // })
    };
    const stripHtmlTags = (html) => {
        const doc = new DOMParser().parseFromString(html, 'text/html');
        return doc.body.textContent || "";
    };
    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
      };
      const handleInputAddMemeber = (e) => {
        const { name, value } = e.target;
        setAddMemeber((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };
   
    const handleInputBountyDone = (e) => {
        const { name, value } = e.target;
        setBountyDone((prev) => ({
          ...prev,
          [name]: value,
        }));
      };
    const handleSubmit = (e) => {
        e.preventDefault();
    
        switch (proposalType) {
          case 'AddMemberProposal':
          
            submitAddMemberProposal({
              description: addMember.description,
              groupNname: addMember.groupName,
              newMember: Principal.fromText(addMember.newMember),

            });
       
            
            break;
         
            case 'BountyDone':
                // Integrate API for Bounty Done
                submitBountyDone({
                //   proposal_expired_at: new Date(bountyDone.proposalExpiredAt).getTime(),
                proposalExpiredAt:Number(bountyDone.proposalExpiredAt),
                  from: bountyDone.from, 
                  description: bountyDone.description,
                  tokens: Number(bountyDone.tokens), // Ensure tokens are numbers
                  action_member: bountyDone.actionMember,
                  proposal_created_at: new Date(bountyDone.proposalCreatedAt).getTime(), // Convert to timestamp if needed
                  bounty_task: bountyDone.bountTask,
                });
                break;
              
    
          // case 'BountyRaised':
          //   // Integrate API for Bounty Raised
          //   submitBountyRaised({
          //     proposal_expired_at: formData.proposalExpiredAt,
          //     description: formData.description,
          //     tokens: formData.tokens,
          //     action_member: formData.actionMember,
          //     proposal_created_at: formData.proposalCreatedAt,
          //     bounty_task: formData.bountyTask,
          //   });
          //   break;
    
          //   case 'ChangeDaoPolicy':
          //       // Handle Change DAO Policy submission
          //       submitChangeDaoPolicy({
          //         description: formData.description,
          //         action_member: formData.actionMember,
          //         dao_purpose: formData.daoPurpose,
          //       });
          //       break;
    
          // case 'ChangeDaoConfig':
          //   // Integrate API for Change DAO Config
          //   submitChangeDaoConfig({
          //     new_dao_name: formData.newDaoName,
          //     description: formData.description,
          //     action_member: formData.actionMember,
          //   });
          //   break;
    
          // default:
          //   alert('Please select a proposal type and fill in the details.');
        }
      };
       // Dummy API calls for demonstration
// Define the API call function
const submitAddMemberProposal = async (addMember) => {
    
     
     try {
    const daoCanister = await createDaoActor(daoCanisterId);
      console.log("daocanister iss",daoCanisterId);
      
  
      console.log("Add member proposal : ",daoCanister)
      const response = await daoCanister.proposal_to_add_member_to_group(addMember);
      console.log("response of add ",response)
     } catch (error) {
      console.log("error of add",error);
      
     }
   
  };

  const submitBountyDone = async (bountyDone) => {
    
     
    try {
   const daoCanister = await createDaoActor(daoCanisterId);
     console.log("daocanister iss",daoCanisterId);
     
 
     console.log("bounty done  proposal : ",daoCanister)
     const response = await daoCanister.proposal_to_bounty_done(bountyDone);
     console.log("response of add ",response)
    } catch (error) {
     console.log("error of add",error);
     
    }
  
 };
  

const proposal  = async()=>{
    const payload= {
        description : "askdjkasd",
        group_name : "askdjkasd",
new_member :Principal.fromText("3ej5p-k6yeq-a5egb-xzhmp-4h3ic-22vmb-ns2gq-2jijx-z2qjb-qlq4m-yqe")
    }
    console.log("daopyalod",payload)
    try {
        const daoCanister = await createDaoActor(daoCanisterId);
        console.log("daocanister iss",daoCanisterId);
        
        const response = await daoCanister.proposal_to_add_member_to_group(payload);
        console.log("response of add ",response)
    } catch (error) {
        console.log("error",error);
        
    }
}

   
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
  <option value="AddMemberProposal">Add Member Proposal</option>
  <option value="ChangeDaoConfig">Change DAO Config</option>
  <option value="BountyDone">Bounty Done</option>
  <option value="UpgradeRemote">Upgrade Remote</option>
  <option value="Polls">Polls</option>
  <option value="TokenTransfer">Token Transfer</option>
  <option value="ChnageDaoPolicy">Change DAO Policy</option>
  <option value="BountyRaised">Bounty Raised</option>
  <option value="RemoveMemberProposal">Remove Member Proposal</option>
  <option value="FunctionCall">Function Call</option>
  <option value="UpdateSelf">Update Self</option>
                                    </select>
                                </div>


                                   {/* Conditional Input Fields Based on Proposal Type */}
      {proposalType === 'AddMemberProposal' && (
        <>
          <div className="mb-4">
            <label>Description</label>
            <input
              type="text"
              name="description"
              value={addMember.description}
              onChange={handleInputAddMemeber}
              className="w-full px-4 py-3 border-opacity-30 border border-[#aba9a5] rounded-xl bg-transparent"
              placeholder="Enter description"
            />
          </div>
          <div className="mb-4">
            <label>Group Name</label>
            <input
              type="text"
              name="groupName"
              value={addMember.groupName}
              onChange={handleInputAddMemeber}
              className="w-full px-4 py-3 border-opacity-30 border border-[#aba9a5] rounded-xl bg-transparent"
              placeholder="Enter group name"
            />
          </div>
          <div className="mb-4">
            <label>New Member (Principal)</label>
            <input
              type="text"
              name="newMember"
              value={addMember.newMember}
              onChange={handleInputAddMemeber}
              className="w-full px-4 py-3 border-opacity-30 border border-[#aba9a5] rounded-xl bg-transparent"
              placeholder="Enter new member principal"
            />
          </div>
        </>
      )}
       {proposalType === 'BountyDone' && (
        <>
          <div className="mb-4">
            <label>Description</label>
            <input
              type="text"
              name="description"
              value={bountyDone.description}
              onChange={handleInputBountyDone}
              className="w-full px-4 py-3 border-opacity-30 border border-[#aba9a5] rounded-xl bg-transparent"
              placeholder="Enter description"
            />
          </div>
          <div className="mb-4">
            <label>Bounty Task</label>
            <input
              type="text"
              name="bountyTask"
              value={bountyDone.bountyTask}
              onChange={handleInputBountyDone}
              className="w-full px-4 py-3 border-opacity-30 border border-[#aba9a5] rounded-xl bg-transparent"
              placeholder="Enter bounty task"
            />
          </div>
          <div className="mb-4">
            <label>Tokens</label>
            <input
              type="number"
              name="tokens"
              value={bountyDone.tokens}
              onChange={handleInputBountyDone}
              className="w-full px-4 py-3 border-opacity-30 border border-[#aba9a5] rounded-xl bg-transparent"
              placeholder="Enter tokens"
            />
          </div>
          <div className="mb-4">
            <label>Action Member (Principal)</label>
            <input
              type="text"
              name="actionMember"
              value={bountyDone.actionMember}
              onChange={handleInputBountyDone}
              className="w-full px-4 py-3 border-opacity-30 border border-[#aba9a5] rounded-xl bg-transparent"
              placeholder="Enter action member principal"
            />
          </div>
          <div className="mb-4">
            <label>Proposal Expired At</label>
            <input
              type="datetime-local"
              name="proposalExpiredAt"
              value={bountyDone.proposalExpiredAt}
              onChange={handleInputBountyDone}
              className="w-full px-4 py-3 border-opacity-30 border border-[#aba9a5] rounded-xl bg-transparent"
            />
          </div>
          <div className="mb-4">
            <label>Proposal Created At</label>
            <input
              type="datetime-local"
              name="proposalCreatedAt"
              value={bountyDone.proposalCreatedAt}
              onChange={handleInputBountyDone}
              className="w-full px-4 py-3 border-opacity-30 border border-[#aba9a5] rounded-xl bg-transparent"
            />
          </div>
        </>
      )}
      <button onClick={proposal}>
        add
      </button>

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
