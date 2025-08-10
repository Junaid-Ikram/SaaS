import { useState, useEffect } from 'react';

// Custom hook to load and manage dummy data
const useDummyData = () => {
  // State variables
  const [loading, setLoading] = useState(true);
  const [academyData, setAcademyData] = useState({});
  const [zoomCredits, setZoomCredits] = useState({});
  const [zoomCreditsHistory, setZoomCreditsHistory] = useState([]);
  const [classes, setClasses] = useState([]);
  const [resources, setResources] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const [pendingUsers, setPendingUsers] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [students, setStudents] = useState([]);
  const [payments, setPayments] = useState([]);
  const [subscriptionUsage, setSubscriptionUsage] = useState({});

  // Function to load dummy data
  const loadDummyData = () => {
    // Simulate API call delay
    setTimeout(() => {
      // Academy data
      setAcademyData({
        id: 'ACM-12345',
        name: 'Global Language Academy',
        createdAt: '2023-01-15T08:00:00Z',
        subscription: {
          plan: 'Professional',
          startDate: '2023-01-15T08:00:00Z',
          endDate: '2024-01-15T08:00:00Z',
          status: 'active'
        }
      });

      // Pending users
      setPendingUsers([
        { id: 'PU-001', name: 'Emma Johnson', email: 'emma.j@example.com', role: 'teacher', requestDate: '2023-06-10T14:30:00Z' },
        { id: 'PU-002', name: 'Michael Chen', email: 'michael.c@example.com', role: 'student', requestDate: '2023-06-11T09:15:00Z' },
        { id: 'PU-003', name: 'Sophia Rodriguez', email: 'sophia.r@example.com', role: 'student', requestDate: '2023-06-11T16:45:00Z' }
      ]);

      // Teachers
      setTeachers([
        { id: 'T-001', name: 'Dr. Robert Miller', email: 'robert.m@example.com', subjects: ['English Literature', 'Creative Writing'], joinDate: '2023-01-20T10:00:00Z', status: 'active' },
        { id: 'T-002', name: 'Prof. Sarah Williams', email: 'sarah.w@example.com', subjects: ['Spanish', 'French'], joinDate: '2023-02-05T11:30:00Z', status: 'active' },
        { id: 'T-003', name: 'Dr. James Lee', email: 'james.l@example.com', subjects: ['Mandarin', 'Japanese'], joinDate: '2023-02-15T09:45:00Z', status: 'active' },
        { id: 'T-004', name: 'Ms. Emily Davis', email: 'emily.d@example.com', subjects: ['German', 'Italian'], joinDate: '2023-03-01T14:15:00Z', status: 'inactive' }
      ]);

      // Students
      setStudents([
        { id: 'S-001', name: 'Alex Thompson', email: 'alex.t@example.com', enrolledClasses: ['English 101', 'Spanish Beginners'], joinDate: '2023-02-01T13:20:00Z', status: 'active' },
        { id: 'S-002', name: 'Jessica Brown', email: 'jessica.b@example.com', enrolledClasses: ['French Intermediate'], joinDate: '2023-02-10T15:45:00Z', status: 'active' },
        { id: 'S-003', name: 'Daniel Kim', email: 'daniel.k@example.com', enrolledClasses: ['Japanese 101', 'Mandarin Beginners'], joinDate: '2023-02-20T10:30:00Z', status: 'active' },
        { id: 'S-004', name: 'Olivia Martinez', email: 'olivia.m@example.com', enrolledClasses: ['German 101'], joinDate: '2023-03-05T09:15:00Z', status: 'active' },
        { id: 'S-005', name: 'Ethan Wilson', email: 'ethan.w@example.com', enrolledClasses: ['Italian Beginners'], joinDate: '2023-03-15T14:00:00Z', status: 'inactive' }
      ]);

      // Subscription usage
      setSubscriptionUsage({
        studentLimit: 100,
        studentCount: 5,
        teacherLimit: 10,
        teacherCount: 4,
        storageLimit: 50, // GB
        storageUsed: 12.5, // GB
        zoomCreditsLimit: 1000,
        zoomCreditsUsed: 350,
        recentActivity: [
          { type: 'class', description: 'New class "Advanced English" created', date: '2023-06-15' },
          { type: 'user', description: 'New student "Michael Chen" joined', date: '2023-06-14' },
          { type: 'video', description: 'Zoom meeting for "Japanese 101" completed', date: '2023-06-12' },
          { type: 'class', description: 'Class "French Intermediate" updated schedule', date: '2023-06-10' },
          { type: 'user', description: 'Teacher "Dr. James Lee" added new resource', date: '2023-06-08' }
        ]
      });

      // Zoom credits
      setZoomCredits({
        total: 1000,
        used: 350,
        remaining: 650
      });

      // Zoom credits history
      setZoomCreditsHistory([
        { id: 'ZCH-001', date: '2023-06-01T10:30:00Z', amount: 50, class: 'English 101', teacher: 'Dr. Robert Miller' },
        { id: 'ZCH-002', date: '2023-06-03T14:15:00Z', amount: 45, class: 'Spanish Beginners', teacher: 'Prof. Sarah Williams' },
        { id: 'ZCH-003', date: '2023-06-05T09:00:00Z', amount: 60, class: 'Japanese 101', teacher: 'Dr. James Lee' },
        { id: 'ZCH-004', date: '2023-06-07T16:45:00Z', amount: 40, class: 'French Intermediate', teacher: 'Prof. Sarah Williams' },
        { id: 'ZCH-005', date: '2023-06-10T11:30:00Z', amount: 55, class: 'Mandarin Beginners', teacher: 'Dr. James Lee' },
        { id: 'ZCH-006', date: '2023-06-12T13:00:00Z', amount: 50, class: 'German 101', teacher: 'Ms. Emily Davis' },
        { id: 'ZCH-007', date: '2023-06-14T15:30:00Z', amount: 50, class: 'Italian Beginners', teacher: 'Ms. Emily Davis' }
      ]);

      // Classes
      setClasses([
        { 
          id: 'C-001', 
          title: 'English 101', 
          description: 'Introduction to English language and literature', 
          teacher: 'Dr. Robert Miller',
          schedule: 'Mon, Wed, Fri 10:00 AM - 11:30 AM',
          date: '2023-06-16T10:00:00Z',
          duration: 90,
          students_count: 15,
          attendance: 12,
          status: 'upcoming',
          zoomLink: 'https://zoom.us/j/123456789'
        },
        { 
          id: 'C-002', 
          title: 'Spanish Beginners', 
          description: 'Basic Spanish for beginners', 
          teacher: 'Prof. Sarah Williams',
          schedule: 'Tue, Thu 09:00 AM - 10:30 AM',
          date: '2023-06-15T09:00:00Z',
          duration: 90,
          students_count: 12,
          attendance: 10,
          status: 'ongoing',
          zoomLink: 'https://zoom.us/j/223456789'
        },
        { 
          id: 'C-003', 
          title: 'Japanese 101', 
          description: 'Introduction to Japanese language and culture', 
          teacher: 'Dr. James Lee',
          schedule: 'Mon, Wed 01:00 PM - 02:30 PM',
          date: '2023-06-14T13:00:00Z',
          duration: 90,
          students_count: 10,
          attendance: 8,
          status: 'ended',
          zoomLink: 'https://zoom.us/j/323456789'
        },
        { 
          id: 'C-004', 
          title: 'French Intermediate', 
          description: 'Intermediate level French language course', 
          teacher: 'Prof. Sarah Williams',
          schedule: 'Tue, Thu 01:00 PM - 02:30 PM',
          date: '2023-06-17T13:00:00Z',
          duration: 90,
          students_count: 8,
          attendance: 0,
          status: 'upcoming',
          zoomLink: 'https://zoom.us/j/423456789'
        },
        { 
          id: 'C-005', 
          title: 'Mandarin Beginners', 
          description: 'Introduction to Mandarin Chinese', 
          teacher: 'Dr. James Lee',
          schedule: 'Wed, Fri 03:00 PM - 04:30 PM',
          date: '2023-06-14T15:00:00Z',
          duration: 90,
          students_count: 14,
          attendance: 12,
          status: 'ended',
          zoomLink: 'https://zoom.us/j/523456789'
        },
        { 
          id: 'C-006', 
          title: 'German 101', 
          description: 'Introduction to German language', 
          teacher: 'Ms. Emily Davis',
          schedule: 'Mon, Fri 11:00 AM - 12:30 PM',
          date: '2023-06-16T11:00:00Z',
          duration: 90,
          students_count: 7,
          attendance: 0,
          status: 'upcoming',
          zoomLink: 'https://zoom.us/j/623456789'
        },
        { 
          id: 'C-007', 
          title: 'Italian Beginners', 
          description: 'Basic Italian for beginners', 
          teacher: 'Ms. Emily Davis',
          schedule: 'Tue, Thu 03:00 PM - 04:30 PM',
          date: '2023-06-15T15:00:00Z',
          duration: 90,
          students_count: 9,
          attendance: 7,
          status: 'ongoing',
          zoomLink: 'https://zoom.us/j/723456789'
        }
      ]);

      // Resources
      setResources([
        { id: 'R-001', title: 'English Grammar Guide.pdf', type: 'document', size: '2.5 MB', uploadDate: '2023-02-05T14:30:00Z', class: 'English 101', uploader: 'Dr. Robert Miller' },
        { id: 'R-002', title: 'Spanish Vocabulary List.xlsx', type: 'spreadsheet', size: '1.8 MB', uploadDate: '2023-02-10T11:15:00Z', class: 'Spanish Beginners', uploader: 'Prof. Sarah Williams' },
        { id: 'R-003', title: 'Japanese Hiragana Chart.pdf', type: 'document', size: '3.2 MB', uploadDate: '2023-02-15T09:45:00Z', class: 'Japanese 101', uploader: 'Dr. James Lee' },
        { id: 'R-004', title: 'French Conjugation Rules.pdf', type: 'document', size: '2.1 MB', uploadDate: '2023-02-20T13:30:00Z', class: 'French Intermediate', uploader: 'Prof. Sarah Williams' },
        { id: 'R-005', title: 'Mandarin Basic Characters.pdf', type: 'document', size: '4.5 MB', uploadDate: '2023-02-25T10:00:00Z', class: 'Mandarin Beginners', uploader: 'Dr. James Lee' },
        { id: 'R-006', title: 'German Articles and Cases.pptx', type: 'presentation', size: '5.7 MB', uploadDate: '2023-03-10T15:20:00Z', class: 'German 101', uploader: 'Ms. Emily Davis' },
        { id: 'R-007', title: 'Italian Pronunciation Guide.mp3', type: 'audio', size: '8.3 MB', uploadDate: '2023-03-15T11:45:00Z', class: 'Italian Beginners', uploader: 'Ms. Emily Davis' },
        { id: 'R-008', title: 'Language Learning Tips.pdf', type: 'document', size: '1.2 MB', uploadDate: '2023-03-20T14:10:00Z', class: null, uploader: 'Dr. Robert Miller' }
      ]);

      // Notifications
      setNotifications([
        { id: 'N-001', title: 'New User Request', message: 'Emma Johnson has requested to join as a teacher', date: '2023-06-10T14:30:00Z', read: false },
        { id: 'N-002', title: 'New User Request', message: 'Michael Chen has requested to join as a student', date: '2023-06-11T09:15:00Z', read: false },
        { id: 'N-003', title: 'New User Request', message: 'Sophia Rodriguez has requested to join as a student', date: '2023-06-11T16:45:00Z', read: false },
        { id: 'N-004', title: 'Class Almost Full', message: 'Mandarin Beginners class is almost at capacity (14/15 students)', date: '2023-06-09T10:30:00Z', read: true },
        { id: 'N-005', title: 'New Resource Added', message: 'Dr. Robert Miller added "English Grammar Guide.pdf" to English 101', date: '2023-06-08T15:45:00Z', read: true },
        { id: 'N-006', title: 'Zoom Credits Update', message: '350 out of 1000 Zoom credits have been used this month', date: '2023-06-07T11:20:00Z', read: true },
        { id: 'N-007', title: 'Subscription Renewal', message: 'Your Professional plan will renew in 30 days', date: '2023-06-05T09:00:00Z', read: true }
      ]);

      // Count unread notifications
      setUnreadNotifications(notifications.filter(notification => !notification.read).length);

      // Payments
      setPayments([
        { id: 'P-001', date: '2023-01-15T08:00:00Z', amount: 299.99, description: 'Professional Plan - Annual Subscription', status: 'completed' },
        { id: 'P-002', date: '2023-02-15T10:30:00Z', amount: 50.00, description: 'Additional Zoom Credits (500)', status: 'completed' },
        { id: 'P-003', date: '2023-04-15T14:45:00Z', amount: 25.00, description: 'Storage Upgrade - 10GB', status: 'completed' },
        { id: 'P-004', date: '2023-06-01T09:15:00Z', amount: 50.00, description: 'Additional Zoom Credits (500)', status: 'pending' }
      ]);

      // Set loading to false
      setLoading(false);
    }, 3000); // 3 second delay
  };

  // Load dummy data on component mount
  useEffect(() => {
    loadDummyData();
  }, []);

  return {
    loading,
    academyData,
    zoomCredits,
    zoomCreditsHistory,
    classes,
    resources,
    notifications,
    unreadNotifications,
    pendingUsers,
    teachers,
    students,
    payments,
    subscriptionUsage,
    setNotifications,
    setUnreadNotifications,
    setPendingUsers,
    setTeachers,
    setStudents
  };
};

export default useDummyData;