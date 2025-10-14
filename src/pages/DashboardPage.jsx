import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const DashboardPage = () => {
  const { user, userRole, loading } = useAuth();
  const navigate = useNavigate();

  const formatRole = (roleValue) => {
    if (!roleValue) return '—';
    return roleValue.replace(/_/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase());
  };

  const formatStatus = (statusValue) => {
    if (!statusValue) return '—';
    const lower = statusValue.toLowerCase();
    return lower.charAt(0).toUpperCase() + lower.slice(1);
  };

  const formatDateTime = (value) => {
    if (!value) return '—';
    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? '—' : parsed.toLocaleString();
  };

  useEffect(() => {
    if (loading) return;

    if (!user) {
      navigate('/login');
      return;
    }

    if (!userRole) {
      return;
    }

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
        break;
    }
  }, [loading, navigate, user, userRole]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-green-600"></div>
        <p className="ml-4 text-green-600">Loading user data...</p>
      </div>
    );
  }

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
            <div className="border-4 border-dashed border-gray-200 rounded-lg p-6 space-y-6 bg-white">
              <div>
                <h2 className="text-xl font-semibold mb-2">Welcome back{user?.firstName ? `, ${user.firstName}` : ''}!</h2>
                <p className="text-gray-600">
                  Use this hub to review your account details and jump into the areas that matter most for your role.
                </p>
              </div>

              <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                <div className="bg-white border border-gray-100 overflow-hidden shadow rounded-lg">
                  <div className="px-4 py-5 sm:p-6">
                    <h3 className="text-lg font-medium text-gray-900">Account Information</h3>
                    <div className="mt-3 text-sm text-gray-600 space-y-1.5">
                      <p>Email: {user?.email ?? '—'}</p>
                      <p>Contact: {user?.phoneNumber ?? '—'}</p>
                      <p>Status: {formatStatus(user?.status)}</p>
                      <p>Joined: {formatDateTime(user?.createdAt)}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-gray-100 overflow-hidden shadow rounded-lg">
                  <div className="px-4 py-5 sm:p-6">
                    <h3 className="text-lg font-medium text-gray-900">Account Snapshot</h3>
                    <div className="mt-3 text-sm text-gray-600 space-y-1.5">
                      <p>Role: {formatRole(userRole ?? user?.role)}</p>
                      <p>Account Active: {user?.isActive ? 'Yes' : 'No'}</p>
                      <p>Last Updated: {formatDateTime(user?.updatedAt)}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-gray-100 overflow-hidden shadow rounded-lg">
                  <div className="px-4 py-5 sm:p-6">
                    <h3 className="text-lg font-medium text-gray-900">Quick Actions</h3>
                    <div className="mt-3 grid grid-cols-2 gap-2">
                      <button className="inline-flex items-center justify-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-green-700 bg-green-100 hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                        View Profile
                      </button>
                      <button className="inline-flex items-center justify-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-green-700 bg-green-100 hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                        Review Classes
                      </button>
                      <button className="inline-flex items-center justify-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-green-700 bg-green-100 hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                        Update Password
                      </button>
                      <button className="inline-flex items-center justify-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-green-700 bg-green-100 hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                        Support Center
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
