
import {
  Pencil,
  Trash2,
  Eye,
  Layers,
} from "lucide-react";

import Table from "../common/Table";
import StatusBadge from "../common/StatusBadge";

function PlanTable({
  plans = [],
  onView,
  onEdit,
  onDelete,
  loading = false,
}) {
  const columns = [
    {
      key: "name",
      label: "PLAN",
      render: (_, plan) => (
        <div className="plan-table__identity">
          <div className="plan-table__icon">
            <Layers size={18} />
          </div>

          <div className="plan-table__details">
            <span className="plan-table__name">
              {plan.name || plan.planName || "Unnamed Plan"}
            </span>

            <span className="plan-table__description">
              {plan.description || "Subscription plan"}
            </span>
          </div>
        </div>
      ),
    },
    {
      key: "price",
      label: "PRICE",
      render: (_, plan) => {
        const amount = Number(plan.price ?? plan.amount ?? 0);
        const currency = plan.currency || "USD";

        const formattedPrice = new Intl.NumberFormat("en-US", {
          style: "currency",
          currency,
          maximumFractionDigits: 2,
        }).format(Number.isFinite(amount) ? amount : 0);

        return (
          <div className="plan-table__price">
            <strong>{formattedPrice}</strong>
            <span> / {plan.billingCycle || plan.interval || "month"}</span>
          </div>
        );
      },
    },
    {
      key: "features",
      label: "FEATURES",
      render: (value, plan) => {
        const features = Array.isArray(value)
          ? value
          : Array.isArray(plan.features)
            ? plan.features
            : [];

        return (
          <span className="plan-table__features">
            {features.length
              ? `${features.length} features`
              : "Not specified"}
          </span>
        );
      },
    },
    {
      key: "userLimit",
      label: "USER LIMIT",
      render: (value) =>
        value === undefined || value === null || value === ""
          ? "Unlimited"
          : value,
    },
    {
      key: "status",
      label: "STATUS",
      render: (value) => (
        <StatusBadge status={value || "active"} />
      ),
    },
    {
      key: "actions",
      label: "ACTIONS",
      render: (_, plan) => (
        <div className="plan-table__actions">
          {onView && (
            <button
              type="button"
              className="plan-table__action"
              title="View plan"
              aria-label="View plan"
              onClick={(event) => {
                event.stopPropagation();
                onView(plan);
              }}
            >
              <Eye size={16} />
            </button>
          )}

          {onEdit && (
            <button
              type="button"
              className="plan-table__action"
              title="Edit plan"
              aria-label="Edit plan"
              onClick={(event) => {
                event.stopPropagation();
                onEdit(plan);
              }}
            >
              <Pencil size={16} />
            </button>
          )}

          {onDelete && (
            <button
              type="button"
              className="plan-table__action plan-table__action--danger"
              title="Delete plan"
              aria-label="Delete plan"
              onClick={(event) => {
                event.stopPropagation();
                onDelete(plan);
              }}
            >
              <Trash2 size={16} />
            </button>
          )}
        </div>
      ),
    },
  ];

  if (loading) {
    return (
      <div className="plan-table__message">
        Loading plans...
      </div>
    );
  }

  if (plans.length === 0) {
    return (
      <div className="plan-table__empty">
        <Layers size={32} />
        <h3>No plans found</h3>
        <p>Create a subscription plan to see it listed here.</p>
      </div>
    );
  }

  return (
    <div className="plan-table">
      <Table
        columns={columns}
        data={plans}
        rowKey={(plan) => plan.id ?? plan.planId ?? plan.name}
        emptyMessage="No plans found"
        className="plan-table__data"
      />
    </div>
  );
}

export default PlanTable;