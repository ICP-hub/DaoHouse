import React, { useState, useEffect } from "react";
import proposals from "../../../assets/proposals.png";
import createProposalNew from "../../../assets/gif/createProposalNew.svg";
import Container from "../../Components/Container/Container";
import { useAuth } from "../../Components/utils/useAuthClient";
import { toast } from "react-toastify";
import { CircularProgress } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { Principal } from "@dfinity/principal";
import BountyDone from "./BountyDone";
import TokenTransfer from "./TokenTransfer";
import GeneralPurpose from "./GeneralPurpose";
import DaoConfig from "./DaoConfig";
import AddMember from "./AddMember";
import RemoveMember from "./RemoveMember";
import BountyRaised from "./BountyRaised";
import DaoPolicy from "./DaoPolicy";
import Poll from "./Poll";
import RemoveDaoMember from "./RemoveDaoMember";
import { createActor } from "../../../../declarations/icp_ledger_canister";
import TokenPaymentModal from "./TokenPaymentModal";
function CreateProposal() {

  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loadingPayment, setLoadingPayment] = useState(false);
  const [proposalType, setProposalType] = useState('');
  const [dao, setDao] = useState(null);
  const [proposalEntry, setProposalEntry] = useState(''); 
  const [tokenTransfer, setTokenTransfer] = useState({
    to: '',
    description: '',
    tokens: '',
  });

  const [bountyDone, setBountyDone] = useState({
    associated_proposal_id: '',
    description: '',
    link_of_task: '',
    bounty_task: '',
    daohouse_canister_id: ''
  });

  const [generalPurp, setGeneralPurp] = useState({
    description: '',
    proposalTitle: '',
  });

  const [daoConfig, setDaoConfig] = useState({
    description: '',
    new_dao_name: '',
    purpose: '',
  });

  const [addMember, setAddMember] = useState({
    group_name: "",
    description: "",
    new_member: "",
  });

  const [removeMember, setRemoveMember] = useState({
    group_name: "",
    description: "",
    action_member: "",
  });

  const [bountyRaised, setBountyRaised] = useState({
    proposal_expired_at: '',
    description: '',
    tokens: '',
    proposal_created_at: '',
    bounty_task: '',
  });

  const [changePolicy, setChangePolicy] = useState({
    description: '',
    cool_down_period: '',
    required_votes: '',
  });

  const [poll, setPoll] = useState({
    proposal_expired_at: "",
    poll_title: "",
    description: "",
    proposal_created_at: "",
    poll_options: []
  });

  const [removeDaoMember, setRemoveDaoMember] = useState({
    description: '',
    action_member: '',
  });

  const [groupNames, setGroupNames] = useState([]);
  const [loading, setLoading] = useState(false);
  const { createDaoActor, stringPrincipal, identity } = useAuth();
  const { daoCanisterId } = useParams();

  const movetodao = () => {
    navigate(`/dao/profile/${daoCanisterId}`);
   
  };

  const fetchDaoDetails = async () => {
    if (daoCanisterId && identity) {
      try {
        const daoActor = await createDaoActor(daoCanisterId,{agentOptions: {identity,},});
        if (daoActor) {
          const daoDetails = await daoActor.get_dao_detail();
          setDao(daoDetails);
          console.log(daoDetails);
          
          const names = daoDetails.proposal_entry.filter((group) => group.place_name !== "Council").map((group) => group.place_name );
          setGroupNames(names);
        }
      } catch (error) {
        console.error("Error fetching DAO details:", error);
      }
    } else {
      console.error("daoCanisterId or identity is not available");
    }
  };
  
  useEffect(() => {
    fetchDaoDetails();
  }, [daoCanisterId, identity]);

  const className = "CreateProposals";

  const handleProposalTypeChange = (event) => {
    setProposalType(event.target.value);
  };

  const handleInputTransferToken = (e) => {
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

    if (name === "proposalExpiredAt") {
      const createdAtDate = new Date(generalPurp.proposalCreatedAt); 
      const selectedExpiredDate = new Date(value); 

     
      const differenceInDays = Math.floor(
        (selectedExpiredDate - createdAtDate) / (1000 * 60 * 60 * 24)
      );

      
      setGeneralPurp({
        ...generalPurp,
        proposalExpiredAt: value, 
        days_until_expiration: differenceInDays,
      });
    } else {
      setGeneralPurp({
        ...generalPurp,
        [name]: value,
      });
    }
  };

  const handleInputDaoConfig = (e) => {
    setDaoConfig({
      ...daoConfig,
      [e.target.name]: e.target.value,
    });
  };

  const handleInputAddMember = (e) => {
    setAddMember({
      ...addMember,
      [e.target.name]: e.target.value,
    });
  };

  const handleInputRemoveMember = (e) => {
    setRemoveMember({
      ...removeMember,
      [e.target.name]: e.target.value,
    });
  };

  const handleInputBountyRaised = (e) => {
    const { name, value } = e.target;

    if (name === "proposal_expired_at") {
      const today = new Date().getTime(); 
      const selectedDate = new Date(value).getTime();

 
      const differenceInDays = Math.ceil(
        (selectedDate - today) / (1000 * 60 * 60 * 24)
      );

      setBountyRaised({
        ...bountyRaised,
        proposal_expired_at: value,
        proposal_expired_in_days: differenceInDays,  
      });

    } else {
      setBountyRaised({
        ...bountyRaised,
        [name]: value,
      });

    }
  };

  const handleInputDaoPolicy = (e) => {
    setChangePolicy({
      ...changePolicy,
      [e.target.name]: e.target.value,
    });
  };

  const handleInputPoll = (e) => {
    const { name, value } = e.target;

    if (name === "proposal_expired_at") {
      const createdAtDate = new Date(poll.proposal_created_at); 
      const selectedExpiredDate = new Date(value);

      // Calculate the difference in days between the created at date and the selected expired at date
      const differenceInDays = Math.floor(
        (selectedExpiredDate - createdAtDate) / (1000 * 60 * 60 * 24)
      );

      // Store both the selected date (for frontend display) and the difference in days for the backend
      setPoll({
        ...poll,
        proposal_expired_at: value, 
        days_until_expiration: differenceInDays, 
      });

    } else {
      setPoll({
        ...poll,
        [name]: value,
      });

    }
  };

  const handleInputRemoveDaoMember = (e) => {
    setRemoveDaoMember({
      ...removeDaoMember,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Basic validation
    if (!proposalType) {
      toast.error("Please select a proposal type.");
      setLoading(false);
      return;
    }

    if (!proposalEntry) {
      toast.error("Please select a proposal entry.");
      setLoading(false);
      return;
    }

    try {
      switch (proposalType) {
        case "tokenTransfer":
          setIsModalOpen(true)
          break;

        case "BountyRaised": 
          await submitBountyRaised({
            proposal_entry: proposalEntry,
            task_completion_day: Number(bountyRaised.task_completion_day) || 1, 
            description: bountyRaised.description,
            tokens: Number(bountyRaised.tokens) || 1,
            
            bounty_task: bountyRaised.bounty_task,
          });
          break;

        case "bountyDone":
          await submitBountyDone({
            proposal_entry: proposalEntry,
            associated_proposal_id: bountyDone.associated_proposal_id,
            description: bountyDone.description,
            tokens: Number(bountyDone.tokens) || 1,
          });
          break;

        case 'GeneralPurp':
          await submitGeneralPurp({
            proposal_entry: proposalEntry,
       
            description: generalPurp.description,
      
            proposal_title: generalPurp.proposalTitle,
           
          });
          break;

        case "DaoConfig":
          await submitDaoConfig({
            proposal_entry: proposalEntry,
            description: daoConfig.description,
            new_dao_name: daoConfig.new_dao_name,
            purpose: daoConfig.purpose,
          });
          break;

        case "AddMember":
          await submitAddMember({
            proposal_entry: proposalEntry,
            group_name: addMember.group_name,
            description: addMember.description,
            new_member: Principal.fromText(addMember.new_member),
          });
          break;

        case 'RemoveMember':
          await submitRemoveMember({
            proposal_entry: proposalEntry,
            group_name: removeMember.group_name,
            description: removeMember.description,
            action_member: Principal.fromText(removeMember.action_member),
          });
          break;

        case 'ChangePolicy':
          await submitChangePolicy({
            proposal_entry: proposalEntry,
            description: changePolicy.description,
            
            cool_down_period: Number(changePolicy.cool_down_period) || 1,
            required_votes: Number(changePolicy.required_votes) || 1,
          });
          break;

        case "Poll":
          await submitPoll({
            poll_title: "sdcfsdfs",
            proposal_entry: proposalEntry,
            proposal_expired_at: poll.days_until_expiration, 
            poll_query: poll.poll_title,
            description: poll.description,
            poll_options: poll.poll_options.map(option => option.option),
          });

          break;

        case 'RemoveDaoMember':
          await submitRemoveDaoMember({
            proposal_entry: proposalEntry,
            description: removeDaoMember.description,
            action_member: Principal.fromText(removeDaoMember.action_member),
          });
          break;

        default:
          toast.error(
            "Please select a valid proposal type and fill in the details."
          );
      }
    } catch (error) {
      console.error("Submission error:", error);
      toast.error("Failed to submit the proposal. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const submitTokenTransferProposal = async (tokenTransfer) => {
    try {
      const actor = await createTokenActor(dao.token_ledger_id.id);
      const { metadata, balance } = await fetchMetadataAndBalance(actor, Principal.fromText(stringPrincipal));
      const currentBalance = parseInt(balance, 10);
      const formattedMetadata = await formatTokenMetaData(metadata);
      let response = await transferApprove(currentBalance,actor,formattedMetadata,tokenTransfer.tokens);
      console.log("res", response);
      
      if (response.Ok) {
        toast.success(response.Ok);
        movetodao();
      }else{
        toast.error(response.Err);
      }
    } catch (err) {
      console.error("Error submitting Token Transfer proposal:", err);
      toast.error(err.message);
    }
  };

  const submitBountyDone = async (bountyDone) => {
    try {
      const daoCanister = await createDaoActor(daoCanisterId);
   

      const response = await daoCanister.proposal_to_bounty_done(bountyDone);
      console.log("Response of Bounty Done:", response);
      if(response.Ok){
        toast.success(response.Ok);
        movetodao();
      } else {
        toast.error(response.Err)
      }
    } catch (error) {
      console.error("Error submitting Bounty Done proposal:", error);
      toast.error("Failed to create Bounty Done proposal");
    }
  };

  const submitGeneralPurp = async (generalPurp) => {
    try {
      const daoCanister = await createDaoActor(daoCanisterId);
      const response = await daoCanister.proposal_to_create_general_purpose(generalPurp);
      console.log("Response of General Purpose:", response);

      if(response.Ok) {
        toast.success(response.Ok);
        movetodao();
      } else {
        toast.error(response.Err)
      }
    } catch (error) {
      console.error("Error submitting General Purpose proposal:", error);
      toast.error("Failed to create General Purpose proposal");
    }
  };

  const submitDaoConfig = async (daoConfig) => {
    try {
      const daoCanister = await createDaoActor(daoCanisterId);
      const response = await daoCanister.proposal_to_change_dao_config(
        daoConfig
      );
      console.log("Response from DAO Config Proposal:", response);

      if (response.Ok) {
        toast.success(response.Ok);
        movetodao();
      }
      else {
        toast.error(response.Err);
      }
    } catch (error) {
      console.error("Error during DAO Config proposal submission:", error);
      toast.error("Failed to create DAO configuration proposal");
    }
  };

  const submitBountyRaised = async (bountyRaised) => {
    try {
      const daoCanister = await createDaoActor(daoCanisterId);
      const response = await daoCanister.proposal_to_bounty_raised(bountyRaised);
      console.log("Response of Bounty Raised:", response);
      if(response.Ok){
        toast.success(response.Ok);
        movetodao();
      } else {
        toast.error(response.Err)
      }
    } catch (error) {
      console.error("Error submitting Bounty Raised proposal:", error);
      toast.error(error.message);
    }
  };

  const submitAddMember = async (addMemberData) => {
    try {
      const daoCanister = await createDaoActor(daoCanisterId);


      const response = await daoCanister.proposal_to_add_member_to_group(addMemberData);
      console.log("Response from Add Member Proposal:", response);

      if (response.Ok) {
        toast.success(response.Ok);
        movetodao();
     
        setAddMember({
          group_name: "",
          description: "",
          new_member: "",
        });
      } else {
        toast.error(response.Err);
      }
    } catch (error) {
      console.error("Error during Add Member proposal submission:", error);
      toast.error("Failed to create Add Member proposal");
    }
  };

  const submitRemoveMember = async (removeMemberData) => {
    try {
      const daoCanister = await createDaoActor(daoCanisterId);


      const response = await daoCanister.proposal_to_remove_member_to_group(removeMemberData);
      console.log("Response from Remove Member Proposal:", response);

      if (response.Ok) {
        toast.success(response.Ok);
        movetodao();

        setRemoveMember({
          group_name: "",
          description: "",
          action_member: "",
        });
      }
      else {
        toast.error(response.Err);
      }
    } catch (error) {
      console.error("Error during proposal submission:", error);
    }
  };

  const createTokenActor = async () => {
    const tokenActorrr = createActor(dao.token_ledger_id.id, { agentOptions: { identity } });
    return tokenActorrr;
  };

  const formatTokenMetaData = async (arr) => {
    const resultObject = {};
    arr.forEach((item) => {
      const key = item[0];
      const value = item[1][Object.keys(item[1])[0]];
      resultObject[key] = value;
    });
    return resultObject;
  };

  const fetchMetadataAndBalance = async (tokenActor, stringPrincipal) => {
    try {
      const [metadata, balance] = await Promise.all([
        tokenActor.icrc1_metadata(),
        tokenActor.icrc1_balance_of({
          owner: stringPrincipal,
          subaccount: [],
        }),
      ]);
      console.log("Metadata and balance fetched:", { metadata, balance });
      
      return { metadata, balance };
    } catch (err) {
      console.error("Error fetching metadata and balance:", err);
      throw err;
    }
  };

  const afterPaymentApprove = async (sendableAmount) => {
    try {      
      const daoCanister = await createDaoActor(daoCanisterId);
      const res =
      await daoCanister.make_payment(sendableAmount,Principal.fromText(stringPrincipal));
      if (res.Ok) {
        console.log("response hai : ");
        let tokenTransferPayload = {
          to: Principal.fromText(tokenTransfer.to),
          description: tokenTransfer.description,
          tokens: Number(tokenTransfer.tokens),
          proposal_entry: proposalEntry,
        };
        const daoCanister = await createDaoActor(daoCanisterId);
        const response = await daoCanister.proposal_to_transfer_token(tokenTransferPayload);
        return response;
      } else {
        toast.error(res.Err);
      }
    } catch (err) {
      console.error("Error in transfer approve", err);
    }
  };

  const transferApprove = async (
    currentBalance,
    tokenActor,
    currentMetaData,
    tokens,
  ) => {
    try {
      console.log("Curr Balance", currentBalance);
      const sendableAmount = parseInt(tokens);
      if (currentBalance >= sendableAmount) {
        let transaction = {
          from_subaccount: [],
          spender: {
            owner: Principal.fromText(daoCanisterId),
            subaccount: [],
          },
          amount: Number(sendableAmount) + Number(currentMetaData["icrc1:fee"]),
          expected_allowance: [],
          expires_at: [],
          fee: [currentMetaData["icrc1:fee"]],
          memo: [],
          created_at_time: [],
        };
        const approveRes = await tokenActor.icrc2_approve(transaction);        
        if (approveRes.Err) {
          const errorMessage = `Insufficient funds. Balance: ${approveRes.Err.InsufficientFunds.balance}`;
          toast.error(errorMessage);
          return;
        } else {
         return await afterPaymentApprove(sendableAmount);
        }
      } else {
        toast.error(
          `Insufficient balance. Balance : ${currentBalance / 10 ** 8}`
        );
      }
    } catch (err) {
      console.error("Error in transfer approve", err);
    }
  };

  const handleConfirmPayment = async () => {
    setLoadingPayment(true); 
    try {
       if (proposalType === "tokenTransfer") {
        await submitTokenTransferProposal({
          to: Principal.fromText(tokenTransfer.to),
          description: tokenTransfer.description,
          tokens: Number(tokenTransfer.tokens),
          proposal_entry: proposalEntry,
        });
      }

    } catch (error) {
      console.error("Payment submission failed:", error);
      toast.error(error);
      setIsModalOpen(false);
    } finally {
      setLoadingPayment(false);

    }
  };

  const handleCancelPayment = () => {
    setIsModalOpen(false);
  };

  const submitChangePolicy = async (changePolicy) => {
    try {
      const daoCanister = await createDaoActor(daoCanisterId);
      const response = await daoCanister.proposal_to_change_dao_policy(changePolicy);
      if(response.Ok) {
        toast.success(response.Ok);
        movetodao();
      } else {
        toast.error(response.Err)
      }
    } catch (error) {
      console.error("Error submitting Change Policy proposal:", error);
      toast.error("Failed to create Change DAO Policy proposal");
    }
  };

  const submitPoll = async (poll) => {

    if (!poll.poll_options || poll.poll_options.length < 2) {
      toast.error("Please add at least two poll options before submitting.");
      return;
    }
  

    if (poll.poll_options.length > 4) {
      toast.error("You cannot add more than four poll options.");
      return;
    }
  
    try {
      const daoCanister = await createDaoActor(daoCanisterId);
     
  
      const response = await daoCanister.proposal_to_create_poll(poll);
      console.log("Response of Poll Proposal:", response);
  
      if (response.Ok) {
        toast.success(response.Ok);
        movetodao();
      } else {
        toast.error(response.Err);
      }
    } catch (error) {
      console.error("Error submitting Poll proposal:", error);
      toast.error("Failed to create Poll proposal");
    }
  };
  

  const submitRemoveDaoMember = async (removeDaoMember) => {
   

    try {
      const daoCanister = await createDaoActor(daoCanisterId);


      const response = await daoCanister.proposal_to_remove_member_to_dao(removeDaoMember);
      console.log("Response of Remove DAO Member:", response);

      toast.success("Remove DAO Member proposal created successfully");
      movetodao();
    } catch (error) {
      console.error("Error submitting Remove DAO Member proposal:", error);
      toast.error("Failed to create Remove DAO Member proposal");
    }
  };

  return (
    <div className="bg-zinc-200 w-full">
      <div
        style={{
          backgroundImage: `url("${proposals}")`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <Container
          classes={`${className}__filter w-full h-[25vh] p-20 flex flex-col items-start justify-center`}
        >
          <h1 className="text-[40px] p-2 text-white border-b-2 border-white">
            Proposals
          </h1>
        </Container>
      </div>
      <TokenPaymentModal
        isOpen={isModalOpen}
        onClose={handleCancelPayment}
        onConfirm={handleConfirmPayment}
        loadingPayment={loadingPayment}
        bountyRaised={bountyRaised}
        tokenTransfer={tokenTransfer}/>


      <div className="bg-[#F5F5F5]">
        <Container
          classes={`${className}__label relative py-8 px-10 flex gap-2 flex-col w-full justify-between items-center`}
        >
          <p className="md:text-[40px] text-[30px] text-black px-8 mr-auto flex flex-row justify-start items-center gap-4 ">
            Create Proposal
            <div className="flex flex-col items-start">
              <div className="w-32 border-t-2 border-black"></div>
              <div className="w-14 mt-2 border-t-2 border-black"></div>
            </div>
          </p>
          <div className=" bg-[#F4F2EC] p-6 m-6 rounded-lg shadow w-full ">
            <form onSubmit={handleSubmit}> {/* Wrap with form for better semantics */}
              <div className='flex justify-start gap-6 rounded-md p-4'>
                <div className='flex flex-col w-[800px]'>

                  {/* Proposal Type Select */}
                  <div className="mb-6 max-w-full relative overflow-x-hidden">
                    <label className="block mb-2 font-semibold text-xl">
                      Proposal Type
                    </label>
                    <select
                      value={proposalType}
                      onChange={handleProposalTypeChange}
                      className="w-full max-w-full px-4 py-3 mb-4 border-opacity-30 border border-[#aba9a5] rounded-xl bg-transparent overflow-x-auto"
                      required // Make it a required field
                    >
                      <option value="">Select Proposal Type</option>
                      <option value="bountyDone">Bounty Done</option>
                      <option value="tokenTransfer">Token Transfer</option>
                      <option value="GeneralPurp">General Purpose</option>
                      <option value="DaoConfig">Dao Config</option>
                      <option value="AddMember">Add Member in Group</option>
                      <option value="RemoveMember">
                        Remove Member from Group
                      </option>
                      <option value="BountyRaised">Bounty Raised</option>
                      <option value="ChangePolicy">Change Dao Policy</option>
                      <option value="Poll">Polls</option>
                      <option value="RemoveDaoMember">
                        RemoveMemberToDaoProposal
                      </option>
                    </select>
                  </div>

                  {/* Proposal Entry Select */}
                  <div className="mb-6 max-w-full relative overflow-x-hidden">
                    <label className="block mb-2 font-semibold text-xl">
                      Proposal Entry
                    </label>
                    <select
                      value={proposalEntry}
                      onChange={(e) => setProposalEntry(e.target.value)}
                      className="w-full max-w-[800px] px-4 py-3 mb-4 border-opacity-30 border border-[#aba9a5] rounded-xl bg-transparent"
                      required // Make it a required field
                    >
                      <option value="">Select Proposal Entry</option>
                      {dao &&
                        dao.proposal_entry &&
                        dao.proposal_entry.length > 0 ? (
                        dao.proposal_entry.map((entry, index) => (
                          <option key={index} value={entry.place_name}>
                            {entry.place_name}
                          </option>
                        ))
                      ) : (
                        <option disabled>No Proposal Entries Available</option>
                      )}
                    </select>
                  </div>

                  {/* Conditional Input Fields Based on Proposal Type */}
                  {proposalType === "bountyDone" && (
                    <BountyDone
                      bountyDone={bountyDone}
                      handleInputBountyDone={handleInputBountyDone}
                      dao={dao}
                    />
                  )}

                  {proposalType === "tokenTransfer" && (
                    <TokenTransfer
                      tokenTransfer={tokenTransfer}
                      handleInputTransferToken={handleInputTransferToken}
                      dao={dao}
                    />
                  )}

                  {proposalType === "GeneralPurp" && (
                    <GeneralPurpose
                      generalPurp={generalPurp}
                      setGeneralPurp={setGeneralPurp}
                      handleInputGeneralPurp={handleInputGeneralPurp}
                    />
                  )}

                  {proposalType === "DaoConfig" && (
                    <DaoConfig
                      daoConfig={daoConfig}
                      handleInputDaoConfig={handleInputDaoConfig}
                    />
                  )}

                  {proposalType === "AddMember" && (
                    <AddMember
                      addMember={addMember}
                      handleInputAddMember={handleInputAddMember}
                      groupNames={groupNames}
                    />
                  )}

                  {proposalType === "RemoveMember" && (
                    <RemoveMember
                      removeMember={removeMember}
                      handleInputRemoveMember={handleInputRemoveMember}
                      groupNames={groupNames}
                    />
                  )}

                  {proposalType === "BountyRaised" && (
                    <BountyRaised
                      bountyRaised={bountyRaised}
                      handleInputBountyRaised={handleInputBountyRaised}
                      setBountyRaised={setBountyRaised}
                      dao={dao}
                    />
                  )}

                  {proposalType === "ChangePolicy" && (
                    <DaoPolicy
                      changePolicy={changePolicy}
                      handleInputDaoPolicy={handleInputDaoPolicy}
                      dao={dao}
                    />
                  )}

                  {proposalType === "Poll" && (
                    <Poll
                      poll={poll}
                      setPoll={setPoll}
                      handleInputPoll={handleInputPoll}
                    />
                  )}

                  {proposalType === "RemoveDaoMember" && (
                    <RemoveDaoMember
                      removeDaoMember={removeDaoMember}
                      handleInputRemoveDaoMember={handleInputRemoveDaoMember}
                    />
                  )}

                  {/* Submit Button */}
                  <div className="flex justify-center my-8  ">
                    <button
                      className="relative bg-[#0E3746] w-[100px] h-[40px]  text-white font-normal text-center rounded-full text-[16px] py-2 px-6 focus:outline-none focus:shadow-outline"
                      type="submit"
                      disabled={loading } 
                    >
                      {loading ? (
                        // <CircularProgress size={24} />
                        <div className="absolute inset-0 flex justify-center items-center">
                        <div className="w-6 h-6 border-2 border-t-transparent border-white rounded-full animate-spin"></div>
                      </div>
                      ) : (
                        "Submit"
                      )}
                    </button>
                  </div>
                </div>

                <div className="md:flex self-start hidden">
                  <img
                    src={createProposalNew}
                    alt="Illustration"
                    className="w-[350px] h-[350px]"
                  />
                </div>
              </div>
            </form>
          </div>
        </Container>
      </div>
    </div>
  );
}

export default CreateProposal;
