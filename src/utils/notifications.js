const STORAGE_KEY = "saas-dashboard-notifications";
const NOTIFICATION_EVENT = "saas-dashboard-notification";

export function getNotifications() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return [];

    const parsed = JSON.parse(saved);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error("Error loading notifications:", error);
    return [];
  }
}

export function addNotification({
  title,
  message,
  section,
  recordName,
}) {
  const notification = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
    title,
    message,
    section,
    recordName,
    time: new Date().toISOString(),
    read: false,
  };

  const notifications = getNotifications();

  const updatedNotifications = [
    notification,
    ...notifications,
  ];

  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(updatedNotifications)
    );
  } catch (error) {
    console.error("Error saving notification:", error);
  }

  window.dispatchEvent(
    new CustomEvent(NOTIFICATION_EVENT, {
      detail: notification,
    })
  );

  return notification;
}

export function saveNotifications(notifications) {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(notifications)
  );

  window.dispatchEvent(
    new CustomEvent(NOTIFICATION_EVENT)
  );
}

export { STORAGE_KEY, NOTIFICATION_EVENT };