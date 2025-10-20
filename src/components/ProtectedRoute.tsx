// src/components/ProtectedRoute.tsx
import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

const ProtectedRoute = () => {
  const token = localStorage.getItem('authToken');
  const location = useLocation(); // Get current location

  console.log(`ProtectedRoute Check on path "${location.pathname}": Token found?`, !!token); // Log check

  // If token exists, allow access to the nested routes (using <Outlet />)
  // Otherwise, redirect the user to the login page, remembering where they tried to go
  return token ? <Outlet /> : <Navigate to="/login" state={{ from: location }} replace />;
};

export default ProtectedRoute;