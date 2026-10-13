import { useMemo, useState } from "react";
import {
  Activity,
  Download,
  Gauge,
  Zap,
  Users,
  RefreshCw,
} from "lucide-react";

import PageHeader from "../components/layout/PageHeader";
import Button from "../components/common/Button";
import UsageChart from "../components/dashboard/UsageChart";
import ComparisonChart from "../components/dashboard/ComparisonChart";
import { useApp } from "../context/AppContext";
import { useToast } from "../context/ToastContext";
import { usageData } from "../data/analytics";
import { exportToCSV } from "../utils/exportData";

const PERIODS = [
  { label: "Last 7 days", value: "7d" },
  { label: "Last 30 days", value: "30d" },
  { label: "Last 90 days", value: "90d" },
];

export default function UsageAnalytics() {
  const app = useApp();
  const toast = useToast();

  const [period, setPeriod] = useState("30d");

  const users = app?.users ?? [];
  const subscriptions = app?.subscriptions ?? [];

  const metrics = useMemo(() => {
    const activeUsers = users.filter(
      (user) =>
        String(user.status ?? "").toLowerCase() === "active"
    ).length;

    const activeSubscriptions = subscriptions.filter(
      (subscription) =>
        String(subscription.status ?? "").toLowerCase() === "active"
    ).length;

    const totalRequests = (usageData ?? []).reduce(
      (total, item) => {
        const value = Number(
          item.requests ?? item.usage ?? item.value ?? 0
        );

        return total + (Number.isFinite(value) ? value : 0);
      },
      0
    );

    return [
      {
        title: "Total API Requests",
        value: totalRequests.toLocaleString(),
        note: "Across recorded periods",
        icon: Activity,
        modifier: "blue",
      },
      {
        title: "Active Users",
        value: activeUsers.toLocaleString(),
        note: "Currently active accounts",
        icon: Users,
        modifier: "green",
      },
      {
        title: "Active Subscriptions",
        value: activeSubscriptions.toLocaleString(),
        note: "Active subscription records",
        icon: Zap,
        modifier: "purple",
      },
      {
        title: "Average Usage",
        value: usageData?.length
          ? Math.round(
              totalRequests / usageData.length
            ).toLocaleString()
          : "0",
        note: "Requests per recorded period",
        icon: Gauge,
        modifier: "orange",
      },
    ];
  }, [users, subscriptions]);

  function handleExport() {
    try {
      if (!usageData?.length) {
        toast?.warning?.(
          "No usage data available to export."
        );
        return;
      }

      exportToCSV(usageData, "usage-analytics.csv");

      toast?.success?.(
        "Usage analytics exported successfully."
      );
    } catch (error) {
      toast?.error?.(
        error.message ||
          "Unable to export usage analytics."
      );
    }
  }

  return (
    <div className="page-container usage-analytics-page">
      <PageHeader
        title="Usage Analytics"
        description="Monitor platform usage, API activity, and customer engagement."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Usage Analytics" },
        ]}
        actions={
          <Button
            variant="secondary"
            icon={<Download size={17} />}
            onClick={handleExport}
          >
            Export Report
          </Button>
        }
      />

      <section className="analytics-intro">
        <div className="analytics-intro__icon">
          <Activity size={24} />
        </div>

        <div className="analytics-intro__content">
          <h2>Platform usage overview</h2>
          <p>
            Review your available usage records and account
            activity. Select a reporting period to update the
            usage charts.
          </p>
        </div>

        <div className="analytics-period">
          <label htmlFor="usage-period">
            Reporting period
          </label>

          <select
            id="usage-period"
            value={period}
            onChange={(event) =>
              setPeriod(event.target.value)
            }
          >
            {PERIODS.map((item) => (
              <option
                key={item.value}
                value={item.value}
              >
                {item.label}
              </option>
            ))}
          </select>
        </div>
      </section>

      <section className="analytics-stat-grid">
        {metrics.map((metric) => {
          const Icon = metric.icon;

          return (
            <article
              className="analytics-stat-card"
              key={metric.title}
            >
              <div className="analytics-stat-card__top">
                <span>{metric.title}</span>

                <span
                  className={`analytics-stat-card__icon analytics-stat-card__icon--${metric.modifier}`}
                >
                  <Icon size={20} />
                </span>
              </div>

              <strong>{metric.value}</strong>
              <p>{metric.note}</p>
            </article>
          );
        })}
      </section>

      <section className="analytics-chart-grid">
        <div className="dashboard-panel">
          <div className="analytics-panel-heading">
            <div>
              <h3>Usage trends</h3>
              <p>API activity over time</p>
            </div>

            <span className="analytics-panel-heading__icon">
              <Activity size={18} />
            </span>
          </div>

          <UsageChart period={period} />
        </div>

        <div className="dashboard-panel">
          <div className="analytics-panel-heading">
            <div>
              <h3>Performance comparison</h3>
              <p>
                Compare activity across reporting periods
              </p>
            </div>

            <span className="analytics-panel-heading__icon">
              <RefreshCw size={18} />
            </span>
          </div>

          <ComparisonChart period={period} />
        </div>
      </section>

      <section className="analytics-note">
        <span className="analytics-note__icon">
          <Gauge size={19} />
        </span>

        <div>
          <strong>About these metrics</strong>
          <p>
            These figures are calculated from the dashboard's
            current local sample data. Connect a live analytics
            service to report real production API traffic.
          </p>
        </div>
      </section>
    </div>
  );
}