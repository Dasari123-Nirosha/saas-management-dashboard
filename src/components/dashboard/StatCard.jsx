import {
  Users,
  CreditCard,
  DollarSign,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";

const iconMap = {
  users: Users,
  subscriptions: CreditCard,
  revenue: DollarSign,
  growth: TrendingUp,
};

function StatCard({
  title,
  value,
  change,
  changeType = "positive",
  description,
  icon,
  iconType,
  className = "",
}) {
  const IconComponent =
    typeof icon === "string"
      ? iconMap[icon] || TrendingUp
      : icon || TrendingUp;

  const isPositive = changeType === "positive";
  const ChangeIcon = isPositive ? ArrowUpRight : ArrowDownRight;

  return (
    <div className={`stat-card ${className}`.trim()}>
      <div className="stat-card__top">
        <div className="stat-card__heading">
          <p className="stat-card__title">{title}</p>

          <div className="stat-card__value">
            {value ?? "—"}
          </div>
        </div>

        <div
          className={`stat-card__icon ${
            iconType ? `stat-card__icon--${iconType}` : ""
          }`}
        >
          <IconComponent size={22} strokeWidth={2} />
        </div>
      </div>

      {(change !== undefined || description) && (
        <div className="stat-card__bottom">
          {change !== undefined && change !== null && (
            <span
              className={`stat-card__change ${
                isPositive
                  ? "stat-card__change--positive"
                  : "stat-card__change--negative"
              }`}
            >
              <ChangeIcon size={15} />
              {change}
            </span>
          )}

          {description && (
            <span className="stat-card__description">
              {description}
            </span>
          )}
        </div>
      )}
    </div>
  );
}

export default StatCard;