
import {
  Eye,
  Pencil,
  Trash2,
  Users,
  Mail,
  Building2,
} from "lucide-react";

import Table from "../common/Table";
import StatusBadge from "../common/StatusBadge";

function CustomerTable({
  customers = [],
  onView,
  onEdit,
  onDelete,
  loading = false,
}) {
  const columns = [
    {
      key: "customer",
      label: "CUSTOMER",
      render: (_, customer) => {
        const name =
          customer.name ||
          customer.customerName ||
          customer.companyName ||
          "Unknown Customer";

        const initials = name
          .trim()
          .split(/\s+/)
          .map((part) => part[0])
          .join("")
          .slice(0, 2)
          .toUpperCase();

        return (
          <div className="customer-table__profile">
            <div className="customer-table__avatar">
              {initials}
            </div>

            <div className="customer-table__identity">
              <span className="customer-table__name">
                {name}
              </span>

              <span className="customer-table__email">
                <Mail size={13} />
                {customer.email || customer.customerEmail || "No email"}
              </span>
            </div>
          </div>
        );
      },
    },
    {
      key: "company",
      label: "COMPANY",
      render: (_, customer) => (
        <div className="customer-table__company">
          <Building2 size={15} />
          <span>
            {customer.company ||
              customer.companyName ||
              "Individual"}
          </span>
        </div>
      ),
    },
    {
      key: "subscriptions",
      label: "SUBSCRIPTIONS",
      render: (_, customer) => {
        const count =
          customer.subscriptionCount ??
          customer.subscriptionsCount ??
          (Array.isArray(customer.subscriptions)
            ? customer.subscriptions.length
            : 0);

        return (
          <span className="customer-table__count">
            {count}
          </span>
        );
      },
    },
    {
      key: "totalSpent",
      label: "TOTAL SPENT",
      render: (_, customer) => {
        const amount = Number(
          customer.totalSpent ??
            customer.totalRevenue ??
            customer.amount ??
            0
        );

        const currency = customer.currency || "USD";

        return new Intl.NumberFormat("en-US", {
          style: "currency",
          currency,
          maximumFractionDigits: 2,
        }).format(Number.isFinite(amount) ? amount : 0);
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
      key: "createdAt",
      label: "JOINED",
      render: (value, customer) => {
        const dateValue = value || customer.joinedAt;

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
      key: "actions",
      label: "ACTIONS",
      render: (_, customer) => (
        <div className="customer-table__actions">
          {onView && (
            <button
              type="button"
              className="customer-table__action"
              title="View customer"
              aria-label="View customer"
              onClick={(event) => {
                event.stopPropagation();
                onView(customer);
              }}
            >
              <Eye size={16} />
            </button>
          )}

          {onEdit && (
            <button
              type="button"
              className="customer-table__action"
              title="Edit customer"
              aria-label="Edit customer"
              onClick={(event) => {
                event.stopPropagation();
                onEdit(customer);
              }}
            >
              <Pencil size={16} />
            </button>
          )}

          {onDelete && (
            <button
              type="button"
              className="customer-table__action customer-table__action--danger"
              title="Delete customer"
              aria-label="Delete customer"
              onClick={(event) => {
                event.stopPropagation();
                onDelete(customer);
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
      <div className="customer-table__message">
        Loading customers...
      </div>
    );
  }

  if (customers.length === 0) {
    return (
      <div className="customer-table__empty">
        <Users size={32} />
        <h3>No customers found</h3>
        <p>
          Customer records will appear here when available.
        </p>
      </div>
    );
  }

  return (
    <div className="customer-table">
      <Table
        columns={columns}
        data={customers}
        rowKey={(customer) =>
          customer.id ??
          customer.customerId ??
          customer.email ??
          customer.customerEmail
        }
        emptyMessage="No customers found"
        className="customer-table__data"
      />
    </div>
  );
}

export default CustomerTable;