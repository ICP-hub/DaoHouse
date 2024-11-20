import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import "./App.css";
// import { AuthProvider } from './Components/utils/useAuthClient';
import { UserProfileProvider } from './context/UserProfileContext';
import { AuthProvider } from "./connect/useClient";
import {
  IdentityKitProvider,
  IdentityKitTheme,
  useIdentityKit,
} from "@nfid/identitykit/react";
import {
  IdentityKitAuthType,
  MockedSigner,
  NFIDW,
  Plug,
  InternetIdentity,
  Stoic,
} from "@nfid/identitykit";
import "@nfid/identitykit/react/styles.css";

const signers = [NFIDW, Plug, InternetIdentity];
const canisterID = process.env.CANISTER_ID_DAOHOUSE_BACKEND;

const root = createRoot(document.getElementById('root'));
root.render(
  <IdentityKitProvider
  signers={signers}
  theme={IdentityKitTheme.SYSTEM}
  authType={IdentityKitAuthType.DELEGATION}
  signerClientOptions={{
    targets: [canisterID],
  }}
>
    <AuthProvider>
      <UserProfileProvider>
        <App />
      </UserProfileProvider>
    </AuthProvider>
    </IdentityKitProvider>
);