import React, { useState, useEffect } from "react";
import proposals from "../../../assets/proposals.png";
import createProposalNew from "../../../assets/createProposalNew.png";
import Container from "../../Components/Container/Container";
import { useAuth } from "../../Components/utils/useAuthClient";
import { toast } from "react-toastify";
import { CircularProgress } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { Principal } from "@dfinity/principal";
import BountyClaim from "./BountyClaim";
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
function CreateProposal() {
  const navigate = useNavigate();

  const [proposalTitle, setProposalTitle] = useState('');
  const [proposalDescription, setProposalDescription] = useState('');
  const [requiredVotes, setRequiredVotes] = useState('');
  const [proposalType, setProposalType] = useState('');
  const [dao, setDao] = useState(null);
  const [proposalEntry, setProposalEntry] = useState(''); // New state for proposal_entiry

  const [tokenTransfer, setTokenTransfer] = useState({
    to: '',
    description: '',
    tokens: '',
    // action_member: '',
  });

  const [bountyClaim, setBountyClaim] = useState({
    associated_proposal_id: '',
    description: '',
    link_of_task: '',
    // action_member: '',
    bounty_task: '',
  });

  const [generalPurp, setGeneralPurp] = useState({
    // proposalExpiredAt: '',
    description: '',
    // actionMember: '',
    proposalTitle: '',
    // proposalCreatedAt: '',
  });

  const [daoConfig, setDaoConfig] = useState({
    daotype: '',
    description: '',
    new_dao_name: '',
    // action_member: '',
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
    // action_member: '',
    proposal_created_at: '',
    bounty_task: '',
  });

  const [changePolicy, setChangePolicy] = useState({
    description: '',
    // action_member: '',
    cool_down_period: '',
    required_votes: '',
  });

  const [poll, setPoll] = useState({
    proposal_expired_at: "",
    poll_title: "",
    description: "",
    // action_member: "",
    proposal_created_at: "",
  });

  const [removeDaoMember, setRemoveDaoMember] = useState({
    description: '',
    action_member: '',
  });

  const [groupNames, setGroupNames] = useState([]);
  console.log("group", groupNames);

  const [loading, setLoading] = useState(false);
  const { createDaoActor, stringPrincipal, identity } = useAuth();

  const movetodao = () => {
    navigate(`/dao/profile/${daoCanisterId}`);
    console.log("Proposal Submitted");
  };

  const { daoCanisterId } = useParams();

  useEffect(() => {
    console.log("DAO Canister ID:", daoCanisterId);

    const fetchDaoDetails = async () => {
      if (daoCanisterId) {
        console.log("Fetching DAO details...");

        try {
          const daoActor = await createDaoActor(daoCanisterId);
          console.log("DAO Actor:", daoActor);

          if (daoActor) {
            const daoDetails = await daoActor.get_dao_detail();
            console.log("DAO Details Returned:", daoDetails);
            setDao(daoDetails); // Set dao to the fetched details
            console.log("dao", dao);

            const names = await daoDetails.proposal_entiry.map(
              (group) => group.place_name
            );
            console.log("GR", names);
            setGroupNames(names);
          } else {
            console.error("daoActor is null");
          }
        } catch (error) {
          console.error("Error fetching DAO details:", error);
        }
      }
    };
    console.log("Dao", dao);
    console.log("GRP", groupNames);

    fetchDaoDetails();
  }, [daoCanisterId]);

  // useEffect(() => {
  //   const fetchGroupNames = async () => {
  //     if (daoCanisterId) {
  //       try {
  //         const daoCanister = await createDaoActor(daoCanisterId);
  //         const daogroups = await daoCanister.get_dao_groups();
  //         const names = daogroups.map(group => group.group_name);
  //         setGroupNames(names);
  //       } catch (error) {
  //         console.error("Error fetching group names:", error);
  //       }
  //     }
  //   };

  //   fetchGroupNames();
  // }, [daoCanisterId, createDaoActor]);

  const className = "CreateProposals";

  const handleProposalTitleChange = (event) => {
    setProposalTitle(event.target.value);
  };
  const handleProposalTypeChange = (event) => {
    setProposalType(event.target.value);
  };

  const stripHtmlTags = (html) => {
    const doc = new DOMParser().parseFromString(html, "text/html");
    return doc.body.textContent || "";
  };

  // Remove unused handleInputChange if not needed

  const handleInputTransferToken = (e) => {
    const { name, value } = e.target;
    setTokenTransfer((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };
  const handleInputBountyClaim = (e) => {
    const { name, value } = e.target;
    setBountyClaim((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleInputGeneralPurp = (e) => {
    const { name, value } = e.target;

    if (name === "proposalExpiredAt") {
      const createdAtDate = new Date(generalPurp.proposalCreatedAt); // Created At date
      const selectedExpiredDate = new Date(value); // User's selected expiration date

      // Calculate the difference in days between the created at date and the selected expired at date
      const differenceInDays = Math.floor(
        (selectedExpiredDate - createdAtDate) / (1000 * 60 * 60 * 24)
      );

      // Store both the selected date for frontend display and the difference in days for backend
      setGeneralPurp({
        ...generalPurp,
        proposalExpiredAt: value, // Store the selected expiration date for frontend display
        days_until_expiration: differenceInDays, // Store the difference for backend submission
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
      const today = new Date().getTime(); // Current date in milliseconds
      const selectedDate = new Date(value).getTime(); // Selected date in milliseconds

      // Calculate the difference in days between the selected date and today's date
      const differenceInDays = Math.ceil(
        (selectedDate - today) / (1000 * 60 * 60 * 24)
      );

      setBountyRaised({
        ...bountyRaised,
        proposal_expired_at: value, // Set the actual selected date for display in the input field
        proposal_expired_in_days: differenceInDays, // Store the difference in days for backend submission
      });
      console.log("Bounty", bountyRaised);
    } else {
      setBountyRaised({
        ...bountyRaised,
        [name]: value,
      });
      console.log("BountyE", bountyRaised);
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
      const createdAtDate = new Date(poll.proposal_created_at); // Created At date
      const selectedExpiredDate = new Date(value); // User's selected expiration date

      // Calculate the difference in days between the created at date and the selected expired at date
      const differenceInDays = Math.floor(
        (selectedExpiredDate - createdAtDate) / (1000 * 60 * 60 * 24)
      );

      // Store both the selected date (for frontend display) and the difference in days for the backend
      setPoll({
        ...poll,
        proposal_expired_at: value, // Store the selected date for frontend display
        days_until_expiration: differenceInDays, // Store the difference for backend submission
      });
      console.log("if", poll);
    } else {
      setPoll({
        ...poll,
        [name]: value,
      });
      console.log("Else", poll);
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
          await submitTokenTransferProposal({
            proposal_entiry: proposalEntry,
            to: Principal.fromText(tokenTransfer.to),
            description: tokenTransfer.description,
            tokens: Number(tokenTransfer.tokens),
            // action_member: Principal.fromText(tokenTransfer.action_member),
            // action_member: Principal.fromText(tokenTransfer.action_member),
          });
          break;

        case "bountyClaim":
          console.log("dfnsdjlflksdfjlksdfjlksd");

          await submitBountyClaim({
            proposal_entiry: proposalEntry,
            associated_proposal_id: bountyClaim.associated_proposal_id,
            description: bountyClaim.description,
            link_of_task: bountyClaim.link_of_task,
            // action_member: Principal.fromText(bountyClaim.action_member),
            bounty_task: bountyClaim.bounty_task,
          });
          break;

          case 'GeneralPurp':
            await submitGeneralPurp({
              proposal_entiry: proposalEntry,
              // proposal_expired_at: generalPurp.days_until_expiration, // Send the days difference to the backend
              description: generalPurp.description,
              // action_member: Principal.fromText(generalPurp.actionMember),
              proposal_title: generalPurp.proposalTitle,
              // proposal_created_at: 0, // Set Created At to 0 as per your requirement
            });
            break;
          

        case "DaoConfig":
          await submitDaoConfig({
            proposal_entiry: proposalEntry,
            daotype: daoConfig.daotype,
            description: daoConfig.description,
            new_dao_name: daoConfig.new_dao_name,
            // action_member: Principal.fromText(daoConfig.action_member),
            // action_member: Principal.fromText(daoConfig.action_member),
            purpose: daoConfig.purpose,
          });
          break;

        case "AddMember":
          await submitAddMember({
            proposal_entiry: proposalEntry,
            group_name: addMember.group_name,
            description: addMember.description,
            new_member: Principal.fromText(addMember.new_member),
          });
          break;

        case 'RemoveMember':
          await submitRemoveMember({
            proposal_entiry: proposalEntry,
            group_name: removeMember.group_name,
            description: removeMember.description,
            action_member: Principal.fromText(removeMember.action_member),
          });
          break;

          case 'BountyRaised':
            await submitBountyRaised({
              proposal_entiry: proposalEntry,
              proposal_expired_at: bountyRaised.proposal_expired_in_days, // Send difference in days
              description: bountyRaised.description,
              tokens: Number(bountyRaised.tokens),
              // action_member: Principal.fromText(bountyRaised.action_member),
              proposal_created_at: 0,
              bounty_task: bountyRaised.bounty_task,
            });
            break;
          

        case 'ChangePolicy':
          await submitChangePolicy({
            proposal_entiry: proposalEntry,
            description: changePolicy.description,
            // action_member: Principal.fromText(changePolicy.action_member),
            // action_member: Principal.fromText(changePolicy.action_member),
            cool_down_period: Number(changePolicy.cool_down_period),
            required_votes: Number(changePolicy.required_votes),
          });
          break;

        case "Poll":
          await submitPoll({
            proposal_entiry: proposalEntry,
            proposal_expired_at: poll.days_until_expiration, // Pass the days difference to the backend
            poll_title: poll.poll_title,
            description: poll.description,
            // action_member: Principal.fromText(poll.action_member),
            proposal_created_at: 0, // Set Created At to 0 as per your requirement
          });

          break;

          

        case 'RemoveDaoMember':
          await submitRemoveDaoMember({
            proposal_entiry: proposalEntry,
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
      const daoCanister = await createDaoActor(daoCanisterId);
      console.log("DAO Canister ID:", daoCanisterId);
      console.log("Token Transfer Proposal Payload:", tokenTransfer);
      
      const response = await daoCanister.proposal_to_transfer_token(tokenTransfer);
      console.log("Response of Token Transfer:", response);
      
      toast.success("Token transfer proposal created successfully");
      movetodao();
    } catch (error) {
      console.error("Error submitting Token Transfer proposal:", error);
      toast.error("Failed to create Token Transfer proposal");
    }
  };
  const submitBountyClaim = async (bountyClaim) => {
    try {
      const daoCanister = await createDaoActor(daoCanisterId);
      console.log("DAO Canister ID:", daoCanisterId);
      console.log("Bounty Claim Proposal Payload:", bountyClaim);
      
      const response = await daoCanister.proposal_to_bounty_claim(bountyClaim);
      console.log("Response of Bounty Claim:", response);
      
      toast.success("Bounty Claim proposal created successfully");
      movetodao();
    } catch (error) {
      console.error("Error submitting Bounty Claim proposal:", error);
      toast.error("Failed to create Bounty Claim proposal");
    }
  };
  const submitGeneralPurp = async (generalPurp) => {
    console.log("general purpose", generalPurp);

    try {
      const daoCanister = await createDaoActor(daoCanisterId);
      console.log("DAO Canister ID:", daoCanisterId);
      console.log("General Purpose Proposal Payload:", generalPurp);
      
      const response = await daoCanister.proposal_to_create_general_purpose(generalPurp);
      console.log("Response of General Purpose:", response);
      
      toast.success("General Purpose proposal created successfully");
      movetodao();
    } catch (error) {
      console.error("Error submitting General Purpose proposal:", error);
      toast.error("Failed to create General Purpose proposal");
    }
  };
  const submitDaoConfig = async (daoConfig) => {
    try {
      const daoCanister = await createDaoActor(daoCanisterId);
      console.log("DAO Canister ID:", daoCanisterId);
      console.log("DAO Config Proposal Payload:", daoConfig);

      const response = await daoCanister.proposal_to_change_dao_config(
        daoConfig
      );
      console.log("Response from DAO Config Proposal:", response);

      if (response.Ok) {
        toast.success("DAO configuration proposal created successfully");
        movetodao();
        const submitBountyRaised = async (bountyRaised) => {
          try {
            const daoCanister = await createDaoActor(daoCanisterId);
            console.log("DAO Canister ID:", daoCanisterId);
            console.log("Bounty Raised Proposal Payload:", bountyRaised);

            const response = await daoCanister.proposal_to_bounty_raised(
              bountyRaised
            );
            console.log("Response of Bounty Raised:", response);

            toast.success("Bounty raised proposal created successfully");
            movetodao();
          } catch (error) {
            console.error("Error submitting Bounty Raised proposal:", error);
            toast.error("Failed to create Bounty Raised proposal");
          }
        };
        // setActiveLink("proposals"); // Ensure setActiveLink is defined or remove if unnecessary
      }
      else {
        toast.error("Failed to create DAO configuration proposal");
      }
    } catch (error) {
      console.error("Error during DAO Config proposal submission:", error);
      toast.error("Failed to create DAO configuration proposal");
    }
  };

  const submitAddMember = async (addMemberData) => {
    try {
      const daoCanister = await createDaoActor(daoCanisterId);
      console.log("DAO Canister ID:", daoCanisterId);
      console.log("Add Member Proposal Payload:", addMemberData);
      
      const response = await daoCanister.proposal_to_add_member_to_group(addMemberData);
      console.log("Response from Add Member Proposal:", response);
      
      if (response.Ok) {
        toast.success("Add member proposal created successfully");
        movetodao();
        // setActiveLink("proposals"); // Ensure setActiveLink is defined or remove if unnecessary
        setAddMember({
          group_name: "",
          description: "",
          new_member: "",
        });
      } else {
        toast.error("Failed to create Add Member proposal");
      }
    } catch (error) {
      console.error("Error during Add Member proposal submission:", error);
      toast.error("Failed to create Add Member proposal");
    }
  };

  const submitRemoveMember = async (removeMemberData) => {
    try {
      const daoCanister = await createDaoActor(daoCanisterId);
      console.log("DAO Canister ID:", daoCanisterId);
      console.log("Remove Member Proposal Payload:", removeMemberData);
      
      const response = await daoCanister.proposal_to_remove_member_to_group(removeMemberData);
      console.log("Response from Remove Member Proposal:", response);
      
      if (response.Ok) {
        toast.success("Remove member proposal created successfully");
        movetodao();
        // setActiveLink("proposals"); // Ensure setActiveLink is defined or remove if unnecessary
        setRemoveMember({
          group_name: "",
          description: "",
          action_member: "",
        });
      }
      else {
        toast.error("Failed to create Remove Member proposal");
      }
    } catch (error) {
      console.error("Error during proposal submission:", error);
    }
  };
  const createTokenActor = async () => {
    const tokenActorrr = createActor(
      Principal.fromText("ryjl3-tyaaa-aaaaa-aaaba-cai"),
      { agentOptions: { identity } }
    );
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
  const fetchMetadataAndBalance = async (tokenActor, ownerPrincipal) => {
    try {
      const [metadata, balance] = await Promise.all([
        tokenActor.icrc1_metadata(),
        tokenActor.icrc1_balance_of({
          owner: ownerPrincipal,
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
      const res = await daoCanister.make_payment(
        sendableAmount,
        Principal.fromText(stringPrincipal)
      );
      console.log("res : ", res);
      if (res.Ok) {
        toast.success("Payment successful!");
      } else {
        toast.error("Payment failed. Please try again.");
      }
    } catch (err) {
      console.error("Error in transfer approve", err);
    }
  };
  const transferApprove = async (
    currentBalance,
    tokenActor,
    currentMetaData,
    tokens
  ) => {
    try {
      const sendableAmount = BigInt(tokens);
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
          await afterPaymentApprove(sendableAmount);
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

  const submitBountyRaised = async (bountyRaised) => {
    try {
      const actor = await createTokenActor();
      const { balance, metadata } = await fetchMetadataAndBalance(
        actor,
        Principal.fromText(stringPrincipal)
      );
      const parsedBalance = parseInt(balance, 10);
      const formattedMetadata = await formatTokenMetaData(metadata);
      await transferApprove(
        parsedBalance,
        actor,
        formattedMetadata,
        bountyRaised.tokens
      );
    } catch (err) {
      console.log("error is in approval : ", err);
      toast.error("Payment failed. Please try again.");
    }

    try {
      const daoCanister = await createDaoActor(daoCanisterId);
      const response = await daoCanister.proposal_to_bounty_raised(bountyRaised);
      console.log("response of bounty rasied ", response);
      toast.success("bounty raised proposal created successfully");
      movetodao();
    } catch (error) {
      console.log("error of add", error);
    }
  };
  const submitChangePolicy = async (changePolicy) => {
    try {
      const daoCanister = await createDaoActor(daoCanisterId);
      console.log("DAO Canister ID:", daoCanisterId);
      console.log("Change Policy Proposal Payload:", changePolicy);
      
      const response = await daoCanister.proposal_to_change_dao_policy(changePolicy);
      console.log("Response of Change Policy:", response);
      
      toast.success("Change DAO Policy proposal created successfully");
      movetodao();
    } catch (error) {
      console.error("Error submitting Change Policy proposal:", error);
      toast.error("Failed to create Change DAO Policy proposal");
    }
  };
  const submitPoll = async (poll) => {
    console.log("Poll",poll);
    
    try {
      const daoCanister = await createDaoActor(daoCanisterId);
      console.log("DAO Canister ID:", daoCanisterId);
      console.log("Poll Proposal Payload:", poll);

      const response = await daoCanister.proposal_to_create_poll(poll);
      console.log("Response of Poll Proposal:", response);
      
      toast.success("Poll proposal created successfully");
      movetodao();
    } catch (error) {
      console.error("Error submitting Poll proposal:", error);
      toast.error("Failed to create Poll proposal");
    }
  };
  const submitRemoveDaoMember = async (removeDaoMember) => {
    console.log("remove dao member paylaod", removeDaoMember);

    console.log("remove dao member paylaod", removeDaoMember);

    try {
      const daoCanister = await createDaoActor(daoCanisterId);
      console.log("DAO Canister ID:", daoCanisterId);
      console.log("Remove DAO Member Proposal Payload:", removeDaoMember);
      
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
                  {/* <div className="max-w-6xl relative">
                    <label className="block mb-2 font-semibold text-xl">Proposal Title</label>
                    <input
                      type="text"
                      value={proposalTitle}
                      onChange={handleProposalTitleChange}
                      placeholder="Enter proposal title"
                      className=" w-full max-w-[800px] px-4 py-3 mb-4 border-opacity-30 border border-[#aba9a5] rounded-xl bg-transparent"
                      required // Optional: Make it a required field
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
                        required // Optional: Make it a required field
                      />
                    </div>
                  </div> */}

                  {/* Proposal Type Select */}
                  <div className="mb-6 max-w-6xl relative">
                    <label className="block mb-2 font-semibold text-xl">
                      Proposal Type
                    </label>
                    <select
                      value={proposalType}
                      onChange={handleProposalTypeChange}
                      className="w-full max-w-[800px] px-4 py-3 mb-4 border-opacity-30 border border-[#aba9a5] rounded-xl bg-transparent"
                      required // Make it a required field
                    >
                      <option value="">Select Proposal Type</option>
                      <option value="bountyClaim">Bounty Claim</option>
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
                  <div className="mb-6 max-w-6xl relative">
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
                      dao.proposal_entiry &&
                      dao.proposal_entiry.length > 0 ? (
                        dao.proposal_entiry.map((entry, index) => (
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
                  {proposalType === "bountyClaim" && (
                    <BountyClaim
                      bountyClaim={bountyClaim}
                      handleInputBountyClaim={handleInputBountyClaim}
                    />
                  )}

                  {proposalType === "tokenTransfer" && (
                    <TokenTransfer
                      tokenTransfer={tokenTransfer}
                      handleInputTransferToken={handleInputTransferToken}
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
                    />
                  )}

                  {proposalType === "ChangePolicy" && (
                    <DaoPolicy
                      changePolicy={changePolicy}
                      handleInputDaoPolicy={handleInputDaoPolicy}
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
                  <div className="flex justify-center my-8">
                        <button
                          className="bg-[#0E3746] hover:bg-[#819499] text-white font-normal text-center rounded-full text-[16px] py-2 px-6 rounded focus:outline-none focus:shadow-outline"
                          type="submit"
                          disabled={loading || !proposalEntry} // Disable if loading or proposalEntry not selected
                        >
                          {loading ? (
                            <CircularProgress size={24} />
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
