import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

const usageData = [
  { month: "Jan", usage: 4200 },
  { month: "Feb", usage: 5100 },
  { month: "Mar", usage: 4800 },
  { month: "Apr", usage: 6200 },
  { month: "May", usage: 7100 },
  { month: "Jun", usage: 6800 },
  { month: "Jul", usage: 8200 },
  { month: "Aug", usage: 9100 },
  { month: "Sep", usage: 8600 },
  { month: "Oct", usage: 10400 },
  { month: "Nov", usage: 11200 },
  { month: "Dec", usage: 12800 },
];

const periodLabels = {
  "7d": "Last 7 days",
  "30d": "Last 30 days",
  "90d": "Last 90 days",
};

function getChartData(period) {
  const currentMonth = new Date().getMonth();

  const monthsToShow =
    period === "7d" ? 1 : period === "30d" ? 1 : 3;

  const data = [];

  for (let i = monthsToShow - 1; i >= 0; i--) {
    const index = (currentMonth - i + 12) % 12;

    data.push({
      ...usageData[index],
      month:
        period === "7d"
          ? "7 days"
          : period === "30d"
            ? "30 days"
            : usageData[index].month,
    });
  }

  if (period === "90d") {
    return data;
  }

  return data;
}

function UsageChart({ period = "30d" }) {
  const chartData = getChartData(period);

  const totalUsage = chartData.reduce(
    (total, item) => total + item.usage,
    0
  );

  return (
    <section className="chart-card usage-chart">
      <div className="chart-card__header">
        <div>
          <h3 className="chart-card__title">
            Platform Usage
          </h3>

          <p className="chart-card__description">
            API requests for {periodLabels[period] || "Last 30 days"}
          </p>
        </div>
      </div>

      <div className="usage-chart__summary">
        <strong>
          {totalUsage.toLocaleString("en-US")}
        </strong>

        <span>
          requests in selected period
        </span>
      </div>

      <div className="chart-card__body">
        <ResponsiveContainer width="100%" height={290}>
          <BarChart
            data={chartData}
            margin={{
              top: 10,
              right: 12,
              left: 8,
              bottom: 0,
            }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="var(--chart-grid, #e5e7eb)"
            />

            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{
                fill: "var(--chart-text, #6b7280)",
                fontSize: 12,
              }}
              dy={10}
            />

            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{
                fill: "var(--chart-text, #6b7280)",
                fontSize: 12,
              }}
              tickFormatter={(value) => `${value / 1000}k`}
              width={45}
            />

            <Tooltip
              cursor={{
                fill: "rgba(20, 184, 166, 0.08)",
              }}
              formatter={(value) => [
                `${Number(value).toLocaleString("en-US")} requests`,
                "Usage",
              ]}
            />

            <Bar
              dataKey="usage"
              name="API Requests"
              fill="#14b8a6"
              radius={[6, 6, 0, 0]}
              maxBarSize={38}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}

export default UsageChart;