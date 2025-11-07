import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import useStudentDashboardData from '../components/student/useStudentDashboardData';
import useStudentResources from '../components/student/useStudentResources';
import StudentResourcesTab from '../components/student/StudentResourcesTab';
import AcademyDirectory from '../components/academy/AcademyDirectory';
import ProfileTab from '../components/profile/ProfileTab';

const formatDate = (value) => {
  if (!value) return '-';
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? '-' : parsed.toLocaleString();
};

const StudentDashboard = () => {
  const [activeTab, setActiveTab] = useState('courses');
  const { user, userDetails } = useAuth();
  const {
    loading,
    error,
    classes,
    teachers,
    metrics,
    upcomingClasses,
    refresh,
    hasAcademyAccess,
    loadingAcademies,
    activeAcademyId,
  } = useStudentDashboardData();
  const {
    resources,
    loading: resourcesLoading,
    error: resourcesError,
    refresh: refreshResources,
  } = useStudentResources(classes, teachers, activeAcademyId);

  const nextClass = useMemo(() => upcomingClasses[0] ?? null, [upcomingClasses]);

  const profilePhoto = user?.profilePhotoUrl ?? userDetails?.profilePhotoUrl ?? null;
  const studentInitials = useMemo(() => {
    const parts = [user?.firstName, user?.lastName].filter(Boolean);
    if (parts.length) {
      return parts
        .map((part) => (part ? part.charAt(0) : ""))
        .join("")
        .slice(0, 2)
        .toUpperCase();
    }
    const fallback = user?.email ?? "YOU";
    return fallback.slice(0, 2).toUpperCase();
  }, [user?.email, user?.firstName, user?.lastName]);

  const isBusy = loading || loadingAcademies;

  const heroStats = useMemo(
    () => [
      {
        label: "Classes",
        value: metrics.totalClasses ?? 0,
        caption: "Total available",
      },
      {
        label: "Upcoming",
        value: metrics.upcomingCount ?? 0,
        caption: "Next few weeks",
      },
      {
        label: "Teachers",
        value: metrics.teacherCount ?? 0,
        caption: "Ready to help",
      },
      {
        label: "Resources",
        value: resources.length ?? 0,
        caption: "Shared with you",
      },
    ],
    [metrics, resources],
  );

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
      <p>Preparing your learning dashboardâ€¦</p>
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
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Action</th>
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
                    <td className="px-6 py-4">
                      {cls.status === 'upcoming' && cls.joinUrl ? (
                        <a
                          href={cls.joinUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center rounded-md border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 transition hover:bg-emerald-100 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-2"
                        >
                          Join class
                        </a>
                      ) : (
                        <span className="text-xs text-gray-400">Not available</span>
                      )}
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
    <div className="relative min-h-screen overflow-hidden bg-slate-950/5">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-20 left-10 h-72 w-72 rounded-full bg-indigo-200/40 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-purple-200/40 blur-3xl" />
      </div>
      <div className="relative mx-auto max-w-6xl space-y-6 px-4 py-10 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-3xl bg-gradient-to-br from-indigo-600 via-purple-500 to-emerald-500 p-6 text-white shadow-2xl"
        >
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-white/30 bg-white/10 shadow-lg backdrop-blur">
                {profilePhoto ? (
                  <img
                    src={profilePhoto}
                    alt="Your avatar"
                    className="h-full w-full rounded-2xl object-cover"
                  />
                ) : (
                  <span className="text-lg font-semibold uppercase tracking-wider text-white">
                    {studentInitials}
                  </span>
                )}
              </div>
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-white/80">
                  Student HQ
                </p>
                <h1 className="mt-1 text-3xl font-semibold">
                  Hello{user?.firstName ? `, ${user.firstName}` : ''}!
                </h1>
                <p className="text-sm text-white/80">
                  Keep tabs on upcoming sessions, trusted teachers, and on-demand resources.
                </p>
              </div>
            </div>
            <div className="rounded-2xl bg-white/10 p-4 shadow-inner backdrop-blur">
              <p className="text-xs uppercase tracking-widest text-white/70">
                Next class
              </p>
              {nextClass ? (
                <>
                  <p className="mt-2 text-lg font-semibold">{nextClass.title}</p>
                  <p className="text-sm text-white/80">
                    with {nextClass.teacher} · {formatDate(nextClass.start)}
                  </p>
                </>
              ) : (
                <p className="mt-2 text-sm text-white/80">
                  Once your academy schedules a class it will appear here.
                </p>
              )}
            </div>
          </div>
          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {heroStats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl border border-white/20 bg-white/10 p-4 shadow-sm backdrop-blur"
              >
                <p className="text-xs uppercase tracking-widest text-white/70">
                  {stat.label}
                </p>
                <p className="mt-1 text-2xl font-semibold">{stat.value}</p>
                <p className="text-xs text-white/70">{stat.caption}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {!hasAcademyAccess && !loadingAcademies ? (
          <div className="rounded-2xl border border-amber-200/70 bg-amber-50/90 p-5 text-sm text-amber-900 shadow-sm">
            <p className="font-semibold">You are not currently enrolled in an academy.</p>
            <p className="mt-1">
              Browse the academy directory to request access and unlock your classes and resources.
            </p>
          </div>
        ) : null}

        <div className="rounded-2xl border border-slate-200/60 bg-white/80 p-2 shadow-sm backdrop-blur">
          <nav className="flex flex-wrap gap-2">
            {[
              { key: 'courses', label: 'My Classes' },
              { key: 'teachers', label: 'Teachers' },
              { key: 'resources', label: 'Resources' },
              { key: 'academies', label: 'Academies' },
              { key: 'profile', label: 'My Profile' },
            ].map((tab) => (
              <motion.button
                key={tab.key}
                whileTap={{ scale: 0.96 }}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                  activeTab === tab.key
                    ? 'bg-indigo-600 text-white shadow'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
                onClick={() => setActiveTab(tab.key)}
              >
                {tab.label}
              </motion.button>
            ))}
          </nav>
        </div>

        {isBusy && renderLoading()}
        {!isBusy && error && renderError()}

        {!isBusy && !error && (
          <motion.div variants={containerVariants} initial="hidden" animate="visible">
            {activeTab === 'courses' && renderCourses()}
            {activeTab === 'teachers' && renderTeachers()}
            {activeTab === 'resources' && (
              <StudentResourcesTab
                resources={resources}
                loading={resourcesLoading}
                error={resourcesError}
                onRefresh={refreshResources}
                classes={classes}
                hasAcademyAccess={hasAcademyAccess}
                loadingAcademies={loadingAcademies}
              />
            )}
            {activeTab === 'academies' && <AcademyDirectory />}
            {activeTab === 'profile' ? (
              <ProfileTab
                title="My Profile"
                subtitle="Express your learning style, keep details updated, and sparkle across the platform."
              />
            ) : null}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;
