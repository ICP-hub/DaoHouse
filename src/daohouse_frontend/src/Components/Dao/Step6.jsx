import React, { useEffect, useState } from "react";
import { Principal } from "@dfinity/principal";
import { createActor } from "../../../../declarations/icp_ledger_canister"; // Adjust the path to the actual location of the `createActor` function
import { FaArrowLeftLong } from "react-icons/fa6";
import { FiUpload } from "react-icons/fi";
import defaultImage from "../../../assets/defaultImage.png";
import CircularProgress from '@mui/material/CircularProgress';
import { toast } from 'react-toastify';
import Container from "../Container/Container";
import { useAuth } from "../utils/useAuthClient";
import PaymentModal from "./PaymentModal";

const Step6 = ({ data, setData, setActiveStep, handleDaoClick, loadingNext, setLoadingNext }) => {
  const [file, setFile] = useState(null);
  const { identity, stringPrincipal, backendActor } = useAuth()
  const [fileURL, setFileURL] = useState(defaultImage);
  const [shouldCreateDAO, setShouldCreateDAO] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loadingPayment, setLoadingPayment] = useState(false);
  // const [loadingNext, setLoadingNext] = useState(false);
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
    } else {
      setFile(null);
      setFileURL(defaultImage);
    }
  };

  // const host = "http://127.0.0.1:40335"

  // temp
  const LEDGER_CANISTER_ID = "ryjl3-tyaaa-aaaaa-aaaba-cai";
   const createTokenActor = async (canisterId) => {

    //     console.log("identity : ",identity)
    // const authClient = await AuthClient.create();
    // const identity = await authClient.getIdentity();
    // console.log("identity : ", identity);
    // const principal = identity.getPrincipal();
    // console.log("ankur :", principal.toText());

    // const authClient = window.auth.client;


    const tokenActorrr = createActor(Principal.fromText("ryjl3-tyaaa-aaaaa-aaaba-cai"), { agentOptions: { identity } });
    

    // const agent = new HttpAgent({
    //   identity,
    //   host,
    // });
    // let tokenActor = Actor.createActor(ledgerIDL, {
    //   agent,
    //   canisterId,
    // });

    // return tokenActor
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

  // aafter payment
  const afterPaymentApprove = async (sendableAmount) => {
    console.log("total amout ", sendableAmount)
    console.log("after payment ")
    console.log(backendActor)


    try {
      const res = await backendActor.make_payment(sendableAmount, Principal.fromText(stringPrincipal));
      console.log(res,"asdjshjkhfksdhflksdhflkshdflkhdslk");
      // console.log("resok",res?.Ok)
    
      if (res.Ok) {
        toast.success("Payment successful!");
        setIsModalOpen(false); // Close the modal on successful payment
        handleDaoClick(); // Navigate to the next step
      } else {
        console.log(res);
        toast.error("Payment failed. Please try again.");
      }
    } finally {
      setLoadingPayment(false); // End loading state after payment is processed
    }
  }


  // for payment

  const formatTokenMetaData = (arr) => {
    const resultObject = {};
    arr.forEach((item) => {
      const key = item[0];
      const value = item[1][Object.keys(item[1])[0]]; // Extracting the value from the nested object
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
      const decimals = parseInt(currentMetaData["icrc1:decimals"], 10);
      // const sendableAmount = parseInt(
      //   (0.1111) * Math.pow(10, decimals),
      //   10
      // );
      const sendableAmount = parseInt(
        10000
      );
      console.log("sendable amount console ", sendableAmount);
      console.log("current balance console ", currentBalance);

    const backendCanisterId = process.env.CANISTER_ID_DAOHOUSE_BACKEND;

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
          // afterPaymentApprove(
          //   parseInt(approveRes?.Ok).toString(),
          //   sendableAmount,
          //   currentBalance
          // );
        }
      } else {
        console.log("Insufficient Balance to purchase");
        toast.error(
          `Insufficient balance. Balance : ${currentBalance / 10 ** 8}`
        );
        setLoadingPayment(false)
      }
    } catch (err) {
      console.error("Error in transfer approve", err);
    } finally {
    }
  };
  async function paymentTest() {
    console.log("owner principal is ", stringPrincipal);
    console.log("printing payment");
  
    const backendCanisterId = process.env.CANISTER_ID_DAOHOUSE_BACKEND;
    try{
      setLoadingPayment(true);
    const actor = await createTokenActor(Principal.fromText("ryjl3-tyaaa-aaaaa-aaaba-cai"));
  
    console.log("backend canister id: ", backendCanisterId);
    console.log("actor is ", actor);
  
    const name = await actor.icrc1_name();
    console.log("balance is ", name);
  
    const { metadata, balance } = await fetchMetadataAndBalance(actor, Principal.fromText(stringPrincipal));
  
    const formattedMetadata = formatTokenMetaData(metadata);
    const parsedBalance = parseInt(balance, 10);
    console.log("Balance:", parsedBalance);
  
    // Proceed with transfer approval and payment
    await transferApprove(parsedBalance, formattedMetadata, actor);
    } catch (err) {
      toast.error("Payment failed. Please try again.");
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
      // Read the file content first
      const fileContent = await readFileContent(file);
      
      // Update the state with the image content
      setData((prevData) => ({
        ...prevData,
        step6: {
          imageURI: fileURL,
          image_content: new Uint8Array(fileContent),
          image_content_type: file.type,
          image_title: file.name,
          image_id: '12',
        },
      }));
      
      setIsModalOpen(true);
  
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
      handleDaoClick();
      setShouldCreateDAO(false);
    }
  }, [data, shouldCreateDAO, handleDaoClick]);

  console.log("data of all steps: ", data)
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
            src={fileURL}
            alt="Image"
            className="rounded-lg w-[350px] h-[200px] object-cover"
          />

         <div>
         <label
            htmlFor="profile"
            className="flex mobile:text-base text-xs font-semibold cursor-pointer mobile:m-4 m-2 flex-row items-center gap-2 bg-white px-4 py-2 rounded-[2rem] text-black shadow-xl"
          >
            <FiUpload /> Upload New Photo
           
          </label>
          <span className="block mt-1 text-xs translate-x-[35px] text-gray-500">
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
        <p className="text-base flex items-center space-x-2 font-semibold">
          <span>Create a new DAO costs 0.1 ICP</span>
          <div className="pl-10 md:pl-20 lg:pl-40 xl:pl-80">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M10 15C10.2833 15 10.5208 14.9042 10.7125 14.7125C10.9042 14.5208 11 14.2833 11 14C11 13.7167 10.9042 13.4792 10.7125 13.2875C10.5208 13.0958 10.2833 13 10 13C9.71667 13 9.47917 13.0958 9.2875 13.2875C9.09583 13.4792 9 13.7167 9 14C9 14.2833 9.09583 14.5208 9.2875 14.7125C9.47917 14.9042 9.71667 15 10 15ZM9 11H11V5H9V11ZM10 20C8.61667 20 7.31667 19.7375 6.1 19.2125C4.88333 18.6875 3.825 17.975 2.925 17.075C2.025 16.175 1.3125 15.1167 0.7875 13.9C0.2625 12.6833 0 11.3833 0 10C0 8.61667 0.2625 7.31667 0.7875 6.1C1.3125 4.88333 2.025 3.825 2.925 2.925C3.825 2.025 4.88333 1.3125 6.1 0.7875C7.31667 0.2625 8.61667 0 10 0C11.3833 0 12.6833 0.2625 13.9 0.7875C15.1167 1.3125 16.175 2.025 17.075 2.925C17.975 3.825 18.6875 4.88333 19.2125 6.1C19.7375 7.31667 20 8.61667 20 10C20 11.3833 19.7375 12.6833 19.2125 13.9C18.6875 15.1167 17.975 16.175 17.075 17.075C16.175 17.975 15.1167 18.6875 13.9 19.2125C12.6833 19.7375 11.3833 20 10 20Z" fill="#0E3746"/>
            </svg>
          </div>
        </p>
        <p className="mt-3 text-base">
          The 0.1 ICP will be used to pay for the contract deployment and storage.
        </p>
      </div>
      
        </div>
      </div>

      <div className="w-full md:w-[40%] flex flex-col lg:mt-10 md:flex-row items-center md:items-end justify-center md:justify-end">
        <button
          onClick={() => setActiveStep(4)}
          className="flex mobile:m-4 my-4 flex-row items-center gap-2  sm:px-6 lg:px-12  border border-[#0E3746] hover:bg-[#0E3746] text-[#3d6979] hover:text-white mobile:text-base text-sm transition px-4 py-2 rounded-[2rem]"
        >
          <FaArrowLeftLong /> Back
        </button>

       
          <button
            type="submit"
            onClick={createDAO}
            className="flex mobile:m-4 my-4 flex-row items-center gap-2 bg-[#0E3746] sm:px-6 lg:px-12  py-2 rounded-[2rem] text-white mobile:text-base text-sm whitespace-nowrap"
          >
            {loadingNext ? (
              <CircularProgress size={24} />
            ) : (
              "Create DAO"
            )}
          </button>
        
      </div>
    </div>
    </Container>
    <PaymentModal
         data={data}
        open={isModalOpen}
        onClose={handleCancel}
        onPay={async () => {
          await paymentTest();

        }}
        loading={loadingPayment}
        fileURL={fileURL}
      />
    </React.Fragment>
  );
};

export default Step6;

