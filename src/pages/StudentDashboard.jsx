import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';

const StudentDashboard = () => {
  const { user, userDetails } = useAuth();
  const [activeTab, setActiveTab] = useState('courses');
  
  // Mock data for enrolled courses
  const [courses, setCourses] = useState([
    { id: 1, name: 'Introduction to Programming', instructor: 'Prof. Johnson', progress: 65, nextClass: '2023-10-25 10:00 AM', grade: 'B+' },
    { id: 2, name: 'Advanced Web Development', instructor: 'Dr. Smith', progress: 42, nextClass: '2023-10-26 2:00 PM', grade: 'A-' },
    { id: 3, name: 'Data Structures & Algorithms', instructor: 'Prof. Williams', progress: 28, nextClass: '2023-10-27 1:00 PM', grade: 'B' },
  ]);

  // Mock data for assignments
  const [assignments, setAssignments] = useState([
    { id: 1, title: 'JavaScript Basics Quiz', course: 'Introduction to Programming', dueDate: '2023-10-28', status: 'Pending' },
    { id: 2, title: 'React Component Project', course: 'Advanced Web Development', dueDate: '2023-11-05', status: 'Pending' },
    { id: 3, title: 'Array Implementation', course: 'Data Structures & Algorithms', dueDate: '2023-10-30', status: 'Pending' },
    { id: 4, title: 'HTML/CSS Fundamentals', course: 'Introduction to Programming', dueDate: '2023-10-20', status: 'Completed', score: '92%' },
  ]);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: 'spring', stiffness: 100 }
    }
  };

  const cardVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: { type: 'spring', stiffness: 100 }
    },
    hover: {
      scale: 1.05,
      boxShadow: '0 10px 20px rgba(0,0,0,0.1)',
      transition: { type: 'spring', stiffness: 400, damping: 10 }
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    });
  };

  // Calculate time remaining until due date
  const getTimeRemaining = (dueDate) => {
    const now = new Date();
    const due = new Date(dueDate);
    const diffMs = due - now;
    
    if (diffMs <= 0) return 'Overdue';
    
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Due today';
    if (diffDays === 1) return 'Due tomorrow';
    return `${diffDays} days left`;
  };

  // Calculate overall GPA
  const calculateGPA = () => {
    const gradePoints = {
      'A+': 4.0, 'A': 4.0, 'A-': 3.7,
      'B+': 3.3, 'B': 3.0, 'B-': 2.7,
      'C+': 2.3, 'C': 2.0, 'C-': 1.7,
      'D+': 1.3, 'D': 1.0, 'D-': 0.7,
      'F': 0.0
    };
    
    const totalPoints = courses.reduce((sum, course) => sum + (gradePoints[course.grade] || 0), 0);
    return (totalPoints / courses.length).toFixed(2);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        className="mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold text-green-800">Student Dashboard</h1>
        <p className="text-gray-600 mt-2">Track your courses, assignments, and progress</p>
      </motion.div>

      {/* Tabs */}
      <div className="mb-8 border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'courses' ? 'border-green-500 text-green-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
            onClick={() => setActiveTab('courses')}
          >
            My Courses
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'assignments' ? 'border-green-500 text-green-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
            onClick={() => setActiveTab('assignments')}
          >
            Assignments
            {assignments.filter(a => a.status === 'Pending').length > 0 && (
              <span className="ml-2 bg-green-100 text-green-600 py-0.5 px-2 rounded-full text-xs">
                {assignments.filter(a => a.status === 'Pending').length}
              </span>
            )}
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'grades' ? 'border-green-500 text-green-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
            onClick={() => setActiveTab('grades')}
          >
            Grades & Progress
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'profile' ? 'border-green-500 text-green-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
            onClick={() => setActiveTab('profile')}
          >
            My Profile
          </motion.button>
        </nav>
      </div>

      {/* Courses Tab Content */}
      {activeTab === 'courses' && (
        <div>
          {/* Next Class Alert */}
          <motion.div
            className="bg-green-50 border-l-4 border-green-500 p-4 mb-8 rounded-md"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-green-800">Next Class: Advanced Web Development</h3>
                <div className="mt-1 text-sm text-green-700">
                  <p>Thursday, Oct 26 at 2:00 PM with Dr. Smith</p>
                </div>
              </div>
              <div className="ml-auto">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-green-100 text-green-700 px-3 py-1 rounded-md text-sm font-medium hover:bg-green-200"
                >
                  Join Class
                </motion.button>
              </div>
            </div>
          </motion.div>

          {/* Course Cards */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {courses.map((course) => (
              <motion.div
                key={course.id}
                className="bg-white rounded-lg shadow-md overflow-hidden"
                variants={cardVariants}
                whileHover="hover"
              >
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">{course.name}</h3>
                  <p className="text-gray-600 mb-4">Instructor: {course.instructor}</p>
                  
                  <div className="mb-4">
                    <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium text-gray-700">Progress</span>
                        <span className="text-sm font-medium text-green-600">{course.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div 
                          className="bg-green-600 h-2.5 rounded-full" 
                          style={{ width: `${course.progress}%` }}
                        ></div>
                      </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="text-xs text-gray-500">Next Class</span>
                      <p className="text-sm text-gray-700">{formatDate(course.nextClass)}</p>
                    </div>
                    <div>
                      <span className="text-xs text-gray-500">Current Grade</span>
                      <p className="text-sm font-semibold text-green-600">{course.grade}</p>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-6 py-3 flex justify-between">
                  <button className="text-sm text-green-600 font-medium hover:text-green-800">Course Details</button>
                  <button className="text-sm text-green-600 font-medium hover:text-green-800">View Materials</button>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Explore More Courses */}
          <motion.div
            className="bg-green-50 rounded-lg p-6 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h3 className="text-lg font-semibold text-green-800 mb-2">Looking for more courses?</h3>
            <p className="text-green-600 mb-4">Explore our course catalog to find more learning opportunities</p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition-colors"
            >
              Browse Courses
            </motion.button>
          </motion.div>
        </div>
      )}

      {/* Assignments Tab Content */}
      {activeTab === 'assignments' && (
        <motion.div
          className="bg-white rounded-lg shadow-md overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800">My Assignments</h2>
            <p className="text-gray-600 mt-1">Track your upcoming and completed assignments</p>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assignment</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due Date</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {assignments.map((assignment) => (
                  <motion.tr 
                    key={assignment.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{assignment.title}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{assignment.course}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {assignment.dueDate}
                        {assignment.status === 'Pending' && (
                          <span className={`ml-2 text-xs font-medium ${getTimeRemaining(assignment.dueDate) === 'Overdue' ? 'text-red-600' : getTimeRemaining(assignment.dueDate) === 'Due today' ? 'text-orange-600' : 'text-green-600'}`}>
                            ({getTimeRemaining(assignment.dueDate)})
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${assignment.status === 'Completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                        {assignment.status}
                        {assignment.status === 'Completed' && assignment.score && ` - ${assignment.score}`}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {assignment.status === 'Pending' ? (
                        <button className="text-green-600 hover:text-green-900">Submit</button>
                      ) : (
                        <button className="text-gray-600 hover:text-gray-900">View Feedback</button>
                      )}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}

      {/* Grades Tab Content */}
      {activeTab === 'grades' && (
        <div className="space-y-8">
          {/* GPA Card */}
          <motion.div
            className="bg-white rounded-lg shadow-md p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-gray-800">Current GPA</h2>
                <p className="text-gray-600 mt-1">Your overall academic performance</p>
              </div>
              <div className="text-4xl font-bold text-green-600">{calculateGPA()}</div>
            </div>
          </motion.div>
          
          {/* Course Grades */}
          <motion.div
            className="bg-white rounded-lg shadow-md overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800">Course Grades</h2>
              <p className="text-gray-600 mt-1">Your performance in each course</p>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Instructor</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Progress</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Grade</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {courses.map((course) => (
                    <motion.tr 
                      key={course.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{course.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{course.instructor}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div 
                            className="bg-green-600 h-2.5 rounded-full" 
                            style={{ width: `${course.progress}%` }}
                          ></div>
                        </div>
                        <span className="text-xs text-gray-500 mt-1">{course.progress}% complete</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-sm leading-5 font-semibold rounded-md ${course.grade.startsWith('A') ? 'bg-green-100 text-green-800' : course.grade.startsWith('B') ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'}`}>
                          {course.grade}
                        </span>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
          
          {/* Performance Chart Placeholder */}
          <motion.div
            className="bg-white rounded-lg shadow-md p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Performance Trends</h2>
            <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
              <p className="text-gray-500">Performance chart will be displayed here</p>
            </div>
          </motion.div>
        </div>
      )}

      {/* Profile Tab Content */}
      {activeTab === 'profile' && (
        <motion.div
          className="bg-white rounded-lg shadow-md p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <h2 className="text-xl font-semibold text-gray-800 mb-4">My Profile</h2>
          <p className="text-gray-600">This section will display and allow you to edit your profile information.</p>
        </motion.div>
      )}
    </div>
  );
};

export default StudentDashboard;