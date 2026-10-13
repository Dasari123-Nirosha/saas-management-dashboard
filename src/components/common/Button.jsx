
import { LoaderCircle } from "lucide-react";

function Button({
  children,
  variant = "primary",
  size = "md",
  icon,
  loading = false,
  disabled = false,
  type = "button",
  className = "",
  onClick,
  ...props
}) {
  const buttonClass = [
    "btn",
    `btn--${variant}`,
    `btn--${size}`,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      type={type}
      className={buttonClass}
      onClick={onClick}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <LoaderCircle className="btn__spinner" size={18} />
      ) : icon ? (
        <span className="btn__icon">{icon}</span>
      ) : null}

      <span className="btn__label">{children}</span>
    </button>
  );
}

export default Button;
