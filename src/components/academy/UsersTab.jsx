import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  FaSearch,
  FaUserCheck,
  FaUserTimes,
  FaChalkboardTeacher,
  FaUserGraduate,
} from 'react-icons/fa';

const emptyListMessage = {
  teachers: 'No teachers found',
  students: 'No students found',
  pending: 'No pending approvals',
};

const toSearchableString = (value) => (value ?? '').toLowerCase();

const SUMMARY_TEMPLATE = { approved: 0, pending: 0, rejected: 0, inactive: 0 };

const UsersTab = ({
  teachers = [],
  students = [],
  pendingUsers = [],
  teacherSummary = SUMMARY_TEMPLATE,
  studentSummary = SUMMARY_TEMPLATE,
  onApproveUser,
  onRejectUser,
}) => {
  const [activeSubTab, setActiveSubTab] = useState('teachers');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [actionLoadingId, setActionLoadingId] = useState(null);
  const [actionError, setActionError] = useState(null);
  const [actionSuccess, setActionSuccess] = useState(null);
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [userPendingAction, setUserPendingAction] = useState(null);

  const teacherStats = teacherSummary ?? SUMMARY_TEMPLATE;
  const studentStats = studentSummary ?? SUMMARY_TEMPLATE;
  const totalPending = pendingUsers.length;

  const summaryCards = useMemo(() => {
    const teacherPending = teacherStats.pending ?? 0;
    const studentPending = studentStats.pending ?? 0;
    return [
      {
        key: 'teachers',
        label: 'Approved Teachers',
        value: teacherStats.approved ?? teachers.length,
        hint: `${teacherPending} pending • ${teacherStats.inactive ?? 0} inactive`,
        Icon: FaChalkboardTeacher,
      },
      {
        key: 'students',
        label: 'Approved Students',
        value: studentStats.approved ?? students.length,
        hint: `${studentPending} pending`,
        Icon: FaUserGraduate,
      },
      {
        key: 'pending',
        label: 'Pending Approvals',
        value: totalPending,
        hint: `${teacherPending + studentPending} awaiting review`,
        Icon: FaUserTimes,
      },
    ];
  }, [studentStats, teacherStats, students.length, teachers.length, totalPending]);

  const normalisedSearch = searchTerm.trim().toLowerCase();

  const filterUsers = (list = []) => {
    if (!normalisedSearch) return list;
    return list.filter((user) => {
      const name = toSearchableString(user?.name);
      const email = toSearchableString(user?.email);
      return name.includes(normalisedSearch) || email.includes(normalisedSearch);
    });
  };

  const filteredTeachers = useMemo(() => filterUsers(teachers), [teachers, normalisedSearch]);
  const filteredStudents = useMemo(() => filterUsers(students), [students, normalisedSearch]);
  const filteredPending = useMemo(() => filterUsers(pendingUsers), [pendingUsers, normalisedSearch]);

  const handleViewUser = (user) => {
    setSelectedUser(user);
    setShowUserModal(true);
  };

  const handleApprove = async (user) => {
    if (!onApproveUser || !user?.id) {
      return;
    }

    try {
      setActionError(null);
      setActionSuccess(null);
      setActionLoadingId(user.id);
      const result = await onApproveUser(user.id);
      if (result?.success === false) {
        setActionError(result.error ?? 'Unable to approve user.');
      } else {
        setActionSuccess('User approved successfully.');
      }
    } catch (error) {
      setActionError(error instanceof Error ? error.message : 'Unable to approve user.');
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleReject = (user) => {
    if (!user?.id) {
      return;
    }

    setActionError(null);
    setActionSuccess(null);
    setRejectReason('');
    setUserPendingAction(user);
    setRejectModalOpen(true);
  };

  const closeRejectModal = () => {
    setRejectModalOpen(false);
    setRejectReason('');
    setUserPendingAction(null);
    setActionLoadingId(null);
    setActionError(null);
  };

  const submitReject = async () => {
    if (!onRejectUser || !userPendingAction?.id) {
      return;
    }

    const trimmedReason = rejectReason.trim();
    if (!trimmedReason) {
      setActionError('Rejection reason is required.');
      return;
    }

    try {
      setActionError(null);
      setActionSuccess(null);
      setActionLoadingId(userPendingAction.id);
      const result = await onRejectUser(userPendingAction.id, trimmedReason);
      if (result?.success === false) {
        setActionError(result.error ?? 'Unable to reject user.');
      } else {
        setActionSuccess('User rejected successfully.');
        closeRejectModal();
      }
    } catch (error) {
      setActionError(error instanceof Error ? error.message : 'Unable to reject user.');
    } finally {
      setActionLoadingId(null);
    }
  };

  useEffect(() => {
    if (!actionSuccess) return;
    const timer = setTimeout(() => setActionSuccess(null), 3000);
    return () => clearTimeout(timer);
  }, [actionSuccess]);

  const renderEmptyState = (type) => (
    <div className="text-center py-8">
      <p className="text-gray-500">{emptyListMessage[type]}</p>
    </div>
  );

  const renderStatsRow = (primary, secondary) => (
    <p>
      {primary}
      {secondary ? ` | ${secondary}` : ''}
    </p>
  );

  const renderTeachers = () => (
    <div className="bg-white shadow overflow-hidden sm:rounded-md">
      {filteredTeachers.length === 0
        ? renderEmptyState('teachers')
        : (
          <ul className="divide-y divide-gray-200">
            {filteredTeachers.map((teacher) => (
              <li key={teacher.id}>
                <div className="px-4 py-4 flex items-center sm:px-6">
                  <div className="min-w-0 flex-1 sm:flex sm:items-center sm:justify-between">
                    <div>
                      <div className="flex text-sm">
                        <p className="font-medium text-blue-600 truncate">{teacher.name}</p>
                        <p className="ml-1 flex-shrink-0 font-normal text-gray-500">{teacher.email}</p>
                      </div>
                      <div className="mt-2 text-sm text-gray-500">
                        {renderStatsRow(`Joined ${teacher.joinDate ?? '—'}`, `${teacher.classes ?? 0} classes`)}
                      </div>
                    </div>
                    <div className="mt-4 flex-shrink-0 sm:mt-0 sm:ml-5">
                      <button
                        onClick={() => handleViewUser(teacher)}
                        className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        View Profile
                      </button>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
    </div>
  );

  const renderStudents = () => (
    <div className="bg-white shadow overflow-hidden sm:rounded-md">
      {filteredStudents.length === 0
        ? renderEmptyState('students')
        : (
          <ul className="divide-y divide-gray-200">
            {filteredStudents.map((student) => (
              <li key={student.id}>
                <div className="px-4 py-4 flex items-center sm:px-6">
                  <div className="min-w-0 flex-1 sm:flex sm:items-center sm:justify-between">
                    <div>
                      <div className="flex text-sm">
                        <p className="font-medium text-blue-600 truncate">{student.name}</p>
                        <p className="ml-1 flex-shrink-0 font-normal text-gray-500">{student.email}</p>
                      </div>
                      <div className="mt-2 text-sm text-gray-500">
                        {renderStatsRow(`Joined ${student.joinDate ?? '—'}`, `${student.enrolledClasses ?? 0} classes`)}
                      </div>
                    </div>
                    <div className="mt-4 flex-shrink-0 sm:mt-0 sm:ml-5">
                      <button
                        onClick={() => handleViewUser(student)}
                        className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        View Profile
                      </button>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
    </div>
  );

  const renderPending = () => (
    <div className="bg-white shadow overflow-hidden sm:rounded-md">
      {filteredPending.length === 0
        ? renderEmptyState('pending')
        : (
          <ul className="divide-y divide-gray-200">
            {filteredPending.map((user) => {
              const isProcessing = actionLoadingId === user.id;
              return (
                <li key={user.id}>
                  <div className="px-4 py-4 flex items-center sm:px-6">
                    <div className="min-w-0 flex-1 sm:flex sm:items-center sm:justify-between">
                      <div>
                        <div className="flex text-sm">
                          <p className="font-medium text-blue-600 truncate">{user.name}</p>
                          <p className="ml-1 flex-shrink-0 font-normal text-gray-500">{user.email}</p>
                        </div>
                        <div className="mt-2 text-sm text-gray-500">
                          {renderStatsRow(
                            `Requested ${user.requestDate ?? '—'}`,
                            `Role: ${(user.role ?? '').replace('_', ' ').replace(/\b\w/g, (c) => c.toUpperCase())}`,
                          )}
                        </div>
                      </div>
                      <div className="mt-4 flex-shrink-0 sm:mt-0 sm:ml-5">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleApprove(user)}
                            disabled={isProcessing}
                            className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-green-700 bg-green-100 hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-60"
                          >
                            <FaUserCheck className="mr-1" />
                            {isProcessing ? 'Processing…' : 'Approve'}
                          </button>
                          <button
                            onClick={() => handleReject(user)}
                            disabled={isProcessing}
                            className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-60"
                          >
                            <FaUserTimes className="mr-1" />
                            {isProcessing ? 'Processing…' : 'Reject'}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {summaryCards.map((card) => (
          <div
            key={card.key}
            className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-4 shadow-sm"
          >
            <div>
              <p className="text-sm text-gray-500">{card.label}</p>
              <p className="mt-2 text-2xl font-semibold text-gray-900">{card.value}</p>
              {card.hint && <p className="mt-1 text-xs text-gray-400">{card.hint}</p>}
            </div>
            <div className="rounded-full bg-gray-100 p-3 text-gray-600">
              <card.Icon className="h-5 w-5" />
            </div>
          </div>
        ))}
      </div>
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveSubTab('teachers')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeSubTab === 'teachers'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center">
              <FaChalkboardTeacher className="mr-2" />
              Teachers
            </div>
          </button>
          <button
            onClick={() => setActiveSubTab('students')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeSubTab === 'students'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center">
              <FaUserGraduate className="mr-2" />
              Students
            </div>
          </button>
          <button
            onClick={() => setActiveSubTab('pending')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeSubTab === 'pending'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
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
            onChange={(event) => setSearchTerm(event.target.value)}
          />
        </div>
      </div>

      {actionError && (
        <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">{actionError}</div>
      )}

      {actionSuccess && (
        <div className="rounded-md border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700">{actionSuccess}</div>
      )}

      {activeSubTab === 'teachers' && renderTeachers()}
      {activeSubTab === 'students' && renderStudents()}
      {activeSubTab === 'pending' && renderPending()}

      {rejectModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 px-4">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
            <h3 className="text-lg font-semibold text-gray-900">Reject Application</h3>
            <p className="mt-2 text-sm text-gray-600">
              Provide a reason for rejecting {userPendingAction?.name ?? 'this user'}.
            </p>
            <textarea
              className="mt-4 w-full rounded-md border border-gray-300 p-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              rows={4}
              value={rejectReason}
              onChange={(event) => setRejectReason(event.target.value)}
              placeholder="Reason for rejection"
            />
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={closeRejectModal}
                className="inline-flex items-center rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={submitReject}
                disabled={actionLoadingId === userPendingAction?.id}
                className={`inline-flex items-center rounded-md border border-transparent px-4 py-2 text-sm font-medium text-white ${
                  actionLoadingId === userPendingAction?.id
                    ? 'bg-red-300 cursor-not-allowed'
                    : 'bg-red-600 hover:bg-red-700'
                }`}
              >
                {actionLoadingId === userPendingAction?.id ? 'Rejecting...' : 'Reject'}
              </button>
            </div>
          </div>
        </div>
      )}

      {showUserModal && selectedUser && (
        <div className="fixed z-50 inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" />
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
              <div>
                <div className="mt-3 text-center sm:mt-5">
                  <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                    {selectedUser.name}
                  </h3>
                  <div className="mt-2 space-y-2">
                    <p className="text-sm text-gray-500">Email: {selectedUser.email}</p>
                    {selectedUser.phoneNumber && (
                      <p className="text-sm text-gray-500">Phone: {selectedUser.phoneNumber}</p>
                    )}
                    {selectedUser.joinDate && (
                      <p className="text-sm text-gray-500">Joined: {selectedUser.joinDate}</p>
                    )}
                    {selectedUser.status && (
                      <p className="text-sm text-gray-500">Status: {selectedUser.status}</p>
                    )}
                  </div>
                </div>
              </div>
              <div className="mt-5 sm:mt-6">
                <button
                  type="button"
                  className="inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:text-sm"
                  onClick={() => setShowUserModal(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default UsersTab;






