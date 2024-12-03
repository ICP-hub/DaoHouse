import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../Components/utils/useAuthClient';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth(); 
  console.log(isAuthenticated);
  

  return isAuthenticated ? children : <Navigate to="/" replace />;
};

export default ProtectedRoute;
