import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'framer-motion';

const RoleBasedRoute = ({ requiredRole, children }) => {
  const { user, userRole, loading, isPending } = useAuth();
  const location = useLocation();

  console.log('RoleBasedRoute:', { requiredRole, userRole, loading, isPending });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-teal-100">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="p-8 rounded-lg shadow-lg bg-white"
        >
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-green-600 mb-4"></div>
            <p className="text-gray-600 font-medium">Loading...</p>
          </div>
        </motion.div>
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
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="min-h-screen flex flex-col items-center justify-center p-4 text-center bg-gradient-to-br from-green-50 to-teal-100"
      >
        <div className="max-w-md bg-white p-8 rounded-lg shadow-lg">
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ 
              duration: 0.5,
              repeat: Infinity, 
              repeatType: "reverse", 
              repeatDelay: 1 
            }}
            className="w-20 h-20 mx-auto mb-6 rounded-full bg-yellow-100 flex items-center justify-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </motion.div>
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Pending Approval</h1>
          <p className="text-gray-600 mb-6">
            Your account is pending approval from an academy administrator. 
            You'll receive an email notification once your account has been reviewed.
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              // Instead of reloading, navigate to the appropriate dashboard
              if (userRole === 'super_admin') {
                window.location.href = '/super-admin/dashboard';
              } else if (userRole === 'academy_owner') {
                window.location.href = '/academy/dashboard';
              } else if (userRole === 'teacher') {
                window.location.href = '/teacher/dashboard';
              } else if (userRole === 'student') {
                window.location.href = '/student/dashboard';
              } else {
                window.location.href = '/dashboard';
              }
            }}
            className="px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors shadow-md"
          >
            Check Status
          </motion.button>
        </div>
      </motion.div>
    );
  }

  // Check if user has the required role
  if (userRole !== requiredRole) {
    console.log(`User role ${userRole} does not match required role ${requiredRole}, redirecting...`);
    // Redirect to the appropriate dashboard based on user role
    if (userRole === 'super_admin') {
      return <Navigate to="/super-admin/dashboard" replace />;
    } else if (userRole === 'academy_owner') {
      return <Navigate to="/academy/dashboard" replace />;
    } else if (userRole === 'teacher') {
      return <Navigate to="/teacher/dashboard" replace />;
    } else if (userRole === 'student') {
      return <Navigate to="/student/dashboard" replace />;
    } else {
      // If no valid role, redirect to login
      return <Navigate to="/login" replace />;
    }
  }

  // If we have children, render them directly
  if (children) {
    return children;
  }

  // Otherwise use Outlet for nested routes
  return <Outlet />;
};

export default RoleBasedRoute;