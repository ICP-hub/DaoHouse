import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import "./App.css";
import { AuthProvider } from './Components/utils/useAuthClient';
import { UserProfileProvider } from './context/UserProfileContext';


const root = createRoot(document.getElementById('root'));
root.render(
    <AuthProvider>
      <UserProfileProvider>
        <App />
      </UserProfileProvider>
    </AuthProvider>
);