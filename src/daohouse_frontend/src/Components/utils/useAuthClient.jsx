import React, { createContext, useContext, useEffect, useState } from "react";
import { AuthClient } from "@dfinity/auth-client";
import { createActor, idlFactory as BackendidlFactory } from "../../../../declarations/daohouse_backend/index";
import { Principal } from "@dfinity/principal";

import { HttpAgent, Actor, AnonymousIdentity } from "@dfinity/agent";

import { NFID } from "@nfid/embed";
import { idlFactory as DaoFactory } from "../../../../declarations/dao_canister/index"
import { idlFactory as ledgerIDL } from "./ledger.did";

const AuthContext = createContext();

const defaultOptions = {
  createOptions: {
    idleOptions: {
      idleTimeout: 1000 * 60 * 30, // set to 30 minutes
      disableDefaultIdleCallback: true, // disable the default reload behavior
    },
  },
  loginOptionsIcp: {
    identityProvider:
      process.env.DFX_NETWORK === "ic"
                ? "https://identity.ic0.app/#authorize"
                : `http://${process.env.CANISTER_ID_INTERNET_IDENTITY}.localhost:4943`,
  },
  loginOptionsNfid: {
    identityProvider:
      process.env.DFX_NETWORK === "ic"
        ? `https://nfid.one/authenticate/?applicationName=my-ic-app#authorize`
        : `https://nfid.one/authenticate/?applicationName=my-ic-app#authorize`
  },
};


export const useAuthClient = (options = defaultOptions) => {
  const [authClient, setAuthClient] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [identity, setIdentity] = useState(null);
  const [principal, setPrincipal] = useState(null);
  const [backendActor, setBackendActor] = useState(null);
  console.log("backendActor",backendActor)
  const [stringPrincipal, setStringPrincipal] = useState(null);
  const [nfid, setNfid] = useState(null);
  const [error, setError] = useState(null);

  const getPrincipalId = (principal) => {
    if (principal) {
      const principalIdArray = Array.from(principal?._arr || []);
      return Buffer.from(principalIdArray).toString("base64");
    }
    return null;
  };
  

  const backendCanisterId =
    process.env.CANISTER_ID_DAOHOUSE_BACKEND ||
    process.env.BACKEND_CANISTER_CANISTER_ID;

  const frontendCanisterId =
    process.env.CANISTER_ID_DAOHOUSE_FRONTEND ||
    process.env.FRONTEND_CANISTER_CANISTER_ID;

  const clientInfo = async (client, identity) => {
    const isAuthenticated = await client.isAuthenticated();
    const principal = identity.getPrincipal();
    setAuthClient(client);
    setIsAuthenticated(isAuthenticated);
    setIdentity(identity);
    console.log(identity);
    
    setPrincipal(principal);
    setStringPrincipal(principal.toString());
    console.log(principal.toString());
    

    if (isAuthenticated && identity && principal && principal.isAnonymous() === false) {
      const backendActor = createActor(backendCanisterId, { agentOptions: { identity, verifyQuerySignatures: false } });
      setBackendActor(backendActor);
    }

    return true;
  };

  useEffect(() => {
    const initializeAuth = async () => {
      const authClient = await AuthClient.create(options.createOptions);
      await clientInfo(authClient, authClient.getIdentity());
      
      // if (window.ic?.plug) {
      //   const isPlugConnected = await window.ic.plug.isConnected();
      //   if (isPlugConnected) {
      //     if (!window.ic.plug.agent) {
      //       await window.ic.plug.createAgent();
      //     }
      //     const principal = await window.ic.plug.agent.getPrincipal();
      //     const backendActor = await window.ic.plug.createActor({
      //       canisterId: backendCanisterId,
      //       interfaceFactory: BackendidlFactbackendCanisterIdory,
      //     });
      //     setBackendActor(backendActor);
      //     setIdentity(window.ic.plug.agent);
      //     setIsAuthenticated(true);
      //     setPrincipal(principal);
      //   } else {
      //     console.log("Plug wallet is not connected.");
      //   }
        
      // }
        
      
    };

    initializeAuth();
  }, []);


  
  

  const login = async (val) => {
    return new Promise(async (resolve, reject) => {
      try {
        if (
          authClient.isAuthenticated() &&
          (await authClient.getIdentity().getPrincipal().isAnonymous()) ===
          false
        ) {
          resolve(clientInfo(authClient, authClient.getIdentity()));
        } else {
            const opt = val === "Icp" ? "loginOptionsIcp" : "loginOptionsNfid";
            await authClient.login({
              ...options[opt],
              onError: (error) => reject(error),
              onSuccess: () => resolve(clientInfo(authClient, authClient.getIdentity())),
            });
        }
      } catch (error) {
        reject(error);
      }
    });
  };

  // const signInPlug = async () => {
  //   if (!window.ic?.plug) throw new Error("Plug not installed");

  //   const whitelist = [frontendCanisterId, backendCanisterId];
  //   const host = process.env.DFX_NETWORK === "ic" ? "https://mainnet.dfinity.network" : "http://127.0.0.1:4943";
  //   console.log("Host : ", host)
  //   const isConnected = await window.ic.plug.requestConnect({ whitelist, host });
  //   console.log("isconnected : ", isConnected)

  //   if (isConnected) {
  //     const principal = await window.ic.plug.agent.getPrincipal();
  //     const identity = window.ic.plug.agent;


  //     setIsAuthenticated(prev => ({ ...prev, plug: true }));
  //     setIdentity(identity);
  //     console.log(identity);
      
  //     setPrincipal(principal);
  //     console.log(principal);
      
      

  //     // const userActor = await window.ic.plug.createActor({
  //     //   canisterId: frontendCanisterId,
  //     //   interfaceFactory: DaoFactory
  //     // });
  //     // console.log("userActor", userActor);
      
  //     const backendActor = await window.ic.plug.createActor({
  //       canisterId: backendCanisterId,
  //       interfaceFactory: BackendidlFactory
  //     })
  //     console.log("ExtActor", backendActor);
  //     setBackendActor(backendActor );
  //     console.log(backendActor);
      
  //     return backendActor
  //     // return userActor
  //   } else {
  //     throw new Error("Plug connection refused");
  //   }
  // };



  useEffect(() => {
    const initNFID = async () => {
      try {
        const nfIDInstance = await NFID.init({
          application: {
            name: "NFID Login",
            logo: "https://dev.nfid.one/static/media/id.300eb72f3335b50f5653a7d6ad5467b3.svg"
          }
        });
        setNfid(nfIDInstance);
      } catch (error) {
        console.error("Error initializing NFID:", error);
        setError("Failed to initialize NFID.");
      }
    };

    initNFID();
  }, []);


  // const host = "http://127.0.0.1:4943"
  const host = "http://127.0.0.1:40335"

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
    const agent = new HttpAgent({
      identity,
      host,
    });
    let tokenActor = Actor.createActor(ledgerIDL, {
      agent,
      canisterId,
    });

    return tokenActor
  };
  // temp

  const signInNFID = async () => {
    if (!nfid) {
      console.error("NFID is not initialized.");
      return;
    } else {
      console.log("nfid", nfid);
      
    }
  
    const canisterArray = [process.env.CANISTER_ID_DAOHOUSE_BACKEND];
    console.log("Canister Array:", canisterArray);
  
    try {
      const delegationResult = await nfid.getDelegation({ targets: canisterArray, maxTimeToLive: BigInt(8) * BigInt(3_600_000_000_000) });
      console.log("Delegation Result:", delegationResult);
  
      
      const isLogin = await nfid.getDelegationType();
      console.log('Delegation type', isLogin);
      // const identity = delegationResult.getIdentity();
      const agent = new HttpAgent({ identity: delegationResult });
      console.log("HttpAgent created with identity:", identity);
  
      if (process.env.DFX_NETWORK !== 'ic') {
        await agent.fetchRootKey();
        console.log("Fetched root key");
      }
  
      const backendActor = Actor.createActor({
        canisterId: backendCanisterId,
        interfaceFactory: BackendidlFactory,
      });
      console.log("Backend Actor created:", backendActor);
  
      setBackendActor(backendActor);

      const identity = await nfid.getIdentity();
      console.log(identity);
      const theUserPrincipal = identity.getPrincipalId.toText()
      console.log("The User principal:", theUserPrincipal);
      setIsAuthenticated(true);
      setIdentity(identity);
      setPrincipal(theUserPrincipal);
  
      await clientInfo({ 
        isAuthenticated: () => true, 
        getIdentity: () => ({ getPrincipal: () => theUserPrincipal })
      }, theUserPrincipal);
  
    } catch (error) {
      console.error("Error during NFID authentication:", error);
      setError("Failed to authenticate with NFID. Please check the canister ID and network settings.");
    }
  };
  
  

  const createDaoActor = (canisterId) => {
    try {
      const agent = new HttpAgent({ identity });
      console.log(identity);
      

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

  // const disconnectPlug = async () => {
  //   if (window.ic?.plug) {
  //     try {
  //       await window.ic.plug.disconnect();
  //       setIsAuthenticated(false);
  //       setIdentity(null);
  //       setPrincipal(null);
  //       setBackendActor(null);
  //       console.log("Disconnected from Plug wallet.");
  //     } catch (error) {
  //       console.error("Failed to disconnect from Plug wallet:", error);
  //     }
  //   }
  // };

  const logout = async () => {
    await authClient?.logout();
    // disconnectPlug();
  };

  return {
    login,
    logout,
    authClient,
    // signInPlug,
    signInNFID,
    isAuthenticated,
    identity,
    principal,
    getPrincipalId,
    frontendCanisterId,
    backendCanisterId,
    backendActor,
    stringPrincipal,
    createDaoActor,
    createTokenActor
  };
};

export const AuthProvider = ({ children }) => {
  const auth = useAuthClient();
  if (!auth.isAuthenticated || !auth.backendActor) {
    return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
  }
  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);