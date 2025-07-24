import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const TermsOfServicePage = () => {
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
    <div className="bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <motion.div 
        className="max-w-4xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants} className="text-center mb-12">
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Terms of Service
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </p>
        </motion.div>

        <motion.div 
          variants={itemVariants}
          className="bg-white shadow overflow-hidden sm:rounded-lg p-6 mb-8"
        >
          <h2 className="text-xl font-semibold text-gray-900 mb-4">1. Introduction</h2>
          <p className="text-gray-700 mb-4">
            Welcome to Academy Platform. These Terms of Service govern your use of our website and services. By accessing or using our platform, you agree to be bound by these Terms. If you disagree with any part of the terms, you may not access the service.
          </p>
          
          <h2 className="text-xl font-semibold text-gray-900 mb-4 mt-8">2. Accounts</h2>
          <p className="text-gray-700 mb-4">
            When you create an account with us, you must provide accurate, complete, and current information. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account.
          </p>
          <p className="text-gray-700 mb-4">
            You are responsible for safeguarding the password and for all activities that occur under your account. You agree not to disclose your password to any third party. You must notify us immediately upon becoming aware of any breach of security or unauthorized use of your account.
          </p>
          
          <h2 className="text-xl font-semibold text-gray-900 mb-4 mt-8">3. Service Usage</h2>
          <p className="text-gray-700 mb-4">
            Our platform offers various services for academy owners, teachers, and students. You may use our services only as permitted by law and according to these Terms. The services may change from time to time without prior notice.
          </p>
          <p className="text-gray-700 mb-4">
            You agree not to misuse our services by interfering with their normal operation or attempting to access them using a method other than through the interfaces and instructions we provide.
          </p>
          
          <h2 className="text-xl font-semibold text-gray-900 mb-4 mt-8">4. Content</h2>
          <p className="text-gray-700 mb-4">
            Our platform allows you to post, link, store, share, and otherwise make available certain information, text, graphics, videos, or other material. You are responsible for the content you post and its legality, reliability, and appropriateness.
          </p>
          <p className="text-gray-700 mb-4">
            By posting content, you grant us the right to use, modify, publicly perform, publicly display, reproduce, and distribute such content on and through our platform. You retain any and all rights to any content you submit, post, or display on or through our service.
          </p>
          
          <h2 className="text-xl font-semibold text-gray-900 mb-4 mt-8">5. Intellectual Property</h2>
          <p className="text-gray-700 mb-4">
            The service and its original content, features, and functionality are and will remain the exclusive property of Academy Platform and its licensors. The service is protected by copyright, trademark, and other laws. Our trademarks and trade dress may not be used in connection with any product or service without the prior written consent.
          </p>
          
          <h2 className="text-xl font-semibold text-gray-900 mb-4 mt-8">6. Termination</h2>
          <p className="text-gray-700 mb-4">
            We may terminate or suspend your account immediately, without prior notice or liability, for any reason, including without limitation if you breach the Terms. Upon termination, your right to use the service will immediately cease.
          </p>
          
          <h2 className="text-xl font-semibold text-gray-900 mb-4 mt-8">7. Limitation of Liability</h2>
          <p className="text-gray-700 mb-4">
            In no event shall Academy Platform, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the service.
          </p>
          
          <h2 className="text-xl font-semibold text-gray-900 mb-4 mt-8">8. Changes</h2>
          <p className="text-gray-700 mb-4">
            We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material, we will try to provide at least 30 days' notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion.
          </p>
          
          <h2 className="text-xl font-semibold text-gray-900 mb-4 mt-8">9. Contact Us</h2>
          <p className="text-gray-700 mb-4">
            If you have any questions about these Terms, please contact us through our <Link to="/contact" className="text-indigo-600 hover:text-indigo-800">contact page</Link>.
          </p>
        </motion.div>
        
        <motion.div variants={itemVariants} className="text-center">
          <Link 
            to="/"
            className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Return to Home
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default TermsOfServicePage;