import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const DashboardPage = () => {
  const { user, userRole, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        // If no user is logged in, redirect to login page
        navigate('/login');
      } else if (userRole) {
        // Redirect based on user role
        console.log('Redirecting to role-specific dashboard for:', userRole);
        switch (userRole) {
          case 'super_admin':
            navigate('/super-admin/dashboard', { replace: true });
            break;
          case 'academy_owner':
            navigate('/academy/dashboard', { replace: true });
            break;
          case 'teacher':
            navigate('/teacher/dashboard', { replace: true });
            break;
          case 'student':
            navigate('/student/dashboard', { replace: true });
            break;
          default:
            // If user has a role but no specific dashboard, or a generic 'user' role
            console.log('User role not recognized or no specific dashboard:', userRole);
            // Show the generic dashboard below
            break;
        }
      } else {
        // If user is logged in but role is not yet determined or is 'user'
        console.log('User logged in, but role not yet determined or is generic user.');
        // The generic dashboard below will be shown
      }
    }
  }, [user, userRole, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-green-600"></div>
        <p className="ml-4 text-green-600">Loading user data...</p>
      </div>
    );
  }

  // If user is logged in but no specific role dashboard is found yet, or it's a generic user
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        </div>
      </header>
      <main>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="border-4 border-dashed border-gray-200 rounded-lg h-96 p-4">
              <h2 className="text-xl font-semibold mb-4">Welcome, {user?.email}</h2>
              <p className="text-gray-600">This is your dashboard where you can manage your account and access all features.</p>
              
              <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                <div className="bg-white overflow-hidden shadow rounded-lg">
                  <div className="px-4 py-5 sm:p-6">
                    <h3 className="text-lg font-medium text-gray-900">Account Information</h3>
                    <div className="mt-3 text-sm text-gray-500">
                      <p>Email: {user?.email}</p>
                      <p>User ID: {user?.id}</p>
                      <p>Last Sign In: {new Date(user?.last_sign_in_at).toLocaleString()}</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white overflow-hidden shadow rounded-lg">
                  <div className="px-4 py-5 sm:p-6">
                    <h3 className="text-lg font-medium text-gray-900">Usage Statistics</h3>
                    <div className="mt-3 text-sm text-gray-500">
                      <p>Current Plan: Free Tier</p>
                      <p>Storage Used: 0 MB</p>
                      <p>API Calls: 0</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white overflow-hidden shadow rounded-lg">
                  <div className="px-4 py-5 sm:p-6">
                    <h3 className="text-lg font-medium text-gray-900">Quick Actions</h3>
                    <div className="mt-3 grid grid-cols-2 gap-2">
                      <button className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-green-700 bg-green-100 hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                        New Project
                      </button>
                      <button className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-green-700 bg-green-100 hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                        Invite Team
                      </button>
                      <button className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-green-700 bg-green-100 hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                        Settings
                      </button>
                      <button className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-green-700 bg-green-100 hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                        Support
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;