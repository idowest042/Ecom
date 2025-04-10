// src/components/AuthWrapper.jsx
import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';

const AuthWrapper = ({ children }) => {
  const { token } = useContext(ShopContext);
  
  if (!token) {
    // Redirect to login if no token exists
    return <Navigate to="/login" replace />;
  }

  // Render protected content if token exists
  return children;
};

export default AuthWrapper;