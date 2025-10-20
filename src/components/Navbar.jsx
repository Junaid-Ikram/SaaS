import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { FaUser, FaUsers, FaSignOutAlt, FaBars, FaTimes, FaGraduationCap, FaChalkboardTeacher, FaHome, FaInfoCircle, FaTag, FaEnvelope, FaChevronDown, FaBell, FaSearch, FaArrowRight, FaCog, FaChartBar } from 'react-icons/fa';
import { HiOutlineAcademicCap } from 'react-icons/hi';

const Navbar = () => {
  const { user, userRole, userDetails, signOut } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [profileDropdown, setProfileDropdown] = useState(false);
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
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white/95 backdrop-blur-xl shadow-md border-b border-emerald-100' : 'bg-white/80 backdrop-blur-md'}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center">
            <motion.div 
              className="flex-shrink-0"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              <Link to="/" className="flex items-center space-x-1 group">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary-400 to-primary-600 rounded-xl blur-sm opacity-75"></div>
                  <div className="relative bg-gradient-to-br from-primary-500 to-primary-700 p-2.5 rounded-xl">
                    <HiOutlineAcademicCap className="h-7 w-7 text-white" />
                  </div>
                </div>
                <div className="flex flex-col">
                  <span className="text-xl font-bold text-gray-900 tracking-tight group-hover:text-primary-700 transition-colors">
                    EduPlatform
                  </span>
                  <span className="text-xs text-primary-600 font-medium -mt-1">
                    Learning Excellence
                  </span>
                </div>
              </Link>
            </motion.div>
            <div className="hidden lg:block">
              <div className="ml-10 flex items-center space-x-2">
                {!user ? (
                  <>
                    <Link
                      to="/"
                      className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-primary-600 border-b-2 border-transparent hover:border-primary-500 transition-all duration-200"
                    >
                      Home
                    </Link>
                    <Link
                      to="/features"
                      className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-primary-600 border-b-2 border-transparent hover:border-primary-500 transition-all duration-200"
                    >
                      Features
                    </Link>
                    <Link
                      to="/pricing"
                      className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-primary-600 border-b-2 border-transparent hover:border-primary-500 transition-all duration-200"
                    >
                      Pricing
                    </Link>
                    <Link
                      to="/contact"
                      className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-primary-600 border-b-2 border-transparent hover:border-primary-500 transition-all duration-200"
                    >
                      Contact
                    </Link>
                  </>
                ) : (
                  <>
                    <Link
                      to={getDashboardLink()}
                      className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-primary-600 border-b-2 border-transparent hover:border-primary-500 transition-all duration-200"
                    >
                      Dashboard
                    </Link>
                    {userRole === 'super_admin' && (
                      <>
                        <Link
                          to="/super-admin/academies"
                          className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-primary-600 border-b-2 border-transparent hover:border-primary-500 transition-all duration-200"
                        >
                          Academies
                        </Link>
                        <Link
                          to="/super-admin/users"
                          className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-primary-600 border-b-2 border-transparent hover:border-primary-500 transition-all duration-200"
                        >
                          Users
                        </Link>
                        <Link
                          to="/super-admin/platform-settings"
                          className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-primary-600 border-b-2 border-transparent hover:border-primary-500 transition-all duration-200"
                        >
                          Settings
                        </Link>
                        <Link
                          to="/super-admin/reports"
                          className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-primary-600 border-b-2 border-transparent hover:border-primary-500 transition-all duration-200"
                        >
                          Reports
                        </Link>
                      </>
                    )}
                    {userRole === 'academy_owner' && (
                      <Link
                        to="/academy/subscription"
                        className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-primary-600 border-b-2 border-transparent hover:border-primary-500 transition-all duration-200"
                      >
                        Subscription
                      </Link>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
          <div className="hidden lg:block">
            <div className="ml-8 flex items-center space-x-5">
              {user ? (
                <div className="flex items-center space-x-5">
                  {/* Notifications */}
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="relative p-2 text-gray-600 hover:text-primary-600 transition-colors duration-200"
                  >
                    <FaBell className="h-5 w-5" />
                    <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full border-2 border-white"></span>
                  </motion.button>
                  
                  {/* Profile Dropdown */}
                  <div className="relative">
                    <motion.button 
                      onClick={() => setProfileDropdown(!profileDropdown)}
                      className="flex items-center space-x-2 bg-white hover:bg-gray-50 px-3 py-2 rounded-full transition-all duration-200 border border-gray-200 hover:border-primary-300 shadow-sm"
                      whileHover={{ y: -1 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="w-7 h-7 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center">
                        <FaUser className="h-3.5 w-3.5 text-white" />
                      </div>
                      <div className="hidden xl:block text-left">
                        <div className="text-sm font-medium text-gray-800">{getUserDisplayName()}</div>
                        {userRole && (
                          <div className="text-xs text-primary-600 font-medium">
                            {userRole.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                          </div>
                        )}
                      </div>
                      <FaChevronDown className="h-3 w-3 text-gray-400" />
                    </motion.button>
                  
                    {/* Profile Dropdown */}
                    <AnimatePresence>
                      {profileDropdown && (
                        <motion.div 
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.95 }}
                          transition={{ duration: 0.2 }}
                          className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg py-2 z-50 border border-gray-100 ring-1 ring-black ring-opacity-5"
                        >
                          <div className="px-4 py-3 border-b border-gray-100">
                            <p className="text-sm font-medium text-gray-800">{getUserDisplayName()}</p>
                            <p className="text-xs text-gray-500 truncate mt-0.5">{user?.email}</p>
                          </div>
                          
                          <div className="py-1">
                            <Link to={getDashboardLink()} className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary-600">
                              <FaChalkboardTeacher className="mr-3 h-4 w-4 text-gray-400" />
                              Dashboard
                            </Link>
                            
                            {userRole === 'academy_owner' && (
                              <Link to="/academy/subscription" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary-600">
                                <FaGraduationCap className="mr-3 h-4 w-4 text-gray-400" />
                                Subscription
                              </Link>
                            )}

                            {userRole === 'super_admin' && (
                              <>
                                <Link to="/super-admin/academies" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary-600">
                                  <FaGraduationCap className="mr-3 h-4 w-4 text-gray-400" />
                                  Academy management
                                </Link>
                                <Link to="/super-admin/users" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary-600">
                                  <FaUsers className="mr-3 h-4 w-4 text-gray-400" />
                                  User management
                                </Link>
                                <Link to="/super-admin/platform-settings" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary-600">
                                  <FaCog className="mr-3 h-4 w-4 text-gray-400" />
                                  Platform settings
                                </Link>
                                <Link to="/super-admin/reports" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary-600">
                                  <FaChartBar className="mr-3 h-4 w-4 text-gray-400" />
                                  Reports &amp; billing
                                </Link>
                              </>
                            )}
                          </div>
                          
                          <div className="py-1 border-t border-gray-100">
                            <button
                              onClick={signOut}
                              className="w-full text-left flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                            >
                              <FaSignOutAlt className="mr-3 h-4 w-4 text-red-500" />
                              Sign out
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              ) : (
                <div className="flex items-center space-x-4">
                  <motion.div whileTap={{ scale: 0.97 }}>
                    <Link
                      to="/login"
                      className="px-4 py-2 text-sm font-medium text-primary-600 hover:text-primary-700 border border-transparent hover:border-primary-200 rounded-md transition-all duration-200"
                    >
                      Sign In
                    </Link>
                  </motion.div>
                  <motion.div whileTap={{ scale: 0.97 }}>
                    <Link
                      to="/register"
                      className="px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-md shadow-sm hover:shadow transition-all duration-200 flex items-center space-x-2"
                    >
                      <span>Get Started</span>
                      <FaArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </motion.div>
                </div>
              )}
            </div>
          </div>
          <div className="flex lg:hidden">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleMenu}
              className="p-2 rounded-md text-gray-600 hover:text-primary-600 hover:bg-gray-100 transition-all duration-200"
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? (
                <FaTimes className="h-5 w-5" />
              ) : (
                <FaBars className="h-5 w-5" />
              )}
            </motion.button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="lg:hidden absolute top-full left-0 right-0 bg-white/95 backdrop-blur-md border-t border-gray-100 shadow-md overflow-hidden"
          >
            <div className="px-4 py-4 space-y-1 max-h-[80vh] overflow-y-auto">
              {!user ? (
                // Public navigation links for mobile
                <>
                  <Link
                    to="/"
                    className="flex items-center space-x-3 px-3 py-2.5 rounded-md text-gray-700 hover:text-primary-600 hover:bg-gray-50 transition-all duration-200"
                  >
                    <FaHome className="h-5 w-5 text-gray-400" />
                    <span className="font-medium">Home</span>
                  </Link>
                  <Link
                    to="/features"
                    className="flex items-center space-x-3 px-3 py-2.5 rounded-md text-gray-700 hover:text-primary-600 hover:bg-gray-50 transition-all duration-200"
                  >
                    <FaInfoCircle className="h-5 w-5 text-gray-400" />
                    <span className="font-medium">Features</span>
                  </Link>
                  <Link
                    to="/pricing"
                    className="flex items-center space-x-3 px-3 py-2.5 rounded-md text-gray-700 hover:text-primary-600 hover:bg-gray-50 transition-all duration-200"
                  >
                    <FaTag className="h-5 w-5 text-gray-400" />
                    <span className="font-medium">Pricing</span>
                  </Link>
                  <Link
                    to="/contact"
                    className="flex items-center space-x-3 px-3 py-2.5 rounded-md text-gray-700 hover:text-primary-600 hover:bg-gray-50 transition-all duration-200"
                  >
                    <FaEnvelope className="h-5 w-5 text-gray-400" />
                    <span className="font-medium">Contact</span>
                  </Link>
                </>
              ) : (
                // Dashboard link for mobile
                <Link
                  to={getDashboardLink()}
                  className="flex items-center space-x-3 px-3 py-2.5 rounded-md text-gray-700 hover:text-primary-600 hover:bg-gray-50 transition-all duration-200"
                >
                  <FaChalkboardTeacher className="h-5 w-5 text-gray-400" />
                  <span className="font-medium">Dashboard</span>
                </Link>
              )}
            </div>
            <div className="pt-3 mt-3 border-t border-gray-100">
              {user ? (
                <div className="px-4 space-y-3">
                  <div className="py-3 bg-gray-50 rounded-md px-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center">
                        <FaUser className="h-4 w-4 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-medium text-gray-800">{getUserDisplayName()}</div>
                        <div className="text-xs text-gray-500 mt-0.5">{user.email}</div>
                        {userRole && (
                          <div className="mt-1.5">
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-primary-50 text-primary-700">
                              {userRole.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="space-y-1">
                    {userRole === 'academy_owner' && (
                      <Link
                        to="/academy/subscription"
                        className="flex items-center space-x-3 px-3 py-2.5 rounded-md text-gray-700 hover:text-primary-600 hover:bg-gray-50 transition-all duration-200"
                      >
                        <FaGraduationCap className="h-5 w-5 text-gray-400" />
                        <span className="font-medium">Manage Subscription</span>
                      </Link>
                    )}
                    {userRole === 'super_admin' && (
                      <>
                        <Link
                          to="/super-admin/academies"
                          className="flex items-center space-x-3 px-3 py-2.5 rounded-md text-gray-700 hover:text-primary-600 hover:bg-gray-50 transition-all duration-200"
                        >
                          <FaGraduationCap className="h-5 w-5 text-gray-400" />
                          <span className="font-medium">Academy management</span>
                        </Link>
                        <Link
                          to="/super-admin/users"
                          className="flex items-center space-x-3 px-3 py-2.5 rounded-md text-gray-700 hover:text-primary-600 hover:bg-gray-50 transition-all duration-200"
                        >
                          <FaUsers className="h-5 w-5 text-gray-400" />
                          <span className="font-medium">User management</span>
                        </Link>
                        <Link
                          to="/super-admin/platform-settings"
                          className="flex items-center space-x-3 px-3 py-2.5 rounded-md text-gray-700 hover:text-primary-600 hover:bg-gray-50 transition-all duration-200"
                        >
                          <FaCog className="h-5 w-5 text-gray-400" />
                          <span className="font-medium">Platform settings</span>
                        </Link>
                        <Link
                          to="/super-admin/reports"
                          className="flex items-center space-x-3 px-3 py-2.5 rounded-md text-gray-700 hover:text-primary-600 hover:bg-gray-50 transition-all duration-200"
                        >
                          <FaChartBar className="h-5 w-5 text-gray-400" />
                          <span className="font-medium">Reports &amp; billing</span>
                        </Link>
                      </>
                    )}
                    <button
                      onClick={signOut}
                      className="flex items-center space-x-3 px-3 py-2.5 rounded-md text-red-600 hover:text-red-700 hover:bg-red-50 transition-all duration-200 w-full text-left"
                    >
                      <FaSignOutAlt className="h-5 w-5 text-red-500" />
                      <span className="font-medium">Sign Out</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="px-4 py-3 space-y-3 border-t border-gray-100 mt-3">
                  <Link
                    to="/login"
                    className="flex items-center justify-center space-x-2 px-4 py-2.5 rounded-md text-primary-600 hover:text-primary-700 bg-white border border-primary-200 hover:border-primary-300 transition-all duration-200 font-medium"
                  >
                    <span>Sign In</span>
                  </Link>
                  <Link
                    to="/register"
                    className="flex items-center justify-center space-x-2 px-4 py-2.5 rounded-md text-white bg-primary-600 hover:bg-primary-700 transition-all duration-200 font-medium shadow-sm hover:shadow"
                  >
                    <span>Get Started</span>
                    <FaArrowRight className="h-3.5 w-3.5" />
                  </Link>
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
