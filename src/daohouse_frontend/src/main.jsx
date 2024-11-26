import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import "./App.css";
import { AuthProvider } from './Components/utils/useAuthClient';
import { UserProfileProvider } from './context/UserProfileContext';
import { Provider } from 'react-redux';
import {store } from './redux/store';

const root = createRoot(document.getElementById('root'));
root.render(
    <Provider store ={store}>
    <AuthProvider>
      <UserProfileProvider>
        <App />
      </UserProfileProvider>
    </AuthProvider>
    </Provider>
);