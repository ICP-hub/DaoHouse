import React, { useEffect, useState } from "react";
import { Principal } from "@dfinity/principal";
import { createActor } from "../../../../declarations/icp_ledger_canister";
import { FaArrowLeftLong } from "react-icons/fa6";
import { FiUpload } from "react-icons/fi";
import daoImage from "../../../assets/daoImage.png"
import CircularProgress from '@mui/material/CircularProgress';
import toast, { Toaster } from 'react-hot-toast';
import Container from "../Container/Container";

import PaymentModal from "./PaymentModal";
import coinsound from "../../../../daohouse_frontend/src/Sound/coinsound.mp3";
import { useAuth } from "../../connect/useClient";

const Step6 = ({ data, setData, setActiveStep, loadingNext, clearLocalStorage, setLoadingNext }) => {
  const [file, setFile] = useState(null);
<<<<<<< HEAD
  const { identity, stringPrincipal, backendActor,balance ,principal } = useAuth();
  console.log("balsad",principal);
  
  const [fileURL, setFileURL] = useState(daoImage);
=======
  const { identity, stringPrincipal, backendActor } = useAuth()
  const [fileURL, setFileURL] = useState(null);
  const [fileName, setFileName] = useState(null);
>>>>>>> main
  const [shouldCreateDAO, setShouldCreateDAO] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loadingPayment, setLoadingPayment] = useState(false);

  const className = "DAO__Step6";

  const handleFileInput = async (event) => {
    const selectedFile = event.target.files[0];

    if (selectedFile) {
      if (selectedFile.size > 2 * 1024 * 1024) {
        toast.error("File size must be less than 2 MB");
        return;
      }

      setFile(selectedFile);
      const url = URL.createObjectURL(selectedFile);
      setFileURL(url);
      setFileName(selectedFile.name);
    } else {
      setFile(null);
      setFileName(null);
    }
  };



  const LEDGER_CANISTER_ID = "ryjl3-tyaaa-aaaaa-aaaba-cai";
  const createTokenActor = async () => {
    const tokenActorrr = createActor(LEDGER_CANISTER_ID, { agentOptions: { identity } });
    return tokenActorrr

  };

  const fetchMetadataAndBalance = async (tokenActor, ownerPrincipal) => {
    console.log(tokenActor, ownerPrincipal.toText());
    try {
      const [metadata, balance] = await Promise.all([
        tokenActor.icrc1_metadata(),
        tokenActor.icrc1_balance_of({
          owner: ownerPrincipal,
          subaccount: [],
        }),
      ]);
      console.log("Fetched metadata:", metadata);
      return { metadata, balance };
    } catch (err) {
      console.error("Error fetching metadata and balance:", err);
      throw err;
    }
  };

  const afterPaymentApprove = async () => {

    const { step1, step2, step3, step4, step5, step6 } = data;

    try {
<<<<<<< HEAD
      //uncomment later
      const res = await backendActor.make_payment(sendableAmount, Principal.fromText(stringPrincipal ? stringPrincipal : principal.toString()));
      console.log(res)
      if (res.Ok) {
=======
      setLoadingPayment(true)

      const council = step4.voting?.Council;
      const councilArray = Object.entries(council)
        .filter(([permission, hasPermission]) => hasPermission)
        .map(([permission]) => permission);

      console.log("councilArray", councilArray);
      console.log("council", council);

      const allMembers = new Set();


      const councilMembers = step3.council || [];
      councilMembers.forEach(member => allMembers.add(Principal.fromText(member).toText()));



      const principalMembers = Array.from(allMembers).map(member => Principal.fromText(member));

      console.log(step2);
      console.log(data.dao_groups);

      const proposalEntry = step5.map(q => ({
        place_name: q.name,
        min_required_thredshold: BigInt(q.vote),
      }));

      const membersArray = Array.from(data.members_permissions) || [];
      const successAudio = new Audio(coinsound)
      const allDaoUsers = step3.members.map(member => Principal.fromText(member));
      const daoPayload = {
        dao_name: step1.DAOIdentifier || "my dao hai",
        purpose: step1.Purpose || "my proposal hai",
        link_of_document: "my link.org",
        cool_down_period: step1.SetUpPeriod || 3,
        members: principalMembers || [Principal.fromText("aaaaa-aa")],
        members_permissions: membersArray || ["just", "pesmi"],
        token_name: step2.TokenName || "GOLD Token",
        token_symbol: step2.TokenSymbol || "TKN",
        tokens_required_to_vote: 12,
        linksandsocials: ["just send f"],
        required_votes: parseInt(step2.VotesRequired, 10) || 3,
        image_content: step6.image_content ? Array.from(new Uint8Array(step6.image_content)) :
          Array.from(new Uint8Array()),
        image_title: step6.image_title || "this is just my title",
        image_content_type: step6.image_content_type || "just image content bro",
        image_id: step6.image_id || "12",
        dao_groups: data.dao_groups,
        proposal_entry: proposalEntry,
        ask_to_join_dao: data.ask_to_join_dao,
        token_supply: Number(step2.TokenSupply) || 4,
        all_dao_user: allDaoUsers
      };
      const res = await backendActor.make_payment_and_create_dao(daoPayload);
      console.log("this is backend res : ", res)
      if (res.Ok) {        
>>>>>>> main
        toast.success("Payment successful!");
        setLoadingPayment(false)
        setIsModalOpen(false);
        successAudio.play();

        toast.success("DAO created successfully");
        clearLocalStorage();
        setTimeout(() => {
          window.location.href = '/dao';
        }, 2000);
        setLoadingNext(false);
      } else {
          toast.error(`${res.Err}`);
          // toast.error(`Failed to create Dao`);
          setLoadingNext(false)
          console.log(res,"dffsdfsd");
          // toast.error(res.Err);
      }
    } catch (error) {
      console.log("error : ", error)
      const rejectTextMatch = error.message.match(/Reject text: (.+)/);
      const rejectText = rejectTextMatch ? rejectTextMatch[1] : "An error occurred"
      toast.error(rejectText);
    } finally {
      setLoadingPayment(false);
    }
  }

  const formatTokenMetaData = (arr) => {
    const resultObject = {};
    arr.forEach((item) => {
      const key = item[0];
      const value = item[1][Object.keys(item[1])[0]];
      resultObject[key] = value;
    });
    return resultObject;
  };

  const transferApprove = async (
    currentBalance,
    currentMetaData,
    tokenActor
  ) => {
    try {
<<<<<<< HEAD
      const decimals = parseInt(currentMetaData["icrc1:decimals"], 10);

      const sendableAmount = parseInt(
        10000
      );
      console.log("sendable amount console ", sendableAmount);
      console.log("current balance console ", currentBalance);
      console.log("prjkjekwr",principal.toString());
      

      const backendCanisterId = process.env.CANISTER_ID_DAOHOUSE_BACKEND;
  console.log("dfdsfsd",backendCanisterId);
  
      if (currentBalance > sendableAmount) {

        let transaction = {
          from_subaccount: [],
          spender: {
            owner: Principal.fromText(backendCanisterId),
            subaccount: [],
          },
          amount: Number(sendableAmount) + Number(currentMetaData["icrc1:fee"]),
          expected_allowance: [],
          expires_at: [],
          fee: [currentMetaData["icrc1:fee"]],
          memo: [],
          created_at_time: [],
        };
        console.log("transaction ", transaction);
        console.log("Token Actor ICRC2 APPROVE", tokenActor.icrc2_approve);
        const approveRes = await tokenActor.icrc2_approve(transaction);
        console.log("Payment Approve Response ", approveRes);
        if (approveRes.Err) {
          const errorMessage = `Insufficient funds. Balance: ${approveRes.Err.InsufficientFunds.balance}`;
          toast.error(errorMessage);
          return;
        } else {
          afterPaymentApprove(sendableAmount)

        }
      } else {
        console.log("Insufficient Balance to purchase");
        toast.error(
          `Insufficient balance. Balance : ${currentBalance / 10 ** 8}`
        );
=======
      const sendableAmount = parseInt(0.1 * Math.pow(10,8));
      // const sendableAmount = 1;
      console.log("sendable amount ",sendableAmount);
      console.log("current balance ", currentBalance);

      const backendCanisterId = process.env.CANISTER_ID_DAOHOUSE_BACKEND;
      let transaction = {
        from_subaccount: [],
        spender: {
          owner: Principal.fromText(backendCanisterId),
          subaccount: [],
        },
        amount: sendableAmount + parseInt(currentMetaData["icrc1:fee"]),
        expected_allowance: [],
        expires_at: [],
        fee: [currentMetaData["icrc1:fee"]],
        memo: [],
        created_at_time: [],
      };
     
 
      const approveRes = await tokenActor.icrc2_approve(transaction);
   
      if (approveRes.Err) {
        const errorMessage = `Insufficient funds. Balance: ${approveRes.Err.InsufficientFunds.balance}`;
        console.log("Err", approveRes)
        toast.error(errorMessage);
>>>>>>> main
        setLoadingPayment(false)
        return;
      } else {
        afterPaymentApprove(sendableAmount)
      }
    } catch (err) {
      console.error("Error in transfer approve", err);
      toast.error(err);
      setLoadingPayment(false)
    } finally {
      // setLoadingPayment(false)
    }
  };
  async function paymentTest() {
    console.log("owner principal is ", stringPrincipal);
    console.log("printing payment");

    const backendCanisterId = process.env.CANISTER_ID_DAOHOUSE_BACKEND;
    try {
      setLoadingPayment(true);
      const actor = await createTokenActor(LEDGER_CANISTER_ID);

      console.log("backend canister id: ", backendCanisterId);
      console.log("actor is ", actor);

      const name = await actor.icrc1_name();
      console.log("balance is ", name);

      const { metadata, balance } = await fetchMetadataAndBalance(actor, Principal.fromText(stringPrincipal ? stringPrincipal : principal.toString()));

      const formattedMetadata = formatTokenMetaData(metadata);
      const parsedBalance = parseInt(balance, 10);
      console.log("Balance:", parsedBalance);
      // await transferApprove(parsedBalance, formattedMetadata, actor);
    } catch (err) {
      toast.error(err.message);
      console.log("err",err);
      
      setLoadingPayment(false);
    }
  }


  const createDAO = async () => {
    if (!file) {
      toast.error("Please insert an image");
      return;
    }

    setLoadingNext(true);

    try {

      const fileContent = await readFileContent(file);


      setData((prevData) => ({
        ...prevData,
        step6: {
          imageURI: fileURL,
          image_content: new Uint8Array(fileContent),
          image_content_type: file.type,
          image_title: file.name,
          image_id: `${Date.now()}`,
        },
      }));

      // setIsModalOpen(true);
      console.log("sadnasjkd");
      handleDaoClick();
      

    } catch (error) {
      toast.error("Error reading image content.");
      setLoadingNext(false);
    }
  };


  const handleCancel = () => {
    setLoadingPayment(false);
    setIsModalOpen(false);
    setLoadingNext(false);
    setShouldCreateDAO(false);
  };

  useEffect(() => {
    if (loadingPayment) {
      setIsModalOpen(true);
      setLoadingPayment(true)
    }
  }, [loadingPayment]);


  const readFileContent = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsArrayBuffer(file);
    });
  };

  useEffect(() => {
    return () => {
      localStorage.removeItem('step6Data');
    };
  }, []);

  useEffect(() => {
    if (shouldCreateDAO) {
<<<<<<< HEAD
      console.log("should create");
      
      handleDaoClick();
=======

>>>>>>> main
      setShouldCreateDAO(false);
    }
  }, [data, shouldCreateDAO]);

  console.log("data of all steps: ", data)


  useEffect(() => {
    if (isModalOpen) {
      document.body.classList.add('overflow-hidden');
    } else {
      document.body.classList.remove('overflow-hidden');
    }

    return () => {
      document.body.classList.remove('overflow-hidden');
    };
  }, [isModalOpen]);

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
    <React.Fragment>
      <Container>
        <div
          className={
            className +
            "__form w-full bg-[#F4F2EC] big_phone:p-10 mobile:p-6 p-3 big_phone:mx-4 mx-0 rounded-lg flex flex-col gap-4"
          }
        >
          <p className="mobile:text-base text-sm font-semibold">Set Profile Picture</p>

          <div className="uploadImage flex big_phone:flex-row flex-col items-center justify-start gap-4">
            <img
              src={file ? URL.createObjectURL(file) : daoImage}
              alt="Image"
              className="rounded-lg w-[350px] h-[200px] object-cover"
            />

            <div className="flex flex-col items-center justify-center">
              <label
                htmlFor="profile"
                className="flex mobile:text-sm text-[10px]  font-semibold cursor-pointer mobile:m-4 m-2 flex-row items-center gap-2 bg-white px-6 py-2 text-center justify-center center rounded-[3rem] text-black shadow-xl"
              >
                <FiUpload className="text-[12px] mobile:text-[16px]  text-center" />
                <span className="truncate ... w-36">
                  {fileName ? fileName : "Upload New Photos"}
                </span>

              </label>
              <span className="block text-center mt-1 mobile:text-xs text-[9px] text-gray-500">
                Upload JPG, PNG. Max 5 MB
              </span>
            </div>



            <input
              type="file"
              id="profile"
              className="hidden"
              accept="image/*"
              onChange={handleFileInput}
            />
          </div>

        </div>


        <div className={
          className +
          "__submitButton w-full flex flex-col md:flex-row items-start mt-3"
        }
        >
          <div className="w-full md:w-[70%] flex-none">
            <div className="h-auto max-w-full m-4 rounded-lg  border border-black">
              <div className="p-3 md:p-7">
                <div className="text-base flex items-center space-x-2 font-semibold">
                  <span>Create a new DAO costs 0.1 ICP</span>
                  <div className="pl-10 md:pl-20 lg:pl-40 xl:pl-80">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M10 15C10.2833 15 10.5208 14.9042 10.7125 14.7125C10.9042 14.5208 11 14.2833 11 14C11 13.7167 10.9042 13.4792 10.7125 13.2875C10.5208 13.0958 10.2833 13 10 13C9.71667 13 9.47917 13.0958 9.2875 13.2875C9.09583 13.4792 9 13.7167 9 14C9 14.2833 9.09583 14.5208 9.2875 14.7125C9.47917 14.9042 9.71667 15 10 15ZM9 11H11V5H9V11ZM10 20C8.61667 20 7.31667 19.7375 6.1 19.2125C4.88333 18.6875 3.825 17.975 2.925 17.075C2.025 16.175 1.3125 15.1167 0.7875 13.9C0.2625 12.6833 0 11.3833 0 10C0 8.61667 0.2625 7.31667 0.7875 6.1C1.3125 4.88333 2.025 3.825 2.925 2.925C3.825 2.025 4.88333 1.3125 6.1 0.7875C7.31667 0.2625 8.61667 0 10 0C11.3833 0 12.6833 0.2625 13.9 0.7875C15.1167 1.3125 16.175 2.025 17.075 2.925C17.975 3.825 18.6875 4.88333 19.2125 6.1C19.7375 7.31667 20 8.61667 20 10C20 11.3833 19.7375 12.6833 19.2125 13.9C18.6875 15.1167 17.975 16.175 17.075 17.075C16.175 17.975 15.1167 18.6875 13.9 19.2125C12.6833 19.7375 11.3833 20 10 20Z" fill="#0E3746" />
                    </svg>
                  </div>
                </div>
                <p className="mt-3 text-base">
                  The 0.1 ICP will be used to pay for the contract deployment and storage.
                </p>
              </div>

            </div>
          </div>

          <div className="w-full flex flex-col md:flex-row items-center justify-center md:justify-end space-y-4 md:space-y-0 md:space-x-4 mt-6 md:mt-10 px-4 md:px-0">
            <button
              onClick={() => setActiveStep(4)}
              className="w-full md:w-auto flex items-center justify-center gap-2 border border-[#0E3746] hover:bg-[#0E3746] text-[#3d6979] hover:text-white text-sm md:text-base transition px-4 md:px-3 lg:px-8 py-2 md:py-3 rounded-full"
            >
              <FaArrowLeftLong /> Back
            </button>

            <button
              type="submit"
              onClick={createDAO}
              className="w-full md:w-auto flex items-center justify-center gap-2 bg-[#0E3746] text-white text-sm md:text-base px-4 md:px-6 lg:px-8 py-2 md:py-3 rounded-full whitespace-nowrap"
            >
              {loadingNext ? (
                <CircularProgress size={20} />
              ) : (
                "Create DAO"
              )}
            </button>
          </div>

        </div>
      </Container>
      {/* <PaymentModal
        data={data}
        open={isModalOpen}
        onClose={handleCancel}
        onPay={async () => {
          await paymentTest();

        }}
        loading={loadingPayment}
        fileURL={fileURL}
      /> */}
    </React.Fragment>
  );
};

export default Step6;

