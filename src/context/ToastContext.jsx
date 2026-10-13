
import {
  createContext,
  useCallback,
  useContext,
  useState,
} from "react";

import Toast from "../components/common/Toast";

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((previous) =>
      previous.filter((toast) => toast.id !== id)
    );
  }, []);

  const showToast = useCallback(
    (message, type = "success", title = "") => {
      const id = `${Date.now()}-${Math.random()
        .toString(36)
        .slice(2, 7)}`;

      setToasts((previous) => [
        ...previous,
        { id, message, type, title },
      ]);

      return id;
    },
    []
  );

  const success = useCallback(
    (message, title = "Success") =>
      showToast(message, "success", title),
    [showToast]
  );

  const error = useCallback(
    (message, title = "Error") =>
      showToast(message, "error", title),
    [showToast]
  );

  const warning = useCallback(
    (message, title = "Warning") =>
      showToast(message, "warning", title),
    [showToast]
  );

  const info = useCallback(
    (message, title = "Information") =>
      showToast(message, "info", title),
    [showToast]
  );

  const value = {
    showToast,
    removeToast,
    success,
    error,
    warning,
    info,
  };

  return (
    <ToastContext.Provider value={value}>
      {children}

      <div className="toast-container" aria-live="polite">
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            type={toast.type}
            title={toast.title}
            message={toast.message}
            onClose={() => removeToast(toast.id)}
          />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error(
      "useToast must be used inside a ToastProvider"
    );
  }

  return context;
}