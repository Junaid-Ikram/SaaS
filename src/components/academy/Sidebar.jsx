import React from 'react';
import { motion } from 'framer-motion';
import {
  FaTachometerAlt,
  FaUserCheck,
  FaBell,
  FaCreditCard,
  FaVideo,
  FaCalendarAlt,
  FaBook,
  FaSignOutAlt,
  FaCog,
  FaSchool,
  FaChevronLeft,
  FaChevronRight
} from 'react-icons/fa';

// Import animation variants
import { sidebarVariants, mobileSidebarVariants, navItemVariants } from './animationVariants';

const Sidebar = ({
  academyData,
  activeTab,
  setActiveTab,
  sidebarCollapsed,
  setSidebarCollapsed,
  isMobile,
  unreadNotifications
}) => {
  // Animation variants are now imported at the top of the file
  return (
    <motion.div 
      className="fixed left-0 top-0 h-screen bg-gradient-to-br from-green-700 via-green-800 to-green-900 text-white shadow-xl z-20 overflow-hidden"
      variants={isMobile ? mobileSidebarVariants : sidebarVariants}
      animate={sidebarCollapsed ? 'mini' : 'open'}
      initial="open"
      whileHover={sidebarCollapsed ? { width: '256px', transition: { type: 'spring', stiffness: 500, damping: 30 } } : {}}
    >
      <div className="p-5 flex items-center justify-between border-b border-green-600">
        <motion.div 
          className="flex items-center"
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
        >
          <div className="bg-white p-2 rounded-lg shadow-md">
            <FaSchool className="text-green-700 text-xl" />
          </div>
          <span className="ml-3 font-bold text-lg truncate text-white">{academyData?.name || 'Academy'}</span>
        </motion.div>
        <button 
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className={`p-1 rounded-full hover:bg-green-600 focus:outline-none ${isMobile ? 'hidden' : 'block'}`}
        >
          {sidebarCollapsed ? <FaChevronRight /> : <FaChevronLeft />}
        </button>
      </div>

      <div className="py-4 overflow-y-auto">
        <ul className="space-y-1 px-3">
          <li>
            <button
              onClick={() => setActiveTab('overview')}
              className={`w-full flex items-center px-4 py-3 rounded-lg transition-all duration-200 ${activeTab === 'overview' ? 'bg-white text-green-700 shadow-md font-medium' : 'text-white hover:bg-green-600'}`}
            >
              <FaTachometerAlt className={`${activeTab === 'overview' ? 'text-green-600' : 'text-green-300'} text-lg`} />
              <motion.span 
                className="ml-3"
                variants={navItemVariants}
                animate={sidebarCollapsed ? 'closed' : 'open'}
                transition={{ duration: 0.2 }}
              >
                Academy Overview
              </motion.span>
            </button>
          </li>
          <li>
            <button
              onClick={() => setActiveTab('users')}
              className={`w-full flex items-center px-4 py-3 rounded-lg transition-all duration-200 ${activeTab === 'users' ? 'bg-white text-green-700 shadow-md font-medium' : 'text-white hover:bg-green-600'}`}
            >
              <FaUserCheck className={`${activeTab === 'users' ? 'text-green-600' : 'text-green-300'} text-lg`} />
              <motion.span 
                className="ml-3"
                variants={navItemVariants}
                animate={sidebarCollapsed ? 'closed' : 'open'}
                transition={{ duration: 0.2 }}
              >
                Users
              </motion.span>
            </button>
          </li>
          <li>
            <button
              onClick={() => setActiveTab('notifications')}
              className={`w-full flex items-center px-4 py-3 rounded-lg transition-all duration-200 ${activeTab === 'notifications' ? 'bg-white text-green-700 shadow-md font-medium' : 'text-white hover:bg-green-600'}`}
            >
              <div className="relative">
                <FaBell className={`${activeTab === 'notifications' ? 'text-green-600' : 'text-green-300'} text-lg`} />
                {unreadNotifications > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                    {unreadNotifications}
                  </span>
                )}
              </div>
              <motion.span 
                className="ml-3"
                variants={navItemVariants}
                animate={sidebarCollapsed ? 'closed' : 'open'}
                transition={{ duration: 0.2 }}
              >
                Notifications
              </motion.span>
            </button>
          </li>
          <li>
            <button
              onClick={() => setActiveTab('payments')}
              className={`w-full flex items-center px-4 py-3 rounded-lg transition-all duration-200 ${activeTab === 'payments' ? 'bg-white text-green-700 shadow-md font-medium' : 'text-white hover:bg-green-600'}`}
            >
              <FaCreditCard className={`${activeTab === 'payments' ? 'text-green-600' : 'text-green-300'} text-lg`} />
              <motion.span 
                className="ml-3"
                variants={navItemVariants}
                animate={sidebarCollapsed ? 'closed' : 'open'}
                transition={{ duration: 0.2 }}
              >
                Payments
              </motion.span>
            </button>
          </li>
          <li>
            <button
              onClick={() => setActiveTab('zoom')}
              className={`w-full flex items-center px-4 py-3 rounded-lg transition-all duration-200 ${activeTab === 'zoom' ? 'bg-white text-green-700 shadow-md font-medium' : 'text-white hover:bg-green-600'}`}
            >
              <FaVideo className={`${activeTab === 'zoom' ? 'text-green-600' : 'text-green-300'} text-lg`} />
              <motion.span 
                className="ml-3"
                variants={navItemVariants}
                animate={sidebarCollapsed ? 'closed' : 'open'}
                transition={{ duration: 0.2 }}
              >
                Zoom Credits
              </motion.span>
            </button>
          </li>
          <li>
            <button
              onClick={() => setActiveTab('classes')}
              className={`w-full flex items-center px-4 py-3 rounded-lg transition-all duration-200 ${activeTab === 'classes' ? 'bg-white text-green-700 shadow-md font-medium' : 'text-white hover:bg-green-600'}`}
            >
              <FaCalendarAlt className={`${activeTab === 'classes' ? 'text-green-600' : 'text-green-300'} text-lg`} />
              <motion.span 
                className="ml-3"
                variants={navItemVariants}
                animate={sidebarCollapsed ? 'closed' : 'open'}
                transition={{ duration: 0.2 }}
              >
                Classes
              </motion.span>
            </button>
          </li>
          <li>
            <button
              onClick={() => setActiveTab('resources')}
              className={`w-full flex items-center px-4 py-3 rounded-lg transition-all duration-200 ${activeTab === 'resources' ? 'bg-white text-green-700 shadow-md font-medium' : 'text-white hover:bg-green-600'}`}
            >
              <FaBook className={`${activeTab === 'resources' ? 'text-green-600' : 'text-green-300'} text-lg`} />
              <motion.span 
                className="ml-3"
                variants={navItemVariants}
                animate={sidebarCollapsed ? 'closed' : 'open'}
                transition={{ duration: 0.2 }}
              >
                Resources
              </motion.span>
            </button>
          </li>
        </ul>

        <div className="px-3 mt-8">
          <div className="border-t border-green-600 pt-4">
            <button
              className="w-full flex items-center px-4 py-3 rounded-lg text-white hover:bg-green-600 transition-all duration-200"
            >
              <FaSignOutAlt className="text-green-300 text-lg" />
              <motion.span 
                className="ml-3"
                variants={navItemVariants}
                animate={sidebarCollapsed ? 'closed' : 'open'}
                transition={{ duration: 0.2 }}
              >
                Logout
              </motion.span>
            </button>
            <button
              className="w-full flex items-center px-4 py-3 rounded-lg text-white hover:bg-green-600 transition-all duration-200"
            >
              <FaCog className="text-green-300 text-lg" />
              <motion.span 
                className="ml-3"
                variants={navItemVariants}
                animate={sidebarCollapsed ? 'closed' : 'open'}
                transition={{ duration: 0.2 }}
              >
                Settings
              </motion.span>
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Sidebar;