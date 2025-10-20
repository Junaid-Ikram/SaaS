import React from 'react';
import { motion } from 'framer-motion';
import {
  FaArrowRight,
  FaCalendarAlt,
  FaChalkboardTeacher,
  FaUserGraduate,
  FaVideo,
} from 'react-icons/fa';

const calcPercent = (count, limit) => {
  if (!limit || limit <= 0) {
    return 0;
  }
  return Math.min(100, Math.round((count / limit) * 100));
};

const formatTimestamp = (value) => {
  if (!value) {
    return 'Just now';
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return 'Just now';
  }
  return date.toLocaleString();
};

const formatLimitLabel = (count, limit) => {
  if (!limit || limit <= 0) {
    return `${count} / Unlimited`;
  }
  return `${count} / ${limit}`;
};

const OverviewTab = ({
  teacherCount,
  studentCount,
  classes = [],
  zoomCredits,
  subscriptionUsage,
  onNavigate,
  onShowPurchaseCredits,
}) => {
  const safeClasses = Array.isArray(classes) ? classes : [];
  const upcomingClasses = safeClasses
    .filter((cls) => (cls.status ?? '').toLowerCase() === 'upcoming')
    .slice(0, 3);

  const availableCredits = zoomCredits?.available ?? 0;
  const usedCredits = zoomCredits?.used ?? 0;
  const totalCredits = zoomCredits?.totalCredited ?? availableCredits + usedCredits;

  const studentLimit = subscriptionUsage?.studentLimit ?? 0;
  const teacherLimit = subscriptionUsage?.teacherLimit ?? 0;
  const storageLimit = subscriptionUsage?.storageLimit ?? 0;
  const storageUsed = subscriptionUsage?.storageUsed ?? 0;

  const studentPercent = calcPercent(studentCount, studentLimit || Math.max(studentCount, 1));
  const teacherPercent = calcPercent(teacherCount, teacherLimit || Math.max(teacherCount, 1));
  const storagePercent = calcPercent(storageUsed, storageLimit || Math.max(storageUsed, 1));

  const recentActivity = Array.isArray(subscriptionUsage?.recentActivity)
    ? subscriptionUsage.recentActivity.slice(0, 6)
    : [];

  const statCards = [
    {
      key: 'teachers',
      title: 'Teachers',
      value: teacherCount,
      icon: FaChalkboardTeacher,
      accent: 'bg-blue-500',
      description: 'Approved educators in your academy',
      actionLabel: 'View teachers',
      onClick: () => onNavigate?.('users', { subTab: 'teachers' }),
    },
    {
      key: 'students',
      title: 'Students',
      value: studentCount,
      icon: FaUserGraduate,
      accent: 'bg-emerald-500',
      description: 'Active learners enrolled today',
      actionLabel: 'View students',
      onClick: () => onNavigate?.('users', { subTab: 'students' }),
    },
    {
      key: 'classes',
      title: 'Upcoming Classes',
      value: upcomingClasses.length,
      icon: FaCalendarAlt,
      accent: 'bg-indigo-500',
      description: 'Scheduled sessions in the next few days',
      actionLabel: 'View schedule',
      onClick: () => onNavigate?.('classes', { subTab: 'upcoming' }),
    },
    {
      key: 'credits',
      title: 'Zoom Credits',
      value: availableCredits,
      icon: FaVideo,
      accent: 'bg-yellow-500',
      description: `${usedCredits} used of ${totalCredits} total`,
      actionLabel: 'Manage credits',
      onClick: () =>
        onShowPurchaseCredits ? onShowPurchaseCredits() : onNavigate?.('zoom'),
    },
  ];

  const ProgressBar = ({ label, count, limit, percent, accentClass }) => (
    <div>
      <div className="flex items-center justify-between text-sm font-medium text-gray-700">
        <span>{label}</span>
        <span className="text-gray-500">{formatLimitLabel(count, limit)}</span>
      </div>
      <div className="mt-2 h-2.5 w-full overflow-hidden rounded-full bg-gray-200">
        <div className={`${accentClass} h-2.5`} style={{ width: `${percent}%` }}></div>
      </div>
    </div>
  );

  return (
    <motion.div
      key="overview"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.35 }}
      className="space-y-8"
    >
      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
        {statCards.map((card) => (
          <div
            key={card.key}
            className="flex h-full flex-col rounded-xl border border-gray-200 bg-white shadow-sm transition-shadow duration-200 hover:shadow-md"
          >
            <div className="flex items-start justify-between gap-4 p-6">
              <div>
                <p className="text-sm font-semibold uppercase tracking-wide text-gray-500">
                  {card.title}
                </p>
                <p className="mt-2 text-3xl font-bold text-gray-900">{card.value}</p>
                <p className="mt-2 text-sm text-gray-500">{card.description}</p>
              </div>
              <div className={`rounded-lg p-3 text-white ${card.accent}`}>
                <card.icon className="h-6 w-6" />
              </div>
            </div>
            <div className="mt-auto border-t border-gray-100">
              <button
                type="button"
                onClick={card.onClick}
                className="flex w-full items-center justify-between px-6 py-3 text-sm font-medium text-emerald-600 transition-colors hover:text-emerald-700 focus:outline-none"
              >
                <span>{card.actionLabel}</span>
                <FaArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        <div className="space-y-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm lg:col-span-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Subscription Usage</h3>
              <p className="text-sm text-gray-500">
                Monitor how your academy is trending against plan limits.
              </p>
            </div>
          </div>

          <div className="space-y-5">
            <ProgressBar
              label="Students"
              count={studentCount}
              limit={studentLimit}
              percent={studentPercent}
              accentClass="bg-blue-500"
            />
            <ProgressBar
              label="Teachers"
              count={teacherCount}
              limit={teacherLimit}
              percent={teacherPercent}
              accentClass="bg-emerald-500"
            />
            <ProgressBar
              label="Storage (GB)"
              count={storageUsed}
              limit={storageLimit}
              percent={storagePercent}
              accentClass="bg-indigo-500"
            />
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm lg:col-span-2">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Upcoming Classes</h3>
              <p className="text-sm text-gray-500">Next sessions on your calendar.</p>
            </div>
            <button
              type="button"
              onClick={() => onNavigate?.('classes', { subTab: 'upcoming' })}
              className="text-sm font-medium text-emerald-600 hover:text-emerald-700"
            >
              View all
            </button>
          </div>

          {upcomingClasses.length === 0 ? (
            <p className="mt-6 rounded-lg border border-dashed border-gray-200 p-4 text-sm text-gray-500">
              No upcoming classes scheduled. Plan your next session to keep momentum.
            </p>
          ) : (
            <ul className="mt-4 space-y-4">
              {upcomingClasses.map((cls) => (
                <li
                  key={cls.id}
                  className="rounded-lg border border-gray-100 bg-gray-50 p-4 text-sm text-gray-700"
                >
                  <p className="font-medium text-gray-900">{cls.title}</p>
                  <p className="mt-1 text-gray-600">{cls.schedule}</p>
                  {cls.teacher && (
                    <p className="mt-1 text-gray-500">
                      Instructor: <span className="font-medium">{cls.teacher}</span>
                    </p>
                  )}
                  {cls.zoomLink && (
                    <a
                      href={cls.zoomLink}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-2 inline-block text-sm font-medium text-emerald-600 hover:text-emerald-700"
                    >
                      Join link
                    </a>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
            <p className="text-sm text-gray-500">
              Latest approvals, class updates, and credit transactions.
            </p>
          </div>
          <button
            type="button"
            onClick={() => onNavigate?.('notifications')}
            className="inline-flex items-center gap-2 rounded-md border border-gray-200 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            View timeline
            <FaArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>

        {recentActivity.length === 0 ? (
          <p className="mt-6 rounded-lg border border-dashed border-gray-200 p-4 text-sm text-gray-500">
            No activity logged yet. Approvals, class creation, and credit transactions will appear
            here.
          </p>
        ) : (
          <ul className="mt-6 space-y-4">
            {recentActivity.map((activity) => (
              <li key={activity.id} className="flex gap-4">
                <div className="mt-1.5 h-2 w-2 flex-shrink-0 rounded-full bg-emerald-500"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{activity.message}</p>
                  <p className="mt-1 text-xs text-gray-500">{formatTimestamp(activity.timestamp)}</p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </motion.div>
  );
};

export default OverviewTab;
