
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Users,
  CreditCard,
  DollarSign,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  UserPlus,
  Receipt,
  Clock3,
} from "lucide-react";

import PageHeader from "../components/layout/PageHeader";
import StatCard from "../components/dashboard/StatCard";
import RevenueChart from "../components/dashboard/RevenueChart";
import SubscriptionChart from "../components/dashboard/SubscriptionChart";
import UsageChart from "../components/dashboard/UsageChart";
import ComparisonChart from "../components/dashboard/ComparisonChart";
import RecentActivity from "../components/dashboard/RecentActivity";

import { useApp } from "../context/AppContext";
import formatCurrency from "../utils/formatCurrency";


const quickActions = [
  {
    label: "Manage users",
    description: "View and manage user accounts",
    icon: Users,
    href: "/users",
  },
  {
    label: "Subscriptions",
    description: "Review subscription records",
    icon: CreditCard,
    href: "/subscriptions",
  },
  {
    label: "View plans",
    description: "Manage pricing plans",
    icon: Receipt,
    href: "/plans",
  },
];

const sampleActivities = [
  {
    id: "sample-subscription-upgraded",
    type: "subscription",
    title: "Subscription upgraded",
    description: "A customer upgraded their subscription.",
    time: "2 hours ago",
    path: "/subscriptions",
  },
  {
    id: "sample-payment-received",
    type: "payment",
    title: "Payment received",
    description: "A payment was successfully received.",
    time: "3 hours ago",
    path: "/revenue-analytics",
  },
  {
    id: "sample-customer-created",
    type: "customer",
    title: "Customer account created",
    description: "A new customer account was created.",
    time: "4 hours ago",
    path: "/customers",
  },
  {
    id: "sample-subscription-cancelled",
    type: "subscription",
    title: "Subscription cancelled",
    description: "A subscription was cancelled.",
    time: "5 hours ago",
    path: "/subscriptions",
  },
  {
    id: "sample-invoice-generated",
    type: "invoice",
    title: "Invoice generated",
    description: "A new invoice was generated.",
    time: "6 hours ago",
    path: "/revenue-analytics",
  },
];

function getGreeting() {
  const hour = new Date().getHours();

  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

function getActivityPath(activity) {
  const text = [
    activity.title,
    activity.description,
    activity.type,
    activity.category,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  if (text.includes("plan")) return "/plans";
  if (text.includes("subscription")) return "/subscriptions";
  if (text.includes("user") || text.includes("registered")) {
    return "/users";
  }
  if (text.includes("customer") || text.includes("account created")) {
    return "/customers";
  }
  if (
    text.includes("payment") ||
    text.includes("revenue") ||
    text.includes("invoice")
  ) {
    return "/revenue-analytics";
  }
  if (text.includes("usage")) return "/usage-analytics";

  return activity.path || "/activity";
}

export default function Dashboard() {
  const navigate = useNavigate();

  const {
    users = [],
    subscriptions = [],
    customers = [],
    activities = [],
  } = useApp();

  const stats = useMemo(() => {
    const activeSubscriptions = subscriptions.filter(
      (subscription) =>
        String(subscription.status).toLowerCase() === "active"
    ).length;

    const totalRevenue = subscriptions.reduce((total, subscription) => {
      const amount = Number(
        subscription.amount ?? subscription.price ?? 0
      );

      return total + (Number.isFinite(amount) ? amount : 0);
    }, 0);

    return [
      {
        title: "Total Users",
        value: users.length.toLocaleString(),
        change: "+12.8%",
        changeType: "positive",
        description: "vs. previous month",
        icon: Users,
        iconType: "users",
      },
      {
        title: "Active Subscriptions",
        value: activeSubscriptions.toLocaleString(),
        change: "+8.2%",
        changeType: "positive",
        description: "vs. previous month",
        icon: CreditCard,
        iconType: "subscriptions",
      },
      {
        title: "Subscription Value",
        value: formatCurrency(totalRevenue),
        change: "+15.4%",
        changeType: "positive",
        description: "Current subscription records",
        icon: DollarSign,
        iconType: "revenue",
      },
      {
        title: "Total Customers",
        value: customers.length.toLocaleString(),
        change: "+6.7%",
        changeType: "positive",
        description: "vs. previous month",
        icon: TrendingUp,
        iconType: "growth",
      },
    ];
  }, [users, subscriptions, customers]);

  const activityItems = useMemo(() => {
    const realActivities = [...activities].sort((a, b) => {
      const timeA = new Date(a.timestamp || 0).getTime();
      const timeB = new Date(b.timestamp || 0).getTime();

      return (
        (Number.isFinite(timeB) ? timeB : 0) -
        (Number.isFinite(timeA) ? timeA : 0)
      );
    });

    const realIds = new Set(realActivities.map((item) => item.id));

    const fallbackActivities = sampleActivities.filter(
      (sample) => !realIds.has(sample.id)
    );

    return [...realActivities, ...fallbackActivities]
      .slice(0, 6)
      .map((activity, index) => ({
        ...activity,
        id: activity.id ?? `activity-${index}`,
        path: getActivityPath(activity),
        time:
          activity.time ||
          (activity.timestamp
            ? new Date(activity.timestamp).toLocaleString()
            : "Recently"),
      }));
  }, [activities]);

  return (
    <div className="dashboard-page">
      <PageHeader
        title="Dashboard"
        description={`${getGreeting()}! Here's what's happening with your SaaS business.`}
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Dashboard" },
        ]}
      />

      <section className="dashboard-welcome">
        <div className="dashboard-welcome__content">
          <span className="dashboard-welcome__eyebrow">
            <Activity size={15} />
            BUSINESS OVERVIEW
          </span>

          <h2>Welcome back, Dasari Nirosha!</h2>

          <p>
            Track your users, subscriptions, revenue, and platform activity
            from one place.
          </p>
        </div>

        <div className="dashboard-welcome__decoration" aria-hidden="true">
          <div className="welcome-orbit welcome-orbit--one" />
          <div className="welcome-orbit welcome-orbit--two" />
          <div className="welcome-orbit welcome-orbit--three" />
        </div>
      </section>

      <section className="dashboard-stats" aria-label="Business statistics">
        {stats.map((stat) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </section>

      <section className="dashboard-chart-grid">
        <div className="dashboard-panel dashboard-panel--revenue">
          <RevenueChart />
        </div>

        <div className="dashboard-panel dashboard-panel--subscriptions">
          <SubscriptionChart />
        </div>
      </section>

      <section className="dashboard-chart-grid dashboard-chart-grid--secondary">
        <div className="dashboard-panel">
          <UsageChart />
        </div>

        <div className="dashboard-panel">
          <ComparisonChart />
        </div>
      </section>

      <section className="dashboard-bottom-grid">
        <div className="dashboard-panel dashboard-panel--activity">
          <RecentActivity
            activities={activityItems}
            title="Recent Activity"
            description="The latest updates across your workspace."
            limit={6}
            onViewAll={() => navigate("/activity")}
          />
        </div>

        <div className="dashboard-panel quick-actions-panel">
          <div className="quick-actions-panel__heading">
            <div>
              <h3>Quick Actions</h3>
              <p>Common tasks, just a click away.</p>
            </div>

            <span className="quick-actions-panel__icon">
              <Clock3 size={19} />
            </span>
          </div>

          <div className="quick-actions-list">
            {quickActions.map((action) => {
              const Icon = action.icon;

              return (
                <button
                  type="button"
                  className="quick-action"
                  key={action.label}
                  onClick={() => navigate(action.href)}
                >
                  <span className="quick-action__icon">
                    <Icon size={19} />
                  </span>

                  <span className="quick-action__text">
                    <strong>{action.label}</strong>
                    <small>{action.description}</small>
                  </span>

                  <ArrowUpRight
                    className="quick-action__arrow"
                    size={17}
                  />
                </button>
              );
            })}
          </div>

          <div className="dashboard-insight">
            <span className="dashboard-insight__icon">
              <UserPlus size={18} />
            </span>

            <div>
              <strong>Keep growing</strong>
              <p>
                Review your customer and subscription records regularly.
              </p>
            </div>

            <ArrowDownRight
              size={16}
              className="dashboard-insight__arrow"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
