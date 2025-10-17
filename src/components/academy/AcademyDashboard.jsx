import React, { useState } from 'react';
import { motion } from 'framer-motion';

// Import custom hooks
import useWindowSize from './useWindowSize';
import useAcademyData from './useAcademyData';

// Import components
import Sidebar from './Sidebar';
import MobileToggle from './MobileToggle';
import DashboardHeader from './DashboardHeader';
import TabContent from './TabContent';

// Import animation variants
import { contentVariants, sidebarVariants, mobileSidebarVariants, navItemVariants } from './animationVariants';

const AcademyDashboard = () => {
  // State for UI
  const [activeTab, setActiveTab] = useState('overview');
  const [activeSubTab, setActiveSubTab] = useState('upcoming');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Get window size using custom hook
  const {
    loading,
    error,
    refresh,
    academyData,
    zoomCredits,
    classes,
    classesMeta,
    classesSummary,
    classesFilters,
    classesLoading,
    loadClasses,
    resources,
    notifications,
    unreadNotifications,
    pendingUsers,
    teachers,
    students,
    teachersSummary,
    studentsSummary,
    payments,
    subscriptionUsage,
    approvePendingUser,
    rejectPendingUser,
    purchaseCredits,
    setNotifications,
    setUnreadNotifications,
  } = useAcademyData();

  // Derived data
  const teacherCount = teachersSummary?.approved ?? teachers.length;
  const studentCount = studentsSummary?.approved ?? students.length;

  // Determine content variant based on sidebar state and mobile view
  const getContentVariant = () => {
    if (isMobile) {
      return 'full';
    }
    return sidebarCollapsed ? 'mini' : 'open';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-lg text-gray-600">Loading academy dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex relative">
      {/* Mobile sidebar toggle */}
      <MobileToggle 
        isMobile={isMobile} 
        sidebarCollapsed={sidebarCollapsed} 
        setSidebarCollapsed={setSidebarCollapsed} 
      />
      
      {/* Sidebar */}
      <Sidebar 
        academyData={academyData}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        sidebarCollapsed={sidebarCollapsed}
        setSidebarCollapsed={setSidebarCollapsed}
        isMobile={isMobile}
        unreadNotifications={unreadNotifications}
      />
      
      {/* Main content */}
      <motion.main 
        className="flex-1 p-6 transition-all duration-300 overflow-hidden"
        variants={contentVariants}
        animate={getContentVariant()}
        initial={isMobile ? 'full' : 'open'}
      >
        {/* Dashboard header */}
        <DashboardHeader academyData={academyData} />
        {error && (
          <div className="mb-6 rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <span>{error}</span>
              <button
                type="button"
                className="inline-flex items-center gap-1 text-red-700 underline underline-offset-2 hover:text-red-800"
                onClick={refresh}
              >
                Retry
              </button>
            </div>
          </div>
        )}
        
        
        {/* Tab content */}
        <TabContent 
          activeTab={activeTab}
          teacherCount={teacherCount}
          studentCount={studentCount}
          classes={classes}
          classesMeta={classesMeta}
          classesSummary={classesSummary}
          classesFilters={classesFilters}
          classesLoading={classesLoading}
          onLoadClasses={loadClasses}
          zoomCredits={zoomCredits}
          subscriptionUsage={subscriptionUsage}
          teachers={teachers}
          students={students}
          teachersSummary={teachersSummary}
          studentsSummary={studentsSummary}
          pendingUsers={pendingUsers}
          onApproveUser={approvePendingUser}
          onRejectUser={rejectPendingUser}
          onPurchaseCredits={purchaseCredits}
          notifications={notifications}
          setNotifications={setNotifications}
          setUnreadNotifications={setUnreadNotifications}
          payments={payments}
          resources={resources}
          activeSubTab={activeSubTab}
          setActiveSubTab={setActiveSubTab}
        />
      </motion.main>

      {/* Class details modal */}
    </div>
  );
};

export default AcademyDashboard;










