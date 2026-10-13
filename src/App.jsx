
import { HashRouter, Routes, Route } from "react-router-dom";

import Layout from "./components/layout/Layout";

import Dashboard from "./pages/Dashboard";
import Users from "./pages/Users";
import Subscriptions from "./pages/Subscriptions";
import Plans from "./pages/Plans";
import Customers from "./pages/Customers";
import UsageAnalytics from "./pages/UsageAnalytics";
import RevenueAnalytics from "./pages/RevenueAnalytics";
import Activity from "./pages/Activity";
import NotFound from "./pages/NotFound";

import { AppProvider } from "./context/AppContext";
import { ThemeProvider } from "./context/ThemeContext";
import { ToastProvider } from "./context/ToastContext";

import "./App.css";

function App() {
  return (
    <ThemeProvider>
      <AppProvider>
        <ToastProvider>
          <HashRouter>
            <Routes>
              <Route path="/" element={<Layout />}>
                <Route index element={<Dashboard />} />
                <Route path="users" element={<Users />} />
                <Route
                  path="subscriptions"
                  element={<Subscriptions />}
                />
                <Route path="plans" element={<Plans />} />
                <Route path="customers" element={<Customers />} />
                <Route
                  path="usage-analytics"
                  element={<UsageAnalytics />}
                />
                <Route
                  path="revenue-analytics"
                  element={<RevenueAnalytics />}
                />
                <Route path="activity" element={<Activity />} />
                <Route path="*" element={<NotFound />} />
              </Route>
            </Routes>
          </HashRouter>
        </ToastProvider>
      </AppProvider>
    </ThemeProvider>
  );
}

export default App;
