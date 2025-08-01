import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const PrivacyPolicyPage = () => {
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
            Privacy Policy
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
            Academy Platform ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our platform. Please read this privacy policy carefully. If you do not agree with the terms of this privacy policy, please do not access the platform.
          </p>
          
          <h2 className="text-xl font-semibold text-gray-900 mb-4 mt-8">2. Information We Collect</h2>
          <p className="text-gray-700 mb-4">
            We collect information that you provide directly to us when you register on our platform, create or modify your profile, or communicate with us. This information may include:
          </p>
          <ul className="list-disc pl-8 text-gray-700 mb-4">
            <li>Personal identifiers such as your name, email address, and phone number</li>
            <li>Account credentials such as your password</li>
            <li>Profile information such as your photo, role (academy owner, teacher, or student), and educational background</li>
            <li>Content you post, upload, or otherwise share on our platform</li>
            <li>Communications you send directly to us</li>
          </ul>
          
          <p className="text-gray-700 mb-4">
            We also automatically collect certain information when you visit, use, or navigate our platform. This information does not reveal your specific identity but may include:
          </p>
          <ul className="list-disc pl-8 text-gray-700 mb-4">
            <li>Device and usage information, such as your IP address, browser and device characteristics, operating system, language preferences, referring URLs, device name, country, location, and information about how and when you use our platform</li>
            <li>Cookies and similar technologies</li>
          </ul>
          
          <h2 className="text-xl font-semibold text-gray-900 mb-4 mt-8">3. How We Use Your Information</h2>
          <p className="text-gray-700 mb-4">
            We use the information we collect for various purposes, including to:
          </p>
          <ul className="list-disc pl-8 text-gray-700 mb-4">
            <li>Provide, operate, and maintain our platform</li>
            <li>Improve, personalize, and expand our platform</li>
            <li>Understand and analyze how you use our platform</li>
            <li>Develop new products, services, features, and functionality</li>
            <li>Communicate with you, either directly or through one of our partners, for customer service, updates and other information relating to the platform, and for marketing and promotional purposes</li>
            <li>Process your transactions</li>
            <li>Find and prevent fraud</li>
            <li>For compliance purposes, including enforcing our Terms of Service, or other legal rights, or as may be required by applicable laws and regulations</li>
          </ul>
          
          <h2 className="text-xl font-semibold text-gray-900 mb-4 mt-8">4. Sharing Your Information</h2>
          <p className="text-gray-700 mb-4">
            We may share your information with third parties in the following situations:
          </p>
          <ul className="list-disc pl-8 text-gray-700 mb-4">
            <li>With service providers who perform services for us</li>
            <li>With business partners to offer certain products, services, or promotions</li>
            <li>With other users when you share information through the platform</li>
            <li>In connection with, or during negotiations of, any merger, sale of company assets, financing, or acquisition of all or a portion of our business by another company</li>
            <li>If we are required to do so by law or if we believe that such action is necessary to (i) comply with a legal obligation, (ii) protect and defend our rights or property, (iii) prevent or investigate possible wrongdoing in connection with the platform, (iv) protect the personal safety of users of the platform or the public, or (v) protect against legal liability</li>
          </ul>
          
          <h2 className="text-xl font-semibold text-gray-900 mb-4 mt-8">5. Your Privacy Rights</h2>
          <p className="text-gray-700 mb-4">
            Depending on your location, you may have certain rights regarding your personal information, such as:
          </p>
          <ul className="list-disc pl-8 text-gray-700 mb-4">
            <li>The right to access personal information we hold about you</li>
            <li>The right to request that we correct any inaccurate personal information we hold about you</li>
            <li>The right to request that we delete any personal information we hold about you</li>
            <li>The right to restrict or object to our processing of your personal information</li>
            <li>The right to data portability</li>
            <li>The right to withdraw consent</li>
          </ul>
          <p className="text-gray-700 mb-4">
            To exercise any of these rights, please contact us using the information provided in the "Contact Us" section below.
          </p>
          
          <h2 className="text-xl font-semibold text-gray-900 mb-4 mt-8">6. Data Security</h2>
          <p className="text-gray-700 mb-4">
            We have implemented appropriate technical and organizational security measures designed to protect the security of any personal information we process. However, despite our safeguards and efforts to secure your information, no electronic transmission over the Internet or information storage technology can be guaranteed to be 100% secure.
          </p>
          
          <h2 className="text-xl font-semibold text-gray-900 mb-4 mt-8">7. Children's Privacy</h2>
          <p className="text-gray-700 mb-4">
            Our platform is not intended for individuals under the age of 13. We do not knowingly collect personal information from children under 13. If you are a parent or guardian and you are aware that your child has provided us with personal information, please contact us so that we can take necessary actions.
          </p>
          
          <h2 className="text-xl font-semibold text-gray-900 mb-4 mt-8">8. Changes to This Privacy Policy</h2>
          <p className="text-gray-700 mb-4">
            We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date at the top of this Privacy Policy. You are advised to review this Privacy Policy periodically for any changes.
          </p>
          
          <h2 className="text-xl font-semibold text-gray-900 mb-4 mt-8">9. Contact Us</h2>
          <p className="text-gray-700 mb-4">
            If you have any questions about this Privacy Policy, please contact us through our <Link to="/contact" className="text-green-600 hover:text-green-800">contact page</Link>.
          </p>
        </motion.div>
        
        <motion.div variants={itemVariants} className="text-center">
          <Link 
            to="/"
            className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            Return to Home
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default PrivacyPolicyPage;