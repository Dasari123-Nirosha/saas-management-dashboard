
import { CheckCircle2, Clock3, XCircle, AlertCircle } from "lucide-react";

const STATUS_CONFIG = {
  active: {
    label: "Active",
    className: "status-badge--success",
    icon: CheckCircle2,
  },
  paid: {
    label: "Paid",
    className: "status-badge--success",
    icon: CheckCircle2,
  },
  completed: {
    label: "Completed",
    className: "status-badge--success",
    icon: CheckCircle2,
  },
  trial: {
    label: "Trial",
    className: "status-badge--info",
    icon: Clock3,
  },
  pending: {
    label: "Pending",
    className: "status-badge--warning",
    icon: Clock3,
  },
  "past-due": {
    label: "Past Due",
    className: "status-badge--warning",
    icon: AlertCircle,
  },
  cancelled: {
    label: "Cancelled",
    className: "status-badge--danger",
    icon: XCircle,
  },
  canceled: {
    label: "Canceled",
    className: "status-badge--danger",
    icon: XCircle,
  },
  inactive: {
    label: "Inactive",
    className: "status-badge--neutral",
    icon: AlertCircle,
  },
  failed: {
    label: "Failed",
    className: "status-badge--danger",
    icon: XCircle,
  },
  refunded: {
    label: "Refunded",
    className: "status-badge--neutral",
    icon: AlertCircle,
  },
};

function StatusBadge({
  status = "pending",
  showIcon = false,
  className = "",
}) {
  const normalizedStatus = String(status)
    .trim()
    .toLowerCase()
    .replace(/[_\s]+/g, "-");

  const config = STATUS_CONFIG[normalizedStatus] || {
    label: normalizedStatus
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" "),
    className: "status-badge--neutral",
    icon: AlertCircle,
  };

  const Icon = config.icon;

  return (
    <span
      className={`status-badge ${config.className} ${className}`.trim()}
      role="status"
    >
      {showIcon && <Icon size={14} aria-hidden="true" />}
      <span>{config.label}</span>
    </span>
  );
}

export default StatusBadge;