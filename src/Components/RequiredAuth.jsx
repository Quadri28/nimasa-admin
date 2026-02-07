import React, { useContext } from 'react'
import { UserContext } from './AuthContext'
import { Navigate } from 'react-router-dom'

export const RequiredAuth = ({ children }) => {
  const { credentials } = useContext(UserContext);
const stored = sessionStorage.getItem("credentials");
  if (!credentials && !stored) {
    return <Navigate to="/cooperative-signin" replace />;
  }

  return children;
}
