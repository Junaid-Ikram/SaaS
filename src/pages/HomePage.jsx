import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useAnimation, useInView, AnimatePresence } from 'framer-motion';
import { FaArrowRight, FaGraduationCap, FaChalkboardTeacher, FaSchool, FaUserPlus, FaCheckCircle } from 'react-icons/fa';

// Animation variants
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const slideIn = {
  hidden: { opacity: 0, x: -30 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6 } }
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } }
};

const buttonHover = {
  hover: { scale: 1.05, boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.1)" },
  tap: { scale: 0.95 }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

const featureVariant = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

const pulseAnimation = {
  scale: [1, 1.05, 1],
  transition: { duration: 2, repeat: Infinity }
};

// Animated Section Component
const AnimatedSection = ({ children, className }) => {
  const controls = useAnimation();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, threshold: 0.2 });
  
  useEffect(() => {
    if (inView) {
      controls.start('visible');
    }
  }, [controls, inView]);
  
  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={fadeIn}
      className={className}
    >
      {children}
    </motion.div>
  );
};

const HomePage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary-900 via-secondary-900 to-primary-800 text-white pt-24 pb-16 relative overflow-hidden">
        {/* Animated background elements */}
        <motion.div 
          className="absolute top-20 left-10 w-64 h-64 bg-secondary-500 rounded-full opacity-10"
          animate={{ 
            scale: [1, 1.2, 1],
            x: [0, 20, 0],
            y: [0, -20, 0],
          }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div 
          className="absolute bottom-10 right-10 w-96 h-96 bg-primary-500 rounded-full opacity-10"
          animate={{ 
            scale: [1, 1.3, 1],
            x: [0, -30, 0],
            y: [0, 30, 0],
          }}
          transition={{ duration: 10, repeat: Infinity }}
        />
        
        <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-4xl tracking-tight font-extrabold sm:text-5xl md:text-6xl">
                <span className="block">Transform Education with</span>
                <span className="block bg-gradient-to-r from-primary-300 to-secondary-300 bg-clip-text text-transparent">Academy Platform</span>
              </h1>
              <p className="mt-3 max-w-md mx-auto text-base text-primary-100 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
                The complete solution for academies, teachers, and students. Manage your educational institution with ease and elevate the learning experience.
              </p>
            </motion.div>
            
            <motion.div 
              className="mt-8 max-w-md mx-auto sm:flex sm:justify-center md:mt-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              <motion.div 
                className="rounded-md shadow"
                whileHover={{ scale: 1.05, boxShadow: "0px 8px 20px rgba(0, 0, 0, 0.2)" }}
                whileTap={{ scale: 0.95 }}
                animate={{
                  boxShadow: ["0px 0px 0px rgba(79, 70, 229, 0.2)", "0px 0px 20px rgba(79, 70, 229, 0.6)", "0px 0px 0px rgba(79, 70, 229, 0.2)"],
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Link
                  to="/register"
                  className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-700 hover:to-secondary-700 md:py-4 md:text-lg md:px-10 transition-all duration-200 shadow-lg"
                >
                  <span>Create Your Academy</span>
                  <FaArrowRight className="ml-2 animate-pulse" />
                </Link>
              </motion.div>
              <motion.div 
                className="mt-3 rounded-md shadow sm:mt-0 sm:ml-3"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  to="/features"
                  className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-primary-600 bg-white hover:bg-gray-50 md:py-4 md:text-lg md:px-10 transition-all duration-200"
                >
                  Explore Features
                </Link>
              </motion.div>
              <motion.div 
                className="mt-3 rounded-md shadow sm:mt-0 sm:ml-3"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  to="/login"
                  className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-primary-600 bg-white hover:bg-gray-50 md:py-4 md:text-lg md:px-10 transition-all duration-200"
                >
                  Sign in
                </Link>
              </motion.div>
            </motion.div>
            
            <motion.div
              className="mt-8 text-sm text-primary-200 flex justify-center items-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.5 }}
              whileHover={{ scale: 1.05 }}
            >
              <FaCheckCircle className="h-5 w-5 mr-2" />
              <span>No credit card required • 14-day free trial</span>
            </motion.div>
            <motion.div 
              className="mt-4 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 0.5 }}
            >
              <Link
                to="/pricing"
                className="text-primary-200 hover:text-white text-sm font-medium underline flex items-center justify-center"
              >
                <span>View pricing plans</span>
                <FaArrowRight className="ml-1 h-3 w-3" />
              </Link>
            </motion.div>
            
            {/* Role selection buttons */}
            <motion.div 
              className="mt-12 max-w-lg mx-auto grid grid-cols-3 gap-4"
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
            >
              <motion.div 
                variants={scaleIn}
                whileHover={{ scale: 1.05, y: -5 }}
                className="bg-white bg-opacity-10 rounded-lg p-4 backdrop-filter backdrop-blur-sm border border-white border-opacity-20 hover:bg-opacity-20 transition-all duration-300"
              >
                <Link to="/register" className="flex flex-col items-center text-white">
                  <FaSchool className="h-8 w-8 mb-2 text-primary-300" />
                  <span className="text-sm font-medium">Academy Owner</span>
                </Link>
              </motion.div>
              <motion.div 
                variants={scaleIn}
                whileHover={{ scale: 1.05, y: -5 }}
                className="bg-white bg-opacity-10 rounded-lg p-4 backdrop-filter backdrop-blur-sm border border-white border-opacity-20 hover:bg-opacity-20 transition-all duration-300"
              >
                <Link to="/register" className="flex flex-col items-center text-white">
                  <FaChalkboardTeacher className="h-8 w-8 mb-2 text-purple-300" />
                  <span className="text-sm font-medium">Teacher</span>
                </Link>
              </motion.div>
              <motion.div 
                variants={scaleIn}
                whileHover={{ scale: 1.05, y: -5 }}
                className="bg-white bg-opacity-10 rounded-lg p-4 backdrop-filter backdrop-blur-sm border border-white border-opacity-20 hover:bg-opacity-20 transition-all duration-300"
              >
                <Link to="/register" className="flex flex-col items-center text-white">
                  <FaGraduationCap className="h-8 w-8 mb-2 text-indigo-300" />
                  <span className="text-sm font-medium">Student</span>
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Role-based Features Section */}
      <AnimatedSection className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-indigo-600 font-semibold tracking-wide uppercase">Role-Based Platform</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Tailored for Every Educational Role
            </p>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
              Our platform provides specialized tools for academy owners, teachers, and students, creating a seamless educational ecosystem.
            </p>
          </div>

          <motion.div 
            className="mt-16"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            <div className="space-y-12 lg:space-y-0 lg:grid lg:grid-cols-3 lg:gap-8">
              {/* Academy Owners */}
              <motion.div variants={featureVariant} className="relative p-8 bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100">
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-indigo-600 text-white shadow-lg">
                    <FaSchool className="h-8 w-8" />
                  </div>
                </div>
                <div className="mt-8 text-center">
                  <h3 className="text-xl leading-6 font-bold text-gray-900 mt-4">Academy Owners</h3>
                  <p className="mt-4 text-base text-gray-500">
                    Manage your entire academy, approve teachers and students, track performance, and grow your educational business.
                  </p>
                  <ul className="mt-6 text-sm text-gray-500 space-y-2">
                    <li className="flex items-center justify-center">
                      <svg className="h-5 w-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>User approval system</span>
                    </li>
                    <li className="flex items-center justify-center">
                      <svg className="h-5 w-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>Academy analytics</span>
                    </li>
                    <li className="flex items-center justify-center">
                      <svg className="h-5 w-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>User management</span>
                    </li>
                  </ul>
                </div>
              </motion.div>

              {/* Teachers */}
              <motion.div variants={featureVariant} className="relative p-8 bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100">
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-purple-600 text-white shadow-lg">
                    <FaChalkboardTeacher className="h-8 w-8" />
                  </div>
                </div>
                <div className="mt-8 text-center">
                  <h3 className="text-xl leading-6 font-bold text-gray-900 mt-4">Teachers</h3>
                  <p className="mt-4 text-base text-gray-500">
                    Create and manage classes, track student progress, and deliver engaging educational content.
                  </p>
                  <ul className="mt-6 text-sm text-gray-500 space-y-2">
                    <li className="flex items-center justify-center">
                      <svg className="h-5 w-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>Class management</span>
                    </li>
                    <li className="flex items-center justify-center">
                      <svg className="h-5 w-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>Student progress tracking</span>
                    </li>
                    <li className="flex items-center justify-center">
                      <svg className="h-5 w-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>Content creation tools</span>
                    </li>
                  </ul>
                </div>
              </motion.div>

              {/* Students */}
              <motion.div variants={featureVariant} className="relative p-8 bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100">
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-indigo-500 text-white shadow-lg">
                    <FaGraduationCap className="h-8 w-8" />
                  </div>
                </div>
                <div className="mt-8 text-center">
                  <h3 className="text-xl leading-6 font-bold text-gray-900 mt-4">Students</h3>
                  <p className="mt-4 text-base text-gray-500">
                    Access classes, track your progress, and engage with educational content in an intuitive interface.
                  </p>
                  <ul className="mt-6 text-sm text-gray-500 space-y-2">
                    <li className="flex items-center justify-center">
                      <svg className="h-5 w-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>Class enrollment</span>
                    </li>
                    <li className="flex items-center justify-center">
                      <svg className="h-5 w-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>Progress dashboard</span>
                    </li>
                    <li className="flex items-center justify-center">
                      <svg className="h-5 w-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>Learning resources</span>
                    </li>
                  </ul>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </AnimatedSection>

      {/* Free Trial Section */}
      <AnimatedSection className="py-16 bg-gradient-to-r from-indigo-100 to-purple-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:flex lg:items-center lg:justify-between">
            <div className="lg:w-1/2">
              <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                <span className="block">Start your 14-day free trial</span>
                <span className="block text-indigo-600">No credit card required</span>
              </h2>
              <p className="mt-4 text-lg text-gray-500">
                Experience the full power of Academy Platform with our risk-free trial. Get access to all features and see how it can transform your educational institution.
              </p>
              <div className="mt-8 space-y-4">
                <div className="flex items-center">
                  <svg className="h-6 w-6 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700">Full access to all features</span>
                </div>
                <div className="flex items-center">
                  <svg className="h-6 w-6 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700">Unlimited users during trial</span>
                </div>
                <div className="flex items-center">
                  <svg className="h-6 w-6 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700">Priority support</span>
                </div>
              </div>
              <div className="mt-8">
                <motion.div 
                  whileHover={{ scale: 1.05 }} 
                  whileTap={{ scale: 0.95 }}
                  animate={pulseAnimation}
                  className="inline-block"
                >
                  <Link
                    to="/register"
                    className="px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 md:py-4 md:text-lg md:px-8 shadow-md transition-all duration-200 flex items-center"
                  >
                    <span>Start Free Trial</span>
                    <FaArrowRight className="ml-2" />
                  </Link>
                </motion.div>
              </div>
            </div>
            <div className="mt-10 lg:mt-0 lg:w-1/2">
              <motion.div 
                className="relative mx-auto w-full rounded-lg shadow-lg overflow-hidden"
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                <div className="bg-white p-8 rounded-lg border border-gray-200">
                  <div className="text-center">
                    <h3 className="text-2xl font-bold text-gray-900">What's included in the trial</h3>
                    <div className="mt-6 space-y-6">
                      <div className="flex">
                        <div className="flex-shrink-0">
                          <div className="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                            </svg>
                          </div>
                        </div>
                        <div className="ml-4 text-left">
                          <h4 className="text-lg font-medium text-gray-900">Secure Authentication</h4>
                          <p className="mt-2 text-base text-gray-500">Role-based access control with JWT tokens</p>
                        </div>
                      </div>
                      <div className="flex">
                        <div className="flex-shrink-0">
                          <div className="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                          </div>
                        </div>
                        <div className="ml-4 text-left">
                          <h4 className="text-lg font-medium text-gray-900">Email Notifications</h4>
                          <p className="mt-2 text-base text-gray-500">Automated emails for user approvals and updates</p>
                        </div>
                      </div>
                      <div className="flex">
                        <div className="flex-shrink-0">
                          <div className="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            </svg>
                          </div>
                        </div>
                        <div className="ml-4 text-left">
                          <h4 className="text-lg font-medium text-gray-900">Analytics Dashboard</h4>
                          <p className="mt-2 text-base text-gray-500">Comprehensive insights for all user roles</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </AnimatedSection>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-indigo-800 to-purple-800 text-white relative overflow-hidden">
        {/* Animated background elements */}
        <motion.div 
          className="absolute top-10 right-10 w-64 h-64 bg-purple-500 rounded-full opacity-10"
          animate={{ 
            scale: [1, 1.2, 1],
            x: [0, -20, 0],
            y: [0, 20, 0],
          }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div 
          className="absolute bottom-10 left-10 w-96 h-96 bg-indigo-500 rounded-full opacity-10"
          animate={{ 
            scale: [1, 1.3, 1],
            x: [0, 30, 0],
            y: [0, -30, 0],
          }}
          transition={{ duration: 10, repeat: Infinity }}
        />
        
        <div className="max-w-2xl mx-auto text-center py-16 px-4 sm:py-20 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-extrabold sm:text-4xl">
              <span className="block">Ready to transform your academy?</span>
              <span className="block mt-2">Get started today.</span>
            </h2>
            <p className="mt-4 text-lg leading-6 text-indigo-100">
              Join thousands of educational institutions that have elevated their teaching and learning experience with our platform.
            </p>
            
            {/* Role-based signup buttons */}
            <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-6">
              <motion.div 
                className="rounded-lg overflow-hidden shadow-lg"
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                viewport={{ once: true }}
              >
                <Link
                  to="/register"
                  className="w-full flex flex-col items-center justify-center px-4 py-4 bg-white bg-opacity-10 backdrop-filter backdrop-blur-sm hover:bg-opacity-20 transition-all duration-200 h-full"
                >
                  <FaSchool className="h-8 w-8 mb-2 text-indigo-300" />
                  <span className="text-white font-medium">Academy Owner</span>
                  <span className="text-xs text-indigo-200 mt-1">Create your academy</span>
                </Link>
              </motion.div>
              
              <motion.div 
                className="rounded-lg overflow-hidden shadow-lg"
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                viewport={{ once: true }}
              >
                <Link
                  to="/register"
                  className="w-full flex flex-col items-center justify-center px-4 py-4 bg-white bg-opacity-10 backdrop-filter backdrop-blur-sm hover:bg-opacity-20 transition-all duration-200 h-full"
                >
                  <FaChalkboardTeacher className="h-8 w-8 mb-2 text-purple-300" />
                  <span className="text-white font-medium">Teacher</span>
                  <span className="text-xs text-indigo-200 mt-1">Join an academy</span>
                </Link>
              </motion.div>
              
              <motion.div 
                className="rounded-lg overflow-hidden shadow-lg"
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.2 }}
                viewport={{ once: true }}
              >
                <Link
                  to="/register"
                  className="w-full flex flex-col items-center justify-center px-4 py-4 bg-white bg-opacity-10 backdrop-filter backdrop-blur-sm hover:bg-opacity-20 transition-all duration-200 h-full"
                >
                  <FaGraduationCap className="h-8 w-8 mb-2 text-indigo-300" />
                  <span className="text-white font-medium">Student</span>
                  <span className="text-xs text-indigo-200 mt-1">Enroll in classes</span>
                </Link>
              </motion.div>
            </div>
            
            <motion.div 
              className="mt-10 w-full sm:w-auto inline-block"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              animate={{
                boxShadow: ["0px 0px 0px rgba(255, 255, 255, 0.2)", "0px 0px 20px rgba(255, 255, 255, 0.5)", "0px 0px 0px rgba(255, 255, 255, 0.2)"],
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Link
                to="/register"
                className="w-full flex items-center justify-center px-8 py-4 border border-transparent text-base font-medium rounded-md text-indigo-700 bg-white hover:bg-indigo-50 sm:w-auto transition-all duration-200 shadow-lg"
              >
                <FaUserPlus className="mr-2" />
                <span>Sign up for free</span>
                <FaArrowRight className="ml-2 animate-pulse" />
              </Link>
            </motion.div>
            
            <motion.p 
              className="mt-4 text-sm text-indigo-200"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              viewport={{ once: true }}
            >
              <FaCheckCircle className="inline mr-1" /> No credit card required • 14-day free trial
            </motion.p>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;