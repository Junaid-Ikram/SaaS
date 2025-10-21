import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../contexts/AuthContext";
import useTeacherDashboardData from "../components/teacher/useTeacherDashboardData";
import TeacherClassesTab from "../components/teacher/TeacherClassesTab";
import TeacherResourcesTab from "../components/teacher/TeacherResourcesTab";
import useTeacherResources from "../components/teacher/useTeacherResources";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const TeacherDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("classes");
  const {
    loading,
    error,
    classes,
    classesMeta,
    students,
    filters,
    setFilters: updateFilters,
    metrics,
    refresh,
    createClass,
    updateClass,
    deleteClass,
  } = useTeacherDashboardData();
  const {
    resources,
    loading: resourcesLoading,
    error: resourcesError,
    refresh: refreshResources,
    createResource,
    updateResource,
    deleteResource,
  } = useTeacherResources(classes);

  const upcomingClass = useMemo(() => {
    if (!classes.length) return null;
    const upcoming = classes
      .filter((cls) => cls.status === "upcoming")
      .sort((a, b) => new Date(a.scheduledStart) - new Date(b.scheduledStart));
    return upcoming[0] ?? classes[0];
  }, [classes]);

  const renderLoading = () => (
    <div className="flex min-h-[50vh] flex-col items-center justify-center text-gray-500">
      <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent" />
      <p>Loading your dashboard.</p>
    </div>
  );

  const renderError = () => (
    <div className="flex min-h-[50vh] flex-col items-center justify-center space-y-3 text-red-600">
      <p>{error}</p>
      <button
        type="button"
        onClick={refresh}
        className="rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
      >
        Retry
      </button>
    </div>
  );

  const renderStudents = () => (
    <motion.div
      key="students"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="rounded-xl bg-white shadow"
    >
      <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-800">Students</h2>
          <p className="text-sm text-gray-500">
            Currently approved students on the platform.
          </p>
        </div>
        <span className="hidden text-sm text-gray-500 sm:inline-flex">
          {metrics.studentCount ?? students.length} total
        </span>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                Joined
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {students.length === 0 ? (
              <tr>
                <td
                  colSpan={4}
                  className="px-6 py-8 text-center text-sm text-gray-500"
                >
                  No students available yet.
                </td>
              </tr>
            ) : (
              students.map((student) => (
                <tr key={student.id}>
                  <td className="px-6 py-4">
                    <p className="text-sm font-medium text-gray-900">
                      {student.name}
                    </p>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {student.email}
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex rounded-full bg-emerald-100 px-2 py-1 text-xs font-semibold text-emerald-800">
                      {student.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {student.joined}
                  </td>
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
      className="rounded-xl bg-white p-6 shadow"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <h2 className="mb-4 text-xl font-semibold text-gray-800">{title}</h2>
      <p className="text-gray-600">{message}</p>
    </motion.div>
  );

  return (
    <div className="container mx-auto space-y-6 px-4 py-8">
      <motion.div
        className="space-y-2"
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold text-emerald-700">
          Teacher Dashboard
        </h1>
        <p className="text-gray-600">
          Welcome back{user?.firstName ? `, ${user.firstName}` : ""}! Stay on
          top of your classes and students.
        </p>
        {upcomingClass ? (
          <div className="mt-4 rounded-lg border border-emerald-100 bg-emerald-50 p-4 text-sm text-emerald-900">
            <span className="font-semibold">Next session:</span>{" "}
            {upcomingClass.title} � {upcomingClass.start}
          </div>
        ) : null}
      </motion.div>

      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { key: "classes", label: "My Classes" },
            { key: "students", label: "Students" },
            { key: "resources", label: "Resources" },
            { key: "profile", label: "My Profile" },
          ].map((tab) => (
            <motion.button
              key={tab.key}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`py-4 px-1 text-sm font-medium ${
                activeTab === tab.key
                  ? "border-b-2 border-emerald-500 text-emerald-600"
                  : "border-b-2 border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
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
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {activeTab === "classes" ? (
            <TeacherClassesTab
              classes={classes}
              students={students}
              filters={filters}
              onUpdateFilters={updateFilters}
              onCreateClass={createClass}
              onUpdateClass={updateClass}
              onDeleteClass={deleteClass}
              loading={loading}
              meta={classesMeta}
              onRefresh={refresh}
              metrics={metrics}
            />
          ) : null}
          {activeTab === "students" ? renderStudents() : null}
          {activeTab === "materials"
            ? renderPlaceholder(
                "Teaching Materials",
                "Resource management integrations are coming soon.",
              )
            : null}
          {activeTab === "profile"
            ? renderPlaceholder(
                "My Profile",
                "Profile editing will be available in a future release.",
              )
            : null}
        </motion.div>
      )}
    </div>
  );
};

export default TeacherDashboard;


