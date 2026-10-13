
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  UserPlus,
  CreditCard,
  RefreshCw,
  CheckCircle2,
  XCircle,
  Settings,
  Clock,
  ArrowRight,
} from "lucide-react";

const STORAGE_KEY = "saasflow-activities";

const defaultActivities = [
  {
    id: 1,
    type: "user",
    title: "New user registered",
    description: "Karthik Reddy joined the Starter plan",
    time: "2 minutes ago",
    path: "/users",
  },
  {
    id: 2,
    type: "subscription",
    title: "Subscription upgraded",
    description: "Hasini Posa upgraded to Professional",
    time: "15 minutes ago",
    path: "/subscriptions",
  },
  {
    id: 3,
    type: "payment",
    title: "Payment received",
    description: "Enterprise subscription payment received",
    time: "35 minutes ago",
    path: "/revenue-analytics",
  },
  {
    id: 4,
    type: "success",
    title: "Customer account created",
    description: "A new customer registered successfully",
    time: "1 hour ago",
    path: "/customers",
  },
  {
    id: 5,
    type: "error",
    title: "Subscription cancelled",
    description: "A Starter subscription was cancelled",
    time: "2 hours ago",
    path: "/subscriptions",
  },
  {
    id: 6,
    type: "settings",
    title: "Invoice generated",
    description: "Monthly invoice generated successfully",
    time: "3 hours ago",
    path: "/revenue-analytics",
  },
];

const activityConfig = {
  user: { icon: UserPlus, color: "purple" },
  subscription: { icon: RefreshCw, color: "blue" },
  payment: { icon: CreditCard, color: "green" },
  success: { icon: CheckCircle2, color: "green" },
  error: { icon: XCircle, color: "red" },
  settings: { icon: Settings, color: "orange" },
};

export { defaultActivities, STORAGE_KEY };

export function recordActivity(activity) {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    const previous = saved ? JSON.parse(saved) : [];

    const newActivity = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      time: "Just now",
      ...activity,
    };

    const updated = [newActivity, ...previous].slice(0, 50);

    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event("saasflow-activity-updated"));

    return newActivity;
  } catch (error) {
    console.error("Unable to record activity:", error);
    return null;
  }
}

export default function RecentActivity({
  activities,
  title = "Recent Activity",
  description = "The latest updates across your workspace.",
  limit = 6,
  className = "",
  onViewAll,
  showAll = false,
}) {
  const navigate = useNavigate();

  const [storedActivities, setStoredActivities] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    const refreshActivities = () => {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        setStoredActivities(saved ? JSON.parse(saved) : []);
      } catch (error) {
        console.error("Unable to load recent activities:", error);
      }
    };

    window.addEventListener("storage", refreshActivities);
    window.addEventListener("saasflow-activity-updated", refreshActivities);

    return () => {
      window.removeEventListener("storage", refreshActivities);
      window.removeEventListener(
        "saasflow-activity-updated",
        refreshActivities
      );
    };
  }, []);

  const sourceActivities = activities ?? (
    storedActivities.length > 0 ? storedActivities : defaultActivities
  );

  const visibleActivities = showAll
    ? sourceActivities
    : sourceActivities.slice(0, limit);

  const openActivity = (activity) => {
    if (typeof activity?.path === "string" && activity.path.startsWith("/")) {
      navigate(activity.path);
    }
  };

  const handleViewAll = () => {
    if (onViewAll) {
      onViewAll();
    } else {
      navigate("/activity");
    }
  };

  return (
    <section className={`recent-activity ${className}`.trim()}>
      <div className="recent-activity__header">
        <div>
          <h3 className="recent-activity__title">{title}</h3>
          <p className="recent-activity__description">{description}</p>
        </div>

        {!showAll && (
          <button
            type="button"
            className="recent-activity__view-all"
            onClick={handleViewAll}
          >
            View all
            <ArrowRight size={15} />
          </button>
        )}
      </div>

      {visibleActivities.length === 0 ? (
        <div className="recent-activity__empty">
          <Clock size={24} />
          <p>No recent activity available.</p>
        </div>
      ) : (
        <div className="recent-activity__list">
          {visibleActivities.map((activity, index) => {
            const config =
              activityConfig[activity.type] || activityConfig.settings;
            const Icon = config.icon;

            return (
              <button
                type="button"
                key={activity.id ?? index}
                className="recent-activity__item"
                onClick={() => openActivity(activity)}
                aria-label={`Open ${activity.title}`}
              >
                <span
                  className={`recent-activity__icon recent-activity__icon--${config.color}`}
                >
                  <Icon size={18} />
                </span>

                <span className="recent-activity__content">
                  <span className="recent-activity__item-title">
                    {activity.title}
                  </span>
                  <span className="recent-activity__item-description">
                    {activity.description}
                  </span>
                </span>

                <time className="recent-activity__time">
                  {activity.time}
                </time>

                <ArrowRight
                  size={16}
                  className="recent-activity__item-arrow"
                />
              </button>
            );
          })}
        </div>
      )}
    </section>
  );
}
