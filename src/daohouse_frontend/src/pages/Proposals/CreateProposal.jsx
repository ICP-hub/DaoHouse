
import React, { useState, useEffect } from 'react';
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
  const [tokenTransfer, setTokenTransfer] = useState({
    from: '',
    description: '',
    tokens: '',
    actionMember: '',
  })


  const [bountyDone, setBountyDone] = useState({
    proposalExpiredAt: '',
    from: '',
    description: '',
    tokens: '',
    actionMember: '',
    proposalCreatedAt: '',
    bountTask: '',
  })

  const [generalPurp, setGeneralPurp] = useState({
    proposalExpiredAt: '',
    description: '',
    actionMember: '',
    purposeTitle: '',
    proposalCreatedAt: '',
  })
  const [changeData, setChangeData] = useState({
    new_dao_name: "",
    description: "",
    action_member: "",
  });
  const [addMember, setAddMember] = useState({
    group_name: "",
    description: "",
    new_member: "",
  });
  const [groupNames, setGropNames] = useState([]);
  const [loading, setLoading] = useState(false);
  const { createDaoActor, backendActor, stringPrincipal } = useAuth();

  const movetodao = () => {
    navigate(`/dao/profile/${daoCanisterId}`);
  };


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
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleInputTranferToken = (e) => {
    const { name, value } = e.target;
    setTokenTransfer((prevState) => ({
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

  const handleInputGeneralPurp = (e) => {
    const { name, value } = e.target;
    setGeneralPurp((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  function handleChange(e) {
    setChangeData({
      ...changeData,
      [e.target.name]: e.target.value,
    });
  }
  const handleInputAddMember = (e) => {
    setAddMember({
      ...addMember,
      [e.target.name]: e.target.value,
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      switch (proposalType) {
        case 'TokenTransfer':
          await submitTokenTransferProposal({
            from: Principal.fromText(tokenTransfer.from),
            description: tokenTransfer.description,
            tokens: Number(tokenTransfer.tokens),
            action_member: Principal.fromText(tokenTransfer.actionMember),
          });
          break;

        case 'BountyDone':
          await submitBountyDone({
            proposal_expired_at: new Date(bountyDone.proposalExpiredAt).getTime(),
            from: Principal.fromText(bountyDone.from),
            description: bountyDone.description,
            tokens: Number(bountyDone.tokens),
            action_member: Principal.fromText(bountyDone.actionMember),
            proposal_created_at: 12,
            bounty_task: bountyDone.bountTask,
          });
          break;
        case 'GeneralPurp':
          await submitGeneralPurp({
            proposal_expired_at: new Date(generalPurp.proposalExpiredAt).getTime(),
            description: generalPurp.description,
            action_member: Principal.fromText(generalPurp.actionMember),
            purpose_title: generalPurp.purposeTitle,
            proposal_created_at: new Date(generalPurp.proposalCreatedAt).getTime(),
          });
          break;

        case 'DaoConfig':
          await submitDaoConfig({
            new_dao_name: changeData.new_dao_name,
            description: changeData.description,
            action_member: Principal.fromText(changeData.action_member),
          });

        case 'AddMember':
          await submitAddMember({
            group_name: addMember.group_name,
            description: addMember.description,
            new_member: Principal.fromText(addMember.new_member),
          });
        // default:
        //     toast.error('Please select a proposal type and fill in the details.');
      }

    } catch (error) {
      console.error("Submission error:", error);
    } finally {
      setLoading(false);
    }
  };
  const submitTokenTransferProposal = async (tokenTransfer) => {


    try {
      const daoCanister = await createDaoActor(daoCanisterId);
      console.log("daocanister iss", daoCanisterId);


      console.log("Add member proposal : ", daoCanister);
      const response = await daoCanister.proposal_to_transfer_token(tokenTransfer);
      console.log("response of token transfer ", response);
      toast.success("token transfer policy proposal created successfully");
      movetodao();
    } catch (error) {
      console.log("error of add", error);

    }



  };

  const submitBountyDone = async (bountyDone) => {


    try {
      const daoCanister = await createDaoActor(daoCanisterId);
      console.log("daocanister iss", daoCanisterId);

      console.log("bounty done", bountyDone?.proposalExpiredAt);

      console.log("bounty done  proposal : ", daoCanister)
      const response = await daoCanister.proposal_to_bounty_done(bountyDone);
      console.log("response of add ", response)
      toast.success("Bounty  proposal created successfully");
      movetodao();
    } catch (error) {
      console.log("error of add", error);

    }

  };


  const submitGeneralPurp = async (generalPurp) => {


    try {
      const daoCanister = await createDaoActor(daoCanisterId);
      console.log("daocanister iss", daoCanisterId);



      console.log("generl purpose  proposal : ", daoCanister)
      const response = await daoCanister.proposal_to_create_general_purpose(generalPurp);
      console.log("response of general ", response)
      toast.success("General Purpose  proposal created successfully");
      movetodao();
    } catch (error) {
      console.log("error of add", error);

    }

  };

  const submitDaoConfig = async () => {
    const formattedInputData = {
      new_dao_name: "khasdgkjasgdja",
      description: "kasgdjagsd",
      action_member: Principal.fromText("aaaaa-aa"),
      new_dao_name: changeData.new_dao_name,
      description: changeData.description,
      action_member: Principal.fromText(changeData.action_member),
    };


    try {
      const daoCanister = await createDaoActor(daoCanisterId);
      console.log("daoCanister ID:", daoCanisterId);
      console.log("response", formattedInputData);

      // Send the correctly formatted data
      const response = await daoCanister.proposal_to_chnage_dao_config(formattedInputData);
      console.log("Response from proposal:", response);
      if (response.Ok) {
        toast.success("DAO configuration proposal created successfully");
        movetodao();
        setActiveLink("proposals");
      }
      else {
        toast.error("Failed to create DAO configruation proposal")
      }




    } catch (error) {

      console.error("Error during proposal submission:", error);

    }
  };
  const submitAddMember = async () => {


    const formattedInputData = {
      group_name: addMember.group_name,
      description: addMember.description,
      new_member: Principal.fromText(addMember.new_member),
    };

    try {
      const daoCanister = await createDaoActor(daoCanisterId);
      const response = await daoCanister.proposal_to_add_member_to_group(formattedInputData);
      console.log("Response from  add member proposal:", response);
      if (response.Ok) {
        toast.success("Add member proposal created successfully");
        movetodao();
        setActiveLink("proposals");
        setAddMember({
          group_name: "",
          description: "",
          new_member: "",
        });
      }
      else {
        toast.error("Failed to create Add Member proposal");
      }

    } catch (error) {
      console.error("Error during proposal submission:", error);

    }
  };

  useEffect(() => {

    const fetchGroupNames = async () => {

      const daoCanister = await createDaoActor(daoCanisterId);
      const daogroups = await daoCanister.get_dao_groups();
      const names = daogroups.map(group => group.group_name);
      setGropNames(names)
    };

    fetchGroupNames();
  }, []);
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
                      onChange={e => setProposalDescription(e.target.value)}
                      placeholder='Write here...'
                      className='w-full max-w-[800px] px-4 py-3 mb-4 border-opacity-30 border border-[#aba9a5] rounded-xl bg-transparent'
                      rows="10"
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

                    <option value="BountyDone">Bounty Done</option>

                    <option value="TokenTransfer">Token Transfer</option>

                    <option value="GeneralPurp">General Purpose</option>
                    <option value="DaoConfig">Dao Config</option>
                    <option value="AddMember">Add Member</option>
                  </select>
                </div>


                {/* Conditional Input Fields Based on Proposal Type */}
                {proposalType === 'TokenTransfer' && (
                  <>
                    <div className="mb-4">
                      <label>From</label>
                      <input
                        type="text"
                        name="from"
                        value={tokenTransfer.from}
                        onChange={handleInputTranferToken}
                        className="w-full px-4 py-3 border-opacity-30 border border-[#aba9a5] rounded-xl bg-transparent"
                        placeholder="Enter sender's principal"
                      />
                    </div>
                    <div className="mb-4">
                      <label>Description</label>
                      <input
                        type="text"
                        name="description"
                        value={tokenTransfer.description}
                        onChange={handleInputTranferToken}
                        className="w-full px-4 py-3 border-opacity-30 border border-[#aba9a5] rounded-xl bg-transparent"
                        placeholder="Enter description"
                      />
                    </div>
                    <div className="mb-4">
                      <label>Tokens</label>
                      <input
                        type="number"
                        name="tokens"
                        value={tokenTransfer.tokens}
                        onChange={handleInputTranferToken}
                        className="w-full px-4 py-3 border-opacity-30 border border-[#aba9a5] rounded-xl bg-transparent"
                        placeholder="Enter tokens"
                      />
                    </div>
                    <div className="mb-4">
                      <label>Action Member</label>
                      <input
                        type="text"
                        name="actionMember"
                        value={tokenTransfer.actionMember}
                        onChange={handleInputTranferToken}
                        className="w-full px-4 py-3 border-opacity-30 border border-[#aba9a5] rounded-xl bg-transparent"
                        placeholder="Enter action member principal"
                      />
                    </div>
                  </>
                )}

                {proposalType === 'BountyDone' && (
                  <>
                    <div className="mb-4">
                      <label>From</label>
                      <input
                        type="text"
                        name="from"
                        value={bountyDone.from}
                        onChange={handleInputBountyDone}
                        className="w-full px-4 py-3 border-opacity-30 border border-[#aba9a5] rounded-xl bg-transparent"
                        placeholder="Enter description"
                      />
                    </div>
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
                        name="bountTask"
                        value={bountyDone.bountTask}
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
                        type="date"
                        name="proposalExpiredAt"
                        value={bountyDone.proposalExpiredAt}
                        onChange={handleInputBountyDone}
                        className="w-full px-4 py-3 border-opacity-30 border border-[#aba9a5] rounded-xl bg-transparent"
                      />
                    </div>
                    <div className="mb-4">
                      <label>Proposal Created At</label>
                      <input
                        type="date"
                        name="proposalCreatedAt"
                        value={bountyDone.proposalCreatedAt}
                        onChange={handleInputBountyDone}
                        className="w-full px-4 py-3 border-opacity-30 border border-[#aba9a5] rounded-xl bg-transparent"
                      />
                    </div>
                  </>
                )}

                {proposalType === 'GeneralPurp' && (
                  <>
                    <div className="mb-4">
                      <label>Purpose Title</label>
                      <input
                        type="text"
                        name="purposeTitle"
                        value={generalPurp.purposeTitle}
                        onChange={handleInputGeneralPurp}
                        className="w-full px-4 py-3 border-opacity-30 border border-[#aba9a5] rounded-xl bg-transparent"
                        placeholder="Enter purpose title"
                      />
                    </div>
                    <div className="mb-4">
                      <label>Description</label>
                      <input
                        type="text"
                        name="description"
                        value={generalPurp.description}
                        onChange={handleInputGeneralPurp}
                        className="w-full px-4 py-3 border-opacity-30 border border-[#aba9a5] rounded-xl bg-transparent"
                        placeholder="Enter description"
                      />
                    </div>
                    <div className="mb-4">
                      <label>Action Member (Principal)</label>
                      <input
                        type="text"
                        name="actionMember"
                        value={generalPurp.actionMember}
                        onChange={handleInputGeneralPurp}
                        className="w-full px-4 py-3 border-opacity-30 border border-[#aba9a5] rounded-xl bg-transparent"
                        placeholder="Enter action member principal"
                      />
                    </div>
                    <div className="mb-4">
                      <label>Proposal Expired At</label>
                      <input
                        type="date"
                        name="proposalExpiredAt"
                        value={generalPurp.proposalExpiredAt}
                        onChange={handleInputGeneralPurp}
                        className="w-full px-4 py-3 border-opacity-30 border border-[#aba9a5] rounded-xl bg-transparent"
                      />
                    </div>
                    <div className="mb-4">
                      <label>Proposal Created At</label>
                      <input
                        type="date"
                        name="proposalCreatedAt"
                        value={generalPurp.proposalCreatedAt}
                        onChange={handleInputGeneralPurp}
                        className="w-full px-4 py-3 border-opacity-30 border border-[#aba9a5] rounded-xl bg-transparent"
                      />
                    </div>
                  </>
                )}

                {proposalType === 'DaoConfig' && (
                  <>
                    {/* DAO Name */}
                    <div className="mb-4">
                      <label htmlFor="new_dao_name" className="font-semibold mobile:text-base text-sm">
                        New DAO Name
                      </label>
                      <input
                        type="text"
                        id="new_dao_name"
                        name="new_dao_name"
                        required
                        value={changeData.new_dao_name}
                        placeholder="Enter New DAO Name"
                        className="rounded-lg mobile:p-3 p-2 mobile:text-base text-sm w-full border border-[#aba9a5] bg-transparent"
                        onChange={handleChange}
                      />
                    </div>

                    {/* Description */}
                    <div className="mb-4">
                      <label htmlFor="description" className="font-semibold mobile:text-base text-sm">
                        Description
                      </label>
                      <textarea
                        id="description"
                        name="description"
                        value={changeData.description}
                        placeholder="Specify the description of the DAO"
                        className="rounded-lg mobile:p-3 p-2 mobile:text-base text-sm w-full border border-[#aba9a5] bg-transparent"
                        onChange={handleChange}
                      />
                    </div>

                    {/* Action Member */}
                    <div className="mb-4">
                      <label htmlFor="action_member" className="font-semibold mobile:text-base text-sm">
                        Action Member (Principal)
                      </label>
                      <input
                        type="text"
                        id="action_member"
                        name="action_member"
                        value={changeData.action_member}
                        placeholder="Enter Action Member Principal ID"
                        className="rounded-lg mobile:p-3 p-2 mobile:text-base text-sm w-full border border-[#aba9a5] bg-transparent"
                        onChange={handleChange}
                      />
                    </div>






                  </>
                )}

                {proposalType === 'AddMember' && (
                  <>
                    {/* Group Name */}
                    <div className="mb-4">
                      <label htmlFor="group_name" className="font-semibold mobile:text-base text-sm">
                        Group Name
                      </label>
                      <select
                        name="group_name"
                        required
                        value={addMember.group_name}
                        className="rounded-lg mobile:p-3 p-2 mobile:text-base text-sm w-full border border-[#aba9a5] bg-transparent"
                        onChange={handleInputAddMember}
                      >
                        <option value="" disabled>Select Group Name</option>
                        {groupNames.map((name, index) => (
                          <option key={index} value={name}>
                            {name}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Description */}
                    <div className="mb-4">
                      <label htmlFor="description" className="font-semibold mobile:text-base text-sm">
                        Description
                      </label>
                      <textarea
                        name="description"
                        value={addMember.description}
                        placeholder="Specify the description of the group"
                        className="rounded-lg mobile:p-3 p-2 mobile:text-base text-sm w-full border border-[#aba9a5] bg-transparent"
                        onChange={handleInputAddMember}
                      />
                    </div>

                    {/* New Member (Principal ID) */}
                    <div className="mb-4">
                      <label htmlFor="new_member" className="font-semibold mobile:text-base text-sm">
                        New Member (Principal ID)
                      </label>
                      <input
                        type="text"
                        name="new_member"
                        value={addMember.new_member}
                        placeholder="Enter New Member Principal ID"
                        className="rounded-lg mobile:p-3 p-2 mobile:text-base text-sm w-full border border-[#aba9a5] bg-transparent"
                        onChange={handleInputAddMember}
                      />
                    </div>
                  </>
                )}




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
