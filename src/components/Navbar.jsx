import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { FaUserCircle, FaSignOutAlt, FaBars, FaTimes, FaGraduationCap, FaChalkboardTeacher, FaSchool } from 'react-icons/fa';

const Navbar = () => {
  const { user, userRole, userDetails, signOut } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [scrolled]);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Get dashboard link based on user role
  const getDashboardLink = () => {
    if (!userRole) return '/dashboard';
    
    switch (userRole) {
      case 'super_admin':
        return '/super-admin/dashboard';
      case 'academy_owner':
        return '/academy/dashboard';
      case 'teacher':
        return '/teacher/dashboard';
      case 'student':
        return '/student/dashboard';
      default:
        return '/dashboard';
    }
  };

  // Get user display name
  const getUserDisplayName = () => {
    if (!user) return '';
    
    if (userDetails?.name) return userDetails.name;
    if (userDetails?.full_name) return userDetails.full_name;
    
    return user.email.split('@')[0];
  };

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 120, damping: 20 }}
      className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-primary-800 shadow-lg' : 'bg-primary-700 bg-opacity-90'}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <motion.div 
              className="flex-shrink-0"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link to="/" className="flex items-center">
                <FaSchool className="h-6 w-6 text-secondary-400 mr-2" />
                <span className="text-white font-bold text-xl bg-gradient-to-r from-primary-400 to-secondary-500 bg-clip-text text-transparent">Academy Platform</span>
              </Link>
            </motion.div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link
                    to="/"
                    className="text-gray-100 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 hover:bg-primary-600 hover:bg-opacity-50 flex items-center"
                  >
                    Home
                  </Link>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link
                    to="/features"
                    className="text-gray-100 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 hover:bg-primary-600 hover:bg-opacity-50 flex items-center"
                  >
                    Features
                  </Link>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link
                    to="/pricing"
                    className="text-gray-100 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 hover:bg-primary-600 hover:bg-opacity-50 flex items-center"
                  >
                    Pricing
                  </Link>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link
                    to="/contact"
                    className="text-gray-100 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 hover:bg-primary-600 hover:bg-opacity-50 flex items-center"
                  >
                    Contact
                  </Link>
                </motion.div>
                {user && userRole && (
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Link
                      to={getDashboardLink()}
                      className="text-gray-100 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 hover:bg-primary-600 hover:bg-opacity-50 flex items-center"
                    >
                      Dashboard
                    </Link>
                  </motion.div>
                )}
              </div>
            </div>
          </div>
          <div className="hidden md:block">
            <div className="ml-4 flex items-center md:ml-6">
              {user ? (
                <div className="flex items-center space-x-4">
                  <div className="text-sm text-gray-300">
                    <span className="hidden lg:inline-block">Hello, </span>
                    <span className="font-medium">{getUserDisplayName()}</span>
                    {userRole && (
                      <span className="ml-2 px-2 py-1 text-xs rounded-full bg-primary-600 text-white shadow-sm">
                        {userRole.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </span>
                    )}
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={signOut}
                    className="text-white px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 border border-primary-600 hover:border-primary-500 hover:bg-primary-600 hover:bg-opacity-20 flex items-center"
                  >
                    <span>Sign out</span>
                    <FaSignOutAlt className="ml-2 h-4 w-4" />
                  </motion.button>
                </div>
              ) : (
                <div className="flex space-x-4 items-center">
                  <motion.div 
                    whileHover={{ scale: 1.05 }} 
                    whileTap={{ scale: 0.95 }}
                    className="relative"
                  >
                    <Link
                      to="/login"
                      className="text-white px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 border border-primary-500 hover:border-primary-400 hover:bg-primary-500 hover:bg-opacity-20 flex items-center"
                    >
                      <FaUserCircle className="mr-2 h-4 w-4" />
                      <span>Sign in</span>
                    </Link>
                  </motion.div>
                  <motion.div 
                    whileHover={{ scale: 1.05 }} 
                    whileTap={{ scale: 0.95 }}
                    className="relative overflow-hidden rounded-md"
                  >
                    <span className="absolute inset-0 bg-gradient-to-r from-primary-500 to-secondary-500 animate-pulse opacity-70 blur-sm"></span>
                    <Link
                      to="/register"
                      className="relative bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600 text-white px-5 py-2 rounded-md text-sm font-medium shadow-md transition-all duration-200 flex items-center"
                    >
                      <span className="mr-1">Sign up</span>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </Link>
                  </motion.div>
                </div>
              )}
            </div>
          </div>
          <div className="-mr-2 flex md:hidden">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none"
            >
              <span className="sr-only">Open main menu</span>
              <svg
                className={`${isMenuOpen ? 'hidden' : 'block'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
              <svg
                className={`${isMenuOpen ? 'block' : 'hidden'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </motion.button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-primary-700 shadow-lg"
          >
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Link
                  to="/"
                  className="text-gray-100 hover:bg-primary-600 hover:text-white block px-3 py-2 rounded-md text-base font-medium flex items-center"
                >
                  <span className="mr-2">🏠</span> Home
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Link
                  to="/features"
                  className="text-gray-100 hover:bg-primary-600 hover:text-white block px-3 py-2 rounded-md text-base font-medium flex items-center"
                >
                  <span className="mr-2">✨</span> Features
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Link
                  to="/pricing"
                  className="text-gray-100 hover:bg-primary-600 hover:text-white block px-3 py-2 rounded-md text-base font-medium flex items-center"
                >
                  <span className="mr-2">💰</span> Pricing
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Link
                  to="/contact"
                  className="text-gray-100 hover:bg-primary-600 hover:text-white block px-3 py-2 rounded-md text-base font-medium flex items-center"
                >
                  <span className="mr-2">📞</span> Contact
                </Link>
              </motion.div>
              {user && userRole && (
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Link
                    to={getDashboardLink()}
                    className="text-gray-100 hover:bg-primary-600 hover:text-white block px-3 py-2 rounded-md text-base font-medium flex items-center"
                  >
                    <span className="mr-2">📊</span> Dashboard
                  </Link>
                </motion.div>
              )}
            </div>
            <div className="pt-4 pb-3 border-t border-primary-600">
              {user ? (
                <div className="px-2 space-y-1">
                  <div className="px-3 py-2 text-base font-medium text-white">
                    <span>Signed in as </span>
                    <span className="font-semibold">{getUserDisplayName()}</span>
                    {userRole && (
                      <span className="ml-2 px-2 py-1 text-xs rounded-full bg-primary-600 text-white shadow-sm">
                        {userRole.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </span>
                    )}
                  </div>
                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    onClick={signOut}
                    className="w-full text-left text-white hover:bg-primary-600 hover:text-white block px-3 py-2 rounded-md text-base font-medium flex items-center"
                  >
                    <FaSignOutAlt className="mr-2 h-4 w-4" />
                    Sign out
                  </motion.button>
                </div>
              ) : (
                <div className="px-2 space-y-3">
                  <motion.div whileTap={{ scale: 0.98 }}>
                    <Link
                      to="/login"
                      className="text-white hover:bg-primary-500 hover:bg-opacity-20 block px-3 py-2 rounded-md text-base font-medium border border-primary-500 flex items-center"
                    >
                      <FaUserCircle className="mr-2 h-5 w-5" />
                      Sign in
                    </Link>
                  </motion.div>
                  <motion.div whileTap={{ scale: 0.98 }}>
                    <Link
                      to="/register"
                      className="bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600 text-white block px-3 py-2 rounded-md text-base font-medium shadow-md flex items-center justify-center"
                    >
                      <span className="mr-1">Sign up now</span>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </Link>
                  </motion.div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;