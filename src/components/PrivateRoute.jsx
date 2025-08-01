import React from 'react';
import { Navigate, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const PrivateRoute = ({ allowedRoles }) => {
  const { user, userRole, loading, isPending } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  console.log('PrivateRoute: loading:', loading, 'user:', user, 'userRole:', userRole, 'isPending:', isPending);

  if (loading) {
    console.log('PrivateRoute: Loading...');
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  // If user is not logged in, redirect to login
  if (!user) {
    console.log('PrivateRoute: User not logged in, redirecting to /login');
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If user is pending approval
  if (isPending) {
    console.log('PrivateRoute: User is pending approval, displaying pending page.');
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center">
        <div className="max-w-md">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Pending Approval</h1>
          <p className="text-gray-600 mb-6">
            Your account is pending approval from an academy administrator. 
            You'll receive an email notification once your account has been reviewed.
          </p>
          <button
            onClick={() => {
              if (userRole === 'super_admin') {
                navigate('/super-admin/dashboard');
              } else if (userRole === 'academy_owner') {
                navigate('/academy/dashboard');
              } else if (userRole === 'teacher') {
                navigate('/teacher/dashboard');
              } else if (userRole === 'student') {
                navigate('/student/dashboard');
              } else {
                navigate('/dashboard'); // Fallback for other roles or general dashboard
              }
            }}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
          >
            Check Status
          </button>
        </div>
      </div>
    );
  }

  // If allowedRoles is specified, check if user has the required role
  if (allowedRoles && !allowedRoles.includes(userRole)) {
    console.log('PrivateRoute: User role', userRole, 'not in allowed roles', allowedRoles);
    // Redirect to the appropriate dashboard based on user role
    if (userRole === 'super_admin') {
      console.log('PrivateRoute: Redirecting to /super-admin/dashboard');
      return <Navigate to="/super-admin/dashboard" replace />;
    } else if (userRole === 'academy_owner') {
      console.log('PrivateRoute: Redirecting to /academy/dashboard');
      return <Navigate to="/academy/dashboard" replace />;
    } else if (userRole === 'teacher') {
      console.log('PrivateRoute: Redirecting to /teacher/dashboard');
      return <Navigate to="/teacher/dashboard" replace />;
    } else if (userRole === 'student') {
      console.log('PrivateRoute: Redirecting to /student/dashboard');
      return <Navigate to="/student/dashboard" replace />;
    }
  }

  console.log('PrivateRoute: User is authorized, rendering Outlet.');

  return <Outlet />;
};

export default PrivateRoute;