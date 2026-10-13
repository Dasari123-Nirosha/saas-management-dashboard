
import {
  Check,
  Pencil,
  Trash2,
  Star,
} from "lucide-react";

import Button from "../common/Button";

function PlanCard({
  plan,
  onEdit,
  onDelete,
  onSelect,
  featured = false,
}) {
  if (!plan) return null;

  const name = plan.name || plan.planName || "Subscription Plan";
  const price = Number(plan.price ?? plan.amount ?? 0);
  const currency = plan.currency || "USD";
  const billingCycle = plan.billingCycle || plan.interval || "month";

  const formattedPrice = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(Number.isFinite(price) ? price : 0);

  const features = Array.isArray(plan.features)
    ? plan.features
    : [];

  const limits = plan.userLimit
    ? `${plan.userLimit} users`
    : null;

  return (
    <article
      className={`plan-card${featured ? " plan-card--featured" : ""}`}
    >
      {featured && (
        <div className="plan-card__featured-label">
          <Star size={14} fill="currentColor" />
          Most Popular
        </div>
      )}

      <div className="plan-card__header">
        <div className="plan-card__name-wrap">
          <h3 className="plan-card__name">{name}</h3>

          {plan.description && (
            <p className="plan-card__description">
              {plan.description}
            </p>
          )}
        </div>

        {plan.status && (
          <span
            className={`plan-card__status plan-card__status--${String(
              plan.status
            ).toLowerCase()}`}
          >
            {plan.status}
          </span>
        )}
      </div>

      <div className="plan-card__pricing">
        <span className="plan-card__price">
          {formattedPrice}
        </span>
        <span className="plan-card__billing">
          / {billingCycle}
        </span>
      </div>

      {limits && (
        <p className="plan-card__limit">{limits}</p>
      )}

      <div className="plan-card__divider" />

      <div className="plan-card__features">
        <h4>What's included</h4>

        {features.length > 0 ? (
          <ul>
            {features.map((feature, index) => (
              <li key={`${feature}-${index}`}>
                <span className="plan-card__check">
                  <Check size={14} />
                </span>
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="plan-card__no-features">
            Features have not been added yet.
          </p>
        )}
      </div>

      <div className="plan-card__actions">
        {onSelect && (
          <Button
            variant="primary"
            onClick={() => onSelect(plan)}
          >
            Choose Plan
          </Button>
        )}

        {onEdit && (
          <Button
            variant="secondary"
            icon={<Pencil size={15} />}
            onClick={() => onEdit(plan)}
          >
            Edit
          </Button>
        )}

        {onDelete && (
          <Button
            variant="danger"
            icon={<Trash2 size={15} />}
            onClick={() => onDelete(plan)}
          >
            Delete
          </Button>
        )}
      </div>
    </article>
  );
}

export default PlanCard;