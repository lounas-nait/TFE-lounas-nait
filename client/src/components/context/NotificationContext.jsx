import React, { createContext, useContext, useState } from 'react';

const NotificationContext = createContext();

export const useNotification = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
  const [notificationCount, setNotificationCount] = useState(() => {
    const notifications = JSON.parse(localStorage.getItem('notifications')) || [];
    return notifications.length;
  });

  const updateNotificationCount = (count) => {
    setNotificationCount(count);
  };

  return (
    <NotificationContext.Provider value={{ notificationCount, updateNotificationCount }}>
      {children}
    </NotificationContext.Provider>
  );
};
