
import {
  Eye,
  Pencil,
  Trash2,
  CreditCard,
} from "lucide-react";

import Table from "../common/Table";
import StatusBadge from "../common/StatusBadge";

function SubscriptionTable({
  subscriptions = [],
  onView,
  onEdit,
  onDelete,
  loading = false,
}) {
  const columns = [
    {
      key: "subscription",
      label: "SUBSCRIPTION",
      render: (_, subscription) => (
        <div className="subscription-table__identity">
          <div className="subscription-table__icon">
            <CreditCard size={18} />
          </div>

          <div className="subscription-table__details">
            <span className="subscription-table__name">
              {subscription.name ||
                subscription.planName ||
                subscription.plan ||
                "Subscription"}
            </span>

            <span className="subscription-table__id">
              {subscription.id
                ? `ID: ${subscription.id}`
                : subscription.subscriptionId
                  ? `ID: ${subscription.subscriptionId}`
                  : "No ID"}
            </span>
          </div>
        </div>
      ),
    },
    {
      key: "customerName",
      label: "CUSTOMER",
      render: (_, subscription) => (
        <div className="subscription-table__customer">
          <span>
            {subscription.customerName ||
              subscription.userName ||
              subscription.customer ||
              "Unknown customer"}
          </span>

          {subscription.customerEmail && (
            <small>{subscription.customerEmail}</small>
          )}
        </div>
      ),
    },
    {
      key: "price",
      label: "PRICE",
      render: (_, subscription) => {
        const amount =
          subscription.price ??
          subscription.amount ??
          subscription.monthlyPrice;

        if (amount === undefined || amount === null) {
          return "—";
        }

        const formattedAmount = new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: subscription.currency || "USD",
          maximumFractionDigits: 2,
        }).format(Number(amount));

        return (
          <div className="subscription-table__price">
            <strong>{formattedAmount}</strong>
            <span>
              /{subscription.billingCycle || subscription.interval || "month"}
            </span>
          </div>
        );
      },
    },
    {
      key: "startDate",
      label: "START DATE",
      render: (value, subscription) => {
        const dateValue =
          value || subscription.createdAt || subscription.startDate;

        if (!dateValue) return "—";

        const date = new Date(dateValue);

        return Number.isNaN(date.getTime())
          ? dateValue
          : date.toLocaleDateString("en-IN", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            });
      },
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
      render: (_, subscription) => (
        <div className="subscription-table__actions">
          {onView && (
            <button
              type="button"
              className="subscription-table__action"
              title="View subscription"
              aria-label="View subscription"
              onClick={(event) => {
                event.stopPropagation();
                onView(subscription);
              }}
            >
              <Eye size={16} />
            </button>
          )}

          {onEdit && (
            <button
              type="button"
              className="subscription-table__action"
              title="Edit subscription"
              aria-label="Edit subscription"
              onClick={(event) => {
                event.stopPropagation();
                onEdit(subscription);
              }}
            >
              <Pencil size={16} />
            </button>
          )}

          {onDelete && (
            <button
              type="button"
              className="subscription-table__action subscription-table__action--danger"
              title="Delete subscription"
              aria-label="Delete subscription"
              onClick={(event) => {
                event.stopPropagation();
                onDelete(subscription);
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
      <div className="subscription-table__message">
        Loading subscriptions...
      </div>
    );
  }

  if (subscriptions.length === 0) {
    return (
      <div className="subscription-table__empty">
        <CreditCard size={32} />
        <h3>No subscriptions found</h3>
        <p>
          Subscription records will appear here when available.
        </p>
      </div>
    );
  }

  return (
    <div className="subscription-table">
      <Table
        columns={columns}
        data={subscriptions}
        rowKey={(subscription) =>
          subscription.id ??
          subscription.subscriptionId ??
          subscription.customerEmail
        }
        emptyMessage="No subscriptions found"
        className="subscription-table__data"
      />
    </div>
  );
}

export default SubscriptionTable;