import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaBell, FaSignOutAlt, FaUserCircle } from 'react-icons/fa';
import { useAuth } from '../../contexts/AuthContext';

const ROUTE_LABELS = {
  '/dashboard': 'Overview',
  '/academy/dashboard': 'Academy Dashboard',
  '/academy/subscription': 'Subscription & Billing',
  '/teacher/dashboard': 'Teacher Dashboard',
  '/student/dashboard': 'Student Dashboard',
  '/super-admin/dashboard': 'Super Admin Control',
  '/super-admin/academies': 'Academy Directory',
  '/super-admin/users': 'User Directory',
  '/super-admin/platform-settings': 'Platform Settings',
  '/super-admin/reports': 'Reports & Analytics',
};

const roleLabelMap = {
  super_admin: 'Super Admin',
  academy_owner: 'Academy Owner',
  teacher: 'Teacher',
  student: 'Student',
};

const DashboardNavbar = () => {
  const { user, userRole, userDetails, signOut } = useAuth();
  const location = useLocation();

  const currentLabel =
    ROUTE_LABELS[location.pathname] ??
    ROUTE_LABELS[Object.keys(ROUTE_LABELS).find((path) => location.pathname.startsWith(path)) ?? ''] ??
    'Dashboard';

  const roleLabel = userRole ? roleLabelMap[userRole] ?? userRole : '';

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

  const displayName =
    userDetails?.name ??
    userDetails?.full_name ??
    (user?.firstName ? `${user.firstName} ${user.lastName ?? ''}`.trim() : user?.email?.split('@')[0] ?? 'User');

  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4">
          <Link
            to={getDashboardLink()}
            className="group flex items-center gap-3 rounded-xl border border-emerald-100 bg-white px-3 py-2 shadow-sm shadow-emerald-100 transition hover:border-emerald-200 hover:shadow"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500 text-sm font-semibold text-white shadow shadow-emerald-500/40">
              Q
            </span>
            <div className="hidden leading-tight sm:flex sm:flex-col">
              <span className="text-sm font-semibold text-slate-800 group-hover:text-emerald-600">Q Edu</span>
              <span className="text-[11px] uppercase tracking-[0.16em] text-slate-400">Console</span>
            </div>
          </Link>
          <div className="hidden flex-col md:flex">
            <span className="text-xs uppercase tracking-widest text-slate-400">Current View</span>
            <span className="text-sm font-semibold text-slate-700">{currentLabel}</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 transition hover:border-emerald-300 hover:text-emerald-600"
            aria-label="Notifications"
          >
            <FaBell className="h-4 w-4" />
          </button>
          <div className="hidden flex-col items-end sm:flex">
            <span className="text-sm font-semibold text-slate-700">{displayName}</span>
            {roleLabel ? (
              <span className="text-xs font-medium text-emerald-600">{roleLabel}</span>
            ) : null}
          </div>
          <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-2 py-1.5 shadow-sm">
            <FaUserCircle className="h-6 w-6 text-emerald-500" />
            <button
              type="button"
              onClick={signOut}
              className="flex items-center gap-2 rounded-full bg-emerald-500 px-3 py-1 text-xs font-semibold text-white transition hover:bg-emerald-600"
            >
              <FaSignOutAlt className="h-3 w-3" />
              <span>Sign out</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default DashboardNavbar;
