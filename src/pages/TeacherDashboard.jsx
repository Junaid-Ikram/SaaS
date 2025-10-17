import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import useTeacherDashboardData from '../components/teacher/useTeacherDashboardData';

const TeacherDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('classes');
  const { loading, error, classes, students, metrics, refresh } = useTeacherDashboardData();

  const upcomingClass = useMemo(() => {
    if (!classes.length) return null;
    const upcoming = classes
      .filter((cls) => cls.status === 'upcoming')
      .sort((a, b) => new Date(a.start) - new Date(b.start));
    return upcoming[0] ?? classes[0];
  }, [classes]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 100 } },
  };

  const cardVariants = {
    hidden: { scale: 0.92, opacity: 0 },
    visible: { scale: 1, opacity: 1, transition: { type: 'spring', stiffness: 160 } },
    hover: { scale: 1.03, boxShadow: '0 12px 24px rgba(16, 185, 129, 0.15)' },
  };

  const renderLoading = () => (
    <div className="min-h-[50vh] flex flex-col items-center justify-center text-gray-500">
      <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mb-4" />
      <p>Loading your dashboard…</p>
    </div>
  );

  const renderError = () => (
    <div className="min-h-[50vh] flex flex-col items-center justify-center text-red-600 space-y-3">
      <p>{error}</p>
      <button
        type="button"
        onClick={refresh}
        className="px-4 py-2 rounded-md bg-red-600 text-white text-sm font-semibold hover:bg-red-700"
      >
        Retry
      </button>
    </div>
  );

  const renderClasses = () => (
    <motion.div
      key="classes"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div variants={cardVariants} initial="hidden" animate="visible" whileHover="hover" className="bg-white rounded-xl shadow p-6">
          <p className="text-sm text-gray-500">Total Classes</p>
          <p className="text-3xl font-semibold text-emerald-600 mt-2">{metrics.totalClasses}</p>
        </motion.div>
        <motion.div variants={cardVariants} initial="hidden" animate="visible" whileHover="hover" className="bg-white rounded-xl shadow p-6">
          <p className="text-sm text-gray-500">Upcoming</p>
          <p className="text-3xl font-semibold text-emerald-600 mt-2">{metrics.upcomingCount}</p>
        </motion.div>
        <motion.div variants={cardVariants} initial="hidden" animate="visible" whileHover="hover" className="bg-white rounded-xl shadow p-6">
          <p className="text-sm text-gray-500">Completed</p>
          <p className="text-3xl font-semibold text-emerald-600 mt-2">{metrics.completedCount}</p>
        </motion.div>
      </div>

      <div className="bg-white rounded-xl shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-800">Class Schedule</h2>
            <p className="text-sm text-gray-500">All sessions assigned to you appear here.</p>
          </div>
          <button
            type="button"
            className="hidden sm:inline-flex items-center text-sm font-medium text-emerald-600 hover:text-emerald-700"
            onClick={refresh}
          >
            Refresh
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Class</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Start Time</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Participants</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {classes.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-sm text-gray-500">
                    No classes have been scheduled yet.
                  </td>
                </tr>
              ) : (
                classes.map((cls) => (
                  <tr key={cls.id}>
                    <td className="px-6 py-4">
                      <p className="text-sm font-medium text-gray-900">{cls.title}</p>
                      <p className="text-xs text-gray-500 mt-1">{cls.description || 'No description provided.'}</p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${cls.status === 'upcoming' ? 'bg-emerald-100 text-emerald-800' : cls.status === 'ended' ? 'bg-gray-200 text-gray-700' : 'bg-yellow-100 text-yellow-800'}`}>
                        {cls.status.replace(/\b\w/g, (c) => c.toUpperCase())}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">{cls.start}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{cls.participants}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );

  const renderStudents = () => (
    <motion.div
      key="students"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-white rounded-xl shadow overflow-hidden"
    >
      <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-800">Students</h2>
          <p className="text-sm text-gray-500">Currently approved students on the platform.</p>
        </div>
        <span className="hidden sm:inline-flex text-sm text-gray-500">{metrics.studentCount} total</span>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Joined</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {students.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-sm text-gray-500">
                  No students available yet.
                </td>
              </tr>
            ) : (
              students.map((student) => (
                <tr key={student.id}>
                  <td className="px-6 py-4">
                    <p className="text-sm font-medium text-gray-900">{student.name}</p>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">{student.email}</td>
                  <td className="px-6 py-4">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-emerald-100 text-emerald-800">
                      {student.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">{student.joined}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </motion.div>
  );

  const renderPlaceholder = (title, message) => (
    <motion.div
      className="bg-white rounded-xl shadow-md p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <h2 className="text-xl font-semibold text-gray-800 mb-4">{title}</h2>
      <p className="text-gray-600">{message}</p>
    </motion.div>
  );

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      <motion.div
        className="space-y-2"
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold text-emerald-700">Teacher Dashboard</h1>
        <p className="text-gray-600">Welcome back{user?.firstName ? `, ${user.firstName}` : ''}! Stay on top of your classes and students.</p>
        {upcomingClass && (
          <div className="mt-4 bg-emerald-50 border border-emerald-100 rounded-lg p-4 text-sm text-emerald-900">
            <span className="font-semibold">Next session:</span> {upcomingClass.title} · {upcomingClass.start}
          </div>
        )}
      </motion.div>

      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {['classes', 'students', 'materials', 'profile'].map((tab) => (
            <motion.button
              key={tab}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab ? 'border-emerald-500 text-emerald-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab === 'classes' && 'My Classes'}
              {tab === 'students' && 'Students'}
              {tab === 'materials' && 'Teaching Materials'}
              {tab === 'profile' && 'My Profile'}
            </motion.button>
          ))}
        </nav>
      </div>

      {loading && renderLoading()}
      {!loading && error && renderError()}

      {!loading && !error && (
        <motion.div variants={containerVariants} initial="hidden" animate="visible">
          {activeTab === 'classes' && renderClasses()}
          {activeTab === 'students' && renderStudents()}
          {activeTab === 'materials' && renderPlaceholder('Teaching Materials', 'Resource management integrations are coming soon.')}
          {activeTab === 'profile' && renderPlaceholder('My Profile', 'Profile editing will be available in a future release.')}
        </motion.div>
      )}
    </div>
  );
};

export default TeacherDashboard;
