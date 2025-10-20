import React from 'react';
import { motion } from 'framer-motion';
import {
  FaBell,
  FaBook,
  FaCalendarAlt,
  FaChevronLeft,
  FaChevronRight,
  FaCreditCard,
  FaSignOutAlt,
  FaTachometerAlt,
  FaUserCheck,
  FaVideo,
} from 'react-icons/fa';
import { sidebarVariants, mobileSidebarVariants, navItemVariants } from './animationVariants';

const navItems = [
  { key: 'overview', label: 'Overview', icon: FaTachometerAlt },
  { key: 'users', label: 'Users', icon: FaUserCheck },
  { key: 'notifications', label: 'Notifications', icon: FaBell },
  { key: 'payments', label: 'Payments', icon: FaCreditCard },
  { key: 'zoom', label: 'Zoom Credits', icon: FaVideo },
  { key: 'classes', label: 'Classes', icon: FaCalendarAlt },
  { key: 'resources', label: 'Resources', icon: FaBook },
];

const Sidebar = ({
  academyData,
  activeTab,
  setActiveTab,
  sidebarCollapsed,
  setSidebarCollapsed,
  isMobile,
  unreadNotifications,
}) => {
  const isLabelCollapsed = !isMobile && sidebarCollapsed;
  const labelVariant = isLabelCollapsed ? 'closed' : 'open';
  const variants = isMobile ? mobileSidebarVariants : sidebarVariants;
  const activeStyles =
    'bg-emerald-500/15 text-white border border-emerald-400/30 shadow-inner shadow-emerald-500/10';
  const inactiveStyles =
    'text-slate-300 hover:bg-white/10 hover:text-white transition-colors duration-150';

  const resolveVariant = () => {
    if (isMobile) {
      return sidebarCollapsed ? 'closed' : 'open';
    }
    return sidebarCollapsed ? 'mini' : 'open';
  };

  const containerClass = (() => {
    if (isMobile) {
      return [
        'fixed left-4 top-[5rem] bottom-4 z-40 flex flex-col overflow-hidden rounded-[24px]',
        'border border-white/10 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 shadow-[0_22px_48px_rgba(15,23,42,0.32)]',
        'text-white transition-all duration-300 backdrop-blur-md',
      ].join(' ');
    }

    return [
      'fixed left-6 top-[6rem] bottom-6 z-30 flex flex-col overflow-hidden rounded-[28px]',
      'border border-white/5 bg-gradient-to-b from-slate-950/95 via-slate-900/95 to-slate-950/90 shadow-[0_25px_55px_rgba(15,23,42,0.45)]',
      'text-white transition-all duration-300 backdrop-blur-md',
    ].join(' ');
  })();

  return (
    <motion.aside className={containerClass} variants={variants} animate={resolveVariant()} initial={isMobile ? 'closed' : 'open'}>
      <div className="px-5 pt-5 pb-4">
        <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3 shadow-inner shadow-white/10">
          <div className="flex items-center gap-3 overflow-hidden">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500 text-lg font-bold text-white shadow-lg shadow-emerald-500/30">
              Q
            </span>
            <motion.div
              className="flex flex-col"
              variants={navItemVariants}
              animate={labelVariant}
              transition={{ duration: 0.2 }}
            >
              <span className="text-xs font-semibold uppercase tracking-wide text-slate-300/80">
                Academy
              </span>
              <span className="truncate text-sm font-semibold text-white">
                {academyData?.name ?? 'Academy'}
              </span>
            </motion.div>
          </div>
          <button
            type="button"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="rounded-full border border-white/10 bg-white/10 p-1.5 text-slate-200 transition hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-emerald-500/60"
            aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {sidebarCollapsed ? <FaChevronRight className="h-4 w-4" /> : <FaChevronLeft className="h-4 w-4" />}
          </button>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-4 pb-6">
        <ul className="space-y-2">
          {navItems.map((item) => {
            const ItemIcon = item.icon;
            const isActive = activeTab === item.key;
            return (
              <li key={item.key}>
                <button
                  type="button"
                  onClick={() => setActiveTab(item.key)}
                  className={`group flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold tracking-wide ${isActive ? activeStyles : inactiveStyles}`}
                >
                  <span
                    className={`flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 transition ${
                      isActive ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/20' : 'bg-white/5 text-slate-400 group-hover:text-white'
                    }`}
                  >
                    <ItemIcon className="h-4 w-4" />
                  </span>
                  <motion.span
                    className="truncate"
                    variants={navItemVariants}
                    animate={labelVariant}
                    transition={{ duration: 0.2 }}
                  >
                    {item.label}
                  </motion.span>
                  {item.key === 'notifications' && unreadNotifications > 0 ? (
                    <motion.span
                      variants={navItemVariants}
                      animate={labelVariant}
                      className="ml-auto inline-flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-red-500 px-1.5 text-xs font-semibold text-white"
                    >
                      {unreadNotifications}
                    </motion.span>
                  ) : null}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="border-t border-white/10 px-4 pb-6 pt-5">
        <button
          type="button"
          className="flex w-full items-center gap-3 rounded-2xl border border-white/10 px-4 py-2.5 text-sm font-semibold text-slate-200 transition hover:bg-white/10 hover:text-white"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/5 text-slate-400">
            <FaSignOutAlt className="h-4 w-4" />
          </span>
          <motion.span variants={navItemVariants} animate={labelVariant}>
            Logout
          </motion.span>
        </button>
      </div>
    </motion.aside>
  );
};

export default Sidebar;
