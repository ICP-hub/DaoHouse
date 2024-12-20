import React, { useState, useEffect } from "react";
import proposals from "../../../assets/proposals.png";
import createProposalNew from "../../../assets/gif/createProposalNew.svg";
import Container from "../../Components/Container/Container";
import { useAuth } from "../../Components/utils/useAuthClient";
import toast from 'react-hot-toast';
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
import MintNewTokens from "./MintNewTokens";
import { FaInfoCircle } from "react-icons/fa";
import AddMemberToCouncil from "./AddMemberToCouncil";
import UpdateGroupsPermissions from "./UpdateGroupsPermissions";

function CreateProposal() {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loadingPayment, setLoadingPayment] = useState(false);
  const [proposalType, setProposalType] = useState('');
  const [group, setGroup] = useState('');
  const [dao, setDao] = useState(null);
  const [descriptionError, setDescriptionError] = useState("");
  const[principalError,setPrincipalError] = useState("");
  const [proposalEntry, setProposalEntry] = useState(''); 
  const [selectedPermissions, setSelectedPermissions] = useState({});
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
    daohouse_canister_id: '',
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

  const [addMemberToCouncil, setAddMemberToCouncil] = useState({
    description: "",
    new_member: "",
  });

  const [removeMember, setRemoveMember] = useState({
    group_name: "",
    description: "",
    action_member: "",
  });

  const [updateGroupsPermissions, setUpdateGroupsPermissions] = useState({
    group_name: "",
    description: "",
    updated_permissions: {}
  });

  const [bountyRaised, setBountyRaised] = useState({
    proposal_expired_at: '',
    description: '',
    tokens: '',
    proposal_created_at: '',
    bounty_task: '',
  });

  const [isPrivate, setIsPrivate] = useState(true);  
  const [showModal, setShowModal] = useState(false);
  const modalMessage = isPrivate
  ? "This action will make the DAO public, allowing anyone to join without creating a proposal. Are you sure you want to make it public?"
  : "This action will make the DAO private. A proposal will be created for users to join.";
  const confirmMakePrivate = () => {
    
    setIsPrivate(!isPrivate);
    setShowModal(false);

    window.scrollTo({
      top: document.body.scrollHeight,
      behavior: 'smooth',
    });
  };

  const [pollTitleError, setPollTitleError] = useState("");
  const [pollDescriptionError, setPollDescriptionError] = useState("");
  const [pollOptionError, setPollOptionError] = useState("");
  const [pollExpiryError, setPollExpiryError] = useState("");

  const cancelMakePrivate = () => {
    setShowModal(false);
    window.scrollTo({
      top: document.body.scrollHeight,
      behavior: 'smooth',
    });
  };


  const [changePolicy, setChangePolicy] = useState({
    description: '',
    cool_down_period: '',
    required_votes: '',
    ask_to_join_dao: true,
  });

  const [poll, setPoll] = useState({
    proposal_expired_at: "",
    poll_title: "",
    description: "",
    days_until_expiration : null,
    proposal_created_at: "",
    poll_options: []
  });

  const [removeDaoMember, setRemoveDaoMember] = useState({
    description: '',
    action_member: '',
  });

  const [mintNewTokens, setMintNewTokens] = useState({
    total_amount: '',
    description: '',
  });

  const [groupNames, setGroupNames] = useState([]);
  const [loading, setLoading] = useState(false);
  const { createDaoActor, stringPrincipal, identity } = useAuth();
  const { daoCanisterId } = useParams();

   const [daoNameError, setDaoNameError] = useState("");
  const [daoPurposeError, setDaoPurposeError] = useState("");


  const movetodao = () => {
    navigate(`/dao/profile/${daoCanisterId}`);
   
  };

  const fetchDaoDetails = async () => {
    if (daoCanisterId && identity) {
      try {
        const daoActor = await createDaoActor(daoCanisterId,{agentOptions: {identity,},});
        if (daoActor) {
          
          const daoGroups = await daoActor.get_dao_groups();
          
          const daoDetails = await daoActor.get_dao_detail();

          const groupPermissions = daoGroups.reduce((acc, group) => {
            acc[group.group_name] = group.group_permissions.map(
              (permission) => Object.keys(permission)[0]
            );
            return acc;
          }, {});
  
          setSelectedPermissions(groupPermissions); 
                  
          
          setDao(daoDetails);
          setIsPrivate(daoDetails.ask_to_join_dao);
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

  const handleInputUpdateGroupsPermissions = (e) => {
    const { name, value } = e.target;
    setUpdateGroupsPermissions((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  
  const handleInputMintNewTokens = (e) => {
    const { name, value } = e.target;
    setMintNewTokens((prevState) => ({
      ...prevState,
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

  const handleInputAddMemberToCouncil = (e) => {
    setAddMemberToCouncil({
      ...addMemberToCouncil,
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
    // Clear the error message when the user starts typing
    if (e.target.name === "description") {
        setDescriptionError(""); // Clear description error
    }
};


  const handleInputPoll = (e) => {
    const { name, value } = e.target;
    setPollTitleError("")
    setPollDescriptionError("")
    setPollExpiryError("")
    if (name === "proposal_expired_at") {
      const createdAtDate = new Date(poll.proposal_created_at); 
      const selectedExpiredDate = new Date(value);
      const differenceInDays = Math.floor((selectedExpiredDate - createdAtDate)
       / (1000 * 60 * 60 * 24));
       setPoll({
        ...poll,
        proposal_expired_at: value, 
        days_until_expiration: differenceInDays, 
      });
    }

    setPoll((prevPoll) => ({
        ...prevPoll,
        [name]: value,
    }));
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
    setDescriptionError(""); 
    setPollTitleError("");
    setPollDescriptionError("");
    setDaoNameError(""); 
    setDaoPurposeError(""); 

   
    setPrincipalError("");



    setPollOptionError("")
    setPollExpiryError("")

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
    if (proposalType === "DaoConfig") {
      if (!daoConfig.description) {
        setDescriptionError("Please fill out this field");
        setLoading(false);
        return;
      }
      if (!daoConfig.new_dao_name) {
        setDaoNameError("Please fill out this field");
        setLoading(false);
        return;
      }
      if (!daoConfig.purpose) {
        setDaoPurposeError("Please fill out this field");
        setLoading(false);
        return;
      }
    }

    if (proposalType === "DaoConfig" && !daoConfig.description) {
      setDescriptionError("Please fill out this field");
      setLoading(false);
      return;
    }

    if (proposalType === "RemoveDaoMember" && !removeDaoMember.description) {
      setDescriptionError("Please fill out this field");
      setLoading(false);
      return;

    }
    if (proposalType === "RemoveDaoMember" && !removeDaoMember.action_member) {
      setPrincipalError("Please fill out this field");
      setLoading(false);
      return;

    }

    if (proposalType === "ChangePolicy") {
      // Validate Change Policy fields
      if (changePolicy.description.trim() === "") {
        setDescriptionError("Please fill out this field Or Blank Space is not allowed");
        setLoading(false);
        return;
      }}

    if (proposalType === "Poll") {
      if (!poll.poll_title) {
        setPollTitleError("Poll Title is required.");
        setLoading(false);
        return;
      }
      if (!poll.description) {
        setPollDescriptionError("Poll Description is required.");
        setLoading(false);
        return;
      }
      if (!poll.poll_options) {
        setPollDescriptionError("Poll options are required.");
        setLoading(false);
        return;
      }
    }


 
    try {
      switch (proposalType) {
        case "tokenTransfer":
          setIsModalOpen(true)
          break;

        case "BountyRaised": 
          await submitBountyRaised({
            proposal_entry: proposalEntry,
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
            tokens: Number(bountyDone.tokens) ||1,
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
            description: daoConfig?.description,
            new_dao_name: daoConfig?.new_dao_name,
            purpose: daoConfig?.purpose,
          });
          break;

        case "AddMemberToCouncil":
        await submitAddMemberToCouncil({
          proposal_entry: proposalEntry,
          description: addMemberToCouncil.description,
          new_member: Principal.fromText(addMemberToCouncil.new_member),
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
            ask_to_join_dao : isPrivate,
            cool_down_period: Number(changePolicy.cool_down_period ),
            required_votes: Number(changePolicy.required_votes ),
          });
          break;

        case "Poll":
          await submitPoll({
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

        case "MintNewTokens":
          await submitMintNewTokens({
            total_amount: Number(mintNewTokens.total_amount),
            description: mintNewTokens.description,
            proposal_entry: proposalEntry,
          });
          break;

        case "UpdateGroupsPermissions":
          await submitUpdateGroupsPermissions({
            proposal_entry: proposalEntry,
            description: updateGroupsPermissions.description,
            updated_permissions: {
              group_name: updateGroupsPermissions.group_name,
              updated_permissions: (selectedPermissions[updateGroupsPermissions.group_name] || []).map(
                (permission) => ({ [permission]: null })
              ),
            },
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
      if (response?.Ok) {
        toast.success(response.Ok);
        movetodao();
      }else if (response?.Err){
        toast.error(response?.Err);
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
      if(response.Ok) {
        toast.success(response.Ok);
        movetodao();
      } else {
        toast.error(response.Err)
      }
    } catch (error) {
      console.error("Error submitting General Purpose proposal:", error);
      toast.error(error.message);
    }
  };

  const submitDaoConfig = async (daoConfig) => {
    try {
      const daoCanister = await createDaoActor(daoCanisterId);
      const response = await daoCanister.proposal_to_change_dao_config(
        daoConfig
      );
      if (response.Ok) {
        toast.success(response.Ok);
        movetodao();
      }
      else {
        toast.error(response.Err);
      }
    } catch (error) {
      console.error("Error during DAO Config proposal submission:", error);
      toast.error(error.message);
    }
  };

  const submitBountyRaised = async (bountyRaised) => {
    
    try {
      const daoCanister = await createDaoActor(daoCanisterId);
      const response = await daoCanister.proposal_to_bounty_raised(bountyRaised);
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

  const submitAddMemberToCouncil = async (addMemberToCouncilData) => {
    try {
      const daoCanister = await createDaoActor(daoCanisterId);


      const response = await daoCanister.proposal_to_add_member_to_council(addMemberToCouncilData);

      if (response.Ok) {
        toast.success(response.Ok);
        movetodao();
     
        setAddMemberToCouncil({
          description: "",
          new_member: "",
        });
      } else {
        toast.error(response.Err);
      }
    } catch (error) {
      console.error("Error during Add Member proposal submission:", error);
      toast.error(error.message);
    }
  };

  const submitAddMember = async (addMemberData) => {
    try {
      const daoCanister = await createDaoActor(daoCanisterId);


      const response = await daoCanister.proposal_to_add_member_to_group(addMemberData);

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
      setPollOptionError("At least 2 Poll options are required.");
      return;
    }
  

    if (poll.poll_options.length > 4) {
      setPollOptionError("You cannot add more than four poll options.");
      return;
    }

    if(poll.proposal_expired_at ==( null || undefined)){
      setPollExpiryError("Select Expiry time of proposal")
      return;
    }
  
    try {
      const daoCanister = await createDaoActor(daoCanisterId);
      const response = await daoCanister.proposal_to_create_poll(poll);
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
       if (response.Ok) {
        toast.success(response.Ok);
        movetodao();
      } else {
        toast.error(response.Err);
      }
    } catch (error) {
      console.error("Error submitting Remove DAO Member proposal:", error);
      toast.error("Failed to create Remove DAO Member proposal");
    }
  };

  const submitMintNewTokens = async (mintNewTokensData) => {
    try {
      const daoCanister = await createDaoActor(daoCanisterId);
      const response = await daoCanister.proposal_to_mint_new_dao_tokens(mintNewTokensData);
      if (response.Ok) {
        toast.success(response.Ok);
        movetodao();
      } else {
        toast.error(response.Err);
      }
    } catch (error) {
      console.error("Error submitting Mint New Tokens proposal:", error);
      toast.error("Failed to create Mint New Tokens proposal");
    }
  };

  const submitUpdateGroupsPermissions = async (updateGroupsPermissionsData) => {
    try {
      const { updated_permissions } = updateGroupsPermissionsData;
      
  
      if (
        !updated_permissions ||
        !updated_permissions.group_name ||
        !Array.isArray(updated_permissions.updated_permissions) ||
        updated_permissions.updated_permissions.some(
          (perm) => typeof perm !== "object" || perm === null
        )
      ) {
        throw new Error("Invalid updated_permissions structure in the payload.");
      }
  
      const daoCanister = await createDaoActor(daoCanisterId);
  
      const response = await daoCanister.api_to_update_permission_groups(updateGroupsPermissionsData);
  
      if (response.Ok) {
        toast.success(response.Ok);
        movetodao();
  
        setUpdateGroupsPermissions({
          group_name: "",
          description: "",
          updated_permissions: {},
        });
      } else {
        toast.error(response.Err);
      }
    } catch (error) {
      console.error("Error during update permissions proposal submission:", error);
      toast.error("Failed to create update permissions proposal");
    }
  };
    
  useEffect(() => {
    if (showModal) {
      document.body.classList.add('overflow-hidden');
    } else {
      document.body.classList.remove('overflow-hidden');
    }

    return () => {
      document.body.classList.remove('overflow-hidden');
    };
  }, [showModal]);

  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      body.overflow-hidden {
        overflow: hidden;
        position: fixed;
        width: 100%;
        height: 100%;
      }
    `;
    document.head.append(style);
    return () => style.remove();
  }, []);
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
                      <option value="AddMemberToCouncil">Add Member To Council</option>
                      <option value="AddMember">Add Member in Group</option>
                      <option value="RemoveMember">
                        Remove Member from Group
                      </option>
                      <option value="BountyRaised">Bounty Raised</option>
                      <option value="ChangePolicy">Change Dao Policy</option>
                      <option value="Poll">Polls</option>
                      <option value="RemoveDaoMember">
                        Remove Member From Council
                      </option>
                      <option value="MintNewTokens">
                        Mint New Tokens
                      </option>
                      <option value="UpdateGroupsPermissions">
                        Update Groups Permissions
                      </option>
                    </select>
                  </div>

                  {/* Proposal Entry Select */}
                  <div className="mb-6 max-w-full relative overflow-x-hidden">
                    <div className="flex items-center space-x-2">
                      <label className="block mb-2 font-semibold text-xl">
                        Proposal Entry
                        
                      </label>
                    <div className="relative group">
                      <FaInfoCircle className="text-gray-500 cursor-pointer mb-1" />
                      
                      <div className="absolute left-full top-1/2 transform -translate-y-1/2 ml-2 opacity-0 group-hover:opacity-100 bg-gray-700 text-white text-sm rounded-lg py-2 px-4 w-max">
                        <div className="absolute left-[-6px] top-1/2 transform -translate-y-1/2 w-0 h-0 border-l-[6px] border-r-[6px] border-t-[6px] border-t-gray-700 border-l-transparent border-r-transparent"></div>
                        The creator of this proposal has provided valuable insights for the community.
                      </div>
                    </div>

                  </div>

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
                     dao={dao}
                     setDaoConfig={setDaoConfig}
                     errorMessage={descriptionError}
                     errors={{ new_dao_name: daoNameError, purpose: daoPurposeError }} // Pass errors
                     setDescriptionError={setDescriptionError}
                     setDaoNameError={setDaoNameError} // Pass the function to clear the DAO Name error
                     setDaoPurposeError={setDaoPurposeError} // Pass the function to clear the DAO Purpose error
                   />
                  )}

                  {proposalType === "AddMemberToCouncil" && (
                    <AddMemberToCouncil
                      addMemberToCouncil={addMemberToCouncil}
                      handleInputAddMemberToCouncil={handleInputAddMemberToCouncil}
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
                      setShowModal={setShowModal}
                      isPrivate={isPrivate}
                      cancelMakePrivate={cancelMakePrivate}
                      confirmMakePrivate={confirmMakePrivate}
                      modalMessage={modalMessage}
                      showModal={showModal}
                      errorMessage={descriptionError}
                      setChangePolicy={setChangePolicy}
                    />
                  )}

                  {proposalType === "Poll" && (
                    <Poll
                      poll={poll}
                      setPoll={setPoll}
                      handleInputPoll={handleInputPoll}
                      pollTitleError={pollTitleError} // Pass error state
                      pollDescriptionError={pollDescriptionError} // Pass error state
                      pollOptionError={pollOptionError}
                      setPollOptionError={setPollOptionError}
                      pollExpiryError={pollExpiryError}
                    />
                  )}

                  {proposalType === "RemoveDaoMember" && (
                    <RemoveDaoMember
                      removeDaoMember={removeDaoMember}
                      handleInputRemoveDaoMember={handleInputRemoveDaoMember}
                      descriptionError={descriptionError}
                      principalError={principalError}
                      setDescriptionError={setDescriptionError}
                      setPrincipalError={setPrincipalError}
                    />
                  )}

                 {proposalType === "MintNewTokens" && (
                <MintNewTokens
                mintTokenData={mintNewTokens}  // Updated prop name
                 handleInputMintToken={handleInputMintNewTokens}
                />
                 )}

                  {proposalType === "UpdateGroupsPermissions" && (
                    <UpdateGroupsPermissions
                      updateGroupsPermissions={updateGroupsPermissions}
                      handleInputUpdateGroupsPermissions={handleInputUpdateGroupsPermissions}
                      groupNames={groupNames}
                      dao={dao}
                      selectedPermissions={selectedPermissions}
                      setSelectedPermissions={setSelectedPermissions}
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
