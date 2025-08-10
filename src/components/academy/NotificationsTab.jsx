import React from 'react';
import { motion } from 'framer-motion';
import { FaBell, FaCheck, FaTrash } from 'react-icons/fa';

const NotificationsTab = ({ notifications, setNotifications, setUnreadNotifications }) => {
  const markAllAsRead = () => {
    const updatedNotifications = notifications.map(notification => ({
      ...notification,
      read: true
    }));
    setNotifications(updatedNotifications);
    setUnreadNotifications(0);
  };

  const markAsRead = (id) => {
    const updatedNotifications = notifications.map(notification =>
      notification.id === id ? { ...notification, read: true } : notification
    );
    setNotifications(updatedNotifications);
    setUnreadNotifications(updatedNotifications.filter(n => !n.read).length);
  };

  const deleteNotification = (id) => {
    const updatedNotifications = notifications.filter(notification => notification.id !== id);
    setNotifications(updatedNotifications);
    setUnreadNotifications(updatedNotifications.filter(n => !n.read).length);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <FaBell className="text-blue-600 mr-2" />
            <h3 className="text-xl font-bold text-gray-800">Notifications</h3>
            {notifications.filter(n => !n.read).length > 0 && (
              <span className="ml-2 px-2 py-0.5 text-xs font-medium rounded-full bg-red-500 text-white">
                {notifications.filter(n => !n.read).length}
              </span>
            )}
          </div>
          <button
            onClick={markAllAsRead}
            className="text-sm text-blue-600 hover:text-blue-800 font-medium"
          >
            Mark all as read
          </button>
        </div>

        {notifications.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">No notifications</p>
          </div>
        ) : (
          <div className="space-y-4">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-4 rounded-lg border ${notification.read ? 'bg-white border-gray-200' : 'bg-blue-50 border-blue-200'}`}
              >
                <div className="flex justify-between">
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <h4 className={`font-medium ${notification.read ? 'text-gray-800' : 'text-blue-800'}`}>
                        {notification.title}
                      </h4>
                      <span className="text-xs text-gray-500">{notification.time}</span>
                    </div>
                    <p className="mt-1 text-sm text-gray-600">{notification.message}</p>
                  </div>
                  <div className="flex items-start ml-4 space-x-2">
                    {!notification.read && (
                      <button
                        onClick={() => markAsRead(notification.id)}
                        className="p-1 text-blue-600 hover:text-blue-800 rounded-full hover:bg-blue-100"
                        title="Mark as read"
                      >
                        <FaCheck size={14} />
                      </button>
                    )}
                    <button
                      onClick={() => deleteNotification(notification.id)}
                      className="p-1 text-red-600 hover:text-red-800 rounded-full hover:bg-red-100"
                      title="Delete notification"
                    >
                      <FaTrash size={14} />
                    </button>
                  </div>
                </div>
                {notification.actionLink && (
                  <div className="mt-2">
                    <a
                      href={notification.actionLink}
                      className="text-sm font-medium text-blue-600 hover:text-blue-800"
                    >
                      {notification.actionText || 'View details'}
                    </a>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default NotificationsTab;