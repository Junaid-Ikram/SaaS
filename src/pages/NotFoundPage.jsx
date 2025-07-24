import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const NotFoundPage = () => {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
      },
    },
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <motion.div
        className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-lg"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants} className="text-center">
          <h1 className="text-9xl font-extrabold text-indigo-600">404</h1>
          <motion.div
            className="w-16 h-1 bg-indigo-500 mx-auto my-4"
            initial={{ width: 0 }}
            animate={{ width: 64 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          />
        </motion.div>
        
        <motion.h2 
          variants={itemVariants}
          className="mt-6 text-center text-3xl font-extrabold text-gray-900"
        >
          Page Not Found
        </motion.h2>
        
        <motion.p 
          variants={itemVariants}
          className="mt-2 text-center text-md text-gray-600"
        >
          The page you're looking for doesn't exist or has been moved.
        </motion.p>
        
        <motion.div variants={itemVariants} className="mt-6">
          <p className="text-sm text-gray-500 mb-4">You might want to check:</p>
          <ul className="list-disc pl-5 space-y-2 text-gray-600">
            <li>The URL for typos</li>
            <li>Your connection</li>
            <li>If you've been logged out</li>
          </ul>
        </motion.div>
        
        <motion.div variants={itemVariants} className="mt-6 flex flex-col space-y-3">
          <Link 
            to="/"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Return to Home
          </Link>
          
          <Link 
            to="/contact"
            className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-indigo-600 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Contact Support
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default NotFoundPage;