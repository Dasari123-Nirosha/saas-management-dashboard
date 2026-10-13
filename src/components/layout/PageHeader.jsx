import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";

function PageHeader({
  title,
  description,
  breadcrumbs = [],
  actions,
  badge,
  className = "",
}) {
  return (
    <div className={`page-header ${className}`.trim()}>
      <div className="page-header__main">
        {breadcrumbs.length > 0 && (
          <nav
            className="page-header__breadcrumbs"
            aria-label="Breadcrumb"
          >
            {breadcrumbs.map((item, index) => {
              const isObject =
                typeof item === "object" && item !== null;

              const label = isObject ? item.label : item;
              const href = isObject ? item.href : undefined;
              const isCurrent =
                index === breadcrumbs.length - 1;

              return (
                <span
                  className="page-header__breadcrumb-item"
                  key={`${label}-${index}`}
                >
                  {index > 0 && (
                    <ArrowUpRight
                      size={13}
                      className="page-header__breadcrumb-separator"
                    />
                  )}

                  {href && !isCurrent ? (
                    <Link
                      to={href}
                      className="page-header__breadcrumb-link"
                    >
                      {label}
                    </Link>
                  ) : (
                    <span
                      className={
                        isCurrent
                          ? "page-header__breadcrumb-current"
                          : ""
                      }
                      aria-current={
                        isCurrent ? "page" : undefined
                      }
                    >
                      {label}
                    </span>
                  )}
                </span>
              );
            })}
          </nav>
        )}

        <div className="page-header__title-row">
          <h1 className="page-header__title">{title}</h1>

          {badge && (
            <span className="page-header__badge">
              {badge}
            </span>
          )}
        </div>

        {description && (
          <p className="page-header__description">
            {description}
          </p>
        )}
      </div>

      {actions && (
        <div className="page-header__actions">
          {actions}
        </div>
      )}
    </div>
  );
}

export default PageHeader;