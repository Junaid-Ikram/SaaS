import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

// This component uses dummy data instead of real database operations
const AcademySubscription = () => {
  const { user, userDetails } = useAuth();
  const navigate = useNavigate();
  const [currentPlan, setCurrentPlan] = useState('basic');
  const [loading, setLoading] = useState(true);
  const [academyData, setAcademyData] = useState(null);
  
  useEffect(() => {
    const loadDummyAcademyData = () => {
      if (!user || !userDetails || userDetails.role !== 'academy_owner') {
        return;
      }
      
      try {
        setLoading(true);
        
        // Simulate a loading delay
        setTimeout(() => {
          // Create dummy academy data
          const dummyData = {
            id: 'acad_123456',
            name: 'Bright Future Academy',
            owner_id: user?.id || 'user_123',
            created_at: '2023-01-15T10:30:00Z',
            subscription_plan: 'basic',
            status: 'active',
            logo_url: null,
            description: 'A premier educational institution focused on excellence',
            contact_email: 'admin@brightfuture.edu',
            contact_phone: '+1 (555) 123-4567',
            address: '123 Education Ave, Learning City, LC 12345'
          };
          
          setAcademyData(dummyData);
          setCurrentPlan(dummyData.subscription_plan || 'basic');
          setLoading(false);
        }, 800); // Simulate network delay
      } catch (error) {
        console.error('Error loading dummy academy data:', error.message);
        setLoading(false);
      }
    };
    
    loadDummyAcademyData();
  }, [user, userDetails]);
  
  const handleUpgrade = async (plan) => {
    if (loading) return;
    if (currentPlan === plan) return;
    
    try {
      setLoading(true);
      console.log('Upgrading to plan:', plan);
      
      if (!academyData) {
        throw new Error('Academy data not found');
      }
      
      // Get plan details
      const planDetails = {
        basic: { price: 29, teachers: 5, students: 50 },
        pro: { price: 79, teachers: 15, students: 150 },
        enterprise: { price: 199, teachers: 'Unlimited', students: 'Unlimited' }
      };
      
      // Simulate payment confirmation
      const confirmed = window.confirm(
        `You are about to subscribe to the ${plan.charAt(0).toUpperCase() + plan.slice(1)} plan for $${planDetails[plan].price}/month. \n\n` +
        `Teachers: ${planDetails[plan].teachers}\n` +
        `Students: ${planDetails[plan].students}\n\n` +
        `Click OK to confirm your subscription.`
      );
      
      if (!confirmed) {
        setLoading(false);
        return;
      }
      
      console.log('Payment confirmed, processing...');
      
      // Simulate payment processing delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update the subscription plan in local state only (no database update)
      console.log('Updating subscription plan for academy:', academyData.id);
      
      // Update local state
      setAcademyData(prev => ({
        ...prev,
        subscription_plan: plan
      }));
      
      console.log('Subscription plan updated successfully to:', plan);
      setCurrentPlan(plan);
      setLoading(false);
      
      // Show success message and redirect
      alert(`Payment successful! You have subscribed to the ${plan.charAt(0).toUpperCase() + plan.slice(1)} plan. You will now be redirected to your dashboard.`);
      console.log('Redirecting to dashboard...');
      navigate('/academy/dashboard');
    } catch (error) {
      console.error('Error upgrading plan:', error.message);
      setLoading(false);
      alert('Payment failed. Please try again or contact support.');
    }
  };
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const cardVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: { type: 'spring', stiffness: 100 }
    },
    hover: {
      scale: 1.05,
      boxShadow: '0 10px 20px rgba(0,0,0,0.1)',
      transition: { type: 'spring', stiffness: 400, damping: 10 }
    }
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        className="mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold text-green-800">Subscription Plans</h1>
        <p className="text-gray-600 mt-2">Choose the right plan for your academy</p>
      </motion.div>
      
      {/* Current Plan Banner */}
      <motion.div
        className="bg-green-50 border-l-4 border-green-500 p-4 mb-8 rounded-md"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-green-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-green-800">
              Current Plan: {currentPlan.charAt(0).toUpperCase() + currentPlan.slice(1)}
            </h3>
            <div className="mt-1 text-sm text-green-700">
              <p>You can upgrade your plan at any time to get more features and capacity.</p>
            </div>
          </div>
        </div>
      </motion.div>
      
      {/* Subscription Plans */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Basic Plan */}
        <motion.div
          className={`border rounded-lg p-6 flex flex-col ${currentPlan === 'basic' ? 'border-green-500 bg-green-50' : 'border-gray-200'}`}
          variants={cardVariants}
          whileHover="hover"
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Basic Plan</h3>
            {currentPlan === 'basic' && (
              <span className="bg-green-100 text-green-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">Current</span>
            )}
          </div>
          <div className="mb-4">
            <span className="text-3xl font-bold text-gray-900">$29</span>
            <span className="text-gray-500 text-sm ml-1">/month</span>
          </div>
          <ul className="mb-6 space-y-2 flex-grow">
            <li className="flex items-center">
              <svg className="w-4 h-4 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
              <span className="text-gray-600">Up to 5 Teachers</span>
            </li>
            <li className="flex items-center">
              <svg className="w-4 h-4 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
              <span className="text-gray-600">Up to 50 Students</span>
            </li>
            <li className="flex items-center">
              <svg className="w-4 h-4 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
              <span className="text-gray-600">Basic Analytics</span>
            </li>
          </ul>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`w-full py-2 rounded-md ${currentPlan === 'basic' ? 'bg-gray-300 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700 text-white'}`}
            onClick={() => handleUpgrade('basic')}
            disabled={currentPlan === 'basic'}
          >
            {currentPlan === 'basic' ? 'Current Plan' : 'Downgrade'}
          </motion.button>
        </motion.div>
        
        {/* Pro Plan */}
        <motion.div
          className={`border rounded-lg p-6 flex flex-col ${currentPlan === 'pro' ? 'border-green-500 bg-green-50' : 'border-gray-200'}`}
          variants={cardVariants}
          whileHover="hover"
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Pro Plan</h3>
            {currentPlan === 'pro' ? (
              <span className="bg-green-100 text-green-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">Current</span>
            ) : (
              <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">Popular</span>
            )}
          </div>
          <div className="mb-4">
            <span className="text-3xl font-bold text-gray-900">$79</span>
            <span className="text-gray-500 text-sm ml-1">/month</span>
          </div>
          <ul className="mb-6 space-y-2 flex-grow">
            <li className="flex items-center">
              <svg className="w-4 h-4 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
              <span className="text-gray-600">Up to 15 Teachers</span>
            </li>
            <li className="flex items-center">
              <svg className="w-4 h-4 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
              <span className="text-gray-600">Up to 150 Students</span>
            </li>
            <li className="flex items-center">
              <svg className="w-4 h-4 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
              <span className="text-gray-600">Advanced Analytics</span>
            </li>
            <li className="flex items-center">
              <svg className="w-4 h-4 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
              <span className="text-gray-600">Priority Support</span>
            </li>
          </ul>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`w-full py-2 rounded-md ${currentPlan === 'pro' ? 'bg-gray-300 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700 text-white'}`}
            onClick={() => handleUpgrade('pro')}
            disabled={currentPlan === 'pro'}
          >
            {currentPlan === 'pro' ? 'Current Plan' : currentPlan === 'enterprise' ? 'Downgrade' : 'Upgrade'}
          </motion.button>
        </motion.div>
        
        {/* Enterprise Plan */}
        <motion.div
          className={`border rounded-lg p-6 flex flex-col ${currentPlan === 'enterprise' ? 'border-green-500 bg-green-50' : 'border-gray-200'}`}
          variants={cardVariants}
          whileHover="hover"
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Enterprise Plan</h3>
            {currentPlan === 'enterprise' && (
              <span className="bg-green-100 text-green-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">Current</span>
            )}
          </div>
          <div className="mb-4">
            <span className="text-3xl font-bold text-gray-900">$199</span>
            <span className="text-gray-500 text-sm ml-1">/month</span>
          </div>
          <ul className="mb-6 space-y-2 flex-grow">
            <li className="flex items-center">
              <svg className="w-4 h-4 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
              <span className="text-gray-600">Unlimited Teachers</span>
            </li>
            <li className="flex items-center">
              <svg className="w-4 h-4 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
              <span className="text-gray-600">Unlimited Students</span>
            </li>
            <li className="flex items-center">
              <svg className="w-4 h-4 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
              <span className="text-gray-600">Premium Analytics</span>
            </li>
            <li className="flex items-center">
              <svg className="w-4 h-4 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
              <span className="text-gray-600">24/7 Dedicated Support</span>
            </li>
            <li className="flex items-center">
              <svg className="w-4 h-4 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
              <span className="text-gray-600">Custom Branding</span>
            </li>
          </ul>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`w-full py-2 rounded-md ${currentPlan === 'enterprise' ? 'bg-gray-300 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700 text-white'}`}
            onClick={() => handleUpgrade('enterprise')}
            disabled={currentPlan === 'enterprise'}
          >
            {currentPlan === 'enterprise' ? 'Current Plan' : 'Upgrade'}
          </motion.button>
        </motion.div>
      </motion.div>
      
      {/* FAQ Section */}
      <motion.div
        className="mt-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Frequently Asked Questions</h2>
        <div className="space-y-4">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Can I change my plan later?</h3>
            <p className="text-gray-600">Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately.</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">What happens if I exceed my plan limits?</h3>
            <p className="text-gray-600">If you exceed your plan limits, you'll be notified and prompted to upgrade. You won't be able to add more teachers or students until you upgrade or remove existing ones.</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Is there a free trial available?</h3>
            <p className="text-gray-600">Yes, all new academies start with a 14-day free trial of the Pro plan. After the trial period, you'll be automatically downgraded to the Basic plan unless you choose to upgrade.</p>
          </div>
        </div>
      </motion.div>
      
      <div className="mt-8 flex justify-center">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-gray-200 text-gray-700 px-6 py-3 rounded-md hover:bg-gray-300 transition-colors"
          onClick={() => navigate('/academy/dashboard')}
        >
          Return to Dashboard
        </motion.button>
      </div>
    </div>
  );
};

export default AcademySubscription;