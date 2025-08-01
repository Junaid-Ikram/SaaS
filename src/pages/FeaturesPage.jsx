import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const FeaturesPage = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: 'spring', stiffness: 100 }
    }
  };

  const featureSections = [
    {
      title: "For Academy Owners",
      description: "Powerful tools to manage your educational institution with ease.",
      features: [
        {
          title: "Centralized Management",
          description: "Manage all aspects of your academy from a single dashboard.",
          icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
          )
        },
        {
          title: "User Approval System",
          description: "Review and approve teacher and student registrations with a simple workflow.",
          icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          )
        },
        {
          title: "Performance Analytics",
          description: "Get insights into student performance, teacher effectiveness, and overall academy metrics.",
          icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          )
        },
        {
          title: "Customizable Academy Profile",
          description: "Create a unique identity for your academy with customizable branding and settings.",
          icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          )
        }
      ]
    }
    // Add more sections as needed
  ];

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-green-700 to-emerald-700 text-white">
        <div className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
              Platform Features
            </h1>
            <p className="mt-6 text-xl max-w-3xl mx-auto text-white">
              Our Academy Platform provides powerful tools for academy owners, teachers, and students to create an effective learning environment.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="space-y-24"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {featureSections.map((section, index) => (
            <motion.div key={index} className="relative" variants={itemVariants}>
              <div className="lg:grid lg:grid-cols-3 lg:gap-8">
                <div>
                  <h2 className="text-3xl font-extrabold text-gray-900">{section.title}</h2>
                  <p className="mt-4 text-lg text-gray-600">{section.description}</p>
                </div>
                <div className="mt-12 lg:mt-0 lg:col-span-2">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-10">
                    {section.features.map((feature, featureIndex) => (
                      <motion.div key={featureIndex} className="relative" whileHover={{ scale: 1.03 }}>
                        <div className="flex items-center space-x-4">
                          <div className="flex-shrink-0">
                            <div className="flex items-center justify-center h-12 w-12 rounded-md bg-green-500 text-white">
                              {feature.icon}
                            </div>
                          </div>
                          <div>
                            <h3 className="text-lg font-medium text-gray-900">{feature.title}</h3>
                          </div>
                        </div>
                        <p className="mt-2 text-base text-gray-600 ml-16">{feature.description}</p>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* CTA Section */}
      <motion.div className="bg-green-100" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
          <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            <span className="block">Ready to get started?</span>
            <span className="block text-green-700">Join our platform today.</span>
          </h2>
          <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0 space-x-3">
            <motion.div className="inline-flex rounded-md shadow">
              <Link
                to="/register"
                className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
              >
                Register Now
              </Link>
            </motion.div>
            <motion.div className="inline-flex rounded-md shadow">
              <Link
                to="/pricing"
                className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-green-700 bg-white hover:bg-green-100"
              >
                View Pricing
              </Link>
            </motion.div>
            <motion.div className="inline-flex rounded-md shadow">
              <Link
                to="/login"
                className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-green-700 bg-white hover:bg-green-100"
              >
                Sign In
              </Link>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default FeaturesPage;
