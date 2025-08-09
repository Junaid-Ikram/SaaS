import React, { Suspense, lazy, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import RoleBasedRoute from './components/RoleBasedRoute';
import SubscriptionEnforcement from './components/SubscriptionEnforcement';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { setupDatabase } from './utils/setupDatabase';

// Lazy load pages for better performance
const HomePage = lazy(() => import('./pages/HomePage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const RegisterPage = lazy(() => import('./pages/RegisterPage'));
const FeaturesPage = lazy(() => import('./pages/FeaturesPage'));
const PricingPage = lazy(() => import('./pages/PricingPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const TermsOfServicePage = lazy(() => import('./pages/TermsOfServicePage'));
const PrivacyPolicyPage = lazy(() => import('./pages/PrivacyPolicyPage'));
const CookiePolicyPage = lazy(() => import('./pages/CookiePolicyPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const AcademySubscription = lazy(() => import('./pages/AcademySubscription'));

// Role-specific dashboards - these will be created later
const SuperAdminDashboard = lazy(() => import('./pages/SuperAdminDashboard').catch(() => ({ default: () => <div className="p-8">Super Admin Dashboard - Coming Soon</div> })));
const AcademyDashboard = lazy(() => import('./pages/AcademyDashboard').catch(() => ({ default: () => <div className="p-8">Academy Dashboard - Coming Soon</div> })));
const TeacherDashboard = lazy(() => import('./pages/TeacherDashboard').catch(() => ({ default: () => <div className="p-8">Teacher Dashboard - Coming Soon</div> })));
const StudentDashboard = lazy(() => import('./pages/StudentDashboard').catch(() => ({ default: () => <div className="p-8">Student Dashboard - Coming Soon</div> })));

// Public pages - these will be created later
const PendingApprovalPage = lazy(() => import('./pages/PendingApprovalPage').catch(() => ({ default: () => <div className="p-8">Your account is pending approval</div> })));

// Loading spinner component
const LoadingSpinner = () => (
  <div className="flex justify-center items-center h-screen">
    <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-green-600"></div>
  </div>
);

// AppContent component to use hooks inside Router
const AppContent = () => {
  const { user, userRole, loading, dbInitialized, setDatabaseInitialized } = useAuth();
  const navigate = useNavigate();
  
  // Function to get dashboard link based on user role
  const getDashboardLink = () => {
    if (!userRole) return '/dashboard';
    
    switch (userRole) {
      case 'super_admin':
        return '/super-admin/dashboard';
      case 'academy_owner':
        return '/academy/dashboard';
      case 'teacher':
        return '/teacher/dashboard';
      case 'student':
        return '/student/dashboard';
      default:
        return '/dashboard';
    }
  };
  
  useEffect(() => {
    // Initialize database tables if needed
    const initDb = async () => {
      try {
        await setupDatabase(setDatabaseInitialized);
        console.log('Database initialization check completed');
      } catch (error) {
        console.error('Error initializing database:', error);
      }
    };
    
    if (!dbInitialized) {
      initDb();
    }
  }, [dbInitialized]);
  
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <Suspense fallback={<LoadingSpinner />}>
        <div className="flex-grow pt-16"> {/* Add padding top to account for fixed navbar */}
          <Routes>
            {/* Public Routes - Redirect if authenticated */}
            <Route path="/" element={user && !loading ? <Navigate to={userRole === 'super_admin' ? '/super-admin/dashboard' : userRole === 'academy_owner' ? '/academy/dashboard' : userRole === 'teacher' ? '/teacher/dashboard' : userRole === 'student' ? '/student/dashboard' : '/dashboard'} replace /> : <HomePage />} />
            <Route path="/features" element={user && !loading ? <Navigate to={userRole === 'super_admin' ? '/super-admin/dashboard' : userRole === 'academy_owner' ? '/academy/dashboard' : userRole === 'teacher' ? '/teacher/dashboard' : userRole === 'student' ? '/student/dashboard' : '/dashboard'} replace /> : <FeaturesPage />} />
            <Route path="/pricing" element={user && !loading ? <Navigate to={userRole === 'super_admin' ? '/super-admin/dashboard' : userRole === 'academy_owner' ? '/academy/dashboard' : userRole === 'teacher' ? '/teacher/dashboard' : userRole === 'student' ? '/student/dashboard' : '/dashboard'} replace /> : <PricingPage />} />
            <Route path="/contact" element={user && !loading ? <Navigate to={userRole === 'super_admin' ? '/super-admin/dashboard' : userRole === 'academy_owner' ? '/academy/dashboard' : userRole === 'teacher' ? '/teacher/dashboard' : userRole === 'student' ? '/student/dashboard' : '/dashboard'} replace /> : <ContactPage />} />
            <Route path="/terms" element={user && !loading ? <Navigate to={userRole === 'super_admin' ? '/super-admin/dashboard' : userRole === 'academy_owner' ? '/academy/dashboard' : userRole === 'teacher' ? '/teacher/dashboard' : userRole === 'student' ? '/student/dashboard' : '/dashboard'} replace /> : <TermsOfServicePage />} />
            <Route path="/privacy" element={user && !loading ? <Navigate to={userRole === 'super_admin' ? '/super-admin/dashboard' : userRole === 'academy_owner' ? '/academy/dashboard' : userRole === 'teacher' ? '/teacher/dashboard' : userRole === 'student' ? '/student/dashboard' : '/dashboard'} replace /> : <PrivacyPolicyPage />} />
            <Route path="/cookies" element={user && !loading ? <Navigate to={userRole === 'super_admin' ? '/super-admin/dashboard' : userRole === 'academy_owner' ? '/academy/dashboard' : userRole === 'teacher' ? '/teacher/dashboard' : userRole === 'student' ? '/student/dashboard' : '/dashboard'} replace /> : <CookiePolicyPage />} />
            <Route path="/login" element={user && !loading ? <Navigate to={userRole === 'super_admin' ? '/super-admin/dashboard' : userRole === 'academy_owner' ? '/academy/dashboard' : userRole === 'teacher' ? '/teacher/dashboard' : userRole === 'student' ? '/student/dashboard' : '/dashboard'} replace /> : <LoginPage />} />
            <Route path="/register" element={user && !loading ? <Navigate to={userRole === 'super_admin' ? '/super-admin/dashboard' : userRole === 'academy_owner' ? '/academy/dashboard' : userRole === 'teacher' ? '/teacher/dashboard' : userRole === 'student' ? '/student/dashboard' : '/dashboard'} replace /> : <RegisterPage />} />
            <Route path="/pending-approval" element={
              <PrivateRoute>
                <PendingApprovalPage />
              </PrivateRoute>
            } />
            
            {/* Legacy Dashboard - will redirect to role-specific dashboard */}
            <Route path="/dashboard" element={<PrivateRoute />}>
              <Route index element={<DashboardPage />} />
            </Route>
            
            {/* Role-Based Routes */}
            <Route path="/super-admin/dashboard" element={
              <RoleBasedRoute requiredRole="super_admin">
                <SuperAdminDashboard />
              </RoleBasedRoute>
            } />
            
            <Route path="/academy/dashboard" element={
              <RoleBasedRoute requiredRole="academy_owner">
                <SubscriptionEnforcement>
                  <AcademyDashboard />
                </SubscriptionEnforcement>
              </RoleBasedRoute>
            } />
            
            <Route path="/academy/subscription" element={
              <RoleBasedRoute requiredRole="academy_owner">
                <AcademySubscription />
              </RoleBasedRoute>
            } />
            
            <Route path="/teacher/dashboard" element={
              <RoleBasedRoute requiredRole="teacher">
                <TeacherDashboard />
              </RoleBasedRoute>
            } />
            
            <Route path="/student/dashboard" element={
              <RoleBasedRoute requiredRole="student">
                <StudentDashboard />
              </RoleBasedRoute>
            } />
            
            {/* Catch all route - 404 page */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </div>
      </Suspense>
      <Footer />
    </div>
  );
};

function App() {
  return (
    <Router
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;
