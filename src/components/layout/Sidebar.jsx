import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  CreditCard,
  Package,
  Building2,
  ChartNoAxesCombined,
  ChartColumnIncreasing,
  PanelLeftClose,
  PanelLeftOpen,
  Layers,
} from "lucide-react";

const navigation = [
  {
    label: "OVERVIEW",
    items: [
      {
        name: "Dashboard",
        path: "/",
        icon: LayoutDashboard,
        end: true,
      },
    ],
  },
  {
    label: "MANAGEMENT",
    items: [
      { name: "Users", path: "/users", icon: Users },
      {
        name: "Subscriptions",
        path: "/subscriptions",
        icon: CreditCard,
      },
      { name: "Plans", path: "/plans", icon: Package },
      { name: "Customers", path: "/customers", icon: Building2 },
    ],
  },
  {
    label: "ANALYTICS",
    items: [
      {
        name: "Usage Analytics",
        path: "/usage-analytics",
        icon: ChartNoAxesCombined,
      },
      {
        name: "Revenue Analytics",
        path: "/revenue-analytics",
        icon: ChartColumnIncreasing,
      },
    ],
  },
];

function Sidebar({ collapsed = false, onToggle }) {
  return (
    <aside
      className={`sidebar ${collapsed ? "sidebar--collapsed" : ""}`}
    >
      <div className="sidebar__brand">
        <div className="sidebar__brand-icon">
          <Layers size={22} />
        </div>

        {!collapsed && (
          <div className="sidebar__brand-text">
            <span className="sidebar__brand-name">SaaSFlow</span>
            <span className="sidebar__brand-caption">
              Management Suite
            </span>
          </div>
        )}

        {onToggle && (
          <button
            type="button"
            className="sidebar__toggle"
            onClick={onToggle}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? (
              <PanelLeftOpen size={18} />
            ) : (
              <PanelLeftClose size={18} />
            )}
          </button>
        )}
      </div>

      <nav className="sidebar__nav" aria-label="Main navigation">
        {navigation.map((section) => (
          <div className="sidebar__section" key={section.label}>
            {!collapsed && (
              <p className="sidebar__section-label">
                {section.label}
              </p>
            )}

            {section.items.map((item) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.end}
                  title={collapsed ? item.name : undefined}
                  className={({ isActive }) =>
                    `sidebar__link ${isActive ? "sidebar__link--active" : ""}`
                  }
                >
                  <Icon size={19} strokeWidth={1.8} />

                  {!collapsed && (
                    <span className="sidebar__link-label">
                      {item.name}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </div>
        ))}
      </nav>

      {!collapsed && (
        <div className="sidebar__footer">
          <div className="sidebar__footer-avatar">DN</div>
          <div className="sidebar__footer-info">
            <span className="sidebar__footer-name">
              Dasari Nirosha
            </span>
            <span className="sidebar__footer-role">
              Administrator
            </span>
          </div>
        </div>
      )}
    </aside>
  );
}

export default Sidebar;