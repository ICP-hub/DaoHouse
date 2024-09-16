import React, { useEffect, useRef, useState } from "react";
import { Link, Navigate, useLocation } from "react-router-dom";
import { useAuth, useAuthClient } from "../utils/useAuthClient";
import { LuChevronDown } from "react-icons/lu";
import LoginModal from "../Auth/LoginModal";
import { FaUser, FaSignOutAlt, FaSitemap, FaComments } from "react-icons/fa";
import logo from "../../../assets/ColorLogo.png";
import MyProfileImage from "../../../assets/Avatar.png";
import { useUserProfile } from "../../context/UserProfileContext";
import { toast } from "react-toastify";
import Container from "../Container/Container";
import { Principal } from "@dfinity/principal";
import { Actor, HttpAgent } from "@dfinity/agent";
import { idlFactory as ledgerIDL } from "./ledger.did";
import { createActor } from "../../../../declarations/icp_ledger_canister";
import UserDetailsModal from "./UserDetailsModal";
import { useNavigate } from "react-router-dom";



const Navbar = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false)
  const [isConnecting, setIsConnecting] = useState(false);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const hasShownToastRef = useRef(false);
  const { userProfile, fetchUserProfile } = useUserProfile() || {}; // Add fallback to avoid destructuring undefined
  const {
    login,
    isAuthenticated,
    signInNFID,
    logout,
    backendActor,
    stringPrincipal,
    identity
  } = useAuth();
  const location = useLocation();

  // const {createTokenActor, } = useAuthClient()

  const [username, setUsername] = useState("");
  const protocol = process.env.DFX_NETWORK === "ic" ? "https" : "http";
  const domain =
    process.env.DFX_NETWORK === "ic" ? "raw.icp0.io" : "localhost:4943";
  const [imageSrc, setImageSrc] = useState(MyProfileImage);

  const menuItems = [
    { label: "Home", route: "/" },
    { label: "Social Feed", route: "/social-feed" },
    { label: "DAOs", route: "/dao" },
  ];

  // const h =() =>{
  //  navigate( "/UserDetailsModal")
  // }


  // const host = "http://127.0.0.1:40335"

  // temp
  // const LEDGER_CANISTER_ID = "ryjl3-tyaaa-aaaaa-aaaba-cai";
  //  const createTokenActor = async (canisterId) => {

  //   //     console.log("identity : ",identity)
  //   // const authClient = await AuthClient.create();
  //   // const identity = await authClient.getIdentity();
  //   // console.log("identity : ", identity);
  //   // const principal = identity.getPrincipal();
  //   // console.log("ankur :", principal.toText());

  //   // const authClient = window.auth.client;


  //   const tokenActorrr = createActor(Principal.fromText("ryjl3-tyaaa-aaaaa-aaaba-cai"), { agentOptions: { identity } });


  //   // const agent = new HttpAgent({
  //   //   identity,
  //   //   host,
  //   // });
  //   // let tokenActor = Actor.createActor(ledgerIDL, {
  //   //   agent,
  //   //   canisterId,
  //   // });

  //   // return tokenActor
  //   return tokenActorrr

  // };

  // const fetchMetadataAndBalance = async (tokenActor, ownerPrincipal) => {
  //   console.log(tokenActor, ownerPrincipal.toText());
  //   try {
  //     const [metadata, balance] = await Promise.all([
  //       tokenActor.icrc1_metadata(),
  //       tokenActor.icrc1_balance_of({
  //         owner: ownerPrincipal,
  //         subaccount: [],
  //       }),
  //     ]);
  //     console.log("Fetched metadata:", metadata);
  //     return { metadata, balance };
  //   } catch (err) {
  //     console.error("Error fetching metadata and balance:", err);
  //     throw err;
  //   }
  // };

  // // aafter payment
  // const afterPaymentApprove = async (sendableAmount) => {
  //   console.log("total amout ", sendableAmount)
  //   console.log("after payment ")
  //   console.log(backendActor)


  //   // calling make payment
  //   const res = await backendActor.make_payment(sendableAmount, Principal.fromText(stringPrincipal))

  //   console.log("payment response is: ", res)
  // }


  // // for payment

  // const formatTokenMetaData = (arr) => {
  //   const resultObject = {};
  //   arr.forEach((item) => {
  //     const key = item[0];
  //     const value = item[1][Object.keys(item[1])[0]]; // Extracting the value from the nested object
  //     resultObject[key] = value;
  //   });
  //   return resultObject;
  // };

  // const transferApprove = async (
  //   currentBalance,
  //   currentMetaData,
  //   tokenActor
  // ) => {
  //   try {
  //     const decimals = parseInt(currentMetaData["icrc1:decimals"], 10);
  //     // const sendableAmount = parseInt(
  //     //   (0.1111) * Math.pow(10, decimals),
  //     //   10
  //     // );
  //     const sendableAmount = parseInt(
  //       10000
  //     );
  //     console.log("sendable amount console ", sendableAmount);
  //     console.log("current balance console ", currentBalance);

  //   const backendCanisterId = process.env.CANISTER_ID_DAOHOUSE_BACKEND;

  //     if (currentBalance > sendableAmount) {

  //       let transaction = {
  //         from_subaccount: [],
  //         spender: {
  //           owner: Principal.fromText(backendCanisterId),
  //           subaccount: [],
  //         },
  //         amount: Number(sendableAmount) + Number(currentMetaData["icrc1:fee"]),
  //         expected_allowance: [],
  //         expires_at: [],
  //         fee: [currentMetaData["icrc1:fee"]],
  //         memo: [],
  //         created_at_time: [],
  //       };
  //       console.log("transaction ", transaction);
  //       console.log("Token Actor ICRC2 APPROVE", tokenActor.icrc2_approve);
  //       const approveRes = await tokenActor.icrc2_approve(transaction);
  //       console.log("Payment Approve Response ", approveRes);
  //       if (approveRes.Err) {
  //         const errorMessage = `Insufficient funds. Balance: ${approveRes.Err.InsufficientFunds.balance}`;
  //         toast.error(errorMessage);
  //         return;
  //       } else {
  //         afterPaymentApprove(sendableAmount)
  //         // afterPaymentApprove(
  //         //   parseInt(approveRes?.Ok).toString(),
  //         //   sendableAmount,
  //         //   currentBalance
  //         // );
  //       }
  //     } else {
  //       console.log("Insufficient Balance to purchase");
  //       toast.error(
  //         `Insufficient balance. Balance : ${currentBalance / 10 ** 8}`
  //       );
  //     }
  //   } catch (err) {
  //     console.error("Error in transfer approve", err);
  //   } finally {
  //   }
  // };

  // async function paymentTest() {

  //   console.log("owner principal is ", stringPrincipal )
  //   console.log("printing payment");

  //   const backendCanisterId = process.env.CANISTER_ID_DAOHOUSE_BACKEND;

  //   const actor = await createTokenActor(Principal.fromText("ryjl3-tyaaa-aaaaa-aaaba-cai"))

  //   console.log("backend canister id: ", backendCanisterId)
  //   console.log("actor is ", actor)

  //   const name = await actor.icrc1_name()
  //   console.log("balance is ", name)

  //   const { metadata, balance }  = await fetchMetadataAndBalance(actor, Principal.fromText(stringPrincipal))

  //   const formattedMetadata = formatTokenMetaData(metadata);

  //   const parsedBalance = parseInt(balance, 10);
  //     console.log("Balance:", parsedBalance);

  //     transferApprove(parsedBalance, formattedMetadata, actor);



  // }

  useEffect(() => {
    if (!backendActor || userProfile) return;

    const createAndFetchUserProfile = async () => {
      try {
        const response = await backendActor.check_user_existance();

        if (response.Ok) {
          await fetchUserProfile();
        } else {
          const profileResponse = await backendActor.create_profile();

          if (profileResponse.Ok === null && !hasShownToastRef.current) {
            toast.success("User login successfully");
          } else if (!hasShownToastRef.current) {
            toast.error("User login failed");
          }

          await fetchUserProfile();

          if (!hasShownToastRef.current) {
            toast.warning("Please update your details");
          }
        }

        hasShownToastRef.current = true;
      } catch (error) {
        console.error("Error creating or fetching user profile:", error);
      }
    };

    createAndFetchUserProfile();
  }, [backendActor, fetchUserProfile]);

  useEffect(() => {
    if (userProfile?.profile_img) {
      setImageSrc(
        `${protocol}://${process.env.CANISTER_ID_IC_ASSET_HANDLER}.${domain}/f/${userProfile.profile_img}`
      );
    } else {
      setImageSrc(MyProfileImage);
    }

    setUsername(userProfile?.username || "");
  }, [userProfile]);

  useEffect(() => {
    if (isAuthenticated) {
      setIsModalOpen(false);
      setIsDetailsModalOpen(true);
    }
  }, [isAuthenticated]);

  const handleDetailsSubmit = (details) => {
    // Handle form submission
    console.log("User details submitted:", details);
    setIsDetailsModalOpen(false);
  };

  const handleLogin = async () => {
    setIsConnecting(true);
    await login("Icp").then(() => window.location.reload()).then(setIsDetailsModalOpen(false));
    navigate("/")
  };

  const handleNFIDLogin = async () => {
    setIsConnecting(true);
    await signInNFID();
  };

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      await logout();
      window.location.href = "/";
    } catch (error) {
      toast.error("Error during logout");
    } finally {
      setIsLoading(false);
    }
  };

  // const handleLoginPlug = async () => {
  //   setIsConnecting(true);
  //   await signInPlug().then(() => setIsModalOpen(false));
  // };

  const handleLoginModalOpen = () => {
    setIsConnecting(false);
    setIsModalOpen(true);
  };

  const dropdownItems = [
    {
      label: "Profile",
      route: "/my-profile",
      icon: <FaUser className="mr-2" />,
    },
    { label: "Dao", route: "/dao", icon: <FaSitemap className="mr-2" /> },
    {
      label: "Social Feed",
      route: "/social-feed",
      icon: <FaComments className="mr-2" />,
    },
    {
      label: "Logout",
      onClick: handleLogout,
      icon: <FaSignOutAlt className="mr-2" />,
    },
  ];

  const filteredDropdownItems =
    window.innerWidth < 769
      ? [
        ...dropdownItems.filter((item) => item.label !== "Logout"),
        dropdownItems.find((item) => item.label === "Logout"),
      ]
      : dropdownItems.filter(
        (item) => item.label === "Profile" || item.label === "Logout"
      );

  return (
    <nav>
      <div className="bg-white shadow-lg shadow-slate-900/20 shadow-b-2 fixed h-[90px] w-full z-50 ">

        <Container>
          <div className="tablet:px-20 small_phone:px-8 px-4 small_phone:py-5 py-3 flex justify-between items-center w-full">
            {/* Logo */}
            <Link className=" w-[33%]" to="/">
              <img
                src={logo}
                alt="DAO House"
                // className="mobile:h-10 small_phone:w-30 w-25 h-8 lg:ml-6"
                className="mobile:h-10 small_phone:w-30 w-25 h-8 "
              />
            </Link>
            {/* Navigation menu */}
            <div className=" big_phone:flex items-center tablet:space-x-10 space-x-6 hidden lg:w-[49%] gap-[40px]">
              {menuItems.map((item, index) => (
                <div
                  key={index}
                  className="text-lg font-normal font-inter leading-[19.36px] text-[#829095]"
                >
                  <Link
                    to={item.route}
                    className={`hover:text-[#05212C] hover:font-medium cursor-pointer text-[16px] text-[#829095] ${location.pathname === item.route
                        ? "font-semibold border-b-2 border-[#05212C] text-black"
                        : "border-transparent border-b-0.5"
                      }`}
                  >
                    {item.label}
                  </Link>
                </div>
              ))}
            </div>

            {/* User profile or login */}
            <div>
              {!isAuthenticated ? (

                <div className="flex items-center tablet:space-x-4 space-x-2">

                  <button
                    onClick={handleLoginModalOpen}
                    className="mobile:px-8 px-4 py-2 rounded-[27.5px] bg-[#0E3746] shadow-md shadow-[#abaeaf] text-white big_phone:text-base small_phone:text-sm text-xs"
                  >
                    {isModalOpen && isLoading ? "Connecting" : "Connect Wallet"}
                  </button>

                </div>
              ) : (
                <div className="relative">
                  {/* Updated flex container to align profile image and username */}
                  <div
                    className="flex items-center space-x-0.9 bg-white border border-[#0F3746] rounded-full px-4 py-2 cursor-pointer shadow-lg"
                    onClick={() => setDropdownVisible(!dropdownVisible)}
                  >

                    {/* Profile Image */}
                    <div className="w-10 h-10 flex items-center rounded-full overflow-hidden">
                      <img
                        src={imageSrc}
                        alt="User Avatar"
                        className="w-8 h-8 object-cover rounded-full"
                        onError={() => setImageSrc(MyProfileImage)} // Fallback to default image if the image fails to load
                      />
                    </div>
                    {(username || stringPrincipal) && (
                      <p className="text-black font-medium truncate w-20">
                        {username || stringPrincipal}
                      </p>
                    )}
                    <LuChevronDown />
                    {dropdownVisible && (
                      <div className="absolute top-full right-0 bg-white rounded-md border border-gray-300 shadow-md py-2 w-40">
                        {filteredDropdownItems.map((item, index) => (
                          <Link
                            key={index}
                            to={item.route || "#"}
                            onClick={item.onClick}
                            className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                          >
                            {item.icon}
                            <span>{item.label}</span>
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </Container>
        <LoginModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onLogin={handleLogin}
          // onLoginPlug={handleLoginPlug}
          onLoginNFID={handleNFIDLogin}
        />
      {/*  <UserDetailsModal
          isOpen={isDetailsModalOpen}
          onClose={() => setIsDetailsModalOpen(false)}
          onSubmit={handleDetailsSubmit}
        />*/}
      </div>
    </nav>
  );
};

export default Navbar;
