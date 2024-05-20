import React from 'react';
const EmptyState = ({ icon, title, message, action }) => {
  return (
    <div className="empty-state">
      {icon && <div className="empty-state-icon">{icon}</div>}
      {title && <h2>{title}</h2>}
      {message && <p>{message}</p>}
      {action && <div className="empty-state-action">{action}</div>}
    </div>
  );
};
export default EmptyState;