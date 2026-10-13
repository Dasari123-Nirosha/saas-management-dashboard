
import {
  Users,
  Mail,
  Building2,
  CalendarDays,
  CreditCard,
  IndianRupee,
  Pencil,
  X,
} from "lucide-react";

import StatusBadge from "../common/StatusBadge";
import Button from "../common/Button";

function CustomerDetails({ customer, onEdit, onClose }) {
  if (!customer) {
    return (
      <div className="customer-details__empty">
        <Users size={32} />
        <h3>No customer selected</h3>
        <p>Select a customer to view their information.</p>
      </div>
    );
  }

  const name =
    customer.name ||
    customer.customerName ||
    customer.companyName ||
    "Unknown Customer";

  const email =
    customer.email ||
    customer.customerEmail ||
    "Not provided";

  const company =
    customer.company ||
    customer.companyName ||
    "Individual";

  const subscriptionCount =
    customer.subscriptionCount ??
    customer.subscriptionsCount ??
    (Array.isArray(customer.subscriptions)
      ? customer.subscriptions.length
      : 0);

  const totalSpent = Number(
    customer.totalSpent ??
      customer.totalRevenue ??
      customer.amount ??
      0
  );

  const currency = customer.currency || "USD";

  const formattedSpent = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(Number.isFinite(totalSpent) ? totalSpent : 0);

  const joinedDate =
    customer.createdAt || customer.joinedAt;

  const formattedDate = joinedDate
    ? (() => {
        const date = new Date(joinedDate);

        return Number.isNaN(date.getTime())
          ? joinedDate
          : date.toLocaleDateString("en-IN", {
              day: "2-digit",
              month: "long",
              year: "numeric",
            });
      })()
    : "Not available";

  const initials = name
    .trim()
    .split(/\s+/)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const details = [
    {
      label: "Email Address",
      value: email,
      icon: Mail,
    },
    {
      label: "Company",
      value: company,
      icon: Building2,
    },
    {
      label: "Subscriptions",
      value: String(subscriptionCount),
      icon: CreditCard,
    },
    {
      label: "Total Spent",
      value: formattedSpent,
      icon: IndianRupee,
    },
    {
      label: "Customer Since",
      value: formattedDate,
      icon: CalendarDays,
    },
  ];

  return (
    <section className="customer-details">
      <div className="customer-details__header">
        <div>
          <h3 className="customer-details__heading">
            Customer Details
          </h3>
          <p className="customer-details__subtitle">
            Customer profile and account overview
          </p>
        </div>

        {onClose && (
          <button
            type="button"
            className="customer-details__close"
            onClick={onClose}
            aria-label="Close customer details"
          >
            <X size={19} />
          </button>
        )}
      </div>

      <div className="customer-details__profile">
        <div className="customer-details__avatar">
          {initials}
        </div>

        <div className="customer-details__identity">
          <h2>{name}</h2>
          <p>{email}</p>

          <div className="customer-details__status">
            <StatusBadge status={customer.status || "active"} />
          </div>
        </div>
      </div>

      <div className="customer-details__section">
        <h4>Account Information</h4>

        <div className="customer-details__grid">
          {details.map((detail) => {
            const DetailIcon = detail.icon;

            return (
              <div
                className="customer-details__item"
                key={detail.label}
              >
                <div className="customer-details__item-icon">
                  <DetailIcon size={18} />
                </div>

                <div className="customer-details__item-content">
                  <span>{detail.label}</span>
                  <strong>{detail.value}</strong>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {Array.isArray(customer.subscriptions) &&
        customer.subscriptions.length > 0 && (
          <div className="customer-details__section">
            <h4>Subscriptions</h4>

            <div className="customer-details__subscriptions">
              {customer.subscriptions.map((subscription, index) => (
                <div
                  className="customer-details__subscription"
                  key={
                    subscription.id ??
                    subscription.subscriptionId ??
                    index
                  }
                >
                  <div>
                    <strong>
                      {subscription.name ||
                        subscription.planName ||
                        subscription.plan ||
                        "Subscription"}
                    </strong>

                    <span>
                      {subscription.billingCycle ||
                        subscription.interval ||
                        "Monthly billing"}
                    </span>
                  </div>

                  <StatusBadge
                    status={subscription.status || "active"}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

      {onEdit && (
        <div className="customer-details__footer">
          <Button
            variant="primary"
            icon={<Pencil size={16} />}
            onClick={() => onEdit(customer)}
          >
            Edit Customer
          </Button>
        </div>
      )}
    </section>
  );
}

export default CustomerDetails;