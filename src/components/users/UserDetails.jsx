
import {
  UserRound,
  Mail,
  ShieldCheck,
  CreditCard,
  CalendarDays,
  CircleCheck,
  X,
  Pencil,
} from "lucide-react";

import StatusBadge from "../common/StatusBadge";
import Button from "../common/Button";

function UserDetails({
  user,
  onEdit,
  onClose,
}) {
  if (!user) {
    return (
      <div className="user-details__empty">
        <UserRound size={32} />
        <h3>No user selected</h3>
        <p>Select a user to view their details.</p>
      </div>
    );
  }

  const joinedDate = user.createdAt || user.joinedAt;

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

  const details = [
    {
      label: "Email Address",
      value: user.email || "Not provided",
      icon: Mail,
    },
    {
      label: "Account Role",
      value: user.role || "User",
      icon: ShieldCheck,
    },
    {
      label: "Subscription Plan",
      value: user.plan || user.planName || "Free",
      icon: CreditCard,
    },
    {
      label: "Member Since",
      value: formattedDate,
      icon: CalendarDays,
    },
  ];

  const initials = (user.name || "User")
    .trim()
    .split(/\s+/)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <section className="user-details">
      <div className="user-details__header">
        <div>
          <h3 className="user-details__heading">
            User Details
          </h3>
          <p className="user-details__subtitle">
            Account information and subscription overview
          </p>
        </div>

        {onClose && (
          <button
            type="button"
            className="user-details__close"
            onClick={onClose}
            aria-label="Close user details"
          >
            <X size={19} />
          </button>
        )}
      </div>

      <div className="user-details__profile">
        <div className="user-details__avatar">
          {initials}
        </div>

        <div className="user-details__identity">
          <h2>{user.name || "Unknown User"}</h2>
          <p>{user.email || "No email address"}</p>
          <div className="user-details__status">
            <StatusBadge status={user.status || "active"} />
          </div>
        </div>
      </div>

      <div className="user-details__section">
        <h4>Account Information</h4>

        <div className="user-details__grid">
          {details.map((detail) => {
            const DetailIcon = detail.icon;

            return (
              <div
                className="user-details__item"
                key={detail.label}
              >
                <div className="user-details__item-icon">
                  <DetailIcon size={18} />
                </div>

                <div className="user-details__item-content">
                  <span>{detail.label}</span>
                  <strong>{detail.value}</strong>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="user-details__footer">
        <div className="user-details__verified">
          <CircleCheck size={17} />
          <span>User record available</span>
        </div>

        {onEdit && (
          <Button
            variant="primary"
            icon={<Pencil size={16} />}
            onClick={() => onEdit(user)}
          >
            Edit User
          </Button>
        )}
      </div>
    </section>
  );
}

export default UserDetails;