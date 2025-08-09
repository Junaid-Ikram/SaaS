import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
// Using dummy data instead of Supabase
// import { supabase } from '../utils/supabase';

const SubscriptionEnforcement = ({ children, limits = { teachers: 5, students: 20 } }) => {
  const { user, userDetails } = useAuth();
  const userRole = userDetails?.role;
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [exceededLimits, setExceededLimits] = useState(false);
  const [noPlan, setNoPlan] = useState(false);
  const [counts, setCounts] = useState({
    teachers: 0,
    students: 0
  });
  
  useEffect(() => {
    // Add a timeout to prevent infinite loading
    const loadingTimeout = setTimeout(() => {
      if (loading) {
        console.log('Loading timeout reached, forcing UI to show');
        setLoading(false);
        // Don't set noPlan to true as fallback, just show the children
      }
    }, 1000); // 1 second timeout for demo purposes
    
    const checkSubscriptionLimits = async () => {
      console.log('SubscriptionEnforcement - Checking limits for user:', user?.id);
      console.log('SubscriptionEnforcement - User details:', userDetails);
      console.log('SubscriptionEnforcement - User role:', userRole);
      
      if (!user || userRole !== 'academy_owner') {
        console.log('SubscriptionEnforcement - Not an academy owner or no user, skipping check');
        setLoading(false);
        return;
      }
      
      try {
        // Don't set loading to true again if it's already true
        
        // Simulate a delay for network request
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Create dummy academy data
        const academyData = {
          id: 1,
          subscription_plan: 'premium'
        };
        
        console.log('SubscriptionEnforcement - Dummy academy data:', academyData);
        const academyId = academyData.id;
        const subscriptionPlan = academyData.subscription_plan || '';
        
        // Check if user has a subscription plan
        if (!subscriptionPlan) {
          console.log('No subscription plan found, redirecting to subscription page');
          setNoPlan(true);
          setLoading(false);
          return;
        }
        
        // Create dummy teacher and student counts
        const teacherCount = 3; // Dummy count
        const studentCount = 15; // Dummy count
        
        console.log('Dummy teacher count:', teacherCount);
        console.log('Dummy student count:', studentCount);
        
        setCounts({
          teachers: teacherCount,
          students: studentCount
        });
        
        // Check if limits are exceeded
        const limitExceeded = (
          (limits.teachers && teacherCount > limits.teachers) ||
          (limits.students && studentCount > limits.students)
        );
        
        setExceededLimits(limitExceeded);
        setLoading(false);
      } catch (error) {
        console.error('Error checking subscription limits:', error.message);
        setLoading(false);
      }
    };
    
    checkSubscriptionLimits();
    
    // Cleanup function to clear the timeout
    return () => {
      clearTimeout(loadingTimeout);
    };
  }, [user, userRole, limits, loading]);
  
  if (loading) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col justify-center items-center h-64 p-8 bg-white rounded-lg shadow-md"
      >
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-green-500 mb-4"></div>
        <p className="text-xl font-semibold text-gray-700 mb-2">Checking subscription status...</p>
        <p className="text-gray-500 text-center max-w-md">
          We're verifying your subscription details. This should only take a moment.
          If this screen persists, you'll be redirected to the subscription page shortly.
        </p>
      </motion.div>
    );
  }
  
  if (noPlan) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-lg shadow-lg p-8 max-w-2xl mx-auto my-8"
      >
        <div className="text-center">
          <div className="bg-blue-100 p-3 rounded-full inline-block mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Subscription Required</h2>
          
          <p className="text-gray-600 mb-6">
            You need to select a subscription plan to access your academy dashboard. Choose a plan that fits your needs to get started.
          </p>
          
          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Available Plans</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="border border-gray-200 rounded-lg p-4">
                <p className="font-bold text-gray-800">Basic</p>
                <p className="text-green-600 font-bold">$29/month</p>
                <p className="text-sm text-gray-500">5 Teachers, 50 Students</p>
              </div>
              <div className="border border-blue-200 bg-blue-50 rounded-lg p-4 relative">
                <span className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs px-2 py-1 rounded-full">Popular</span>
                <p className="font-bold text-gray-800">Pro</p>
                <p className="text-green-600 font-bold">$79/month</p>
                <p className="text-sm text-gray-500">15 Teachers, 150 Students</p>
              </div>
              <div className="border border-gray-200 rounded-lg p-4">
                <p className="font-bold text-gray-800">Enterprise</p>
                <p className="text-green-600 font-bold">$199/month</p>
                <p className="text-sm text-gray-500">Unlimited</p>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors shadow-md"
              onClick={() => navigate('/academy/subscription')}
            >
              Choose a Plan
            </motion.button>
          </div>
        </div>
      </motion.div>
    );
  }
  
  if (exceededLimits) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-lg shadow-lg p-8 max-w-2xl mx-auto my-8"
      >
        <div className="text-center">
          <div className="bg-red-100 p-3 rounded-full inline-block mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Subscription Limit Reached</h2>
          
          <p className="text-gray-600 mb-6">
            You have reached the limits of your current subscription plan. Please upgrade your subscription to add more teachers or students.
          </p>
          
          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Current Usage</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-gray-500">Teachers</p>
                <p className="text-xl font-bold text-gray-800">{counts.teachers} <span className="text-sm text-gray-500">/ {limits.teachers || 'Unlimited'}</span></p>
                {limits.teachers && counts.teachers > limits.teachers && (
                  <p className="text-red-500 text-sm">Limit exceeded</p>
                )}
              </div>
              <div>
                <p className="text-gray-500">Students</p>
                <p className="text-xl font-bold text-gray-800">{counts.students} <span className="text-sm text-gray-500">/ {limits.students || 'Unlimited'}</span></p>
                {limits.students && counts.students > limits.students && (
                  <p className="text-red-500 text-sm">Limit exceeded</p>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors shadow-md"
              onClick={() => navigate('/academy/subscription')}
            >
              Upgrade Subscription
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 bg-white text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              onClick={() => navigate('/academy/dashboard')}
            >
              Return to Dashboard
            </motion.button>
          </div>
        </div>
      </motion.div>
    );
  }
  
  return children;
};

export default SubscriptionEnforcement;