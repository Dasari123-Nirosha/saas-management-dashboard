
import {
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  Info,
  X,
} from "lucide-react";

const toastIcons = {
  success: CheckCircle2,
  error: AlertCircle,
  warning: AlertTriangle,
  info: Info,
};

function Toast({
  type = "success",
  title,
  message,
  onClose,
  className = "",
}) {
  const Icon = toastIcons[type] || Info;

  const defaultTitles = {
    success: "Success",
    error: "Error",
    warning: "Warning",
    info: "Information",
  };

  return (
    <div
      className={`toast toast--${type} ${className}`.trim()}
      role={type === "error" ? "alert" : "status"}
      aria-live={type === "error" ? "assertive" : "polite"}
    >
      <div className="toast__icon">
        <Icon size={22} />
      </div>

      <div className="toast__content">
        <h4 className="toast__title">
          {title || defaultTitles[type] || "Notification"}
        </h4>

        {message && (
          <p className="toast__message">{message}</p>
        )}
      </div>

      {onClose && (
        <button
          type="button"
          className="toast__close"
          onClick={onClose}
          aria-label="Close notification"
        >
          <X size={18} />
        </button>
      )}
    </div>
  );
}

export default Toast;