import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../utils/supabase';
import SubscriptionEnforcement from '../components/SubscriptionEnforcement';

const AcademyDashboard = () => {
  const { user, userDetails } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [academyData, setAcademyData] = useState(null);
  const [pendingUsers, setPendingUsers] = useState([]);
  const [teacherCount, setTeacherCount] = useState(0);
  const [studentCount, setStudentCount] = useState(0);
  
  // Fetch academy data and pending users
  useEffect(() => {
    const fetchAcademyData = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        setError(null);
        
        console.log('Fetching academy data for user:', user.id);
        
        // First, get the academy owner details
        const { data: ownerData, error: ownerError } = await supabase
          .from('academy_owners')
          .select('*')
          .eq('user_id', user.id)
          .single();
          
        if (ownerError) {
          console.error('Error fetching academy owner data:', ownerError.message);
          setError('Failed to load academy data. Please try again.');
          setLoading(false);
          return;
        }
        
        if (!ownerData) {
          console.error('No academy owner data found');
          setError('No academy data found. Please contact support.');
          setLoading(false);
          return;
        }
        
        console.log('Academy owner data:', ownerData);
        
        // Then, get the academy details
        const { data: academies, error: academyError } = await supabase
          .from('academies')
          .select('*')
          .eq('owner_id', user.id);
          
        if (academyError) {
          console.error('Error fetching academy data:', academyError.message);
          setError('Failed to load academy data. Please try again.');
          setLoading(false);
          return;
        }
        
        const academy = academies && academies.length > 0 ? academies[0] : null;
        console.log('Academy data:', academy);
        
        if (academy) {
          setAcademyData(academy);
          
          // Fetch pending teachers
          const { data: pendingTeachers, error: teacherError } = await supabase
            .from('teachers')
            .select('*')
            .eq('academy_id', academy.id)
            .eq('status', 'pending');
            
          if (teacherError) {
            console.error('Error fetching pending teachers:', teacherError.message);
          }
          
          // Fetch pending students
          const { data: pendingStudents, error: studentError } = await supabase
            .from('students')
            .select('*')
            .eq('academy_id', academy.id)
            .eq('status', 'pending');
            
          if (studentError) {
            console.error('Error fetching pending students:', studentError.message);
          }
          
          // Combine pending users
          const pendingTeachersList = pendingTeachers || [];
          const pendingStudentsList = pendingStudents || [];
          
          const formattedTeachers = pendingTeachersList.map(teacher => ({
            id: teacher.id,
            name: teacher.full_name,
            email: teacher.email,
            role: 'teacher',
            requestDate: new Date(teacher.created_at).toLocaleDateString(),
            originalData: teacher
          }));
          
          const formattedStudents = pendingStudentsList.map(student => ({
            id: student.id,
            name: student.full_name,
            email: student.email,
            role: 'student',
            requestDate: new Date(student.created_at).toLocaleDateString(),
            originalData: student
          }));
          
          setPendingUsers([...formattedTeachers, ...formattedStudents]);
          
          // Get counts of active teachers and students
          const { data: activeTeachers, error: activeTeacherError } = await supabase
            .from('teachers')
            .select('id')
            .eq('academy_id', academy.id)
            .eq('status', 'active');
            
          if (activeTeacherError) {
            console.error('Error fetching active teachers:', activeTeacherError.message);
          } else {
            setTeacherCount(activeTeachers?.length || 0);
          }
          
          const { data: activeStudents, error: activeStudentError } = await supabase
            .from('students')
            .select('id')
            .eq('academy_id', academy.id)
            .eq('status', 'active');
            
          if (activeStudentError) {
            console.error('Error fetching active students:', activeStudentError.message);
          } else {
            setStudentCount(activeStudents?.length || 0);
          }
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Exception in fetchAcademyData:', err.message);
        setError('An unexpected error occurred. Please try again.');
        setLoading(false);
      }
    };
    
    fetchAcademyData();
  }, [user]);

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

  // Handle user approval/rejection
  const handleUserAction = async (user, action) => {
    try {
      const status = action === 'approve' ? 'active' : 'rejected';
      const table = user.role === 'teacher' ? 'teachers' : 'students';
      
      console.log(`Updating ${user.role} status to ${status}:`, user.id);
      
      // Update the user's status in the database
      const { error } = await supabase
        .from(table)
        .update({ status })
        .eq('id', user.id);
        
      if (error) {
        console.error(`Error ${action}ing ${user.role}:`, error.message);
        alert(`Failed to ${action} ${user.role}. Please try again.`);
        return;
      }
      
      // Remove the user from the pending list
      setPendingUsers(pendingUsers.filter(pendingUser => pendingUser.id !== user.id));
      
      // If approved, increment the appropriate counter
      if (action === 'approve') {
        if (user.role === 'teacher') {
          setTeacherCount(prev => prev + 1);
        } else if (user.role === 'student') {
          setStudentCount(prev => prev + 1);
        }
      }
      
      // Show a success message
      alert(`${user.role.charAt(0).toUpperCase() + user.role.slice(1)} ${action === 'approve' ? 'approved' : 'rejected'} successfully`);
    } catch (error) {
      console.error(`Exception in handleUserAction:`, error.message);
      alert(`An error occurred. Please try again.`);
    }
  };

  return (
    <SubscriptionEnforcement limits={{ teachers: 5, students: 50 }}>
      <div className="container mx-auto px-4 py-8">
      <motion.div
        className="mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold text-green-800">Academy Dashboard</h1>
        <p className="text-gray-600 mt-2">Manage your academy, teachers, and students</p>
      </motion.div>

      {/* Tabs */}
      <div className="mb-8 border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'overview' ? 'border-green-500 text-green-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'pending' ? 'border-green-500 text-green-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
            onClick={() => setActiveTab('pending')}
          >
            Pending Approvals
            {pendingUsers.length > 0 && (
              <span className="ml-2 bg-green-100 text-green-600 py-0.5 px-2 rounded-full text-xs">
                {pendingUsers.length}
              </span>
            )}
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'teachers' ? 'border-green-500 text-green-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
            onClick={() => setActiveTab('teachers')}
          >
            Teachers
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'students' ? 'border-green-500 text-green-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
            onClick={() => setActiveTab('students')}
          >
            Students
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'settings' ? 'border-green-500 text-green-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
            onClick={() => setActiveTab('settings')}
          >
            Settings
          </motion.button>
        </nav>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
          <p className="ml-3 text-gray-600">Loading academy data...</p>
        </div>
      )}
      
      {/* Error State */}
      {!loading && error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative mb-6">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
          <button 
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded mt-3"
            onClick={() => window.location.reload()}
          >
            Retry
          </button>
        </div>
      )}
      
      {/* Overview Tab Content */}
      {!loading && !error && activeTab === 'overview' && (
        <div>
          {academyData ? (
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">{academyData.name}</h2>
              {academyData.description && (
                <p className="text-gray-600">{academyData.description}</p>
              )}
            </div>
          ) : (
            <div className="mb-6 bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded">
              <p>No academy data found. Please create an academy to get started.</p>
            </div>
          )}
          
          {/* Stats Cards */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div
              className="bg-white rounded-lg shadow-md p-6"
              variants={cardVariants}
              whileHover="hover"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-700">Total Teachers</h3>
                  <p className="text-3xl font-bold text-green-600 mt-2">{teacherCount}</p>
                </div>
                <div className="bg-green-100 p-3 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
              </div>
              <div className="mt-4">
                <button 
                  onClick={() => setActiveTab('teachers')}
                  className="text-green-600 text-sm font-semibold hover:text-green-800"
                >
                  View Teachers →
                </button>
              </div>
            </motion.div>

            <motion.div
              className="bg-white rounded-lg shadow-md p-6"
              variants={cardVariants}
              whileHover="hover"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-700">Total Students</h3>
                  <p className="text-3xl font-bold text-green-600 mt-2">{studentCount}</p>
                </div>
                <div className="bg-green-100 p-3 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
              </div>
              <div className="mt-4">
                <button 
                  onClick={() => setActiveTab('students')}
                  className="text-green-600 text-sm font-semibold hover:text-green-800"
                >
                  View Students →
                </button>
              </div>
            </motion.div>

            <motion.div
              className="bg-white rounded-lg shadow-md p-6"
              variants={cardVariants}
              whileHover="hover"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-700">Pending Approvals</h3>
                  <p className="text-3xl font-bold text-green-600 mt-2">{pendingUsers.length}</p>
                </div>
                <div className="bg-green-100 p-3 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <div className="mt-4">
                <button 
                  onClick={() => setActiveTab('pending')}
                  className="text-green-600 text-sm font-semibold hover:text-green-800"
                  disabled={pendingUsers.length === 0}
                >
                  {pendingUsers.length > 0 ? 'Review Requests →' : 'No Pending Requests'}
                </button>
              </div>
            </motion.div>
          </motion.div>

          {/* Academy Info Card */}
          <motion.div
            className="bg-white rounded-lg shadow-md p-6 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-xl font-semibold text-gray-800">Academy Information</h2>
                <div className="mt-4 space-y-2">
                  <div>
                    <span className="text-gray-500">Academy Name:</span>
                    <span className="ml-2 text-gray-800 font-medium">Tech Learning Center</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Academy ID:</span>
                    <span className="ml-2 text-gray-800 font-medium">TLC-2023</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Owner:</span>
                    <span className="ml-2 text-gray-800 font-medium">{userDetails?.full_name || user?.email}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Established:</span>
                    <span className="ml-2 text-gray-800 font-medium">October 2023</span>
                  </div>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-green-50 text-green-600 px-4 py-2 rounded-md hover:bg-green-100 transition-colors"
              >
                Edit Details
              </motion.button>
            </div>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            className="bg-white rounded-lg shadow-md p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">              
              <motion.button
                className="p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors flex flex-col items-center justify-center text-center"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => window.location.href = '/academy/subscription'}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2z" />
                </svg>
                <span className="font-medium text-gray-800">Manage Subscription</span>
              </motion.button>
              <motion.button
                className="p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors flex flex-col items-center justify-center text-center"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
                <span className="font-medium text-gray-800">Add Teacher</span>
              </motion.button>
              
              <motion.button
                className="p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors flex flex-col items-center justify-center text-center"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
                <span className="font-medium text-gray-800">Add Student</span>
              </motion.button>
              
              <motion.button
                className="p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors flex flex-col items-center justify-center text-center"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="font-medium text-gray-800">Schedule Classes</span>
              </motion.button>
              
              <motion.button
                className="p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors flex flex-col items-center justify-center text-center"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span className="font-medium text-gray-800">Generate Reports</span>
              </motion.button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Pending Approvals Tab Content */}
      {activeTab === 'pending' && (
        <motion.div
          className="bg-white rounded-lg shadow-md overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800">Pending Approval Requests</h2>
            <p className="text-gray-600 mt-1">Review and manage registration requests</p>
          </div>
          
          {pendingUsers.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Request Date</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {pendingUsers.map((user) => (
                    <motion.tr 
                      key={user.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{user.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.role === 'teacher' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'}`}>
                          {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {user.requestDate}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button 
                          onClick={() => handleUserAction(user.id, 'approve')}
                          className="text-green-600 hover:text-green-900 mr-4"
                        >
                          Approve
                        </button>
                        <button 
                          onClick={() => handleUserAction(user.id, 'reject')}
                          className="text-red-600 hover:text-red-900"
                        >
                          Reject
                        </button>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-6 text-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="text-lg font-medium text-gray-900">No pending requests</h3>
              <p className="mt-1 text-gray-500">All user registration requests have been processed.</p>
            </div>
          )}
        </motion.div>
      )}

      {/* Placeholder for other tabs */}
      {activeTab === 'teachers' && (
        <motion.div
          className="bg-white rounded-lg shadow-md p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Teachers Management</h2>
          <p className="text-gray-600">This section will display all teachers and allow you to manage them.</p>
        </motion.div>
      )}

      {activeTab === 'students' && (
        <motion.div
          className="bg-white rounded-lg shadow-md p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Students Management</h2>
          <p className="text-gray-600">This section will display all students and allow you to manage them.</p>
        </motion.div>
      )}

      {activeTab === 'settings' && (
        <motion.div
          className="bg-white rounded-lg shadow-md p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Academy Settings</h2>
          <p className="text-gray-600">This section will allow you to configure your academy settings.</p>
        </motion.div>
      )}
    </div>
    </SubscriptionEnforcement>
  );
};

export default AcademyDashboard;