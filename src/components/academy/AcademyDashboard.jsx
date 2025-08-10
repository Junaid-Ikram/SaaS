import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaChalkboardTeacher, FaUserGraduate, FaCalendarAlt, FaBook, FaCreditCard, FaVideo, FaBell } from 'react-icons/fa';

// Import the extracted components
import ZoomCreditsTab from './ZoomCreditsTab';
import ClassesTab from './ClassesTab';
import ResourcesTab from './ResourcesTab';

const AcademyDashboard = () => {
  // State variables
  const [activeTab, setActiveTab] = useState('overview');
  const [activeSubTab, setActiveSubTab] = useState('upcoming');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [academyData, setAcademyData] = useState(null);
  const [pendingUsers, setPendingUsers] = useState([]);
  const [teacherCount, setTeacherCount] = useState(0);
  const [studentCount, setStudentCount] = useState(0);
  const [teachers, setTeachers] = useState([]);
  const [students, setStudents] = useState([]);
  const [subscriptionUsage, setSubscriptionUsage] = useState(null);
  const [zoomCredits, setZoomCredits] = useState({
    available: 0,
    used: 0,
    history: []
  });
  const [classes, setClasses] = useState([]);
  const [classFilter, setClassFilter] = useState('all');
  const [selectedClass, setSelectedClass] = useState(null);
  const [showClassModal, setShowClassModal] = useState(false);
  const [resources, setResources] = useState([]);
  const [communications, setCommunications] = useState([]);
  const [payments, setPayments] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [teacherFilter, setTeacherFilter] = useState('all');
  const [studentFilter, setStudentFilter] = useState('all');
  const [resourceFilter, setResourceFilter] = useState('all');

  // Load dummy data
  useEffect(() => {
    // Simulate API call
    loadDummyData();

    // Populate zoom credits history with dummy data
    const dummyZoomCreditsHistory = [
      {
        id: 1,
        type: 'purchase',
        amount: 100,
        date: '2023-05-15',
        status: 'Completed',
        transactionId: 'TRX123456'
      },
      {
        id: 2,
        type: 'usage',
        amount: 15,
        date: '2023-05-20',
        status: 'Completed',
        className: 'Advanced Mathematics'
      },
      {
        id: 3,
        type: 'usage',
        amount: 10,
        date: '2023-05-22',
        status: 'Completed',
        className: 'Physics 101'
      },
      {
        id: 4,
        type: 'purchase',
        amount: 250,
        date: '2023-06-01',
        status: 'Completed',
        transactionId: 'TRX789012'
      },
      {
        id: 5,
        type: 'usage',
        amount: 20,
        date: '2023-06-05',
        status: 'Completed',
        className: 'Chemistry Basics'
      }
    ];

    // Populate classes with dummy data
    const dummyClasses = [
      {
        id: 1,
        title: 'Advanced Mathematics',
        teacher: 'John Smith',
        date: new Date(Date.now() + 86400000).toISOString(), // tomorrow
        duration: 60,
        students_count: 25,
        status: 'upcoming',
        zoomLink: 'https://zoom.us/j/123456789',
        description: 'Advanced calculus and algebra concepts for high school students.'
      },
      {
        id: 2,
        title: 'Physics 101',
        teacher: 'Emma Johnson',
        date: new Date().toISOString(), // now (ongoing)
        duration: 45,
        students_count: 18,
        status: 'ongoing',
        zoomLink: 'https://zoom.us/j/987654321',
        description: 'Introduction to basic physics concepts and mechanics.'
      },
      {
        id: 3,
        title: 'Chemistry Basics',
        teacher: 'Michael Brown',
        date: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
        duration: 50,
        students_count: 22,
        attendance: 20,
        status: 'ended',
        zoomLink: 'https://zoom.us/j/567891234',
        description: 'Fundamentals of chemistry and periodic table elements.'
      },
      {
        id: 4,
        title: 'Biology Introduction',
        teacher: 'Sarah Wilson',
        date: new Date(Date.now() - 259200000).toISOString(), // 3 days ago
        duration: 55,
        students_count: 20,
        attendance: 18,
        status: 'ended',
        zoomLink: 'https://zoom.us/j/345678912',
        description: 'Introduction to biology and living organisms.'
      },
      {
        id: 5,
        title: 'English Literature',
        teacher: 'David Lee',
        date: new Date(Date.now() + 172800000).toISOString(), // 2 days from now
        duration: 60,
        students_count: 15,
        status: 'upcoming',
        zoomLink: 'https://zoom.us/j/789123456',
        description: 'Analysis of classic literature and writing techniques.'
      }
    ];

    // Populate resources with dummy data
    const dummyResources = [
      {
        id: 1,
        title: 'Mathematics Formulas.pdf',
        type: 'pdf',
        size: 2500000, // 2.5 MB
        uploader: 'John Smith',
        uploadDate: '2023-05-10',
        downloadUrl: '#',
        class: 'Advanced Mathematics',
        description: 'Comprehensive list of all formulas covered in the Advanced Mathematics class.'
      },
      {
        id: 2,
        title: 'Physics Experiment Video.mp4',
        type: 'video',
        size: 15000000, // 15 MB
        uploader: 'Emma Johnson',
        uploadDate: '2023-05-15',
        downloadUrl: '#',
        class: 'Physics 101',
        description: 'Video demonstration of the pendulum experiment discussed in class.'
      },
      {
        id: 3,
        title: 'Periodic Table.jpg',
        type: 'image',
        size: 1200000, // 1.2 MB
        uploader: 'Michael Brown',
        uploadDate: '2023-05-20',
        downloadUrl: '#',
        class: 'Chemistry Basics',
        description: 'High-resolution image of the periodic table with element details.'
      },
      {
        id: 4,
        title: 'Biology Notes.docx',
        type: 'document',
        size: 500000, // 500 KB
        uploader: 'Sarah Wilson',
        uploadDate: '2023-05-25',
        downloadUrl: '#',
        class: 'Biology Introduction',
        description: 'Detailed notes covering all topics from the Biology Introduction class.'
      },
      {
        id: 5,
        title: 'Literature Analysis.pdf',
        type: 'pdf',
        size: 3000000, // 3 MB
        uploader: 'David Lee',
        uploadDate: '2023-06-01',
        downloadUrl: '#',
        class: 'English Literature',
        description: 'Analysis of the literary works covered in the English Literature class.'
      },
      {
        id: 6,
        title: 'Academy Guidelines.pdf',
        type: 'pdf',
        size: 1000000, // 1 MB
        uploader: 'Admin',
        uploadDate: '2023-04-01',
        downloadUrl: '#',
        class: null,
        description: 'General guidelines and policies for all academy members.'
      }
    ];

    setZoomCredits({
      available: 305,
      used: 45,
      history: dummyZoomCreditsHistory
    });

    setClasses(dummyClasses);
    setResources(dummyResources);
  }, []);

  // Dummy data for academy
  const dummyAcademyData = {
    name: 'Bright Future Academy',
    id: 'BFA-2023',
    createdAt: '2023-01-15',
    subscription: {
      plan: 'Professional',
      startDate: '2023-01-15',
      endDate: '2024-01-15',
      status: 'active'
    },
    contact: {
      email: 'admin@brightfuture.edu',
      phone: '+1 (555) 123-4567',
      address: '123 Education St, Learning City, LC 12345'
    }
  };

  // Dummy data for pending users
  const dummyPendingUsers = [
    {
      id: 1,
      fullName: 'Jane Doe',
      email: 'jane.doe@example.com',
      role: 'teacher',
      requestDate: '2023-06-10',
      originalData: {
        subject: 'Computer Science',
        experience: '5 years',
        education: 'M.Sc. Computer Science'
      }
    },
    {
      id: 2,
      fullName: 'Tom Wilson',
      email: 'tom.wilson@example.com',
      role: 'student',
      requestDate: '2023-06-12',
      originalData: {
        grade: '10th',
        parentEmail: 'parent.wilson@example.com',
        previousSchool: 'Sunshine High School'
      }
    }
  ];

  // Dummy data for teachers
  const dummyTeachers = [
    {
      id: 1,
      fullName: 'John Smith',
      email: 'john.smith@example.com',
      status: 'active',
      createdAt: '2023-02-01',
      subjects: ['Mathematics', 'Physics'],
      studentsCount: 45,
      classesCount: 3,
      lastActive: '2023-06-14'
    },
    {
      id: 2,
      fullName: 'Emma Johnson',
      email: 'emma.johnson@example.com',
      status: 'active',
      createdAt: '2023-02-15',
      subjects: ['Physics', 'Chemistry'],
      studentsCount: 38,
      classesCount: 2,
      lastActive: '2023-06-15'
    },
    {
      id: 3,
      fullName: 'Michael Brown',
      email: 'michael.brown@example.com',
      status: 'active',
      createdAt: '2023-03-01',
      subjects: ['Chemistry'],
      studentsCount: 22,
      classesCount: 1,
      lastActive: '2023-06-13'
    },
    {
      id: 4,
      fullName: 'Sarah Wilson',
      email: 'sarah.wilson@example.com',
      status: 'active',
      createdAt: '2023-03-15',
      subjects: ['Biology'],
      studentsCount: 20,
      classesCount: 1,
      lastActive: '2023-06-14'
    },
    {
      id: 5,
      fullName: 'David Lee',
      email: 'david.lee@example.com',
      status: 'active',
      createdAt: '2023-04-01',
      subjects: ['English Literature'],
      studentsCount: 15,
      classesCount: 1,
      lastActive: '2023-06-15'
    }
  ];

  // Dummy data for students
  const dummyStudents = [
    {
      id: 1,
      fullName: 'Alice Johnson',
      email: 'alice.johnson@example.com',
      status: 'active',
      createdAt: '2023-02-05',
      academyId: 'BFA-2023',
      grade: '11th',
      assignedTeacher: 'John Smith',
      lastActive: '2023-06-14'
    },
    {
      id: 2,
      fullName: 'Bob Williams',
      email: 'bob.williams@example.com',
      status: 'active',
      createdAt: '2023-02-10',
      academyId: 'BFA-2023',
      grade: '10th',
      assignedTeacher: 'Emma Johnson',
      lastActive: '2023-06-15'
    },
    {
      id: 3,
      fullName: 'Charlie Davis',
      email: 'charlie.davis@example.com',
      status: 'active',
      createdAt: '2023-03-05',
      academyId: 'BFA-2023',
      grade: '12th',
      assignedTeacher: 'Michael Brown',
      lastActive: '2023-06-13'
    },
    {
      id: 4,
      fullName: 'Diana Miller',
      email: 'diana.miller@example.com',
      status: 'active',
      createdAt: '2023-03-20',
      academyId: 'BFA-2023',
      grade: '9th',
      assignedTeacher: 'Sarah Wilson',
      lastActive: '2023-06-14'
    },
    {
      id: 5,
      fullName: 'Ethan Taylor',
      email: 'ethan.taylor@example.com',
      status: 'active',
      createdAt: '2023-04-05',
      academyId: 'BFA-2023',
      grade: '10th',
      assignedTeacher: 'David Lee',
      lastActive: '2023-06-15'
    }
  ];

  // Function to simulate loading data
  const loadDummyData = () => {
    setTimeout(() => {
      setAcademyData(dummyAcademyData);
      setPendingUsers(dummyPendingUsers);
      setTeachers(dummyTeachers);
      setStudents(dummyStudents);
      setTeacherCount(dummyTeachers.length);
      setStudentCount(dummyStudents.length);
      setSubscriptionUsage({
        studentsLimit: 100,
        teachersLimit: 10,
        storageLimit: 50, // GB
        storageUsed: 15.7, // GB
      });
      setNotifications([
        {
          id: 1,
          title: 'New Teacher Request',
          message: 'Jane Doe has requested to join as a teacher.',
          date: '2023-06-10',
          read: false,
          type: 'approval'
        },
        {
          id: 2,
          title: 'New Student Request',
          message: 'Tom Wilson has requested to join as a student.',
          date: '2023-06-12',
          read: false,
          type: 'approval'
        },
        {
          id: 3,
          title: 'Subscription Renewal',
          message: 'Your subscription will renew in 30 days.',
          date: '2023-06-01',
          read: true,
          type: 'system'
        }
      ]);
      setUnreadNotifications(2);
      setLoading(false);
    }, 3000); // Simulate 3 second loading time
  };

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
      opacity: 1
    }
  };

  const cardVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100
      }
    }
  };

  // Handle user action (approve/reject)
  const handleUserAction = (userId, action) => {
    // Find the user
    const user = pendingUsers.find(u => u.id === userId);
    if (!user) return;

    // Update the user's status
    const updatedPendingUsers = pendingUsers.filter(u => u.id !== userId);
    setPendingUsers(updatedPendingUsers);

    if (action === 'approve') {
      // Add to appropriate list and increment count
      if (user.role === 'teacher') {
        const newTeacher = {
          id: teachers.length + 1,
          fullName: user.fullName,
          email: user.email,
          status: 'active',
          createdAt: new Date().toISOString().split('T')[0],
          subjects: [user.originalData.subject],
          studentsCount: 0,
          classesCount: 0,
          lastActive: new Date().toISOString().split('T')[0]
        };
        setTeachers([...teachers, newTeacher]);
        setTeacherCount(teacherCount + 1);
      } else if (user.role === 'student') {
        const newStudent = {
          id: students.length + 1,
          fullName: user.fullName,
          email: user.email,
          status: 'active',
          createdAt: new Date().toISOString().split('T')[0],
          academyId: academyData.id,
          grade: user.originalData.grade,
          assignedTeacher: null,
          lastActive: new Date().toISOString().split('T')[0]
        };
        setStudents([...students, newStudent]);
        setStudentCount(studentCount + 1);
      }
    }

    // Update notifications
    const updatedNotifications = notifications.map(notification => {
      if (notification.type === 'approval' && 
          notification.message.includes(user.fullName)) {
        return { ...notification, read: true };
      }
      return notification;
    });
    setNotifications(updatedNotifications);
    setUnreadNotifications(unreadNotifications - 1);
  };

  // Render loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-lg text-gray-600">Loading your academy dashboard...</p>
        </div>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Oops! Something went wrong</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Main content */}
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          {/* Academy header */}
          <div className="bg-white shadow rounded-lg p-6 mb-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{academyData.name}</h1>
                <p className="text-sm text-gray-500">Academy ID: {academyData.id} • Created on {new Date(academyData.createdAt).toLocaleDateString()}</p>
              </div>
              <div className="mt-4 md:mt-0">
                <span className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-green-100 text-green-800">
                  {academyData.subscription.plan} Plan
                </span>
                <button className="ml-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                  Upgrade
                </button>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <nav className="flex flex-wrap">
              <button
                onClick={() => setActiveTab('overview')}
                className={`px-4 py-4 text-sm font-medium ${activeTab === 'overview' ? 'text-blue-600 border-b-2 border-blue-500' : 'text-gray-500 hover:text-gray-700'}`}
              >
                Academy Overview
              </button>
              <button
                onClick={() => setActiveTab('pending')}
                className={`px-4 py-4 text-sm font-medium ${activeTab === 'pending' ? 'text-blue-600 border-b-2 border-blue-500' : 'text-gray-500 hover:text-gray-700'} flex items-center`}
              >
                Pending Approvals
                {pendingUsers.length > 0 && (
                  <span className="ml-2 px-2 py-0.5 text-xs font-medium rounded-full bg-red-100 text-red-800">
                    {pendingUsers.length}
                  </span>
                )}
              </button>
              <button
                onClick={() => setActiveTab('teachers')}
                className={`px-4 py-4 text-sm font-medium ${activeTab === 'teachers' ? 'text-blue-600 border-b-2 border-blue-500' : 'text-gray-500 hover:text-gray-700'} flex items-center`}
              >
                <FaChalkboardTeacher className="mr-1" /> Teachers
              </button>
              <button
                onClick={() => setActiveTab('students')}
                className={`px-4 py-4 text-sm font-medium ${activeTab === 'students' ? 'text-blue-600 border-b-2 border-blue-500' : 'text-gray-500 hover:text-gray-700'} flex items-center`}
              >
                <FaUserGraduate className="mr-1" /> Students
              </button>
              <button
                onClick={() => {
                  setActiveTab('classes');
                  setActiveSubTab('upcoming');
                }}
                className={`px-4 py-4 text-sm font-medium ${activeTab === 'classes' ? 'text-blue-600 border-b-2 border-blue-500' : 'text-gray-500 hover:text-gray-700'} flex items-center`}
              >
                <FaCalendarAlt className="mr-1" /> Classes
              </button>
              <button
                onClick={() => setActiveTab('resources')}
                className={`px-4 py-4 text-sm font-medium ${activeTab === 'resources' ? 'text-blue-600 border-b-2 border-blue-500' : 'text-gray-500 hover:text-gray-700'} flex items-center`}
              >
                <FaBook className="mr-1" /> Resources
              </button>
              <button
                onClick={() => setActiveTab('payments')}
                className={`px-4 py-4 text-sm font-medium ${activeTab === 'payments' ? 'text-blue-600 border-b-2 border-blue-500' : 'text-gray-500 hover:text-gray-700'} flex items-center`}
              >
                <FaCreditCard className="mr-1" /> Payments
              </button>
              <button
                onClick={() => setActiveTab('zoom')}
                className={`px-4 py-4 text-sm font-medium ${activeTab === 'zoom' ? 'text-blue-600 border-b-2 border-blue-500' : 'text-gray-500 hover:text-gray-700'} flex items-center`}
              >
                <FaVideo className="mr-1" /> Zoom Credits
              </button>
              <button
                onClick={() => setActiveTab('notifications')}
                className={`px-4 py-4 text-sm font-medium ${activeTab === 'notifications' ? 'text-blue-600 border-b-2 border-blue-500' : 'text-gray-500 hover:text-gray-700'} flex items-center`}
              >
                <FaBell className="mr-1" /> Notifications
                {unreadNotifications > 0 && (
                  <span className="ml-2 px-2 py-0.5 text-xs font-medium rounded-full bg-red-100 text-red-800">
                    {unreadNotifications}
                  </span>
                )}
              </button>
            </nav>

            <div className="p-6">
              <AnimatePresence mode="wait">
                {/* Overview Tab */}
                {activeTab === 'overview' && (
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
                            <div className="flex-shrink-0 bg-purple-500 rounded-md p-3">
                              <FaCalendarAlt className="h-6 w-6 text-white" />
                            </div>
                            <div className="ml-5 w-0 flex-1">
                              <dl>
                                <dt className="text-sm font-medium text-gray-500 truncate">Active Classes</dt>
                                <dd>
                                  <div className="text-lg font-medium text-gray-900">
                                    {classes.filter(c => c.status === 'upcoming' || c.status === 'ongoing').length}
                                  </div>
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
                                  <div className="text-lg font-medium text-gray-900">{zoomCredits.available}</div>
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
                            <span>Students ({studentCount}/{subscriptionUsage.studentsLimit})</span>
                            <span>{Math.round((studentCount / subscriptionUsage.studentsLimit) * 100)}%</span>
                          </div>
                          <div className="mt-2 w-full bg-gray-200 rounded-full h-2.5">
                            <div 
                              className="bg-blue-600 h-2.5 rounded-full" 
                              style={{ width: `${(studentCount / subscriptionUsage.studentsLimit) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between text-sm font-medium">
                            <span>Teachers ({teacherCount}/{subscriptionUsage.teachersLimit})</span>
                            <span>{Math.round((teacherCount / subscriptionUsage.teachersLimit) * 100)}%</span>
                          </div>
                          <div className="mt-2 w-full bg-gray-200 rounded-full h-2.5">
                            <div 
                              className="bg-green-600 h-2.5 rounded-full" 
                              style={{ width: `${(teacherCount / subscriptionUsage.teachersLimit) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between text-sm font-medium">
                            <span>Storage ({subscriptionUsage.storageUsed.toFixed(1)}/{subscriptionUsage.storageLimit} GB)</span>
                            <span>{Math.round((subscriptionUsage.storageUsed / subscriptionUsage.storageLimit) * 100)}%</span>
                          </div>
                          <div className="mt-2 w-full bg-gray-200 rounded-full h-2.5">
                            <div 
                              className="bg-purple-600 h-2.5 rounded-full" 
                              style={{ width: `${(subscriptionUsage.storageUsed / subscriptionUsage.storageLimit) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Quick Links */}
                    <div className="mt-6 bg-white shadow rounded-lg p-6">
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <button className="flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                          Add New Teacher
                        </button>
                        <button className="flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                          Add New Student
                        </button>
                        <button className="flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500">
                          Schedule New Class
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Zoom Credits Tab */}
                {activeTab === 'zoom' && (
                  <ZoomCreditsTab zoomCredits={zoomCredits} />
                )}

                {/* Classes Tab */}
                {activeTab === 'classes' && (
                  <ClassesTab 
                    classes={classes} 
                    activeSubTab={activeSubTab} 
                    setActiveSubTab={setActiveSubTab} 
                  />
                )}

                {/* Resources Tab */}
                {activeTab === 'resources' && (
                  <ResourcesTab resources={resources} classes={classes} />
                )}

                {/* Other tabs would be implemented similarly */}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AcademyDashboard;