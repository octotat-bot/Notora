import { useState, useEffect } from 'react';
import { FiCheckCircle, FiAlertCircle, FiInfo, FiX } from 'react-icons/fi';
import '../styles/Notification.css';
const Notification = ({ message, type = 'success', duration = 3000, onClose }) => {
  const [isVisible, setIsVisible] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      if (onClose) {
        setTimeout(onClose, 300); 
      }
    }, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);
  const handleClose = () => {
    setIsVisible(false);
    if (onClose) {
      setTimeout(onClose, 300); 
    }
  };
  const getIcon = () => {
    switch (type) {
      case 'success':
        return <FiCheckCircle className="notification-icon success" />;
      case 'error':
        return <FiAlertCircle className="notification-icon error" />;
      case 'info':
        return <FiInfo className="notification-icon info" />;
      default:
        return <FiInfo className="notification-icon info" />;
    }
  };
  return (
    <div className={`notification ${type} ${isVisible ? 'visible' : 'hidden'}`}>
      <div className="notification-content">
        {getIcon()}
        <span className="notification-message">{message}</span>
      </div>
      <button className="notification-close" onClick={handleClose}>
        <FiX />
      </button>
    </div>
  );
};
export default Notification;