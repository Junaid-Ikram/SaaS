import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../utils/supabase';

const SubscriptionEnforcement = ({ children, limits }) => {
  const { user, userDetails } = useAuth();
  const userRole = userDetails?.role;
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [exceededLimits, setExceededLimits] = useState(false);
  const [counts, setCounts] = useState({
    teachers: 0,
    students: 0
  });
  
  useEffect(() => {
    const checkSubscriptionLimits = async () => {
      if (!user || userRole !== 'academy') {
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        
        // Get the academy ID for this owner
        const { data: academies, error: academyError } = await supabase
          .from('academies')
          .select('id')
          .eq('owner_id', user.id);
          
        if (academyError) {
          console.error('Error fetching academy:', academyError.message);
          setLoading(false);
          return;
        }
        
        if (!academies || academies.length === 0) {
          console.log('No academy found for this owner');
          setLoading(false);
          return;
        }
        
        const academyId = academies[0].id;
        
        // Count active teachers
        const { data: teachers, error: teacherError } = await supabase
          .from('teachers')
          .select('id', { count: 'exact' })
          .eq('academy_id', academyId)
          .eq('status', 'active');
          
        if (teacherError) {
          console.error('Error counting teachers:', teacherError.message);
        }
        
        // Count active students
        const { data: students, error: studentError } = await supabase
          .from('students')
          .select('id', { count: 'exact' })
          .eq('academy_id', academyId)
          .eq('status', 'active');
          
        if (studentError) {
          console.error('Error counting students:', studentError.message);
        }
        
        const teacherCount = teachers?.length || 0;
        const studentCount = students?.length || 0;
        
        setCounts({
          teachers: teacherCount,
          students: studentCount
        });
        
        // Check if any limits are exceeded
        const isExceeded = 
          (limits.teachers && teacherCount > limits.teachers) || 
          (limits.students && studentCount > limits.students);
        
        setExceededLimits(isExceeded);
        setLoading(false);
      } catch (error) {
        console.error('Error checking subscription limits:', error.message);
        setLoading(false);
      }
    };
    
    checkSubscriptionLimits();
  }, [user, userRole, limits]);
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
        <p className="ml-3 text-gray-600">Checking subscription...</p>
      </div>
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