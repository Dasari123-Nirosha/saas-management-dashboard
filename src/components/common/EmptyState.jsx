
import { Inbox } from "lucide-react";

function EmptyState({
  title = "No data found",
  description = "There is no data to display right now.",
  icon,
  action,
  className = "",
}) {
  // Supports both icon components and JSX elements.
  const IconComponent = typeof icon === "function" ? icon : Inbox;

  const iconElement = icon
    ? typeof icon === "function"
      ? <IconComponent size={32} strokeWidth={1.7} />
      : icon.type
        ? icon
        : <Inbox size={32} strokeWidth={1.7} />
    : <Inbox size={32} strokeWidth={1.7} />;

  return (
    <div className={`empty-state ${className}`.trim()}>
      <div className="empty-state__icon">
        {iconElement}
      </div>

      <h3 className="empty-state__title">{title}</h3>

      {description && (
        <p className="empty-state__description">{description}</p>
      )}

      {action && (
        <div className="empty-state__action">
          {action}
        </div>
      )}
    </div>
  );
}

export default EmptyState;
