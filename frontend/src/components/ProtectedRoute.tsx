import React, { ReactNode } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAppContext } from '../contexts/AppContext';

interface ProtectedRouteProps {
  allowedRoles?: string[];
  children?: ReactNode; // Add support for children
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles = [], children }) => {
  const { state } = useAppContext();
  const location = useLocation();

  // Check if user is authenticated
  if (!state.auth.isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check role-based access if allowedRoles are specified
  if (allowedRoles.length > 0) {
    const userRole = state.auth.user?.role || '';
    if (!allowedRoles.includes(userRole)) {
      return <Navigate to="/unauthorized" replace />;
    }
  }

  // Render children if provided, otherwise render Outlet
  return children ? <>{children}</> : <Outlet />;
};

export default ProtectedRoute;