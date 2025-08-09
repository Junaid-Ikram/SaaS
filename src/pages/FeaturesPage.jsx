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
      <div className="relative bg-gradient-to-br from-primary-800 via-primary-700 to-primary-900 text-white overflow-hidden">
        {/* Background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute left-0 top-0 h-96 w-96 rounded-full bg-primary-500 opacity-10 blur-3xl transform -translate-x-1/3 -translate-y-1/3"></div>
          <div className="absolute right-0 bottom-0 h-96 w-96 rounded-full bg-primary-400 opacity-10 blur-3xl transform translate-x-1/3 translate-y-1/3"></div>
          <div className="absolute left-1/2 top-1/2 h-[30rem] w-[30rem] rounded-full bg-primary-600 opacity-10 blur-3xl transform -translate-x-1/2 -translate-y-1/2"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto py-20 px-4 sm:py-28 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
              Platform Features
            </h1>
            <p className="mt-8 text-xl max-w-3xl mx-auto text-primary-100">
              Our Academy Platform provides powerful tools for academy owners, teachers, and students to create an effective learning environment.
            </p>
            <div className="mt-10 flex justify-center space-x-4">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link to="/register" className="group relative inline-flex items-center justify-center px-6 py-3 text-base font-medium text-white bg-white/10 border border-white/30 rounded-full overflow-hidden hover:bg-white/20 transition-all duration-300">
                  <span className="relative flex items-center">
                    Get Started
                    <svg className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </span>
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link to="/pricing" className="group relative inline-flex items-center justify-center px-6 py-3 text-base font-medium text-primary-900 bg-white rounded-full overflow-hidden hover:bg-primary-50 transition-all duration-300">
                  <span className="relative flex items-center">
                    View Pricing
                  </span>
                </Link>
              </motion.div>
            </div>
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
              <div className="lg:grid lg:grid-cols-3 lg:gap-12">
                <div>
                  <div className="inline-block mb-4">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary-100 text-primary-800">
                      <span className="flex h-2 w-2 rounded-full bg-primary-600 mr-2"></span>
                      {section.title}
                    </span>
                  </div>
                  <h2 className="text-3xl font-extrabold text-gray-900 mt-2">Powerful Management Tools</h2>
                  <p className="mt-4 text-lg text-gray-600">{section.description}</p>
                </div>
                <div className="mt-12 lg:mt-0 lg:col-span-2">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-10">
                    {section.features.map((feature, featureIndex) => (
                      <motion.div 
                        key={featureIndex} 
                        className="relative p-6 bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 group hover:border-primary-100" 
                        whileHover={{ scale: 1.03, y: -5 }}
                      >
                        <div className="flex items-start space-x-4">
                          <div className="flex-shrink-0">
                            <div className="flex items-center justify-center h-14 w-14 rounded-xl bg-gradient-to-br from-primary-400 to-primary-600 text-white shadow-lg transform group-hover:scale-110 transition-transform duration-300">
                              {feature.icon}
                            </div>
                          </div>
                          <div>
                            <h3 className="text-lg font-bold text-gray-900 group-hover:text-primary-600 transition-colors duration-300">{feature.title}</h3>
                            <p className="mt-2 text-base text-gray-600">{feature.description}</p>
                          </div>
                        </div>
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
      <motion.div className="relative overflow-hidden bg-gradient-to-br from-primary-50 to-primary-100" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
        {/* Animated background elements */}
        <motion.div 
          className="absolute top-0 right-0 w-72 h-72 bg-gradient-to-br from-primary-300/20 to-primary-400/20 rounded-full -mr-24 -mt-24 blur-3xl"
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ 
            duration: 8, 
            repeat: Infinity,
            repeatType: "reverse" 
          }}
        />
        <motion.div 
          className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-primary-300/20 to-primary-400/20 rounded-full -ml-24 -mb-24 blur-3xl"
          animate={{ 
            scale: [1, 1.1, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{ 
            duration: 10, 
            repeat: Infinity,
            repeatType: "reverse" 
          }}
        />
        
        <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:py-20 lg:px-8 lg:flex lg:items-center lg:justify-between relative z-10">
          <div>
            <div className="inline-block mb-4">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary-100 text-primary-800">
                <span className="flex h-2 w-2 rounded-full bg-primary-600 mr-2"></span>
                Join Today
              </span>
            </div>
            <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              <span className="block">Ready to get started?</span>
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-primary-400">Join our platform today.</span>
            </h2>
          </div>
          <div className="mt-8 flex flex-col sm:flex-row lg:mt-0 lg:flex-shrink-0 space-y-3 sm:space-y-0 sm:space-x-3">
            <motion.div className="inline-flex rounded-md shadow" whileHover={{ y: -3, scale: 1.02 }} transition={{ duration: 0.2 }}>
              <Link
                to="/register"
                className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-700 hover:to-primary-600 shadow-md hover:shadow-lg transition-all duration-300"
              >
                <div className="flex items-center">
                  <span>Register Now</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </div>
              </Link>
            </motion.div>
            <motion.div className="inline-flex rounded-md shadow" whileHover={{ y: -3, scale: 1.02 }} transition={{ duration: 0.2 }}>
              <Link
                to="/pricing"
                className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-primary-700 bg-white hover:bg-gray-50 shadow-md hover:shadow-lg transition-all duration-300"
              >
                View Pricing
              </Link>
            </motion.div>
            <motion.div className="inline-flex rounded-md shadow" whileHover={{ y: -3, scale: 1.02 }} transition={{ duration: 0.2 }}>
              <Link
                to="/login"
                className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-primary-700 bg-white hover:bg-gray-50 shadow-md hover:shadow-lg transition-all duration-300"
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
