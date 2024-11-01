import React ,{useState} from "react";
import Tags from "../../../Components/MyProfile/Tags";
import PersonalLinksAndContactInfo from "../PersonalLinksAndContactInfo";
import { useUserProfile } from "../../../context/UserProfileContext";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { createActor } from "../../../../../declarations/icp_ledger_canister";
import { Principal } from "@dfinity/principal";
import { useAuth } from "../../utils/useAuthClient";

const AboutMe = () => {
  const className = "AboutMe";
  const { userProfile } = useUserProfile() || {};
  // const { stringPrincipal } = useParams();
  const principalstring = userProfile?.user_id?.toString() || "";
  const { backendActor, identity, stringPrincipal } = useAuth();
  const copyToClipboard = () => {
    navigator.clipboard.writeText(principalstring).then(() => {
      toast.success('Copied to clipboard!');
    }).catch((err) => {
      console.error('Could not copy text: ', err);
    });
  };

  const CopyIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" width="24" height="18">
      <path d="M384 336l-192 0c-8.8 0-16-7.2-16-16l0-256c0-8.8 7.2-16 16-16l140.1 0L400 115.9 400 320c0 8.8-7.2 16-16 16zM192 384l192 0c35.3 0 64-28.7 64-64l0-204.1c0-12.7-5.1-24.9-14.1-33.9L366.1 14.1c-9-9-21.2-14.1-33.9-14.1L192 0c-35.3 0-64 28.7-64 64l0 256c0 35.3 28.7 64 64 64zM64 128c-35.3 0-64 28.7-64 64L0 448c0 35.3 28.7 64 64 64l192 0c35.3 0 64-28.7 64-64l0-32-48 0 0 32c0 8.8-7.2 16-16 16L64 464c-8.8 0-16-7.2-16-16l0-256c0-8.8 7.2-16 16-16l32 0 0-48-32 0z" />
    </svg>
  );

  const [tokens, setTokens] = useState(0);

  console.log("tokens from about", tokens);
  const [loadingPayment, setLoadingPayment] = useState(false);

  const LEDGER_CANISTER_ID = "ryjl3-tyaaa-aaaaa-aaaba-cai";
  const createTokenActor = async (canisterId) => {
    console.log("canister id", canisterId);

    try {
      const tokenActorrr = createActor(Principal.fromText("ryjl3-tyaaa-aaaaa-aaaba-cai"), { agentOptions: { identity } });
      console.log("Created token actor successfully:", tokenActorrr);
      return tokenActorrr;
    } catch (err) {
      console.error("Error creating token actor:", err);
      throw err;
    }
  };
  const fetchMetadataAndBalance = async (tokenActor, ownerPrincipal) => {
    try {
      const [metadata, balance] = await Promise.all([
        tokenActor.icrc1_metadata(),
        tokenActor.icrc1_balance_of({ owner: ownerPrincipal, subaccount: [] }),
      ]);
      console.log("Metadata and balance fetched:", { metadata, balance });
      setTokens(balance);
      return { metadata, balance };
    } catch (err) {
      console.error("Error fetching metadata and balance:", err);
      throw err;
    }
  };

  createTokenActor();
  async function paymentTest() {
    console.log("owner principal is ", stringPrincipal);
    console.log("printing payment");

    const backendCanisterId = process.env.CANISTER_ID_DAOHOUSE_BACKEND;
    console.log("backend", backendCanisterId);
    console.log("ledger", LEDGER_CANISTER_ID);
    const a = Principal.fromText(LEDGER_CANISTER_ID)
    console.log("a", a);

    const actor = await createTokenActor(Principal.fromText(LEDGER_CANISTER_ID));
    console.log("actor", actor);


    try {

      const actor = await createTokenActor(Principal.fromText("ryjl3-tyaaa-aaaaa-aaaba-cai"));

      console.log("backend canister id: ", backendCanisterId);
      console.log("actor is ", actor);

      const name = await actor.icrc1_name();
      console.log("balance is ", name);

      const { metadata, balance } = await fetchMetadataAndBalance(actor, Principal.fromText(stringPrincipal));

      const formattedMetadata = formatTokenMetaData(metadata);
      const parsedBalance = parseInt(balance, 10);
      console.log("Balance:", parsedBalance);

      const sendableAmount = parseInt(10000);
      if (sendableAmount) {
        afterPaymentApprove(sendableAmount);
      }
    } catch (err) {
      // toast.error("Payment failed. Please try again.");
      setLoadingPayment(false);
    }
  }
  paymentTest();
  return (
    <div className={className + "w-full md:w-[100%] big_phone:w-full lg:w-[100%] xl:w-full"}>
      <div className=" mt-5">
        <h3 className="text-[#05212C] lg:text-[24px]  md:text-[18px] text-[16px] md:font-bold font-semibold">
          About Me
        </h3>
        <div className="md:mt-4 mt-2 mb-6 bg-[#F4F2EC] p-4 rounded-lg space-y-2">
            <div className="flex flex-col items-start">
              <p className="lg:text-[20px] md:text-[16px] text-[14px] font-semibold text-[#05212C] my-4 md:ml-2 md:mb-3">
                Balance
              </p>
            <div className="flex items-center w-full max-w-[1200px] bg-white lg:text-[16px] md:text-[14px] text-[12px] font-normal text-[#646464] p-1 rounded-lg">
              <span className="flex-grow p-2">{Number(tokens)}</span>
            </div>
          </div>
          <div className="flex flex-col items-start ">
            <p className="lg:text-[20px] md:text-[16px] text-[14px] font-semibold text-[#05212C] md:ml-2 md:mb-3">
              Principal Id
            </p>
            <div className="flex items-center w-full max-w-[1200px] bg-white lg:text-[16px] md:text-[14px] text-[12px] font-normal text-[#646464] p-1 rounded-lg">
              <span className="flex-grow p-2">{principalstring}</span>
              <button
                onClick={copyToClipboard}
                className="text-white p-2 rounded flex items-center justify-center ml-4"
                aria-label="Copy to clipboard"
              >
                <CopyIcon />
              </button>
            </div>
          </div>


          <p className="lg:text-[20px] md:text-[16px] text-[14px] font-semibold text-[#05212C] md:ml-2 my-4 md:mb-3 break-words">
         
            Description
          </p>
          <div className="bg-white lg:text-[16px] md:text-[14px] text-[12px] font-normal text-[#646464] p-3 my-2 rounded-lg">
            {userProfile?.description || "No Data"}
          </div>
          <p className="lg:text-[20px] md:text-[16px] text-[14px] font-semibold text-[#05212C] md:ml-2 md:mb-3 mt-6">
            Tags That Defines You
          </p>
          {userProfile?.description ? (
            <Tags tags={userProfile?.tag_defines || []} />
          ) : (
            <div className="bg-white lg:text-[16px] md:text-[14px] text-[12px] font-normal text-[#646464] p-3 my-2 rounded-lg">
              No Data
            </div>
          )}

          <p className="lg:text-[20px] md:text-[16px] text-[14px] font-semibold text-[#05212C] ml-2 mb-3 mt-6">
            Personal Links & Contact Info
          </p>
          {userProfile?.contact_number ? (
            <PersonalLinksAndContactInfo
              links={[
                { icon: "phone-icon", 
                  name: "Phone", 
                  value: userProfile?.contact_number || "No Data"
                },
                { icon: "email-icon", 
                  name: "Email", 
                  value: userProfile?.email_id || "No Data"
                },
                { icon: "X-icon", 
                  name: "X", 
                  value: userProfile?.twitter_id || "No Data"
                },
                { icon: "telegram-icon", 
                  name: "Telegram", 
                  value: userProfile?.telegram || "No Data"
                },
                { icon: "web-icon", 
                  name: "Web", 
                  value: userProfile?.website || "No Data"
                },
              ]}
            />
          ) : (
            <div className="bg-white lg:text-[16px] md:text-[14px] text-[12px] font-normal text-[#646464] p-3 my-2 rounded-lg">
              No Data
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AboutMe;
