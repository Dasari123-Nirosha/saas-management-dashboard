// src/data/analytics.js

const revenueData = [
  { month: "Jan", revenue: 12500, expenses: 6200 },
  { month: "Feb", revenue: 14800, expenses: 7100 },
  { month: "Mar", revenue: 17200, expenses: 8300 },
  { month: "Apr", revenue: 16500, expenses: 7900 },
  { month: "May", revenue: 21400, expenses: 9800 },
  { month: "Jun", revenue: 23800, expenses: 11200 },
  { month: "Jul", revenue: 26700, expenses: 12400 },
  { month: "Aug", revenue: 29100, expenses: 13500 },
  { month: "Sep", revenue: 32400, expenses: 14800 },
  { month: "Oct", revenue: 35800, expenses: 16200 },
  { month: "Nov", revenue: 41200, expenses: 18500 },
  { month: "Dec", revenue: 46800, expenses: 20700 },
];

const subscriptionData = [
  { name: "Active", value: 68, color: "#16a34a" },
  { name: "Trial", value: 15, color: "#6366f1" },
  { name: "Past Due", value: 8, color: "#f59e0b" },
  { name: "Cancelled", value: 9, color: "#ef4444" },
];

const usageData = [
  { month: "Jan", apiRequests: 12000, storage: 4200 },
  { month: "Feb", apiRequests: 15500, storage: 5100 },
  { month: "Mar", apiRequests: 18300, storage: 6300 },
  { month: "Apr", apiRequests: 21000, storage: 7200 },
  { month: "May", apiRequests: 24800, storage: 8500 },
  { month: "Jun", apiRequests: 28500, storage: 9600 },
  { month: "Jul", apiRequests: 31900, storage: 10800 },
  { month: "Aug", apiRequests: 35700, storage: 12200 },
  { month: "Sep", apiRequests: 39600, storage: 13700 },
  { month: "Oct", apiRequests: 43200, storage: 14900 },
  { month: "Nov", apiRequests: 48100, storage: 16500 },
  { month: "Dec", apiRequests: 52700, storage: 18300 },
];

const comparisonData = [
  { month: "Jan", current: 12500, previous: 9800 },
  { month: "Feb", current: 14800, previous: 11200 },
  { month: "Mar", current: 17200, previous: 13900 },
  { month: "Apr", current: 16500, previous: 14500 },
  { month: "May", current: 21400, previous: 16800 },
  { month: "Jun", current: 23800, previous: 19200 },
  { month: "Jul", current: 26700, previous: 21800 },
  { month: "Aug", current: 29100, previous: 23500 },
  { month: "Sep", current: 32400, previous: 26700 },
  { month: "Oct", current: 35800, previous: 29400 },
  { month: "Nov", current: 41200, previous: 32500 },
  { month: "Dec", current: 46800, previous: 37100 },
];

const dashboardStats = [
  {
    id: "total-users",
    title: "Total Users",
    value: 2486,
    change: 12.8,
    changeType: "positive",
    description: "vs. previous month",
    iconType: "users",
  },
  {
    id: "active-subscriptions",
    title: "Active Subscriptions",
    value: 1842,
    change: 8.4,
    changeType: "positive",
    description: "vs. previous month",
    iconType: "subscriptions",
  },
  {
    id: "monthly-revenue",
    title: "Monthly Revenue",
    value: 46800,
    change: 15.6,
    changeType: "positive",
    description: "vs. previous month",
    iconType: "revenue",
  },
  {
    id: "growth-rate",
    title: "Growth Rate",
    value: 18.2,
    suffix: "%",
    change: 3.2,
    changeType: "positive",
    description: "vs. previous month",
    iconType: "growth",
  },
];

const recentActivities = [
  {
    id: "ACT-001",
    type: "user",
    title: "New user registered",
    description: "Karthik Reddy joined the Starter plan",
    timestamp: "2026-10-09T09:30:00",
    time: "2 minutes ago",
    path: "/users",
  },
  {
    id: "ACT-002",
    type: "subscription",
    title: "Subscription upgraded",
    description: "Hasini Posa upgraded to Professional",
    timestamp: "2026-10-09T08:45:00",
    time: "15 minutes ago",
    path: "/subscriptions",
  },
  {
    id: "ACT-003",
    type: "payment",
    title: "Payment received",
    description: "Enterprise subscription payment received",
    timestamp: "2026-10-08T16:20:00",
    time: "35 minutes ago",
    path: "/revenue-analytics",
  },
  {
    id: "ACT-004",
    type: "user",
    title: "Customer account created",
    description: "A new customer registered successfully",
    timestamp: "2026-10-08T14:10:00",
    time: "1 hour ago",
    path: "/customers",
  },
  {
    id: "ACT-005",
    type: "subscription",
    title: "Subscription cancelled",
    description: "A Starter subscription was cancelled",
    timestamp: "2026-10-08T11:00:00",
    time: "2 hours ago",
    path: "/subscriptions",
  },
  {
    id: "ACT-006",
    type: "payment",
    title: "Invoice generated",
    description: "Monthly invoice generated successfully",
    timestamp: "2026-10-07T10:15:00",
    time: "3 hours ago",
    path: "/revenue-analytics",
  },
];

const topPlans = [
  { name: "Starter", subscribers: 124, percentage: 45 },
  { name: "Professional", subscribers: 86, percentage: 31 },
  { name: "Enterprise", subscribers: 42, percentage: 15 },
  { name: "Free Trial", subscribers: 25, percentage: 9 },
];

export {
  revenueData,
  subscriptionData,
  usageData,
  comparisonData,
  dashboardStats,
  recentActivities,
  topPlans,
};