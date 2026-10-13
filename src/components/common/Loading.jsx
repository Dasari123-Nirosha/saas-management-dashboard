
import { LoaderCircle } from "lucide-react";

function Loading({
  message = "Loading...",
  size = "medium",
  fullScreen = false,
  className = "",
}) {
  return (
    <div
      className={`loading ${fullScreen ? "loading--fullscreen" : ""} ${className}`.trim()}
      role="status"
      aria-live="polite"
    >
      <LoaderCircle
        className="loading__spinner"
        size={size === "small" ? 20 : size === "large" ? 40 : 30}
        aria-hidden="true"
      />

      {message && (
        <p className="loading__message">{message}</p>
      )}

      <span className="sr-only">Please wait</span>
    </div>
  );
}

export default Loading;