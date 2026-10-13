
import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { Menu, X } from "lucide-react";

import Sidebar from "./Sidebar";
import Header from "./Header";

function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen((previous) => !previous);
  };

  useEffect(() => {
    const handleToggle = () => {
      setSidebarOpen((previous) => !previous);
    };

    document.addEventListener("toggle-sidebar", handleToggle);

    return () => {
      document.removeEventListener("toggle-sidebar", handleToggle);
    };
  }, []);

  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setSidebarOpen(false);
      }
    };

    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const closeMobileSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <div
      className={[
        "app-layout",
        sidebarCollapsed ? "app-layout--collapsed" : "",
        sidebarOpen ? "app-layout--mobile-open" : "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {sidebarOpen && (
        <button
          type="button"
          className="app-layout__overlay"
          aria-label="Close navigation"
          onClick={closeMobileSidebar}
        />
      )}

      <div className="app-layout__sidebar">
        <Sidebar
          collapsed={sidebarCollapsed}
          onToggle={() =>
            setSidebarCollapsed((previous) => !previous)
          }
        />
      </div>

      <div className="app-layout__main">
        <div className="app-layout__mobile-bar">
          <button
            type="button"
            className="app-layout__menu-button"
            onClick={toggleSidebar}
            aria-label={sidebarOpen ? "Close menu" : "Open menu"}
          >
            {sidebarOpen ? <X size={22} /> : <Menu size={22} />}
          </button>

          <span>SaaSFlow</span>
        </div>

        <Header />

        <main className="app-layout__content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default Layout;
