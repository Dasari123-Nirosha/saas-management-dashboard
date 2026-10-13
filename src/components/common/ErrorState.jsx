
import { AlertCircle, RefreshCw } from "lucide-react";
import Button from "./Button";

function ErrorState({
  title = "Something went wrong",
  message = "We couldn't load the data. Please try again.",
  onRetry,
  retryText = "Try again",
  className = "",
}) {
  return (
    <div
      className={`error-state ${className}`.trim()}
      role="alert"
    >
      <div className="error-state__icon">
        <AlertCircle size={34} />
      </div>

      <h3 className="error-state__title">{title}</h3>

      <p className="error-state__message">{message}</p>

      {onRetry && (
        <Button
          variant="primary"
          onClick={onRetry}
          icon={<RefreshCw size={16} />}
        >
          {retryText}
        </Button>
      )}
    </div>
  );
}

export default ErrorState;