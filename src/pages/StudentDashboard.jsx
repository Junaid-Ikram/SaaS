import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import useStudentDashboardData from '../components/student/useStudentDashboardData';

const formatDate = (value) => {
  if (!value) return '—';
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? '—' : parsed.toLocaleString();
};

const StudentDashboard = () => {
  const [activeTab, setActiveTab] = useState('courses');
  const { user, loading, error, classes, teachers, metrics, upcomingClasses, refresh } = useStudentDashboardData();

  const nextClass = useMemo(() => upcomingClasses[0] ?? null, [upcomingClasses]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
  };

  const cardVariants = {
    hidden: { scale: 0.92, opacity: 0 },
    visible: { scale: 1, opacity: 1, transition: { type: 'spring', stiffness: 160 } },
    hover: { scale: 1.02, boxShadow: '0 10px 20px rgba(16, 185, 129, 0.18)' },
  };

  const renderLoading = () => (
    <div className="min-h-[50vh] flex flex-col items-center justify-center text-gray-500">
      <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mb-4" />
      <p>Preparing your learning dashboard…</p>
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

  const renderCourses = () => (
    <motion.div key="courses" variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div variants={cardVariants} initial="hidden" animate="visible" whileHover="hover" className="bg-white rounded-xl shadow p-6">
          <p className="text-sm text-gray-500">Total Classes</p>
          <p className="text-3xl font-semibold text-emerald-600 mt-2">{metrics.totalClasses}</p>
        </motion.div>
        <motion.div variants={cardVariants} initial="hidden" animate="visible" whileHover="hover" className="bg-white rounded-xl shadow p-6">
          <p className="text-sm text-gray-500">Upcoming Sessions</p>
          <p className="text-3xl font-semibold text-emerald-600 mt-2">{metrics.upcomingCount}</p>
        </motion.div>
        <motion.div variants={cardVariants} initial="hidden" animate="visible" whileHover="hover" className="bg-white rounded-xl shadow p-6">
          <p className="text-sm text-gray-500">Teachers Available</p>
          <p className="text-3xl font-semibold text-emerald-600 mt-2">{metrics.teacherCount}</p>
        </motion.div>
      </div>

      <div className="bg-white rounded-xl shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-800">Class Schedule</h2>
            <p className="text-sm text-gray-500">All platform classes are shown below.</p>
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
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Teacher</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Starts</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {classes.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-sm text-gray-500">No classes are available at the moment.</td>
                </tr>
              ) : (
                classes.map((cls) => (
                  <tr key={cls.id}>
                    <td className="px-6 py-4">
                      <p className="text-sm font-medium text-gray-900">{cls.title}</p>
                      <p className="text-xs text-gray-500 mt-1">{cls.description || 'No description provided.'}</p>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">{cls.teacher}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{formatDate(cls.start)}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${cls.status === 'upcoming' ? 'bg-emerald-100 text-emerald-800' : cls.status === 'ended' ? 'bg-gray-200 text-gray-700' : 'bg-yellow-100 text-yellow-800'}`}>
                        {cls.status.replace(/\b\w/g, (c) => c.toUpperCase())}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );

  const renderTeachers = () => (
    <motion.div key="teachers" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white rounded-xl shadow overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-800">Teaching Staff</h2>
          <p className="text-sm text-gray-500">Need help? Reach out to any approved teacher.</p>
        </div>
        <span className="hidden sm:inline-flex text-sm text-gray-500">{metrics.teacherCount} teachers</span>
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
            {teachers.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-sm text-gray-500">No teachers are available right now.</td>
              </tr>
            ) : (
              teachers.map((teacher) => (
                <tr key={teacher.id}>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{teacher.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">{teacher.email}</td>
                  <td className="px-6 py-4">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-emerald-100 text-emerald-800">
                      {teacher.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">{teacher.joined}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </motion.div>
  );

  const renderPlaceholder = (title, description) => (
    <motion.div
      key={title}
      className="bg-white rounded-xl shadow p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <h2 className="text-xl font-semibold text-gray-800 mb-2">{title}</h2>
      <p className="text-gray-600">{description}</p>
    </motion.div>
  );

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} className="space-y-2">
        <h1 className="text-3xl font-bold text-emerald-700">Student Dashboard</h1>
        <p className="text-gray-600">Hello{user?.firstName ? `, ${user.firstName}` : ''}! Here’s what’s happening in your classes.</p>
        {nextClass && (
          <div className="mt-4 bg-emerald-50 border border-emerald-100 rounded-lg p-4 text-sm text-emerald-900">
            <span className="font-semibold">Next class:</span> {nextClass.title} with {nextClass.teacher} · {formatDate(nextClass.start)}
          </div>
        )}
      </motion.div>

      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { key: 'courses', label: 'My Classes' },
            { key: 'teachers', label: 'Teachers' },
            { key: 'support', label: 'Support & Resources' },
            { key: 'profile', label: 'My Profile' },
          ].map((tab) => (
            <motion.button
              key={tab.key}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.key ? 'border-emerald-500 text-emerald-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.label}
            </motion.button>
          ))}
        </nav>
      </div>

      {loading && renderLoading()}
      {!loading && error && renderError()}

      {!loading && !error && (
        <motion.div variants={containerVariants} initial="hidden" animate="visible">
          {activeTab === 'courses' && renderCourses()}
          {activeTab === 'teachers' && renderTeachers()}
          {activeTab === 'support' &&
            renderPlaceholder('Support & Resources', 'Guides, recordings, and live help will appear here soon.')}
          {activeTab === 'profile' &&
            renderPlaceholder('My Profile', 'Profile management is on the roadmap for a future release.')}
        </motion.div>
      )}
    </div>
  );
};

export default StudentDashboard;
