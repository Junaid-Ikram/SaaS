import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const TermsOfServicePage = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: 'spring', stiffness: 100 },
    },
  };

  return (
    <div className="bg-gray-50 py-16 px-4 sm:px-6 lg:px-8 border-t border-green-200">
      <motion.div
        className="max-w-4xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants} className="text-center mb-12">
          <h1 className="text-3xl font-extrabold text-green-800 sm:text-4xl">
            Terms of Service
          </h1>
          <p className="mt-4 text-lg text-green-700">
            Last updated:{' '}
            {new Date().toLocaleDateString('en-US', {
              month: 'long',
              day: 'numeric',
              year: 'numeric',
            })}
          </p>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="bg-white shadow-md rounded-lg p-6 mb-12"
        >
          {[
            {
              title: '1. Introduction',
              content:
                'Welcome to Academy Platform. These Terms of Service govern your use of our website and services. By accessing or using our platform, you agree to be bound by these Terms. If you disagree with any part of the terms, you may not access the service.',
            },
            {
              title: '2. Accounts',
              content:
                'When you create an account with us, you must provide accurate, complete, and current information. Failure to do so constitutes a breach of the Terms. You are responsible for safeguarding your password and for all activity under your account. Notify us of any breach or unauthorized use.',
            },
            {
              title: '3. Service Usage',
              content:
                'You may use our services only as permitted by law and according to these Terms. The services may change from time to time. Do not misuse the services or access them via unauthorized methods.',
            },
            {
              title: '4. Content',
              content:
                'You are responsible for content you post, and you grant us a license to use, display, and distribute it. You retain ownership of the content you submit.',
            },
            {
              title: '5. Intellectual Property',
              content:
                'All original content, features, and functionality are owned by Academy Platform and are protected by copyright and trademark laws.',
            },
            {
              title: '6. Termination',
              content:
                'We may terminate or suspend your account immediately, without notice, for violating the Terms. Upon termination, access to the service ends immediately.',
            },
            {
              title: '7. Limitation of Liability',
              content:
                'We are not liable for indirect, incidental, special, or consequential damages resulting from your use of or inability to use the service.',
            },
            {
              title: '8. Changes',
              content:
                'We may update these Terms at any time. If changes are material, we will try to provide at least 30 days’ notice.',
            },
            {
              title: '9. Contact Us',
              content: (
                <>
                  If you have questions about these Terms, please contact us through our{' '}
                  <Link
                    to="/contact"
                    className="text-green-600 hover:text-green-800 font-medium"
                  >
                    contact page
                  </Link>
                  .
                </>
              ),
            },
          ].map((section, index) => (
            <div key={index} className="mb-10">
              <h2 className="text-xl font-semibold text-green-800 mb-4">
                {section.title}
              </h2>
              <p className="text-green-700 leading-relaxed">{section.content}</p>
            </div>
          ))}
        </motion.div>

        <motion.div variants={itemVariants} className="text-center">
          <Link
            to="/"
            className="inline-flex items-center px-6 py-3 text-white bg-green-600 hover:bg-green-700 rounded-lg text-base font-medium shadow"
          >
            Return to Home
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default TermsOfServicePage;
