import React from 'react';
import { AnimatePresence } from 'framer-motion';

// Import tab components
import OverviewTab from './OverviewTab';
import UsersTab from './UsersTab';
import NotificationsTab from './NotificationsTab';
import PaymentsTab from './PaymentsTab';
import ZoomCreditsTab from './ZoomCreditsTab';
import ClassesTab from './ClassesTab';
import ResourcesTab from './ResourcesTab';

const TabContent = ({
  activeTab,
  teacherCount,
  studentCount,
  classes,
  zoomCredits,
  subscriptionUsage,
  teachers,
  students,
  pendingUsers,
  setPendingUsers,
  setTeachers,
  setStudents,
  notifications,
  setNotifications,
  setUnreadNotifications,
  payments,
  resources,
  activeSubTab,
  setActiveSubTab
}) => {
  // Use a function to render the active tab based on the activeTab state
  const renderActiveTab = () => {
    switch(activeTab) {
      case 'overview':
        return (
          <OverviewTab 
            key="overview"
            teacherCount={teacherCount}
            studentCount={studentCount}
            classes={classes}
            zoomCredits={zoomCredits}
            subscriptionUsage={subscriptionUsage}
          />
        );
      case 'users':
        return (
          <UsersTab 
            key="users"
            teachers={teachers}
            students={students}
            pendingUsers={pendingUsers}
            setPendingUsers={setPendingUsers}
            setTeachers={setTeachers}
            setStudents={setStudents}
          />
        );
      case 'notifications':
        return (
          <NotificationsTab 
            key="notifications"
            notifications={notifications}
            setNotifications={setNotifications}
            setUnreadNotifications={setUnreadNotifications}
          />
        );
      case 'payments':
        return (
          <PaymentsTab 
            key="payments"
            payments={payments} 
          />
        );
      case 'zoom':
        return (
          <ZoomCreditsTab 
            key="zoom"
            zoomCredits={zoomCredits} 
          />
        );
      case 'classes':
        return (
          <ClassesTab 
            key="classes"
            classes={classes} 
            activeSubTab={activeSubTab} 
            setActiveSubTab={setActiveSubTab} 
          />
        );
      case 'resources':
        return (
          <ResourcesTab 
            key="resources"
            resources={resources} 
            classes={classes} 
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="p-6">
        <AnimatePresence mode="wait">
          {renderActiveTab()}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default TabContent;