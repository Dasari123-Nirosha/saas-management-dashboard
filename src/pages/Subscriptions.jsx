
import { useEffect, useMemo, useState } from "react";
import {
  Plus,
  Search,
  Download,
  RefreshCw,
  X,
  Pencil,
  Trash2,
  Eye,
  CheckCircle,
  UserX,
  CreditCard,
  Clock,
  DollarSign,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import { useApp } from "../context/AppContext";
import { addNotification } from "../utils/notifications";

const statusOptions = [
  "Active",
  "Inactive",
  "Trial",
  "Pending",
  "Past due",
  "Cancelled",
];

const billingOptions = ["Monthly", "Quarterly", "Yearly"];
const planOptions = ["Starter", "Professional", "Enterprise"];
const PAGE_SIZE = 5;

const currency = (amount) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(Number(amount) || 0);

const formatDate = (date) => {
  if (!date) return "—";

  const parsed = new Date(`${date}T00:00:00`);

  if (Number.isNaN(parsed.getTime())) return "—";

  return parsed.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const getInitials = (name = "") =>
  String(name)
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

const emptyForm = {
  customer: "",
  email: "",
  plan: "Starter",
  status: "Active",
  billing: "Monthly",
  amount: "19",
};

export default function Subscriptions() {
  const {
    subscriptions = [],
    addSubscription,
    updateSubscription,
    removeSubscription,
  } = useApp();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [billingFilter, setBillingFilter] = useState("");
  const [planFilter, setPlanFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const [showForm, setShowForm] = useState(false);
  const [editingSubscription, setEditingSubscription] = useState(null);
  const [viewSubscription, setViewSubscription] = useState(null);
  const [form, setForm] = useState(emptyForm);

  const notify = (title, message, recordName) => {
    try {
      addNotification({
        title,
        message,
        section: "Subscriptions",
        recordName,
      });
    } catch (error) {
      console.error("Unable to create notification:", error);
    }
  };

  const filteredSubscriptions = useMemo(() => {
    const term = search.trim().toLowerCase();

    return subscriptions.filter((item) => {
      const searchableText = [
        item.customer,
        item.email,
        item.plan,
        item.status,
      ]
        .map((value) => String(value ?? ""))
        .join(" ")
        .toLowerCase();

      return (
        searchableText.includes(term) &&
        (!statusFilter || item.status === statusFilter) &&
        (!billingFilter || item.billing === billingFilter) &&
        (!planFilter || item.plan === planFilter)
      );
    });
  }, [
    subscriptions,
    search,
    statusFilter,
    billingFilter,
    planFilter,
  ]);

  const totalItems = filteredSubscriptions.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / PAGE_SIZE));

  const paginatedSubscriptions = useMemo(() => {
    const startIndex = (currentPage - 1) * PAGE_SIZE;

    return filteredSubscriptions.slice(
      startIndex,
      startIndex + PAGE_SIZE
    );
  }, [filteredSubscriptions, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, statusFilter, billingFilter, planFilter]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const activeCount = subscriptions.filter(
    (item) => item.status === "Active"
  ).length;

  const inactiveCount = subscriptions.filter(
    (item) => item.status === "Inactive"
  ).length;

  const attentionCount = subscriptions.filter((item) =>
    ["Trial", "Pending", "Past due"].includes(item.status)
  ).length;

  const activeValue = subscriptions
    .filter((item) => item.status === "Active")
    .reduce((total, item) => total + Number(item.amount || 0), 0);

  const openAddForm = () => {
    setEditingSubscription(null);
    setForm({ ...emptyForm });
    setShowForm(true);
  };

  const openEditForm = (subscription) => {
    setEditingSubscription(subscription);

    setForm({
      customer: subscription.customer ?? "",
      email: subscription.email ?? "",
      plan: subscription.plan ?? "Starter",
      status: subscription.status ?? "Active",
      billing: subscription.billing ?? "Monthly",
      amount: String(subscription.amount ?? 19),
    });

    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingSubscription(null);
    setForm({ ...emptyForm });
  };

  // Update only the field the user changed.
  // Changing the plan will not overwrite a custom amount or customer name.
  const handleFormChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const customer = form.customer.trim();
    const email = form.email.trim();
    const amount = Number(form.amount);

    if (!customer || !email) {
      window.alert("Please enter the customer name and email.");
      return;
    }

    if (!Number.isFinite(amount) || amount < 0) {
      window.alert("Please enter a valid subscription amount.");
      return;
    }

    const duplicateEmail = subscriptions.some(
      (item) =>
        String(item.email ?? "").toLowerCase() === email.toLowerCase() &&
        String(item.id) !== String(editingSubscription?.id)
    );

    if (duplicateEmail) {
      window.alert("A subscription with this email already exists.");
      return;
    }

    const updatedData = {
      customer,
      email,
      plan: form.plan,
      status: form.status,
      billing: form.billing,
      amount,
    };

    if (editingSubscription) {
      // Preserve the existing ID and other record fields.
      updateSubscription(editingSubscription.id, updatedData);

      notify(
        "Subscription updated",
        `${customer}'s subscription details were updated.`,
        customer
      );
    } else {
      const newSubscription = {
        ...updatedData,
        id: `sub-${Date.now()}-${Math.random()
          .toString(36)
          .slice(2, 7)}`,
        startDate: new Date().toISOString().slice(0, 10),
      };

      addSubscription(newSubscription);

      notify(
        "Subscription created",
        `A subscription was created for ${customer}.`,
        customer
      );
    }

    closeForm();
    setCurrentPage(1);
  };

  const toggleStatus = (subscription) => {
    const nextStatus =
      subscription.status === "Active" ? "Inactive" : "Active";

    updateSubscription(subscription.id, {
      status: nextStatus,
    });

    notify(
      `Subscription ${nextStatus.toLowerCase()}`,
      `${subscription.customer}'s subscription status changed to ${nextStatus}.`,
      subscription.customer
    );
  };

  const deleteSubscription = (subscription) => {
    const confirmed = window.confirm(
      `Delete the subscription for ${subscription.customer}?`
    );

    if (!confirmed) return;

    removeSubscription(subscription.id);

    if (String(viewSubscription?.id) === String(subscription.id)) {
      setViewSubscription(null);
    }

    if (String(editingSubscription?.id) === String(subscription.id)) {
      closeForm();
    }

    notify(
      "Subscription deleted",
      `${subscription.customer}'s subscription was deleted.`,
      subscription.customer
    );
  };

  const exportCSV = () => {
    const rows = [
      [
        "Customer",
        "Email",
        "Plan",
        "Status",
        "Billing Cycle",
        "Amount",
        "Start Date",
      ],
      ...filteredSubscriptions.map((item) => [
        item.customer,
        item.email,
        item.plan,
        item.status,
        item.billing,
        item.amount,
        item.startDate,
      ]),
    ];

    const csv = rows
      .map((row) =>
        row
          .map((value) => `"${String(value ?? "").replace(/"/g, '""')}"`)
          .join(",")
      )
      .join("\r\n");

    const blob = new Blob(["\uFEFF" + csv], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "subscriptions.csv";
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  const resetFilters = () => {
    setSearch("");
    setStatusFilter("");
    setBillingFilter("");
    setPlanFilter("");
    setCurrentPage(1);
  };

  const hasFilters = Boolean(
    search || statusFilter || billingFilter || planFilter
  );

  return (
    <main className="page-content subscriptions-page">
      <header className="subscriptions-heading">
        <div>
          <span className="subscriptions-eyebrow">
            BILLING MANAGEMENT
          </span>
          <h1>Subscriptions</h1>
          <p>
            Manage customer subscriptions, billing cycles, and plan
            assignments.
          </p>
        </div>

        <div className="subscriptions-actions">
          <button
            type="button"
            className="subscriptions-button subscriptions-button--secondary"
            onClick={exportCSV}
          >
            <Download size={16} />
            Export CSV
          </button>

          <button
            type="button"
            className="subscriptions-button subscriptions-button--primary"
            onClick={openAddForm}
          >
            <Plus size={17} />
            Add Subscription
          </button>
        </div>
      </header>

      <section className="subscriptions-stats">
        <article className="subscriptions-stat">
          <div className="subscriptions-stat-icon purple">
            <CreditCard size={21} />
          </div>
          <div>
            <span>Total subscriptions</span>
            <strong>{subscriptions.length}</strong>
            <small>All subscription records</small>
          </div>
        </article>

        <article className="subscriptions-stat">
          <div className="subscriptions-stat-icon green">
            <CheckCircle size={21} />
          </div>
          <div>
            <span>Active subscriptions</span>
            <strong>{activeCount}</strong>
            <small>Currently active</small>
          </div>
        </article>

        <article className="subscriptions-stat">
          <div className="subscriptions-stat-icon blue">
            <DollarSign size={21} />
          </div>
          <div>
            <span>Active subscription value</span>
            <strong>{currency(activeValue)}</strong>
            <small>Sum of active plan amounts</small>
          </div>
        </article>

        <article className="subscriptions-stat">
          <div className="subscriptions-stat-icon orange">
            <Clock size={21} />
          </div>
          <div>
            <span>Needs attention</span>
            <strong>{attentionCount}</strong>
            <small>{inactiveCount} inactive subscriptions</small>
          </div>
        </article>
      </section>

      <section className="subscriptions-table-card">
        <div className="subscriptions-table-heading">
          <div>
            <h2>All Subscriptions</h2>
            <p>
              Review plans, update subscription status, and manage
              customer billing.
            </p>
          </div>

          <span className="subscriptions-count">
            {totalItems} records
          </span>
        </div>

        <div className="subscriptions-filters">
          <label className="subscriptions-search">
            <Search size={18} />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search customers, emails, or plans..."
              aria-label="Search subscriptions"
            />

            {search && (
              <button
                type="button"
                aria-label="Clear search"
                onClick={() => setSearch("")}
              >
                <X size={15} />
              </button>
            )}
          </label>

          <select
            aria-label="Filter by status"
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
          >
            <option value="">All statuses</option>
            {statusOptions.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>

          <select
            aria-label="Filter by plan"
            value={planFilter}
            onChange={(event) => setPlanFilter(event.target.value)}
          >
            <option value="">All plans</option>
            {planOptions.map((plan) => (
              <option key={plan} value={plan}>
                {plan}
              </option>
            ))}
          </select>

          <select
            aria-label="Filter by billing cycle"
            value={billingFilter}
            onChange={(event) => setBillingFilter(event.target.value)}
          >
            <option value="">All billing cycles</option>
            {billingOptions.map((cycle) => (
              <option key={cycle} value={cycle}>
                {cycle}
              </option>
            ))}
          </select>

          {hasFilters && (
            <button
              type="button"
              className="subscriptions-reset"
              onClick={resetFilters}
            >
              <RefreshCw size={14} />
              Reset
            </button>
          )}
        </div>

        <div className="subscriptions-table-scroll">
          <table className="subscriptions-table">
            <thead>
              <tr>
                <th>Customer</th>
                <th>Plan</th>
                <th>Status</th>
                <th>Billing cycle</th>
                <th>Amount</th>
                <th>Start date</th>
                <th>Change status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {paginatedSubscriptions.map((item) => {
                const statusClass = String(item.status ?? "")
                  .toLowerCase()
                  .replace(/\s+/g, "-");

                const planClass = String(item.plan ?? "")
                  .toLowerCase()
                  .replace(/\s+/g, "-");

                return (
                  <tr key={item.id}>
                    <td>
                      <div className="subscription-customer">
                        <div className="subscription-avatar">
                          {getInitials(item.customer)}
                        </div>
                        <div className="subscription-customer-info">
                          <strong>{item.customer}</strong>
                          <span>{item.email}</span>
                        </div>
                      </div>
                    </td>

                    <td>
                      <span
                        className={`subscription-plan subscription-plan--${planClass}`}
                      >
                        {item.plan}
                      </span>
                    </td>

                    <td>
                      <span
                        className={`subscription-status subscription-status--${statusClass}`}
                      >
                        <span className="subscription-status-dot" />
                        {item.status}
                      </span>
                    </td>

                    <td>
                      <span className="subscription-billing">
                        {item.billing}
                      </span>
                    </td>

                    <td className="subscription-amount">
                      {currency(item.amount)}
                    </td>

                    <td className="subscription-date">
                      {formatDate(item.startDate)}
                    </td>

                    <td>
                      <button
                        type="button"
                        className={`subscription-toggle ${
                          item.status === "Active"
                            ? "subscription-toggle--deactivate"
                            : "subscription-toggle--activate"
                        }`}
                        onClick={() => toggleStatus(item)}
                        title={
                          item.status === "Active"
                            ? "Deactivate subscription"
                            : "Set subscription to Active"
                        }
                      >
                        {item.status === "Active" ? (
                          <>
                            <UserX size={14} />
                            Deactivate
                          </>
                        ) : (
                          <>
                            <CheckCircle size={14} />
                            Activate
                          </>
                        )}
                      </button>
                    </td>

                    <td>
                      <div className="subscription-row-actions">
                        <button
                          type="button"
                          className="subscription-action-btn view"
                          title="View details"
                          aria-label={`View ${item.customer}`}
                          onClick={() => setViewSubscription(item)}
                        >
                          <Eye size={16} />
                        </button>

                        <button
                          type="button"
                          className="subscription-action-btn edit"
                          title="Edit subscription"
                          aria-label={`Edit ${item.customer}`}
                          onClick={() => openEditForm(item)}
                        >
                          <Pencil size={15} />
                        </button>

                        <button
                          type="button"
                          className="subscription-action-btn delete"
                          title="Delete subscription"
                          aria-label={`Delete ${item.customer}`}
                          onClick={() => deleteSubscription(item)}
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {totalItems === 0 && (
          <div className="subscriptions-empty">
            <div className="subscriptions-empty-icon">
              <Search size={24} />
            </div>
            <h3>No subscriptions found</h3>
            <p>
              Try changing your search or filters, or add a new subscription.
            </p>

            {hasFilters && (
              <button
                type="button"
                className="subscriptions-button subscriptions-button--secondary"
                onClick={resetFilters}
              >
                Reset filters
              </button>
            )}
          </div>
        )}

        <div className="subscriptions-pagination">
          <span>
            Showing{" "}
            {totalItems === 0
              ? 0
              : (currentPage - 1) * PAGE_SIZE + 1}
            {"–"}
            {Math.min(currentPage * PAGE_SIZE, totalItems)} of {totalItems}{" "}
            subscriptions
          </span>

          <div className="subscriptions-pagination-controls">
            <button
              type="button"
              aria-label="Previous page"
              disabled={currentPage <= 1}
              onClick={() =>
                setCurrentPage((page) => Math.max(1, page - 1))
              }
            >
              <ChevronLeft size={16} />
            </button>

            {Array.from({ length: totalPages }, (_, index) => index + 1).map(
              (page) => (
                <button
                  type="button"
                  key={page}
                  className={currentPage === page ? "current" : ""}
                  aria-current={currentPage === page ? "page" : undefined}
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </button>
              )
            )}

            <button
              type="button"
              aria-label="Next page"
              disabled={currentPage >= totalPages}
              onClick={() =>
                setCurrentPage((page) =>
                  Math.min(totalPages, page + 1)
                )
              }
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </section>

      {showForm && (
        <div
          className="subscription-modal-backdrop"
          onMouseDown={closeForm}
        >
          <section
            className="subscription-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="subscription-form-title"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <div className="subscription-modal-header">
              <div>
                <span className="subscriptions-eyebrow">
                  SUBSCRIPTION MANAGEMENT
                </span>
                <h2 id="subscription-form-title">
                  {editingSubscription
                    ? "Edit Subscription"
                    : "Add Subscription"}
                </h2>
                <p>
                  {editingSubscription
                    ? "Update customer billing and subscription details."
                    : "Enter the customer and plan details below."}
                </p>
              </div>

              <button
                type="button"
                className="subscription-close"
                onClick={closeForm}
                aria-label="Close form"
              >
                <X size={19} />
              </button>
            </div>

            <form className="subscription-form" onSubmit={handleSubmit}>
              <label>
                Customer name
                <input
                  name="customer"
                  required
                  value={form.customer}
                  onChange={handleFormChange}
                  placeholder="Enter customer name"
                />
              </label>

              <label>
                Email address
                <input
                  name="email"
                  required
                  type="email"
                  value={form.email}
                  onChange={handleFormChange}
                  placeholder="customer@example.com"
                />
              </label>

              <div className="subscription-form-grid">
                <label>
                  Plan
                  <select
                    name="plan"
                    value={form.plan}
                    onChange={handleFormChange}
                  >
                    {planOptions.map((plan) => (
                      <option key={plan} value={plan}>
                        {plan}
                      </option>
                    ))}
                  </select>
                </label>

                <label>
                  Status
                  <select
                    name="status"
                    value={form.status}
                    onChange={handleFormChange}
                  >
                    {statusOptions.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <div className="subscription-form-grid">
                <label>
                  Billing cycle
                  <select
                    name="billing"
                    value={form.billing}
                    onChange={handleFormChange}
                  >
                    {billingOptions.map((cycle) => (
                      <option key={cycle} value={cycle}>
                        {cycle}
                      </option>
                    ))}
                  </select>
                </label>

                <label>
                  Amount (USD)
                  <input
                    name="amount"
                    required
                    type="number"
                    min="0"
                    step="0.01"
                    value={form.amount}
                    onChange={handleFormChange}
                  />
                </label>
              </div>

              <div className="subscription-form-actions">
                <button
                  type="button"
                  className="subscriptions-button subscriptions-button--secondary"
                  onClick={closeForm}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="subscriptions-button subscriptions-button--primary"
                >
                  {editingSubscription ? (
                    <>
                      <CheckCircle size={16} />
                      Save Changes
                    </>
                  ) : (
                    <>
                      <Plus size={16} />
                      Create Subscription
                    </>
                  )}
                </button>
              </div>
            </form>
          </section>
        </div>
      )}

      {viewSubscription && (
        <div
          className="subscription-modal-backdrop"
          onMouseDown={() => setViewSubscription(null)}
        >
          <section
            className="subscription-modal subscription-view-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="subscription-view-title"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <div className="subscription-modal-header">
              <div>
                <span className="subscriptions-eyebrow">
                  SUBSCRIPTION DETAILS
                </span>
                <h2 id="subscription-view-title">
                  {viewSubscription.customer}
                </h2>
                <p>Review the subscription information.</p>
              </div>

              <button
                type="button"
                className="subscription-close"
                aria-label="Close details"
                onClick={() => setViewSubscription(null)}
              >
                <X size={19} />
              </button>
            </div>

            <div className="subscription-detail-list">
              <div>
                <span>Email address</span>
                <strong>{viewSubscription.email}</strong>
              </div>
              <div>
                <span>Plan</span>
                <strong>{viewSubscription.plan}</strong>
              </div>
              <div>
                <span>Status</span>
                <strong>{viewSubscription.status}</strong>
              </div>
              <div>
                <span>Billing cycle</span>
                <strong>{viewSubscription.billing}</strong>
              </div>
              <div>
                <span>Amount</span>
                <strong>{currency(viewSubscription.amount)}</strong>
              </div>
              <div>
                <span>Start date</span>
                <strong>{formatDate(viewSubscription.startDate)}</strong>
              </div>
            </div>

            <div className="subscription-form-actions">
              <button
                type="button"
                className="subscriptions-button subscriptions-button--secondary"
                onClick={() => setViewSubscription(null)}
              >
                Close
              </button>

              <button
                type="button"
                className="subscriptions-button subscriptions-button--primary"
                onClick={() => {
                  const selected = viewSubscription;
                  setViewSubscription(null);
                  openEditForm(selected);
                }}
              >
                <Pencil size={16} />
                Edit Subscription
              </button>
            </div>
          </section>
        </div>
      )}
    </main>
  );
}
