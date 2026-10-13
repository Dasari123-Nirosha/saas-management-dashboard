import { useMemo } from "react";
import { TrendingUp, TrendingDown } from "lucide-react";

const comparisonValues = {
  "7d": {
    current: 12400,
    previous: 10800,
    label: "Last 7 days",
  },
  "30d": {
    current: 48200,
    previous: 42100,
    label: "Last 30 days",
  },
  "90d": {
    current: 108400,
    previous: 96400,
    label: "Last 90 days",
  },
};

const currency = (value) =>
  "$" +
  (value / 1000).toLocaleString("en-US", {
    maximumFractionDigits: 1,
  }) +
  "K";

export default function ComparisonChart({ period = "30d" }) {
  const data = comparisonValues[period] ?? comparisonValues["30d"];

  const growth = useMemo(
    () =>
      data.previous
        ? ((data.current - data.previous) / data.previous) * 100
        : 0,
    [data]
  );

  const previousWidth =
    data.current > 0
      ? Math.min((data.previous / data.current) * 100, 100)
      : 0;

  return (
    <div className="comparison-chart">
      <div className="comparison-chart__header">
        <div>
          <h3>Revenue Comparison</h3>
          <p>Compare current and previous period revenue</p>
        </div>

        <span className="comparison-chart__label">
          {data.label}
        </span>
      </div>

      <div className="comparison-chart__stats">
        <div className="comparison-chart__stat">
          <span className="comparison-chart__label">
            Current period
          </span>
          <strong>{currency(data.current)}</strong>
        </div>

        <div className="comparison-chart__stat">
          <span className="comparison-chart__label">
            Previous period
          </span>
          <strong>{currency(data.previous)}</strong>
        </div>

        <div className="comparison-chart__stat">
          <span className="comparison-chart__label">
            Growth
          </span>

          <strong
            className={
              growth >= 0
                ? "comparison-chart__growth positive"
                : "comparison-chart__growth negative"
            }
          >
            {growth >= 0 ? (
              <TrendingUp size={19} />
            ) : (
              <TrendingDown size={19} />
            )}

            {growth >= 0 ? "+" : ""}
            {growth.toFixed(1)}%
          </strong>
        </div>
      </div>

      <div className="comparison-chart__visual">
        <div className="comparison-chart__bar-row">
          <span>Current</span>

          <div className="comparison-chart__track">
            <div
              className="comparison-chart__bar current"
              style={{ width: "100%" }}
            />
          </div>

          <strong>{currency(data.current)}</strong>
        </div>

        <div className="comparison-chart__bar-row">
          <span>Previous</span>

          <div className="comparison-chart__track">
            <div
              className="comparison-chart__bar previous"
              style={{ width: `${previousWidth}%` }}
            />
          </div>

          <strong>{currency(data.previous)}</strong>
        </div>
      </div>
    </div>
  );
}