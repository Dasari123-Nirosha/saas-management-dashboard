
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Bell,
  Sun,
  Moon,
  ChevronDown,
  Menu,
  CheckCheck,
  X,
  Circle,
  LayoutDashboard,
  Users,
  CreditCard,
  Package,
  UserRound,
  Activity,
  TrendingUp,
  ArrowRight,
} from "lucide-react";

import { useTheme } from "../../context/ThemeContext";

import {
  getNotifications,
  saveNotifications,
  NOTIFICATION_EVENT,
} from "../../utils/notifications";

const SEARCH_PAGES = [
  {
    title: "Dashboard",
    description: "Overview and summary",
    path: "/",
    keywords: ["home", "overview", "dashboard", "summary"],
    icon: LayoutDashboard,
  },
  {
    title: "Users",
    description: "Manage users",
    path: "/users",
    keywords: ["user", "users", "members", "accounts"],
    icon: Users,
  },
  {
    title: "Subscriptions",
    description: "Manage subscriptions",
    path: "/subscriptions",
    keywords: ["subscription", "subscriptions", "billing", "renewals"],
    icon: CreditCard,
  },
  {
    title: "Plans",
    description: "Manage plans and pricing",
    path: "/plans",
    keywords: ["plan", "plans", "pricing", "packages", "starter", "professional"],
    icon: Package,
  },
  {
    title: "Customers",
    description: "View customer records",
    path: "/customers",
    keywords: ["customer", "customers", "clients"],
    icon: UserRound,
  },
  {
    title: "Usage Analytics",
    description: "Usage trends and performance",
    path: "/usage-analytics",
    keywords: ["usage", "analytics", "performance", "api", "activity"],
    icon: Activity,
  },
  {
    title: "Revenue Analytics",
    description: "Revenue and growth reports",
    path: "/revenue-analytics",
    keywords: [
      "revenue",
      "income",
      "growth",
      "earnings",
      "reports",
      "payment",
      "invoice",
    ],
    icon: TrendingUp,
  },
  {
    title: "Activity",
    description: "Recent dashboard activity",
    path: "/activity",
    keywords: ["activity", "events", "history", "logs"],
    icon: Activity,
  },
];

function formatNotificationTime(time) {
  if (!time) return "";

  const date = new Date(time);

  if (Number.isNaN(date.getTime())) {
    return String(time);
  }

  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);

  if (seconds < 60) return "Just now";

  const minutes = Math.floor(seconds / 60);

  if (minutes < 60) {
    return `${minutes} minute${minutes === 1 ? "" : "s"} ago`;
  }

  const hours = Math.floor(minutes / 60);

  if (hours < 24) {
    return `${hours} hour${hours === 1 ? "" : "s"} ago`;
  }

  const days = Math.floor(hours / 24);

  if (days < 7) {
    return `${days} day${days === 1 ? "" : "s"} ago`;
  }

  return date.toLocaleDateString();
}

function getNotificationPath(notification) {
  if (
    typeof notification.path === "string" &&
    SEARCH_PAGES.some((page) => page.path === notification.path)
  ) {
    return notification.path;
  }

  const text = [
    notification.title,
    notification.message,
    notification.section,
    notification.recordName,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  if (
    text.includes("customer account") ||
    text.includes("customer registered") ||
    text.includes("new customer")
  ) {
    return "/customers";
  }

  if (
    text.includes("user registered") ||
    text.includes("new user") ||
    text.includes("user joined")
  ) {
    return "/users";
  }

  if (
    text.includes("subscription") ||
    text.includes("upgraded") ||
    text.includes("cancelled") ||
    text.includes("canceled") ||
    text.includes("renewal")
  ) {
    return "/subscriptions";
  }

  if (text.includes("payment") || text.includes("invoice")) {
    return "/revenue-analytics";
  }

  if (text.includes("customer")) return "/customers";

  if (text.includes("plan") || text.includes("pricing")) return "/plans";

  if (text.includes("usage")) return "/usage-analytics";

  if (text.includes("revenue")) return "/revenue-analytics";

  if (text.includes("activity")) return "/activity";

  return "/";
}

function Header() {
  const navigate = useNavigate();
  const searchInputRef = useRef(null);
  const searchWrapperRef = useRef(null);
  const notificationWrapperRef = useRef(null);

  // Use the existing shared theme provider.
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  const [showNotifications, setShowNotifications] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [notifications, setNotifications] = useState(getNotifications);

  const unreadCount = notifications.filter(
    (notification) => !notification.read
  ).length;

  const normalizedQuery = searchTerm.trim().toLowerCase();

  const matchingPages = normalizedQuery
    ? SEARCH_PAGES.filter((page) => {
        const searchableText = [
          page.title,
          page.description,
          ...page.keywords,
        ]
          .join(" ")
          .toLowerCase();

        return searchableText.includes(normalizedQuery);
      })
    : [];

  useEffect(() => {
    const refreshNotifications = () => {
      setNotifications(getNotifications());
    };

    window.addEventListener(NOTIFICATION_EVENT, refreshNotifications);
    window.addEventListener("storage", refreshNotifications);

    return () => {
      window.removeEventListener(NOTIFICATION_EVENT, refreshNotifications);
      window.removeEventListener("storage", refreshNotifications);
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (
        (event.ctrlKey || event.metaKey) &&
        event.key.toLowerCase() === "k"
      ) {
        event.preventDefault();
        searchInputRef.current?.focus();
        setShowSearchResults(true);
      }

      if (event.key === "Escape") {
        setShowNotifications(false);
        setShowSearchResults(false);
        setSearchTerm("");
        searchInputRef.current?.blur();

        window.dispatchEvent(
          new CustomEvent("saas-dashboard-search", { detail: "" })
        );
      }
    };

    const handleOutsideClick = (event) => {
      if (
        searchWrapperRef.current &&
        !searchWrapperRef.current.contains(event.target)
      ) {
        setShowSearchResults(false);
      }

      if (
        notificationWrapperRef.current &&
        !notificationWrapperRef.current.contains(event.target)
      ) {
        setShowNotifications(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  const openPage = (page) => {
    navigate(page.path);
    setSearchTerm("");
    setShowSearchResults(false);
    searchInputRef.current?.blur();

    window.dispatchEvent(
      new CustomEvent("saas-dashboard-search", { detail: "" })
    );
  };

  const handleSearchChange = (event) => {
    const query = event.target.value;

    setSearchTerm(query);
    setShowSearchResults(true);

    window.dispatchEvent(
      new CustomEvent("saas-dashboard-search", {
        detail: query.trim(),
      })
    );
  };

  const handleSearch = (event) => {
    event.preventDefault();

    if (!normalizedQuery) return;

    const exactPage = SEARCH_PAGES.find(
      (page) =>
        page.title.toLowerCase() === normalizedQuery ||
        page.keywords.includes(normalizedQuery)
    );

    const firstMatch = exactPage || matchingPages[0];

    if (firstMatch) {
      openPage(firstMatch);
    } else {
      setShowSearchResults(true);
    }
  };

  const markAsRead = (id) => {
    const updated = notifications.map((notification) =>
      notification.id === id
        ? { ...notification, read: true }
        : notification
    );

    saveNotifications(updated);
    setNotifications(updated);
  };

  const markAllAsRead = () => {
    const updated = notifications.map((notification) => ({
      ...notification,
      read: true,
    }));

    saveNotifications(updated);
    setNotifications(updated);
  };

  const dismissNotification = (id) => {
    const updated = notifications.filter(
      (notification) => notification.id !== id
    );

    saveNotifications(updated);
    setNotifications(updated);
  };

  const clearAllNotifications = () => {
    saveNotifications([]);
    setNotifications([]);
  };

  const handleNotificationClick = (notification) => {
    const destination = getNotificationPath(notification);

    markAsRead(notification.id);
    setShowNotifications(false);
    navigate(destination);
  };

  return (
    <header className="header">
      <div className="header__left">
        <button
          type="button"
          className="header__menu-button"
          aria-label="Open navigation menu"
          onClick={() =>
            document.dispatchEvent(new CustomEvent("toggle-sidebar"))
          }
        >
          <Menu size={21} />
        </button>

        <div className="header__breadcrumb">
          <span>Workspace</span>
          <span className="header__breadcrumb-separator">/</span>
          <strong>Management</strong>
        </div>
      </div>

      <div className="header__actions">
        <div className="header__search-wrapper" ref={searchWrapperRef}>
          <form
            className="header__search"
            onSubmit={handleSearch}
            role="search"
          >
            <Search size={18} />

            <input
              ref={searchInputRef}
              type="search"
              placeholder="Search pages..."
              aria-label="Search dashboard pages"
              autoComplete="off"
              value={searchTerm}
              onFocus={() => setShowSearchResults(true)}
              onChange={handleSearchChange}
            />

            {searchTerm ? (
              <button
                type="button"
                className="header__search-clear"
                aria-label="Clear search"
                onClick={() => {
                  setSearchTerm("");
                  setShowSearchResults(true);
                  searchInputRef.current?.focus();

                  window.dispatchEvent(
                    new CustomEvent("saas-dashboard-search", {
                      detail: "",
                    })
                  );
                }}
              >
                <X size={15} />
              </button>
            ) : (
              <kbd>Ctrl K</kbd>
            )}
          </form>

          {showSearchResults && normalizedQuery && (
            <div className="header__search-results">
              <div className="header__search-results-heading">
                <span>Pages and sections</span>
                <span>{matchingPages.length} results</span>
              </div>

              {matchingPages.length > 0 ? (
                matchingPages.map((page) => {
                  const Icon = page.icon;

                  return (
                    <button
                      key={page.path}
                      type="button"
                      className="header__search-result"
                      onClick={() => openPage(page)}
                    >
                      <span className="header__search-result-icon">
                        <Icon size={18} />
                      </span>

                      <span className="header__search-result-text">
                        <strong>{page.title}</strong>
                        <small>{page.description}</small>
                      </span>

                      <ArrowRight
                        size={16}
                        className="header__search-result-arrow"
                      />
                    </button>
                  );
                })
              ) : (
                <div className="header__search-empty">
                  <Search size={22} />
                  <strong>No matching pages</strong>
                  <p>
                    Try Users, Customers, Subscriptions, Usage, or Revenue.
                  </p>
                </div>
              )}

              <div className="header__search-footer">
                Press Esc to close
              </div>
            </div>
          )}
        </div>

        <button
          type="button"
          className="header__icon-button"
          onClick={toggleTheme}
          aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
          title="Toggle theme"
        >
          {isDark ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        <div
          className="header__notification-wrapper"
          ref={notificationWrapperRef}
        >
          <button
            type="button"
            className="header__icon-button header__notification-button"
            onClick={() => setShowNotifications((previous) => !previous)}
            aria-label={`Notifications: ${unreadCount} unread`}
            aria-expanded={showNotifications}
          >
            <Bell size={20} />

            {unreadCount > 0 && (
              <span className="header__notification-dot">
                {unreadCount > 99 ? "99+" : unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="header__notification-panel">
              <div className="header__notification-heading">
                <div>
                  <strong>Notifications</strong>
                  <span className="header__notification-count">
                    {unreadCount} new
                  </span>
                </div>

                <div className="header__notification-heading-actions">
                  {unreadCount > 0 && (
                    <button
                      type="button"
                      className="header__notification-action"
                      onClick={markAllAsRead}
                      title="Mark all as read"
                    >
                      <CheckCheck size={15} />
                      <span>Read all</span>
                    </button>
                  )}

                  {notifications.length > 0 && (
                    <button
                      type="button"
                      className="header__notification-action"
                      onClick={clearAllNotifications}
                      title="Clear all notifications"
                    >
                      Clear all
                    </button>
                  )}
                </div>
              </div>

              {notifications.length > 0 ? (
                <div className="header__notification-list">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`header__notification-item ${
                        notification.read ? "is-read" : "is-unread"
                      }`}
                    >
                      <span className="header__notification-indicator">
                        {!notification.read && (
                          <Circle size={8} fill="currentColor" />
                        )}
                      </span>

                      <button
                        type="button"
                        className="header__notification-content"
                        onClick={() =>
                          handleNotificationClick(notification)
                        }
                        title="Open related page"
                      >
                        <strong>{notification.title}</strong>
                        <p>{notification.message}</p>

                        <small>
                          {notification.recordName
                            ? `${notification.recordName} · `
                            : ""}
                          {notification.section
                            ? `${notification.section} · `
                            : ""}
                          {formatNotificationTime(notification.time)}
                        </small>
                      </button>

                      <button
                        type="button"
                        className="header__notification-dismiss"
                        aria-label={`Dismiss ${notification.title}`}
                        title="Dismiss notification"
                        onClick={() =>
                          dismissNotification(notification.id)
                        }
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="header__notification-empty">
                  <Bell size={25} />
                  <strong>You're all caught up!</strong>
                  <p>New activity will appear here.</p>
                </div>
              )}

              {notifications.length > 0 && unreadCount === 0 && (
                <div className="header__notification-footer">
                  <CheckCheck size={15} />
                  All notifications have been read
                </div>
              )}
            </div>
          )}
        </div>

        <button
          type="button"
          className="header__profile"
          aria-label="User profile"
        >
          <div className="header__avatar">DN</div>

          <div className="header__profile-info">
            <strong>Dasari Nirosha</strong>
            <span>Administrator</span>
          </div>

          <ChevronDown size={17} />
        </button>
      </div>
    </header>
  );
}

export default Header;
