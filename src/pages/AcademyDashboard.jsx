import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import SubscriptionEnforcement from '../components/SubscriptionEnforcement';
import AcademyDashboardComponent from '../components/academy/AcademyDashboard';

const AcademyDashboard = () => {
  const { user, userDetails } = useAuth();
  
  // Check if user has required subscription
  if (!user) {
    return <div>Loading...</div>;
  }
  
  return (
    <SubscriptionEnforcement requiredPlan="basic">
      <AcademyDashboardComponent />
    </SubscriptionEnforcement>
  );
};

export default AcademyDashboard;