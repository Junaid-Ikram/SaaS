import React from 'react';
import { FaChevronRight, FaChevronLeft, FaBars } from 'react-icons/fa';

const MobileToggle = ({ isMobile, sidebarCollapsed, setSidebarCollapsed }) => {
  return (
    <button 
      onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
      className={`fixed top-4 left-4 z-30 p-2 rounded-full bg-white text-green-700 shadow-lg hover:shadow-xl transition-all duration-300 focus:outline-none transform hover:scale-105 ${isMobile ? 'block' : 'hidden'}`}
      aria-label="Toggle sidebar"
    >
      {sidebarCollapsed ? <FaBars className="text-green-700" /> : <FaChevronLeft className="text-green-700" />}
    </button>
  );
};

export default MobileToggle;