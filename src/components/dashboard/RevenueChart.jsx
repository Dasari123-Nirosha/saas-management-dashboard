import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

const monthlyRevenue = [
  { month: "Jan", revenue: 18500 },
  { month: "Feb", revenue: 22000 },
  { month: "Mar", revenue: 19800 },
  { month: "Apr", revenue: 27500 },
  { month: "May", revenue: 31000 },
  { month: "Jun", revenue: 28800 },
  { month: "Jul", revenue: 35000 },
  { month: "Aug", revenue: 38200 },
  { month: "Sep", revenue: 33000 },
  { month: "Oct", revenue: 41500 },
  { month: "Nov", revenue: 46000 },
  { month: "Dec", revenue: 51000 },
];

const formatRevenue = (value) =>
  new Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 1,
    style: "currency",
    currency: "USD",
  }).format(value);

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;

  return (
    <div className="chart-tooltip">
      <p className="chart-tooltip__label">{label}</p>
      <strong className="chart-tooltip__value">
        {formatRevenue(payload[0].value)}
      </strong>
    </div>
  );
}

export default function RevenueChart({ period = "12m", data }) {
  const sourceData = Array.isArray(data) ? data : monthlyRevenue;

  const chartData = sourceData.map((item) => ({
    month: item.month ?? item.label ?? item.date,
    revenue: Number(
      item.revenue ?? item.amount ?? item.value ?? item.current ?? 0
    ),
  }));

  const periodLabels = {
    "30d": "Last 30 days",
    "90d": "Last 90 days",
    "12m": "Last 12 months",
  };

  return (
    <section className="chart-card">
      <div className="chart-card__header">
        <div>
          <h3 className="chart-card__title">Revenue Overview</h3>
          <p className="chart-card__description">
            {periodLabels[period] || "Revenue over time"}
          </p>
        </div>
      </div>

      {chartData.length === 0 ? (
        <div className="chart-card__body">
          <p>No revenue records available for this period.</p>
        </div>
      ) : (
        <div className="chart-card__body">
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart
              data={chartData}
              margin={{ top: 10, right: 12, left: 8, bottom: 0 }}
            >
              <defs>
                <linearGradient
                  id="revenueGradient"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="0%"
                    stopColor="#14b8a6"
                    stopOpacity={0.3}
                  />
                  <stop
                    offset="95%"
                    stopColor="#14b8a6"
                    stopOpacity={0.02}
                  />
                </linearGradient>
              </defs>

              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="var(--chart-grid, #e5e7eb)"
              />

              <XAxis
                dataKey="month"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "var(--chart-text, #6b7280)", fontSize: 12 }}
              />

              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "var(--chart-text, #6b7280)", fontSize: 12 }}
                tickFormatter={(value) => `$${value / 1000}k`}
                width={55}
              />

              <Tooltip content={<CustomTooltip />} />

              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#14b8a6"
                strokeWidth={3}
                fill="url(#revenueGradient)"
                activeDot={{ r: 6, strokeWidth: 0 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </section>
  );
}