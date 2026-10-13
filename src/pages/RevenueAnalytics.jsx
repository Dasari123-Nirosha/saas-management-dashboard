// src/pages/RevenueAnalytics.jsx

import { useMemo, useState } from "react";
import {
  Download,
  TrendingUp,
  DollarSign,
  CalendarDays,
} from "lucide-react";

import PageHeader from "../components/layout/PageHeader";
import Button from "../components/common/Button";
import RevenueChart from "../components/dashboard/RevenueChart";
import ComparisonChart from "../components/dashboard/ComparisonChart";

import { useApp } from "../context/AppContext";
import { useToast } from "../context/ToastContext";

import {
  revenueData,
  comparisonData,
} from "../data/analytics";

import formatCurrency from "../utils/formatCurrency";
import { exportToCSV } from "../utils/exportData";

const periodOptions = [
  { label: "30 days", value: "30d", months: 1 },
  { label: "90 days", value: "90d", months: 3 },
  { label: "1 year", value: "12m", months: 12 },
];

function getRevenueValue(item) {
  return Number(
    item.revenue ??
      item.amount ??
      item.value ??
      item.current ??
      0
  );
}

function filterByPeriod(data, period) {
  const selectedOption = periodOptions.find(
    (option) => option.value === period
  );

  const numberOfMonths = selectedOption?.months ?? 12;

  return Array.isArray(data)
    ? data.slice(-numberOfMonths)
    : [];
}

export default function RevenueAnalytics() {
  const { subscriptions = [], customers = [] } = useApp();
  const { success, error } = useToast();

  const [period, setPeriod] = useState("12m");

  const filteredRevenueData = useMemo(
    () => filterByPeriod(revenueData, period),
    [period]
  );

  const filteredComparisonData = useMemo(
    () => filterByPeriod(comparisonData, period),
    [period]
  );

  const totalRevenue = useMemo(
    () =>
      filteredRevenueData.reduce(
        (total, item) => total + getRevenueValue(item),
        0
      ),
    [filteredRevenueData]
  );

  const averageRevenue = filteredRevenueData.length
    ? totalRevenue / filteredRevenueData.length
    : 0;

  const paidSubscriptions = subscriptions.filter(
    (subscription) =>
      ["active", "paid"].includes(
        String(subscription.status || "").toLowerCase()
      )
  ).length;

  const selectedPeriodLabel =
    periodOptions.find((option) => option.value === period)?.label ??
    "1 year";

  const handleExport = () => {
    try {
      if (filteredRevenueData.length === 0) {
        error("No revenue data available for this period.");
        return;
      }

      exportToCSV(
        filteredRevenueData,
        `saas-revenue-${period}`
      );

      success("Revenue report exported successfully.");
    } catch (exportError) {
      console.error("Revenue export failed:", exportError);
      error("Unable to export the revenue report.");
    }
  };

  return (
    <div className="page-container revenue-analytics-page">
      <PageHeader
        title="Revenue Analytics"
        description="Monitor revenue trends, compare performance, and review your SaaS business growth."
        breadcrumbs={[
          { label: "Dashboard", href: "/" },
          { label: "Revenue Analytics" },
        ]}
        actions={
          <Button
            onClick={handleExport}
            icon={<Download size={17} />}
          >
            Export Report
          </Button>
        }
      />

      <div className="analytics-toolbar">
        <div className="analytics-toolbar__info">
          <CalendarDays size={18} />
          <span>Revenue reporting period</span>
        </div>

        <div
          className="analytics-period-control"
          role="group"
          aria-label="Select revenue reporting period"
        >
          {periodOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              className={
                period === option.value
                  ? "analytics-period-button active"
                  : "analytics-period-button"
              }
              onClick={() => setPeriod(option.value)}
              aria-pressed={period === option.value}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <div className="analytics-stats-grid">
        <article className="analytics-stat-card">
          <div className="analytics-stat-card__top">
            <span className="analytics-stat-card__label">
              Revenue for selected period
            </span>
            <span className="analytics-stat-card__icon purple">
              <DollarSign size={21} />
            </span>
          </div>

          <h2>{formatCurrency(totalRevenue)}</h2>

          <p className="analytics-stat-card__description">
            Total for {selectedPeriodLabel.toLowerCase()}
          </p>
        </article>

        <article className="analytics-stat-card">
          <div className="analytics-stat-card__top">
            <span className="analytics-stat-card__label">
              Average per month
            </span>
            <span className="analytics-stat-card__icon green">
              <TrendingUp size={21} />
            </span>
          </div>

          <h2>{formatCurrency(averageRevenue)}</h2>

          <p className="analytics-stat-card__description">
            Average across the selected monthly records
          </p>
        </article>

        <article className="analytics-stat-card">
          <div className="analytics-stat-card__top">
            <span className="analytics-stat-card__label">
              Customers
            </span>
            <span className="analytics-stat-card__icon blue">
              <DollarSign size={21} />
            </span>
          </div>

          <h2>{customers.length}</h2>

          <p className="analytics-stat-card__description">
            Customers currently stored in the dashboard
          </p>
        </article>

        <article className="analytics-stat-card">
          <div className="analytics-stat-card__top">
            <span className="analytics-stat-card__label">
              Active or paid subscriptions
            </span>
            <span className="analytics-stat-card__icon orange">
              <TrendingUp size={21} />
            </span>
          </div>

          <h2>{paidSubscriptions}</h2>

          <p className="analytics-stat-card__description">
            Subscriptions with active or paid status
          </p>
        </article>
      </div>

      <section className="analytics-chart-section">
        <div className="analytics-section-heading">
          <div>
            <h2>Revenue Overview</h2>
            <p>
              Showing {selectedPeriodLabel.toLowerCase()} of sample data.
            </p>
          </div>
        </div>

        <div className="analytics-chart-card">
          <RevenueChart
            period={period}
            data={filteredRevenueData}
          />
        </div>
      </section>

      <section className="analytics-chart-section">
        <div className="analytics-section-heading">
          <div>
            <h2>Revenue Comparison</h2>
            <p>
              Compare current and previous revenue for the selected period.
            </p>
          </div>
        </div>

        <div className="analytics-chart-card">
          <ComparisonChart
            period={period}
            data={filteredComparisonData}
          />
        </div>
      </section>

      <div className="analytics-note">
        <strong>Reporting note</strong>
        <p>
          This page uses sample monthly records. The 30-day option
          displays one monthly record, the 90-day option displays
          three, and the 1-year option displays all twelve.
          Exact day-based reporting requires dated daily revenue data.
        </p>
      </div>
    </div>
  );
}