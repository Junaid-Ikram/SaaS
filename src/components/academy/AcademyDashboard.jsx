import React, { useState } from 'react';
import { motion } from 'framer-motion';

// Import custom hooks
import useWindowSize from './useWindowSize';
import useDummyData from './useDummyData';

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
  const [showClassModal, setShowClassModal] = useState(false);
  const [selectedClass, setSelectedClass] = useState(null);
  const [classFilter, setClassFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [teacherFilter, setTeacherFilter] = useState('all');
  const [studentFilter, setStudentFilter] = useState('all');
  const [resourceFilter, setResourceFilter] = useState('all');

  // Get window size using custom hook
  const { isMobile } = useWindowSize();

  // Get data using custom hook
  const {
    loading,
    academyData,
    zoomCredits,
    zoomCreditsHistory,
    classes,
    resources,
    notifications,
    unreadNotifications,
    pendingUsers,
    teachers,
    students,
    payments,
    subscriptionUsage,
    setNotifications,
    setUnreadNotifications,
    setPendingUsers,
    setTeachers,
    setStudents
  } = useDummyData();

  // Derived data
  const teacherCount = teachers.length;
  const studentCount = students.length;

  // Handle user action (approve/reject)
  const handleUserAction = (userId, action) => {
    // Find the user
    const user = pendingUsers.find(u => u.id === userId);
    if (!user) return;

    // Remove from pending users
    setPendingUsers(pendingUsers.filter(u => u.id !== userId));

    // If approved, add to appropriate list
    if (action === 'approve') {
      if (user.role === 'teacher') {
        setTeachers([...teachers, {
          id: user.id,
          fullName: user.name,
          email: user.email,
          status: 'active',
          createdAt: new Date().toISOString().split('T')[0],
          subjects: [],
          lastActive: new Date().toISOString().split('T')[0]
        }]);
      } else if (user.role === 'student') {
        setStudents([...students, {
          id: user.id,
          fullName: user.name,
          email: user.email,
          status: 'active',
          createdAt: new Date().toISOString().split('T')[0],
          grade: 'N/A',
          assignedTeacher: 'Unassigned',
          lastActive: new Date().toISOString().split('T')[0]
        }]);
      }
    }

    // Update notifications
    const notificationIndex = notifications.findIndex(n => 
      n.type === 'approval' && n.message.includes(user.name)
    );

    if (notificationIndex !== -1) {
      const updatedNotifications = [...notifications];
      updatedNotifications[notificationIndex].read = true;
      setNotifications(updatedNotifications);
      setUnreadNotifications(prev => prev - 1);
    }
  };

  // Handle class selection
  const handleClassSelect = (classItem) => {
    setSelectedClass(classItem);
    setShowClassModal(true);
  };

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
        
        {/* Tab content */}
        <TabContent 
          activeTab={activeTab}
          teacherCount={teacherCount}
          studentCount={studentCount}
          classes={classes}
          zoomCredits={zoomCredits}
          subscriptionUsage={subscriptionUsage}
          teachers={teachers}
          students={students}
          pendingUsers={pendingUsers}
          setPendingUsers={setPendingUsers}
          setTeachers={setTeachers}
          setStudents={setStudents}
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
      {showClassModal && selectedClass && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start">
                <h2 className="text-2xl font-bold text-gray-900">{selectedClass.title}</h2>
                <button 
                  onClick={() => setShowClassModal(false)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="mt-4 space-y-4">
                <p className="text-gray-600">{selectedClass.description}</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Teacher</h3>
                    <p className="mt-1 text-sm text-gray-900">{selectedClass.teacher}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Date & Time</h3>
                    <p className="mt-1 text-sm text-gray-900">
                      {new Date(selectedClass.date).toLocaleDateString()} at {new Date(selectedClass.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Duration</h3>
                    <p className="mt-1 text-sm text-gray-900">{selectedClass.duration} minutes</p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Students</h3>
                    <p className="mt-1 text-sm text-gray-900">{selectedClass.students_count}</p>
                  </div>
                  
                  {selectedClass.status === 'ended' && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Attendance</h3>
                      <p className="mt-1 text-sm text-gray-900">{selectedClass.attendance} / {selectedClass.students_count}</p>
                    </div>
                  )}
                </div>
                
                {selectedClass.status === 'upcoming' && (
                  <div className="mt-6">
                    <a 
                      href={selectedClass.zoomLink} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Join Zoom Meeting
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AcademyDashboard;