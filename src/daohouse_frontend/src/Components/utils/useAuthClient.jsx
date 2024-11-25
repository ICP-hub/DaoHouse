// import React, { createContext, useContext, useEffect, useState } from "react";
// import { AuthClient } from "@dfinity/auth-client";
// import { createActor, idlFactory as BackendidlFactory } from "../../../../declarations/daohouse_backend/index";
// import { Principal } from "@dfinity/principal";

// import { HttpAgent, Actor, AnonymousIdentity } from "@dfinity/agent";

// import { NFID } from "@nfid/embed";
// import { idlFactory as DaoFactory } from "../../../../declarations/dao_canister/index"
// import { idlFactory as ledgerIDL } from "./ledger.did";

// const AuthContext = createContext();

// const defaultOptions = {
//   createOptions: {
//     idleOptions: {
//       idleTimeout: 1000 * 60 * 30, // set to 30 minutes
//       disableDefaultIdleCallback: true, // disable the default reload behavior
//     },
//   },
//   loginOptionsIcp: {
//     identityProvider:
//       process.env.DFX_NETWORK === "ic"
//                 ? "https://identity.ic0.app/#authorize"
//                 : `http://${process.env.CANISTER_ID_INTERNET_IDENTITY}.localhost:4943`,
//   },
//   loginOptionsNfid: {
//     identityProvider:
//       process.env.DFX_NETWORK === "ic"
//         ? `https://nfid.one/authenticate/?applicationName=my-ic-app#authorize`
//         : `https://nfid.one/authenticate/?applicationName=my-ic-app#authorize`
//   },
// };


// export const useAuthClient = (options = defaultOptions) => {
//   const [authClient, setAuthClient] = useState(null);
//   const [isAuthenticated, setIsAuthenticated] = useState(false);
//   const [identity, setIdentity] = useState(null);
//   const [principal, setPrincipal] = useState(null);
//   const [backendActor, setBackendActor] = useState(null);
//   const [stringPrincipal, setStringPrincipal] = useState(null);
//   const [nfid, setNfid] = useState(null);
//   const [error, setError] = useState(null);

//   const getPrincipalId = (principal) => {
//     if (principal) {
//       const principalIdArray = Array.from(principal?._arr || []);
//       return Buffer.from(principalIdArray).toString("base64");
//     }
//     return null;
//   };


//   const backendCanisterId =
//     process.env.CANISTER_ID_DAOHOUSE_BACKEND ||
//     process.env.BACKEND_CANISTER_CANISTER_ID;

//   const frontendCanisterId =
//     process.env.CANISTER_ID_DAOHOUSE_FRONTEND ||
//     process.env.FRONTEND_CANISTER_CANISTER_ID || process.env.CANISTER_ID;

//   const clientInfo = async (client, identity) => {
//     const isAuthenticated = await client.isAuthenticated();
//     const principal = identity.getPrincipal();
//     setAuthClient(client);
//     setIsAuthenticated(isAuthenticated);
//     setIdentity(identity);    
//     setPrincipal(principal);
//     setStringPrincipal(principal.toString());    
//     if (isAuthenticated && identity && principal && principal.isAnonymous() === false) {
//       const backendActor = createActor(backendCanisterId, { agentOptions: { identity, verifyQuerySignatures: false } });
//       setBackendActor(backendActor);
//     }
//     //just to try for use api for annonymus user 
//     else if (principal.isAnonymous() === true){
//       const backendActor = createActor(backendCanisterId, { agentOptions: { identity, verifyQuerySignatures: false } });
//       setBackendActor(backendActor);
//     }

//     return true;
//   };

//   useEffect(() => {
//     const initializeAuth = async () => {
//       const authClient = await AuthClient.create(options.createOptions);
//       await clientInfo(authClient, authClient.getIdentity());

//       // if (window.ic?.plug) {
//       //   const isPlugConnected = await window.ic.plug.isConnected();
//       //   if (isPlugConnected) {
//       //     if (!window.ic.plug.agent) {
//       //       await window.ic.plug.createAgent();
//       //     }
//       //     const principal = await window.ic.plug.agent.getPrincipal();
//       //     const backendActor = await window.ic.plug.createActor({
//       //       canisterId: backendCanisterId,
//       //       interfaceFactory: BackendidlFactbackendCanisterIdory,
//       //     });
//       //     setBackendActor(backendActor);
//       //     setIdentity(window.ic.plug.agent);
//       //     setIsAuthenticated(true);
//       //     setPrincipal(principal);
//       //   } else {
//       //     console.log("Plug wallet is not connected.");
//       //   }

//       // }


//     };

//     initializeAuth();
//   }, []);





//   const login = async (val) => {
//     return new Promise(async (resolve, reject) => {
//       try {
//         if (
//           authClient.isAuthenticated() &&
//           (await authClient.getIdentity().getPrincipal().isAnonymous()) ===
//           false
//         ) {
//           resolve(clientInfo(authClient, authClient.getIdentity()));
//         } else {
//             const opt = val === "Icp" ? "loginOptionsIcp" : "loginOptionsNfid";
//             await authClient.login({
//               ...options[opt],
//               onError: (error) => reject(error),
//               onSuccess: () => resolve(clientInfo(authClient, authClient.getIdentity())),
//             });
//         }
//       } catch (error) {
//         reject(error);
//       }
//     });
//   };

//   // const signInPlug = async () => {
//   //   if (!window.ic?.plug) throw new Error("Plug not installed");

//   //   const whitelist = [frontendCanisterId, backendCanisterId];
//   //   const host = process.env.DFX_NETWORK === "ic" ? "https://mainnet.dfinity.network" : "http://127.0.0.1:4943";
//   //   console.log("Host : ", host)
//   //   const isConnected = await window.ic.plug.requestConnect({ whitelist, host });
//   //   console.log("isconnected : ", isConnected)

//   //   if (isConnected) {
//   //     const principal = await window.ic.plug.agent.getPrincipal();
//   //     const identity = window.ic.plug.agent;


//   //     setIsAuthenticated(prev => ({ ...prev, plug: true }));
//   //     setIdentity(identity);
//   //     console.log(identity);

//   //     setPrincipal(principal);
//   //     console.log(principal);



//   //     // const userActor = await window.ic.plug.createActor({
//   //     //   canisterId: frontendCanisterId,
//   //     //   interfaceFactory: DaoFactory
//   //     // });
//   //     // console.log("userActor", userActor);

//   //     const backendActor = await window.ic.plug.createActor({
//   //       canisterId: backendCanisterId,
//   //       interfaceFactory: BackendidlFactory
//   //     })
//   //     console.log("ExtActor", backendActor);
//   //     setBackendActor(backendActor );
//   //     console.log(backendActor);

//   //     return backendActor
//   //     // return userActor
//   //   } else {
//   //     throw new Error("Plug connection refused");
//   //   }
//   // };



//   useEffect(() => {
//     const initNFID = async () => {
//       try {
//         const nfIDInstance = await NFID.init({
//           application: {
//             name: "NFID Login",
//             logo: "https://dev.nfid.one/static/media/id.300eb72f3335b50f5653a7d6ad5467b3.svg"
//           }
//         });
//         setNfid(nfIDInstance);
//       } catch (error) {
//         setError("Failed to initialize NFID.");
//       }
//     };

//     initNFID();
//   }, []);


//   // const host = "http://127.0.0.1:4943"
//   const host = "http://127.0.0.1:40335"

//   // temp
//   const LEDGER_CANISTER_ID = "ryjl3-tyaaa-aaaaa-aaaba-cai";
//    const createTokenActor = async (canisterId) => {

//     //     console.log("identity : ",identity)
//     // const authClient = await AuthClient.create();
//     // const identity = await authClient.getIdentity();
//     // console.log("identity : ", identity);
//     // const principal = identity.getPrincipal();
//     // console.log("ankur :", principal.toText());

//     // const authClient = window.auth.client;
//     const agent = new HttpAgent({
//       identity,
//       host,
//     });
//     let tokenActor = Actor.createActor(ledgerIDL, {
//       agent,
//       canisterId,
//     });

//     return tokenActor
//   };
//   // temp

//   const signInNFID = async () => {
//     if (!nfid) {
//       console.error("NFID is not initialized.");
//       return;
//     } else {
//       console.log("nfid", nfid);

//     }

//     const canisterArray = [process.env.CANISTER_ID_DAOHOUSE_BACKEND];

//     try {
//       const delegationResult = await nfid.getDelegation({ targets: canisterArray, maxTimeToLive: BigInt(8) * BigInt(3_600_000_000_000) });


//       const isLogin = await nfid.getDelegationType();
//       // const identity = delegationResult.getIdentity();
//       const agent = new HttpAgent({ identity: delegationResult });

//       if (process.env.DFX_NETWORK !== 'ic') {
//         await agent.fetchRootKey();
//       }

//       const backendActor = Actor.createActor({
//         canisterId: backendCanisterId,
//         interfaceFactory: BackendidlFactory,
//       });
//       setBackendActor(backendActor);

//       const identity = await nfid.getIdentity();
//       const theUserPrincipal = identity.getPrincipalId.toText();
//       setIsAuthenticated(true);
//       setIdentity(identity);
//       setPrincipal(theUserPrincipal);

//       await clientInfo({ 
//         isAuthenticated: () => true, 
//         getIdentity: () => ({ getPrincipal: () => theUserPrincipal })
//       }, theUserPrincipal);

//     } catch (error) {
//       console.error("Error during NFID authentication:", error);
//       setError("Failed to authenticate with NFID. Please check the canister ID and network settings.");
//     }
//   };



//   const createDaoActor = (canisterId) => {
//     try {
//       const agent = new HttpAgent({ identity });      

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

//   // const disconnectPlug = async () => {
//   //   if (window.ic?.plug) {
//   //     try {
//   //       await window.ic.plug.disconnect();
//   //       setIsAuthenticated(false);
//   //       setIdentity(null);
//   //       setPrincipal(null);
//   //       setBackendActor(null);
//   //       console.log("Disconnected from Plug wallet.");
//   //     } catch (error) {
//   //       console.error("Failed to disconnect from Plug wallet:", error);
//   //     }
//   //   }
//   // };

//   const logout = async () => {
//     await authClient?.logout();
//     // disconnectPlug();
//   };

//   return {
//     login,
//     logout,
//     authClient,
//     // signInPlug,
//     signInNFID,
//     isAuthenticated,
//     identity,
//     principal,
//     getPrincipalId,
//     frontendCanisterId,
//     backendCanisterId,
//     backendActor,
//     stringPrincipal,
//     createDaoActor,
//     createTokenActor
//   };
// };

// export const AuthProvider = ({ children }) => {
//   const auth = useAuthClient();
//   if (!auth.isAuthenticated || !auth.backendActor) {
//     return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
//   }
//   return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
// };

// export const useAuth = () => useContext(AuthContext);

import { AuthClient } from "@dfinity/auth-client";
import React, { createContext, useContext, useEffect, useState } from "react";
import { HttpAgent, Actor } from "@dfinity/agent";
import { AccountIdentifier } from "@dfinity/ledger-icp";
import {
  createActor,
  idlFactory,
} from "../../../../declarations/daohouse_backend/index";



import { idlFactory as BackendidlFactory } from "../../../../declarations/daohouse_backend/index";
import { Principal } from "@dfinity/principal";

import { NFID } from "@nfid/embed";
import { idlFactory as DaoFactory } from "../../../../declarations/dao_canister/index";
import { useSelector } from "react-redux";

// Create a React context for authentication state
const AuthContext = createContext();

const defaultOptions = {
  createOptions: {
    idleOptions: {
      idleTimeout: 1000 * 60 * 30, // set to 30 minutes
      disableDefaultIdleCallback: true, // disable default reload behavior
    },
  },
  loginOptionsii: {
    identityProvider:
      process.env.DFX_NETWORK === "ic"
        ? "https://identity.ic0.app/#authorize"
        : `http://${process.env.CANISTER_ID_INTERNET_IDENTITY}.localhost:4943`,
  },
  loginOptionsnfid: {
    identityProvider:
      process.env.DFX_NETWORK === "ic"
        ? `https://nfid.one/authenticate/?applicationName=my-ic-app#authorize`
        : `https://nfid.one/authenticate/?applicationName=my-ic-app#authorize`,
  },
  loginOptionsPlug: {
    whitelist: [process.env.CANISTER_ID_DAOHOUSE_BACKEND], // Whitelist the backend canister

    host:
      process.env.DFX_NETWORK === "ic"
        ? "https://ic0.app"
        : "http://localhost:3000",
  },
};

// Custom hook to manage authentication with Internet Identity or Plug
export const useAuthClient = (options = defaultOptions) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [accountIdString, setAccountIdString] = useState("");
  const [stringPrincipal, setStringPrincipal] = useState(null);
  const [authClient, setAuthClient] = useState(null);
  const [identity, setIdentity] = useState(null);
  const [principal, setPrincipal] = useState(null);
  console.log("principal state", principal);

  const [backendActor, setBackendActor] = useState(null);
  const [accountId, setAccountId] = useState(null);
  const [connected, setConnected] = useState(false);
  const {
    isWalletCreated,
    isWalletModalOpen,
    isSwitchingWallet,
    connectedWallet,
  } = useSelector((state) => state.utility);
  useEffect(() => {
    // Create AuthClient and check if Plug principal is in local storage
    AuthClient.create(options.createOptions).then(async (client) => {
      setAuthClient(client);

      const savedPrincipal = localStorage.getItem("plugPrincipal");
      console.log("saved", savedPrincipal);

      if (savedPrincipal) {
        try {
          // Check if Plug is already connected
          const isPlugConnected = await window.ic?.plug?.isConnected();
          console.log("plug ", isPlugConnected);

          if (isPlugConnected) {
            // Reconnect to Plug and fetch the principal again
            const plugPrincipal = await window.ic.plug.agent.getPrincipal();
            console.log("plug Principal", plugPrincipal);


            setPrincipal(plugPrincipal.toString());
            setIsAuthenticated(true);


            const accountId = AccountIdentifier.fromPrincipal({
              principal: plugPrincipal,
            });
            console.log("account id", accountId);

            // Update accountId and backendActor
            setAccountId(toHexString(accountId.bytes));
            setAccountIdString(toHexString(accountId.bytes));

            const backendActor = await window.ic.plug.createActor({
              canisterId: process.env.CANISTER_ID_DAOHOUSE_BACKEND,
              interfaceFactory: idlFactory,
            });
            setBackendActor(backendActor);
            console.log("backendactir in useauth", backendActor);

            console.log(
              "Reconnected to Plug. Principal:",
              plugPrincipal.toString()
            );
          } else {
            // If Plug is not connected, remove the stored principal
            localStorage.removeItem("plugPrincipal");
          }
        } catch (error) {
          console.error("Error reconnecting to Plug:", error);
        }
      }
    });
  }, []);

  useEffect(() => {
    AuthClient.create(options.createOptions).then(async (client) => {
      setAuthClient(client);
      const savedPrincipal = localStorage.getItem("plugPrincipal");
      console.log("ajjsdlkajsdlkjasldkjaslkdjlaksdj", savedPrincipal);



      if (savedPrincipal) {
        console.log("in");
        setIsAuthenticated(true);
        setPrincipal(savedPrincipal);
        // Set to true only if authenticated
      } else {
        // Clear stored principal if not authenticated
        console.log("out");

        localStorage.removeItem("plugPrincipal");
      }

    });
  }, []);

  useEffect(() => {
    if (authClient) {
      updateClient(authClient);
    }
  }, [authClient]);

  // Helper function to convert binary data to a hex string
  const toHexString = (byteArray) => {
    return Array.from(byteArray, (byte) =>
      ("0" + (byte & 0xff).toString(16)).slice(-2)
    ).join("");
  };
  const createDaoActor = (canisterId) => {
    try {
      const agent = new HttpAgent({ identity });

      if (process.env.DFX_NETWORK !== 'production') {
        agent.fetchRootKey().catch(err => {
          console.warn('Unable to fetch root key. Check to ensure that your local replica is running');
          console.error(err);
        });
      }

      return Actor.createActor(DaoFactory, { agent, canisterId });
    } catch (err) {
      console.error("Error creating DAO actor:", err);
    }
  };

  const login = async (provider) => {
    return new Promise(async (resolve, reject) => {
      try {
        if (
          authClient.isAuthenticated() &&
          !(await authClient.getIdentity().getPrincipal().isAnonymous())
        ) {
          // If already authenticated and not anonymous, update and resolve
          updateClient(authClient);
          setIsAuthenticated(true); // Set isAuthenticated to true if not anonymous
          resolve(authClient);
        } else {
          const opt = getLoginOptions(provider);

          if (provider === "plug") {
            // Check if Plug wallet is available
            if (window.ic?.plug) {
              // Request connection to Plug
              const connect = await window.ic.plug.requestConnect({
                whitelist: [process.env.CANISTER_ID_DAOHOUSE_BACKEND], // Whitelist the backend canister
                host:
                  process.env.DFX_NETWORK === "ic"
                    ? "https://ic0.app"
                    : "http://localhost:3000",
                // Use correct host for local vs mainnet
              });
              const connected = (async () => {
                const result = await window.ic.plug.isConnected();
                console.log(`Plug connection is ${result}`);
              })();
              setConnected(connected);
              if (connected) {
                // Set up Plug agent
                await window.ic.plug.createAgent({
                  whitelist: [process.env.CANISTER_ID_DAOHOUSE_BACKEND, "dmalx-m4aaa-aaaaa-qaanq-cai", "dxfxs-weaaa-aaaaa-qaapa-cai", "gl6nx-5maaa-aaaaa-qaaqq-cai"], // Whitelist the backend canister
                  host:
                    process.env.DFX_NETWORK === "ic"
                      ? "https://ic0.app"
                      : "http://localhost:3000"
                });

                // Get principal from Plug wallet
                const plugPrincipal = await window.ic.plug.agent.getPrincipal();
                setPrincipal(plugPrincipal.toString());
                console.log("Plug principal:", plugPrincipal.toString());

                // Derive account ID from principal
                const accountId = AccountIdentifier.fromPrincipal({
                  principal: plugPrincipal,
                });

                // Store principal and account ID in localStorage
                localStorage.setItem("plugPrincipal", plugPrincipal.toString());
                setAccountId(toHexString(accountId.bytes));
                setAccountIdString(toHexString(accountId.bytes));
                console.log("account Id", accountId);

                const storedPrincipal = localStorage.getItem("plugPrincipal");
                if (storedPrincipal) {
                  setPrincipal(storedPrincipal);
                } else {
                  console.warn("Plug Principal not found in localStorage.");
                }



                // Create the backend actor using the IDL factory
                const backendActor = await window.ic.plug.createActor({
                  canisterId: process.env.CANISTER_ID_DAOHOUSE_BACKEND, // Backend canister ID
                  interfaceFactory: idlFactory, // IDL factory for backend canister
                });

                setBackendActor(backendActor);

                console.log("backendActor in plug function", backendActor);
                setIsAuthenticated(true); // Manually set to true after successfully retrieving principal
                if (backendActor) {
                  console.log("sssss");

                  await checkUser(plugPrincipal.toString());
                }
                // updateClient(authClient); // Update the client session

                // Resolve the promise with the authClient after success
                resolve(authClient);
              } else {
                reject("Plug connection failed");
              }
            } else {
              // Plug wallet is not installed
              alert(
                "Plug wallet is not installed. Please install the Plug wallet extension."
              );
              reject("Plug wallet not installed");
            }
          } else {
            // If not Plug, handle other providers (e.g., Internet Identity)
            authClient.login({
              ...opt,
              onError: (error) => reject(error),
              onSuccess: () => {
                updateClient(authClient);
                setIsAuthenticated(true); // Manually set isAuthenticated to true
                navigate("/"); // Redirect to dashboard after successful login
                resolve(authClient);
              },
            });
          }
        }
      } catch (error) {
        console.error("Login error:", error);
        reject(error); // Reject promise in case of error
      }
    });
  };

  const getLoginOptions = (provider) => {
    switch (provider) {
      case "ii":
        return options.loginOptionsii;
      case "nfid":
        return options.loginOptionsnfid;
      case "plug":
        return options.loginOptionsPlug;
      default:
        throw new Error(`Unsupported provider: ${provider}`);
    }
  };

  const logout = async () => {
    try {
      await authClient.logout();
      localStorage.removeItem("plugPrincipal"); // Clear the stored principal
      setIsAuthenticated(false);
      setIdentity(null);
      setPrincipal(null);
      setBackendActor(null);
      setAccountId(null);
      if (!isSwitchingWallet) {
        window.location.reload();
      }
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const updateClient = async (client) => {
    try {
      const isAuthenticated = await client.isAuthenticated();
      setIsAuthenticated(isAuthenticated);
      const identity = client.getIdentity();
      setIdentity(identity);

      const principal = identity.getPrincipal();
      setPrincipal(principal.toString());
      setStringPrincipal(principal.toString());

      const accountId = AccountIdentifier.fromPrincipal({ principal });
      setAccountId(toHexString(accountId.bytes));
      setAccountIdString(toHexString(accountId.bytes));

      const agent = new HttpAgent({ identity });
      const backendActor = createActor(
        process.env.CANISTER_ID_DAOHOUSE_BACKEND,
        { agent }
      );
      setBackendActor(backendActor);
      console.log("backendActor", backendActor);
      if (backendActor) {
        await checkUser(principal.toString());
      } else {
        console.error("Backend actor initialization failed.");
      }
    } catch (error) {
      console.error("Authentication update error:", error);
    }
  };
  const createLedgerActor = async (canisterId, IdlFac) => {
    let actor;
    let agent;

    try {
      if (window.ic?.plug) {
        // Check if Plug is connected
        const isPlugConnected = await window.ic.plug.isConnected();
        if (!isPlugConnected) {
          throw new Error("Plug wallet is not connected");
        }

        // Create Plug agent
        await window.ic.plug.createAgent({
          whitelist: [canisterId],
          host:
            process.env.DFX_NETWORK === "ic"
              ? "https://ic0.app"
              : "http://localhost:3000",
        });

        agent = window.ic.plug.agent;
        if (!agent) {
          throw new Error("Failed to create Plug agent");
        }
        // await window?.ic?.plug?.requestConnect({
        //   whitelist: [canisterId],
        // });
        // Create actor with Plug
        actor = await window.ic.plug.createActor({
          canisterId: canisterId,
          interfaceFactory: IdlFac,
          // agent: agent
        });
      } else {
        // Non-Plug case (e.g., Internet Identity)
        agent = new HttpAgent({ identity });

        if (process.env.DFX_NETWORK !== "ic") {
          agent.fetchRootKey().catch((err) => {
            console.warn("Unable to fetch root key. Is the local replica running?");
            console.error(err);
          });
        }

        // Create actor with HttpAgent
        actor = Actor.createActor(IdlFac, { agent, canisterId });
      }

      console.log("Ledger Actor", actor);
      return actor;
    } catch (error) {
      console.error("Error creating ledger actor:", error);
    }
  };

  const reloadLogin = async () => {
    try {
      if (
        authClient.isAuthenticated() &&
        !(await authClient.getIdentity().getPrincipal().isAnonymous())
      ) {
        updateClient(authClient);
      }
    } catch (error) {
      console.error("Reload login error:", error);
    }
  };

  const checkUser = async (user) => {
    if (!backendActor) {
      throw new Error("Backend actor not initialized");
    }
    try {
      console.log("backend actor in try", backendActor);

      const result = await backendActor?.check_user_existance(user);
      console.log("check_user result:", result);
      return result;
    } catch (error) {
      console.error("Error checking user:", error);
      throw error;
    }
  };


  const frontendCanisterId =
    process.env.CANISTER_ID_DAOHOUSE_FRONTEND ||
    process.env.FRONTEND_CANISTER_CANISTER_ID || process.env.CANISTER_ID;


  return {
    isAuthenticated,
    login,
    logout,
    updateClient,
    authClient,
    identity,
    principal,
    backendActor,
    accountId,
    createLedgerActor,
    reloadLogin,
    accountIdString,
    createDaoActor,
    checkUser,
    frontendCanisterId,
    stringPrincipal,

  };
};

// Authentication provider component
export const AuthProvider = ({ children }) => {
  const auth = useAuthClient();

  if (!auth.authClient || !auth.backendActor) {
    return null; // Or render a loading indicator
  }

  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
};

// Hook to access authentication context
export const useAuth = () => useContext(AuthContext);