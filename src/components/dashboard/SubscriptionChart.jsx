
import { useState } from "react";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
} from "recharts";

const subscriptionData = [
  { name: "Active", value: 640, color: "#14b8a6" },
  { name: "Trial", value: 180, color: "#818cf8" },
  { name: "Past Due", value: 75, color: "#f59e0b" },
  { name: "Cancelled", value: 105, color: "#f87171" },
];

function SubscriptionChart() {
  const [showLegend, setShowLegend] = useState(true);

  const totalSubscriptions = subscriptionData.reduce(
    (total, item) => total + item.value,
    0
  );

  return (
    <section className="chart-card subscription-chart">
      <header className="chart-card__header">
        <div>
          <h3 className="chart-card__title">
            Subscription Overview
          </h3>
          <p className="chart-card__description">
            Breakdown by subscription status
          </p>
        </div>

        <button
          type="button"
          className="chart-card__toggle"
          onClick={() => setShowLegend((previous) => !previous)}
          aria-pressed={showLegend}
        >
          {showLegend ? "Hide legend" : "Show legend"}
        </button>
      </header>

      <div className="subscription-chart__body">
        <div className="subscription-chart__visual">
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={subscriptionData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={66}
                outerRadius={96}
                paddingAngle={3}
                stroke="none"
              >
                {subscriptionData.map((item) => (
                  <Cell key={item.name} fill={item.color} />
                ))}
              </Pie>

              <Tooltip
                formatter={(value, name) => [
                  `${Number(value).toLocaleString("en-US")} subscriptions`,
                  name,
                ]}
              />
            </PieChart>
          </ResponsiveContainer>

          <div className="subscription-chart__center">
            <strong>{totalSubscriptions.toLocaleString("en-US")}</strong>
            <span>Total Subscriptions</span>
          </div>
        </div>

        {showLegend && (
          <div className="subscription-chart__legend">
            {subscriptionData.map((item) => {
              const percentage = (
                (item.value / totalSubscriptions) *
                100
              ).toFixed(1);

              return (
                <div
                  className="subscription-chart__legend-item"
                  key={item.name}
                >
                  <div className="subscription-chart__legend-label">
                    <span
                      className="subscription-chart__dot"
                      style={{ backgroundColor: item.color }}
                    />
                    <span>{item.name}</span>
                  </div>

                  <div className="subscription-chart__legend-value">
                    <strong>
                      {item.value.toLocaleString("en-US")}
                    </strong>
                    <span>{percentage}%</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}

export default SubscriptionChart;
