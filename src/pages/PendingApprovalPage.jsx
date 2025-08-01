import React from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';

const PendingApprovalPage = () => {
  const { user, userDetails, signOut } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <motion.div 
        className="sm:mx-auto sm:w-full sm:max-w-md"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <img
          className="mx-auto h-16 w-auto"
          src="https://tailwindui.com/img/logos/workflow-mark-green-600.svg"
          alt="Workflow"
        />
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Account Pending Approval</h2>
      </motion.div>

      <motion.div 
        className="mt-8 sm:mx-auto sm:w-full sm:max-w-md"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="text-center">
            <motion.div
              className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, delay: 0.5 }}
            >
              <svg className="h-8 w-8 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </motion.div>
            
            <motion.h3 
              className="mt-4 text-lg font-medium text-gray-900"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              Your registration is pending approval
            </motion.h3>
            
            <motion.p 
              className="mt-2 text-sm text-gray-500"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              Thank you for registering! Your account is currently being reviewed by the academy administrator.
              You'll receive an email notification once your account has been approved or rejected.
            </motion.p>

            <motion.div 
              className="mt-6 border-t border-b border-gray-200 py-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              <h4 className="text-sm font-medium text-gray-500">Account Information</h4>
              <div className="mt-2">
                <p className="text-sm text-gray-900">Email: <span className="font-medium">{user?.email}</span></p>
                <p className="text-sm text-gray-900 mt-1">Role: <span className="font-medium capitalize">{userDetails?.role || 'Student/Teacher'}</span></p>
                <p className="text-sm text-gray-900 mt-1">Academy ID: <span className="font-medium">{userDetails?.academy_id || 'N/A'}</span></p>
              </div>
            </motion.div>

            <motion.div 
              className="mt-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9 }}
            >
              <p className="text-sm text-gray-500">
                If you have any questions or need to update your information, please contact the academy administrator.
              </p>
            </motion.div>

            <motion.div 
              className="mt-6 flex flex-col space-y-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
            >
              <motion.button
                type="button"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                onClick={signOut}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Sign Out
              </motion.button>
              
              <Link 
                to="/"
                className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-green-600 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                Return to Home Page
              </Link>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default PendingApprovalPage;