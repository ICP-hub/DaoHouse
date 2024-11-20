// import React, { createContext, useContext, useState, useEffect } from "react";
// import { useAgent, useIdentityKit } from "@nfid/identitykit/react";
// import { createActor } from "../../../declarations/daohouse_backend/index.js";
// import { Navigate, useNavigate } from "react-router-dom";
// import toast from "react-hot-toast";
// import { DelegationIdentity } from "@dfinity/identity";
// import { Actor, HttpAgent } from "@dfinity/agent";
// import { idlFactory as DaoFactory } from "../../../declarations/dao_canister/index.js";
// import { idlFactory as ledgerIDL } from "../Components/utils/ledger.did.js";


// const AuthContext = createContext();

// const canisterID = process.env.CANISTER_ID_DAOHOUSE_BACKEND;
// export const useAuthClient = () => {
//   const [isConnected, setIsConnected] = useState(false);
//   const signerId = localStorage.getItem("signerId");
//   const [wallet, setWallet] = useState("");
//   // const [delegationExpiry, setDelegationExpiry] = useState(null)
//   const delegationExpiry =
//     Number(localStorage.getItem("delegationExpiry")) || 0;
//   const {
//     user,
//     connect,
//     disconnect: identityKitDisconnect,
//     identity,
//     icpBalance,
//   } = useIdentityKit();
 
  
//   const authenticatedAgent = useAgent();

//   const disconnect = () => {
//     identityKitDisconnect();
//     setIsConnected(false);
//     localStorage.removeItem("delegationExpiry");
//   };
//   // console.log("deligation", delegationExpiry);
 
  

//   const checkDelegationExpiry = () => {
//     if (delegationExpiry) {
//       const currentTime = Date.now();
//       console.log(
//         "Delegation Expiry Time:",
//         new Date(delegationExpiry).toLocaleString()
//       );

//       if (currentTime >= delegationExpiry) {
//         toast.success("Delegation expired, logging out...");
//         disconnect();
//         //window.location.href = "/login";
//         setTimeout(() => {
//           window.location.reload(true); // Force page reload
//         }, 2000); // Optional delay to allow toast to show fully
//       }
//     }
//   };

//   useEffect(() => {
//     if (user && identity !== "AnonymousIdentity") {
//       setIsConnected(true);

//       const expiryTime = Number(
//         identity?._delegation?.delegations?.[0]?.delegation?.expiration
//       );
//       if (expiryTime) {
//         localStorage.setItem("delegationExpiry", expiryTime / 1e6);
//       }

//       // const expiryTime = Date.now() + 30 * 1000;

//       // if (expiryTime) {
//       //   setDelegationExpiry(expiryTime);
//       // }

//       if (signerId === "InternetIdentity") {
//         setWallet("internetidentity");
//       } else if (signerId === "NFIDW") {
//         setWallet("nfidw");
//       } else {
//         setWallet("sometingwrong");
//       }

//       const interval = setInterval(checkDelegationExpiry, 1000);

//       return () => clearInterval(interval);
//     } else {
//       setIsConnected(false);
//     }
//   }, [user, delegationExpiry, connect]);
//   const createDaoActor = (canisterId) => {
//     try {
//       const agent = new HttpAgent({ identity });
//       console.log(identity);
      

//       if (process.env.DFX_NETWORK !== 'production') {
//         agent.fetchRootKey().catch(err => {
//           console.warn('Unable to fetch root key. Check to ensure that your local replica is running');
//           console.error(err);
//         });
//       }

//       return Actor.createActor(DaoFactory, { agent, canisterId });
//     } catch (err) {
//       console.error("Error creating DAO actor:", err);
//     }
//   };
//   const backendCanisterId =
//   process.env.CANISTER_ID_DAOHOUSE_BACKEND ||
//   process.env.BACKEND_CANISTER_CANISTER_ID;

// const frontendCanisterId =
//   process.env.CANISTER_ID_DAOHOUSE_FRONTEND ||
//   process.env.FRONTEND_CANISTER_CANISTER_ID || process.env.CANISTER_ID;
//   return {
//     identity,
//     frontendCanisterId,
//     backendCanisterId,
//     isConnected,
//     delegationExpiry,
//     wallet,
//     login: connect,
//     logout: disconnect,
//     balance: icpBalance,
//     principals: user?.principal,
//     isAuthenticated: isConnected,
//     createDaoActor,
//     backendActor: createActor(canisterID, {
//       agentOptions: { identity, verifyQuerySignatures: false },
//     }),
//   };
// };

// export const AuthProvider = ({ children }) => {
//   const auth = useAuthClient();
//   return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
// };

// export const useAuth = () => useContext(AuthContext);




















import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import { useAgent, useIdentityKit } from "@nfid/identitykit/react";
import { Actor, HttpAgent } from "@dfinity/agent";

import { createActor } from "../../../declarations/daohouse_backend/index.js";

import { idlFactory as ledgerIDL } from "./ledger.did.js";
const AuthContext = createContext();

const canisterID = process.env.CANISTER_ID_ICPLAUNCHPAD_BACKEND;
export const useAuthClient = () => {
    const identityKit = useIdentityKit();


    const [isConnected, setIsConnected] = useState(false);
    const [principal, setPrincipal] = useState(null);
    const [backendActor, setBackendActor] = useState(createActor(canisterID));
    const [orderPlacementLoad, setOrderPlacementLoad] = useState(false);
    const [delegation, setDelegation] = useState(null);
    const [agent, setAgent] = useState(null);
    const authenticatedAgent = useAgent()
    const [isLoading, setIsLoading] = useState(true);
    const {
        // agent,
        user,
        identity,
        accounts,
        connect,
        disconnect,
    } = useIdentityKit();

const frontendCanisterId =
  process.env.CANISTER_ID_DAOHOUSE_FRONTEND ||
  process.env.FRONTEND_CANISTER_CANISTER_ID || process.env.CANISTER_ID;
    
    useEffect(() => {
        const createAgent = async () => {
            if (authenticatedAgent) {
                console.log("Authenticated Agent Identity:", authenticatedAgent);

                setIsLoading(true);
                const agentInstance = new HttpAgent({ host: process.env.HOST || "https://ic0.app" });
                if (process.env.DFX_NETWORK !== "ic") {
                    await agentInstance.fetchRootKey();
                }
            console.log(" agent created:", agentInstance);
                const newActor = Actor.createActor(ledgerIDL, {
                    agent: agentInstance,
                    canisterId: canisterID,
                });
            
                setAgent(authenticatedAgent);
                setBackendActor(newActor);

                
                console.log("Actor and Agent initialized successfully.");
            } else {
                setIsLoading(false);
                console.error("Failed to initialize agent and actor:", error);
            }
        };
     
        createAgent();
    }, [authenticatedAgent]);
      


    //actor
    useEffect(() => {
        if (agent) {
            const initActor = async () => {
                try {
                    const actor = createActor(process.env.CANISTER_ID_DAOHOUSE_BACKEND, { agent });
                    
                   
                    console.log("Authenticated actor initialized.");
                } catch (error) {
                    console.error("Failed to create actor:", error);
                }
            };
            initActor();
        }
    }, [agent, ]);

  

    useEffect(() => {
        const fetchPrincipal = async () => {
            if (user) {
                setIsConnected(true);
                try {
                    const userPrincipal = await user.principal;
                    setPrincipal(userPrincipal);
                
                } catch (error) {
                    console.error("Error fetching principal:", error);
                    setPrincipal(null);
                }
            } else {
                setIsConnected(false);
                setPrincipal(null);
            }
        };
        fetchPrincipal();
    }, [user]);


  
    useEffect(() => {
        const genCanister = async () => {
            const backend = Actor.createActor(ledgerIDL, {
                agent: agent,
                canisterId: canisterID,
            });
            setBackendActor(backend);
        };
        genCanister();
        setDelegation(identity);
        console.log("delegation is ", delegation);
    }, [agent]);
 

    const login = useCallback(() => {
        connect();
        
    }, [connect]);

    // const logout = useCallback(async () => {
    //     await disconnect();
    //     setIsConnected(false);
    //     setPrincipal(null);
    //     setBackendActor(null);
    //     setAgent(null);
    // }, [disconnect]);
    // const host = "http://127.0.0.1:4943/";
    // const createDaoActor = async (canisterId) => {
    //     try {
    //         console.log("Identity value before agent creation:", identity);
    //         console.log("Creating actor for canister ID:", canisterId);

    //         const agent = new HttpAgent({ identity, host });

    //         if (process.env.DFX_NETWORK !== "ic") {
    //             await agent.fetchRootKey().catch((err) => {
    //                 console.warn(
    //                     "Unable to fetch root key. Check your local replica.",
    //                     err
    //                 );
    //             });
    //         }

    //         const ledgerActor = Actor.createActor(ledgerIDL, { agent, canisterId });
    //         console.log("Created ledger actor:", ledgerActor);
    //         return ledgerActor;
    //     } catch (err) {
    //         console.error("Error creating ledger actor:", err);
    //     }
    // };

    return {
        isAuthenticated: isConnected,
        isConnected,
        login,
        logout: disconnect,
        principal,
        agent: agent || null,
        createDaoActor: backendActor || null,
        // createDaoActor,
        identity,
        orderPlacementLoad,
        frontendCanisterId,
        setOrderPlacementLoad,
        canisterID,
        backendActor: createActor(canisterID, {
            agentOptions: { identity, verifyQuerySignatures: false },
        }),
    };
};

export const AuthProvider = ({ children }) => {
    const auth = useAuthClient();
   

    useEffect(() => {
     
        if (auth) { // This will log the data
            console.log("Auth is ", auth);
           
        }
    }, [auth, ]);
    console.log("Auth is ", auth);
    return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
};

export const useBackend = () => { };

export const useAuth = () => useContext(AuthContext);










