import React from 'react';
import { motion } from 'framer-motion';
import { 
  FaChalkboardTeacher, 
  FaUserGraduate, 
  FaCalendarAlt, 
  FaVideo 
} from 'react-icons/fa';

const OverviewTab = ({ 
  teacherCount, 
  studentCount, 
  classes, 
  zoomCredits, 
  subscriptionUsage 
}) => {
  // Animation variants for cards
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.5,
        delay: 0.1
      } 
    }
  };

  // Count upcoming classes
  const upcomingClassesCount = classes.filter(c => c.status === 'upcoming').length;

  return (
    <motion.div
      key="overview"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Stats Cards */}
        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          className="bg-white overflow-hidden shadow rounded-lg"
        >
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
              <a href="#" className="font-medium text-blue-700 hover:text-blue-900">View all</a>
            </div>
          </div>
        </motion.div>

        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          className="bg-white overflow-hidden shadow rounded-lg"
        >
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
              <a href="#" className="font-medium text-blue-700 hover:text-blue-900">View all</a>
            </div>
          </div>
        </motion.div>

        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          className="bg-white overflow-hidden shadow rounded-lg"
        >
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
              <a href="#" className="font-medium text-blue-700 hover:text-blue-900">View schedule</a>
            </div>
          </div>
        </motion.div>

        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          className="bg-white overflow-hidden shadow rounded-lg"
        >
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-yellow-500 rounded-md p-3">
                <FaVideo className="h-6 w-6 text-white" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Zoom Credits</dt>
                  <dd>
                    <div className="text-lg font-medium text-gray-900">{zoomCredits.remaining}</div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3">
            <div className="text-sm">
              <a href="#" className="font-medium text-blue-700 hover:text-blue-900">Purchase more</a>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Subscription Usage */}
      <div className="mt-6 bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Subscription Usage</h3>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm font-medium">
              <span>Students ({studentCount}/{subscriptionUsage.studentLimit})</span>
              <span>{Math.round((studentCount / subscriptionUsage.studentLimit) * 100)}%</span>
            </div>
            <div className="mt-2 w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className="bg-blue-600 h-2.5 rounded-full" 
                style={{ width: `${Math.min(100, Math.round((studentCount / subscriptionUsage.studentLimit) * 100))}%` }}
              ></div>
            </div>
          </div>
          <div>
            <div className="flex justify-between text-sm font-medium">
              <span>Teachers ({teacherCount}/{subscriptionUsage.teacherLimit})</span>
              <span>{Math.round((teacherCount / subscriptionUsage.teacherLimit) * 100)}%</span>
            </div>
            <div className="mt-2 w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className="bg-green-600 h-2.5 rounded-full" 
                style={{ width: `${Math.min(100, Math.round((teacherCount / subscriptionUsage.teacherLimit) * 100))}%` }}
              ></div>
            </div>
          </div>
          <div>
            <div className="flex justify-between text-sm font-medium">
              <span>Storage ({subscriptionUsage.storageUsed}/{subscriptionUsage.storageLimit} GB)</span>
              <span>{Math.round((subscriptionUsage.storageUsed / subscriptionUsage.storageLimit) * 100)}%</span>
            </div>
            <div className="mt-2 w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className="bg-purple-600 h-2.5 rounded-full" 
                style={{ width: `${Math.min(100, Math.round((subscriptionUsage.storageUsed / subscriptionUsage.storageLimit) * 100))}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="mt-6 bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h3>
        <div className="flow-root">
          <ul className="-mb-8">
            {subscriptionUsage.recentActivity.map((activity, index) => (
              <li key={index}>
                <div className="relative pb-8">
                  {index !== subscriptionUsage.recentActivity.length - 1 ? (
                    <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true"></span>
                  ) : null}
                  <div className="relative flex space-x-3">
                    <div>
                      <span className={`h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white ${activity.type === 'class' ? 'bg-blue-500' : activity.type === 'user' ? 'bg-green-500' : 'bg-yellow-500'}`}>
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
                        <time dateTime={activity.date}>{activity.date}</time>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </motion.div>
  );
};

export default OverviewTab;