import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const PrivateRoute = ({ allowedRoles }) => {
  const { user, userRole, loading, isPending } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  // If user is not logged in, redirect to login
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If user is pending approval
  if (isPending) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center">
        <div className="max-w-md">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Pending Approval</h1>
          <p className="text-gray-600 mb-6">
            Your account is pending approval from an academy administrator. 
            You'll receive an email notification once your account has been reviewed.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors"
          >
            Check Status
          </button>
        </div>
      </div>
    );
  }

  // If allowedRoles is specified, check if user has the required role
  if (allowedRoles && !allowedRoles.includes(userRole)) {
    // Redirect to the appropriate dashboard based on user role
    if (userRole === 'super_admin') {
      return <Navigate to="/super-admin/dashboard" replace />;
    } else if (userRole === 'academy_owner') {
      return <Navigate to="/academy/dashboard" replace />;
    } else if (userRole === 'teacher') {
      return <Navigate to="/teacher/dashboard" replace />;
    } else if (userRole === 'student') {
      return <Navigate to="/student/dashboard" replace />;
    }
  }

  return <Outlet />;
};

export default PrivateRoute;