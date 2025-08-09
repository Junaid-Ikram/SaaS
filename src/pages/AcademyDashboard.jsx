import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import SubscriptionEnforcement from '../components/SubscriptionEnforcement';
import { FaUsers, FaChalkboardTeacher, FaUserGraduate, FaClock, FaCalendarAlt, FaFileUpload, FaComments, FaChartLine, FaCreditCard, FaCog, FaBell, FaSearch, FaEdit, FaTrash, FaPlus, FaDownload, FaShare, FaEllipsisH, FaBullhorn, FaEnvelope, FaGlobe, FaLock, FaUserCog, FaDatabase, FaServer } from 'react-icons/fa';

const AcademyDashboard = () => {
  const { user, userDetails } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [activeSubTab, setActiveSubTab] = useState('summary');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [academyData, setAcademyData] = useState(null);
  const [pendingUsers, setPendingUsers] = useState([]);
  const [teacherCount, setTeacherCount] = useState(0);
  const [studentCount, setStudentCount] = useState(0);
  const [subscriptionUsage, setSubscriptionUsage] = useState({
    zoomMinutes: { used: 120, total: 500 },
    teachers: { used: 0, total: 5 },
    students: { used: 0, total: 50 }
  });
  const [classes, setClasses] = useState([]);
  const [resources, setResources] = useState([]);
  const [communications, setCommunications] = useState([]);
  const [payments, setPayments] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [teachers, setTeachers] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  
  // Load dummy data instead of fetching from database
  useEffect(() => {
    // Simulate loading delay
    const loadDummyData = () => {
      setLoading(true);
      setError(null);
      
      setTimeout(() => {
        // Dummy academy data
        const dummyAcademy = {
          id: 'acad_123456',
          name: 'Bright Future Academy',
          owner_id: user?.id || 'user_123',
          created_at: '2023-01-15T10:30:00Z',
          subscription_plan: 'pro',
          status: 'active',
          logo_url: null,
          description: 'A premier educational institution focused on excellence',
          contact_email: 'admin@brightfuture.edu',
          contact_phone: '+1 (555) 123-4567',
          address: '123 Education Ave, Learning City, LC 12345'
        };
        
        setAcademyData(dummyAcademy);
        
        // Dummy pending users
        const dummyPendingUsers = [
          {
            id: 'teacher_pending_1',
            name: 'John Smith',
            email: 'john.smith@example.com',
            role: 'teacher',
            requestDate: '05/15/2023',
            originalData: {
              id: 'teacher_pending_1',
              full_name: 'John Smith',
              email: 'john.smith@example.com',
              status: 'pending',
              created_at: '2023-05-15T14:30:00Z',
              academy_id: 'acad_123456',
              subject: 'Mathematics'
            }
          },
          {
            id: 'student_pending_1',
            name: 'Emma Johnson',
            email: 'emma.j@example.com',
            role: 'student',
            requestDate: '05/18/2023',
            originalData: {
              id: 'student_pending_1',
              full_name: 'Emma Johnson',
              email: 'emma.j@example.com',
              status: 'pending',
              created_at: '2023-05-18T09:15:00Z',
              academy_id: 'acad_123456',
              grade: '10th'
            }
          },
          {
            id: 'teacher_pending_2',
            name: 'Robert Williams',
            email: 'robert.w@example.com',
            role: 'teacher',
            requestDate: '05/20/2023',
            originalData: {
              id: 'teacher_pending_2',
              full_name: 'Robert Williams',
              email: 'robert.w@example.com',
              status: 'pending',
              created_at: '2023-05-20T11:45:00Z',
              academy_id: 'acad_123456',
              subject: 'Science'
            }
          }
        ];
        
        setPendingUsers(dummyPendingUsers);
        
        // Dummy teachers
        const dummyTeachers = [
          {
            id: 'teacher_1',
            full_name: 'Michael Brown',
            email: 'michael.b@example.com',
            status: 'active',
            created_at: '2023-01-20T08:30:00Z',
            academy_id: 'acad_123456',
            subject: 'English Literature',
            profile_image: null,
            students_assigned: 12,
            classes_count: 3,
            last_active: '2023-05-25T14:30:00Z'
          },
          {
            id: 'teacher_2',
            full_name: 'Sarah Davis',
            email: 'sarah.d@example.com',
            status: 'active',
            created_at: '2023-02-05T10:15:00Z',
            academy_id: 'acad_123456',
            subject: 'History',
            profile_image: null,
            students_assigned: 15,
            classes_count: 2,
            last_active: '2023-05-24T16:45:00Z'
          },
          {
            id: 'teacher_3',
            full_name: 'James Wilson',
            email: 'james.w@example.com',
            status: 'active',
            created_at: '2023-02-15T09:00:00Z',
            academy_id: 'acad_123456',
            subject: 'Physics',
            profile_image: null,
            students_assigned: 10,
            classes_count: 2,
            last_active: '2023-05-25T11:30:00Z'
          },
          {
            id: 'teacher_4',
            full_name: 'Jennifer Taylor',
            email: 'jennifer.t@example.com',
            status: 'inactive',
            created_at: '2023-03-01T14:20:00Z',
            academy_id: 'acad_123456',
            subject: 'Chemistry',
            profile_image: null,
            students_assigned: 0,
            classes_count: 0,
            last_active: '2023-04-15T10:00:00Z'
          },
          {
            id: 'teacher_5',
            full_name: 'David Miller',
            email: 'david.m@example.com',
            status: 'active',
            created_at: '2023-03-10T11:45:00Z',
            academy_id: 'acad_123456',
            subject: 'Mathematics',
            profile_image: null,
            students_assigned: 18,
            classes_count: 4,
            last_active: '2023-05-25T09:15:00Z'
          }
        ];
        
        setTeachers(dummyTeachers);
        setTeacherCount(dummyTeachers.filter(t => t.status === 'active').length);
        
        // Dummy students
        const dummyStudents = [
          {
            id: 'student_1',
            full_name: 'Alex Johnson',
            email: 'alex.j@example.com',
            status: 'active',
            created_at: '2023-02-01T09:30:00Z',
            academy_id: 'acad_123456',
            grade: '11th',
            profile_image: null,
            assigned_teacher_id: 'teacher_1',
            assigned_teacher_name: 'Michael Brown',
            last_active: '2023-05-25T13:45:00Z'
          },
          {
            id: 'student_2',
            full_name: 'Sophia Martinez',
            email: 'sophia.m@example.com',
            status: 'active',
            created_at: '2023-02-10T10:45:00Z',
            academy_id: 'acad_123456',
            grade: '10th',
            profile_image: null,
            assigned_teacher_id: 'teacher_2',
            assigned_teacher_name: 'Sarah Davis',
            last_active: '2023-05-24T15:30:00Z'
          },
          {
            id: 'student_3',
            full_name: 'Ethan Thompson',
            email: 'ethan.t@example.com',
            status: 'active',
            created_at: '2023-02-15T14:20:00Z',
            academy_id: 'acad_123456',
            grade: '12th',
            profile_image: null,
            assigned_teacher_id: 'teacher_3',
            assigned_teacher_name: 'James Wilson',
            last_active: '2023-05-25T10:15:00Z'
          },
          {
            id: 'student_4',
            full_name: 'Olivia Garcia',
            email: 'olivia.g@example.com',
            status: 'inactive',
            created_at: '2023-03-05T11:30:00Z',
            academy_id: 'acad_123456',
            grade: '9th',
            profile_image: null,
            assigned_teacher_id: null,
            assigned_teacher_name: null,
            last_active: '2023-04-10T09:45:00Z'
          },
          {
            id: 'student_5',
            full_name: 'Noah Rodriguez',
            email: 'noah.r@example.com',
            status: 'active',
            created_at: '2023-03-12T13:15:00Z',
            academy_id: 'acad_123456',
            grade: '11th',
            profile_image: null,
            assigned_teacher_id: 'teacher_5',
            assigned_teacher_name: 'David Miller',
            last_active: '2023-05-24T14:00:00Z'
          },
          {
            id: 'student_6',
            full_name: 'Isabella Lopez',
            email: 'isabella.l@example.com',
            status: 'active',
            created_at: '2023-03-18T10:00:00Z',
            academy_id: 'acad_123456',
            grade: '10th',
            profile_image: null,
            assigned_teacher_id: 'teacher_1',
            assigned_teacher_name: 'Michael Brown',
            last_active: '2023-05-25T11:30:00Z'
          },
          {
            id: 'student_7',
            full_name: 'Mason Lee',
            email: 'mason.l@example.com',
            status: 'active',
            created_at: '2023-03-25T09:45:00Z',
            academy_id: 'acad_123456',
            grade: '12th',
            profile_image: null,
            assigned_teacher_id: 'teacher_2',
            assigned_teacher_name: 'Sarah Davis',
            last_active: '2023-05-23T16:15:00Z'
          }
        ];
        
        setStudents(dummyStudents);
        setStudentCount(dummyStudents.filter(s => s.status === 'active').length);
        
        // Dummy classes
        const dummyClasses = [
          {
            id: 'class_1',
            title: 'Advanced Mathematics',
            teacher_id: 'teacher_5',
            teacher_name: 'David Miller',
            schedule: 'Mon, Wed, Fri 10:00 AM - 11:30 AM',
            students_count: 12,
            status: 'active',
            next_session: '2023-05-26T10:00:00Z'
          },
          {
            id: 'class_2',
            title: 'English Literature',
            teacher_id: 'teacher_1',
            teacher_name: 'Michael Brown',
            schedule: 'Tue, Thu 1:00 PM - 2:30 PM',
            students_count: 15,
            status: 'active',
            next_session: '2023-05-25T13:00:00Z'
          },
          {
            id: 'class_3',
            title: 'World History',
            teacher_id: 'teacher_2',
            teacher_name: 'Sarah Davis',
            schedule: 'Mon, Wed 2:00 PM - 3:30 PM',
            students_count: 10,
            status: 'active',
            next_session: '2023-05-29T14:00:00Z'
          },
          {
            id: 'class_4',
            title: 'Physics 101',
            teacher_id: 'teacher_3',
            teacher_name: 'James Wilson',
            schedule: 'Tue, Thu 10:00 AM - 11:30 AM',
            students_count: 8,
            status: 'active',
            next_session: '2023-05-25T10:00:00Z'
          }
        ];
        
        setClasses(dummyClasses);
        
        // Dummy resources
        const dummyResources = [
          {
            id: 'resource_1',
            name: 'Mathematics Textbook.pdf',
            type: 'documents',
            size: '15.2 MB',
            uploaded_date: 'May 10, 2023',
            uploaded_by: 'David Miller',
            used_in_classes: ['class_1']
          },
          {
            id: 'resource_2',
            name: 'English Literature Notes.pdf',
            type: 'documents',
            size: '8.5 MB',
            uploaded_date: 'May 12, 2023',
            uploaded_by: 'Michael Brown',
            used_in_classes: ['class_2']
          },
          {
            id: 'resource_3',
            name: 'Historical Timeline.jpg',
            type: 'images',
            size: '4.3 MB',
            uploaded_date: 'May 15, 2023',
            uploaded_by: 'Sarah Davis',
            used_in_classes: ['class_3']
          },
          {
            id: 'resource_4',
            name: 'Physics Lecture.mp3',
            type: 'audio',
            size: '28.7 MB',
            uploaded_date: 'May 18, 2023',
            uploaded_by: 'James Wilson',
            used_in_classes: ['class_4']
          },
          {
            id: 'resource_5',
            name: 'Chemistry Formulas.pdf',
            type: 'documents',
            size: '6.2 MB',
            uploaded_date: 'May 20, 2023',
            uploaded_by: 'Jennifer Taylor',
            used_in_classes: []
          },
          {
            id: 'resource_6',
            name: 'Algebra Worksheet.pdf',
            type: 'documents',
            size: '2.1 MB',
            uploaded_date: 'May 22, 2023',
            uploaded_by: 'David Miller',
            used_in_classes: ['class_1']
          }
        ];
        
        setResources(dummyResources);
        
        // Set subscription usage based on plan
        const planLimits = {
          basic: { teachers: 5, students: 50, zoomMinutes: 500 },
          pro: { teachers: 15, students: 150, zoomMinutes: 1500 },
          enterprise: { teachers: 100, students: 1000, zoomMinutes: 5000 }
        };
        
        const plan = dummyAcademy.subscription_plan || 'basic';
        const limits = planLimits[plan];
        
        setSubscriptionUsage({
          teachers: { 
            used: dummyTeachers.filter(t => t.status === 'active').length, 
            total: limits.teachers 
          },
          students: { 
            used: dummyStudents.filter(s => s.status === 'active').length, 
            total: limits.students 
          },
          zoomMinutes: {
            used: 450, // Dummy value
            total: limits.zoomMinutes
          }
        });
        
        setLoading(false);
      }, 3000); // Simulate 3 seconds loading time
    };
    
    loadDummyData();
          
          // This code is now handled in the loadDummyData function above
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

  // Handle user approval/rejection with dummy data
  const handleUserAction = (user, action) => {
    try {
      const status = action === 'approve' ? 'active' : 'rejected';
      
      console.log(`Updating ${user.role} status to ${status}:`, user.id);
      
      // Simulate a successful update
      setTimeout(() => {
        // Remove the user from the pending list
        setPendingUsers(pendingUsers.filter(pendingUser => pendingUser.id !== user.id));
        
        // If approved, add the user to the appropriate list and increment the counter
        if (action === 'approve') {
          if (user.role === 'teacher') {
            // Create a new teacher object from the pending user data
            const newTeacher = {
              id: user.id,
              full_name: user.name,
              email: user.email,
              status: 'active',
              created_at: user.originalData.created_at,
              academy_id: user.originalData.academy_id,
              subject: user.originalData.subject || 'General',
              profile_image: null,
              students_assigned: 0,
              classes_count: 0,
              last_active: new Date().toISOString()
            };
            
            setTeachers(prev => [...prev, newTeacher]);
            setTeacherCount(prev => prev + 1);
          } else if (user.role === 'student') {
            // Create a new student object from the pending user data
            const newStudent = {
              id: user.id,
              full_name: user.name,
              email: user.email,
              status: 'active',
              created_at: user.originalData.created_at,
              academy_id: user.originalData.academy_id,
              grade: user.originalData.grade || 'Not specified',
              profile_image: null,
              assigned_teacher_id: null,
              assigned_teacher_name: null,
              last_active: new Date().toISOString()
            };
            
            setStudents(prev => [...prev, newStudent]);
            setStudentCount(prev => prev + 1);
          }
        }
        
        // Show a success message
        alert(`${user.role.charAt(0).toUpperCase() + user.role.slice(1)} ${action === 'approve' ? 'approved' : 'rejected'} successfully`);
      }, 500); // Simulate a delay for the operation
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
        <nav className="-mb-px flex space-x-6 overflow-x-auto pb-1">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center ${activeTab === 'overview' ? 'border-green-500 text-green-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
            onClick={() => setActiveTab('overview')}
          >
            <FaUsers className="mr-2" /> Academy Overview
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center ${activeTab === 'pending' ? 'border-green-500 text-green-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
            onClick={() => setActiveTab('pending')}
          >
            <FaUserGraduate className="mr-2" /> Pending Approvals
            {pendingUsers.length > 0 && (
              <span className="ml-2 bg-green-100 text-green-600 py-0.5 px-2 rounded-full text-xs">
                {pendingUsers.length}
              </span>
            )}
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center ${activeTab === 'teachers' ? 'border-green-500 text-green-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
            onClick={() => setActiveTab('teachers')}
          >
            <FaChalkboardTeacher className="mr-2" /> Teachers
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center ${activeTab === 'students' ? 'border-green-500 text-green-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
            onClick={() => setActiveTab('students')}
          >
            <FaUserGraduate className="mr-2" /> Students
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center ${activeTab === 'classes' ? 'border-green-500 text-green-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
            onClick={() => setActiveTab('classes')}
          >
            <FaCalendarAlt className="mr-2" /> Classes
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center ${activeTab === 'resources' ? 'border-green-500 text-green-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
            onClick={() => setActiveTab('resources')}
          >
            <FaFileUpload className="mr-2" /> Resources
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center ${activeTab === 'payments' ? 'border-green-500 text-green-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
            onClick={() => setActiveTab('payments')}
          >
            <FaCreditCard className="mr-2" /> Payments
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center ${activeTab === 'notifications' ? 'border-green-500 text-green-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
            onClick={() => setActiveTab('notifications')}
          >
            <FaBell className="mr-2" /> Notifications
            <span className="ml-2 bg-red-100 text-red-600 py-0.5 px-2 rounded-full text-xs">
              3
            </span>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center ${activeTab === 'settings' ? 'border-green-500 text-green-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
            onClick={() => setActiveTab('settings')}
          >
            <FaCog className="mr-2" /> Settings
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
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {/* Academy Header */}
              <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800">{academyData.name || 'My Academy'}</h2>
                    <div className="flex items-center mt-2">
                      <span className="text-sm bg-blue-100 text-blue-800 py-1 px-2 rounded-md font-medium">
                        ID: {academyData.id ? academyData.id.substring(0, 8) : 'ACD-2023'}
                      </span>
                      <span className="ml-3 text-sm text-gray-500">
                        Created: {new Date(academyData.created_at || Date.now()).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <div className="mt-4 md:mt-0">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors shadow-sm flex items-center"
                      onClick={() => setActiveTab('settings')}
                    >
                      <FaCog className="mr-2" />
                      Manage Academy
                    </motion.button>
                  </div>
                </div>
                <p className="text-gray-600 mt-4">{academyData.description || 'Welcome to your academy dashboard. Here you can manage all aspects of your educational institution.'}</p>
              </div>
              
              {/* Subscription Plan Card */}
              <motion.div
                className="bg-white rounded-lg shadow-md p-6 mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-800">Subscription Plan</h2>
                    <div className="mt-2">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${academyData.subscription_plan === 'enterprise' ? 'bg-purple-100 text-purple-800' : academyData.subscription_plan === 'pro' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}`}>
                        {academyData.subscription_plan ? academyData.subscription_plan.charAt(0).toUpperCase() + academyData.subscription_plan.slice(1) : 'Basic'} Plan
                      </span>
                    </div>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-green-50 text-green-600 px-4 py-2 rounded-md hover:bg-green-100 transition-colors"
                    onClick={() => window.location.href = '/academy/subscription'}
                  >
                    Upgrade Plan
                  </motion.button>
                </div>
                
                {/* Usage Stats */}
                <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Teachers Usage */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="text-sm font-medium text-gray-700">Teachers</h3>
                      <span className="text-xs text-gray-500">
                        {subscriptionUsage.teachers.used} / {subscriptionUsage.teachers.total}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div 
                        className={`h-2.5 rounded-full ${subscriptionUsage.teachers.used / subscriptionUsage.teachers.total > 0.8 ? 'bg-red-500' : 'bg-green-500'}`}
                        style={{ width: `${Math.min(100, (subscriptionUsage.teachers.used / subscriptionUsage.teachers.total) * 100)}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  {/* Students Usage */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="text-sm font-medium text-gray-700">Students</h3>
                      <span className="text-xs text-gray-500">
                        {subscriptionUsage.students.used} / {subscriptionUsage.students.total}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div 
                        className={`h-2.5 rounded-full ${subscriptionUsage.students.used / subscriptionUsage.students.total > 0.8 ? 'bg-red-500' : 'bg-green-500'}`}
                        style={{ width: `${Math.min(100, (subscriptionUsage.students.used / subscriptionUsage.students.total) * 100)}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  {/* Zoom Minutes Usage */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="text-sm font-medium text-gray-700">Zoom Minutes</h3>
                      <span className="text-xs text-gray-500">
                        {subscriptionUsage.zoomMinutes.used} / {subscriptionUsage.zoomMinutes.total}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div 
                        className={`h-2.5 rounded-full ${subscriptionUsage.zoomMinutes.used / subscriptionUsage.zoomMinutes.total > 0.8 ? 'bg-red-500' : 'bg-green-500'}`}
                        style={{ width: `${Math.min(100, (subscriptionUsage.zoomMinutes.used / subscriptionUsage.zoomMinutes.total) * 100)}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </motion.div>
              
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
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-800">Teachers</h3>
                    <div className="p-3 bg-blue-100 rounded-full">
                      <FaChalkboardTeacher className="h-6 w-6 text-blue-600" />
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-3xl font-bold text-gray-800">{teacherCount}</span>
                      <p className="text-gray-500 text-sm mt-1">Active teachers</p>
                    </div>
                    <button 
                      onClick={() => setActiveTab('teachers')}
                      className="text-blue-600 hover:text-blue-800 text-sm font-semibold"
                    >
                      Manage →
                    </button>
                  </div>
                </motion.div>

                <motion.div
                  className="bg-white rounded-lg shadow-md p-6"
                  variants={cardVariants}
                  whileHover="hover"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-800">Students</h3>
                    <div className="p-3 bg-green-100 rounded-full">
                      <FaUserGraduate className="h-6 w-6 text-green-600" />
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-3xl font-bold text-gray-800">{studentCount}</span>
                      <p className="text-gray-500 text-sm mt-1">Active students</p>
                    </div>
                    <button 
                      onClick={() => setActiveTab('students')}
                      className="text-green-600 hover:text-green-800 text-sm font-semibold"
                    >
                      Manage →
                    </button>
                  </div>
                </motion.div>

                <motion.div
                  className="bg-white rounded-lg shadow-md p-6"
                  variants={cardVariants}
                  whileHover="hover"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-800">Classes</h3>
                    <div className="p-3 bg-yellow-100 rounded-full">
                      <FaCalendarAlt className="h-6 w-6 text-yellow-600" />
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-3xl font-bold text-gray-800">{classes.length || 0}</span>
                      <p className="text-gray-500 text-sm mt-1">Total classes</p>
                    </div>
                    <button 
                      onClick={() => setActiveTab('classes')}
                      className="text-yellow-600 hover:text-yellow-800 text-sm font-semibold"
                    >
                      Manage →
                    </button>
                  </div>
                </motion.div>
              </motion.div>

              {/* Quick Actions */}
              <motion.div
                className="bg-white rounded-lg shadow-md p-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Quick Actions</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <motion.button
                    className="p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors flex flex-col items-center justify-center text-center"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setActiveTab('users')}
                  >
                    <FaUsers className="h-8 w-8 text-green-600 mb-2" />
                    <span className="font-medium text-gray-800">Manage Users</span>
                  </motion.button>
                  
                  <motion.button
                    className="p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors flex flex-col items-center justify-center text-center"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setActiveTab('classes')}
                  >
                    <FaCalendarAlt className="h-8 w-8 text-blue-600 mb-2" />
                    <span className="font-medium text-gray-800">Schedule Class</span>
                  </motion.button>
                  
                  <motion.button
                    className="p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors flex flex-col items-center justify-center text-center"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setActiveTab('resources')}
                  >
                    <FaFileUpload className="h-8 w-8 text-purple-600 mb-2" />
                    <span className="font-medium text-gray-800">Upload Resources</span>
                  </motion.button>
                  
                  <motion.button
                    className="p-4 bg-yellow-50 rounded-lg hover:bg-yellow-100 transition-colors flex flex-col items-center justify-center text-center"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setActiveTab('performance')}
                  >
                    <FaChartLine className="h-8 w-8 text-yellow-600 mb-2" />
                    <span className="font-medium text-gray-800">View Reports</span>
                  </motion.button>
                </div>
              </motion.div>
              
              {/* Pending Approvals Section */}
              {pendingUsers.length > 0 && (
                <motion.div
                  className="bg-white rounded-lg shadow-md p-6 mt-8"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold text-gray-800">Pending Approval Requests</h2>
                    <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                      {pendingUsers.length} Pending
                    </span>
                  </div>
                  <p className="text-gray-600 mb-4">You have {pendingUsers.length} users waiting for approval</p>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-yellow-100 text-yellow-800 px-4 py-2 rounded-md hover:bg-yellow-200 transition-colors"
                    onClick={() => setActiveTab('pending')}
                  >
                    Review Requests
                  </motion.button>
                </motion.div>
              )}
            </motion.div>
          ) : (
            <div className="mb-6 bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded">
              <p>No academy data found. Please create an academy to get started.</p>
            </div>
          )}
        </div>
      )}

      {/* User Management Tab Content */}
      {activeTab === 'users' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          {/* Sub-tabs for User Management */}
          <div className="bg-white rounded-lg shadow-md p-4">
            <div className="flex border-b">
              <button
                onClick={() => setActiveSubTab('all')}
                className={`px-4 py-2 font-medium text-sm ${activeSubTab === 'all' ? 'text-green-600 border-b-2 border-green-600' : 'text-gray-500 hover:text-gray-700'}`}
              >
                All Users
              </button>
              <button
                onClick={() => setActiveSubTab('teachers')}
                className={`px-4 py-2 font-medium text-sm ${activeSubTab === 'teachers' ? 'text-green-600 border-b-2 border-green-600' : 'text-gray-500 hover:text-gray-700'}`}
              >
                Teachers
              </button>
              <button
                onClick={() => setActiveSubTab('students')}
                className={`px-4 py-2 font-medium text-sm ${activeSubTab === 'students' ? 'text-green-600 border-b-2 border-green-600' : 'text-gray-500 hover:text-gray-700'}`}
              >
                Students
              </button>
              <button
                onClick={() => setActiveSubTab('pending')}
                className={`px-4 py-2 font-medium text-sm flex items-center ${activeSubTab === 'pending' ? 'text-green-600 border-b-2 border-green-600' : 'text-gray-500 hover:text-gray-700'}`}
              >
                Pending Requests
                {pendingUsers.length > 0 && (
                  <span className="ml-2 bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                    {pendingUsers.length}
                  </span>
                )}
              </button>
            </div>
          </div>
          
          {/* Search and Filter Controls */}
          <div className="bg-white rounded-lg shadow-md p-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaSearch className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-green-500 focus:border-green-500 sm:text-sm"
                  placeholder="Search by name or email"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <div className="flex gap-4">
                <select
                  className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-md"
                  value={filterRole}
                  onChange={(e) => setFilterRole(e.target.value)}
                >
                  <option value="all">All Roles</option>
                  <option value="teacher">Teachers</option>
                  <option value="student">Students</option>
                </select>
                
                <select
                  className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-md"
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="pending">Pending</option>
                  <option value="suspended">Suspended</option>
                </select>
                
                <button
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  onClick={() => {
                    setSearchQuery('');
                    setFilterRole('all');
                    setFilterStatus('all');
                  }}
                >
                  Reset
                </button>
              </div>
            </div>
          </div>
          
          {/* Pending Approvals Content */}
          {activeSubTab === 'pending' && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-800">Pending Approval Requests</h2>
                <div className="flex items-center">
                  <span className="text-sm text-gray-500 mr-2">{pendingUsers.length} pending requests</span>
                </div>
              </div>
              
              {pendingUsers.length > 0 ? (
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Name
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Email
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Role
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Requested On
                        </th>
                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {pendingUsers.map((user) => (
                        <tr key={user.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center">
                                <span className="text-gray-500 font-medium">{user.name ? user.name.charAt(0) : user.email.charAt(0).toUpperCase()}</span>
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">
                                  {user.name || 'No name provided'}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{user.email}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.role === 'teacher' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}`}>
                              {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {user.requestDate}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button 
                              onClick={() => handleUserAction(user, 'approve')}
                              className="text-green-600 hover:text-green-900 mr-4"
                            >
                              Approve
                            </button>
                            <button 
                              onClick={() => handleUserAction(user, 'reject')}
                              className="text-red-600 hover:text-red-900"
                            >
                              Reject
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="bg-white rounded-lg shadow-md p-6 text-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <h3 className="text-lg font-medium text-gray-900">No Pending Requests</h3>
                  <p className="mt-1 text-gray-500">There are no pending approval requests at this time.</p>
                </div>
              )}
            </div>
          )}
          
          {/* Teachers List Content */}
          {activeSubTab === 'teachers' && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-800">Teachers</h2>
                <button
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  <FaPlus className="mr-2" /> Add Teacher
                </button>
              </div>
              
              {teachers.length > 0 ? (
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                              onChange={(e) => {
                                const isChecked = e.target.checked;
                                setSelectedUsers(isChecked ? teachers.map(t => t.id) : []);
                              }}
                              checked={selectedUsers.length === teachers.length && teachers.length > 0}
                            />
                          </div>
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Name
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Email
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Students
                        </th>
                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {teachers.map((teacher) => (
                        <tr key={teacher.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <input
                                type="checkbox"
                                className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                                checked={selectedUsers.includes(teacher.id)}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setSelectedUsers([...selectedUsers, teacher.id]);
                                  } else {
                                    setSelectedUsers(selectedUsers.filter(id => id !== teacher.id));
                                  }
                                }}
                              />
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                                <FaChalkboardTeacher className="h-5 w-5 text-blue-600" />
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">
                                  {teacher.full_name || 'No name provided'}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{teacher.email}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                              Active
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {teacher.student_count || 0} students
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button 
                              onClick={() => {
                                setSelectedTeacher(teacher);
                                setAssignModalOpen(true);
                              }}
                              className="text-blue-600 hover:text-blue-900 mr-4"
                            >
                              Assign Students
                            </button>
                            <button className="text-red-600 hover:text-red-900">
                              Suspend
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="bg-white rounded-lg shadow-md p-6 text-center">
                  <FaChalkboardTeacher className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900">No Teachers Found</h3>
                  <p className="mt-1 text-gray-500">There are no teachers in your academy yet.</p>
                  <button
                    className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  >
                    <FaPlus className="mr-2" /> Add Teacher
                  </button>
                </div>
              )}
            </div>
          )}
          
          {/* Students List Content */}
          {activeSubTab === 'students' && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-800">Students</h2>
                <button
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  <FaPlus className="mr-2" /> Add Student
                </button>
              </div>
              
              {students.length > 0 ? (
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                              onChange={(e) => {
                                const isChecked = e.target.checked;
                                setSelectedUsers(isChecked ? students.map(s => s.id) : []);
                              }}
                              checked={selectedUsers.length === students.length && students.length > 0}
                            />
                          </div>
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Name
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Email
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Teacher
                        </th>
                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {students.map((student) => (
                        <tr key={student.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <input
                                type="checkbox"
                                className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                                checked={selectedUsers.includes(student.id)}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setSelectedUsers([...selectedUsers, student.id]);
                                  } else {
                                    setSelectedUsers(selectedUsers.filter(id => id !== student.id));
                                  }
                                }}
                              />
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10 bg-green-100 rounded-full flex items-center justify-center">
                                <FaUserGraduate className="h-5 w-5 text-green-600" />
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">
                                  {student.full_name || 'No name provided'}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{student.email}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                              Active
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {student.teacher_name || 'Not assigned'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button className="text-blue-600 hover:text-blue-900 mr-4">
                              Assign Teacher
                            </button>
                            <button className="text-red-600 hover:text-red-900">
                              Suspend
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="bg-white rounded-lg shadow-md p-6 text-center">
                  <FaUserGraduate className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900">No Students Found</h3>
                  <p className="mt-1 text-gray-500">There are no students in your academy yet.</p>
                  <button
                    className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  >
                    <FaPlus className="mr-2" /> Add Student
                  </button>
                </div>
              )}
            </div>
          )}
        </motion.div>
      )}
      
      {/* Pending Approvals Tab Content */}
      {activeTab === 'pending' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Pending Approval Requests</h2>
          
          {pendingUsers.length > 0 ? (
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Role
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Requested On
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {pendingUsers.map((user) => (
                    <tr key={user.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center">
                            <span className="text-gray-500 font-medium">{user.name ? user.name.charAt(0) : user.email.charAt(0).toUpperCase()}</span>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {user.name || 'No name provided'}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{user.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.role === 'teacher' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}`}>
                          {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {user.requestDate}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button 
                          onClick={() => handleUserAction(user, 'approve')}
                          className="text-green-600 hover:text-green-900 mr-4"
                        >
                          Approve
                        </button>
                        <button 
                          onClick={() => handleUserAction(user, 'reject')}
                          className="text-red-600 hover:text-red-900"
                        >
                          Reject
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="text-lg font-medium text-gray-900">No Pending Requests</h3>
              <p className="mt-1 text-gray-500">There are no pending approval requests at this time.</p>
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
      
      {/* Class Management Tab Content */}
      {activeTab === 'classes' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          {/* Sub-tabs for Class Management */}
          <div className="bg-white rounded-lg shadow-md p-4">
            <div className="flex border-b">
              <button
                onClick={() => setActiveSubTab('upcoming')}
                className={`px-4 py-2 font-medium text-sm ${activeSubTab === 'upcoming' ? 'text-green-600 border-b-2 border-green-600' : 'text-gray-500 hover:text-gray-700'}`}
              >
                Upcoming Classes
              </button>
              <button
                onClick={() => setActiveSubTab('ongoing')}
                className={`px-4 py-2 font-medium text-sm flex items-center ${activeSubTab === 'ongoing' ? 'text-green-600 border-b-2 border-green-600' : 'text-gray-500 hover:text-gray-700'}`}
              >
                Ongoing Classes
                {classes.filter(c => c.status === 'ongoing').length > 0 && (
                  <span className="ml-2 bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                    Live
                  </span>
                )}
              </button>
              <button
                onClick={() => setActiveSubTab('past')}
                className={`px-4 py-2 font-medium text-sm ${activeSubTab === 'past' ? 'text-green-600 border-b-2 border-green-600' : 'text-gray-500 hover:text-gray-700'}`}
              >
                Past Classes
              </button>
              <button
                onClick={() => setActiveSubTab('attendance')}
                className={`px-4 py-2 font-medium text-sm ${activeSubTab === 'attendance' ? 'text-green-600 border-b-2 border-green-600' : 'text-gray-500 hover:text-gray-700'}`}
              >
                Attendance Reports
              </button>
            </div>
          </div>
          
          {/* Create Class Button */}
          <div className="flex justify-end">
            <button
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              <FaPlus className="mr-2" /> Schedule New Class
            </button>
          </div>
          
          {/* Upcoming Classes Content */}
          {activeSubTab === 'upcoming' && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-800">Upcoming Classes</h2>
                <div className="flex items-center">
                  <div className="relative mr-4">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaSearch className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-green-500 focus:border-green-500 sm:text-sm"
                      placeholder="Search classes"
                    />
                  </div>
                  <select
                    className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-md"
                  >
                    <option>All Teachers</option>
                    {teachers.map(teacher => (
                      <option key={teacher.id} value={teacher.id}>{teacher.full_name}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              {classes.filter(c => c.status === 'upcoming').length > 0 ? (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {classes.filter(c => c.status === 'upcoming').map((classItem) => (
                    <div key={classItem.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                      <div className="p-4 bg-green-50 border-b border-green-100 flex justify-between items-center">
                        <div>
                          <h3 className="text-lg font-medium text-gray-900">{classItem.title}</h3>
                          <p className="text-sm text-gray-500">{classItem.subject}</p>
                        </div>
                        <div className="flex">
                          <button className="text-gray-400 hover:text-gray-500 mr-2">
                            <FaEdit className="h-5 w-5" />
                          </button>
                          <button className="text-gray-400 hover:text-gray-500">
                            <FaTrash className="h-5 w-5" />
                          </button>
                        </div>
                      </div>
                      <div className="p-4">
                        <div className="flex items-center mb-3">
                          <FaCalendarAlt className="h-5 w-5 text-gray-400 mr-2" />
                          <span className="text-sm text-gray-600">{new Date(classItem.date).toLocaleDateString()} at {classItem.time}</span>
                        </div>
                        <div className="flex items-center mb-3">
                          <FaClock className="h-5 w-5 text-gray-400 mr-2" />
                          <span className="text-sm text-gray-600">{classItem.duration} minutes</span>
                        </div>
                        <div className="flex items-center mb-3">
                          <FaChalkboardTeacher className="h-5 w-5 text-gray-400 mr-2" />
                          <span className="text-sm text-gray-600">{classItem.teacher_name}</span>
                        </div>
                        <div className="flex items-center mb-3">
                          <FaUsers className="h-5 w-5 text-gray-400 mr-2" />
                          <span className="text-sm text-gray-600">{classItem.students_count} students enrolled</span>
                        </div>
                        <div className="mt-4 flex justify-between">
                          <button className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                            <FaLink className="mr-1.5" /> Zoom Link
                          </button>
                          <button className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                            <FaEye className="mr-1.5" /> Details
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-lg shadow-md p-6 text-center">
                  <FaCalendarAlt className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900">No Upcoming Classes</h3>
                  <p className="mt-1 text-gray-500">There are no upcoming classes scheduled at this time.</p>
                  <button
                    className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  >
                    <FaPlus className="mr-2" /> Schedule New Class
                  </button>
                </div>
              )}
            </div>
          )}
          
          {/* Ongoing Classes Content */}
          {activeSubTab === 'ongoing' && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-800">Ongoing Classes</h2>
                <div className="flex items-center">
                  <span className="text-sm text-gray-500 mr-2">{classes.filter(c => c.status === 'ongoing').length} active classes</span>
                </div>
              </div>
              
              {classes.filter(c => c.status === 'ongoing').length > 0 ? (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {classes.filter(c => c.status === 'ongoing').map((classItem) => (
                    <div key={classItem.id} className="bg-white rounded-lg shadow-md overflow-hidden border-2 border-red-400">
                      <div className="p-4 bg-red-50 border-b border-red-100 flex justify-between items-center">
                        <div>
                          <div className="flex items-center">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 mr-2">
                              <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-red-400 opacity-75 mr-1"></span>
                              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500 mr-1"></span>
                              LIVE
                            </span>
                            <h3 className="text-lg font-medium text-gray-900">{classItem.title}</h3>
                          </div>
                          <p className="text-sm text-gray-500">{classItem.subject}</p>
                        </div>
                        <div className="flex">
                          <span className="text-sm text-gray-500">
                            Started {classItem.started_ago} ago
                          </span>
                        </div>
                      </div>
                      <div className="p-4">
                        <div className="flex items-center mb-3">
                          <FaChalkboardTeacher className="h-5 w-5 text-gray-400 mr-2" />
                          <span className="text-sm text-gray-600">{classItem.teacher_name}</span>
                        </div>
                        <div className="flex items-center mb-3">
                          <FaUsers className="h-5 w-5 text-gray-400 mr-2" />
                          <span className="text-sm text-gray-600">{classItem.students_present} / {classItem.students_count} students present</span>
                        </div>
                        <div className="mt-4 flex justify-between">
                          <button className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
                            <FaVideo className="mr-1.5" /> Join Silently
                          </button>
                          <button className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                            <FaEye className="mr-1.5" /> View Details
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-lg shadow-md p-6 text-center">
                  <FaVideo className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900">No Ongoing Classes</h3>
                  <p className="mt-1 text-gray-500">There are no classes currently in session.</p>
                </div>
              )}
            </div>
          )}
          
          {/* Past Classes Content */}
          {activeSubTab === 'past' && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-800">Past Classes</h2>
                <div className="flex items-center space-x-2">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaSearch className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-green-500 focus:border-green-500 sm:text-sm"
                      placeholder="Search past classes"
                    />
                  </div>
                  <select
                    className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-md"
                  >
                    <option>Last 30 days</option>
                    <option>Last 90 days</option>
                    <option>All time</option>
                  </select>
                </div>
              </div>
              
              {classes.filter(c => c.status === 'completed').length > 0 ? (
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Class
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Teacher
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date & Time
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Duration
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Attendance
                        </th>
                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {classes.filter(c => c.status === 'completed').map((classItem) => (
                        <tr key={classItem.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10 bg-gray-100 rounded-full flex items-center justify-center">
                                <FaBook className="h-5 w-5 text-gray-500" />
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">{classItem.title}</div>
                                <div className="text-sm text-gray-500">{classItem.subject}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{classItem.teacher_name}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{new Date(classItem.date).toLocaleDateString()}</div>
                            <div className="text-sm text-gray-500">{classItem.time}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {classItem.actual_duration || classItem.duration} minutes
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{classItem.students_present} / {classItem.students_count}</div>
                            <div className="text-sm text-gray-500">{Math.round((classItem.students_present / classItem.students_count) * 100)}% attendance</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button className="text-blue-600 hover:text-blue-900 mr-4">
                              View Recording
                            </button>
                            <button className="text-green-600 hover:text-green-900">
                              Attendance Report
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="bg-white rounded-lg shadow-md p-6 text-center">
                  <FaHistory className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900">No Past Classes</h3>
                  <p className="mt-1 text-gray-500">There are no completed classes in the selected time period.</p>
                </div>
              )}
            </div>
          )}
          
          {/* Attendance Reports Content */}
          {activeSubTab === 'attendance' && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-800">Attendance Reports</h2>
                <div className="flex items-center space-x-2">
                  <select
                    className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-md"
                  >
                    <option>By Class</option>
                    <option>By Student</option>
                    <option>By Teacher</option>
                  </select>
                  <select
                    className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-md"
                  >
                    <option>Last 30 days</option>
                    <option>Last 90 days</option>
                    <option>All time</option>
                  </select>
                  <button
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  >
                    <FaDownload className="mr-2" /> Export
                  </button>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  <div className="bg-green-50 rounded-lg p-4 border border-green-100">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Overall Attendance</h3>
                    <div className="text-3xl font-bold text-green-600">87%</div>
                    <p className="text-sm text-gray-500 mt-1">Average across all classes</p>
                  </div>
                  <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Total Classes</h3>
                    <div className="text-3xl font-bold text-blue-600">{classes.filter(c => c.status === 'completed').length}</div>
                    <p className="text-sm text-gray-500 mt-1">Completed classes</p>
                  </div>
                  <div className="bg-purple-50 rounded-lg p-4 border border-purple-100">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Perfect Attendance</h3>
                    <div className="text-3xl font-bold text-purple-600">12</div>
                    <p className="text-sm text-gray-500 mt-1">Students with 100% attendance</p>
                  </div>
                </div>
                
                <div className="mt-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Attendance by Class</h3>
                  <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                    <table className="min-w-full divide-y divide-gray-300">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Class</th>
                          <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Date</th>
                          <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Teacher</th>
                          <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Attendance Rate</th>
                          <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                            <span className="sr-only">View</span>
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 bg-white">
                        {classes.filter(c => c.status === 'completed').slice(0, 5).map((classItem) => (
                          <tr key={classItem.id}>
                            <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">{classItem.title}</td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{new Date(classItem.date).toLocaleDateString()}</td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{classItem.teacher_name}</td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                              <div className="flex items-center">
                                <div className="w-full bg-gray-200 rounded-full h-2.5 mr-2">
                                  <div className="bg-green-600 h-2.5 rounded-full" style={{ width: `${Math.round((classItem.students_present / classItem.students_count) * 100)}%` }}></div>
                                </div>
                                <span>{Math.round((classItem.students_present / classItem.students_count) * 100)}%</span>
                              </div>
                            </td>
                            <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                              <a href="#" className="text-green-600 hover:text-green-900">View details</a>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}
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
      
      {/* Resources Tab Content */}
      {activeTab === 'resources' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          {/* Sub-tabs for Resources */}
          <div className="bg-white rounded-lg shadow-md p-4">
            <div className="flex border-b">
              <button
                onClick={() => setActiveSubTab('all')}
                className={`px-4 py-2 font-medium text-sm ${activeSubTab === 'all' ? 'text-green-600 border-b-2 border-green-600' : 'text-gray-500 hover:text-gray-700'}`}
              >
                All Resources
              </button>
              <button
                onClick={() => setActiveSubTab('documents')}
                className={`px-4 py-2 font-medium text-sm ${activeSubTab === 'documents' ? 'text-green-600 border-b-2 border-green-600' : 'text-gray-500 hover:text-gray-700'}`}
              >
                Documents
              </button>
              <button
                onClick={() => setActiveSubTab('images')}
                className={`px-4 py-2 font-medium text-sm ${activeSubTab === 'images' ? 'text-green-600 border-b-2 border-green-600' : 'text-gray-500 hover:text-gray-700'}`}
              >
                Images
              </button>
              <button
                onClick={() => setActiveSubTab('audio')}
                className={`px-4 py-2 font-medium text-sm ${activeSubTab === 'audio' ? 'text-green-600 border-b-2 border-green-600' : 'text-gray-500 hover:text-gray-700'}`}
              >
                Audio
              </button>
              <button
                onClick={() => setActiveSubTab('video')}
                className={`px-4 py-2 font-medium text-sm ${activeSubTab === 'video' ? 'text-green-600 border-b-2 border-green-600' : 'text-gray-500 hover:text-gray-700'}`}
              >
                Video
              </button>
              <button
                onClick={() => setActiveSubTab('other')}
                className={`px-4 py-2 font-medium text-sm ${activeSubTab === 'other' ? 'text-green-600 border-b-2 border-green-600' : 'text-gray-500 hover:text-gray-700'}`}
              >
                Other
              </button>
            </div>
          </div>
          
          {/* Upload Resource Button */}
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <div className="relative mr-4">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaSearch className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-green-500 focus:border-green-500 sm:text-sm"
                  placeholder="Search resources"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <select
                className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-md"
              >
                <option>All Classes</option>
                {classes.map(classItem => (
                  <option key={classItem.id} value={classItem.id}>{classItem.title}</option>
                ))}
              </select>
            </div>
            <button
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              <FaUpload className="mr-2" /> Upload Resource
            </button>
          </div>
          
          {/* Resources Grid */}
          {resources.length > 0 ? (
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
                {resources
                  .filter(resource => {
                    // Filter by sub-tab
                    if (activeSubTab !== 'all' && resource.type !== activeSubTab) return false;
                    // Filter by search query
                    if (searchQuery && !resource.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
                    return true;
                  })
                  .map((resource) => (
                    <div key={resource.id} className="border rounded-lg overflow-hidden bg-white hover:shadow-md transition-shadow duration-200">
                      <div className="p-4 flex items-start space-x-4">
                        <div className="flex-shrink-0 h-12 w-12 bg-gray-100 rounded-lg flex items-center justify-center">
                          {resource.type === 'documents' && <FaFilePdf className="h-6 w-6 text-red-500" />}
                          {resource.type === 'images' && <FaImage className="h-6 w-6 text-blue-500" />}
                          {resource.type === 'audio' && <FaMusic className="h-6 w-6 text-purple-500" />}
                          {resource.type === 'other' && <FaFile className="h-6 w-6 text-gray-500" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-medium text-gray-900 truncate">{resource.name}</h3>
                          <p className="text-xs text-gray-500">{resource.size} • Uploaded {resource.uploaded_date}</p>
                          <div className="mt-2 flex items-center text-xs text-gray-500">
                            <FaChalkboardTeacher className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                            <span>Used in {resource.used_in_classes.length} classes</span>
                          </div>
                        </div>
                        <div className="flex-shrink-0 self-start">
                          <div className="relative inline-block text-left">
                            <button className="text-gray-400 hover:text-gray-500">
                              <FaEllipsisV className="h-5 w-5" />
                            </button>
                          </div>
                        </div>
                      </div>
                      <div className="border-t border-gray-200 bg-gray-50 px-4 py-3 sm:px-6 flex justify-between items-center">
                        <div className="flex space-x-2">
                          <button className="inline-flex items-center px-2.5 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                            <FaDownload className="mr-1.5 h-3 w-3" /> Download
                          </button>
                          <button className="inline-flex items-center px-2.5 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                            <FaEdit className="mr-1.5 h-3 w-3" /> Edit
                          </button>
                        </div>
                        <button className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
                          <FaTrash className="mr-1.5 h-3 w-3" /> Delete
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <FaFolder className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900">No Resources Found</h3>
              <p className="mt-1 text-gray-500">Upload your first resource to get started.</p>
              <button
                className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                <FaUpload className="mr-2" /> Upload Resource
              </button>
            </div>
          )}
          
          {/* Resource Usage Stats */}
          {resources.length > 0 && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Resource Usage Statistics</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Most Used Resource</h4>
                  <div className="text-xl font-bold text-blue-600">{resources.sort((a, b) => b.used_in_classes.length - a.used_in_classes.length)[0]?.name || 'N/A'}</div>
                  <p className="text-xs text-gray-500 mt-1">Used in {resources.sort((a, b) => b.used_in_classes.length - a.used_in_classes.length)[0]?.used_in_classes.length || 0} classes</p>
                </div>
                <div className="bg-green-50 rounded-lg p-4 border border-green-100">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Total Storage Used</h4>
                  <div className="text-xl font-bold text-green-600">256 MB</div>
                  <p className="text-xs text-gray-500 mt-1">Out of 5 GB (5.12%)</p>
                </div>
                <div className="bg-purple-50 rounded-lg p-4 border border-purple-100">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Resource Types</h4>
                  <div className="flex justify-between items-center">
                    <div className="text-xs">
                      <div className="flex items-center">
                        <span className="h-2 w-2 bg-red-500 rounded-full mr-1"></span>
                        <span>Documents: {resources.filter(r => r.type === 'documents').length}</span>
                      </div>
                      <div className="flex items-center mt-1">
                        <span className="h-2 w-2 bg-blue-500 rounded-full mr-1"></span>
                        <span>Images: {resources.filter(r => r.type === 'images').length}</span>
                      </div>
                      <div className="flex items-center mt-1">
                        <span className="h-2 w-2 bg-purple-500 rounded-full mr-1"></span>
                        <span>Audio: {resources.filter(r => r.type === 'audio').length}</span>
                      </div>
                      <div className="flex items-center mt-1">
                        <span className="h-2 w-2 bg-gray-500 rounded-full mr-1"></span>
                        <span>Other: {resources.filter(r => r.type === 'other').length}</span>
                      </div>
                    </div>
                    <div className="h-16 w-16">
                      {/* Placeholder for a pie chart */}
                      <div className="h-full w-full rounded-full bg-gray-200 flex items-center justify-center text-xs text-gray-500">
                        Chart
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      )}

      {/* Communications Tab Content */}
      {activeTab === 'communications' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          {/* Sub-tabs for Communications */}
          <div className="bg-white rounded-lg shadow-md p-4">
            <div className="flex border-b">
              <button
                onClick={() => setActiveSubTab('chat_logs')}
                className={`px-4 py-2 font-medium text-sm ${activeSubTab === 'chat_logs' ? 'text-green-600 border-b-2 border-green-600' : 'text-gray-500 hover:text-gray-700'}`}
              >
                <FaComments className="inline mr-1" /> Chat Logs
              </button>
              <button
                onClick={() => setActiveSubTab('notifications')}
                className={`px-4 py-2 font-medium text-sm ${activeSubTab === 'notifications' ? 'text-green-600 border-b-2 border-green-600' : 'text-gray-500 hover:text-gray-700'}`}
              >
                <FaBell className="inline mr-1" /> Notifications
              </button>
              <button
                onClick={() => setActiveSubTab('announcements')}
                className={`px-4 py-2 font-medium text-sm ${activeSubTab === 'announcements' ? 'text-green-600 border-b-2 border-green-600' : 'text-gray-500 hover:text-gray-700'}`}
              >
                <FaBullhorn className="inline mr-1" /> Announcements
              </button>
              <button
                onClick={() => setActiveSubTab('comm_settings')}
                className={`px-4 py-2 font-medium text-sm ${activeSubTab === 'comm_settings' ? 'text-green-600 border-b-2 border-green-600' : 'text-gray-500 hover:text-gray-700'}`}
              >
                <FaCog className="inline mr-1" /> Communication Settings
              </button>
            </div>
          </div>
          
          {/* Chat Logs Content */}
          {activeSubTab === 'chat_logs' && (
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900">Chat Logs</h3>
                <div className="flex items-center space-x-2">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaSearch className="h-4 w-4 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500 sm:text-sm"
                      placeholder="Search chats"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <select
                    className="block pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-md"
                  >
                    <option>All Users</option>
                    <option>Teachers Only</option>
                    <option>Students Only</option>
                  </select>
                  <button
                    className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  >
                    <FaCalendarAlt className="mr-2 h-4 w-4" /> Filter by Date
                  </button>
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Participants</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Message</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date & Time</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {/* Sample chat logs - in a real app, these would come from your state/database */}
                    {[1, 2, 3].map((chat) => (
                      <tr key={chat} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-8 w-8 rounded-full bg-gray-200"></div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">Teacher Name & Student Name</div>
                              <div className="text-xs text-gray-500">Math Class</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900 truncate max-w-xs">Lorem ipsum dolor sit amet, consectetur adipiscing elit...</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Today, 2:30 PM</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Active</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button className="text-green-600 hover:text-green-900 mr-3">View</button>
                          <button className="text-red-600 hover:text-red-900">Archive</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div className="bg-gray-50 px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                <div className="flex-1 flex justify-between sm:hidden">
                  <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">Previous</button>
                  <button className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">Next</button>
                </div>
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-700">
                      Showing <span className="font-medium">1</span> to <span className="font-medium">10</span> of{' '}
                      <span className="font-medium">20</span> results
                    </p>
                  </div>
                  <div>
                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                      <button className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                        <span className="sr-only">Previous</span>
                        <FaChevronLeft className="h-5 w-5" aria-hidden="true" />
                      </button>
                      <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">1</button>
                      <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">2</button>
                      <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">3</button>
                      <button className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                        <span className="sr-only">Next</span>
                        <FaChevronRight className="h-5 w-5" aria-hidden="true" />
                      </button>
                    </nav>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Notifications Content */}
          {activeSubTab === 'notifications' && (
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900">Notifications</h3>
                <div className="flex items-center space-x-2">
                  <button className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                    <FaCheck className="mr-2 h-4 w-4" /> Mark All as Read
                  </button>
                  <button className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                    <FaPlus className="mr-2 h-4 w-4" /> Create Notification
                  </button>
                </div>
              </div>
              
              <div className="divide-y divide-gray-200">
                {/* Sample notifications - in a real app, these would come from your state/database */}
                {[1, 2, 3, 4, 5].map((notification) => (
                  <div key={notification} className="p-4 hover:bg-gray-50 flex items-start">
                    <div className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center ${notification % 2 === 0 ? 'bg-blue-100 text-blue-600' : 'bg-yellow-100 text-yellow-600'}`}>
                      {notification % 2 === 0 ? <FaInfo /> : <FaBell />}
                    </div>
                    <div className="ml-4 flex-1">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-gray-900">Notification Title {notification}</p>
                        <p className="text-xs text-gray-500">2 hours ago</p>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
                      <div className="mt-2 flex">
                        <button className="text-xs text-green-600 hover:text-green-800 font-medium">Mark as Read</button>
                        <span className="text-gray-300 mx-2">|</span>
                        <button className="text-xs text-gray-600 hover:text-gray-800 font-medium">View Details</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="bg-gray-50 px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                <div>
                  <p className="text-sm text-gray-700">
                    Showing <span className="font-medium">1</span> to <span className="font-medium">5</span> of{' '}
                    <span className="font-medium">20</span> notifications
                  </p>
                </div>
                <div>
                  <button className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                    Load More
                  </button>
                </div>
              </div>
            </div>
          )}
          
          {/* Announcements Content */}
          {activeSubTab === 'announcements' && (
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900">Announcements</h3>
                <button className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                  <FaPlus className="mr-2 h-4 w-4" /> Create Announcement
                </button>
              </div>
              
              <div className="divide-y divide-gray-200">
                {/* Sample announcements - in a real app, these would come from your state/database */}
                {[1, 2, 3].map((announcement) => (
                  <div key={announcement} className="p-6 hover:bg-gray-50">
                    <div className="flex items-center justify-between">
                      <h4 className="text-lg font-medium text-gray-900">Important Announcement {announcement}</h4>
                      <div className="flex items-center space-x-2">
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">Active</span>
                        <div className="relative inline-block text-left">
                          <button className="text-gray-400 hover:text-gray-500">
                            <FaEllipsisV className="h-5 w-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                    <p className="mt-2 text-sm text-gray-500">Posted by Admin • {announcement} day{announcement !== 1 ? 's' : ''} ago</p>
                    <div className="mt-4 text-sm text-gray-700">
                      <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
                    </div>
                    <div className="mt-4 flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center">
                          <FaEye className="h-4 w-4 text-gray-400 mr-1" />
                          <span className="text-xs text-gray-500">Seen by 45 users</span>
                        </div>
                        <div className="flex items-center">
                          <FaUsers className="h-4 w-4 text-gray-400 mr-1" />
                          <span className="text-xs text-gray-500">All Users</span>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button className="inline-flex items-center px-2.5 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                          <FaEdit className="mr-1.5 h-3 w-3" /> Edit
                        </button>
                        <button className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
                          <FaArchive className="mr-1.5 h-3 w-3" /> Archive
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Empty state */}
              {false && (
                <div className="p-12 text-center">
                  <FaBullhorn className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900">No Announcements</h3>
                  <p className="mt-1 text-gray-500">Create your first announcement to notify your users.</p>
                  <button className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                    <FaPlus className="mr-2" /> Create Announcement
                  </button>
                </div>
              )}
            </div>
          )}
          
          {/* Communication Settings Content */}
          {activeSubTab === 'comm_settings' && (
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Communication Settings</h3>
                <p className="mt-1 text-sm text-gray-500">Configure how communications work in your academy</p>
              </div>
              
              <div className="p-6 space-y-6">
                {/* Notification Settings */}
                <div>
                  <h4 className="text-base font-medium text-gray-900 mb-4">Notification Settings</h4>
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          id="email_notifications"
                          name="email_notifications"
                          type="checkbox"
                          className="focus:ring-green-500 h-4 w-4 text-green-600 border-gray-300 rounded"
                          defaultChecked
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor="email_notifications" className="font-medium text-gray-700">Email Notifications</label>
                        <p className="text-gray-500">Receive email notifications for important updates</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          id="in_app_notifications"
                          name="in_app_notifications"
                          type="checkbox"
                          className="focus:ring-green-500 h-4 w-4 text-green-600 border-gray-300 rounded"
                          defaultChecked
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor="in_app_notifications" className="font-medium text-gray-700">In-App Notifications</label>
                        <p className="text-gray-500">Receive notifications within the application</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          id="announcement_notifications"
                          name="announcement_notifications"
                          type="checkbox"
                          className="focus:ring-green-500 h-4 w-4 text-green-600 border-gray-300 rounded"
                          defaultChecked
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor="announcement_notifications" className="font-medium text-gray-700">Announcement Notifications</label>
                        <p className="text-gray-500">Receive notifications for new announcements</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Chat Settings */}
                <div className="pt-6 border-t border-gray-200">
                  <h4 className="text-base font-medium text-gray-900 mb-4">Chat Settings</h4>
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="default_chat_visibility" className="block text-sm font-medium text-gray-700">Default Chat Visibility</label>
                      <select
                        id="default_chat_visibility"
                        name="default_chat_visibility"
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-md"
                        defaultValue="all_participants"
                      >
                        <option value="all_participants">All Participants</option>
                        <option value="teachers_only">Teachers Only</option>
                        <option value="admins_only">Admins Only</option>
                      </select>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          id="enable_file_sharing"
                          name="enable_file_sharing"
                          type="checkbox"
                          className="focus:ring-green-500 h-4 w-4 text-green-600 border-gray-300 rounded"
                          defaultChecked
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor="enable_file_sharing" className="font-medium text-gray-700">Enable File Sharing in Chat</label>
                        <p className="text-gray-500">Allow users to share files in chat conversations</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          id="chat_moderation"
                          name="chat_moderation"
                          type="checkbox"
                          className="focus:ring-green-500 h-4 w-4 text-green-600 border-gray-300 rounded"
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor="chat_moderation" className="font-medium text-gray-700">Enable Chat Moderation</label>
                        <p className="text-gray-500">Automatically filter inappropriate content in chats</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Announcement Settings */}
                <div className="pt-6 border-t border-gray-200">
                  <h4 className="text-base font-medium text-gray-900 mb-4">Announcement Settings</h4>
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="announcement_approval" className="block text-sm font-medium text-gray-700">Announcement Approval</label>
                      <select
                        id="announcement_approval"
                        name="announcement_approval"
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-md"
                        defaultValue="admin_only"
                      >
                        <option value="admin_only">Admin Only</option>
                        <option value="teachers_can_create">Teachers Can Create</option>
                        <option value="teachers_with_approval">Teachers with Admin Approval</option>
                      </select>
                    </div>
                    
                    <div>
                      <label htmlFor="announcement_expiry" className="block text-sm font-medium text-gray-700">Default Announcement Expiry</label>
                      <select
                        id="announcement_expiry"
                        name="announcement_expiry"
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-md"
                        defaultValue="30_days"
                      >
                        <option value="never">Never</option>
                        <option value="7_days">7 Days</option>
                        <option value="30_days">30 Days</option>
                        <option value="90_days">90 Days</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
                <button
                  type="submit"
                  className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  Save Settings
                </button>
              </div>
            </div>
          )}
        </motion.div>
      )}

      {/* Performance Tab Content */}
      {activeTab === 'performance' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Performance Analytics</h3>
            <p className="text-gray-600 mb-6">Track student and teacher performance metrics</p>
            
            {/* Performance Dashboard Placeholder */}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
              <FaChartLine className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900">Performance Dashboard</h3>
              <p className="mt-1 text-gray-500">Performance analytics will be available here</p>
              <button className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                <FaCog className="mr-2" /> Configure Analytics
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Payments Tab Content */}
      {activeTab === 'payments' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Payment Management</h3>
            <p className="text-gray-600 mb-6">Manage subscription and payment information</p>
            
            {/* Payment Dashboard Placeholder */}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
              <FaCreditCard className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900">Payment Dashboard</h3>
              <p className="mt-1 text-gray-500">Payment management will be available here</p>
              <button className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                <FaCog className="mr-2" /> Configure Payments
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Notifications Tab Content */}
      {activeTab === 'notifications' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          {/* Sub-tabs for Notifications */}
          <div className="bg-white rounded-lg shadow-md p-4">
            <div className="flex border-b overflow-x-auto">
              <button
                onClick={() => setActiveSubTab('all-notifications')}
                className={`px-4 py-2 font-medium text-sm whitespace-nowrap ${activeSubTab === 'all-notifications' ? 'text-green-600 border-b-2 border-green-600' : 'text-gray-500 hover:text-gray-700'}`}
              >
                <FaInbox className="inline mr-1" /> All Notifications
              </button>
              <button
                onClick={() => setActiveSubTab('unread')}
                className={`px-4 py-2 font-medium text-sm whitespace-nowrap ${activeSubTab === 'unread' ? 'text-green-600 border-b-2 border-green-600' : 'text-gray-500 hover:text-gray-700'}`}
              >
                <FaEnvelope className="inline mr-1" /> Unread
                <span className="ml-2 bg-red-100 text-red-600 py-0.5 px-2 rounded-full text-xs">
                  3
                </span>
              </button>
              <button
                onClick={() => setActiveSubTab('system')}
                className={`px-4 py-2 font-medium text-sm whitespace-nowrap ${activeSubTab === 'system' ? 'text-green-600 border-b-2 border-green-600' : 'text-gray-500 hover:text-gray-700'}`}
              >
                <FaCog className="inline mr-1" /> System
              </button>
              <button
                onClick={() => setActiveSubTab('announcements')}
                className={`px-4 py-2 font-medium text-sm whitespace-nowrap ${activeSubTab === 'announcements' ? 'text-green-600 border-b-2 border-green-600' : 'text-gray-500 hover:text-gray-700'}`}
              >
                <FaBullhorn className="inline mr-1" /> Announcements
              </button>
              <button
                onClick={() => setActiveSubTab('notification-settings')}
                className={`px-4 py-2 font-medium text-sm whitespace-nowrap ${activeSubTab === 'notification-settings' ? 'text-green-600 border-b-2 border-green-600' : 'text-gray-500 hover:text-gray-700'}`}
              >
                <FaWrench className="inline mr-1" /> Settings
              </button>
            </div>
          </div>

          {/* All Notifications Content */}
          {(activeSubTab === 'all-notifications' || !activeSubTab) && (
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">All Notifications</h3>
                  <p className="mt-1 text-sm text-gray-500">View and manage all your notifications</p>
                </div>
                <div className="flex space-x-2">
                  <button className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                    <FaCheck className="mr-1.5 text-green-500" /> Mark All as Read
                  </button>
                  <div className="relative">
                    <button className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                      <FaFilter className="mr-1.5" /> Filter
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="divide-y divide-gray-200">
                {/* Unread Notification */}
                <div className="p-4 bg-blue-50 hover:bg-blue-100 transition-colors duration-150">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 pt-0.5">
                      <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                        <FaUserPlus className="h-5 w-5 text-green-600" />
                      </div>
                    </div>
                    <div className="ml-3 flex-1">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-gray-900">New Student Registration</p>
                        <p className="text-xs text-gray-500">2 hours ago</p>
                      </div>
                      <div className="mt-1">
                        <p className="text-sm text-gray-600">John Doe has registered as a new student in your academy. Review their application now.</p>
                      </div>
                      <div className="mt-2 flex space-x-2">
                        <button className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-green-700 bg-green-100 hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                          <FaCheck className="mr-1" /> Mark as Read
                        </button>
                        <button className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                          <FaEye className="mr-1" /> View Details
                        </button>
                      </div>
                    </div>
                    <div className="ml-2 flex-shrink-0 self-start">
                      <div className="h-2 w-2 rounded-full bg-blue-600"></div>
                    </div>
                  </div>
                </div>

                {/* System Notification */}
                <div className="p-4 hover:bg-gray-50 transition-colors duration-150">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 pt-0.5">
                      <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                        <FaCog className="h-5 w-5 text-purple-600" />
                      </div>
                    </div>
                    <div className="ml-3 flex-1">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-gray-900">System Update Complete</p>
                        <p className="text-xs text-gray-500">Yesterday</p>
                      </div>
                      <div className="mt-1">
                        <p className="text-sm text-gray-600">The system has been updated to version 2.4.0. Check out the new features in your dashboard.</p>
                      </div>
                      <div className="mt-2 flex space-x-2">
                        <button className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                          <FaEye className="mr-1" /> View Details
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Announcement Notification */}
                <div className="p-4 bg-blue-50 hover:bg-blue-100 transition-colors duration-150">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 pt-0.5">
                      <div className="h-10 w-10 rounded-full bg-yellow-100 flex items-center justify-center">
                        <FaBullhorn className="h-5 w-5 text-yellow-600" />
                      </div>
                    </div>
                    <div className="ml-3 flex-1">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-gray-900">New Announcement: Holiday Schedule</p>
                        <p className="text-xs text-gray-500">2 days ago</p>
                      </div>
                      <div className="mt-1">
                        <p className="text-sm text-gray-600">Important announcement regarding the upcoming holiday schedule and class adjustments.</p>
                      </div>
                      <div className="mt-2 flex space-x-2">
                        <button className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-green-700 bg-green-100 hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                          <FaCheck className="mr-1" /> Mark as Read
                        </button>
                        <button className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                          <FaEye className="mr-1" /> View Announcement
                        </button>
                      </div>
                    </div>
                    <div className="ml-2 flex-shrink-0 self-start">
                      <div className="h-2 w-2 rounded-full bg-blue-600"></div>
                    </div>
                  </div>
                </div>

                {/* Payment Notification */}
                <div className="p-4 hover:bg-gray-50 transition-colors duration-150">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 pt-0.5">
                      <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                        <FaCreditCard className="h-5 w-5 text-green-600" />
                      </div>
                    </div>
                    <div className="ml-3 flex-1">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-gray-900">Payment Received</p>
                        <p className="text-xs text-gray-500">3 days ago</p>
                      </div>
                      <div className="mt-1">
                        <p className="text-sm text-gray-600">Payment of $199.00 received for Premium Subscription renewal.</p>
                      </div>
                      <div className="mt-2 flex space-x-2">
                        <button className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                          <FaFileInvoice className="mr-1" /> View Invoice
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Resource Notification */}
                <div className="p-4 bg-blue-50 hover:bg-blue-100 transition-colors duration-150">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 pt-0.5">
                      <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <FaBook className="h-5 w-5 text-blue-600" />
                      </div>
                    </div>
                    <div className="ml-3 flex-1">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-gray-900">New Resource Available</p>
                        <p className="text-xs text-gray-500">4 days ago</p>
                      </div>
                      <div className="mt-1">
                        <p className="text-sm text-gray-600">A new teaching resource "Advanced Mathematics Guide" has been added to your academy library.</p>
                      </div>
                      <div className="mt-2 flex space-x-2">
                        <button className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-green-700 bg-green-100 hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                          <FaCheck className="mr-1" /> Mark as Read
                        </button>
                        <button className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                          <FaDownload className="mr-1" /> View Resource
                        </button>
                      </div>
                    </div>
                    <div className="ml-2 flex-shrink-0 self-start">
                      <div className="h-2 w-2 rounded-full bg-blue-600"></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Pagination */}
              <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-700">
                      Showing <span className="font-medium">1</span> to <span className="font-medium">5</span> of <span className="font-medium">12</span> notifications
                    </p>
                  </div>
                  <div>
                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                      <a href="#" className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                        <span className="sr-only">Previous</span>
                        <FaChevronLeft className="h-5 w-5" />
                      </a>
                      <a href="#" className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">1</a>
                      <a href="#" className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">2</a>
                      <a href="#" className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">3</a>
                      <a href="#" className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                        <span className="sr-only">Next</span>
                        <FaChevronRight className="h-5 w-5" />
                      </a>
                    </nav>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Unread Notifications Content */}
          {activeSubTab === 'unread' && (
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Unread Notifications</h3>
                  <p className="mt-1 text-sm text-gray-500">You have 3 unread notifications</p>
                </div>
                <button className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                  <FaCheck className="mr-1.5 text-green-500" /> Mark All as Read
                </button>
              </div>
              
              <div className="divide-y divide-gray-200">
                {/* Unread Notification 1 */}
                <div className="p-4 bg-blue-50 hover:bg-blue-100 transition-colors duration-150">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 pt-0.5">
                      <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                        <FaUserPlus className="h-5 w-5 text-green-600" />
                      </div>
                    </div>
                    <div className="ml-3 flex-1">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-gray-900">New Student Registration</p>
                        <p className="text-xs text-gray-500">2 hours ago</p>
                      </div>
                      <div className="mt-1">
                        <p className="text-sm text-gray-600">John Doe has registered as a new student in your academy. Review their application now.</p>
                      </div>
                      <div className="mt-2 flex space-x-2">
                        <button className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-green-700 bg-green-100 hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                          <FaCheck className="mr-1" /> Mark as Read
                        </button>
                        <button className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                          <FaEye className="mr-1" /> View Details
                        </button>
                      </div>
                    </div>
                    <div className="ml-2 flex-shrink-0 self-start">
                      <div className="h-2 w-2 rounded-full bg-blue-600"></div>
                    </div>
                  </div>
                </div>

                {/* Unread Notification 2 */}
                <div className="p-4 bg-blue-50 hover:bg-blue-100 transition-colors duration-150">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 pt-0.5">
                      <div className="h-10 w-10 rounded-full bg-yellow-100 flex items-center justify-center">
                        <FaBullhorn className="h-5 w-5 text-yellow-600" />
                      </div>
                    </div>
                    <div className="ml-3 flex-1">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-gray-900">New Announcement: Holiday Schedule</p>
                        <p className="text-xs text-gray-500">2 days ago</p>
                      </div>
                      <div className="mt-1">
                        <p className="text-sm text-gray-600">Important announcement regarding the upcoming holiday schedule and class adjustments.</p>
                      </div>
                      <div className="mt-2 flex space-x-2">
                        <button className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-green-700 bg-green-100 hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                          <FaCheck className="mr-1" /> Mark as Read
                        </button>
                        <button className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                          <FaEye className="mr-1" /> View Announcement
                        </button>
                      </div>
                    </div>
                    <div className="ml-2 flex-shrink-0 self-start">
                      <div className="h-2 w-2 rounded-full bg-blue-600"></div>
                    </div>
                  </div>
                </div>

                {/* Unread Notification 3 */}
                <div className="p-4 bg-blue-50 hover:bg-blue-100 transition-colors duration-150">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 pt-0.5">
                      <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <FaBook className="h-5 w-5 text-blue-600" />
                      </div>
                    </div>
                    <div className="ml-3 flex-1">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-gray-900">New Resource Available</p>
                        <p className="text-xs text-gray-500">4 days ago</p>
                      </div>
                      <div className="mt-1">
                        <p className="text-sm text-gray-600">A new teaching resource "Advanced Mathematics Guide" has been added to your academy library.</p>
                      </div>
                      <div className="mt-2 flex space-x-2">
                        <button className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-green-700 bg-green-100 hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                          <FaCheck className="mr-1" /> Mark as Read
                        </button>
                        <button className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                          <FaDownload className="mr-1" /> View Resource
                        </button>
                      </div>
                    </div>
                    <div className="ml-2 flex-shrink-0 self-start">
                      <div className="h-2 w-2 rounded-full bg-blue-600"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* System Notifications Content */}
          {activeSubTab === 'system' && (
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">System Notifications</h3>
                <p className="mt-1 text-sm text-gray-500">Important updates and system messages</p>
              </div>
              
              <div className="divide-y divide-gray-200">
                {/* System Notification 1 */}
                <div className="p-4 hover:bg-gray-50 transition-colors duration-150">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 pt-0.5">
                      <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                        <FaCog className="h-5 w-5 text-purple-600" />
                      </div>
                    </div>
                    <div className="ml-3 flex-1">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-gray-900">System Update Complete</p>
                        <p className="text-xs text-gray-500">Yesterday</p>
                      </div>
                      <div className="mt-1">
                        <p className="text-sm text-gray-600">The system has been updated to version 2.4.0. Check out the new features in your dashboard.</p>
                      </div>
                      <div className="mt-2 flex space-x-2">
                        <button className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                          <FaEye className="mr-1" /> View Details
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* System Notification 2 */}
                <div className="p-4 hover:bg-gray-50 transition-colors duration-150">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 pt-0.5">
                      <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <FaServer className="h-5 w-5 text-blue-600" />
                      </div>
                    </div>
                    <div className="ml-3 flex-1">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-gray-900">Scheduled Maintenance</p>
                        <p className="text-xs text-gray-500">1 week ago</p>
                      </div>
                      <div className="mt-1">
                        <p className="text-sm text-gray-600">Scheduled maintenance will occur on Sunday, June 12 from 2:00 AM to 4:00 AM UTC. The system may be unavailable during this time.</p>
                      </div>
                      <div className="mt-2 flex space-x-2">
                        <button className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                          <FaCalendarAlt className="mr-1" /> Add to Calendar
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* System Notification 3 */}
                <div className="p-4 hover:bg-gray-50 transition-colors duration-150">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 pt-0.5">
                      <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                        <FaShieldAlt className="h-5 w-5 text-green-600" />
                      </div>
                    </div>
                    <div className="ml-3 flex-1">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-gray-900">Security Update</p>
                        <p className="text-xs text-gray-500">2 weeks ago</p>
                      </div>
                      <div className="mt-1">
                        <p className="text-sm text-gray-600">We've enhanced our security protocols. Please review your account settings and enable two-factor authentication for added protection.</p>
                      </div>
                      <div className="mt-2 flex space-x-2">
                        <button className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                          <FaLock className="mr-1" /> Security Settings
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Announcements Content */}
          {activeSubTab === 'announcements' && (
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Announcements</h3>
                  <p className="mt-1 text-sm text-gray-500">Important announcements for your academy</p>
                </div>
                <button className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                  <FaPlus className="mr-1.5" /> Create Announcement
                </button>
              </div>
              
              <div className="divide-y divide-gray-200">
                {/* Announcement 1 */}
                <div className="p-4 hover:bg-gray-50 transition-colors duration-150">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 pt-0.5">
                      <div className="h-10 w-10 rounded-full bg-yellow-100 flex items-center justify-center">
                        <FaBullhorn className="h-5 w-5 text-yellow-600" />
                      </div>
                    </div>
                    <div className="ml-3 flex-1">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-gray-900">Holiday Schedule</p>
                        <div className="flex items-center">
                          <p className="text-xs text-gray-500 mr-2">Posted by Admin • 2 days ago</p>
                          <div className="flex space-x-1">
                            <button className="text-gray-400 hover:text-gray-500">
                              <FaEdit className="h-4 w-4" />
                            </button>
                            <button className="text-gray-400 hover:text-red-500">
                              <FaArchive className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                      <div className="mt-1">
                        <p className="text-sm text-gray-600">Dear academy members, please note that we will be closed for the winter holidays from December 24th to January 2nd. All classes during this period will be rescheduled. Please check your email for the updated schedule.</p>
                      </div>
                      <div className="mt-2 flex space-x-2">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          Important
                        </span>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          Schedule Change
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Announcement 2 */}
                <div className="p-4 hover:bg-gray-50 transition-colors duration-150">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 pt-0.5">
                      <div className="h-10 w-10 rounded-full bg-yellow-100 flex items-center justify-center">
                        <FaBullhorn className="h-5 w-5 text-yellow-600" />
                      </div>
                    </div>
                    <div className="ml-3 flex-1">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-gray-900">New Curriculum Launch</p>
                        <div className="flex items-center">
                          <p className="text-xs text-gray-500 mr-2">Posted by Admin • 1 week ago</p>
                          <div className="flex space-x-1">
                            <button className="text-gray-400 hover:text-gray-500">
                              <FaEdit className="h-4 w-4" />
                            </button>
                            <button className="text-gray-400 hover:text-red-500">
                              <FaArchive className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                      <div className="mt-1">
                        <p className="text-sm text-gray-600">We're excited to announce the launch of our new enhanced curriculum for the upcoming semester. The new curriculum includes updated course materials, interactive learning modules, and additional resources for students.</p>
                      </div>
                      <div className="mt-2 flex space-x-2">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Curriculum
                        </span>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                          New Features
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Announcement 3 */}
                <div className="p-4 hover:bg-gray-50 transition-colors duration-150">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 pt-0.5">
                      <div className="h-10 w-10 rounded-full bg-yellow-100 flex items-center justify-center">
                        <FaBullhorn className="h-5 w-5 text-yellow-600" />
                      </div>
                    </div>
                    <div className="ml-3 flex-1">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-gray-900">Parent-Teacher Conference</p>
                        <div className="flex items-center">
                          <p className="text-xs text-gray-500 mr-2">Posted by Admin • 2 weeks ago</p>
                          <div className="flex space-x-1">
                            <button className="text-gray-400 hover:text-gray-500">
                              <FaEdit className="h-4 w-4" />
                            </button>
                            <button className="text-gray-400 hover:text-red-500">
                              <FaArchive className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                      <div className="mt-1">
                        <p className="text-sm text-gray-600">The quarterly parent-teacher conference is scheduled for October 15-16. Please book your appointment through the parent portal. Each session will be 20 minutes long.</p>
                      </div>
                      <div className="mt-2 flex space-x-2">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          Event
                        </span>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                          Requires Action
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Notification Settings Content */}
          {activeSubTab === 'notification-settings' && (
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Notification Settings</h3>
                <p className="mt-1 text-sm text-gray-500">Customize how you receive notifications</p>
              </div>
              
              <div className="p-6 space-y-6">
                <div>
                  <h4 className="text-sm font-medium text-gray-900">Email Notifications</h4>
                  <div className="mt-3 space-y-4">
                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input id="email-student-registrations" name="email-student-registrations" type="checkbox" defaultChecked className="focus:ring-green-500 h-4 w-4 text-green-600 border-gray-300 rounded" />
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor="email-student-registrations" className="font-medium text-gray-700">Student Registrations</label>
                        <p className="text-gray-500">Receive an email when a new student registers</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input id="email-system-updates" name="email-system-updates" type="checkbox" defaultChecked className="focus:ring-green-500 h-4 w-4 text-green-600 border-gray-300 rounded" />
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor="email-system-updates" className="font-medium text-gray-700">System Updates</label>
                        <p className="text-gray-500">Receive an email about system updates and maintenance</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input id="email-announcements" name="email-announcements" type="checkbox" defaultChecked className="focus:ring-green-500 h-4 w-4 text-green-600 border-gray-300 rounded" />
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor="email-announcements" className="font-medium text-gray-700">Announcements</label>
                        <p className="text-gray-500">Receive an email when new announcements are posted</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input id="email-payment-receipts" name="email-payment-receipts" type="checkbox" defaultChecked className="focus:ring-green-500 h-4 w-4 text-green-600 border-gray-300 rounded" />
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor="email-payment-receipts" className="font-medium text-gray-700">Payment Receipts</label>
                        <p className="text-gray-500">Receive an email receipt for payments</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input id="email-resource-updates" name="email-resource-updates" type="checkbox" defaultChecked className="focus:ring-green-500 h-4 w-4 text-green-600 border-gray-300 rounded" />
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor="email-resource-updates" className="font-medium text-gray-700">Resource Updates</label>
                        <p className="text-gray-500">Receive an email when new resources are added</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="pt-5 border-t border-gray-200">
                  <h4 className="text-sm font-medium text-gray-900">In-App Notifications</h4>
                  <div className="mt-3 space-y-4">
                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input id="app-student-registrations" name="app-student-registrations" type="checkbox" defaultChecked className="focus:ring-green-500 h-4 w-4 text-green-600 border-gray-300 rounded" />
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor="app-student-registrations" className="font-medium text-gray-700">Student Registrations</label>
                        <p className="text-gray-500">Receive in-app notifications for new student registrations</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input id="app-system-updates" name="app-system-updates" type="checkbox" defaultChecked className="focus:ring-green-500 h-4 w-4 text-green-600 border-gray-300 rounded" />
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor="app-system-updates" className="font-medium text-gray-700">System Updates</label>
                        <p className="text-gray-500">Receive in-app notifications about system updates</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input id="app-announcements" name="app-announcements" type="checkbox" defaultChecked className="focus:ring-green-500 h-4 w-4 text-green-600 border-gray-300 rounded" />
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor="app-announcements" className="font-medium text-gray-700">Announcements</label>
                        <p className="text-gray-500">Receive in-app notifications for new announcements</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input id="app-payment-receipts" name="app-payment-receipts" type="checkbox" defaultChecked className="focus:ring-green-500 h-4 w-4 text-green-600 border-gray-300 rounded" />
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor="app-payment-receipts" className="font-medium text-gray-700">Payment Receipts</label>
                        <p className="text-gray-500">Receive in-app notifications for payments</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input id="app-resource-updates" name="app-resource-updates" type="checkbox" defaultChecked className="focus:ring-green-500 h-4 w-4 text-green-600 border-gray-300 rounded" />
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor="app-resource-updates" className="font-medium text-gray-700">Resource Updates</label>
                        <p className="text-gray-500">Receive in-app notifications for new resources</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="pt-5 border-t border-gray-200">
                  <h4 className="text-sm font-medium text-gray-900">Notification Frequency</h4>
                  <div className="mt-3">
                    <div className="space-y-4">
                      <div className="flex items-center">
                        <input id="frequency-realtime" name="notification-frequency" type="radio" defaultChecked className="focus:ring-green-500 h-4 w-4 text-green-600 border-gray-300" />
                        <label htmlFor="frequency-realtime" className="ml-3 block text-sm font-medium text-gray-700">Real-time</label>
                      </div>
                      <div className="flex items-center">
                        <input id="frequency-daily" name="notification-frequency" type="radio" className="focus:ring-green-500 h-4 w-4 text-green-600 border-gray-300" />
                        <label htmlFor="frequency-daily" className="ml-3 block text-sm font-medium text-gray-700">Daily digest</label>
                      </div>
                      <div className="flex items-center">
                        <input id="frequency-weekly" name="notification-frequency" type="radio" className="focus:ring-green-500 h-4 w-4 text-green-600 border-gray-300" />
                        <label htmlFor="frequency-weekly" className="ml-3 block text-sm font-medium text-gray-700">Weekly digest</label>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="pt-5 border-t border-gray-200 flex justify-end">
                  <button type="button" className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                    Cancel
                  </button>
                  <button type="button" className="ml-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                    Save Settings
                  </button>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      )}

      {activeTab === 'settings' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          {/* Sub-tabs for Settings */}
          <div className="bg-white rounded-lg shadow-md p-4">
            <div className="flex border-b">
              <button
                onClick={() => setActiveSubTab('general')}
                className={`px-4 py-2 font-medium text-sm ${activeSubTab === 'general' ? 'text-green-600 border-b-2 border-green-600' : 'text-gray-500 hover:text-gray-700'}`}
              >
                <FaCog className="inline mr-1" /> General
              </button>
              <button
                onClick={() => setActiveSubTab('profile')}
                className={`px-4 py-2 font-medium text-sm ${activeSubTab === 'profile' ? 'text-green-600 border-b-2 border-green-600' : 'text-gray-500 hover:text-gray-700'}`}
              >
                <FaUserCog className="inline mr-1" /> Academy Profile
              </button>
              <button
                onClick={() => setActiveSubTab('security')}
                className={`px-4 py-2 font-medium text-sm ${activeSubTab === 'security' ? 'text-green-600 border-b-2 border-green-600' : 'text-gray-500 hover:text-gray-700'}`}
              >
                <FaLock className="inline mr-1" /> Security
              </button>
              <button
                onClick={() => setActiveSubTab('integrations')}
                className={`px-4 py-2 font-medium text-sm ${activeSubTab === 'integrations' ? 'text-green-600 border-b-2 border-green-600' : 'text-gray-500 hover:text-gray-700'}`}
              >
                <FaServer className="inline mr-1" /> Integrations
              </button>
              <button
                onClick={() => setActiveSubTab('data')}
                className={`px-4 py-2 font-medium text-sm ${activeSubTab === 'data' ? 'text-green-600 border-b-2 border-green-600' : 'text-gray-500 hover:text-gray-700'}`}
              >
                <FaDatabase className="inline mr-1" /> Data Management
              </button>
            </div>
          </div>
          
          {/* General Settings Content */}
          {activeSubTab === 'general' && (
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">General Settings</h3>
                <p className="mt-1 text-sm text-gray-500">Configure basic academy settings and preferences</p>
              </div>
              
              <div className="p-6 space-y-6">
                <div>
                  <h4 className="text-sm font-medium text-gray-900">Academy Information</h4>
                  <div className="mt-3 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                    <div className="sm:col-span-3">
                      <label htmlFor="academy-name" className="block text-sm font-medium text-gray-700">Academy Name</label>
                      <div className="mt-1">
                        <input type="text" name="academy-name" id="academy-name" defaultValue="My Academy" className="shadow-sm focus:ring-green-500 focus:border-green-500 block w-full sm:text-sm border-gray-300 rounded-md" />
                      </div>
                    </div>
                    
                    <div className="sm:col-span-3">
                      <label htmlFor="timezone" className="block text-sm font-medium text-gray-700">Timezone</label>
                      <div className="mt-1">
                        <select id="timezone" name="timezone" className="shadow-sm focus:ring-green-500 focus:border-green-500 block w-full sm:text-sm border-gray-300 rounded-md">
                          <option>Eastern Time (ET)</option>
                          <option>Central Time (CT)</option>
                          <option>Mountain Time (MT)</option>
                          <option>Pacific Time (PT)</option>
                          <option>UTC</option>
                        </select>
                      </div>
                    </div>
                    
                    <div className="sm:col-span-6">
                      <label htmlFor="academy-description" className="block text-sm font-medium text-gray-700">Academy Description</label>
                      <div className="mt-1">
                        <textarea id="academy-description" name="academy-description" rows="3" className="shadow-sm focus:ring-green-500 focus:border-green-500 block w-full sm:text-sm border-gray-300 rounded-md" defaultValue="A premier online learning platform for students of all ages."></textarea>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="pt-5 border-t border-gray-200">
                  <h4 className="text-sm font-medium text-gray-900">Display Settings</h4>
                  <div className="mt-3 space-y-4">
                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input id="dark-mode" name="dark-mode" type="checkbox" className="focus:ring-green-500 h-4 w-4 text-green-600 border-gray-300 rounded" />
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor="dark-mode" className="font-medium text-gray-700">Enable Dark Mode</label>
                        <p className="text-gray-500">Use dark theme for the dashboard interface</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input id="compact-view" name="compact-view" type="checkbox" className="focus:ring-green-500 h-4 w-4 text-green-600 border-gray-300 rounded" />
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor="compact-view" className="font-medium text-gray-700">Compact View</label>
                        <p className="text-gray-500">Display more information with less spacing</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="pt-5 border-t border-gray-200">
                  <h4 className="text-sm font-medium text-gray-900">Notification Preferences</h4>
                  <div className="mt-3 space-y-4">
                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input id="email-notifications" name="email-notifications" type="checkbox" className="focus:ring-green-500 h-4 w-4 text-green-600 border-gray-300 rounded" defaultChecked />
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor="email-notifications" className="font-medium text-gray-700">Email Notifications</label>
                        <p className="text-gray-500">Receive important updates via email</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input id="browser-notifications" name="browser-notifications" type="checkbox" className="focus:ring-green-500 h-4 w-4 text-green-600 border-gray-300 rounded" defaultChecked />
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor="browser-notifications" className="font-medium text-gray-700">Browser Notifications</label>
                        <p className="text-gray-500">Show notifications in your browser</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="pt-5 border-t border-gray-200 flex justify-end">
                  <button type="button" className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">Cancel</button>
                  <button type="submit" className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">Save Changes</button>
                </div>
              </div>
            </div>
          )}
          
          {/* Academy Profile Content */}
          {activeSubTab === 'profile' && (
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Academy Profile</h3>
                <p className="mt-1 text-sm text-gray-500">Manage your academy's public profile and branding</p>
              </div>
              
              <div className="p-6 space-y-6">
                <div>
                  <h4 className="text-sm font-medium text-gray-900">Logo & Branding</h4>
                  <div className="mt-3 flex items-center space-x-6">
                    <div className="flex-shrink-0">
                      <div className="h-24 w-24 rounded-md bg-gray-200 flex items-center justify-center">
                        <FaImage className="h-12 w-12 text-gray-400" />
                      </div>
                    </div>
                    <div>
                      <button type="button" className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                        <FaUpload className="mr-2 h-4 w-4" /> Upload Logo
                      </button>
                      <p className="mt-2 text-xs text-gray-500">Recommended size: 512x512px. PNG or JPG format.</p>
                    </div>
                  </div>
                </div>
                
                <div className="pt-5 border-t border-gray-200">
                  <h4 className="text-sm font-medium text-gray-900">Contact Information</h4>
                  <div className="mt-3 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                    <div className="sm:col-span-3">
                      <label htmlFor="contact-email" className="block text-sm font-medium text-gray-700">Contact Email</label>
                      <div className="mt-1">
                        <input type="email" name="contact-email" id="contact-email" defaultValue="contact@myacademy.com" className="shadow-sm focus:ring-green-500 focus:border-green-500 block w-full sm:text-sm border-gray-300 rounded-md" />
                      </div>
                    </div>
                    
                    <div className="sm:col-span-3">
                      <label htmlFor="contact-phone" className="block text-sm font-medium text-gray-700">Contact Phone</label>
                      <div className="mt-1">
                        <input type="tel" name="contact-phone" id="contact-phone" defaultValue="(555) 123-4567" className="shadow-sm focus:ring-green-500 focus:border-green-500 block w-full sm:text-sm border-gray-300 rounded-md" />
                      </div>
                    </div>
                    
                    <div className="sm:col-span-6">
                      <label htmlFor="address" className="block text-sm font-medium text-gray-700">Address</label>
                      <div className="mt-1">
                        <textarea id="address" name="address" rows="3" className="shadow-sm focus:ring-green-500 focus:border-green-500 block w-full sm:text-sm border-gray-300 rounded-md" defaultValue="123 Education Lane, Learning City, ED 12345"></textarea>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="pt-5 border-t border-gray-200">
                  <h4 className="text-sm font-medium text-gray-900">Social Media</h4>
                  <div className="mt-3 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                    <div className="sm:col-span-3">
                      <label htmlFor="website" className="block text-sm font-medium text-gray-700">Website</label>
                      <div className="mt-1 flex rounded-md shadow-sm">
                        <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm">https://</span>
                        <input type="text" name="website" id="website" defaultValue="myacademy.com" className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md focus:ring-green-500 focus:border-green-500 sm:text-sm border-gray-300" />
                      </div>
                    </div>
                    
                    <div className="sm:col-span-3">
                      <label htmlFor="facebook" className="block text-sm font-medium text-gray-700">Facebook</label>
                      <div className="mt-1 flex rounded-md shadow-sm">
                        <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm">facebook.com/</span>
                        <input type="text" name="facebook" id="facebook" defaultValue="myacademy" className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md focus:ring-green-500 focus:border-green-500 sm:text-sm border-gray-300" />
                      </div>
                    </div>
                    
                    <div className="sm:col-span-3">
                      <label htmlFor="twitter" className="block text-sm font-medium text-gray-700">Twitter</label>
                      <div className="mt-1 flex rounded-md shadow-sm">
                        <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm">@</span>
                        <input type="text" name="twitter" id="twitter" defaultValue="myacademy" className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md focus:ring-green-500 focus:border-green-500 sm:text-sm border-gray-300" />
                      </div>
                    </div>
                    
                    <div className="sm:col-span-3">
                      <label htmlFor="instagram" className="block text-sm font-medium text-gray-700">Instagram</label>
                      <div className="mt-1 flex rounded-md shadow-sm">
                        <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm">@</span>
                        <input type="text" name="instagram" id="instagram" defaultValue="myacademy" className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md focus:ring-green-500 focus:border-green-500 sm:text-sm border-gray-300" />
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="pt-5 border-t border-gray-200 flex justify-end">
                  <button type="button" className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">Cancel</button>
                  <button type="submit" className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">Save Changes</button>
                </div>
              </div>
            </div>
          )}
          
          {/* Security Settings Content */}
          {activeSubTab === 'security' && (
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Security Settings</h3>
                <p className="mt-1 text-sm text-gray-500">Manage account security and access controls</p>
              </div>
              
              <div className="p-6 space-y-6">
                <div>
                  <h4 className="text-sm font-medium text-gray-900">Password Management</h4>
                  <div className="mt-3 space-y-4">
                    <div>
                      <label htmlFor="current-password" className="block text-sm font-medium text-gray-700">Current Password</label>
                      <div className="mt-1">
                        <input type="password" name="current-password" id="current-password" className="shadow-sm focus:ring-green-500 focus:border-green-500 block w-full sm:text-sm border-gray-300 rounded-md" />
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="new-password" className="block text-sm font-medium text-gray-700">New Password</label>
                      <div className="mt-1">
                        <input type="password" name="new-password" id="new-password" className="shadow-sm focus:ring-green-500 focus:border-green-500 block w-full sm:text-sm border-gray-300 rounded-md" />
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700">Confirm New Password</label>
                      <div className="mt-1">
                        <input type="password" name="confirm-password" id="confirm-password" className="shadow-sm focus:ring-green-500 focus:border-green-500 block w-full sm:text-sm border-gray-300 rounded-md" />
                      </div>
                    </div>
                    
                    <button type="button" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                      Update Password
                    </button>
                  </div>
                </div>
                
                <div className="pt-5 border-t border-gray-200">
                  <h4 className="text-sm font-medium text-gray-900">Two-Factor Authentication</h4>
                  <div className="mt-3 space-y-4">
                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input id="enable-2fa" name="enable-2fa" type="checkbox" className="focus:ring-green-500 h-4 w-4 text-green-600 border-gray-300 rounded" />
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor="enable-2fa" className="font-medium text-gray-700">Enable Two-Factor Authentication</label>
                        <p className="text-gray-500">Add an extra layer of security to your account</p>
                      </div>
                    </div>
                    
                    <button type="button" className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                      Configure Two-Factor Authentication
                    </button>
                  </div>
                </div>
                
                <div className="pt-5 border-t border-gray-200">
                  <h4 className="text-sm font-medium text-gray-900">Login Sessions</h4>
                  <p className="mt-1 text-sm text-gray-500">These are devices that have logged into your account</p>
                  
                  <div className="mt-3 space-y-4">
                    <div className="bg-gray-50 p-4 rounded-md">
                      <div className="flex justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-900">Current Session</p>
                          <p className="text-xs text-gray-500">Windows • Chrome • IP: 192.168.1.1</p>
                          <p className="text-xs text-gray-500">Started: Today, 10:30 AM</p>
                        </div>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Active Now
                        </span>
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 p-4 rounded-md">
                      <div className="flex justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-900">Previous Session</p>
                          <p className="text-xs text-gray-500">Mac OS • Safari • IP: 192.168.1.2</p>
                          <p className="text-xs text-gray-500">Last active: Yesterday, 3:15 PM</p>
                        </div>
                        <button type="button" className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
                          Revoke
                        </button>
                      </div>
                    </div>
                    
                    <button type="button" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
                      Sign Out All Other Sessions
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Integrations Content */}
          {activeSubTab === 'integrations' && (
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Integrations</h3>
                <p className="mt-1 text-sm text-gray-500">Connect your academy with other services and tools</p>
              </div>
              
              <div className="p-6 space-y-6">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div className="border rounded-lg p-4 hover:shadow-md transition-shadow duration-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <FaGoogle className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-gray-900">Google Workspace</h4>
                          <p className="text-xs text-gray-500">Connect with Google Calendar, Drive, and more</p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          Not Connected
                        </span>
                      </div>
                    </div>
                    <div className="mt-4">
                      <button type="button" className="w-full inline-flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                        Connect
                      </button>
                    </div>
                  </div>
                  
                  <div className="border rounded-lg p-4 hover:shadow-md transition-shadow duration-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <FaSlack className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-gray-900">Slack</h4>
                          <p className="text-xs text-gray-500">Get notifications and updates in Slack</p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Connected
                        </span>
                      </div>
                    </div>
                    <div className="mt-4">
                      <button type="button" className="w-full inline-flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                        Configure
                      </button>
                    </div>
                  </div>
                  
                  <div className="border rounded-lg p-4 hover:shadow-md transition-shadow duration-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <FaStripe className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-gray-900">Stripe</h4>
                          <p className="text-xs text-gray-500">Process payments and subscriptions</p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          Not Connected
                        </span>
                      </div>
                    </div>
                    <div className="mt-4">
                      <button type="button" className="w-full inline-flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                        Connect
                      </button>
                    </div>
                  </div>
                  
                  <div className="border rounded-lg p-4 hover:shadow-md transition-shadow duration-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <FaZoom className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-gray-900">Zoom</h4>
                          <p className="text-xs text-gray-500">Schedule and manage virtual classes</p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          Not Connected
                        </span>
                      </div>
                    </div>
                    <div className="mt-4">
                      <button type="button" className="w-full inline-flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                        Connect
                      </button>
                    </div>
                  </div>
                </div>
                
                <div className="pt-5 border-t border-gray-200">
                  <h4 className="text-sm font-medium text-gray-900">API Access</h4>
                  <p className="mt-1 text-sm text-gray-500">Manage API keys for custom integrations</p>
                  
                  <div className="mt-3 space-y-4">
                    <div className="bg-gray-50 p-4 rounded-md">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-sm font-medium text-gray-900">Production API Key</p>
                          <p className="text-xs text-gray-500">Created: Jan 15, 2023</p>
                        </div>
                        <div className="flex space-x-2">
                          <button type="button" className="inline-flex items-center px-2.5 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                            <FaEye className="mr-1.5 h-3 w-3" /> View
                          </button>
                          <button type="button" className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
                            <FaTrash className="mr-1.5 h-3 w-3" /> Revoke
                          </button>
                        </div>
                      </div>
                    </div>
                    
                    <button type="button" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                      <FaPlus className="mr-2 h-4 w-4" /> Generate New API Key
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Data Management Content */}
          {activeSubTab === 'data' && (
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Data Management</h3>
                <p className="mt-1 text-sm text-gray-500">Manage your academy data, exports, and privacy settings</p>
              </div>
              
              <div className="p-6 space-y-6">
                <div>
                  <h4 className="text-sm font-medium text-gray-900">Data Export</h4>
                  <p className="mt-1 text-sm text-gray-500">Download your academy data for backup or analysis</p>
                  
                  <div className="mt-3 space-y-4">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                      <div className="border rounded-md p-4 hover:shadow-sm transition-shadow duration-200">
                        <h5 className="text-sm font-medium text-gray-900">User Data</h5>
                        <p className="mt-1 text-xs text-gray-500">Teachers, students, and staff information</p>
                        <button type="button" className="mt-3 inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                          <FaDownload className="mr-1.5 h-3 w-3" /> Export CSV
                        </button>
                      </div>
                      
                      <div className="border rounded-md p-4 hover:shadow-sm transition-shadow duration-200">
                        <h5 className="text-sm font-medium text-gray-900">Class Data</h5>
                        <p className="mt-1 text-xs text-gray-500">Class schedules, attendance, and performance</p>
                        <button type="button" className="mt-3 inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                          <FaDownload className="mr-1.5 h-3 w-3" /> Export CSV
                        </button>
                      </div>
                      
                      <div className="border rounded-md p-4 hover:shadow-sm transition-shadow duration-200">
                        <h5 className="text-sm font-medium text-gray-900">Resource Data</h5>
                        <p className="mt-1 text-xs text-gray-500">Learning materials and resources</p>
                        <button type="button" className="mt-3 inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                          <FaDownload className="mr-1.5 h-3 w-3" /> Export CSV
                        </button>
                      </div>
                    </div>
                    
                    <button type="button" className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                      <FaDownload className="mr-2 h-4 w-4" /> Export All Data
                    </button>
                  </div>
                </div>
                
                <div className="pt-5 border-t border-gray-200">
                  <h4 className="text-sm font-medium text-gray-900">Data Retention</h4>
                  <p className="mt-1 text-sm text-gray-500">Configure how long data is stored in the system</p>
                  
                  <div className="mt-3 space-y-4">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div>
                        <label htmlFor="chat-retention" className="block text-sm font-medium text-gray-700">Chat History Retention</label>
                        <select id="chat-retention" name="chat-retention" className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-md">
                          <option>30 days</option>
                          <option>60 days</option>
                          <option>90 days</option>
                          <option>1 year</option>
                          <option>Forever</option>
                        </select>
                      </div>
                      
                      <div>
                        <label htmlFor="log-retention" className="block text-sm font-medium text-gray-700">Activity Log Retention</label>
                        <select id="log-retention" name="log-retention" className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-md">
                          <option>30 days</option>
                          <option>60 days</option>
                          <option>90 days</option>
                          <option>1 year</option>
                          <option>Forever</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="pt-5 border-t border-gray-200">
                  <h4 className="text-sm font-medium text-gray-900">Danger Zone</h4>
                  <p className="mt-1 text-sm text-gray-500">Permanent actions that cannot be undone</p>
                  
                  <div className="mt-3 space-y-4">
                    <div className="bg-red-50 p-4 rounded-md">
                      <div className="flex">
                        <div className="flex-shrink-0">
                          <FaExclamationTriangle className="h-5 w-5 text-red-400" />
                        </div>
                        <div className="ml-3">
                          <h3 className="text-sm font-medium text-red-800">Delete All Data</h3>
                          <div className="mt-2 text-sm text-red-700">
                            <p>This will permanently delete all academy data. This action cannot be undone.</p>
                          </div>
                          <div className="mt-4">
                            <button type="button" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
                              Delete All Data
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      )}
    </div>
    </SubscriptionEnforcement>
  );
};

export default AcademyDashboard;