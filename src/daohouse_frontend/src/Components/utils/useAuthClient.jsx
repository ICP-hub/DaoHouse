import React, { createContext, useContext, useEffect, useState } from "react";
import { AuthClient } from "@dfinity/auth-client";
import { createActor, idlFactory as BackendidlFactory } from "../../../../declarations/daohouse_backend/index";
import { Principal } from "@dfinity/candid/lib/cjs/idl";

const AuthContext = createContext();

export const useAuthClient = () => {
  const [authClient, setAuthClient] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [identity, setIdentity] = useState(null);
  const [principal, setPrincipal] = useState(null);
  const [backendActor, setBackendActor] = useState(null);
  console.log({backendActor})

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
    setPrincipal(principal);
    console.log("HERE IN CLIENTINFO");
    if (isAuthenticated && identity && principal && principal.isAnonymous() === false) {
      console.log("HERE IN IF");
      const backendActor = createActor(backendCanisterId, { agentOptions: { identity: identity } });
      setBackendActor(backendActor);
    }

    return true;
  };


  if (principal !== null) {
    console.log("principal", Principal.valueToString(principal));
  }



  useEffect(() => {
    const initializeAuth = async () => {

      const authClient = await AuthClient.create();
      clientInfo(authClient, authClient.getIdentity());

      if (window.ic?.plug) {
        const isPlugConnected = await window.ic.plug.isConnected();
        if (isPlugConnected) {
          // Ensure agent is available and principal is retrieved
          if (!window.ic.plug.agent) {
            await window.ic.plug.createAgent();
          }
          const principal = await window.ic.plug.agent.getPrincipal();


          // Create the backend actor
          const backendActor = await window.ic.plug.createActor({
            canisterId: backendCanisterId,
            interfaceFactory: BackendidlFactory,
          });

          setBackendActor(backendActor);
          setIdentity(window.ic.plug);
          setIsAuthenticated(true);
          setPrincipal(principal);

        } else {
          console.log("Plug wallet is not connected.");
        }
      }
    };

    initializeAuth();
  }, []);

  const login = async () => {
    return new Promise(async (resolve, reject) => {
      try {
        if (
          authClient.isAuthenticated() &&
          (await authClient.getIdentity().getPrincipal().isAnonymous()) ===
          false
        ) {
          resolve(clientInfo(authClient, authClient.getIdentity()));
        } else {
          await authClient.login({
            identityProvider:
              process.env.DFX_NETWORK === "ic"
                ? "https://identity.ic0.app/"
                : `"http://bw4dl-smaaa-aaaaa-qaacq-cai.localhost:4943`,
            onError: (error) => reject(error),
            onSuccess: () => resolve(clientInfo(authClient, authClient.getIdentity())),
          });
        }
      } catch (error) {
        reject(error);
      }
    });
  };

  const signInPlug = async () => {
    if (!window.ic?.plug) {
      console.error("Plug wallet is not available.");
      window.open("https://plugwallet.ooo", "_blank");
      return;
    }

    const whitelist = [frontendCanisterId, backendCanisterId];
    const hasAllowed = await window.ic.plug.requestConnect({
      whitelist,
    });

    if (!hasAllowed) {
      console.error("Connection was refused.");
      return;
    }

    console.log("Plug wallet is connected.");

    try {
      // Retrieve the principal ID
      const principal = await window.ic.plug.agent.getPrincipal();
      console.log("plugID", principal.toText());
      console.log(backendCanisterId);

      // Create the backend actor
      const backendActor = await window.ic.plug.createActor({
        canisterId: backendCanisterId,
        interfaceFactory: BackendidlFactory,
      });

      setBackendActor(backendActor);
      console.log(window.ic.plug.sessionManager)

      // Additional logic if needed
      setIdentity(principal);
      setIsAuthenticated(true);
      setPrincipal(principal);

      // Call clientInfo to update the state
      await clientInfo({ isAuthenticated: () => true, getIdentity: () => ({ getPrincipal: () => principal }) }, principal);

      console.log("Integration actor initialized successfully.");
      console.log({ backendActor });
      console.log(window.ic);
    } catch (e) {
      console.error("Failed to initialize the actor with Plug.", e);
    }

  }

  const disconnectPlug = async () => {
    if (window.ic?.plug) {
      try {
        await window.ic.plug.disconnect();
        setIsAuthenticated(false);
        setIdentity(null);
        setPrincipal(null);
        setBackendActor(null);
        console.log("Disconnected from Plug wallet.");
      } catch (error) {
        console.error("Failed to disconnect from Plug wallet:", error);
      }
    }
  };

  const logout = async () => {
    await authClient?.logout();
    disconnectPlug()
  };

  return {
    login,
    logout,
    authClient,
    signInPlug,
    isAuthenticated,
    identity,
    principal,
    getPrincipalId,
    frontendCanisterId,
    backendCanisterId,
    backendActor,
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