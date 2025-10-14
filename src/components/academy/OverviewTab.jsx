import React from 'react';
import { motion } from 'framer-motion';
import { FaChalkboardTeacher, FaUserGraduate, FaCalendarAlt, FaVideo } from 'react-icons/fa';

const calcPercent = (count, limit) => {
  if (!limit || limit <= 0) {
    return 0;
  }
  return Math.min(100, Math.round((count / limit) * 100));
};

const OverviewTab = ({ teacherCount, studentCount, classes, zoomCredits, subscriptionUsage }) => {
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        delay: 0.1,
      },
    },
  };

  const upcomingClassesCount = classes.filter((cls) => cls.status === 'upcoming').length;
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

  const recentActivity = subscriptionUsage?.recentActivity ?? [];

  return (
    <motion.div
      key="overview"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div variants={cardVariants} initial="hidden" animate="visible" className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-blue-500 rounded-md p-3">
                <FaChalkboardTeacher className="h-6 w-6 text-white" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Teachers</dt>
                  <dd>
                    <div className="text-lg font-medium text-gray-900">{teacherCount}</div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3">
            <div className="text-sm">
              <span className="font-medium text-blue-700">View all</span>
            </div>
          </div>
        </motion.div>

        <motion.div variants={cardVariants} initial="hidden" animate="visible" className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-green-500 rounded-md p-3">
                <FaUserGraduate className="h-6 w-6 text-white" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Students</dt>
                  <dd>
                    <div className="text-lg font-medium text-gray-900">{studentCount}</div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3">
            <div className="text-sm">
              <span className="font-medium text-blue-700">View all</span>
            </div>
          </div>
        </motion.div>

        <motion.div variants={cardVariants} initial="hidden" animate="visible" className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-indigo-500 rounded-md p-3">
                <FaCalendarAlt className="h-6 w-6 text-white" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Upcoming Classes</dt>
                  <dd>
                    <div className="text-lg font-medium text-gray-900">{upcomingClassesCount}</div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3">
            <div className="text-sm">
              <span className="font-medium text-blue-700">View schedule</span>
            </div>
          </div>
        </motion.div>

        <motion.div variants={cardVariants} initial="hidden" animate="visible" className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-yellow-500 rounded-md p-3">
                <FaVideo className="h-6 w-6 text-white" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Zoom Credits</dt>
                  <dd>
                    <div className="text-lg font-medium text-gray-900">{availableCredits}</div>
                    <p className="text-xs text-gray-500">{usedCredits} used · {totalCredits} total</p>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3">
            <div className="text-sm">
              <span className="font-medium text-blue-700">Purchase more</span>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="mt-6 bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Subscription Usage</h3>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm font-medium">
              <span>Students ({studentCount}/{studentLimit || '∞'})</span>
              <span>{studentPercent}%</span>
            </div>
            <div className="mt-2 w-full bg-gray-200 rounded-full h-2.5">
              <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${studentPercent}%` }}></div>
            </div>
          </div>
          <div>
            <div className="flex justify-between text-sm font-medium">
              <span>Teachers ({teacherCount}/{teacherLimit || '∞'})</span>
              <span>{teacherPercent}%</span>
            </div>
            <div className="mt-2 w-full bg-gray-200 rounded-full h-2.5">
              <div className="bg-green-600 h-2.5 rounded-full" style={{ width: `${teacherPercent}%` }}></div>
            </div>
          </div>
          <div>
            <div className="flex justify-between text-sm font-medium">
              <span>Storage ({storageUsed}/{storageLimit || '∞'} GB)</span>
              <span>{storagePercent}%</span>
            </div>
            <div className="mt-2 w-full bg-gray-200 rounded-full h-2.5">
              <div className="bg-purple-600 h-2.5 rounded-full" style={{ width: `${storagePercent}%` }}></div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h3>
        {recentActivity.length === 0 ? (
          <p className="text-sm text-gray-500">No recent activity to show.</p>
        ) : (
          <div className="flow-root">
            <ul className="-mb-8">
              {recentActivity.map((activity, index) => (
                <li key={`${activity.description}-${index}`}>
                  <div className="relative pb-8">
                    {index !== recentActivity.length - 1 ? (
                      <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true"></span>
                    ) : null}
                    <div className="relative flex space-x-3">
                      <div>
                        <span
                          className={`h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white ${
                            activity.type === 'class'
                              ? 'bg-blue-500'
                              : activity.type === 'user'
                              ? 'bg-green-500'
                              : 'bg-yellow-500'
                          }`}
                        >
                          {activity.type === 'class' ? (
                            <FaCalendarAlt className="h-4 w-4 text-white" />
                          ) : activity.type === 'user' ? (
                            <FaUserGraduate className="h-4 w-4 text-white" />
                          ) : (
                            <FaVideo className="h-4 w-4 text-white" />
                          )}
                        </span>
                      </div>
                      <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                        <div>
                          <p className="text-sm text-gray-500">{activity.description}</p>
                        </div>
                        <div className="text-right text-sm whitespace-nowrap text-gray-500">
                          <time>{activity.date}</time>
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default OverviewTab;
