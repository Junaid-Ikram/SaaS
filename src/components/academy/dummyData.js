// Dummy data for the academy dashboard

// Academy data
export const dummyAcademyData = {
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

// Pending users data
export const dummyPendingUsers = [
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

// Teachers data
export const dummyTeachers = [
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

// Students data
export const dummyStudents = [
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

// Zoom credits history data
export const dummyZoomCreditsHistory = [
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

// Classes data
export const dummyClasses = [
  {
    id: 1,
    title: 'Advanced Mathematics',
    teacher: 'John Smith',
    date: new Date(Date.now() + 86400000).toISOString(), // tomorrow
    duration: 60,
    students_count: 25,
    status: 'upcoming',
    zoomLink: 'https://zoom.us/j/123456789',
    description: 'Advanced calculus and linear algebra concepts.'
  },
  {
    id: 2,
    title: 'Physics 101',
    teacher: 'Emma Johnson',
    date: new Date(Date.now() + 172800000).toISOString(), // day after tomorrow
    duration: 45,
    students_count: 18,
    status: 'upcoming',
    zoomLink: 'https://zoom.us/j/987654321',
    description: 'Introduction to mechanics and thermodynamics.'
  },
  {
    id: 3,
    title: 'Chemistry Basics',
    teacher: 'Michael Brown',
    date: new Date(Date.now() + 259200000).toISOString(), // 3 days from now
    duration: 50,
    students_count: 22,
    status: 'upcoming',
    zoomLink: 'https://zoom.us/j/456789123',
    description: 'Fundamentals of organic and inorganic chemistry.'
  },
  {
    id: 4,
    title: 'Biology Introduction',
    teacher: 'Sarah Wilson',
    date: new Date(Date.now() - 86400000).toISOString(), // yesterday
    duration: 55,
    students_count: 20,
    status: 'completed',
    zoomLink: 'https://zoom.us/j/321654987',
    description: 'Cell structure and basic biological processes.'
  },
  {
    id: 5,
    title: 'English Literature',
    teacher: 'David Lee',
    date: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
    duration: 60,
    students_count: 15,
    status: 'upcoming',
    zoomLink: 'https://zoom.us/j/789123456',
    description: 'Analysis of classic literature and writing techniques.'
  }
];

// Resources data
export const dummyResources = [
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

// Notifications data
export const dummyNotifications = [
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
];