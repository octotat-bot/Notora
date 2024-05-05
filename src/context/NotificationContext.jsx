import React, { createContext, useContext, useState, useCallback } from 'react';
import Notification from '../components/Notification';
const NotificationContext = createContext();
export const useNotification = () => useContext(NotificationContext);
export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const showNotification = useCallback((message, type = 'success', duration = 3000) => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, message, type, duration }]);
    return id;
  }, []);
  const closeNotification = useCallback((id) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  }, []);
  const showSuccess = useCallback((message, duration = 3000) => {
    return showNotification(message, 'success', duration);
  }, [showNotification]);
  const showError = useCallback((message, duration = 3000) => {
    return showNotification(message, 'error', duration);
  }, [showNotification]);
  const showInfo = useCallback((message, duration = 3000) => {
    return showNotification(message, 'info', duration);
  }, [showNotification]);
  return (
    <NotificationContext.Provider 
      value={{ 
        showNotification, 
        closeNotification,
        showSuccess,
        showError,
        showInfo
      }}
    >
      {children}
      {notifications.map(notification => (
        <Notification
          key={notification.id}
          message={notification.message}
          type={notification.type}
          duration={notification.duration}
          onClose={() => closeNotification(notification.id)}
        />
      ))}
    </NotificationContext.Provider>
  );
};
export default NotificationProvider;