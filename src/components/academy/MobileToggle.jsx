import React from 'react';
import { FaChevronRight, FaChevronLeft, FaBars } from 'react-icons/fa';

const MobileToggle = ({ isMobile, sidebarCollapsed, setSidebarCollapsed }) => {
  return (
    <button
      onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
      className={`fixed top-24 left-4 z-40 rounded-full border border-slate-700 bg-slate-900 p-2 text-white shadow-lg transition duration-200 hover:scale-105 hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 ${isMobile ? 'block' : 'hidden'}`}
      aria-label="Toggle sidebar"
    >
      {sidebarCollapsed ? <FaBars className="h-4 w-4" /> : <FaChevronLeft className="h-4 w-4" />}
    </button>
  );
};

export default MobileToggle;
