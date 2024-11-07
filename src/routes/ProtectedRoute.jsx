import React from 'react';
import { useAuthClient } from '../daohouse_frontend/src/connect/useClient';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({children}) => {
    const {isAuthenticated} = useAuthClient();
    if(!isAuthenticated ){
        return <Navigate to="/"/>
    }
  return   children;
    
    

 
  
}

export default ProtectedRoute