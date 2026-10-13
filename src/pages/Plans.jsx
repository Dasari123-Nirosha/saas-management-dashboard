
import { useEffect, useMemo, useState } from "react";
import {
  Plus,
  Search,
  Download,
  RefreshCw,
  X,
  Check,
  Trash2,
} from "lucide-react";
import Pagination from "../components/common/Pagination";

const STORAGE_KEY = "saasflow-plans";
const PAGE_SIZE = 3;

const initialPlans = [
  {
    id: 1,
    name: "Starter",
    description: "Essential tools for individuals getting started.",
    price: 19,
    billing: "Monthly",
    subscribers: 24,
    features: ["Core features", "Email support", "Basic analytics"],
    status: "Active",
  },
  {
    id: 2,
    name: "Professional",
    description: "Advanced features for growing businesses.",
    price: 49,
    billing: "Monthly",
    subscribers: 38,
    features: [
      "All Starter features",
      "Priority support",
      "Advanced analytics",
    ],
    status: "Active",
  },
  {
    id: 3,
    name: "Enterprise",
    description: "Flexible solutions for larger organizations.",
    price: 499,
    billing: "Yearly",
    subscribers: 12,
    features: [
      "All Professional features",
      "Dedicated support",
      "Custom integrations",
    ],
    status: "Active",
  },
  {
    id: 4,
    name: "Growth",
    description: "More capacity for expanding teams.",
    price: 129,
    billing: "Quarterly",
    subscribers: 16,
    features: [
      "Team collaboration",
      "Usage reports",
      "Priority support",
    ],
    status: "Active",
  },
];

const billingOptions = ["Monthly", "Quarterly", "Yearly"];

const formatCurrency = (amount) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(Number(amount) || 0);

// Load saved plans. If storage is empty or invalid, restore defaults.
function loadPlans() {
  try {
    const savedPlans = localStorage.getItem(STORAGE_KEY);

    if (savedPlans !== null) {
      const parsedPlans = JSON.parse(savedPlans);

      if (Array.isArray(parsedPlans) && parsedPlans.length > 0) {
        return parsedPlans.map((plan) => ({
          ...plan,
          features: Array.isArray(plan.features) ? plan.features : [],
          subscribers: Number(plan.subscribers) || 0,
          status: plan.status || "Active",
        }));
      }
    }
  } catch (error) {
    console.error("Unable to load plans:", error);
  }

  return initialPlans;
}

export default function Plans() {
  const [plans, setPlans] = useState(loadPlans);
  const [search, setSearch] = useState("");
  const [billingFilter, setBillingFilter] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [saveError, setSaveError] = useState("");

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "19",
    billing: "Monthly",
    features: "",
  });

  // Save plans whenever they change.
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(plans));
      setSaveError("");
    } catch (error) {
      console.error("Unable to save plans:", error);
      setSaveError(
        "Unable to save plans. Check your browser's storage settings."
      );
    }
  }, [plans]);

  const filteredPlans = useMemo(() => {
    const term = search.trim().toLowerCase();

    return plans.filter((plan) => {
      const features = Array.isArray(plan.features) ? plan.features : [];

      const matchesSearch = [
        plan.name,
        plan.description,
        plan.billing,
        ...features,
      ]
        .join(" ")
        .toLowerCase()
        .includes(term);

      const matchesBilling =
        !billingFilter || plan.billing === billingFilter;

      return matchesSearch && matchesBilling;
    });
  }, [plans, search, billingFilter]);

  const totalItems = filteredPlans.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / PAGE_SIZE));

  const paginatedPlans = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredPlans.slice(start, start + PAGE_SIZE);
  }, [filteredPlans, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, billingFilter]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const billingCount = new Set(plans.map((plan) => plan.billing)).size;

  function resetForm() {
    setForm({
      name: "",
      description: "",
      price: "19",
      billing: "Monthly",
      features: "",
    });
  }

  function createPlan(event) {
    event.preventDefault();
    setSaveError("");

    const name = form.name.trim();
    const price = Number(form.price);

    if (!name) {
      setSaveError("Please enter a plan name.");
      return;
    }

    if (!Number.isFinite(price) || price < 0) {
      setSaveError("Please enter a valid price.");
      return;
    }

    const duplicate = plans.some(
      (plan) => plan.name.toLowerCase() === name.toLowerCase()
    );

    if (duplicate) {
      setSaveError("A plan with this name already exists.");
      return;
    }

    const newPlan = {
      id: Date.now(),
      name,
      description: form.description.trim(),
      price,
      billing: form.billing,
      subscribers: 0,
      features: form.features
        .split("\n")
        .map((feature) => feature.trim())
        .filter(Boolean),
      status: "Active",
    };

    setPlans((currentPlans) => [newPlan, ...currentPlans]);
    setCurrentPage(1);
    resetForm();
    setShowForm(false);
  }

  function deletePlan(id) {
    const plan = plans.find((item) => item.id === id);
    if (!plan) return;

    const confirmed = window.confirm(
      `Delete the "${plan.name}" plan?`
    );

    if (confirmed) {
      setPlans((currentPlans) =>
        currentPlans.filter((item) => item.id !== id)
      );
    }
  }

  function exportCSV() {
    const rows = [
      [
        "Plan",
        "Description",
        "Price",
        "Billing Cycle",
        "Subscribers",
        "Features",
        "Status",
      ],
      ...filteredPlans.map((plan) => [
        plan.name,
        plan.description,
        plan.price,
        plan.billing,
        plan.subscribers ?? 0,
        (plan.features || []).join("; "),
        plan.status,
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
    link.download = "plans.csv";
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  }

  function resetFilters() {
    setSearch("");
    setBillingFilter("");
    setCurrentPage(1);
  }

  function restoreDefaultPlans() {
    const confirmed = window.confirm(
      "Restore the four sample plans? This will replace the current plans."
    );

    if (confirmed) {
      setPlans(initialPlans);
      setCurrentPage(1);
      setSearch("");
      setBillingFilter("");
      setSaveError("");
    }
  }

  return (
    <main className="page-content plans-page">
      <header className="plans-heading">
        <div>
          <h1>Plans &amp; Pricing</h1>
          <p>
            Create and manage pricing plans for your SaaS customers.
          </p>
        </div>

        <div className="plans-actions">
          <button
            type="button"
            className="plans-button plans-button--secondary"
            onClick={exportCSV}
          >
            <Download size={16} />
            Export CSV
          </button>

          <button
            type="button"
            className="plans-button plans-button--primary"
            onClick={() => {
              setSaveError("");
              setShowForm(true);
            }}
          >
            <Plus size={17} />
            Create Plan
          </button>
        </div>
      </header>

      {saveError && (
        <div className="plans-error" role="alert">
          {saveError}
        </div>
      )}

      <section className="plans-stats">
        <article className="plans-stat">
          <span>Total plans</span>
          <strong>{plans.length}</strong>
          <small>Available pricing plans</small>
        </article>

        <article className="plans-stat">
          <span>Matching plans</span>
          <strong>{filteredPlans.length}</strong>
          <small>Based on current filters</small>
        </article>

        <article className="plans-stat">
          <span>Billing options</span>
          <strong>{billingCount}</strong>
          <small>Monthly, yearly or quarterly</small>
        </article>
      </section>

      {showForm && (
        <div
          className="plans-modal-backdrop"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setShowForm(false);
            }
          }}
        >
          <section
            className="plans-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="create-plan-title"
          >
            <header className="plans-modal__header">
              <div>
                <h2 id="create-plan-title">Create Plan</h2>
                <p>Add a new pricing option for your customers.</p>
              </div>

              <button
                type="button"
                className="plans-close"
                aria-label="Close"
                onClick={() => setShowForm(false)}
              >
                <X size={20} />
              </button>
            </header>

            <form className="plans-form" onSubmit={createPlan}>
              <label>
                Plan name
                <input
                  required
                  maxLength={60}
                  value={form.name}
                  placeholder="e.g. Business Plus"
                  onChange={(event) =>
                    setForm({ ...form, name: event.target.value })
                  }
                />
              </label>

              <label>
                Description
                <input
                  maxLength={180}
                  value={form.description}
                  placeholder="Describe the plan"
                  onChange={(event) =>
                    setForm({
                      ...form,
                      description: event.target.value,
                    })
                  }
                />
              </label>

              <div className="plans-form__row">
                <label>
                  Price (USD)
                  <input
                    required
                    type="number"
                    min="0"
                    step="0.01"
                    value={form.price}
                    onChange={(event) =>
                      setForm({ ...form, price: event.target.value })
                    }
                  />
                </label>

                <label>
                  Billing cycle
                  <select
                    value={form.billing}
                    onChange={(event) =>
                      setForm({ ...form, billing: event.target.value })
                    }
                  >
                    {billingOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <label>
                Features (one per line)
                <textarea
                  rows={4}
                  value={form.features}
                  placeholder={"Email support\nAdvanced analytics\nTeam access"}
                  onChange={(event) =>
                    setForm({ ...form, features: event.target.value })
                  }
                />
              </label>

              <footer className="plans-form__actions">
                <button
                  type="button"
                  className="plans-button plans-button--secondary"
                  onClick={() => {
                    setShowForm(false);
                    resetForm();
                  }}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="plans-button plans-button--primary"
                >
                  <Plus size={16} />
                  Create Plan
                </button>
              </footer>
            </form>
          </section>
        </div>
      )}

      <section className="plans-results">
        <div className="plans-filters">
          <label className="plans-search">
            <Search size={18} />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search plans..."
              aria-label="Search plans"
            />
          </label>

          <select
            aria-label="Filter by billing cycle"
            value={billingFilter}
            onChange={(event) => setBillingFilter(event.target.value)}
          >
            <option value="">All billing cycles</option>
            {billingOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>

          <button
            type="button"
            className="plans-reset"
            onClick={resetFilters}
          >
            <RefreshCw size={15} />
            Reset filters
          </button>
        </div>

        {filteredPlans.length > 0 ? (
          <div className="plans-grid">
            {paginatedPlans.map((plan) => (
              <article className="plan-card" key={plan.id}>
                <div className="plan-card__top">
                  <span className="plan-card__badge">
                    {plan.status || "Active"}
                  </span>
                  <span className="plan-card__billing">
                    {plan.billing}
                  </span>
                </div>

                <h2>{plan.name}</h2>

                <p className="plan-card__description">
                  {plan.description ||
                    "A flexible plan for your business."}
                </p>

                <div className="plan-card__price">
                  <strong>{formatCurrency(plan.price)}</strong>
                  <span>
                    /{" "}
                    {plan.billing === "Monthly"
                      ? "month"
                      : plan.billing === "Quarterly"
                        ? "quarter"
                        : "year"}
                  </span>
                </div>

                <div className="plan-card__subscribers">
                  {plan.subscribers ?? 0} subscribers
                </div>

                <div className="plan-card__divider" />

                <h3>Plan features</h3>

                {plan.features.length > 0 ? (
                  <ul className="plan-card__features">
                    {plan.features.map((feature, index) => (
                      <li key={`${plan.id}-${index}`}>
                        <Check size={16} />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="plan-card__description">
                    No features added yet.
                  </p>
                )}

                <button
                  type="button"
                  className="plans-button plans-button--secondary"
                  onClick={() => deletePlan(plan.id)}
                >
                  <Trash2 size={15} />
                  Delete plan
                </button>
              </article>
            ))}
          </div>
        ) : (
          <div className="plans-empty">
            <div className="plans-empty__icon">
              <Search size={24} />
            </div>
            <h3>No plans found</h3>
            <p>
              Try changing your search or billing filter, or create a plan.
            </p>
          </div>
        )}

        {totalItems > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={totalItems}
            pageSize={PAGE_SIZE}
            onPageChange={setCurrentPage}
          />
        )}

        <button
          type="button"
          className="plans-reset"
          onClick={restoreDefaultPlans}
        >
          <RefreshCw size={15} />
          Restore sample plans
        </button>
      </section>
    </main>
  );
}
