import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FaSearch, 
  FaFilter, 
  FaUserCheck, 
  FaUserTimes, 
  FaUserEdit, 
  FaTrash, 
  FaChalkboardTeacher, 
  FaUserGraduate,
  FaPlus
} from 'react-icons/fa';

const UsersTab = ({ 
  teachers, 
  students, 
  pendingUsers, 
  setPendingUsers,
  setTeachers,
  setStudents
}) => {
  const [activeSubTab, setActiveSubTab] = useState('teachers');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);

  // Filter users based on search term
  const filterUsers = (users) => {
    return users.filter(user => 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const filteredTeachers = filterUsers(teachers);
  const filteredStudents = filterUsers(students);
  const filteredPendingUsers = filterUsers(pendingUsers);

  const handleApproveUser = (userId) => {
    // Find the user in pending users
    const user = pendingUsers.find(u => u.id === userId);
    if (!user) return;

    // Remove from pending users
    const updatedPendingUsers = pendingUsers.filter(u => u.id !== userId);
    setPendingUsers(updatedPendingUsers);

    // Add to appropriate list based on role
    if (user.role === 'teacher') {
      setTeachers([...teachers, user]);
    } else {
      setStudents([...students, user]);
    }
  };

  const handleRejectUser = (userId) => {
    // Remove from pending users
    const updatedPendingUsers = pendingUsers.filter(u => u.id !== userId);
    setPendingUsers(updatedPendingUsers);
  };

  const handleViewUser = (user) => {
    setSelectedUser(user);
    setShowUserModal(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Sub-tabs navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveSubTab('teachers')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${activeSubTab === 'teachers' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
          >
            <div className="flex items-center">
              <FaChalkboardTeacher className="mr-2" />
              Teachers
            </div>
          </button>
          <button
            onClick={() => setActiveSubTab('students')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${activeSubTab === 'students' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
          >
            <div className="flex items-center">
              <FaUserGraduate className="mr-2" />
              Students
            </div>
          </button>
          <button
            onClick={() => setActiveSubTab('pending')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${activeSubTab === 'pending' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
          >
            <div className="flex items-center">
              <FaUserCheck className="mr-2" />
              Pending Approvals
              {pendingUsers.length > 0 && (
                <span className="ml-2 px-2 py-0.5 text-xs font-medium rounded-full bg-red-500 text-white">
                  {pendingUsers.length}
                </span>
              )}
            </div>
          </button>
        </nav>
      </div>

      {/* Search and filter */}
      <div className="flex flex-col sm:flex-row justify-between items-center space-y-3 sm:space-y-0">
        <div className="relative w-full sm:w-64">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FaSearch className="text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => setShowAddUserModal(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <FaPlus className="mr-2" />
            Add User
          </button>
        </div>
      </div>

      {/* Teachers Tab */}
      {activeSubTab === 'teachers' && (
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          {filteredTeachers.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No teachers found</p>
            </div>
          ) : (
            <ul className="divide-y divide-gray-200">
              {filteredTeachers.map((teacher) => (
                <li key={teacher.id}>
                  <div className="px-4 py-4 flex items-center sm:px-6">
                    <div className="min-w-0 flex-1 sm:flex sm:items-center sm:justify-between">
                      <div>
                        <div className="flex text-sm">
                          <p className="font-medium text-blue-600 truncate">{teacher.name}</p>
                          <p className="ml-1 flex-shrink-0 font-normal text-gray-500">
                            {teacher.email}
                          </p>
                        </div>
                        <div className="mt-2 flex">
                          <div className="flex items-center text-sm text-gray-500">
                            <p>
                              Joined {teacher.joinDate} • {teacher.classes} classes
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="mt-4 flex-shrink-0 sm:mt-0 sm:ml-5">
                        <div className="flex -space-x-1 overflow-hidden">
                          <button
                            onClick={() => handleViewUser(teacher)}
                            className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                          >
                            View Profile
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* Students Tab */}
      {activeSubTab === 'students' && (
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          {filteredStudents.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No students found</p>
            </div>
          ) : (
            <ul className="divide-y divide-gray-200">
              {filteredStudents.map((student) => (
                <li key={student.id}>
                  <div className="px-4 py-4 flex items-center sm:px-6">
                    <div className="min-w-0 flex-1 sm:flex sm:items-center sm:justify-between">
                      <div>
                        <div className="flex text-sm">
                          <p className="font-medium text-blue-600 truncate">{student.name}</p>
                          <p className="ml-1 flex-shrink-0 font-normal text-gray-500">
                            {student.email}
                          </p>
                        </div>
                        <div className="mt-2 flex">
                          <div className="flex items-center text-sm text-gray-500">
                            <p>
                              Joined {student.joinDate} • {student.enrolledClasses} classes
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="mt-4 flex-shrink-0 sm:mt-0 sm:ml-5">
                        <div className="flex -space-x-1 overflow-hidden">
                          <button
                            onClick={() => handleViewUser(student)}
                            className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                          >
                            View Profile
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* Pending Approvals Tab */}
      {activeSubTab === 'pending' && (
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          {filteredPendingUsers.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No pending approvals</p>
            </div>
          ) : (
            <ul className="divide-y divide-gray-200">
              {filteredPendingUsers.map((user) => (
                <li key={user.id}>
                  <div className="px-4 py-4 flex items-center sm:px-6">
                    <div className="min-w-0 flex-1 sm:flex sm:items-center sm:justify-between">
                      <div>
                        <div className="flex text-sm">
                          <p className="font-medium text-blue-600 truncate">{user.name}</p>
                          <p className="ml-1 flex-shrink-0 font-normal text-gray-500">
                            {user.email}
                          </p>
                        </div>
                        <div className="mt-2 flex">
                          <div className="flex items-center text-sm text-gray-500">
                            <p>
                              Requested {user.requestDate} • Role: {user.role === 'teacher' ? 'Teacher' : 'Student'}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="mt-4 flex-shrink-0 sm:mt-0 sm:ml-5">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleApproveUser(user.id)}
                            className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-green-700 bg-green-100 hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                          >
                            <FaUserCheck className="mr-1" />
                            Approve
                          </button>
                          <button
                            onClick={() => handleRejectUser(user.id)}
                            className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                          >
                            <FaUserTimes className="mr-1" />
                            Reject
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </motion.div>
  );
};

export default UsersTab;